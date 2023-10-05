import * as THREE from 'three'
import { GUI } from 'three/addons/libs/lil-gui.module.min.js'

function main() {
  //рендерер
  const canvas = document.querySelector('#canvas')
  const renderer = new THREE.WebGLRenderer({ antialias: true, canvas })
  renderer.setClearColor(0x212121)
  const gui = new GUI()
  //сцена
  const scene = new THREE.Scene()
  //камера
  const camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 1000)
  camera.position.set(0, 0, 50)
  camera.lookAt(0, 0, 0)
  //свет
  const light = new THREE.DirectionalLight(0xffffff, 3)
  light.position.set(50, 50, 50)
  scene.add(light)
  //цвет
  const color = 0xFFFF00
  //материалы
  const basicMaterial = new THREE.MeshBasicMaterial({ color })
  const lambertMaterial = new THREE.MeshLambertMaterial({ color })
  const phongMaterial = new THREE.MeshPhongMaterial({ color, shininess: 30 })
  const toonMaterial = new THREE.MeshToonMaterial({ color })
  const standardMaterial = new THREE.MeshStandardMaterial({ color, roughness: 0, metalness: 0 })
  const physicalMaterial = new THREE.MeshPhysicalMaterial({ color, roughness: 0, metalness: 0, clearcoat: 0, clearCoatRoughness: 0 })

  //сфера
  const sphereGeometry = new THREE.SphereGeometry(4, 12, 12)
  const sphereMesh = new THREE.Mesh(sphereGeometry, basicMaterial)
  scene.add(sphereMesh)

  const helper = {
    lightX: 50,
    lightY: 50,
    lightZ: 50,
    material: basicMaterial,
    shininess: 30,
    roughness: 0,
    metalness: 0,
    clearcoat: 0,
    clearCoatRoughness: 0,
    flatShading: false
  }
  gui.add(helper, 'lightX', -50, 50).name('lightX')
  gui.add(helper, 'lightY', -50, 50).name('lightY')
  gui.add(helper, 'lightZ', -50, 50).name('lightZ')
  const material = gui.add(helper, 'material', { basicMaterial, lambertMaterial, phongMaterial, toonMaterial, standardMaterial, physicalMaterial })
  const shininess = gui.add(helper, 'shininess', 0, 200).name('shininess').hide()
  const roughness = gui.add(helper, 'roughness', 0, 1).name('roughness').hide()
  const metalness = gui.add(helper, 'metalness', 0, 1).name('metalness').hide()
  const clearcoat = gui.add(helper, 'clearcoat', 0, 1).name('clearcoat').hide()
  const clearCoatRoughness = gui.add(helper, 'clearCoatRoughness', 0, 1).name('clearCoatRoughness').hide()
  gui.add(helper, 'flatShading').name('flatShading')
  material.onChange(value => {
    if (value.type == 'MeshPhongMaterial') {
      shininess.show()
    } else {
      shininess.hide()
    }
    if (value.type == 'MeshStandardMaterial' || value.type == 'MeshPhysicalMaterial') {
      roughness.show()
      metalness.show()
    } else {
      roughness.hide()
      metalness.hide()
    }
    if (value.type == 'MeshPhysicalMaterial') {
      clearcoat.show()
      clearCoatRoughness.show()
    } else {
      clearcoat.hide()
      clearCoatRoughness.hide()
    }
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
  function animate(time) {
    time *= 0.001
    if (resizeRendererToDisplaySize(renderer)) {
      const canvas = renderer.domElement
      camera.aspect = canvas.clientWidth / canvas.clientHeight
      camera.updateProjectionMatrix()
    }

    light.position.set(helper.lightX, helper.lightY, helper.lightZ)
    sphereMesh.material = helper.material
    if (sphereMesh.material.type == 'MeshPhongMaterial') {
      sphereMesh.material.shininess = helper.shininess
    }
    if (sphereMesh.material.type == 'MeshStandardMaterial' || sphereMesh.material.type == 'MeshPhysicalMaterial') {
      sphereMesh.material.roughness = helper.roughness
      sphereMesh.material.metalness = helper.metalness
    }
    if (sphereMesh.material.type == 'MeshPhysicalMaterial') {
      sphereMesh.material.clearcoat = helper.clearcoat
      sphereMesh.material.clearCoatRoughness = helper.clearCoatRoughness
    }
    sphereMesh.material.flatShading = helper.flatShading
    sphereMesh.material.needsUpdate = true

    sphereMesh.rotation.y = time

    renderer.render(scene, camera)
    requestAnimationFrame(animate)
  }
  requestAnimationFrame(animate)
}
main()