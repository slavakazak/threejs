import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { GUI } from 'three/addons/libs/lil-gui.module.min.js'

function main() {
  const canvas = document.querySelector('#canvas')
  const renderer = new THREE.WebGLRenderer({ antialias: true, canvas })
  renderer.shadowMap.enabled = true

  const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.set(0, 10, 20)

  const controls = new OrbitControls(camera, canvas)
  controls.target.set(0, 5, 0)
  controls.update()

  const scene = new THREE.Scene()
  scene.background = new THREE.Color('black')

  {
    const planeSize = 40
    const loader = new THREE.TextureLoader()
    const texture = loader.load('../../img/checker.png')
    texture.wrapS = THREE.RepeatWrapping
    texture.wrapT = THREE.RepeatWrapping
    texture.magFilter = THREE.NearestFilter
    texture.colorSpace = THREE.SRGBColorSpace
    const repeats = planeSize / 2
    texture.repeat.set(repeats, repeats)

    const planeGeo = new THREE.PlaneGeometry(planeSize, planeSize)
    const planeMat = new THREE.MeshPhongMaterial({ map: texture, side: THREE.DoubleSide })
    const mesh = new THREE.Mesh(planeGeo, planeMat)
    mesh.receiveShadow = true
    mesh.rotation.x = Math.PI * -.5
    scene.add(mesh)
  }
  {
    const cubeSize = 4
    const cubeGeo = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize)
    const cubeMat = new THREE.MeshPhongMaterial({ color: '#8AC' })
    const mesh = new THREE.Mesh(cubeGeo, cubeMat)
    mesh.castShadow = true
    mesh.receiveShadow = true
    mesh.position.set(cubeSize + 1, cubeSize / 2, 0)
    scene.add(mesh)
  }
  {
    const cubeSize = 30
    const cubeGeo = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize)
    const cubeMat = new THREE.MeshPhongMaterial({ color: '#CCC', side: THREE.BackSide })
    const mesh = new THREE.Mesh(cubeGeo, cubeMat)
    mesh.receiveShadow = true
    mesh.position.set(0, cubeSize / 2 - 0.1, 0)
    scene.add(mesh)
  }
  {
    const sphereRadius = 3
    const sphereWidthDivisions = 32
    const sphereHeightDivisions = 16
    const sphereGeo = new THREE.SphereGeometry(sphereRadius, sphereWidthDivisions, sphereHeightDivisions)
    const sphereMat = new THREE.MeshPhongMaterial({ color: '#CA8' })
    const mesh = new THREE.Mesh(sphereGeo, sphereMat)
    mesh.castShadow = true
    mesh.receiveShadow = true
    mesh.position.set(- sphereRadius - 1, sphereRadius + 2, 0)
    scene.add(mesh)
  }
  class ColorGUIHelper {
    constructor(object, prop) {
      this.object = object
      this.prop = prop
    }
    get value() {
      return `#${this.object[this.prop].getHexString()}`
    }
    set value(hexString) {
      this.object[this.prop].set(hexString)
    }
  }
  function makeXYZGUI(gui, vector3, name, onChangeFn) {
    const folder = gui.addFolder(name)
    folder.add(vector3, 'x', - 10, 10).onChange(onChangeFn)
    folder.add(vector3, 'y', 0, 10).onChange(onChangeFn)
    folder.add(vector3, 'z', - 10, 10).onChange(onChangeFn)
  }
  {
    const color = 0xFFFFFF
    const intensity = 100
    const light = new THREE.PointLight(color, intensity)
    light.castShadow = true
    light.position.set(0, 10, 0)
    scene.add(light)

    const helper = new THREE.PointLightHelper(light)
    scene.add(helper)

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

    const gui = new GUI()
    gui.addColor(new ColorGUIHelper(light, 'color'), 'value').name('color')
    gui.add(light, 'intensity', 0, 200)
    gui.add(light, 'distance', 0, 40)
    {
      const folder = gui.addFolder('Shadow Camera')
      folder.open()
      const minMaxGUIHelper = new MinMaxGUIHelper(light.shadow.camera, 'near', 'far', 0.1)
      folder.add(minMaxGUIHelper, 'min', 0.1, 50, 0.1).name('near')
      folder.add(minMaxGUIHelper, 'max', 0.1, 50, 0.1).name('far')
    }
    makeXYZGUI(gui, light.position, 'position', () => { })
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

  function render() {
    resizeRendererToDisplaySize(renderer)
    {
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