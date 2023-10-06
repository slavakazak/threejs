import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

function main() {
	const cellSize = 4
	const wallDepth = cellSize
	const groundWidth = cellSize * 25
	const groundHeight = cellSize * 25
	const ballRadius = wallDepth / 2
	//
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
		const lightIntensity = 1
		const light = new THREE.DirectionalLight(lightColor, lightIntensity)
		light.position.set(100, 100, 100)
		light.target.position.set(0, 0, 0)
		scene.add(light)
		scene.add(light.target)
	}
	// const helper = new THREE.DirectionalLightHelper(light)
	// scene.add(helper)

	// light.shadow.camera.left = -groundWidth / 2
	// light.shadow.camera.right = groundWidth / 2
	// light.shadow.camera.top = groundHeight / 2
	// light.shadow.camera.bottom = -groundHeight / 2
	// light.shadow.camera.far = cellSize
	// const cameraHelper = new THREE.CameraHelper(light.shadow.camera)
	// scene.add(cameraHelper)
	{
		const color = 0xFFFFFF
		const intensity = 1
		const light = new THREE.AmbientLight(color, intensity)
		scene.add(light)
	}
	//весть куб
	const cube = new THREE.Object3D()
	scene.add(cube)
	//детали
	const size = 10
	const inner = '#616161'
	function genDetail(colors) {
		const geometry = new THREE.BoxGeometry(size, size, size)
		const materials = [
			new THREE.MeshPhongMaterial({ color: colors.right || inner }),
			new THREE.MeshPhongMaterial({ color: colors.left || inner }),
			new THREE.MeshPhongMaterial({ color: colors.up || inner }),
			new THREE.MeshPhongMaterial({ color: colors.down || inner }),
			new THREE.MeshPhongMaterial({ color: colors.front || inner }),
			new THREE.MeshPhongMaterial({ color: colors.back || inner })
		]
		const mesh = new THREE.Mesh(geometry, materials)

		let x = 0, y = 0, z = 0
		if (colors.right) x = size
		if (colors.left) x = -size
		if (colors.up) y = size
		if (colors.down) y = -size
		if (colors.front) z = size
		if (colors.back) z = -size
		mesh.position.set(x, y, z)
		cube.add(mesh)
	}
	const red = '#d50000'
	const white = '#f5f5f5'
	const green = '#00c853'
	const orange = '#ff6d00'
	const yellow = '#ffd600'
	const blue = '#2962ff'
	genDetail({ right: red, up: white, front: green }) //RUF
	genDetail({ left: orange, up: white, front: green }) //LUF
	genDetail({ right: red, down: yellow, front: green }) //RDF
	genDetail({ left: orange, down: yellow, front: green }) //LDF
	genDetail({ right: red, up: white, back: blue }) //RUB
	genDetail({ left: orange, up: white, back: blue }) //LUB
	genDetail({ right: red, down: yellow, back: blue }) //RDB
	genDetail({ left: orange, down: yellow, back: blue }) //LDB
	genDetail({ up: white, front: green }) //UF
	genDetail({ up: white, back: blue }) //UB
	genDetail({ up: white, right: red }) //UR
	genDetail({ up: white, left: orange }) //UL
	genDetail({ down: yellow, front: green }) //DF
	genDetail({ down: yellow, back: blue }) //DB
	genDetail({ down: yellow, right: red }) //DR
	genDetail({ down: yellow, left: orange }) //DL
	genDetail({ right: red, front: green }) //RF
	genDetail({ left: orange, front: green }) //LF
	genDetail({ right: red, back: blue }) //RB
	genDetail({ left: orange, back: blue }) //LB
	genDetail({ up: white }) //U
	genDetail({ down: yellow }) //D
	genDetail({ right: red }) //R
	genDetail({ left: orange }) //L
	genDetail({ front: green }) //F
	genDetail({ back: blue }) //B
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