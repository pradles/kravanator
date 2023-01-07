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
        this.cylinder = await this.loader.loadNode('Cone');
        this.hose = await this.loader.loadNode('hose');
        this.flashlight = await this.loader.loadNode('flashlight');
        this.sky = await this.loader.loadNode('Cube.002');
        
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
        let radius = 1

        for (let i = 0; i < 120; i++) {
            const u = Math.random();
            const v = Math.random();
            const theta = 2 * Math.PI * u;
            const phi = Math.acos(2 * v - 1);
            const x = radius * Math.sin(phi) * Math.cos(theta);
            const y = radius * Math.sin(phi) * Math.sin(theta);
            const z = radius * Math.cos(phi);


            const temp = this.duck.cloneNode();
            const prej = vec3.normalize(vec3.create(), vec3.fromValues(temp.translation[0], temp.translation[1], temp.translation[2]));
            temp.translation = [x, y, z];
            const potem = vec3.normalize(vec3.create(), vec3.fromValues(temp.translation[0], temp.translation[1], temp.translation[2]));
            
            const angle = vec3.angle(prej, potem);
            const axis = vec3.cross(vec3.create(), prej, potem);
            temp.rotation = quat.mul(quat.create(), quat.setAxisAngle(quat.create, vec3.normalize(axis, axis), angle), quat.fromEuler(quat.create(), 0, 0, -90));

            //temp.rotation = quat.mul(quat.create(), quat.mul(quat.create(), rot, temp.rotation), quat.invert(quat.create(), rot));

            this.arr_zivali.push(temp)
            this.planet.addChild(temp)
            // this.scene.addNode(temp)
        }
        for (let i = 0; i < 90; i++) {
            const u = Math.random();
            const v = Math.random();
            const theta = 2 * Math.PI * u;
            const phi = Math.acos(2 * v - 1);
            const x = radius * Math.sin(phi) * Math.cos(theta);
            const y = radius * Math.sin(phi) * Math.sin(theta);
            const z = radius * Math.cos(phi);
            
            const temp = this.pig.cloneNode();
            const prej = vec3.normalize(vec3.create(), vec3.fromValues(temp.translation[0], temp.translation[1], temp.translation[2]));
            temp.translation = [x, y, z];
            const potem = vec3.normalize(vec3.create(), vec3.fromValues(temp.translation[0], temp.translation[1], temp.translation[2]));
            
            const angle = vec3.angle(prej, potem);
            const axis = vec3.cross(vec3.create(), prej, potem);
            temp.rotation = quat.mul(quat.create(), quat.setAxisAngle(quat.create, vec3.normalize(axis, axis), angle), quat.fromEuler(quat.create(), -90, 0, 0));

            
            this.arr_zivali.push(temp)
            this.planet.addChild(temp)
            // this.scene.addNode(temp)
        }
        for (let i = 0; i < 60; i++) {
            const u = Math.random();
            const v = Math.random();
            const theta = 2 * Math.PI * u;
            const phi = Math.acos(2 * v - 1);
            const x = radius * Math.sin(phi) * Math.cos(theta);
            const y = radius * Math.sin(phi) * Math.sin(theta);
            const z = radius * Math.cos(phi);

            const temp = this.cow.cloneNode();
            const prej = vec3.normalize(vec3.create(), vec3.fromValues(temp.translation[0], temp.translation[1], temp.translation[2]));
            temp.translation = [x, y, z];
            const potem = vec3.normalize(vec3.create(), vec3.fromValues(temp.translation[0], temp.translation[1], temp.translation[2]));
            
            const angle = vec3.angle(prej, potem);
            const axis = vec3.cross(vec3.create(), prej, potem);
            temp.rotation = quat.mul(quat.create(), quat.setAxisAngle(quat.create, vec3.normalize(axis, axis), angle), quat.fromEuler(quat.create(), 0, 0, 0));

            
            this.arr_zivali.push(temp)
            this.planet.addChild(temp)
            // this.scene.addNode(temp)
        }


        this.arr_hose = [];
        for (let i = 0; i < 20; i++) {
            const u = Math.random();
            const v = Math.random();
            const theta = 2 * Math.PI * u;
            const phi = Math.acos(2 * v - 1);
            const x = radius * Math.sin(phi) * Math.cos(theta);
            const y = radius * Math.sin(phi) * Math.sin(theta);
            const z = radius * Math.cos(phi);

            const temp = this.hose.cloneNode();
            const prej = vec3.normalize(vec3.create(), vec3.fromValues(temp.translation[0], temp.translation[1], temp.translation[2]));
            temp.translation = [x, y, z];
            const potem = vec3.normalize(vec3.create(), vec3.fromValues(temp.translation[0], temp.translation[1], temp.translation[2]));
            
            const angle = vec3.angle(prej, potem);
            const axis = vec3.cross(vec3.create(), prej, potem);
            temp.rotation = quat.mul(quat.create(), quat.setAxisAngle(quat.create, vec3.normalize(axis, axis), angle), quat.fromEuler(quat.create(), 0, 0, 0));

            
            this.arr_hose.push(temp)
            this.planet.addChild(temp)
            // this.scene.addNode(temp)
        }

        //damo originalne pozicije da lohk nrdimo gravitacijo
        for (const element of this.arr_zivali) {
            element.originalPosition = vec3.clone(element.translation);
          }
           
          
        if (!this.scene || !this.camera) {
            throw new Error('Scene or Camera not present in glTF');
        }

        if (!this.camera.camera) {
            throw new Error('Camera node does not contain a camera reference');
        }

        this.controller = new wasdController(this.center, this.canvas);
        this.controller2 = new mouseController(this.center_ufo, this.canvas, this.arr_zivali);
        //this.controller3 = new cameraController(this.camera, this.canvas);
        this.physics = new Physics(this.scene, this.planet, this.center_ufo, this.cylinder, tab_node, this.sky);


        document.getElementById('score').innerHTML = this.physics.player.points.toString();
        document.getElementById('level').innerHTML = this.physics.player.lvl.toString();

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
        document.getElementById('score').innerHTML = this.physics.player.points.toString();
        document.getElementById('level').innerHTML = this.physics.player.lvl.toString();
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
