import { Application } from '../common/engine/Application.js';

import { GLTFLoader } from './GLTFLoader.js';
import { Renderer } from './Renderer.js';
import { wasdController } from './wasdController.js';
import { mouseController } from './mouseController.js';

class App extends Application {

    async start() {
        this.loader = new GLTFLoader();
        await this.loader.load('../common/models/planet_cam_ufo.gltf');

        this.scene = await this.loader.loadScene(this.loader.defaultScene);
        this.camera = await this.loader.loadNode('Camera_Orientation');
        this.ufo = await this.loader.loadNode('UFO');
        this.center = await this.loader.loadNode('Center')

        if (!this.scene || !this.camera) {
            throw new Error('Scene or Camera not present in glTF');
        }

        if (!this.camera.camera) {
            throw new Error('Camera node does not contain a camera reference');
        }

        this.controller = new wasdController(this.center, this.canvas);
        this.controller2 = new mouseController(this.camera, this.canvas);

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
        this.controller2.update(dt);
        this.controller.update(dt);
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
