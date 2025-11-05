import { Logger } from '../core/Logger';

export type AssetType = 'image' | 'json' | 'text' | 'audio' | 'binary';

export interface Asset {
  id: string;
  type: AssetType;
  url: string;
  data?: any;
}

export class AssetLoader {
  private static cache: Map<string, any> = new Map();

  /** Load a single asset and cache it */
  static async load(asset: Asset, onProgress?: (p: number) => void): Promise<any> {
    if (this.cache.has(asset.url)) {
      Logger.info(`🗃 Cached asset loaded: ${asset.url}`);
      return this.cache.get(asset.url);
    }

    Logger.info(`📥 Loading asset: ${asset.url}`);
    const response = await fetch(asset.url);
    if (!response.ok) throw new Error(`Failed to load ${asset.url}`);

    let data: any;
    switch (asset.type) {
      case 'image':
        const blob = await response.blob();
        data = await createImageBitmap(blob);
        break;
      case 'json':
        data = await response.json();
        break;
      case 'text':
        data = await response.text();
        break;
      case 'audio':
        data = await response.arrayBuffer();
        break;
      case 'binary':
        data = await response.arrayBuffer();
        break;
      default:
        throw new Error(`Unknown asset type: ${asset.type}`);
    }

    this.cache.set(asset.url, data);
    if (onProgress) onProgress(100);
    return data;
  }

  /** Load multiple assets in parallel with total progress */
  static async loadAll(assets: Asset[], onProgress?: (p: number) => void): Promise<void> {
    let loaded = 0;
    for (const a of assets) {
      await this.load(a);
      loaded++;
      if (onProgress) onProgress((loaded / assets.length) * 100);
    }
  }

    static async loadText(url: string): Promise<string> {
    try {
      const res = await fetch(url);
      return await res.text();
    } catch (err) {
      Logger.error(`Failed to load text: ${url}`);
      throw err;
    }
  }

  static async loadImage(url: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = url;
    });
  }

  /** Retrieve cached asset */
  static get(url: string): any {
    return this.cache.get(url);
  }

  /** Clear all cached assets */
  static clear(): void {
    Logger.warn('🧹 Asset cache cleared.');
    this.cache.clear();
  }
}
