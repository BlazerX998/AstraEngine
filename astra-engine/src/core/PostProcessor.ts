import { Logger } from './Logger';

export class PostProcessor {
  private gl: WebGL2RenderingContext;
  private framebuffer: WebGLFramebuffer | null = null;
  private texture: WebGLTexture | null = null;

  constructor(gl: WebGL2RenderingContext) {
    this.gl = gl;
    this.initFramebuffer();
  }

  /** Create framebuffer and texture target */
  private initFramebuffer() {
    const gl = this.gl;
    const fb = gl.createFramebuffer();
    const tex = gl.createTexture();

    if (!fb || !tex) {
      Logger.error('Failed to initialize PostProcessor framebuffer.');
      return;
    }

    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      gl.canvas.width,
      gl.canvas.height,
      0,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      null
    );
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

    gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
    gl.framebufferTexture2D(
      gl.FRAMEBUFFER,
      gl.COLOR_ATTACHMENT0,
      gl.TEXTURE_2D,
      tex,
      0
    );

    if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) !== gl.FRAMEBUFFER_COMPLETE) {
      Logger.error('PostProcessor framebuffer incomplete.');
    }

    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.bindTexture(gl.TEXTURE_2D, null);

    this.framebuffer = fb;
    this.texture = tex;

    Logger.info('PostProcessor framebuffer initialized.');
  }

  /** Apply post-processing effects (simple pass-through for now) */
  apply(gl: WebGL2RenderingContext) {
    if (!this.framebuffer || !this.texture) return;

    // Placeholder: this is where you would render a full-screen quad
    // using the post-processing shader.
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  }

  /** Cleanup resources */
  dispose() {
    const gl = this.gl;
    if (this.texture) gl.deleteTexture(this.texture);
    if (this.framebuffer) gl.deleteFramebuffer(this.framebuffer);
    this.texture = null;
    this.framebuffer = null;
    Logger.info('PostProcessor resources released.');
  }
}
