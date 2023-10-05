import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { GUI } from 'three/addons/libs/lil-gui.module.min.js'

function main() {
  //рендерер
  const canvas = document.querySelector('#canvas')
  const view1Elem = document.querySelector('#view1')
  const view2Elem = document.querySelector('#view2')
  const renderer = new THREE.WebGLRenderer({ antialias: true, canvas, logarithmicDepthBuffer: true })
  renderer.setClearColor(0x212121)
  //камера 1
  const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.00001, 1000)
  camera.position.set(0, 10, 20)
  const cameraHelper = new THREE.CameraHelper(camera)
  const controls = new OrbitControls(camera, view1Elem)
  controls.target.set(0, 5, 0)
  controls.update()
  //камера 2
  const camera2 = new THREE.PerspectiveCamera(60, 2, 0.1, 500)
  camera2.position.set(40, 10, 30)
  camera2.lookAt(0, 5, 0)
  const controls2 = new OrbitControls(camera2, view2Elem)
  controls2.target.set(0, 5, 0)
  controls2.update()
  //сцена
  const scene = new THREE.Scene()
  scene.background = new THREE.Color('black')
  scene.add(cameraHelper)
  //setScissorForElement
  function setScissorForElement(elem) {
    const canvasRect = canvas.getBoundingClientRect()
    const elemRect = elem.getBoundingClientRect()
    const right = Math.min(elemRect.right, canvasRect.right) - canvasRect.left
    const left = Math.max(0, elemRect.left - canvasRect.left)
    const bottom = Math.min(elemRect.bottom, canvasRect.bottom) - canvasRect.top
    const top = Math.max(0, elemRect.top - canvasRect.top)
    const width = Math.min(canvasRect.width, right - left)
    const height = Math.min(canvasRect.height, bottom - top)
    const positiveYUpBottom = canvasRect.height - bottom
    renderer.setScissor(left, positiveYUpBottom, width, height)
    renderer.setViewport(left, positiveYUpBottom, width, height)
    return width / height
  }
  //текстура плоскости
  const planeSize = 40
  const loader = new THREE.TextureLoader()
  const texture = loader.load('../img/checker.png')
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
  texture.magFilter = THREE.NearestFilter
  texture.colorSpace = THREE.SRGBColorSpace
  const repeats = planeSize / 2
  texture.repeat.set(repeats, repeats)
  //плоскость
  const planeGeo = new THREE.PlaneGeometry(planeSize, planeSize)
  const planeMat = new THREE.MeshStandardMaterial({
    map: texture,
    side: THREE.DoubleSide,
  })
  const mesh = new THREE.Mesh(planeGeo, planeMat)
  mesh.rotation.x = Math.PI * -.5
  scene.add(mesh)
  //сферы
  {
    const sphereRadius = 3
    const sphereWidthDivisions = 32
    const sphereHeightDivisions = 16
    const sphereGeo = new THREE.SphereGeometry(sphereRadius, sphereWidthDivisions, sphereHeightDivisions)
    const numSpheres = 20
    for (let i = 0; i < numSpheres; ++i) {
      const sphereMat = new THREE.MeshPhongMaterial()
      sphereMat.color.setHSL(i * .73, 1, 0.5)
      const mesh = new THREE.Mesh(sphereGeo, sphereMat)
      mesh.position.set(-sphereRadius - 1, sphereRadius + 2, i * sphereRadius * -2.2)
      scene.add(mesh)
    }
  }
  //свет
  const color = 0xFFFFFF
  const intensity = 5
  const light = new THREE.AmbientLight(color, intensity)
  scene.add(light)
  //MinMaxGUIHelper
  class MinMaxGUIHelper {
    constructor(obj, minProp, maxProp, minDif) {
      this.obj = obj
      this.minProp = minProp
      this.maxProp = maxProp
      this.minDif = minDif
    }
    get min() {
      return this.obj[this.minProp]
    }
    set min(v) {
      this.obj[this.minProp] = v
      this.obj[this.maxProp] = Math.max(this.obj[this.maxProp], v + this.minDif)
    }
    get max() {
      return this.obj[this.maxProp]
    }
    set max(v) {
      this.obj[this.maxProp] = v
      this.min = this.min
    }
  }
  //gui
  const gui = new GUI()
  gui.add(camera, 'fov', 1, 180)
  const minMaxGUIHelper = new MinMaxGUIHelper(camera, 'near', 'far', 0.1)
  gui.add(minMaxGUIHelper, 'min', 0.00001, 50, 0.00001).name('near')
  gui.add(minMaxGUIHelper, 'max', 0.1, 50, 0.1).name('far')
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
    resizeRendererToDisplaySize(renderer)
    renderer.setScissorTest(true)
    {
      const aspect = setScissorForElement(view1Elem)
      camera.aspect = aspect
      camera.updateProjectionMatrix()
      cameraHelper.update()
      cameraHelper.visible = false
      scene.background.set(0x000000)
      renderer.render(scene, camera)
    }
    {
      const aspect = setScissorForElement(view2Elem)
      camera2.aspect = aspect
      camera2.updateProjectionMatrix()
      cameraHelper.visible = true
      scene.background.set(0x000040)
      renderer.render(scene, camera2)
    }
    requestAnimationFrame(render)
  }
  requestAnimationFrame(render)
}
main()
