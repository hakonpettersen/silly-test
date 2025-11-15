import { ServiceCategoryKey, ServiceSubcategoryKey } from '@/types/campaign';

export interface ServiceCatalogItem {
  key: ServiceCategoryKey;
  label: string;
  subcategories: Array<{ key: ServiceSubcategoryKey; label: string }>;
}

export const serviceCatalog: ServiceCatalogItem[] = [
  {
    key: '1',
    label: 'Vedlikehold av plen',
    subcategories: [
      { key: 'a', label: 'Gressklipp og kantklipp' },
      { key: 'b', label: 'Gjødsling og kalking' },
      { key: 'c', label: 'Lufting og moseriving' },
      { key: 'd', label: 'Toppdressing og overseeding' },
    ],
  },
  {
    key: '2',
    label: 'Landskapsarbeid',
    subcategories: [
      { key: 'a', label: 'Beskjæring av frukttrær, busker og hekk' },
      { key: 'b', label: 'Vår- og høstopprydding' },
      { key: 'c', label: 'Elvestein og bark' },
      { key: 'd', label: 'Luking og nyplanting' },
    ],
  },
  {
    key: '3',
    label: 'Andre tjenester',
    subcategories: [
      { key: 'a', label: 'Inspeksjon og rens av takrenner' },
      { key: 'b', label: 'Fresing av stubber' },
      { key: 'c', label: 'Nedkutting av småtrær, fjerne busker' },
      { key: 'd', label: 'Levering og bortkjøring, bark, jord, grus' },
    ],
  },
];

export const getCategoryLabel = (category?: ServiceCategoryKey) =>
  serviceCatalog.find((c) => c.key === category)?.label;

export const getSubcategoryLabel = (
  category?: ServiceCategoryKey,
  subcategory?: ServiceSubcategoryKey,
) =>
  serviceCatalog
    .find((c) => c.key === category)
    ?.subcategories.find((s) => s.key === subcategory)?.label;
