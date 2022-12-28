import { quat, vec3, mat4 } from '../../lib/gl-matrix-module.js';

export class cameraController {

    constructor(node, domElement) {
        // The node that this controller controls.
        this.node = node;

        // The activation DOM element.
        this.domElement = domElement;

        // This map is going to hold the pressed state for every key.
        this.move = false;
        this.key = true;
        this.limitUp = 55;
        this.limitDown = -50;
        this.currentLimit = 0;

        // We are going to use Euler angles for rotation.
        this.moveUpDown = 0;
        this.rotateUpDown = -900;

        // This is going to be a simple decay-based model, where
        // the user input is used as acceleration. The acceleration
        // is used to update velocity, which is in turn used to update
        // translation. If there is no user input, speed will decay.
        this.velocity = [0, 0, 0];

        // The model needs some limits and parameters.

        // Acceleration in meters per second squared.
        this.acceleration = 50;

        // Maximum speed in meters per second.
        this.maxSpeed = 30;

        // Decay as 1 - log percent max speed loss per second.
        this.decay = 0.95;

        // Pointer sensitivity in radians per pixel.
        this.pointerSensitivity = 0.002;

        this.initHandlers();
    }

    initHandlers() {
        this.pointermoveHandler = this.pointermoveHandler.bind(this);

        const element = this.domElement;
        const doc = element.ownerDocument;

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
        const up = [0, 0, 1];
        const acc = vec3.create();

        
        //if(this.move){
        if(false){
            if(this.key){
                vec3.add(acc, acc, up);
                //console.log("zoom in")
            }
            else{
                vec3.sub(acc, acc, up);
                //console.log("zoom out")

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

   
        // Update rotation based on the Euler angles.  //<this
        /*const rotation = quat.create();
        quat.rotateX(rotation, rotation, this.rotateUpDown); //<this
        this.node.rotation = rotation;*/
    }

    pointermoveHandler(e) {
        if(this.moveUpDown<-4){
            if(this.currentLimit<=this.limitUp){
                this.move = true;
                this.key = true;
                console.log("go up")
                this.currentLimit++;
                //this.rotateUpDown -= this.moveUpDown * this.pointerSensitivity; //<this
            }
        }
        if(this.moveUpDown>4){
            if(this.currentLimit>=this.limitDown){
                this.move = true;
                this.key = false;
                console.log("go down")
                this.currentLimit--;
                //this.rotateUpDown -= this.moveUpDown * this.pointerSensitivity; //<this
            }
        }
        //console.log("limit:" + this.currentLimit);
        console.log("kot: "+this.rotateUpDown);
        this.moveUpDown = e.movementX;
        console.log(this.moveUpDown);

        const halfpi = Math.PI / 2; //<this
        this.rotateUpDown -= this.moveUpDown * this.pointerSensitivity;
        if (this.rotateUpDown > halfpi) {
            this.rotateUpDown = halfpi;
        }
        if (this.rotateUpDown < -halfpi) {
            this.rotateUpDown = -halfpi;
        }
        
    }


}
