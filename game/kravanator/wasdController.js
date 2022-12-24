import { quat, vec3, mat4 } from '../lib/gl-matrix-module.js';

export class wasdController {

    constructor(node, domElement) {
        this.node = node;
        this.domElement = domElement;

        this.keys = {};

        this.moveX = 0;
        this.moveZ = 0;

        this.velocity = [0, 0, 0];
        this.acceleration = 40;
        this.maxSpeed = 200;
        this.decay = 0.9;
        this.pointerSensitivity = 0.002;

        this.initHandlers();
    }

    initHandlers() {
        this.keydownHandler = this.keydownHandler.bind(this);
        this.keyupHandler = this.keyupHandler.bind(this);

        const element = this.domElement;
        const doc = element.ownerDocument;

        doc.addEventListener('keydown', this.keydownHandler);
        doc.addEventListener('keyup', this.keyupHandler);        
    }

    update(dt) {
        // Calculate forward and right vectors.
        const cos = Math.cos(this.moveZ);
        const sin = Math.sin(this.moveZ);
        const forward = [-sin, 0, -cos];
        const right = [cos, 0, -sin];

        // Map user input to the acceleration vector.
        const acc = vec3.create();
        if (this.keys['KeyW']) {
            this.moveZ += 0.01;
        }
        if (this.keys['KeyS']) {
            this.moveZ -= 0.01;
        }
        if (this.keys['KeyD']) {
            this.moveX -= 0.01;
        }
        if (this.keys['KeyA']) {
            this.moveX += 0.01;
        }

        // Update velocity based on acceleration.
        vec3.scaleAndAdd(this.velocity, this.velocity, acc, dt * this.acceleration);

        // If there is no user input, apply decay.
        if (!this.keys['KeyW'] &&
            !this.keys['KeyS'] &&
            !this.keys['KeyD'] &&
            !this.keys['KeyA'])
        {
            const decay = Math.exp(dt * Math.log(1 - this.decay));
            vec3.scale(this.velocity, this.velocity, decay);
        }

        // Limit speed to prevent accelerating to infinity and beyond.
        const speed = vec3.length(this.velocity);
        if (speed > this.maxSpeed) {
            vec3.scale(this.velocity, this.velocity, this.maxSpeed / speed);
        }

        // Update translation based on velocity.
        this.node.translation = vec3.scaleAndAdd(vec3.create(),
            this.node.translation, this.velocity, dt);

        // Update rotation based on the Euler angles.
        const rotation = quat.create();
        quat.rotateZ(rotation, rotation, this.moveZ);
        quat.rotateX(rotation, rotation, this.moveX);
        this.node.rotation = rotation;
    }

    keydownHandler(e) {
        this.keys[e.code] = true;
    }

    keyupHandler(e) {
        this.keys[e.code] = false;
    }

}
