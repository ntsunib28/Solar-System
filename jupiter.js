import * as THREE from './Three JS/build/three.module.js'

const aspect = window.innerWidth / window.innerHeight
const cam = new THREE.PerspectiveCamera(70,aspect,1,1000)
cam.position.set(-18, 28, 45)
cam.lookAt(0,0,0)

const scene = new THREE.Scene()
const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setSize(innerWidth,innerHeight)
document.body.appendChild(renderer.domElement)

const ambientLight = new THREE.AmbientLight('white',1)
scene.add(ambientLight);

function createPlanet(map, size, x) {
    const texture = new THREE.TextureLoader().load(map)
    const geo = new THREE.SphereGeometry(size, 30, 30)
    const mat = new THREE.MeshStandardMaterial({
        map: texture
    })
    const mesh = new THREE.Mesh(geo, mat)
    scene.add(mesh)
    const obj = new THREE.Object3D()
    obj.add(mesh)
    mesh.position.x = x
    scene.add(obj)

    return { mesh: mesh, obj: obj }
}

const jupiter = createPlanet("./assets/jupiter.jpg", 6, 0);

function createSatelite(size, x, y, z, map) {
    const sateliteTexture = new THREE.TextureLoader().load(map)
    const sateliteGeo = new THREE.SphereGeometry(size, 30, 30)
    const sateliteMat = new THREE.MeshStandardMaterial({
        map: sateliteTexture
    })
    const sateliteMesh = new THREE.Mesh(sateliteGeo, sateliteMat)
    scene.add(sateliteMesh)
    const sateliteObj = new THREE.Object3D()
    sateliteObj.add(sateliteMesh)

    sateliteMesh.position.set(x, y, z)
    jupiter.obj.add(sateliteObj)

    return { mesh: sateliteMesh, obj: sateliteObj }
}

const ganymede = createSatelite(2.641, 15, 0, 0, './assets/ganymede.jpg')
const callisto = createSatelite(2.41, 25, 0, 0, './assets/callisto.jpg')
const io = createSatelite(1.821, 35, 0, 0, './assets/io.jpg')
const europa = createSatelite(1.821, 45, 0, 0, './assets/europa.jpg')

function render() {
    jupiter.mesh.rotateY(0.002)
    jupiter.mesh.rotateX(0.0002)

    ganymede.mesh.rotateY(-0.001)
    ganymede.mesh.rotateX(0.0005)
    ganymede.obj.rotateY(0.004)

    callisto.mesh.rotateY(-0.001)
    callisto.mesh.rotateX(0.0005)
    callisto.obj.rotateY(0.003)

    io.mesh.rotateY(-0.001)
    io.mesh.rotateX(0.0005)
    io.obj.rotateY(0.002)

    europa.mesh.rotateY(-0.001)
    europa.mesh.rotateX(0.0005)
    europa.obj.rotateY(0.001)
    renderer.render(scene, cam)
}

renderer.setAnimationLoop(render)

function init(){
    render()
}

init()