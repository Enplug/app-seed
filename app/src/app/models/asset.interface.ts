export interface Asset {
  id: string;
  Name: string;
  Mimetype: string;
  ContentUrl: string;
  Content4KUrl?: string;
  blobUrls?: Record<string, string>;
  blobs?: Map<string, Blob>;
  signageOsItems?: Map<string, any>;
  blob?: Blob;
  [key: string]: any;
}

export type AssetType = 'image' | 'video' | 'custom';

export interface AssetDisplayConfig {
  is4K: boolean;
  isSignageOs: boolean;
  autoPlay: boolean;
}
