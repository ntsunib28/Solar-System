import * as THREE from './Three JS/build/three.module.js'
import { OrbitControls } from './Three JS/examples/jsm/controls/OrbitControls.js'

const aspect = window.innerWidth / window.innerHeight
const cam = new THREE.PerspectiveCamera(70,aspect,1,1000)
cam.position.set(-18, 28, 40)
cam.lookAt(0,0,0)

const scene = new THREE.Scene()
scene.background = new THREE.TextureLoader().load("./assets/stars_milky_way.jpg")
const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setSize(innerWidth,innerHeight)
let controls
controls = new OrbitControls(cam, renderer.domElement)
controls.enableZoom = false
controls.update()
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

const uranus = createPlanet("./assets/uranus.jpg", 6, 0);

function createSatelite(map, x, y, z, size) {
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
    uranus.obj.add(sateliteObj)

    return { mesh: sateliteMesh, obj: sateliteObj }
}

const miranda = createSatelite('./assets/miranda.jpg', 8.64, 0, 0, 0.968);
const ariel = createSatelite('./assets/ariel.jpg', 24.93, 0, 0, 0.728);
const umbriel = createSatelite('./assets/umbriel.jpg', 32.62, 0, 0, 0.586);
const titania = createSatelite('./assets/titania.jpg', 18.24, 0, 0, 0.4888);
const oberon = createSatelite('./assets/oberon.jpg', 21.78, 0, 0, 0.4092);

function render() {
    uranus.mesh.rotateY(0.002)
    uranus.mesh.rotateX(0.0002)

    miranda.mesh.rotateY(-0.001)
    miranda.mesh.rotateX(0.0005)
    miranda.obj.rotateY(0.004)

    ariel.mesh.rotateY(-0.001)
    ariel.mesh.rotateX(0.0005)
    ariel.obj.rotateY(0.003)

    umbriel.mesh.rotateY(-0.001)
    umbriel.mesh.rotateX(0.0005)
    umbriel.obj.rotateY(0.0025)

    titania.mesh.rotateY(-0.001)
    titania.mesh.rotateX(0.0005)
    titania.obj.rotateY(0.0015)

    oberon.mesh.rotateY(-0.001)
    oberon.mesh.rotateX(0.0005)
    oberon.obj.rotateY(0.001)
    renderer.render(scene, cam)
}

renderer.setAnimationLoop(render)

function resize() {
    renderer.setSize(window.innerWidth, window.innerHeight)
    cam.aspect = window.innerWidth / window.innerHeight
    cam.updateProjectionMatrix()
}
window.addEventListener("resize", resize)

function init(){
    render()
    resize()
}

init()