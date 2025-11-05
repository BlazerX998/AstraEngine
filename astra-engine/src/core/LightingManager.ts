import { DirectionalLight } from './DirectionalLight';
import { PointLight } from './PointLights';
import { SpotLight } from './SpotLight';
import { Logger } from './Logger';

export class LightingManager {
  private directionalLights: DirectionalLight[] = [];
  private pointLights: PointLight[] = [];
  private spotLights: SpotLight[] = [];

  addDirectionalLight(light: DirectionalLight) {
    this.directionalLights.push(light);
    Logger.info(`Directional light added. Total: ${this.directionalLights.length}`);
  }

  addPointLight(light: PointLight) {
    this.pointLights.push(light);
    Logger.info(`Point light added. Total: ${this.pointLights.length}`);
  }

  addSpotLight(light: SpotLight) {
    this.spotLights.push(light);
    Logger.info(`Spot light added. Total: ${this.spotLights.length}`);
  }

  clear() {
    this.directionalLights.length = 0;
    this.pointLights.length = 0;
    this.spotLights.length = 0;
    Logger.info('All lights cleared.');
  }

  applyToMaterial(gl: WebGL2RenderingContext, program: WebGLProgram) {
    // Directional Lights
    this.directionalLights.forEach((light, i) => {
      const base = `uDirLights[${i}]`;
      const { direction, color, intensity } = light.getUniformData();
      gl.uniform3fv(gl.getUniformLocation(program, `${base}.direction`), direction);
      gl.uniform3fv(gl.getUniformLocation(program, `${base}.color`), color);
      gl.uniform1f(gl.getUniformLocation(program, `${base}.intensity`), intensity);
    });

    // Point Lights
    this.pointLights.forEach((light, i) => {
      const base = `uPointLights[${i}]`;
      const { position, color, intensity, constant, linear, quadratic } =
        light.getUniformData();
      gl.uniform3fv(gl.getUniformLocation(program, `${base}.position`), position);
      gl.uniform3fv(gl.getUniformLocation(program, `${base}.color`), color);
      gl.uniform1f(gl.getUniformLocation(program, `${base}.intensity`), intensity);
      gl.uniform1f(gl.getUniformLocation(program, `${base}.constant`), constant);
      gl.uniform1f(gl.getUniformLocation(program, `${base}.linear`), linear);
      gl.uniform1f(gl.getUniformLocation(program, `${base}.quadratic`), quadratic);
    });

    // Spot Lights
    this.spotLights.forEach((light, i) => {
      const base = `uSpotLights[${i}]`;
      const {
        position,
        direction,
        color,
        intensity,
        cutOff,
        outerCutOff,
        constant,
        linear,
        quadratic,
      } = light.getUniformData();

      gl.uniform3fv(gl.getUniformLocation(program, `${base}.position`), position);
      gl.uniform3fv(gl.getUniformLocation(program, `${base}.direction`), direction);
      gl.uniform3fv(gl.getUniformLocation(program, `${base}.color`), color);
      gl.uniform1f(gl.getUniformLocation(program, `${base}.intensity`), intensity);
      gl.uniform1f(gl.getUniformLocation(program, `${base}.cutOff`), cutOff);
      gl.uniform1f(gl.getUniformLocation(program, `${base}.outerCutOff`), outerCutOff);
      gl.uniform1f(gl.getUniformLocation(program, `${base}.constant`), constant);
      gl.uniform1f(gl.getUniformLocation(program, `${base}.linear`), linear);
      gl.uniform1f(gl.getUniformLocation(program, `${base}.quadratic`), quadratic);
    });

    // Counts
    const dirCount = gl.getUniformLocation(program, 'uNumDirLights');
    const pointCount = gl.getUniformLocation(program, 'uNumPointLights');
    const spotCount = gl.getUniformLocation(program, 'uNumSpotLights');
    if (dirCount) gl.uniform1i(dirCount, this.directionalLights.length);
    if (pointCount) gl.uniform1i(pointCount, this.pointLights.length);
    if (spotCount) gl.uniform1i(spotCount, this.spotLights.length);
  }

  getDirectionalLights() {
    return [...this.directionalLights];
  }

  getPointLights() {
    return [...this.pointLights];
  }

  getSpotLights() {
    return [...this.spotLights];
  }
}
