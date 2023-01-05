import { quat, vec3, mat4 } from '../lib/gl-matrix-module.js';

export class wasdController{

    constructor(node, domElement, arr_zivali) {

        // The node that this controller controls.
        this.node = node;
        // The activation DOM element.
        this.domElement = domElement;
        this.arr_zivali = arr_zivali;

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
        this.velocity2 = [0, 0, 0];

        // The model needs some limits and parameters.

        // Acceleration in meters per second squared.
        this.acceleration = 0.009;

        // Maximum speed in meters per second.
        this.maxSpeed = 0.009;
        this.i=0;
        this.j=0;
        this.leftRight=0;

        this.matM = mat4.create();
        this.n = [0,0,1];
        this.t = [1,0,0];
        // Decay as 1 - log percent max speed loss per second.
        this.decay = 0.9;
    

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

    update(dt, pickable, arr_zivali) {
        const xyz = [this.node.globalMatrix[12],this.node.globalMatrix[13],this.node.globalMatrix[14]];
        const x = this.node.globalMatrix[12];
        const y = this.node.globalMatrix[13];
        const z = this.node.globalMatrix[14];

        this.trenuta = this.node.globalMatrix;
        //console.log(this.trenuta);

        //let q = quat.setAxisAngle([], [0, 1, 0], this.yaw);
        //mat4.fromQuat(this.node.globalMatrix, q);
        
        //console.log("x: "+x+" y: "+y+" z: "+z );
        // Calculate forward and right vectors from the y-orientation.
        //const cos = Math.cos(this.yaw);
        //const sin = Math.sin(this.yaw);
        //const forward = vec3.transformQuat()
        //const forward = vec3.transformQuat([], [1, 0, 0], quat);
        //const forward = [-sin, 0, -cos];
        //const right = [cos, 0, -sin];
        let v = vec3.create()
        let b = vec3.cross(vec3.create(),this.n,this.t);
        //console.log(b);

        // Map user input to the acceleration vector.

        /*this.time = performance.now() /1000;
        let idle = quat.setAxisAngle(quat.create(), [1,0,0], [1,0,0]);
        this.node.rotation = idle;*/
        //let idle = quat.setAxisAngle(quat.create(), [1,1,1], this.i);
        //let rot = quat.create();
        //let nek = vec3.create();
        
        //console.log(mat4.create());
        if (this.keys['KeyW']) {
            let q = quat.setAxisAngle(quat.create(), b, dt);
            vec3.transformQuat(this.n,this.n,q);
            vec3.transformQuat(this.t,this.t,q);

            /*matM = [
                b[0],this.n[0],this.t[0],0,
                b[1],this.n[1],this.n[1],0,
                b[2],this.n[2],this.t[2],0,
                0,0,0,1
                   ];*/
            //console.log(matM);
            
            //idle = quat.setAxisAngle(quat.create(), [1,0,0], this.i);
            //this.i+=0.01;

            /*let q = quat.create();
            quat.rotateY(q, q, dt * this.acceleration);
            mat4.fromQuat(this.node.globalMatrix, q);
            vec3.transformQuat(acc, forward, q);*/
            //quat.rotateZ(rot, rot, this.yaw);
            //vec3.transformQuat(acc,[1,0,0],this.i);
            //vec3.sub(acc, acc, forward);
        }
        if (this.keys['KeyS']) {
            let q = quat.setAxisAngle(quat.create(), b, -dt);
            vec3.transformQuat(this.n,this.n,q);
            vec3.transformQuat(this.t,this.t,q);
            
            
            //idle = quat.setAxisAngle(quat.create(), [1,0,0], this.i);
            //this.i-=0.01;
            //quat.rotateZ(rot, rot, -this.yaw);
            //vec3.add(acc, acc, forward);
        }
        if (this.keys['KeyD']) {
            let q = quat.setAxisAngle(quat.create(), this.t, dt);
            vec3.transformQuat(this.n,this.n,q);
            vec3.transformQuat(this.t,this.t,q);
            
            //idle = quat.setAxisAngle(quat.create(), [0,0,1], this.j);
            //this.j+=0.01;
            //quat.rotateX(rot, rot, this.yaw);
            //vec3.sub(acc, acc, right);
        }
        if (this.keys['KeyA']) {
            let q = quat.setAxisAngle(quat.create(), this.t, -dt);
            vec3.transformQuat(this.n,this.n,q);
            vec3.transformQuat(this.t,this.t,q);
            
            //idle = quat.setAxisAngle(quat.create(), [0,0,1], this.j);
            //this.j-=0.01;
            //quat.rotateX(rot, rot, -this.yaw);
            //vec3.add(acc, acc, right);
        }
        const up = this.n;
        if(pickable.length > 0){
            console.log(vec3.distance(this.node.translation, pickable[0].translation));
           
            const acc = vec3.create();
            
            if (this.keys['Space']) {
                vec3.add(acc, acc, up); 
                vec3.scaleAndAdd(this.velocity, this.velocity, acc, dt * this.acceleration);
                const speed = vec3.length(this.velocity);
                if (speed > this.maxSpeed) {
                    vec3.scale(this.velocity, this.velocity, this.maxSpeed / speed);
                }
                pickable.forEach(element => {
                    element.translation = vec3.scaleAndAdd(vec3.create(), element.translation, this.velocity, dt);
                }); 
            }
            
        }
        if (!this.keys['Space']){
            const acc2 = vec3.create();
            arr_zivali.forEach(element => {
            const distance = vec3.distance(this.node.translation, element.translation);
            if(distance >= 41.16){
                vec3.sub(acc2, acc2, up);
                vec3.scaleAndAdd(this.velocity2, this.velocity2, acc2, dt * this.acceleration);
                const speed = vec3.length(this.velocity2);
                if (speed > this.maxSpeed) {
                    vec3.scale(this.velocity2, this.velocity2, this.maxSpeed / speed);
                }}
                
                    element.translation = vec3.scaleAndAdd(vec3.create(), element.translation, this.velocity2, dt);
                }); 
            
        }

        // Update velocity based on acceleration (first line of Euler's method).
        //vec3.scaleAndAdd(this.velocity, this.velocity, acc, dt * this.acceleration);

        // If there is no user input, apply decay.
        /*if (!this.keys['KeyW'] &&
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
            this.node.translation, this.velocity, dt);*/

        // Update rotation based on the Euler angles.
        /*const rotation = quat.create();
        quat.rotateY(rotation, rotation, this.yaw);
        quat.rotateX(rotation, rotation, 0);
        this.node.rotation = rotation;*/


        //this.node.velocitySet(this.velocity);
        //this.node.rotation = quat.multiply(quat.create(), rot, this.node.rotation);
        //this.node.rotation = idle;
        //console.log(mat4.getRotation(quat.create(),matM));
        this.matM = [
            b[0],b[1],b[2],0,
            this.n[0],this.n[1],this.n[2],0,
            this.t[0],this.t[1],this.t[2],0,
            0,0,0,1
               ];           
        this.node.rotation = mat4.getRotation(quat.create(),this.matM);
        //this.node.translation = vec3.multiply(vec3.create(),xyz,[0,1,0])
    }

    pointermoveHandler(e) {
        // Rotation can be updated through the pointermove handler.
        // Given that pointermove is only called under pointer lock,
        // movementX/Y will be available.

        // Horizontal pointer movement causes camera panning (y-rotation),
        // vertical pointer movement causes camera tilting (x-rotation).
        const dx = e.movementX * this.pointerSensitivity;

        //const dy = e.movementY;
        //this.pitch -= dy * this.pointerSensitivity;

        let q = quat.setAxisAngle(quat.create(), this.n, -dx);
            vec3.transformQuat(this.n,this.n,q);
            vec3.transformQuat(this.t,this.t,q);

        /*const pi = Math.PI;
        const twopi = pi * 2;
        const halfpi = pi / 2;*/

        // Limit pitch so that the camera does not invert on itself.
        /*if (this.pitch > halfpi) {
            this.pitch = halfpi;
        }
        if (this.pitch < -halfpi) {
            this.pitch = -halfpi;
        }*/

        // Constrain yaw to the range [0, pi * 2]
        //this.yaw = ((this.yaw % twopi) + twopi) % twopi;
        //this.leftRight = dx;
    }

    keydownHandler(e) {
        this.keys[e.code] = true;
    }

    keyupHandler(e) {
        this.keys[e.code] = false;
    }

}

