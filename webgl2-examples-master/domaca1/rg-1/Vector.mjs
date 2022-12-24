// Return vectors as arrays, e.g.:
// return [ 1, 2, 3, 4 ];



export function negate(v) {
    var v2 = v.slice();
    for(var i=0;i<v2.length;i++){
        v2[i]*=-1;
    }
    return v2;
}

export function add(v, w) {
        var v2 = [];
        for(var i=0;i<v.length;i++){
            v2.push(v[i] + w[i]);
        }
        return v2;
}

export function subtract(v, w) {
        var v2 = [];
        for(var i=0;i<v.length;i++){
            v2.push(v[i] - w[i]);
        }
        return v2;
}

export function multiply(v, w) {
        var v2 = [];
        for(var i=0;i<v.length;i++){
            v2.push(v[i] * w[i]);
        }
        return v2;
}

export function divide(v, w) {
        var v2 = [];
        for(var i=0;i<v.length;i++){
            v2.push(v[i] / w[i]);
        }
        return v2;
}

export function dot(v, w) {
        var skp=0;
        for(var i=0;i<v.length;i++){
            skp += v[i]*w[i];
        }
        return skp;

}

export function cross(v, w) {
    var v2 = [ (v[1]*w[2])-(v[2]*w[1]),(v[2]*w[0])-(v[0]*w[2]), (v[0]*w[1])-(v[1]*w[0]) ];
    return v2;

}

export function length(v) {
    var skp=0;
    v.forEach(element => {
        skp+=element*element;
    });
    return Math.sqrt(skp);
}

export function normalize(v) {
    var v2 = [];
    var dolzina = length(v);
    v.forEach(element => {
        v2.push(element/dolzina)
    });
    return v2;
}

export function project(v, w) {
    var proj = dot(v,w)/(length(w)*length(w));
    var v2 = [];
    w.forEach(element => {
        v2.push(element*proj);
    });
    return v2;
}

export function reflect(v, w) {
    var temp = dot(v,normalize(w))*2;
    var w2 = [];
    normalize(w).forEach(element => {
        w2.push(element*temp);
    });
    var v2 = subtract(v,w2);
    return v2;
}

export function angle(v, w) {
    var temp = dot(v,w)/(length(v)*length(w));
    temp = Math.acos(temp);
    return temp;
}

/*console.log('Vektorji');

console.log("negacija: ",negate([1,2,3]));
console.log("seštevanje: ", add([1,2,3],[4,5,6]));
console.log("odštevanje: ", subtract([1,2,3],[4,5,6]));
console.log("množenje: ", multiply([1,2,3],[4,5,6]));
console.log("deljenje: ", divide([1,2,3],[4,5,6]));
console.log("skalarni produkt: ", dot([1,2,3],[4,5,6]));
console.log("vektoriski produkt: ", cross([1,2,3],[4,5,6]));
console.log("dolžina vektorja: ", length([1,2,3]));
console.log("normalizacija vektorja: ", normalize([1,2,3]));
console.log("pravokotna projekcija: ", project([1,2,3],[4,5,6])); //ni kul
console.log("zrcaljenje vektorja: ", reflect([1,2,3],[4,5,6]));
console.log("kot med vektorji: ", angle([1,2,3],[4,5,6]));*/
