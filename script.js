const canvas = document.getElementById('background');
const gl = canvas.getContext('webgl');

if (!gl) {
    console.error('WebGL not supported');
}

// Vertex shader source
const vertexShaderSource = `
    attribute vec2 a_position;

    void main() {
        gl_Position = vec4(a_position, 0, 1);
    }
`;

// Fragment shader source
const fragmentShaderSource = `
    precision highp float;

    void main() {
        gl_FragColor = vec4(1.0, 0.14, 0.54, 1.0); // Pink color
    }
`;

// Compile shader function
function compileShader(gl, source, type) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('Shader compilation error:', gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
    }

    return shader;
}

// Create shader program
const vertexShader = compileShader(gl, vertexShaderSource, gl.VERTEX_SHADER);
const fragmentShader = compileShader(gl, fragmentShaderSource, gl.FRAGMENT_SHADER);

if (!vertexShader || !fragmentShader) {
    console.error('Failed to create shaders');
}

const program = gl.createProgram();
gl.attachShader(program, vertexShader);
gl.attachShader(program, fragmentShader);
gl.linkProgram(program);

if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error('Program linking error:', gl.getProgramInfoLog(program));
}

gl.useProgram(program);

// Set up geometry
const vertices = new Float32Array([
    -1, -1,
    -1, 1,
    1, -1,
    1, 1
]);

const buffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

const positionAttributeLocation = gl.getAttribLocation(program, 'a_position');
gl.enableVertexAttribArray(positionAttributeLocation);
gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

// Main render function
function render() {
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

    requestAnimationFrame(render);
}

render();
