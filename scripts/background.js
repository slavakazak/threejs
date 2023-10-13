import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

function main() {
  const canvas = document.querySelector('#canvas')
  const renderer = new THREE.WebGLRenderer({ antialias: true, canvas })

  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100)
  camera.position.z = 3

  const controls = new OrbitControls(camera, canvas)
  controls.target.set(0, 0, 0)
  controls.update()

  const scene = new THREE.Scene()

  {
    const light = new THREE.DirectionalLight(0xFFFFFF, 3)
    light.position.set(-1, 2, 4)
    scene.add(light)
  }

  const geometry = new THREE.BoxGeometry(1, 1, 1);

  function makeInstance(geometry, color, x) {
    const material = new THREE.MeshPhongMaterial({ color })
    const cube = new THREE.Mesh(geometry, material)
    scene.add(cube)
    cube.position.x = x
    return cube
  }

  const cubes = [
    // makeInstance(geometry, 0x44aa88, 0),
    // makeInstance(geometry, 0x8844aa, - 2),
    // makeInstance(geometry, 0xaa8844, 2),
  ]

  {
    const loader = new THREE.TextureLoader()
    const texture = loader.load('../img/resting_place.jpg', () => {
      texture.mapping = THREE.EquirectangularReflectionMapping
      texture.colorSpace = THREE.SRGBColorSpace
      scene.background = texture
    })
  }

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
  function render(time) {
    time *= 0.001
    if (resizeRendererToDisplaySize(renderer)) {
      const canvas = renderer.domElement
      camera.aspect = canvas.clientWidth / canvas.clientHeight
      camera.updateProjectionMatrix()
    }

    cubes.forEach((cube, ndx) => {
      const speed = 1 + ndx * .1
      const rot = time * speed
      cube.rotation.x = rot
      cube.rotation.y = rot
    })

    renderer.render(scene, camera)
    requestAnimationFrame(render)
  }
  requestAnimationFrame(render)
}
main()