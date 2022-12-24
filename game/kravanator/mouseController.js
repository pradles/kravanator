import { quat, vec3, mat4 } from '../../lib/gl-matrix-module.js';

export class mouseController {

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

        // Pointer sensitivity in radians per pixel.
        this.pointerSensitivity = 0.002;

        this.initHandlers();
    }

    initHandlers() {
        this.pointermoveHandler = this.pointermoveHandler.bind(this);

        const element = this.domElement;
        const doc = element.ownerDocument;

        doc.addEventListener("wheel", e => element.wheelHandler);

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
        
        const cos = Math.cos(this.yaw);
        const sin = Math.sin(this.yaw);
        const forward = [-sin, 0, -cos];
        const right = [cos, 0, -sin];
   
        // Update rotation based on the Euler angles.
        const rotation = quat.create();
        quat.rotateY(rotation, rotation, this.yaw);
        quat.rotateX(rotation, rotation, this.pitch);
        this.node.rotation = rotation;
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

    wheelHandler(e) {
        if(e<0)
            this.moveY += 0.005;
        else
            this.moveY -= 0.005;
    }


}
