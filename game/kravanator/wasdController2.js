import { quat, vec3, mat4 } from '../lib/gl-matrix-module.js';

export class wasdController{

    constructor(node, domElement) {
        // The node that this controller controls.
        this.node = node;

        // The activation DOM element.
        this.domElement = domElement;

        // This map is going to hold the pressed state for every key.
        this.keys = {};

        // We are going to use Euler angles for rotation.
        this.pitch = 0;
        this.yaw = 0;

        this.theta = 0;
        this.fi = 0;

        // This is going to be a simple decay-based model, where
        // the user input is used as acceleration. The acceleration
        // is used to update velocity, which is in turn used to update
        // translation. If there is no user input, speed will decay.
        this.velocity = [0, 0, 0];

        // The model needs some limits and parameters.

        // Acceleration in meters per second squared.
        this.acceleration = 20;

        // Maximum speed in meters per second.
        this.maxSpeed = 3;

        // Decay as 1 - log percent max speed loss per second.
        this.decay = 0.9;
        this.trenuta = node.globalMatrix;
        console.log(this.trenuta);

        // Pointer sensitivity in radians per pixel.
        this.pointerSensitivity = 0.002;

        this.initHandlers();
    }

    initHandlers() {
        this.pointermoveHandler = this.pointermoveHandler.bind(this);
        this.keydownHandler = this.keydownHandler.bind(this);
        this.keyupHandler = this.keyupHandler.bind(this);

        const element = this.domElement;
        const doc = element.ownerDocument;

        doc.addEventListener('keydown', this.keydownHandler);
        doc.addEventListener('keyup', this.keyupHandler);

        element.addEventListener('click', e => element.requestPointerLock());
        doc.addEventListener('pointerlockchange', e => {
            if (doc.pointerLockElement === element) {
                doc.addEventListener('pointermove', this.pointermoveHandler);
            } else {
                doc.removeEventListener('pointermove', this.pointermoveHandler);
            }
        });
    }

    update(dt) {
        const xyz = [this.node.globalMatrix[12],this.node.globalMatrix[13],this.node.globalMatrix[14]];
        const x = this.node.globalMatrix[12];
        const y = this.node.globalMatrix[13];
        const z = this.node.globalMatrix[14];
        //console.log("x: "+x+" y: "+y+" z: "+z );
        // Calculate forward and right vectors from the y-orientation.
        const cos = Math.cos(this.yaw);
        const sin = Math.sin(this.yaw);
        //const forward = vec3.transformQuat()
        const forward = [-sin, 0, -cos];
        const right = [cos, 0, -sin];

        // Map user input to the acceleration vector.
        const acc = vec3.create();
        if (this.keys['KeyW']) {
            //console.log(vec3.transformQuat(acc,xyz,[1,0,0]));
            
            vec3.sub(acc, acc, forward);
        }
        if (this.keys['KeyS']) {
            vec3.add(acc, acc, forward);
        }
        if (this.keys['KeyD']) {
            vec3.sub(acc, acc, right);
        }
        if (this.keys['KeyA']) {
            vec3.add(acc, acc, right);
        }

        // Update velocity based on acceleration (first line of Euler's method).
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

        // Update translation based on velocity (second line of Euler's method).
        this.node.translation = vec3.scaleAndAdd(vec3.create(),
            this.node.translation, this.velocity, dt);

        // Update rotation based on the Euler angles.
        const rotation = quat.create();
        quat.rotateY(rotation, rotation, this.yaw);
        quat.rotateX(rotation, rotation, 0);
        this.node.rotation = rotation;

        this.node.velocitySet(this.velocity);
    }

    pointermoveHandler(e) {
        // Rotation can be updated through the pointermove handler.
        // Given that pointermove is only called under pointer lock,
        // movementX/Y will be available.

        // Horizontal pointer movement causes camera panning (y-rotation),
        // vertical pointer movement causes camera tilting (x-rotation).
        const dx = e.movementX;
        const dy = e.movementY;
        this.pitch -= dy * this.pointerSensitivity;
        this.yaw   -= dx * this.pointerSensitivity;

        const pi = Math.PI;
        const twopi = pi * 2;
        const halfpi = pi / 2;

        // Limit pitch so that the camera does not invert on itself.
        if (this.pitch > halfpi) {
            this.pitch = halfpi;
        }
        if (this.pitch < -halfpi) {
            this.pitch = -halfpi;
        }

        // Constrain yaw to the range [0, pi * 2]
        this.yaw = ((this.yaw % twopi) + twopi) % twopi;
    }

    keydownHandler(e) {
        this.keys[e.code] = true;
    }

    keyupHandler(e) {
        this.keys[e.code] = false;
    }

}

wasdController.defaults = {
    velocity         : [0, 0, 0],
};
