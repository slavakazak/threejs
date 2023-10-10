import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

function main() {
	const canvas = document.querySelector('#canvas')
	const renderer = new THREE.WebGLRenderer({ antialias: true, canvas })
	renderer.shadowMap.enabled = true
	renderer.setClearColor(0x212121)
	const scene = new THREE.Scene()
	const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000)
	camera.position.z = 150
	camera.lookAt(0, 0, 0)
	const controls = new OrbitControls(camera, canvas)
	controls.target.set(0, 0, 0)
	controls.update()
	//свет
	{
		const lightColor = 0xFFFFFF
		const lightIntensity = 5
		const light = new THREE.DirectionalLight(lightColor, lightIntensity)
		light.position.set(20, 20, 20)
		light.target.position.set(0, 0, 0)
		scene.add(light)
		scene.add(light.target)

		// const helper = new THREE.DirectionalLightHelper(light)
		// scene.add(helper)
	}
	{
		const lightColor = 0xFFFFFF
		const lightIntensity = 2
		const light = new THREE.DirectionalLight(lightColor, lightIntensity)
		light.position.set(-20, -20, -20)
		light.target.position.set(0, 0, 0)
		scene.add(light)
		scene.add(light.target)

		// const helper = new THREE.DirectionalLightHelper(light)
		// scene.add(helper)
	}
	// {
	//   const color = 0xFFFFFF
	//   const intensity = 1
	//   const light = new THREE.AmbientLight(color, intensity)
	//   scene.add(light)
	// }
	//весть куб
	const cube = new THREE.Object3D()
	scene.add(cube)
	//детали
	const details = {}
	const size = 10
	const inner = '#616161'
	const red = '#d50000'
	const white = '#f5f5f5'
	const green = '#00c853'
	const orange = '#ff6d00'
	const yellow = '#ffd600'
	const blue = '#2962ff'

	function genDetail(sides) {
		const detail = new THREE.Object3D()
		cube.add(detail)
		details[sides] = detail

		const material = THREE.MeshPhongMaterial
		const parameters = { color: inner, roughness: 1, shininess: 3 }
		const geometry = new THREE.BoxGeometry(size, size, size)
		const materials = [new material(parameters), new material(parameters), new material(parameters), new material(parameters), new material(parameters), new material(parameters)]
		const mesh = new THREE.Mesh(geometry, materials)

		let x = 0, y = 0, z = 0
		if (sides.includes('R')) {
			x = size + 1
			materials[0].color = new THREE.Color(red)
		}
		if (sides.includes('L')) {
			x = -size - 1
			materials[1].color = new THREE.Color(orange)
		}
		if (sides.includes('U')) {
			y = size + 1
			materials[2].color = new THREE.Color(white)
		}
		if (sides.includes('D')) {
			y = -size - 1
			materials[3].color = new THREE.Color(yellow)
		}
		if (sides.includes('F')) {
			z = size + 1
			materials[4].color = new THREE.Color(green)
		}
		if (sides.includes('B')) {
			z = -size - 1
			materials[5].color = new THREE.Color(blue)
		}
		mesh.position.set(x, y, z)
		detail.add(mesh)

		const edges = new THREE.EdgesGeometry(geometry)
		const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: inner }))
		line.position.set(x, y, z)
		detail.add(line)
	}
	genDetail('RUF')
	genDetail('LUF')
	genDetail('RDF')
	genDetail('LDF')
	genDetail('RUB')
	genDetail('LUB')
	genDetail('RDB')
	genDetail('LDB')
	genDetail('UF')
	genDetail('UB')
	genDetail('UR')
	genDetail('UL')
	genDetail('DF')
	genDetail('DB')
	genDetail('DR')
	genDetail('DL')
	genDetail('RF')
	genDetail('LF')
	genDetail('RB')
	genDetail('LB')
	genDetail('U')
	genDetail('D')
	genDetail('R')
	genDetail('L')
	genDetail('F')
	genDetail('B')

	//вращение
	function resign(a, b, c, d, rotAxis) {
		[a, b, c, d].forEach(sides => {
			details[sides].rotateOnWorldAxis(...rotAxis)
		})
		const buff = details[a]
		details[a] = details[b]
		details[b] = details[c]
		details[c] = details[d]
		details[d] = buff
	}
	function rotate(side, steps = 1) {
		let rotAxis, corners, edges
		if (side === 'U') {
			rotAxis = [new THREE.Vector3(0, 1, 0), -Math.PI / 2]
			corners = ['RUF', 'RUB', 'LUB', 'LUF']
			edges = ['UF', 'UR', 'UB', 'UL']
		} else if (side === 'R') {
			rotAxis = [new THREE.Vector3(1, 0, 0), -Math.PI / 2]
			corners = ['RUF', 'RDF', 'RDB', 'RUB']
			edges = ['UR', 'RF', 'DR', 'RB']
		} else if (side === 'F') {
			rotAxis = [new THREE.Vector3(0, 0, 1), -Math.PI / 2]
			corners = ['RUF', 'LUF', 'LDF', 'RDF']
			edges = ['UF', 'LF', 'DF', 'RF']
		} else if (side === 'D') {
			rotAxis = [new THREE.Vector3(0, 1, 0), Math.PI / 2]
			corners = ['RDF', 'LDF', 'LDB', 'RDB']
			edges = ['DF', 'DL', 'DB', 'DR']
		} else if (side === 'L') {
			rotAxis = [new THREE.Vector3(1, 0, 0), Math.PI / 2]
			corners = ['LUF', 'LUB', 'LDB', 'LDF']
			edges = ['UL', 'LB', 'DL', 'LF']
		} else if (side === 'B') {
			rotAxis = [new THREE.Vector3(0, 0, 1), Math.PI / 2]
			corners = ['RUB', 'RDB', 'LDB', 'LUB']
			edges = ['UB', 'RB', 'DB', 'LB']
		}
		if (rotAxis && corners && edges) {
			for (let i = 0; i < steps; i++) {
				resign(...edges, rotAxis)
				resign(...corners, rotAxis)
				details[side].rotateOnWorldAxis(...rotAxis)
			}
		}
	}
	document.addEventListener('keypress', e => {
		let steps = 1
		if (e.shiftKey) steps = 3
		else if (e.ctrlKey) steps = 2
		if (e.code === "KeyW") rotate('U', steps)
		if (e.code === "KeyD") rotate('R', steps)
		if (e.code === "KeyS") rotate('F', steps)
		if (e.code === "KeyX") rotate('D', steps)
		if (e.code === "KeyA") rotate('L', steps)
		if (e.code === "KeyF") rotate('B', steps)
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
	function render(time) {
		if (resizeRendererToDisplaySize(renderer)) {
			const canvas = renderer.domElement
			camera.aspect = canvas.clientWidth / canvas.clientHeight
			camera.updateProjectionMatrix()
		}

		renderer.render(scene, camera)
		requestAnimationFrame(render)
	}
	requestAnimationFrame(render)
}
main()