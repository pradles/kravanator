import { quat, vec3, mat4 } from '../../lib/gl-matrix-module.js';

export class mouseController {

    constructor(node, domElement) {
        // The node that this controller controls.
        this.node = node;

        // The activation DOM element.
        this.domElement = domElement;

        // This map is going to hold the pressed state for every key.
        this.move = false;
        this.key = false;

        this.limitUp = 50;
        this.limitDown = -50;
        this.currentLimit = 0;

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
        this.acceleration = 120;

        // Maximum speed in meters per second.
        this.maxSpeed = 60;

        // Decay as 1 - log percent max speed loss per second.
        this.decay = 0.99;

        // Pointer sensitivity in radians per pixel.
        this.pointerSensitivity = 0.002;

        this.initHandlers();
    }

    initHandlers() {
        this.pointermoveHandler = this.pointermoveHandler.bind(this);

        const element = this.domElement;
        const doc = element.ownerDocument;

        
        doc.addEventListener("wheel", event => console.info(event.deltaY));
        doc.addEventListener("wheel", event => {
            if(event.deltaY<0){
                if(this.currentLimit<=this.limitUp){
                    this.key = false;
                    this.move = true;
                    //console.log("down")
                    this.currentLimit++;
                }
            }
            else{
                if(this.currentLimit>=this.limitDown){
                    this.key = true;
                    this.move = true;
                    //console.log("up")
                    this.currentLimit--;
                }
            }
        });


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
        const up = [0, 1, 0];
        const acc = vec3.create();

        if(this.move){
            if(this.key){
                vec3.add(acc, acc, up);
            }
            else{
                vec3.sub(acc, acc, up);
            }
        }
        if(!this.move){
            const decay = Math.exp(dt * Math.log(1 - this.decay));
            vec3.scale(this.velocity, this.velocity, decay);
        }

        vec3.scaleAndAdd(this.velocity, this.velocity, acc, dt * this.acceleration);

        const speed = vec3.length(this.velocity);
        if (speed > this.maxSpeed) {
            vec3.scale(this.velocity, this.velocity, this.maxSpeed / speed);
        }

        // Update translation based on velocity (second line of Euler's method).
        this.node.translation = vec3.scaleAndAdd(vec3.create(),
            this.node.translation, this.velocity, dt);
        this.move = false;
   
        // Update rotation based on the Euler angles.
        const rotation = quat.create();
        quat.rotateY(rotation, rotation, 0); ///////////////////zaenkrt mamo pr wasd controlerji
        quat.rotateX(rotation, rotation, 0); //tga ne rabmo
        this.node.rotation = rotation;
    }

    pointermoveHandler(e) {
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

}
