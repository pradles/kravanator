

    export function length(v) {
        var skp=0;
        v.forEach(element => {
            skp+=element*element;
        });
        return Math.sqrt(skp);
    }

    export function add(v, w) {
        var v2 = [];
        for(var i=0;i<v.length;i++){
            v2.push(v[i] + w[i]);
        }
        return v2;
    }

    export function sub(v, w) {
        var v2 = [];
        for(var i=0;i<v.length;i++){
            v2.push(v[i] - w[i]);
        }
        return v2;
    }

    export function mul(v, w) {
        var v2 = [];
        for(var i=0;i<v.length;i++){
            v2.push(v[i] * w[i]);
        }
        return v2;
    }

    export function div(v, w) {
        var v2 = [];
        for(var i=0;i<v.length;i++){
            v2.push(v[i] / w[i]);
        }
        return v2;
    }

    export function mulScalar(v,s){
        var v2 = [];
        v.forEach(element => {
            v2.push(element*s);
        });
        return v2;
    }

    export function divScalar(v,s){
        var v2 = [];
        v.forEach(element => {
           v2.push(element/s);
        });
        return v2;
    }

    export function copyVec(v){
        var v2 = [];
        var b = v[0].length;
        for(let i=0;i<b;i++){
            v2.push(0);
        }
        return v2;
    }


