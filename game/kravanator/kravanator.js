import { Application } from '../common/engine/Application.js';
import { quat, vec3, mat4 } from '../lib/gl-matrix-module.js';


import { GLTFLoader } from './GLTFLoader.js';
import { Renderer } from './Renderer.js';
import { wasdController } from './wasdController2.js';
import { mouseController } from './mouseController.js';
import { cameraController } from './cameraController.js';
import { Physics } from './Physics.js';

class App extends Application {

    async start() {
        this.loader = new GLTFLoader();
        await this.loader.load('../common/models/planet_cam_ufo.gltf');

        this.scene = await this.loader.loadScene(this.loader.defaultScene);
        this.camera = await this.loader.loadNode('Camera_Orientation');
        this.center_ufo = await this.loader.loadNode('Center_UFO');
        this.center = await this.loader.loadNode('Center');
        this.planet = await this.loader.loadNode('Icosphere.001');
        this.ufo = await this.loader.loadNode('UFO');
        this.cylinder = await this.loader.loadNode('Cylinder.001');
        this.cube = await this.loader.loadNode('Cube.002');
        

        this.pig = await this.loader.loadNode('pig');
        this.pig.value = 2;
        this.cow = await this.loader.loadNode('cow');
        this.cow.value = 3;
        this.duck = await this.loader.loadNode('duck');
        this.duck.value = 1;

        this.pickable = [];
        let tab_node = []
        this.center_ufo.traverse(node_ufo => {
            tab_node.push(node_ufo);
        }); 


        this.arr_zivali = [];
        let positions = [];
        let radius = 1

        for (let i = 0; i < 300; i++) {
            const u = Math.random();
            const v = Math.random();
            const theta = 2 * Math.PI * u;
            const phi = Math.acos(2 * v - 1);
            const x = radius * Math.sin(phi) * Math.cos(theta);
            const y = radius * Math.sin(phi) * Math.sin(theta);
            const z = radius * Math.cos(phi);
          
            positions.push([x, y, z]);
          }

        for(var i=0;i<150;i++){
            this.arr_zivali.push(this.duck.cloneNode());
        }
        for(var i=0;i<90;i++){
            this.arr_zivali.push(this.pig.cloneNode());
        }
        for(var i=0;i<60;i++){
            this.arr_zivali.push(this.cow.cloneNode());
        }

        this.arr_zivali.forEach(function (element, i) {
            let sredina = this.center.translation;
            let pozicija = element.translation;
            let direkcija = vec3.create();

            vec3.sub(direkcija,sredina,pozicija);
            vec3.normalize(direkcija,direkcija);

            this.planet.addChild(element);
            element.translation = positions[i];

            const rotation = quat.create();
            quat.rotationTo(rotation, direkcija, sredina /*<--tle?*/);

            element.rotation = rotation;
            this.scene.addNode(element);
        }.bind(this));
            
          
        if (!this.scene || !this.camera) {
            throw new Error('Scene or Camera not present in glTF');
        }

        if (!this.camera.camera) {
            throw new Error('Camera node does not contain a camera reference');
        }

        this.controller = new wasdController(this.center, this.canvas);
        this.controller2 = new mouseController(this.center_ufo, this.canvas, this.arr_zivali);
        //this.controller3 = new cameraController(this.camera, this.canvas);
        this.physics = new Physics(this.scene, this.planet, this.center_ufo, this.cylinder, tab_node);

        this.time = performance.now();
        this.startTime = this.time;

        this.renderer = new Renderer(this.gl);
        this.renderer.prepareScene(this.scene);
        this.resize();
    }

    update() {
        this.time = performance.now();
        const dt = (this.time - this.startTime) * 0.001;
        this.startTime = this.time;
        this.pickable = this.physics.update(dt);
        this.controller2.update(dt);
        this.controller.update(dt,this.pickable, this.arr_zivali);
        //this.controller3.update(dt);
    }

    render() {
        if (this.renderer) {
            this.renderer.render(this.scene, this.camera);
        }
    }

    resize() {
        const w = this.canvas.clientWidth;
        const h = this.canvas.clientHeight;
        const aspectRatio = w / h;

        if (this.camera) {
            this.camera.camera.aspect = aspectRatio;
            this.camera.camera.updateMatrix();
        }
    }

}

const canvas = document.querySelector('canvas');
const app = new App(canvas);
await app.init();
document.querySelector('.loader-container').remove();
