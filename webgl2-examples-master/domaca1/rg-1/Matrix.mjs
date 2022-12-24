// Return matrices as 2D arrays in row-major order, e.g.:
// return [
//     [ 1, 2, 3, 4 ],
//     [ 5, 6, 7, 8 ],
//     [ 7, 6, 5, 4 ],
//     [ 3, 2, 1, 0 ],
// ];

export function identity() {
    return [[ 1, 0, 0, 0 ],
            [ 0, 1, 0, 0 ],
            [ 0, 0, 1, 0 ],
            [ 0, 0, 0, 1 ]]
}

export function translation(t) {
    return [[ 1, 0, 0, t[0] ],
            [ 0, 1, 0, t[1] ],
            [ 0, 0, 1, t[2] ],
            [ 0, 0, 0, 1 ]]
}

export function scaling(s) {
    return [[ s[0], 0, 0, 0 ],
            [ 0, s[1], 0, 0 ],
            [ 0, 0, s[2], 0 ],
            [ 0, 0, 0, 1 ]]
}

export function rotationX(angle) {
    return [[ 1, 0, 0, 0 ],
            [ 0, Math.cos(angle), -Math.sin(angle), 0 ],
            [ 0, Math.sin(angle), Math.cos(angle), 0 ],
            [ 0, 0, 0, 1 ]]
}

export function rotationY(angle) {
    return [[ Math.cos(angle), 0, Math.sin(angle), 0 ],
            [ 0, 1, 0, 0 ],
            [ -Math.sin(angle), 0, Math.cos(angle), 0 ],
            [ 0, 0, 0, 1 ]]
}

export function rotationZ(angle) {
    return [[ Math.cos(angle), -Math.sin(angle), 0, 0 ],
            [ Math.sin(angle), Math.cos(angle), 0, 0 ],
            [ 0, 0, 1, 0 ],
            [ 0, 0, 0, 1 ]]
}

export function negate(m) {
    var array1 = [];
    m.forEach(element => {
        var array2 = [];
        element.forEach(element2 => {
            array2.push(element2*-1);
        });
        array1.push(array2);
    });
    return array1;
}

export function add(m, n) {
    var array1 = [];
    for(let i=0;i<m.length;i++){
        var array2 = [];
        for(let j=0;j<m[i].length;j++){
            array2.push(m[i][j]+n[i][j]);
        }
        array1.push(array2);
    }
    return array1;
}

export function subtract(m, n) {
    var array1 = [];
    for(let i=0;i<m.length;i++){
        var array2 = [];
        for(let j=0;j<m[i].length;j++){
            array2.push(m[i][j]-n[i][j]);
        }
        array1.push(array2);
    }
    return array1;
}

export function transpose(m) {
    var array1 = [];
    const col = m[0].length, row = m.length;
    for(let i=0;i<col;i++){
        var array2 = [];
        for(let j=0;j<row;j++){
            array2.push(m[j][i]);
        }
        array1.push(array2);
    }
    return array1;
}

export function multiply(m, n) {
    var array1 = new Array(m.length);

    for(let i=0;i<m.length;i++){
        array1[i] = new Array(n[0].length);
        for(let j=0;j<n[i].length;j++){
            array1[i][j] = 0;
            for(let k=0;k<m[i].length;k++){
                //console.log(m[i][k]," | ",n[k][j]);
                array1[i][j] += m[i][k]*n[k][j];
            }
        }
    }
    return array1;
}

export function transform(m, v) {
    var v2 = [];
    m.forEach(element => {
        var skp = 0;
        for(let i=0;i<v.length;i++){
            skp += element[i]*v[i];
        }
        v2.push(skp);
    });
    return v2;
}


/*console.log("identiteta: ",identity());
console.log("translation: ", translation([1,2,3]));
console.log("scaling: ",scaling([1,2,3]));
console.log("rotacija x : ", rotationX(3));
console.log("rotacija y : ", rotationY(3));
console.log("rotacija z : ", rotationZ(3));
console.log("negacija: ",negate( [[1,2,3],[4,5,6],[7,8,9]]) );
console.log("add: ", add( [[1,2,3],[4,5,6],[7,8,9]], [[1,2,3],[4,5,6],[7,8,9]] ));
console.log("subtract: ", subtract( [[1,2,3],[4,5,6],[7,8,9]], [[1,2,3],[4,5,6],[7,8,9]] ));
console.log("transpose: ", transpose( [[1,2],[3,4],[5,6]]) );
console.log("multiply: ", multiply( [[1,2,3],[4,5,6]], [[7,8],[9,10],[11,12]] ));
//console.log("multiply: ", multiply( [[3,2,1,5],[9,1,3,0]], [[2,9,0],[1,3,5],[2,4,7],[8,1,5]] ));
console.log("transform: ", transform( [[1,-1,2],[0,-3,1]],[2,1,0] ));
console.log("transformacija: ", multiply([[2,-1,3,5],[1,3,0,4],[3,0,-1,-2],[0,0,0,1]], [[2],[0],[-1],[1]]));*/

