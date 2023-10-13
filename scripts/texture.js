import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { GUI } from 'three/addons/libs/lil-gui.module.min.js'

function main() {
  //рендерер
  const canvas = document.querySelector('#canvas')
  const renderer = new THREE.WebGLRenderer({ antialias: true, canvas })
  renderer.setClearColor(0x212121)
  //сцена
  const scene = new THREE.Scene()
  //камера
  const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000)
  camera.position.z = 50
  camera.lookAt(0, 0, 0)

  const controls = new OrbitControls(camera, canvas)
  controls.target.set(0, 0, 0)
  controls.update()
  //
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
    folder.open()
  }
  //свет
  {
    const light = new THREE.DirectionalLight(0xFFFFFF, 3)
    light.position.set(10, 10, 10)
    scene.add(light)

    const helper = new THREE.DirectionalLightHelper(light)
    scene.add(helper)

    function updateLight() {
      light.target.updateMatrixWorld()
      helper.update()
    }
    updateLight()

    const gui = new GUI()
    gui.addColor(new ColorGUIHelper(light, 'color'), 'value').name('color')
    gui.add(light, 'intensity', 0, 5, 0.01)
    makeXYZGUI(gui, light.position, 'position', updateLight)
    makeXYZGUI(gui, light.target.position, 'target', updateLight)
  }
  //куб
  const geometry = new THREE.BoxGeometry(10, 10, 10)
  const cubes = []
  //текстура
  const loader = new THREE.TextureLoader()
  function loadColorTexture(path) {
    const texture = loader.load(path)
    texture.colorSpace = THREE.SRGBColorSpace
    return texture
  }
  //материал
  const materials = [
    new THREE.MeshBasicMaterial({ map: loadColorTexture('../img/textile.jpg') }),
    new THREE.MeshBasicMaterial({ map: loadColorTexture('../img/marble.jpg') }),
    new THREE.MeshBasicMaterial({ map: loadColorTexture('../img/tree.jpg') }),
    new THREE.MeshBasicMaterial({ map: loadColorTexture('../img/metal.jpg') }),
    new THREE.MeshStandardMaterial({ map: loadColorTexture('../img/gray_rocks_diff_4k.jpg'), bumpMap: loader.load('../img/gray_rocks_disp_4k.png'), bumpScale: 0.7 }),
    new THREE.MeshBasicMaterial({ map: loadColorTexture('../img/grass.jpg') }),
  ];
  //добавить куб
  const cube = new THREE.Mesh(geometry, materials)
  scene.add(cube)
  cubes.push(cube)
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
    time *= 0.001
    //адаптивность
    if (resizeRendererToDisplaySize(renderer)) {
      const canvas = renderer.domElement
      camera.aspect = canvas.clientWidth / canvas.clientHeight
      camera.updateProjectionMatrix()
    }
    //вращение
    // cubes.forEach((cube, ndx) => {
    //   const speed = .2 + ndx * .1
    //   const rot = time * speed
    //   cube.rotation.x = rot
    //   cube.rotation.y = rot
    // })

    renderer.render(scene, camera)
    requestAnimationFrame(render)
  }
  requestAnimationFrame(render)
}
main()
