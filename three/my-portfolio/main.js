import * as THREE from "three";
import * as dat from "dat.gui";
import { Vector2 } from "three";

let mouse = {
  x:undefined,
  y:undefined
}

const gui = new dat.GUI();
const world = {
  plane: {
    width: 35,
    height: 35,
    heightSegments: 30,
    widthSegments: 30,
  },
};
gui.add(world.plane, "width", 1, 50).onChange(() => {
  generatePlane();
});
gui.add(world.plane, "height", 1, 50).onChange(() => {
  generatePlane();
});
gui.add(world.plane, "heightSegments", 1, 50).onChange(() => {
  generatePlane();
});
gui.add(world.plane, "widthSegments", 1, 50).onChange(() => {
  generatePlane();
});

function generatePlane() {
  planeMesh.geometry.dispose();
  planeMesh.geometry = new THREE.PlaneGeometry(
    world.plane.width,
    world.plane.height,
    world.plane.widthSegments,
    world.plane.heightSegments
    );
    const { array } = planeMesh.geometry.attributes.position;
    for (let i = 0; i < array.length; i += 3) {
      const x = array[i];
      const y = array[i + 1];
      const z = array[i + 2];
      
      array[i + 2] = z + Math.random();
    }

        const colors = []
    for(let i = 0; i< planeMesh.geometry.attributes.position.count;i++){
      colors.push(0,0.19,0.4)
    }
    planeMesh.geometry.setAttribute('color', 
      new THREE.BufferAttribute(new Float32Array(colors), 
        3
      )
    )
  }
  
  const raycaster = new THREE.Raycaster()
  const scene = new THREE.Scene();
  
  const camera = new THREE.PerspectiveCamera(
    110,
    innerWidth / innerHeight,
    0.1,
    1000
    );
    const renderer = new THREE.WebGLRenderer();
    renderer.domElement.style.backgroundColor = "black";
    renderer.setSize(innerWidth, innerHeight);
    movingAndRotating()
    renderer.setPixelRatio(devicePixelRatio);
    document.body.appendChild(renderer.domElement);
    
    camera.position.z = 5;
    
    const planeGeometry = new THREE.PlaneGeometry(world.plane.width, world.plane.height, world.plane.widthSegments, world.plane.heightSegments);
    const planeMaterial = new THREE.MeshPhongMaterial({
      side: THREE.DoubleSide,
      flatShading: true,
      vertexColors: true
    });
    const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);
    scene.add(planeMesh);
    const { array } = planeMesh.geometry.attributes.position;
    let arrayCopy = [...array]
    let rotate = planeMesh.rotation
    console.log(rotate)
    for (let i = 0; i < array.length; i += 3) {
      const x = array[i];
      const y = array[i + 1];
      const z = array[i + 2];
      
      array[i + 2] = z + Math.random();
    }

    const colors = []
    for(let i = 0; i< planeMesh.geometry.attributes.position.count;i++){
      colors.push(0,0.19,0.4)
    }
    planeMesh.geometry.setAttribute('color', 
      new THREE.BufferAttribute(new Float32Array(colors), 
        3
      )
    )
    
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(0, 0, 1);
    scene.add(light);
    const light2 = new THREE.DirectionalLight(0xffffff, 1);
    light2.position.set(0, 0, -1);
    scene.add(light2);
    
    function animate() {
      
      requestAnimationFrame(animate);
      
      renderer.render(scene, camera);

      for(let i = 0; i< planeMesh.geometry.attributes.color.count*3;i+=3){
        const { array } = planeMesh.geometry.attributes.color
        let initColor = [0,0.19,0.4]
        array[i] += (initColor[0] - array[i])/100
        array[i+1] += (initColor[1] - array[i+1])/100
        array[i+2] += (initColor[2] - array[i+2])/100

        planeMesh.geometry.attributes.color.needsUpdate = true
      }

      raycaster.setFromCamera(mouse, camera)
      const intersects = raycaster.intersectObject(planeMesh)
      
      if (intersects.length > 0 ) {
        const { color } = intersects[0].object.geometry.attributes
        color.setX(intersects[0].face.a, 0.1)
        color.setY(intersects[0].face.a, 0.5)
        color.setZ(intersects[0].face.a, 1)

        color.setX(intersects[0].face.b, 0.1)
        color.setY(intersects[0].face.b, 0.5)
        color.setZ(intersects[0].face.b, 1)


        color.setX(intersects[0].face.c, 0.1)
        color.setY(intersects[0].face.c, 0.5)
        color.setZ(intersects[0].face.c, 1)
        
        intersects[0].object.geometry.attributes.color.needsUpdate = true

        
      }
      
    } 
    animate();
    
    addEventListener('mousemove', (e) => {
      mouse.x = (e.clientX/innerWidth) * 2 -1
      mouse.y = -((e.clientY/innerHeight) * 2 -1)
      console.log(mouse)
    })

    function movingAndRotating(){
      let clicked = {
        left:false,
        right:false
      };
      let clickPositions = {
        left: [0, 0],
        right:[0, 0]
      };
      let currentPosition = [0, 0];

      renderer.domElement.addEventListener("mousedown", (e) => {
        if(e.button == 2) {
          clicked.right = true
          clickPositions.right = [e.offsetX, e.offsetY];
          
          console.log(2)
        } 
        if(e.button == 0) {
          clicked.left = true
          const { array } = planeMesh.geometry.attributes.position;
          arrayCopy = [...array]
        }
        clickPositions.left = [e.offsetX, e.offsetY];
      });
      renderer.domElement.addEventListener("mouseup", (e) => {
        if(e.button == 2) {
          clicked.right = false
          console.log(3)
        } 
        if(e.button == 0) {
          clicked.left = false
        }
        clickPositions.left = [0, 0];
        clickPositions.right = [0, 0];
      });
      renderer.domElement.addEventListener("mousemove", (e) => {
        currentPosition = [e.clientX, e.clientY]
        if(clicked.right) {
          planeMesh.rotation.x = rotate.x - (clickPositions.right[1] - currentPosition[1])/100;
          planeMesh.rotation.y = rotate.y - (clickPositions.right[0] - currentPosition[0])/100;


          clickPositions.right = [e.offsetX, e.offsetY];
        }
        if (clicked.left) {
          planeMesh.geometry.dispose();
          const { array } = planeMesh.geometry.attributes.position;
          for (let i = 0; i < array.length; i += 3) {
            const x = array[i];
            const y = array[i + 1];
            const z = array[i + 2];
            
            array[i] = arrayCopy[i] - (clickPositions.left[0] - currentPosition[0])/80
            array[i+1] = arrayCopy[i+1] + (clickPositions.left[1] - currentPosition[1])/80
          }
          
        }
      });
    }