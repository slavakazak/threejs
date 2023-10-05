import * as THREE from 'three'
import { GUI } from 'three/addons/libs/lil-gui.module.min.js'

function main() {
  const canvas = document.querySelector('#canvas')
  const renderer = new THREE.WebGLRenderer({ antialias: true, canvas })
  const gui = new GUI()

  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 5)
  camera.position.z = 2

  const scene = new THREE.Scene()

  class FogGUIHelper {
    constructor(fog, backgroundColor) {
      this.fog = fog
      this.backgroundColor = backgroundColor
    }
    get near() {
      return this.fog.near
    }
    set near(v) {
      this.fog.near = v
      this.fog.far = Math.max(this.fog.far, v)
    }
    get far() {
      return this.fog.far
    }
    set far(v) {
      this.fog.far = v
      this.fog.near = Math.min(this.fog.near, v)
    }
    get color() {
      return `#${this.fog.color.getHexString()}`
    }
    set color(hexString) {
      this.fog.color.set(hexString)
      this.backgroundColor.set(hexString)
    }
  }
  {
    const color = 'lightblue'
    const near = 1
    const far = 2
    scene.fog = new THREE.Fog(color, near, far)
    //const density = 0.5
    //scene.fog = new THREE.FogExp2(color, density)
    scene.background = new THREE.Color(color)

    const fogGUIHelper = new FogGUIHelper(scene.fog, scene.background)
    gui.add(fogGUIHelper, 'near', near, far).listen()
    gui.add(fogGUIHelper, 'far', near, far).listen()
    //gui.add(scene.fog, 'density', 0, 2, 0.01)
    gui.addColor(fogGUIHelper, 'color')
  }
  {
    const color = 0xFFFFFF
    const intensity = 3
    const light = new THREE.DirectionalLight(color, intensity)
    light.position.set(- 1, 2, 4)
    scene.add(light)
  }

  const geometry = new THREE.BoxGeometry(1, 1, 1)

  function makeInstance(geometry, color, x) {
    const material = new THREE.MeshPhongMaterial({ color })
    const cube = new THREE.Mesh(geometry, material)
    scene.add(cube)
    cube.position.x = x
    return cube
  }

  const cubes = [
    makeInstance(geometry, 0x44aa88, 0),
    makeInstance(geometry, 0x8844aa, - 2),
    makeInstance(geometry, 0xaa8844, 2),
  ]

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