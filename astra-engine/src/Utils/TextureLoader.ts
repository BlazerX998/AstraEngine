// src/Utils/TextureLoader.ts
import { Logger } from '../core/Logger';

export class TextureLoader {
  /** ✅ Load a single 2D texture */
  static async loadTexture(
    gl: WebGL2RenderingContext,
    path: string,
    flipY = true
  ): Promise<WebGLTexture> {
    return new Promise((resolve, reject) => {
      const texture = gl.createTexture();
      if (!texture) return reject('Failed to create texture');

      const image = new Image();
      image.src = path;
      image.crossOrigin = 'anonymous';
      image.onload = () => {
        gl.bindTexture(gl.TEXTURE_2D, texture);
        if (flipY) gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

        gl.generateMipmap(gl.TEXTURE_2D);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);

        gl.bindTexture(gl.TEXTURE_2D, null);
        Logger.info(`✅ Loaded texture: ${path}`);
        resolve(texture);
      };

      image.onerror = () => {
        Logger.error(`❌ Failed to load texture: ${path}`);
        reject(`Failed to load texture: ${path}`);
      };
    });
  }

  /** ✅ Load a cubemap texture from 6 faces */
  static async loadCubemap(
    gl: WebGL2RenderingContext,
    paths: {
      right: string;
      left: string;
      top: string;
      bottom: string;
      front: string;
      back: string;
    }
  ): Promise<WebGLTexture> {
    const faces: { target: number; url: string }[] = [
      { target: gl.TEXTURE_CUBE_MAP_POSITIVE_X, url: paths.right },
      { target: gl.TEXTURE_CUBE_MAP_NEGATIVE_X, url: paths.left },
      { target: gl.TEXTURE_CUBE_MAP_POSITIVE_Y, url: paths.top },
      { target: gl.TEXTURE_CUBE_MAP_NEGATIVE_Y, url: paths.bottom },
      { target: gl.TEXTURE_CUBE_MAP_POSITIVE_Z, url: paths.front },
      { target: gl.TEXTURE_CUBE_MAP_NEGATIVE_Z, url: paths.back },
    ];

    const cubemap = gl.createTexture();
    if (!cubemap) throw new Error('Failed to create cubemap texture');

    gl.bindTexture(gl.TEXTURE_CUBE_MAP, cubemap);

    // temporary 1x1 pixel placeholder
    const placeholder = new Uint8Array([0, 0, 255, 255]);
    for (const face of faces) {
      gl.texImage2D(face.target, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, placeholder);
    }

    await Promise.all(
      faces.map(
        (face) =>
          new Promise<void>((resolve) => {
            const img = new Image();
            img.crossOrigin = 'anonymous';
            img.src = face.url;
            img.onload = () => {
              gl.bindTexture(gl.TEXTURE_CUBE_MAP, cubemap);
              gl.texImage2D(face.target, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
              resolve();
            };
            img.onerror = () => {
              Logger.error(`❌ Failed to load cubemap face: ${face.url}`);
              resolve(); // continue even if one face fails
            };
          })
      )
    );

    gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_R, gl.CLAMP_TO_EDGE);

    gl.bindTexture(gl.TEXTURE_CUBE_MAP, null);
    Logger.info('✅ Cubemap loaded successfully.');
    return cubemap;
  }
}
