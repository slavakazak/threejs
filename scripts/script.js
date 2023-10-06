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


  const geometry = new THREE.BoxGeometry(30, 30, 30)
  const material = new THREE.MeshPhongMaterial({ color: 0xFF0000, wireframe: true })
  const mesh = new THREE.Mesh(geometry, material)
  cube.add(mesh)
  //детали
  const inner = '#616161'
  function genDetail(x, y, z, colors) {
    const size = 10
    const geometry = new THREE.BoxGeometry(size, size, size)
    const materials = [
      new THREE.MeshPhongMaterial({ color: colors.right || inner }),
      new THREE.MeshPhongMaterial({ color: colors.left || inner }),
      new THREE.MeshPhongMaterial({ color: colors.up || inner }),
      new THREE.MeshPhongMaterial({ color: colors.doun || inner }),
      new THREE.MeshPhongMaterial({ color: colors.front || inner }),
      new THREE.MeshPhongMaterial({ color: colors.back || inner })
    ]
    const mesh = new THREE.Mesh(geometry, materials)
    mesh.position.set(x, y, z)
    cube.add(mesh)
  }
  const red = '#d50000'
  const white = '#f5f5f5'
  const green = '#00c853'
  const orange = '#ff6d00'
  const yellow = '#ffd600'
  const blue = '#2962ff'
  genDetail(10, 10, 10, { right: red, up: white, front: green }) //RUF
  genDetail(-10, 10, 10, { left: orange, up: white, front: green }) //LUF
  genDetail(10, -10, 10, { right: red, doun: yellow, front: green }) //RDF
  genDetail(-10, -10, 10, { left: orange, doun: yellow, front: green }) //LDF
  genDetail(10, 10, -10, { right: red, up: white, back: blue }) //RUB
  genDetail(-10, 10, -10, { left: orange, up: white, back: blue }) //LUB
  genDetail(10, -10, -10, { right: red, doun: yellow, back: blue }) //RDB
  genDetail(-10, -10, -10, { left: orange, doun: yellow, back: blue }) //LDB
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