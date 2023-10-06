import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { CannonDebugRenderer } from 'cannonDebugRenderer'

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
  controls.maxAzimuthAngle = Math.PI / 2
  controls.minAzimuthAngle = -Math.PI / 2
  controls.update()
  //движок
  const gravity = -100
  const k = 0.5
  const world = new CANNON.World()
  world.gravity.set(0, 0, gravity)
  //свет
  const lightColor = 0xFFFFFF
  const lightIntensity = 1
  const light = new THREE.DirectionalLight(lightColor, lightIntensity)
  light.castShadow = true
  light.position.set(0, 0, cellSize)
  light.target.position.set(0, 0, 0)
  scene.add(light)
  scene.add(light.target)
  // const helper = new THREE.DirectionalLightHelper(light)
  // scene.add(helper)

  light.shadow.camera.left = -groundWidth / 2
  light.shadow.camera.right = groundWidth / 2
  light.shadow.camera.top = groundHeight / 2
  light.shadow.camera.bottom = -groundHeight / 2
  light.shadow.camera.far = cellSize
  // const cameraHelper = new THREE.CameraHelper(light.shadow.camera)
  // scene.add(cameraHelper)
  {
    const color = 0xFFFFFF
    const intensity = 0.1
    const light = new THREE.AmbientLight(color, intensity)
    scene.add(light)
  }
  //весть лабиринт
  const maze = new THREE.Object3D()
  scene.add(maze)

  const mazeBody = new CANNON.Body({ mass: 0 })
  world.addBody(mazeBody)
  //плоскость
  const groundDepth = 1
  const groundGeometry = new THREE.BoxGeometry(groundWidth, groundHeight, groundDepth)
  const groundColor = 0xFFFF00
  const groundMaterial = new THREE.MeshStandardMaterial({ color: groundColor, roughness: 0.5, metalness: 0.5 })
  const groundMesh = new THREE.Mesh(groundGeometry, groundMaterial)
  groundMesh.position.set(0, 0, -groundDepth / 2)
  groundMesh.receiveShadow = true
  maze.add(groundMesh)

  // const grid = new THREE.GridHelper(groundWidth, groundWidth/cellSize)
  // grid.material.depthTest = false
  // grid.rotation.x = Math.PI / 2
  // grid.renderOrder = 1
  // maze.add(grid)

  const groundShape = new CANNON.Box(new CANNON.Vec3(groundWidth * k, groundHeight * k, groundDepth * k))
  mazeBody.addShape(groundShape, new CANNON.Vec3(groundMesh.position.x, groundMesh.position.y, groundMesh.position.z))
  const ceilingShape = new CANNON.Box(new CANNON.Vec3(groundWidth * k, groundHeight * k, groundDepth * k))
  mazeBody.addShape(ceilingShape, new CANNON.Vec3(groundMesh.position.x, groundMesh.position.y, groundMesh.position.z + wallDepth + groundDepth))
  //стены
  function genWall(width, height, x, y) {
    const geometry = new THREE.BoxGeometry(width, height, wallDepth)
    const color = 0xFF00FF
    const material = new THREE.MeshStandardMaterial({ color, roughness: 0.5, metalness: 0.5 })
    const mesh = new THREE.Mesh(geometry, material)
    mesh.castShadow = true
    mesh.receiveShadow = true
    mesh.position.set(x, y, wallDepth / 2)
    maze.add(mesh)

    const shape = new CANNON.Box(new CANNON.Vec3(width * k, height * k, wallDepth * k))
    mazeBody.addShape(shape, new CANNON.Vec3(mesh.position.x, mesh.position.y, mesh.position.z))
  }
  genWall(groundWidth, cellSize, 0, -groundHeight / 2 + cellSize / 2)
  genWall(groundWidth, cellSize, 0, groundHeight / 2 - cellSize / 2)
  genWall(cellSize, groundHeight, -groundWidth / 2 + cellSize / 2, 0)
  genWall(cellSize, groundHeight, groundWidth / 2 - cellSize / 2, 0)
  const wallHeight = 20 * cellSize
  genWall(cellSize, wallHeight, -6 * cellSize, groundHeight / 2 - wallHeight / 2)
  genWall(cellSize, wallHeight, 0 * cellSize, -groundHeight / 2 + wallHeight / 2)
  genWall(cellSize, wallHeight, 6 * cellSize, groundHeight / 2 - wallHeight / 2)
  //шар
  const ballWidthSegments = 12
  const ballHeightSegments = 12
  const ballGeometry = new THREE.SphereGeometry(ballRadius, ballWidthSegments, ballHeightSegments)
  const ballColor = 0x00FFFF
  const ballMaterial = new THREE.MeshStandardMaterial({ color: ballColor, roughness: 0, metalness: 0.5 })
  const ballMesh = new THREE.Mesh(ballGeometry, ballMaterial)
  ballMesh.position.set(-9 * cellSize, 9 * cellSize, ballRadius)
  ballMesh.castShadow = true
  ballMesh.receiveShadow = true
  scene.add(ballMesh)

  const ballBody = new CANNON.Body({ mass: 1 })
  const ballShape = new CANNON.Sphere(ballRadius)
  ballBody.addShape(ballShape)
  ballBody.position.x = ballMesh.position.x
  ballBody.position.y = ballMesh.position.y
  ballBody.position.z = ballMesh.position.z
  world.addBody(ballBody)
  //cannonDebugRenderer
  //const cannonDebugRenderer = new CannonDebugRenderer(scene, world)
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
  let lastTime
  function render(time) {
    if (resizeRendererToDisplaySize(renderer)) {
      const canvas = renderer.domElement
      camera.aspect = canvas.clientWidth / canvas.clientHeight
      camera.updateProjectionMatrix()
    }

    const polar = controls.getPolarAngle()
    const azimuthal = controls.getAzimuthalAngle()
    world.gravity.set(Math.sin(azimuthal) * gravity, Math.cos(polar) * gravity, Math.cos(azimuthal) * Math.sin(polar) * gravity)

    maze.position.set(
      mazeBody.position.x,
      mazeBody.position.y,
      mazeBody.position.z
    )
    maze.quaternion.set(
      mazeBody.quaternion.x,
      mazeBody.quaternion.y,
      mazeBody.quaternion.z,
      mazeBody.quaternion.w
    )
    ballMesh.position.set(
      ballBody.position.x,
      ballBody.position.y,
      ballBody.position.z
    )
    ballMesh.quaternion.set(
      ballBody.quaternion.x,
      ballBody.quaternion.y,
      ballBody.quaternion.z,
      ballBody.quaternion.w
    )

    if (lastTime !== undefined) {
      const dt = (time - lastTime) / 1000
      world.step(1 / 60, dt, 3)
    }
    lastTime = time

    //cannonDebugRenderer.update()

    renderer.render(scene, camera)
    requestAnimationFrame(render)
  }
  requestAnimationFrame(render)
}
main()