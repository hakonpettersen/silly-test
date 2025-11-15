'use client';

import { ChangeEvent, useEffect, useMemo, useState } from 'react';
import styles from './CampaignSetup.module.css';
import {
  CampaignSetupData,
  MediaFile,
  ServiceCategoryKey,
  ServiceSubcategoryKey,
} from '@/types/campaign';
import { getCategoryLabel, getSubcategoryLabel, serviceCatalog } from '@/lib/serviceCatalog';

interface CampaignSetupProps {
  initialData: CampaignSetupData;
  onNext: (data: CampaignSetupData) => void;
}

interface ErrorBag {
  media?: string;
  channels?: string;
  service?: string;
  strategy?: string;
  description?: string;
}

const channelOptions = ['Facebook', 'Instagram', 'YouTube'];

const buildMediaFile = (file: File): MediaFile => {
  const uniqueId =
    typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID()
      : Math.random().toString(36).slice(2);
  return {
    id: `${file.name}-${uniqueId}`,
    name: file.name,
    url: URL.createObjectURL(file),
    type: file.type.startsWith('video') ? 'video' : 'image',
    file,
  };
};

const ensureService = (service?: CampaignSetupData['service']): CampaignSetupData['service'] => ({
  category: service?.category,
  subcategory: service?.subcategory,
  categoryLabel: service?.categoryLabel,
  subcategoryLabel: service?.subcategoryLabel,
  tjenestebeskrivelse: service?.tjenestebeskrivelse ?? '',
});

export default function CampaignSetup({ initialData, onNext }: CampaignSetupProps) {
  const [formData, setFormData] = useState<CampaignSetupData>({
    media: initialData.media ?? [],
    channels: initialData.channels ?? [],
    strategy: initialData.strategy ?? '',
    service: ensureService(initialData.service),
  });
  const [errors, setErrors] = useState<ErrorBag>({});

  useEffect(() => {
    setFormData({
      media: initialData.media ?? [],
      channels: initialData.channels ?? [],
      strategy: initialData.strategy ?? '',
      service: ensureService(initialData.service),
    });
  }, [initialData]);

  const selectedCategory = formData.service.category;
  const selectedSubcategory = formData.service.subcategory;

  const availableSubcategories = useMemo(() => {
    return (
      serviceCatalog.find((cat) => cat.key === selectedCategory)?.subcategories ?? []
    );
  }, [selectedCategory]);

  const handleFiles = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    if (!files.length) return;

    const newMedia = files.map(buildMediaFile);
    setFormData((prev) => ({
      ...prev,
      media: [...prev.media, ...newMedia],
    }));
    event.target.value = '';
  };

  const removeMedia = (id: string) => {
    setFormData((prev) => {
      const target = prev.media.find((item) => item.id === id);
      if (target) {
        URL.revokeObjectURL(target.url);
      }
      return {
        ...prev,
        media: prev.media.filter((item) => item.id !== id),
      };
    });
  };

  const toggleChannel = (channel: string) => {
    setFormData((prev) => ({
      ...prev,
      channels: prev.channels.includes(channel)
        ? prev.channels.filter((c) => c !== channel)
        : [...prev.channels, channel],
    }));
  };

  const handleCategoryChange = (category: ServiceCategoryKey) => {
    const catLabel = getCategoryLabel(category);
    setFormData((prev) => ({
      ...prev,
      service: {
        ...prev.service,
        category,
        categoryLabel: catLabel,
        subcategory: undefined,
        subcategoryLabel: undefined,
      },
    }));
  };

  const handleSubcategoryChange = (subcategory: ServiceSubcategoryKey) => {
    const subLabel = getSubcategoryLabel(formData.service.category, subcategory);
    setFormData((prev) => ({
      ...prev,
      service: {
        ...prev.service,
        subcategory,
        subcategoryLabel: subLabel,
      },
    }));
  };

  const updateServiceDescription = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      service: {
        ...prev.service,
        tjenestebeskrivelse: value,
      },
    }));
  };

  const validate = () => {
    const nextErrors: ErrorBag = {};
    if (!formData.media.length) {
      nextErrors.media = 'Last opp minst ett bilde eller en video.';
    }
    if (!formData.channels.length) {
      nextErrors.channels = 'Velg minst én kanal.';
    }
    if (!formData.service.category || !formData.service.subcategory) {
      nextErrors.service = 'Velg kategori og delkategori fra katalogen.';
    }
    if (!formData.strategy.trim()) {
      nextErrors.strategy = 'Legg inn en strategi for kampanjen.';
    }
    if (!formData.service.tjenestebeskrivelse.trim()) {
      nextErrors.description = 'Beskriv den konkrete tjenesten for denne kampanjen.';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    onNext(formData);
  };

  const summary =
    selectedCategory && selectedSubcategory
      ? `${selectedCategory}${selectedSubcategory} – ${getCategoryLabel(selectedCategory) ?? ''}: ${
          getSubcategoryLabel(selectedCategory, selectedSubcategory) ?? ''
        }`
      : 'Ingen tjeneste valgt enda.';

  return (
    <div className={styles.wrapper}>
      <section>
        <h2 className={styles.sectionTitle}>1. Media og kanaler</h2>
        <div className={styles.field}>
          <label>Last opp media (bilder/video)</label>
          <input
            className={styles.fileInput}
            type="file"
            accept="image/*,video/*"
            multiple
            onChange={handleFiles}
          />
          {errors.media && <span className={styles.error}>{errors.media}</span>}
        </div>
        {formData.media.length > 0 && (
          <div className={styles.uploadPreview}>
            {formData.media.map((media) => (
              <div key={media.id} className={styles.previewTile}>
                {media.type === 'image' ? (
                  <img src={media.url} alt={media.name} />
                ) : (
                  <span>🎬 Video</span>
                )}
                <small style={{ textAlign: 'center' }}>{media.name}</small>
                <button
                  type="button"
                  onClick={() => removeMedia(media.id)}
                  style={{
                    border: 'none',
                    background: 'transparent',
                    color: '#dc2626',
                    cursor: 'pointer',
                  }}
                >
                  Fjern
                </button>
              </div>
            ))}
          </div>
        )}

        <div className={styles.field}>
          <label>Velg kanaler</label>
          <div className={styles.channels}>
            {channelOptions.map((channel) => {
              const active = formData.channels.includes(channel);
              return (
                <button
                  type="button"
                  key={channel}
                  className={`${styles.channelChip} ${active ? styles.channelActive : ''}`}
                  onClick={() => toggleChannel(channel)}
                >
                  {channel}
                </button>
              );
            })}
          </div>
          {errors.channels && <span className={styles.error}>{errors.channels}</span>}
        </div>
      </section>

      <section>
        <h2 className={styles.sectionTitle}>2. Tjenester og strategi</h2>
        <div className={styles.field}>
          <label>Tjenestekategori</label>
          <select
            className={styles.select}
            value={selectedCategory ?? ''}
            onChange={(event) => handleCategoryChange(event.target.value as ServiceCategoryKey)}
          >
            <option value="" disabled>
              Velg kategori
            </option>
            {serviceCatalog.map((category) => (
              <option key={category.key} value={category.key}>
                {category.key}. {category.label}
              </option>
            ))}
          </select>
        </div>
        <div className={styles.field}>
          <label>Delkategori</label>
          <select
            className={styles.select}
            value={selectedSubcategory ?? ''}
            onChange={(event) => handleSubcategoryChange(event.target.value as ServiceSubcategoryKey)}
            disabled={!selectedCategory}
          >
            <option value="" disabled>
              {selectedCategory ? 'Velg delkategori' : 'Velg kategori først'}
            </option>
            {availableSubcategories.map((sub) => (
              <option key={sub.key} value={sub.key}>
                {sub.key}. {sub.label}
              </option>
            ))}
          </select>
          {errors.service && <span className={styles.error}>{errors.service}</span>}
        </div>

        <p className={styles.summary}>{summary}</p>

        <div className={styles.field}>
          <label>Strategi</label>
          <textarea
            className={styles.textarea}
            placeholder="F.eks. fokus på faste avtaler, lokal tilstedeværelse og profesjonelt inntrykk."
            value={formData.strategy}
            onChange={(event) => setFormData({ ...formData, strategy: event.target.value })}
          />
          {errors.strategy && <span className={styles.error}>{errors.strategy}</span>}
        </div>

        <div className={styles.field}>
          <label>
            Tjenestebeskrivelse (kort beskrivelse av den konkrete leveransen i denne kampanjen)
          </label>
          <textarea
            className={styles.textarea}
            placeholder="Sesongbasert vedlikehold av plen med jevn klipping, kantklipp og gjødsling for eneboliger i nærområdet."
            value={formData.service.tjenestebeskrivelse}
            onChange={(event) => updateServiceDescription(event.target.value)}
          />
          {errors.description && <span className={styles.error}>{errors.description}</span>}
        </div>

        <div className={styles.actions}>
          <button className={styles.nextButton} type="button" onClick={handleSubmit}>
            Neste
          </button>
        </div>
      </section>
    </div>
  );
}
