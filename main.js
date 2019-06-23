let gl = null;
let glCanvas = null;

// Aspect ratio and coordinate system
// details

let aspectRatio;
let currentRotation = 0;

// Vertex information
let baryCoords;
let vertexArray;
let vertexBuffer;
let baryBuffer;
let vertexNumComponents;
let vertexCount;
let c;
// Rendering data shared with the
// scalers.

let uScalingFactor;
let uGlobalColor;
let uRotationVector;
let aVertexPosition;
let uEye = [0.0, 0.0, 1.0];
let uTarget = [0.0, 0.0, 0.0];
let uUpDir = [0.0, 1.0, 0.0];

// Animation timing

let previousTime = 0.0;
let degreesPerSecond = 90.0;
window.addEventListener("load", startup, false);

function startup() {
  glCanvas = document.getElementById("logo");
  gl = glCanvas.getContext("webgl");

  const shaderSet = [
    {
      type: gl.VERTEX_SHADER,
      id: "vertex-shader"
    },
    {
      type: gl.FRAGMENT_SHADER,
      id: "fragment-shader"
    }
  ];

  shaderProgram = buildShaderProgram(shaderSet);

  aspectRatio = 1;

  vertexArray = new Float32Array(icosahedron());
  vertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, vertexArray, gl.STATIC_DRAW);
 
  vertexNumComponents = 3;
  vertexCount = vertexArray.length/vertexNumComponents;

  currentAngle = 0.0;
  rotationRate = 6;

  animateScene();
}function buildShaderProgram(shaderInfo) {
  let program = gl.createProgram();

  shaderInfo.forEach(function(desc) {
    let shader = compileShader(desc.id, desc.type);

    if (shader) {
      gl.attachShader(program, shader);
    }
  });

  gl.linkProgram(program)

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.log("Error linking shader program:");
    console.log(gl.getProgramInfoLog(program));
  }

  return program;
}function compileShader(id, type) {
  let code = document.getElementById(id).firstChild.nodeValue;
  let shader = gl.createShader(type);

  gl.shaderSource(shader, code);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.log(`Error compiling ${type === gl.VERTEX_SHADER ? "vertex" : "fragment"} shader:`);
    console.log(gl.getShaderInfoLog(shader));
  }
  return shader;
}function animateScene() {
  gl.viewport(0, 0, glCanvas.width, glCanvas.height);
  gl.clearColor(0, 0, 0, 0);
  gl.clear(gl.COLOR_BUFFER_BIT);


  gl.useProgram(shaderProgram);

  uGlobalColor =
      gl.getUniformLocation(shaderProgram, "uGlobalColor");
  uRotationVector =
      gl.getUniformLocation(shaderProgram, "rad");
  uView = 
      gl.getUniformLocation(shaderProgram, "view");
  uPersp =
      gl.getUniformLocation(shaderProgram, "perspective");

  gl.uniform1f(uRotationVector, currentRotation);
  gl.uniform4fv(uGlobalColor, [0, 0, 0, 1.0]);
  c = new Float32Array(perspective(1,aspectRatio,.001,100));
  gl.uniformMatrix4fv(uPersp,gl.FALSE,c);
  gl.uniformMatrix4fv(uView,gl.FALSE,view(uEye,uTarget,uUpDir));

  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  aVertexPosition =
      gl.getAttribLocation(shaderProgram, "aVertexPosition");

  gl.enableVertexAttribArray(aVertexPosition);
  gl.vertexAttribPointer(aVertexPosition, vertexNumComponents,
        gl.FLOAT, false, 0, 0);

  
  gl.drawArrays(gl.TRIANGLES, 0, vertexCount);    

  window.requestAnimationFrame(function() {
    currentRotation = currentRotation+.01;
    animateScene();
  });
}

function view(eye, target, upDir)
{

  var forward = [], left = [], up = [] ,view = [];
	forward = [eye[0] - target[0],eye[1] - target[1],eye[2] - target[2]];
	forward = normalize(forward);
	left = cross(upDir,forward);
	left = normalize(left);
	up = cross(forward,left);

	view.push(1);
	view.push(0);
	view.push(0);
	view.push(0);

	view.push(0);
	view.push(1);
	view.push(0);
	view.push(0);

	view.push(0);
	view.push(0);
	view.push(1);
	view.push(0);

	view.push(0);
	view.push(0);
	view.push(0);
	view.push(1);

	view[0] = left[0];
	view[4] = left[1];
	view[8] = left[2];
	view[1] = up[0];
	view[5] = up[1];
	view[9] = up[2];
	view[2] = forward[0];
	view[6] = forward[1];
	view[10] = forward[2];

	// set translation part
	view[12] = -left[0] * eye[0] - left[1] * eye[1] - left[2] * eye[2];
	view[13] = -up[0] * eye[0] - up[1] * eye[1] - up[2] * eye[2];
	view[14] = -forward[0] * eye[0] - forward[1] * eye[1] - forward[2] * eye[2];
	return view;

}

function normalize(op)
{
  var mag = Math.sqrt(op[0]*op[0] + op[1]*op[1] + op[2]*op[2]);
  return[op[0]/mag, op[1]/mag,op[2]/mag];
}

function cross(op1, op2)
{
  return[(op1[1] * op2[2]) - (op1[2] * op2[1]),-(op1[0] * op2[2]) - (op1[2] * op2[0]), (op1[0] * op2[1]) - (op1[1] * op2[0])];
}

function perspective(fieldOfViewInRadians, aspect, near, far) {
  var f = Math.tan(Math.PI * 0.5 - 0.5 * fieldOfViewInRadians);
  var rangeInv = 1.0 / (near - far);
  return [
    f / aspect, 0, 0, 0,
    0, f, 0, 0,
    0, 0, (near + far) * rangeInv, -1,
    0, 0, near * far * rangeInv * 2, 0
  ];
};

function icosahedron()
{
  var verts = [[0,  -0.525731,  0.850651],
              [0.850651,  0,  0.525731],
              [0.850651,  0,  -0.525731],
              [-0.850651,  0,  -0.525731],
              [-0.850651,  0,  0.525731],
              [-0.525731,  0.850651,  0],
              [0.525731,  0.850651,  0],
              [0.525731,  -0.850651,  0],
              [-0.525731 , -0.850651,  0],
              [0,  -0.525731,  -0.850651],
              [0,  0.525731,  -0.850651],
              [0,  0.525731,  0.850651]];
  var vertsToReturn = [];
  vertsToReturn.push(verts[1][0]);  vertsToReturn.push(verts[1][1]); vertsToReturn.push(verts[1][2]);
  vertsToReturn.push(verts[2][0]);  vertsToReturn.push(verts[2][1]); vertsToReturn.push(verts[2][2]);
  vertsToReturn.push(verts[6][0]);  vertsToReturn.push(verts[6][1]); vertsToReturn.push(verts[6][2]);

  vertsToReturn.push(verts[1][0]);  vertsToReturn.push(verts[1][1]); vertsToReturn.push(verts[1][2]);
  vertsToReturn.push(verts[7][0]);  vertsToReturn.push(verts[7][1]); vertsToReturn.push(verts[7][2]);
  vertsToReturn.push(verts[2][0]);  vertsToReturn.push(verts[2][1]); vertsToReturn.push(verts[2][2]);

  vertsToReturn.push(verts[3][0]);  vertsToReturn.push(verts[3][1]); vertsToReturn.push(verts[3][2]);
  vertsToReturn.push(verts[4][0]);  vertsToReturn.push(verts[4][1]); vertsToReturn.push(verts[4][2]);
  vertsToReturn.push(verts[5][0]);  vertsToReturn.push(verts[5][1]); vertsToReturn.push(verts[5][2]);

  vertsToReturn.push(verts[4][0]);  vertsToReturn.push(verts[4][1]); vertsToReturn.push(verts[4][2]);
  vertsToReturn.push(verts[3][0]);  vertsToReturn.push(verts[3][1]); vertsToReturn.push(verts[3][2]);
  vertsToReturn.push(verts[8][0]);  vertsToReturn.push(verts[8][1]); vertsToReturn.push(verts[8][2]);

  vertsToReturn.push(verts[6][0]);  vertsToReturn.push(verts[6][1]); vertsToReturn.push(verts[6][2]);
  vertsToReturn.push(verts[5][0]);  vertsToReturn.push(verts[5][1]); vertsToReturn.push(verts[5][2]);
  vertsToReturn.push(verts[11][0]);  vertsToReturn.push(verts[11][1]); vertsToReturn.push(verts[11][2]);

  vertsToReturn.push(verts[5][0]);  vertsToReturn.push(verts[5][1]); vertsToReturn.push(verts[5][2]);
  vertsToReturn.push(verts[6][0]);  vertsToReturn.push(verts[6][1]); vertsToReturn.push(verts[6][2]);
  vertsToReturn.push(verts[10][0]);  vertsToReturn.push(verts[10][1]); vertsToReturn.push(verts[10][2]);

  vertsToReturn.push(verts[9][0]);  vertsToReturn.push(verts[9][1]); vertsToReturn.push(verts[9][2]);
  vertsToReturn.push(verts[10][0]);  vertsToReturn.push(verts[10][1]); vertsToReturn.push(verts[10][2]);
  vertsToReturn.push(verts[2][0]);  vertsToReturn.push(verts[2][1]); vertsToReturn.push(verts[2][2]);

  vertsToReturn.push(verts[10][0]);  vertsToReturn.push(verts[10][1]); vertsToReturn.push(verts[10][2]);
  vertsToReturn.push(verts[9][0]);  vertsToReturn.push(verts[9][1]); vertsToReturn.push(verts[9][2]);
  vertsToReturn.push(verts[3][0]);  vertsToReturn.push(verts[3][1]); vertsToReturn.push(verts[3][2]);

  vertsToReturn.push(verts[7][0]);  vertsToReturn.push(verts[7][1]); vertsToReturn.push(verts[7][2]);
  vertsToReturn.push(verts[8][0]);  vertsToReturn.push(verts[8][1]); vertsToReturn.push(verts[8][2]);
  vertsToReturn.push(verts[9][0]);  vertsToReturn.push(verts[9][1]); vertsToReturn.push(verts[9][2]);

  vertsToReturn.push(verts[8][0]);  vertsToReturn.push(verts[8][1]); vertsToReturn.push(verts[8][2]);
  vertsToReturn.push(verts[7][0]);  vertsToReturn.push(verts[7][1]); vertsToReturn.push(verts[7][2]);
  vertsToReturn.push(verts[0][0]);  vertsToReturn.push(verts[0][1]); vertsToReturn.push(verts[0][2]);

  vertsToReturn.push(verts[11][0]);  vertsToReturn.push(verts[11][1]); vertsToReturn.push(verts[11][2]);
  vertsToReturn.push(verts[0][0]);  vertsToReturn.push(verts[0][1]); vertsToReturn.push(verts[0][2]);
  vertsToReturn.push(verts[1][0]);  vertsToReturn.push(verts[1][1]); vertsToReturn.push(verts[1][2]);

  vertsToReturn.push(verts[0][0]);  vertsToReturn.push(verts[0][1]); vertsToReturn.push(verts[0][2]);
  vertsToReturn.push(verts[11][0]);  vertsToReturn.push(verts[11][1]); vertsToReturn.push(verts[11][2]);
  vertsToReturn.push(verts[4][0]);  vertsToReturn.push(verts[4][1]); vertsToReturn.push(verts[4][2]);

  vertsToReturn.push(verts[6][0]);  vertsToReturn.push(verts[6][1]); vertsToReturn.push(verts[6][2]);
  vertsToReturn.push(verts[2][0]);  vertsToReturn.push(verts[2][1]); vertsToReturn.push(verts[2][2]);
  vertsToReturn.push(verts[10][0]);  vertsToReturn.push(verts[10][1]); vertsToReturn.push(verts[10][2]);

  vertsToReturn.push(verts[1][0]);  vertsToReturn.push(verts[1][1]); vertsToReturn.push(verts[1][2]);
  vertsToReturn.push(verts[6][0]);  vertsToReturn.push(verts[6][1]); vertsToReturn.push(verts[6][2]);
  vertsToReturn.push(verts[11][0]);  vertsToReturn.push(verts[11][1]); vertsToReturn.push(verts[11][2]);

  vertsToReturn.push(verts[3][0]);  vertsToReturn.push(verts[3][1]); vertsToReturn.push(verts[3][2]);
  vertsToReturn.push(verts[5][0]);  vertsToReturn.push(verts[5][1]); vertsToReturn.push(verts[5][2]);
  vertsToReturn.push(verts[10][0]);  vertsToReturn.push(verts[10][1]); vertsToReturn.push(verts[10][2]);

  vertsToReturn.push(verts[5][0]);  vertsToReturn.push(verts[5][1]); vertsToReturn.push(verts[5][2]);
  vertsToReturn.push(verts[4][0]);  vertsToReturn.push(verts[4][1]); vertsToReturn.push(verts[4][2]);
  vertsToReturn.push(verts[11][0]);  vertsToReturn.push(verts[11][1]); vertsToReturn.push(verts[11][2]);

  vertsToReturn.push(verts[2][0]);  vertsToReturn.push(verts[2][1]); vertsToReturn.push(verts[2][2]);
  vertsToReturn.push(verts[7][0]);  vertsToReturn.push(verts[7][1]); vertsToReturn.push(verts[7][2]);
  vertsToReturn.push(verts[9][0]);  vertsToReturn.push(verts[9][1]); vertsToReturn.push(verts[9][2]);

  vertsToReturn.push(verts[7][0]);  vertsToReturn.push(verts[7][1]); vertsToReturn.push(verts[7][2]);
  vertsToReturn.push(verts[1][0]);  vertsToReturn.push(verts[1][1]); vertsToReturn.push(verts[1][2]);
  vertsToReturn.push(verts[0][0]);  vertsToReturn.push(verts[0][1]); vertsToReturn.push(verts[0][2]);

  vertsToReturn.push(verts[3][0]);  vertsToReturn.push(verts[3][1]); vertsToReturn.push(verts[3][2]);
  vertsToReturn.push(verts[9][0]);  vertsToReturn.push(verts[9][1]); vertsToReturn.push(verts[9][2]);
  vertsToReturn.push(verts[8][0]);  vertsToReturn.push(verts[8][1]); vertsToReturn.push(verts[8][2]);

  vertsToReturn.push(verts[4][0]);  vertsToReturn.push(verts[4][1]); vertsToReturn.push(verts[4][2]);
  vertsToReturn.push(verts[8][0]);  vertsToReturn.push(verts[8][1]); vertsToReturn.push(verts[8][2]);
  vertsToReturn.push(verts[0][0]);  vertsToReturn.push(verts[0][1]); vertsToReturn.push(verts[0][2]);
 

  return vertsToReturn;
}
