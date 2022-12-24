import { Bezier } from "./Bezier.mjs";
import { add,divScalar,sub, } from './Vector.mjs';

export class Spline{
    constructor(curves){
        this.curves = curves;
    }

    value(t){
        var x = Math.floor(t);
        const bezier = new Bezier(this.curves[x]);
        return bezier.value(t-x);
    }

    derivative(t){
        var x = Math.floor(t);
        const bezier = new Bezier(this.curves[x]);
        return bezier.derivative(t-x);
    }

    makeContinuous(){
        for(let i=0;i<this.curves.length-1;i++){
            var v1 = this.curves[i][this.curves[i].length-1];
            var v2 = this.curves[i+1][0];
            v1 = divScalar(add(v1,v2),2);
            this.curves[i][this.curves[i].length-1] = v1;
            this.curves[i+1][0] = v1;
        }
        return this.curves;
    }

    makeSmooth(){
        for(let i=0;i<this.curves.length-1;i++){
            const bezier = new Bezier(this.curves[i]);
            const bezier1 = new Bezier(this.curves[i+1]);
            
            var v1_1 = bezier.derivative(1);
            var v2_0 = bezier1.derivative(0); 
            
            if(v1_1.toString() !== v2_0.toString()){
                var sredina = divScalar(add(v1_1,v2_0),2);
                this.curves[i][this.curves[i].length-2] = sub(this.curves[i][this.curves[i].length-1],divScalar(sredina,this.curves[i].length-1));
                this.curves[i+1][1] = add(divScalar(sredina,this.curves[i+1].length-1), this.curves[i+1][0]);
            }
        }
        return this.curves;
    }

}

//const spl = new Spline([[[1,2],[3,10],[11,6],[7,8]],[[0,3],[3,10],[11,6],[13,15]],[[8,9],[3,10],[11,6],[99,110]]]);
//console.log("spline value: ",spl.value(0.5));
//console.log("spline derivitive: ",spl.derivative(0.5));
//console.log("continous value: ",spl.makeContinuous());
//console.log("smooth value: ",spl.makeSmooth());

/*
for(let i=0;i<this.curves.length-1;i++){
            const bezier = new Bezier(this.curves[i]);
            const bezier1 = new Bezier(this.curves[i+1]);
            var v1_0 = bezier.derivative(0);
            var v1_1 = bezier.derivative(1);
            var v2_0 = bezier1.derivative(0);  
            var v2_1 = bezier1.derivative(1);
            console.log(v1_1,v2_0);
            if(v1_0 != v2_0 || v1_1 != v2_1){
                this.curves[i][this.curves[i].length-2] = sub(this.curves[i][this.curves[i].length-1],divScalar(divScalar(add(v1_0,v1_1),2),this.curves[i].length-1));
                this.curves[i+1][1] = add(divScalar(divScalar(add(v2_0,v2_1),2),this.curves[i+1].length-1), this.curves[i+1][0]);
            }
        }
*/