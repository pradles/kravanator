import { vec3, mat4, quat } from '../../lib/gl-matrix-module.js';

export class Node {
    constructor(options = {}) {
        this._translation = options.translation
            ? vec3.clone(options.translation)
            : vec3.fromValues(0, 0, 0);
        this._rotation = options.rotation
            ? quat.clone(options.rotation)
            : quat.fromValues(0, 0, 0, 1);
        this._scale = options.scale
            ? vec3.clone(options.scale)
            : vec3.fromValues(1, 1, 1);
        this._matrix = options.matrix
            ? mat4.clone(options.matrix)
            : mat4.create();
        this.aabb = options.mesh
        ? {
            min: options.mesh.primitives[0].attributes.POSITION.min,
            max: options.mesh.primitives[0].attributes.POSITION.max,
            }
        : {
            min: [-0.2, -0.2, -0.2],
            max: [0.2, 0.2, 0.2],            
        };
        
        if(options.name)
            this.name = options.name


        if (options.matrix) {
            this.updateTransformationComponents();
        } else if (options.translation || options.rotation || options.scale) {
            this.updateTransformationMatrix();
        }

        this.transformationMatrixNeedsUpdate = false;
        this.transformationComponentsNeedUpdate = false;

        this.camera = options.camera || null;
        this.mesh = options.mesh || null;

        this.children = [...(options.children || [])];
        for (const child of this.children) {
            child.parent = this;
        }
        this.parent = null;
        
        this.value = options.value || 0;
        this.transparency = options.value || 0;
    }

    cloneNode() {
        return new Node({
            translation: this.translation,
            rotation: this.rotation,
            scale: this.scale,
            mesh: this.mesh,
            camera: this.camera,
            children: this.children,
            value: this.value,
            name: this.name
        });
    }

    updateTransformationComponents() {
        mat4.getRotation(this._rotation, this._matrix);
        mat4.getTranslation(this._translation, this._matrix);
        mat4.getScaling(this._scale, this._matrix);

        this.transformationComponentsNeedUpdate = false;
    }

    updateTransformationMatrix() {
        mat4.fromRotationTranslationScale(
            this._matrix,
            this._rotation,
            this._translation,
            this._scale);

        this.transformationMatrixNeedsUpdate = false;
    }

    get translation() {
        if (this.transformationComponentsNeedUpdate) {
            this.updateTransformationComponents();
        }
        return vec3.clone(this._translation);
    }

    set translation(translation) {
        if (this.transformationComponentsNeedUpdate) {
            this.updateTransformationComponents();
        }
        this._translation = vec3.clone(translation);
        this.transformationMatrixNeedsUpdate = true;
    }

    get rotation() {
        if (this.transformationComponentsNeedUpdate) {
            this.updateTransformationComponents();
        }
        return quat.clone(this._rotation);
    }

    set rotation(rotation) {
        if (this.transformationComponentsNeedUpdate) {
            this.updateTransformationComponents();
        }
        this._rotation = quat.clone(rotation);
        this.transformationMatrixNeedsUpdate = true;
    }

    get scale() {
        if (this.transformationComponentsNeedUpdate) {
            this.updateTransformationComponents();
        }
        return vec3.clone(this._scale);
    }

    set scale(scale) {
        if (this.transformationComponentsNeedUpdate) {
            this.updateTransformationComponents();
        }
        this._scale = vec3.clone(scale);
        this.transformationMatrixNeedsUpdate = true;
    }

    get localMatrix() {
        if (this.transformationMatrixNeedsUpdate) {
            this.updateTransformationMatrix();
        }
        return mat4.clone(this._matrix);
    }

    set localMatrix(matrix) {
        this._matrix = mat4.clone(matrix);
        this.transformationComponentsNeedUpdate = true;
        this.transformationMatrixNeedsUpdate = false;
    }

    get globalMatrix() {
        if (this.parent) {
            const globalMatrix = this.parent.globalMatrix;
            return mat4.multiply(globalMatrix, globalMatrix, this.localMatrix);
        } else {
            return this.localMatrix;
        }
    }

    velocitySet(v) {
        this.velocity = v;
    }

    velocityGet() {
        return this.velocity;
    }

    addChild(node) {
        if (node.parent) {
            node.parent.removeChild(node);
        }

        this.children.push(node);
        node.parent = this;
    }

    removeChild(node) {
        const index = this.children.indexOf(node);
        if (index >= 0) {
            this.children.splice(index, 1);
            node.parent = null;
        }
    }

    traverse(before, after) {
        if (before) {
            before(this);
        }
        for (const child of this.children) {
            child.traverse(before, after);
        }
        if (after) {
            after(this);
        }
    }
    
    

}
Node.defaults = {
    translation: [0, 0, 0],
    rotation: [0, 0, 0],
    scale: [1, 1, 1],
    velocity : [0, 0, 0]
};
