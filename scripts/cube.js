import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js'

function main() {
	const size = 10
	const indent = 0.1
	const inner = '#616161'
	const red = '#d50000'
	const white = '#f5f5f5'
	const green = '#00c853'
	const orange = '#ff6d00'
	const yellow = '#ffd600'
	const blue = '#2962ff'
	//
	const canvas = document.querySelector('#canvas')
	const renderer = new THREE.WebGLRenderer({ antialias: true, canvas })
	renderer.shadowMap.enabled = true
	renderer.setClearColor(0x212121)
	const scene = new THREE.Scene()
	const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000)
	camera.position.set(30, 30, 70)
	camera.lookAt(0, 0, 0)
	const controls = new OrbitControls(camera, canvas)
	controls.target.set(0, 0, 0)
	controls.update()
	//свет
	const lightColor = 0xFFFFFF
	const lightIntensity = 5
	const light = new THREE.DirectionalLight(lightColor, lightIntensity)
	light.position.set(0, 0, size * 2)
	light.target.position.set(0, 0, 0)
	scene.add(light)
	scene.add(light.target)
	{
		const color = 0xFFFFFF
		const intensity = 2
		const light = new THREE.AmbientLight(color, intensity)
		scene.add(light)
	}
	//весть куб
	const cube = new THREE.Object3D()
	scene.add(cube)
	//детали
	const details = {}

	function genDetail(sides) {
		const detail = new THREE.Object3D()
		cube.add(detail)
		details[sides] = detail

		const material = THREE.MeshPhongMaterial
		const parameters = { color: inner, roughness: 1, shininess: 3 }
		const geometry = new RoundedBoxGeometry(size, size, size, 6, 1)
		const materials = [new material(parameters), new material(parameters), new material(parameters), new material(parameters), new material(parameters), new material(parameters)]
		const mesh = new THREE.Mesh(geometry, materials)
		detail.add(mesh)

		let x = 0, y = 0, z = 0
		if (sides.includes('R')) {
			x = size + indent
			materials[0].color = new THREE.Color(red)
		}
		if (sides.includes('L')) {
			x = -size - indent
			materials[1].color = new THREE.Color(orange)
		}
		if (sides.includes('U')) {
			y = size + indent
			materials[2].color = new THREE.Color(white)
		}
		if (sides.includes('D')) {
			y = -size - indent
			materials[3].color = new THREE.Color(yellow)
		}
		if (sides.includes('F')) {
			z = size + indent
			materials[4].color = new THREE.Color(green)
		}
		if (sides.includes('B')) {
			z = -size - indent
			materials[5].color = new THREE.Color(blue)
		}
		mesh.position.set(x, y, z)
	}
	['RUF', 'LUF', 'RDF', 'LDF', 'RUB', 'LUB', 'RDB', 'LDB',
		'UF', 'UB', 'UR', 'UL', 'DF', 'DB', 'DR', 'DL', 'RF', 'LF', 'RB', 'LB',
		'U', 'D', 'R', 'L', 'F', 'B'].forEach(sides => genDetail(sides))

	//вращение
	const moves = []
	const ax = {
		x: [1, 0, 0],
		y: [0, 1, 0],
		z: [0, 0, 1]
	}
	function reassign(a, b, c, d, steps = 1) {
		for (let i = 0; i < steps; i++) {
			const buff = details[a]
			details[a] = details[b]
			details[b] = details[c]
			details[c] = details[d]
			details[d] = buff
		}
	}
	function reassignAll(axis, steps = 0) {
		if (steps == -1) steps = 3
		if (steps == -2) steps = 2
		if (steps == -3) steps = 1
		for (let i = 0; i < steps; i++) {
			if (axis == 'Y') {
				reassign('RUF', 'RUB', 'LUB', 'LUF')
				reassign('UF', 'UR', 'UB', 'UL')
				reassign('RF', 'RB', 'LB', 'LF')
				reassign('RDF', 'RDB', 'LDB', 'LDF')
				reassign('DF', 'DR', 'DB', 'DL')
				reassign('F', 'R', 'B', 'L')
			} else if (axis == 'X') {
				reassign('RUF', 'RDF', 'RDB', 'RUB')
				reassign('UR', 'RF', 'DR', 'RB')
				reassign('UF', 'DF', 'DB', 'UB')
				reassign('LUF', 'LDF', 'LDB', 'LUB')
				reassign('UL', 'LF', 'DL', 'LB')
				reassign('F', 'D', 'B', 'U')
			} else if (axis == 'Z') {
				reassign('RUF', 'LUF', 'LDF', 'RDF')
				reassign('UF', 'LF', 'DF', 'RF')
				reassign('UR', 'UL', 'DL', 'UR')
				reassign('RUB', 'LUB', 'LDB', 'RDB')
				reassign('UB', 'LB', 'DB', 'RB')
				reassign('U', 'L', 'D', 'R')
			}
		}
	}
	function move(side, direction = 0) {
		let axis, angle, corners, edges
		const maxAngle = Math.PI / 2
		if (side === 'U') {
			axis = new THREE.Vector3(...ax.y)
			angle = -maxAngle
			corners = ['RUF', 'RUB', 'LUB', 'LUF']
			edges = ['UF', 'UR', 'UB', 'UL']
		} else if (side === 'R') {
			axis = new THREE.Vector3(...ax.x)
			angle = -maxAngle
			corners = ['RUF', 'RDF', 'RDB', 'RUB']
			edges = ['UR', 'RF', 'DR', 'RB']
		} else if (side === 'F') {
			axis = new THREE.Vector3(...ax.z)
			angle = -maxAngle
			corners = ['RUF', 'LUF', 'LDF', 'RDF']
			edges = ['UF', 'LF', 'DF', 'RF']
		} else if (side === 'D') {
			axis = new THREE.Vector3(...ax.y)
			angle = maxAngle
			corners = ['RDF', 'LDF', 'LDB', 'RDB']
			edges = ['DF', 'DL', 'DB', 'DR']
		} else if (side === 'L') {
			axis = new THREE.Vector3(...ax.x)
			angle = maxAngle
			corners = ['LUF', 'LUB', 'LDB', 'LDF']
			edges = ['UL', 'LB', 'DL', 'LF']
		} else if (side === 'B') {
			axis = new THREE.Vector3(...ax.z)
			angle = maxAngle
			corners = ['RUB', 'RDB', 'LDB', 'LUB']
			edges = ['UB', 'RB', 'DB', 'LB']
		}
		if (axis && angle && corners && edges) {
			moves.push({ detailsSides: [...edges, ...corners, side], axis, angle, direction, edges, corners })
		}
	}
	document.addEventListener('keypress', e => {
		let direction = 0
		if (e.shiftKey) direction = 1
		if (e.code === "KeyW") move('U', direction)
		if (e.code === "KeyD") move('R', direction)
		if (e.code === "KeyS") move('F', direction)
		if (e.code === "KeyX") move('D', direction)
		if (e.code === "KeyA") move('L', direction)
		if (e.code === "KeyF") move('B', direction)
	})

	//адаптивность
	function resizeRendererToDisplaySize(renderer) {
		const canvas = renderer.domElement
		const width = canvas.clientWidth
		const height = canvas.clientHeight
		const needResize = canvas.width !== width || canvas.height !== height
		if (needResize) {
			renderer.setSize(width, height, false)
		}
		return needResize
	}
	//анимация
	let h = 1
	const steps = 5
	let step = steps
	let currentMove = null
	function render() {
		if (resizeRendererToDisplaySize(renderer)) {
			const canvas = renderer.domElement
			camera.aspect = canvas.clientWidth / canvas.clientHeight
			camera.updateProjectionMatrix()
		}
		//смена фронтальной грани
		let newH = h
		const azimuthal = controls.getAzimuthalAngle()
		if (azimuthal < Math.PI / 4 && azimuthal > -Math.PI / 4) {
			newH = 1
			light.position.set(0, 0, size * 2)
			ax.x = [1, 0, 0]
			ax.z = [0, 0, 1]
		} else if (azimuthal < -Math.PI / 4 && azimuthal > -Math.PI * 3 / 4) {
			newH = 4
			light.position.set(-size * 2, 0, 0)
			ax.x = [0, 0, 1]
			ax.z = [-1, 0, 0]
		} else if (azimuthal < Math.PI * 3 / 4 && azimuthal > Math.PI / 4) {
			newH = 2
			light.position.set(size * 2, 0, 0)
			ax.x = [0, 0, -1]
			ax.z = [1, 0, 0]
		} else {
			newH = 3
			light.position.set(0, 0, -size * 2)
			ax.x = [-1, 0, 0]
			ax.z = [0, 0, -1]
		}
		reassignAll('Y', newH - h)
		h = newH
		//анимация ходов
		if (moves.length > 0 && currentMove == null) {
			currentMove = moves.shift()
			step = 0
		}
		if (currentMove && step < steps) {
			if (step == 0) {
				if (currentMove.direction) {
					reassign(...currentMove.edges, 3)
					reassign(...currentMove.corners, 3)
				} else {
					reassign(...currentMove.edges)
					reassign(...currentMove.corners)
				}
			}
			let directionAngle = currentMove.direction ? -currentMove.angle : currentMove.angle
			currentMove.detailsSides.forEach(sides => {
				details[sides].rotateOnWorldAxis(currentMove.axis, directionAngle / steps)
			})
			step++
		} else {
			currentMove = null
		}
		//
		renderer.render(scene, camera)
		requestAnimationFrame(render)
	}
	requestAnimationFrame(render)
}
main()