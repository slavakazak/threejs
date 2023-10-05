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
  camera.position.z = 50
  camera.lookAt(0, 0, 0)
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
    new THREE.MeshBasicMaterial({ map: loadColorTexture('../img/brick.jpg') }),
    new THREE.MeshBasicMaterial({ map: loadColorTexture('../img/textile.jpg') }),
    new THREE.MeshBasicMaterial({ map: loadColorTexture('../img/marble.jpg') }),
    new THREE.MeshBasicMaterial({ map: loadColorTexture('../img/tree.jpg') }),
    new THREE.MeshBasicMaterial({ map: loadColorTexture('../img/metal.jpg') }),
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
    cubes.forEach((cube, ndx) => {
      const speed = .2 + ndx * .1
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
