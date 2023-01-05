import { Application } from '../common/engine/Application.js';

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
        let radius = 42;
        for (let i = 0; i < 20; i++) {
            const angle1 = Math.random() * 2 * Math.PI;
            const angle2 = Math.random() * Math.PI;
            const x = radius * Math.sin(angle2) * Math.cos(angle1);
            const y = radius * Math.sin(angle2) * Math.sin(angle1);
            const z = radius * Math.cos(angle2);

            positions.push([x, y, z]);
            this.arr_zivali.push(this.pig.cloneNode());
        }
        this.arr_zivali.forEach(function (element, i) {
            element.translation = positions[i];
            //this.scene.addNode(element);
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
        this.controller.update(dt,this.pickable);
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
