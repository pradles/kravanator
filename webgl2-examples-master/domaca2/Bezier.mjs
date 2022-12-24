import { Bernstein } from './Bernstein.mjs';
import { add, mulScalar,copyVec, sub } from './Vector.mjs';

export class Bezier{
    constructor(points){
        this.points = points;
        this.n = points.length;
    }

    value(t){
        var x = copyVec(this.points);
        for(var i=0;i<this.n;i++){
            const ber = new Bernstein(this.n,i);
            x = add(x,mulScalar(this.points[i],ber.constructor_(this.n-1,i)*Math.pow((1-t),this.n-i-1)*Math.pow(t,i)));
        }
        return x;
    }

    derivative(t){
        var x = copyVec(this.points);  
        for(var i=0;i<this.n-1;i++){
            const ber2 = new Bernstein(this.n-2,i);
            x = add(x, mulScalar(sub(this.points[i+1],this.points[i]),ber2.value(t)) );
        }
        return mulScalar(x,this.n-1);
    }

}

//const bez = new Bezier([[1,2],[3,10],[11,6],[7,8]]);
//console.log("bezier value: ",bez.value(0.5));
//console.log("bezier derivitive: ",bez.derivative(0.5));
