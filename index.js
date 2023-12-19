import * as THREE from './Three JS/build/three.module.js'
import { OrbitControls } from './Three JS/examples/jsm/controls/OrbitControls.js'

const popup = document.getElementById('popup');
const xButton = document.getElementById('closeButton');

let scene, orbitCam, normalCam, currentCam, renderer, controls
let sun, mercury, venus, earth, mars, jupiter, saturn, uranus, neptune
const textureLoader = new THREE.TextureLoader()

scene = new THREE.Scene()
scene.background = textureLoader.load("./assets/stars_milky_way.jpg")
const fov = 45
const width = window.innerWidth
const height = window.innerHeight
const aspect = width / height
orbitCam = new THREE.PerspectiveCamera(fov, aspect, 0.1, 1000)
normalCam = new THREE.PerspectiveCamera(fov, aspect, 0.1, 1000)

orbitCam.position.set(-90, 140, 140)
normalCam.position.set(-90, 140, 140)
normalCam.lookAt(0, 0, 0)
currentCam = normalCam
renderer = new THREE.WebGLRenderer({ antialias: true })
controls = new OrbitControls(orbitCam, renderer.domElement)
controls.update()
document.body.appendChild(renderer.domElement)

//create sun
const sunGeo = new THREE.SphereGeometry(16, 30, 30);
const sunMat = new THREE.MeshBasicMaterial({
    map: textureLoader.load("./assets/sun.jpg")
});
sun = new THREE.Mesh(sunGeo, sunMat);
sun.userData = {
    isClickable: true,
};
sun.name = 'Sun'
scene.add(sun);

// Sunlight
const pointLight = new THREE.PointLight(0xFFFFFF, 2, 300);
scene.add(pointLight);

//Light
const ambientLight = new THREE.AmbientLight(0x333333);
scene.add(ambientLight);

function createPlanet(map, size, x, planetName, ring) {
    const texture = textureLoader.load(map)
    const geo = new THREE.SphereGeometry(size, 30, 30)
    const mat = new THREE.MeshStandardMaterial({
        map: texture
    })
    const mesh = new THREE.Mesh(geo, mat)
    const obj = new THREE.Object3D()
    obj.add(mesh)

    if (ring) {
        const ringGeo = new THREE.RingGeometry(
            ring.innerRadius,
            ring.outerRadius,
            32);
        const ringMat = new THREE.MeshBasicMaterial({
            map: textureLoader.load(ring.texture),
            side: THREE.DoubleSide
        });
        ringMat.transparent = true;
        ringMat.blending = THREE.AdditiveBlending;
        const ringMesh = new THREE.Mesh(ringGeo, ringMat);
        obj.add(ringMesh);
        ringMesh.position.x = x;
        ringMesh.rotation.x = -0.5 * Math.PI;
    }

    mesh.position.x = x
    mesh.userData = { isClickable: true };
    mesh.name = planetName

    scene.add(obj)

    return { mesh: mesh, obj: obj }
}

mercury = createPlanet("./assets/mercury.jpg", 3.2, 28, 'Mercury')
venus = createPlanet("./assets/venus.jpg", 5.8, 44, 'Venus')
earth = createPlanet("./assets/earth.jpg", 6, 62, 'Earth')
mars = createPlanet("./assets/mars.jpg", 4, 78, 'Mars')
jupiter = createPlanet("./assets/jupiter.jpg", 12, 100, 'Jupiter')
saturn = createPlanet("./assets/saturn.jpg", 10, 138, 'Saturn', {
    innerRadius: 10,
    outerRadius: 20,
    texture: "./assets/saturn_ring.png"
})
uranus = createPlanet("./assets/uranus.jpg", 7, 176, 'Uranus')
neptune = createPlanet("./assets/neptune.jpg", 7, 200, 'Neptune')

window.addEventListener("keydown", (event) => {
    let key = event.key
    if (key == " ") {
        console.log("SPACE")
        if (currentCam == orbitCam) currentCam = normalCam
        else currentCam = orbitCam
    }

    // controls.target = earth.position

    if (currentCam == normalCam) {
        if (key == "w") {
            //w
            currentCam.position.y += 2
        } else if (key == "a") {
            //a
            currentCam.position.x -= 2
        } else if (key == "s") {
            //s
            currentCam.position.y -= 2
        } else if (key == "d") {
            //d
            currentCam.position.x += 2
        } else if (key == "-") {
            //-(ZOOM OUT)
            currentCam.position.z += 2
        } else if (key == "=") {
            //=(ZOOM IN)
            currentCam.position.z -= 2
        }
    }

})

function animatePlanet() {
    //Rotasi
    sun.rotateY(0.0004);
    mercury.mesh.rotateY(0.0004);
    venus.mesh.rotateY(0.0002);
    earth.mesh.rotateY(0.002);
    mars.mesh.rotateY(0.0018);
    jupiter.mesh.rotateY(0.004);
    saturn.mesh.rotateY(0.0038);
    uranus.mesh.rotateY(0.003);
    neptune.mesh.rotateY(0.0032);

    //Revolusi
    mercury.obj.rotateY(0.004);
    venus.obj.rotateY(0.0015);
    earth.obj.rotateY(0.001);
    mars.obj.rotateY(0.0008);
    jupiter.obj.rotateY(0.0002);
    saturn.obj.rotateY(0.00009);
    uranus.obj.rotateY(0.00004);
    neptune.obj.rotateY(0.00001);

    renderer.render(scene, currentCam);
}

renderer.setAnimationLoop(animatePlanet)

function resize() {
    renderer.setSize(window.innerWidth, window.innerHeight)
    currentCam.aspect = window.innerWidth / window.innerHeight
    currentCam.updateProjectionMatrix()
}

function allEvent() {
    window.addEventListener("resize", resize)

    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    let intersects = [0]; // Initialize as an empty array

    window.addEventListener("mousemove", event => {
        pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
        pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

        raycaster.setFromCamera(pointer, currentCam);
        intersects = raycaster.intersectObjects(scene.children, true);

        if (intersects.length > 0) {
            const clickableObject = intersects[0].object;
            if (clickableObject.userData.isClickable) {
                document.body.style.cursor = 'pointer';
            } else {
                document.body.style.cursor = 'default';
            }
        } else {
            document.body.style.cursor = 'default';
        }
    });
    
    mercury.mesh.metadata = {
        name: 'mercury',
        description: 'The second planet from the Sun. It is named after the Roman goddess of love and beauty.',
        imageSrc: './assets/pearth.png',
    };
    venus.mesh.metadata = {
        name: 'Venus',
        description: 'The second planet from the Sun. It is named after the Roman goddess of love and beauty.',
        imageSrc: './assets/pearth.png',
    };
    earth.mesh.metadata = {
        name: 'earth',
        description: 'The second planet from the Sun. It is named after the Roman goddess of love and beauty.',
        imageSrc: './assets/pearth.png',
    };
    mars.mesh.metadata = {
        name: 'mars',
        description: 'The second planet from the Sun. It is named after the Roman goddess of love and beauty.',
        imageSrc: './assets/pearth.png',
    };
    jupiter.mesh.metadata = {
        name: 'jupiter',
        description: 'The second planet from the Sun. It is named after the Roman goddess of love and beauty.',
        imageSrc: './assets/pearth.png',
    };
    saturn.mesh.metadata = {
        name: 'saturn',
        description: 'The second planet from the Sun. It is named after the Roman goddess of love and beauty.',
        imageSrc: './assets/pearth.png',
    };
    uranus.mesh.metadata = {
        name: 'uranus',
        description: 'The second planet from the Sun. It is named after the Roman goddess of love and beauty.',
        imageSrc: './assets/pearth.png',
    };
    neptune.mesh.metadata = {
        name: 'neptune',
        description: 'The second planet from the Sun. It is named after the Roman goddess of love and beauty.',
        imageSrc: './assets/pearth.png',
    };
    
    function onPlanetClick() {
        if (intersects.length > 0) {
            const clickedObject = intersects[0].object;
            if (clickedObject.userData.isClickable && clickedObject.metadata) {
                const planetMetadata = clickedObject.metadata;
    
                // Ganti isi elemen-elemen popup dengan informasi planet
                document.getElementById('popupTitle').innerText = planetMetadata.name;
                if (popupTitle) {
                    popupTitle.style.color = '#FFFFFF';
                }
                document.getElementById('popupDescription').innerText = planetMetadata.description;
                if (popupDescription) {
                    popupDescription.style.color = '#FFFFFF';
                }
    
                // Ganti sumber gambar popup
                const popupImage = document.getElementById('popupImage');
                if (popupImage) {
                    popupImage.src = planetMetadata.imageSrc;
                }
    
                popup.style.display = 'block';
            }
        }
    }

    function handleClick() {
        event.stopPropagation();
        popup.style.display = 'none';
    }

    xButton.addEventListener('click', handleClick);

    window.addEventListener('click', event => {
        if (intersects.length > 0 && intersects[0].object.userData.isClickable) {
            onPlanetClick();
        } else {
            document.body.style.cursor = 'default';
            popup.style.display = 'none';
        }
    });
}

function init() {
    allEvent()
    animatePlanet()
    resize()
}

init()