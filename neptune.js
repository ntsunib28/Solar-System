import * as THREE from './Three JS/build/three.module.js'

const aspect = window.innerWidth / window.innerHeight
const cam = new THREE.PerspectiveCamera(70,aspect,1,1000)
cam.position.set(-18, 28, 28)
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

const neptune = createPlanet("./assets/neptune.jpg", 6, 0);

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
    neptune.obj.add(sateliteObj)

    return { mesh: sateliteMesh, obj: sateliteObj }
}

const triton = createSatelite(1, 18, 0, 0, './assets/triton.jpg');
const proteus = createSatelite(1, 22, 0, 0, './assets/proteus.jpg');
const nereid = createSatelite(1, 26, 0, 0, './assets/Nereid.jpg');
const larissa = createSatelite(1, 30, 0, 0, './assets/larissa.jpg');

function render() {
    neptune.mesh.rotateY(0.002)
    neptune.mesh.rotateX(0.0002)

    triton.mesh.rotateY(0.001)
    triton.mesh.rotateX(-0.0005)
    triton.obj.rotateY(0.002)

    proteus.mesh.rotateY(0.001)
    proteus.mesh.rotateX(-0.0005)
    proteus.obj.rotateY(0.001)

    nereid.mesh.rotateY(0.001)
    nereid.mesh.rotateX(-0.0005)
    nereid.obj.rotateY(0.0005)

    larissa.mesh.rotateY(0.001)
    larissa.mesh.rotateX(-0.0005)
    larissa.obj.rotateY(0.0003)

    renderer.render(scene, cam)
}

renderer.setAnimationLoop(render)

function init(){
    render()
}

init()