import { quat, vec3, mat4 } from '../lib/gl-matrix-module.js';

export class npc_Controller{

    constructor(domElement) {

        // The node that this controller controls.
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
    }

    update(dt, arr_centru) {
        arr_centru.forEach(element => {
            
            const i = 1//Math.floor(Math.random() * 6) + 1

            let b = vec3.cross(vec3.create(),this.n,this.t);
    
            if (i==1) {
                let q = quat.setAxisAngle(quat.create(), b, dt/400);
                vec3.transformQuat(this.n,this.n,q);
                vec3.transformQuat(this.t,this.t,q);

            }
            if (i==2) {
                let q = quat.setAxisAngle(quat.create(), b, -dt/30);
                vec3.transformQuat(this.n,this.n,q);
                vec3.transformQuat(this.t,this.t,q);
                
            }
            if (i==3) {
                let q = quat.setAxisAngle(quat.create(), this.t, dt/30);
                vec3.transformQuat(this.n,this.n,q);
                vec3.transformQuat(this.t,this.t,q);

            }
            if (i==4) {
                let q = quat.setAxisAngle(quat.create(), this.t, -dt/30);
                vec3.transformQuat(this.n,this.n,q);
                vec3.transformQuat(this.t,this.t,q);
                
            }

            if (i==5) {
                let q = quat.setAxisAngle(quat.create(), this.n, dt/30);
                vec3.transformQuat(this.n,this.n,q);
                vec3.transformQuat(this.t,this.t,q);
                
            }

            if (i==6) {
                let q = quat.setAxisAngle(quat.create(), this.n, -dt/30);
                vec3.transformQuat(this.n,this.n,q);
                vec3.transformQuat(this.t,this.t,q);
                
            }
            
            this.matM = [
                b[0],b[1],b[2],0,
                this.n[0],this.n[1],this.n[2],0,
                this.t[0],this.t[1],this.t[2],0,
                0,0,0,1
                ];           
            element.rotation = mat4.getRotation(quat.create(),this.matM);
        });
    }

}

