const vertex = `#version 300 es
uniform vec2 uOffset;
uniform float uScale;

in vec2 aPosition;
in vec4 aColor;

out vec4 vColor;

void main() {
    vColor = aColor/255.0;
    gl_Position = vec4(aPosition*uScale + uOffset, 0, 1);
}
`;

const fragment = `#version 300 es
precision mediump float;

in vec4 vColor;

out vec4 oColor;

void main() {
    oColor = vColor;
}
`;

export const shaders = {
    test: { vertex, fragment }
};
