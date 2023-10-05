import * as THREE from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

window.onload = function () {
  let width = window.innerWidth
  let height = window.innerHeight

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 5000)
  camera.position.set(0, 0, 5)
  camera.lookAt(0, 0, 0)
  const canvas = document.querySelector('#canvas')
  const renderer = new THREE.WebGLRenderer({ antialias: true, canvas })
  renderer.setClearColor(0x212121)
  renderer.setSize(width, height)

  const controls = new OrbitControls(camera, canvas)
  controls.target.set(0, 0, 0)
  controls.update()

  const directionalLight = new THREE.DirectionalLight(0xffffff, 5)
  scene.add(directionalLight)

  let scull = null
  const loader = new GLTFLoader()
  loader.load('../img/skull_downloadable.glb', function (gltf) {
    scene.add(gltf.scene)
    scull = gltf.scene
  }, undefined, function (error) {
    console.error(error)
  })


  function animate() {
    requestAnimationFrame(animate)
    renderer.render(scene, camera)
  }
  animate()
}