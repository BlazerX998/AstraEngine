#version 300 es
precision highp float;
in vec3 aPosition;
uniform float uAngle;
uniform mat4 uProjection;
void main() {
  float c = cos(uAngle);
  float s = sin(uAngle);
  mat4 rot = mat4(
    c, -s, 0.0, 0.0,
    s,  c, 0.0, 0.0,
    0.0,0.0,1.0,0.0,
    0.0,0.0,0.0,1.0
  );
  gl_Position = uProjection * rot * vec4(aPosition, 1.0);
}
