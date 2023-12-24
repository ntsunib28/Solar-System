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

// light buat sun
const pointLight = new THREE.PointLight(0xFFFFFF, 2, 300)
scene.add(pointLight);

// light keseluruhan
const ambientLight = new THREE.AmbientLight(0x333333)
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
        ringMesh.rotation.x = -0.5 * Math.PI
    }

    mesh.position.x = x
    mesh.userData = { isClickable: true }
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
    sun.rotateY(0.0004)
    mercury.mesh.rotateY(0.0004)
    venus.mesh.rotateY(0.0002)
    earth.mesh.rotateY(0.002)
    mars.mesh.rotateY(0.0018)
    jupiter.mesh.rotateY(0.004)
    saturn.mesh.rotateY(0.0038)
    uranus.mesh.rotateY(0.003)
    neptune.mesh.rotateY(0.0032)

    //Revolusi
    mercury.obj.rotateY(0.004)
    venus.obj.rotateY(0.0015)
    earth.obj.rotateY(0.001)
    mars.obj.rotateY(0.0008)
    jupiter.obj.rotateY(0.0002)
    saturn.obj.rotateY(0.00009)
    uranus.obj.rotateY(0.00004)
    neptune.obj.rotateY(0.00001)

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
    let intersects = [0]

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
    
    sun.metadata = {
        name: 'Sun',
        description: 'The Sun is a star at the center of the Solar System.It is a nearly perfect sphere of hot plasma, with internal convective motion that generates a magnetic field via a dynamo process. The Sun is by far the most important source of energy for life on Earth, providing the warmth and light that make our planet habitable',
        volume: 'Volume: 1.41 x 10¹⁸ km³',
        mass: 'Mass: 1.9885 x 10³⁰ kg',
        gravity: 'Gravity: 274 m/s²',
        temperature: 'Temperature: 15,600,000°C',
        imageSrc: './assets/psun.png',
    };
    mercury.mesh.metadata = {
        name: 'Mercury',
        description: 'Mercury is the smallest planet in the Solar System and the closest to the Sun. It has a heavily cratered surface and no atmosphere to speak of. It is named after the Roman messenger god Mercury, who was known for his speed',
        volume: 'Volume: 6.083 x 10¹⁰ km³',
        mass: 'Mass: 3.3011 x 10²³ kg',
        gravity: 'Gravity: 3.7 m/s²',
        temperature: 'Temperature: -173°C at night to 427°C during the day',
        imageSrc: './assets/pmercury.png',
    };
    venus.mesh.metadata = {
        name: 'Venus',
        description: 'Venus is the second planet from the Sun and is often referred to as the Earth’s sister planet due to their similar size, mass, and composition. Venus has a thick atmosphere that traps heat, making it the hottest planet in the Solar System. It is named after the Roman goddess of love and beauty.',
        volume: 'Volume: 9.2843 x 10¹¹ km³',
        mass: 'Mass: 4.8675 x 10²⁴ kg',
        gravity: 'Gravity: 8.87 m/s²',
        temperature: 'Temperature: 462°C',
        imageSrc: './assets/pvenus.png',
    };
    earth.mesh.metadata = {
        name: 'Earth',
        description: ' Earth is the third planet from the Sun and the only known planet to support life. It has a complex and dynamic system of interacting components, including the atmosphere, hydrosphere, biosphere, and geosphere. Earth is named after the Germanic word for “ground” or “soil” .',
        volume: 'Volume: 1.08321 x 10¹² km³',
        mass: 'Mass: 5.9724 x 10²⁴ kg',
        gravity: 'Gravity: 9.807 m/s²',
        temperature: 'Temperature: Avg 15°C',
        imageSrc: './assets/pearth.png',
    };
    mars.mesh.metadata = {
        name: 'Mars',
        description: 'Mars is the fourth planet from the Sun and is often called the “Red Planet” due to its reddish appearance in the night sky. It has a thin atmosphere and a cold, desert-like surface. Mars is named after the Roman god of war.',
        volume: 'Volume: 1.6318 x 10¹¹ km³',
        mass: 'Mass: 6.4171 x 10²³ kg',
        gravity: 'Gravity: 3.71 m/s²',
        temperature: 'Temperature: -63°C',
        imageSrc: './assets/pmars.png',
    };
    jupiter.mesh.metadata = {
        name: 'Jupiter',
        description: 'Jupiter is the largest planet in the Solar System and is known for its distinctive banded appearance and the Great Red Spot, a giant storm that has been raging for centuries. It has a strong magnetic field and many moons, including the four largest known as the Galilean moons. Jupiter is named after the king of the Roman gods.',
        volume: 'Volume: 1.4313 x 10¹⁵ km³',
        mass: 'Mass: 1.8982 x 10²⁷ kg',
        gravity: 'Gravity: 24.79 m/s²',
        temperature: 'Temperature: -145°C',
        imageSrc: './assets/pjupiter.png',
    };
    saturn.mesh.metadata = {
        name: 'Saturn',
        description: 'Saturn is the sixth planet from the Sun and is known for its beautiful rings, which are made up of countless particles of ice and rock. It has a complex system of moons, including the largest moon in the Solar System, Titan. Saturn is named after the Roman god of agriculture.',
        volume: 'Volume: 8.2713 x 10¹⁴ km³',
        mass: 'Mass: 5.6834 x 10²⁶ kg',
        gravity: 'Gravity: 10.44 m/s²',
        temperature: 'Temperature: -178°C',
        imageSrc: './assets/psaturn.png',
    };
    uranus.mesh.metadata = {
        name: 'Uranus',
        description: 'Uranus is the seventh planet from the Sun and is unique among the planets in that it rotates on its side. It has a faint ring system and a number of small moons. Uranus is named after the Greek god of the sky.',
        volume: 'Volume: 6.833 x 10¹³ km³',
        mass: 'Mass: 8.682 x 10²⁵ kg',
        gravity: 'Gravity: 8.69 m/s²',
        temperature: 'Temperature: -195°C',
        imageSrc: './assets/puranus.png',
    };
    neptune.mesh.metadata = {
        name: 'Neptune',
        description: 'Neptune is the eighth and farthest planet from the Sun. It has a deep blue color due to the presence of methane in its atmosphere. Neptune has a complex system of rings and many moons, including the largest known as Triton. Neptune is named after the Roman god of the sea.',
        volume: 'Volume: 6.35 x 10¹³ km³',
        mass: 'Mass: 1.0243 x 10²⁶ kg',
        gravity: 'Gravity: 11.15 m/s²',
        temperature: 'Temperature: -200°C',
        imageSrc: './assets/pneptune.png',
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

                document.getElementById('volume').innerText = planetMetadata.volume;
                if (volume) {
                    volume.style.color = '#FFFFFF';
                }
                document.getElementById('mass').innerText = planetMetadata.mass;
                if (mass) {
                    mass.style.color = '#FFFFFF';
                }
                document.getElementById('gravity').innerText = planetMetadata.gravity;
                if (gravity) {
                    gravity.style.color = '#FFFFFF';
                }
                document.getElementById('temp').innerText = planetMetadata.temperature;
                if (temp) {
                    temp.style.color = '#FFFFFF';
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
