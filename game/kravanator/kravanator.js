import { Application } from '../common/engine/Application.js';
import { Player } from '../common/engine/player.js';
import { quat, vec3, mat4 } from '../lib/gl-matrix-module.js';


import { GLTFLoader } from './GLTFLoader.js';
import { Renderer } from './Renderer.js';
import { wasdController } from './wasdController2.js';
import { mouseController } from './mouseController.js';
//import { npc_Controller } from './npc_Controller.js';
import { Physics } from './Physics.js';

class App extends Application {

    async start() {
        this.player = new Player();
        this.timer = 100

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
        this.planet.addChild(this.hose)
        this.center_ani = await this.loader.loadNode('Centr_ani');

        this.light = await this.loader.loadNode('Spot');
        this.light.color = [0.00038623993168585, 1, 0.003500560997053981]


        /*this.center_cow = await this.loader.loadNode('Center_cow');
        this.center_pig = await this.loader.loadNode('Center_pig');
        this.center_duck = await this.loader.loadNode('Center_duck');
        this.center_hose = await this.loader.loadNode('Center_hose');*/
        this.sky = await this.loader.loadNode('Cube.002');
        /*this.light = new Node();
        this.light.color = [255, 255, 255];
        this.light.intensity = 1;
        this.light.attenuation = [0.001, 0, 0.3];
        this.center_ufo.addChild(this.light);*/

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
        //this.arr_centru = [];
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
            //const centr = this.center_duck.cloneNode();
            //this.arr_centru.push(centr);
            this.arr_zivali.push(temp);
            //this.planet.addChild(centr)
            this.planet.addChild(temp);
            //this.scene.addNode(centr)
            //this.scene.addNode(temp)
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

            //const centr = this.center_pig.cloneNode();
            //this.arr_centru.push(centr);
            this.arr_zivali.push(temp)
            //this.planet.addChild(centr)
            this.planet.addChild(temp)
            //this.scene.addNode(centr)
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

            //const centr = this.center_cow.cloneNode();
            //this.arr_centru.push(centr);
            this.arr_zivali.push(temp)
            //this.planet.addChild(centr)
            this.planet.addChild(temp)
            //this.scene.addNode(centr)
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

            //const centr = this.center_hose.cloneNode();
            //this.arr_centru.push(centr);
            this.arr_hose.push(temp)
            this.planet.addChild(temp)
            //this.scene.addNode(centr)
            //this.scene.addNode(temp)
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
        this.controller2 = new mouseController(this.center_ufo, this.canvas);
        //this.controller3 = new npc_Controller(this.canvas);
        this.physics = new Physics(this.scene, this.planet, this.center_ufo, this.cylinder, tab_node, this.sky, this.arr_hose, this.cylinder, this.player);

        document.getElementById('score').innerHTML = this.physics.player.points.toString();
        document.getElementById('level').innerHTML = this.physics.player.lvl.toString();
        document.getElementById('timer').innerHTML = this.timer;

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

        if (this.time - this.lastTime >= 1000 || !this.lastTime) {
            this.lastTime = this.time;
            this.timer--;
        }

        if (this.timer == 0) {
            alert("Zmanjkalo vam je časa. Več sreče prihodnjič.\nDosegel si " + this.player.points + " točk.")
            location.replace("../index.html")
        }

        this.pickable = this.physics.update(dt);
        this.controller2.update(dt);
        this.controller.update(dt, this.pickable, this.arr_zivali, this.center_ani);
        //this.controller3.update(dt, this.arr_centru);
        document.getElementById('score').innerHTML = this.physics.player.points.toString();
        document.getElementById('level').innerHTML = this.physics.player.lvl.toString();
        document.getElementById('timer').innerHTML = this.timer;
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
