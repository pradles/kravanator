import { rotationX, rotationY, rotationZ, scaling, translation, multiply, transform as transform2} from './Matrix.mjs';
export function transform(points) {
    var m2 = [];
    points.forEach(element => {
        element.push(1);
        element = transform2(translation([2.8,0,0]), element);
        element = transform2(rotationY(Math.PI/4), element);
        element = transform2(translation([0,0,7.15]), element);
        element = transform2(translation([0,2.45,0]), element);
        element = transform2(scaling([1.8,1.8,1]), element);
        element = transform2(rotationX(5*Math.PI/11), element);
        element = transform2(rotationZ(9*Math.PI/11), element);
        element.pop();
        m2.push(element);
    });
    return m2;
}

console.log("Transformacija: ", transform([[1,2,3],[2,3,4],[3,4,5],[4,5,6]]));