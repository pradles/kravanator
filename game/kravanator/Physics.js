import { vec3, mat4 } from '../lib/gl-matrix-module.js';
import { Player } from '../common/engine/player.js';


export class Physics extends Player{

    constructor(scene, planet, center_ufo, cylinder, tab_node) {
        super(Player)
        this.scene = scene;
        this.planet = planet;
        this.center_ufo = center_ufo;
        this.cylinder = cylinder;
        this.tab_node = tab_node;
        this.pickable;
        this.player = new Player();
    }

    update(dt) {
        this.pickable = [];
            // After moving, check for collision with every other node.
        this.scene.traverse(other => {
            if (other !== this.planet && !this.tab_node.includes(other)) {
                this.resolveCollision(this.center_ufo, other);
                if(other.value <= this.player.lvl) //tle namest 2 damo "level" ki ga ma ns ufo
                    this.setPickable(this.cylinder, other);
            }
        });
        return this.pickable;
    }

    intervalIntersection(min1, max1, min2, max2) {
        return !(min1 > max2 || min2 > max1);
    }

    aabbIntersection(aabb1, aabb2) {
        return this.intervalIntersection(aabb1.min[0], aabb1.max[0], aabb2.min[0], aabb2.max[0])
            && this.intervalIntersection(aabb1.min[1], aabb1.max[1], aabb2.min[1], aabb2.max[1])
            && this.intervalIntersection(aabb1.min[2], aabb1.max[2], aabb2.min[2], aabb2.max[2]);
    }

    getTransformedAABB(node) {
        // Transform all vertices of the AABB from local to global space.
        const transform = node.globalMatrix;
        const { min, max } = node.aabb;
        const vertices = [
            [min[0], min[1], min[2]],
            [min[0], min[1], max[2]],
            [min[0], max[1], min[2]],
            [min[0], max[1], max[2]],
            [max[0], min[1], min[2]],
            [max[0], min[1], max[2]],
            [max[0], max[1], min[2]],
            [max[0], max[1], max[2]],
        ].map(v => vec3.transformMat4(v, v, transform));

        // Find new min and max by component.
        const xs = vertices.map(v => v[0]);
        const ys = vertices.map(v => v[1]);
        const zs = vertices.map(v => v[2]);
        const newmin = [Math.min(...xs), Math.min(...ys), Math.min(...zs)];
        const newmax = [Math.max(...xs), Math.max(...ys), Math.max(...zs)];
        return { min: newmin, max: newmax };
    }

    resolveCollision(a, b) {
        // Get global space AABBs.
        const aBox = this.getTransformedAABB(a);
        const bBox = this.getTransformedAABB(b);
        
        // Check if there is collision.
        const isColliding = this.aabbIntersection(aBox, bBox);
        if (!isColliding) {
            return;
        }
        if(b.value != 0){ // tle lohk sam nrdimo da nm predmet ku je namenjen da se pobere izgine.
            this.player.addPoints = b.value;
            //removeNode(b);
            this.planet.removeChild(b);
        }
        //console.log("colide "+a.name+" "+b.name);

        // Move node A minimally to avoid collision.
        const diffa = vec3.sub(vec3.create(), bBox.max, aBox.min);
        const diffb = vec3.sub(vec3.create(), aBox.max, bBox.min);

        let minDiff = Infinity;
        let minDirection = [0, 0, 0];
        if (diffa[0] >= 0 && diffa[0] < minDiff) {
            minDiff = diffa[0];
            minDirection = [minDiff, 0, 0];
        }
        if (diffa[1] >= 0 && diffa[1] < minDiff) {
            minDiff = diffa[1];
            minDirection = [0, minDiff, 0];
        }
        if (diffa[2] >= 0 && diffa[2] < minDiff) {
            minDiff = diffa[2];
            minDirection = [0, 0, minDiff];
        }
        if (diffb[0] >= 0 && diffb[0] < minDiff) {
            minDiff = diffb[0];
            minDirection = [-minDiff, 0, 0];
        }
        if (diffb[1] >= 0 && diffb[1] < minDiff) {
            minDiff = diffb[1];
            minDirection = [0, -minDiff, 0];
        }
        if (diffb[2] >= 0 && diffb[2] < minDiff) {
            minDiff = diffb[2];
            minDirection = [0, 0, -minDiff];
        }

        a.translation = vec3.add(a.translation, a.translation, minDirection);
    }

    setPickable(a,b){
        // Get global space AABBs.
        const aBox = this.getTransformedAABB(a);
        const bBox = this.getTransformedAABB(b);
        
        // Check if there is collision.
        const isColliding = this.aabbIntersection(aBox, bBox);
        if (!isColliding) {
            return;
        }
        
        //console.log("colide "+a.name+" "+b.name+" is pickable "+b.pickable);
        this.pickable.push(b);        
    }

}
