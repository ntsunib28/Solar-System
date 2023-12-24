import * as THREE from './Three JS/build/three.module.js'

const aspect = window.innerWidth / window.innerHeight
const cam = new THREE.PerspectiveCamera(70,aspect,1,1000)
cam.position.set(0, 0, 20)
cam.lookAt(0,0,0)

const scene = new THREE.Scene()
const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setSize(innerWidth,innerHeight)
document.body.appendChild(renderer.domElement)

const ambientLight = new THREE.AmbientLight('white',1)
scene.add(ambientLight);

function createPlanet(map, size, x, planetName) {
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
    mesh.name = planetName

    scene.add(obj)

    return { mesh: mesh, obj: obj }
}

const mars = createPlanet("./assets/mars.jpg", 6, 0, 'Mars');

function render() {
    mars.mesh.rotateY(0.002)
    mars.mesh.rotateX(0.0002)
    renderer.render(scene, cam)
}

renderer.setAnimationLoop(render)

function init(){
    render()
}

init()