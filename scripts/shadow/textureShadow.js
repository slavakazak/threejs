import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

function main() {
  //рендерер
  const canvas = document.querySelector('#canvas')
  const renderer = new THREE.WebGLRenderer({ antialias: true, canvas })
  renderer.setClearColor(0x212121)
  //сцена
  const scene = new THREE.Scene()
  scene.background = new THREE.Color('white')
  //камера
  const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000)
  camera.position.set(0, 10, 20)
  const controls = new OrbitControls(camera, canvas)
  controls.target.set(0, 5, 0)
  controls.update()
  //плоскость
  const loader = new THREE.TextureLoader()
  {
    const planeSize = 40
    const texture = loader.load('../../img/checker.png')
    texture.wrapS = THREE.RepeatWrapping
    texture.wrapT = THREE.RepeatWrapping
    texture.magFilter = THREE.NearestFilter
    texture.colorSpace = THREE.SRGBColorSpace
    const repeats = planeSize / 2
    texture.repeat.set(repeats, repeats)
    const planeGeo = new THREE.PlaneGeometry(planeSize, planeSize)
    const planeMat = new THREE.MeshBasicMaterial({
      map: texture,
      side: THREE.DoubleSide,
    })
    planeMat.color.setRGB(1.5, 1.5, 1.5)
    const mesh = new THREE.Mesh(planeGeo, planeMat)
    mesh.rotation.x = Math.PI * -.5
    scene.add(mesh)
  }
  //тень
  const shadowTexture = loader.load('../../img/roundshadow.png')
  const planeSize = 1
  const shadowGeo = new THREE.PlaneGeometry(planeSize, planeSize)
  //сфера
  const sphereRadius = 1
  const sphereWidthDivisions = 32
  const sphereHeightDivisions = 16
  const sphereGeo = new THREE.SphereGeometry(sphereRadius, sphereWidthDivisions, sphereHeightDivisions)
  //сферы с тенями
  const sphereShadowBases = []
  const numSpheres = 15
  for (let i = 0; i < numSpheres; ++i) {
    const base = new THREE.Object3D()
    scene.add(base)
    const shadowMat = new THREE.MeshBasicMaterial({ map: shadowTexture, transparent: true, depthWrite: false })
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat)
    shadowMesh.position.y = 0.001
    shadowMesh.rotation.x = Math.PI * -.5
    const shadowSize = sphereRadius * 4
    shadowMesh.scale.set(shadowSize, shadowSize, shadowSize)
    base.add(shadowMesh)

    const u = i / numSpheres
    const sphereMat = new THREE.MeshPhongMaterial();
    sphereMat.color.setHSL(u, 1, .75)
    const sphereMesh = new THREE.Mesh(sphereGeo, sphereMat)
    sphereMesh.position.set(0, sphereRadius + 2, 0)
    base.add(sphereMesh)

    sphereShadowBases.push({ base, sphereMesh, shadowMesh, y: sphereMesh.position.y })
  }
  //свет
  {
    const light = new THREE.HemisphereLight(0xB1E1FF, 0xB1E1FF, 2)
    scene.add(light)
  }
  {
    const light = new THREE.DirectionalLight(0xFFFFFF, 1)
    light.position.set(0, 10, 5)
    light.target.position.set(-5, 0, 0)
    scene.add(light)
    scene.add(light.target)
  }
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

    sphereShadowBases.forEach((sphereShadowBase, ndx) => {
      const { base, sphereMesh, shadowMesh, y } = sphereShadowBase
      const u = ndx / sphereShadowBases.length
      const speed = time * .2
      const angle = speed + u * Math.PI * 2 * (ndx % 1 ? 1 : -1)
      const radius = Math.sin(speed - ndx) * 10
      base.position.set(Math.cos(angle) * radius, 0, Math.sin(angle) * radius)
      const yOff = Math.abs(Math.sin(time * 2 + ndx))
      sphereMesh.position.y = y + THREE.MathUtils.lerp(-2, 2, yOff)
      shadowMesh.material.opacity = THREE.MathUtils.lerp(1, .25, yOff)
    })

    renderer.render(scene, camera)
    requestAnimationFrame(render)
  }
  requestAnimationFrame(render)
}
main()
