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

    update(dt, pickable, arr_zivali, center_ani) {
        const xyz = [this.node.globalMatrix[12],this.node.globalMatrix[13],this.node.globalMatrix[14]];
        const x = this.node.globalMatrix[12];
        const y = this.node.globalMatrix[13];
        const z = this.node.globalMatrix[14];

        const rotationSpeed = Math.PI / 2;
        const rotationAxis = vec3.fromValues(0, 1, 0);
        let rotation = quat.identity(quat.create());
        let targetRotation = quat.identity(quat.create());

        let b = vec3.cross(vec3.create(),this.n,this.t);
        if (this.keys['KeyW']) {
            let q = quat.setAxisAngle(quat.create(), b, dt);
            vec3.transformQuat(this.n,this.n,q);
            vec3.transformQuat(this.t,this.t,q);
            quat.rotateY(rotation, rotation, 40 * dt);
            targetRotation = rotation;
        }
        if (this.keys['KeyS']) {
            let q = quat.setAxisAngle(quat.create(), b, -dt);
            vec3.transformQuat(this.n,this.n,q);
            vec3.transformQuat(this.t,this.t,q);
            quat.rotateY(rotation, rotation, 40 * -dt);
            targetRotation = rotation;
        }
        if (this.keys['KeyD']) {
            let q = quat.setAxisAngle(quat.create(), this.t, dt);
            vec3.transformQuat(this.n,this.n,q);
            vec3.transformQuat(this.t,this.t,q);
            quat.rotateX(rotation, rotation, 40 * -dt);
            targetRotation = rotation;
        }
        if (this.keys['KeyA']) {
            let q = quat.setAxisAngle(quat.create(), this.t, -dt);
            vec3.transformQuat(this.n,this.n,q);
            vec3.transformQuat(this.t,this.t,q);
            quat.rotateX(rotation, rotation, 40 * dt);
            targetRotation = rotation;
        }
        //targetRotation = quat.multiply(quat.create(), targetRotation, quat.fromEuler(quat.create(),0,90,0))
        quat.rotateX(targetRotation, targetRotation, -Math.PI / 2);
        let rotation2 = quat.setAxisAngle(quat.create(), rotationAxis, rotationSpeed * 20*dt);
        quat.multiply(targetRotation, center_ani.rotation, rotation2);
        center_ani.rotation = quat.slerp(quat.create(), center_ani.rotation, targetRotation, 0.05);


        //let rotation2 = quat.setAxisAngle(quat.create(), rotationAxis, rotationSpeed * 10*dt);
        //center_ani.rotation = quat.multiply(quat.create(), center_ani.rotation, rotation2);
        //rotation = quat.setAxisAngle(quat.create(), rotationAxis, rotationSpeed * dt);
        //center_ani.rotation = quat.multiply(quat.create(), center_ani.rotation, rotation);
        

        const up = this.n;
        if(pickable.length > 0){           
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
        
        if (!this.keys['Space']) {
            arr_zivali.forEach(element => {
              const distance = vec3.distance(element.translation, element.originalPosition);
              if (distance > 0.0025) {
                const acc2 = vec3.create();
                vec3.subtract(acc2, element.originalPosition, element.translation);
                vec3.normalize(acc2, acc2);
                vec3.scaleAndAdd(this.velocity2, this.velocity2, acc2, dt * this.acceleration);
                const speed = vec3.length(this.velocity2);
                if (speed > this.maxSpeed) {
                  vec3.scale(this.velocity2, this.velocity2, this.maxSpeed / speed);
                }
                element.translation = vec3.scaleAndAdd(vec3.create(), element.translation, this.velocity2, dt);
              }
            });
          }

        this.matM = [
            b[0],b[1],b[2],0,
            this.n[0],this.n[1],this.n[2],0,
            this.t[0],this.t[1],this.t[2],0,
            0,0,0,1
               ];           
        this.node.rotation = mat4.getRotation(quat.create(),this.matM);
    }

    pointermoveHandler(e) {
        const dx = e.movementX * this.pointerSensitivity;
        let q = quat.setAxisAngle(quat.create(), this.n, -dx);
            vec3.transformQuat(this.n,this.n,q);
            vec3.transformQuat(this.t,this.t,q);
    }

    keydownHandler(e) {
        this.keys[e.code] = true;
    }

    keyupHandler(e) {
        this.keys[e.code] = false;
    }

}

