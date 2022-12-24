export class Bernstein{

    constructor(n,k){
        this.constructor_(n,k);
    }
    
    constructor_(n, k){
        this.bin_kof = this.fak(n) / (this.fak(k)*this.fak(n-k));
        this.n = n;
        this.k = k;
        return this.bin_kof;
    }

    fak(x){
        if(x==0)
            return 1;
        else
            return x*this.fak(x-1);
    }

    value(x){
        return this.bin_kof*Math.pow(x,this.k)*Math.pow((1-x),this.n-this.k);
    }

    derivative(x){
        var m = this.n;
        var j = this.k;
        this.constructor_(this.n-1,this.k-1);
        var a = this.value(x);
        this.constructor_(m,j);
        this.constructor_(this.n-1,this.k);
        a -= this.value(x);
        this.constructor_(m,j);
        return this.n * a;
    }
}

//const b = new Bernstein(5,2);
//console.log(b.value(0.5));
//console.log(b.derivative(0.5))