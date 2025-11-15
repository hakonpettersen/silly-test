import { CampaignSetupData, GeneratedImageSlot, GeneratedTextVariant } from '@/types/campaign';

const randomFromArray = <T,>(items: T[]): T => items[Math.floor(Math.random() * items.length)];

const friendlyOpeners = [
  'Hei naboer!',
  'Klar for en grønnere hage?',
  'Sesongen er her!',
  'Gjør hagen klar med oss!',
];

export const generateTextVariants = (
  setup: CampaignSetupData,
): GeneratedTextVariant[] => {
  const channelList = setup.channels.join(', ');
  const base = `${setup.service.category ?? ''}${setup.service.subcategory ?? ''}`;

  return Array.from({ length: 3 }).map((_, index) => {
    const opener = randomFromArray(friendlyOpeners);
    const body = `${setup.service.tjenestebeskrivelse} Vi følger strategien: ${setup.strategy.trim()}.`; // ensures description included
    const outro = `Publiseres på ${channelList || 'sosiale medier'} for å fremheve ${base || 'tjenesten'}.`;
    return {
      slot: index + 1,
      content: `${opener} ${body} ${outro}`.trim(),
      source: 'ai',
    };
  });
};

export const regenerateSingleText = (
  setup: CampaignSetupData,
  slot: number,
): GeneratedTextVariant => {
  const variants = generateTextVariants(setup);
  const selected = variants[slot - 1] ?? variants[0];
  return { ...selected, slot };
};

export const generateImagePlaceholders = (
  media: CampaignSetupData['media'],
): GeneratedImageSlot[] => {
  const firstImage = media.find((file) => file.type === 'image');
  const placeholder = `https://picsum.photos/seed/${Date.now()}/640/360`;

  return [1, 2].map((slot) => ({
    slot,
    src: firstImage?.url ?? `${placeholder}?slot=${slot}`,
    type: 'ai',
  }));
};

export const regenerateImageForSlot = async (
  slot: number,
  media: CampaignSetupData['media'],
): Promise<GeneratedImageSlot> => {
  const randomSeed = `${Date.now()}-${slot}`;
  const base = media.find((file) => file.type === 'image')?.url;
  const isBlobUrl = base?.startsWith('blob:');
  return {
    slot,
    src: base && !isBlobUrl ? `${base}?v=${randomSeed}` : `https://picsum.photos/seed/${randomSeed}/640/360`,
    type: 'ai',
    isCustom: false,
  };
};
