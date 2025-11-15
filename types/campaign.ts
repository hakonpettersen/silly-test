export type ServiceCategoryKey = '1' | '2' | '3';
export type ServiceSubcategoryKey = 'a' | 'b' | 'c' | 'd';

export interface ServiceSelection {
  category?: ServiceCategoryKey;
  subcategory?: ServiceSubcategoryKey;
  categoryLabel?: string;
  subcategoryLabel?: string;
  tjenestebeskrivelse: string;
}

export interface MediaFile {
  id: string;
  name: string;
  url: string;
  type: 'image' | 'video';
  file?: File;
}

export interface CampaignSetupData {
  media: MediaFile[];
  channels: string[];
  strategy: string;
  service: ServiceSelection;
}

export interface GeneratedImageSlot {
  slot: number;
  src: string;
  type: 'ai' | 'custom';
  isCustom?: boolean;
}

export interface GeneratedTextVariant {
  slot: number;
  content: string;
  source: 'ai' | 'custom';
}

export interface CampaignPreviewState {
  generatedImages: GeneratedImageSlot[];
  generatedTexts: GeneratedTextVariant[];
  publiseringsdato: string;
  publiseringstid: string;
  confirmation?: string;
}
