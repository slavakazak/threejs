import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

function main() {
  const canvas = document.querySelector('#canvas')
  const renderer = new THREE.WebGLRenderer({ antialias: true, canvas })
  renderer.shadowMap.enabled = true
  renderer.setClearColor(0x212121)
  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000)
  camera.position.z = 150
  camera.lookAt(0, 0, 0)
  const controls = new OrbitControls(camera, canvas)
  controls.target.set(0, 0, 0)
  controls.update()
  //свет
  const lightColor = 0xFFFFFF
  const lightIntensity = 5
  const light = new THREE.DirectionalLight(lightColor, lightIntensity)
  light.position.set(0, 0, 20)
  light.target.position.set(0, 0, 0)
  scene.add(light)
  scene.add(light.target)

  const helper = new THREE.DirectionalLightHelper(light)
  scene.add(helper)
  {
    const color = 0xFFFFFF
    const intensity = 1
    const light = new THREE.AmbientLight(color, intensity)
    scene.add(light)
  }
  //весть куб
  const cube = new THREE.Object3D()
  scene.add(cube)

  const axes = new THREE.AxesHelper(30)
  axes.material.depthTest = false
  axes.renderOrder = 2
  cube.add(axes)
  //детали
  const details = {}
  const size = 10
  const inner = '#616161'
  const red = '#d50000'
  const white = '#f5f5f5'
  const green = '#00c853'
  const orange = '#ff6d00'
  const yellow = '#ffd600'
  const blue = '#2962ff'

  function genDetail(sides) {
    const detail = new THREE.Object3D()
    cube.add(detail)
    details[sides] = detail

    const material = THREE.MeshPhongMaterial
    const parameters = { color: inner, roughness: 1, shininess: 3 }
    const geometry = new THREE.BoxGeometry(size, size, size)
    const materials = [new material(parameters), new material(parameters), new material(parameters), new material(parameters), new material(parameters), new material(parameters)]
    const mesh = new THREE.Mesh(geometry, materials)

    let x = 0, y = 0, z = 0
    if (sides.includes('R')) {
      x = size + 1
      materials[0].color = new THREE.Color(red)
    }
    if (sides.includes('L')) {
      x = -size - 1
      materials[1].color = new THREE.Color(orange)
    }
    if (sides.includes('U')) {
      y = size + 1
      materials[2].color = new THREE.Color(white)
    }
    if (sides.includes('D')) {
      y = -size - 1
      materials[3].color = new THREE.Color(yellow)
    }
    if (sides.includes('F')) {
      z = size + 1
      materials[4].color = new THREE.Color(green)
    }
    if (sides.includes('B')) {
      z = -size - 1
      materials[5].color = new THREE.Color(blue)
    }
    mesh.position.set(x, y, z)
    detail.add(mesh)

    const edges = new THREE.EdgesGeometry(geometry)
    const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: inner }))
    line.position.set(x, y, z)
    detail.add(line)
  }
  genDetail('RUF')
  genDetail('LUF')
  genDetail('RDF')
  genDetail('LDF')
  genDetail('RUB')
  genDetail('LUB')
  genDetail('RDB')
  genDetail('LDB')
  genDetail('UF')
  genDetail('UB')
  genDetail('UR')
  genDetail('UL')
  genDetail('DF')
  genDetail('DB')
  genDetail('DR')
  genDetail('DL')
  genDetail('RF')
  genDetail('LF')
  genDetail('RB')
  genDetail('LB')
  genDetail('U')
  genDetail('D')
  genDetail('R')
  genDetail('L')
  genDetail('F')
  genDetail('B')

  //вращение
  function rotate(detailsSides, rotAxis) {
    detailsSides.forEach(sides => {
      details[sides].rotateOnWorldAxis(...rotAxis)
    })
  }
  function reassign(a, b, c, d) {
    const buff = details[a]
    details[a] = details[b]
    details[b] = details[c]
    details[c] = details[d]
    details[d] = buff
  }
  const ax = {
    x: [1, 0, 0],
    y: [0, 1, 0],
    z: [0, 0, 1]
  }
  function reassignY(steps = 0) {
    if (steps == -1) steps = 3
    if (steps == -2) steps = 2
    if (steps == -3) steps = 1
    for (let i = 0; i < steps; i++) {
      reassign('RUF', 'RUB', 'LUB', 'LUF')
      reassign('UF', 'UR', 'UB', 'UL')
      reassign('RF', 'RB', 'LB', 'LF')
      reassign('RDF', 'RDB', 'LDB', 'LDF')
      reassign('DF', 'DR', 'DB', 'DL')
      reassign('F', 'R', 'B', 'L')
    }
  }
  function reassignX(steps = 0) {
    if (steps == -1) steps = 3
    if (steps == -2) steps = 2
    if (steps == -3) steps = 1
    for (let i = 0; i < steps; i++) {
      reassign('RUF', 'RDF', 'RDB', 'RUB')
      reassign('UR', 'RF', 'DR', 'RB')
      reassign('UF', 'DF', 'DB', 'UB')
      reassign('LUF', 'LDF', 'LDB', 'LUB')
      reassign('UL', 'LF', 'DL', 'LB')
      reassign('F', 'D', 'B', 'U')
    }
  }
  function reassignZ(steps = 0) {
    if (steps == -1) steps = 3
    if (steps == -2) steps = 2
    if (steps == -3) steps = 1
    for (let i = 0; i < steps; i++) {
      reassign('RUF', 'LUF', 'LDF', 'RDF')
      reassign('UF', 'LF', 'DF', 'RF')
      reassign('UR', 'UL', 'DL', 'UR')
      reassign('RUB', 'LUB', 'LDB', 'RDB')
      reassign('UB', 'LB', 'DB', 'RB')
      reassign('U', 'L', 'D', 'R')
    }
  }
  function rotateReassign(a, b, c, d, rotAxis) {
    rotate([a, b, c, d], rotAxis)
    reassign(a, b, c, d)
  }
  function move(side, steps = 1) {
    let rotAxis, corners, edges
    const axis = {
      x: new THREE.Vector3(...ax.x),
      y: new THREE.Vector3(...ax.y),
      z: new THREE.Vector3(...ax.z)
    }
    const angle = Math.PI / 2
    if (side === 'U') {
      rotAxis = [axis.y, -angle]
      corners = ['RUF', 'RUB', 'LUB', 'LUF']
      edges = ['UF', 'UR', 'UB', 'UL']
    } else if (side === 'R') {
      rotAxis = [axis.x, -angle]
      corners = ['RUF', 'RDF', 'RDB', 'RUB']
      edges = ['UR', 'RF', 'DR', 'RB']
    } else if (side === 'F') {
      rotAxis = [axis.z, -angle]
      corners = ['RUF', 'LUF', 'LDF', 'RDF']
      edges = ['UF', 'LF', 'DF', 'RF']
    } else if (side === 'D') {
      rotAxis = [axis.y, angle]
      corners = ['RDF', 'LDF', 'LDB', 'RDB']
      edges = ['DF', 'DL', 'DB', 'DR']
    } else if (side === 'L') {
      rotAxis = [axis.x, angle]
      corners = ['LUF', 'LUB', 'LDB', 'LDF']
      edges = ['UL', 'LB', 'DL', 'LF']
    } else if (side === 'B') {
      rotAxis = [axis.z, angle]
      corners = ['RUB', 'RDB', 'LDB', 'LUB']
      edges = ['UB', 'RB', 'DB', 'LB']
    }
    if (rotAxis && corners && edges) {
      for (let i = 0; i < steps; i++) {
        rotateReassign(...edges, rotAxis)
        rotateReassign(...corners, rotAxis)
        details[side].rotateOnWorldAxis(...rotAxis)
      }
    }
  }
  document.addEventListener('keypress', e => {
    let steps = 1
    if (e.shiftKey) steps = 3
    else if (e.ctrlKey) steps = 2
    if (e.code === "KeyW") move('U', steps)
    if (e.code === "KeyD") move('R', steps)
    if (e.code === "KeyS") move('F', steps)
    if (e.code === "KeyX") move('D', steps)
    if (e.code === "KeyA") move('L', steps)
    if (e.code === "KeyF") move('B', steps)
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
  let h = 1
  let v = 1
  function render(time) {
    if (resizeRendererToDisplaySize(renderer)) {
      const canvas = renderer.domElement
      camera.aspect = canvas.clientWidth / canvas.clientHeight
      camera.updateProjectionMatrix()
    }

    let newH = h
    let newV = v

    const polar = controls.getPolarAngle()
    const azimuthal = controls.getAzimuthalAngle()

    if (polar < Math.PI / 4) {
      light.position.set(0, 20, 0)
    } else if (polar > Math.PI * 3 / 4) {
      light.position.set(0, -20, 0)
    } else {
      if (azimuthal < Math.PI / 4 && azimuthal > -Math.PI / 4) {
        light.position.set(0, 0, 20)
      } else if (azimuthal < -Math.PI / 4 && azimuthal > -Math.PI * 3 / 4) {
        light.position.set(-20, 0, 0)
      } else if (azimuthal < Math.PI * 3 / 4 && azimuthal > Math.PI / 4) {
        light.position.set(20, 0, 0)
      } else {
        light.position.set(0, 0, -20)
      }
    }

    if (azimuthal < Math.PI / 4 && azimuthal > -Math.PI / 4) {
      newH = 1
    } else if (azimuthal < -Math.PI / 4 && azimuthal > -Math.PI * 3 / 4) {
      newH = 4
    } else if (azimuthal < Math.PI * 3 / 4 && azimuthal > Math.PI / 4) {
      newH = 2
    } else {
      newH = 3
    }
    if (polar < Math.PI / 4) {
      newV = 4
    } else if (polar > Math.PI * 3 / 4) {
      newV = 2
    } else {
      newV = 1
    }

    if (newV == 1) {
      reassignX(newV - v)
      reassignY(newH - h)
    } else if (newV == 4) {
      reassignX(newV - v)
      reassignZ(newH - h)
    } else {
      reassignX(newV - v)
      reassignZ(-newH + h)
    }

    if (newV == 4) {
      if (newH == 1) {
        ax.x = [1, 0, 0]
        ax.y = [0, 0, -1]
        ax.z = [0, 1, 0]
      } else if (newH == 2) {
        ax.x = [1, 0, 0]
        ax.y = [0, 0, 1]
        ax.z = [0, 1, 0]
      } else if (newH == 3) {
        ax.x = [-1, 0, 0]
        ax.y = [0, 0, 1]
        ax.z = [0, 1, 0]
      } else {
        ax.x = [0, -1, 0]
        ax.y = [0, 0, 1]
        ax.z = [-1, 0, 0]
      }
    } else if (newV == 2) {
      ax.y = [0, 0, -1]
      if (newH == 1) {
        ax.x = [1, 0, 0]
        ax.z = [0, 1, 0]
      } else if (newH == 2) {
        ax.x = [0, -1, 0]
        ax.z = [1, 0, 0]
      } else if (newH == 3) {
        ax.x = [-1, 0, 0]
        ax.z = [0, -1, 0]
      } else {
        ax.x = [0, 1, 0]
        ax.z = [-1, 0, 0]
      }
    } else {
      ax.y = [0, 1, 0]
      if (newH == 1) {
        ax.x = [1, 0, 0]
        ax.z = [0, 0, 1]
      } else if (newH == 2) {
        ax.x = [0, 0, -1]
        ax.z = [1, 0, 0]
      } else if (newH == 3) {
        ax.x = [-1, 0, 0]
        ax.z = [0, 0, -1]
      } else {
        ax.x = [0, 0, 1]
        ax.z = [-1, 0, 0]
      }
    }

    v = newV
    h = newH

    helper.update()
    renderer.render(scene, camera)
    requestAnimationFrame(render)
  }
  requestAnimationFrame(render)
}
main()