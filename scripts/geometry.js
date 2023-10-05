import * as THREE from 'three'

function main() {
  //рендерер
  const canvas = document.querySelector('#canvas')
  const renderer = new THREE.WebGLRenderer({ antialias: true, canvas })
  renderer.setClearColor(0x212121)
  //сцена
  const scene = new THREE.Scene()
  //камера
  const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000)
  camera.position.set(0, 0, 120)
  camera.lookAt(0, 0, 0)
  //свет
  const light = new THREE.DirectionalLight(0xffffff, 3)
  light.position.set(-1, 2, 4)
  scene.add(light)
  //объекты
  const objects = []
  const spread = 15
  function addObject(x, y, obj) {
    obj.position.x = x * spread
    obj.position.y = y * spread
    scene.add(obj)
    objects.push(obj)
  }
  //материал
  function createMaterial() {
    const material = new THREE.MeshPhongMaterial({ side: THREE.DoubleSide })
    material.color.setHSL(Math.random(), 1, .5)
    return material
  }
  //добавить объект со случайным материалом
  function addSolidGeometry(x, y, geometry) {
    const mesh = new THREE.Mesh(geometry, createMaterial())
    addObject(x, y, mesh)
  }
  //добавить объекты
  addSolidGeometry(-1, -1, new THREE.BoxGeometry(8, 8, 8))
  addSolidGeometry(1, -1, new THREE.SphereGeometry(6, 12, 12))
  addSolidGeometry(-1, 1, new THREE.TorusKnotGeometry(3.5, 1.5, 64, 8, 2, 3))
  addSolidGeometry(1, 1, new THREE.TetrahedronGeometry(7))
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

    objects.forEach((obj, ndx) => {
      const speed = .3 + ndx * .05
      const rot = time * speed
      obj.rotation.x = rot
      obj.rotation.y = rot
    })

    renderer.render(scene, camera)
    requestAnimationFrame(animate)
  }
  requestAnimationFrame(animate)
}
main()