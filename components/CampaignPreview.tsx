'use client';

import { ChangeEvent, useEffect, useMemo, useState } from 'react';
import styles from './CampaignPreview.module.css';
import {
  CampaignSetupData,
  GeneratedImageSlot,
  GeneratedTextVariant,
} from '@/types/campaign';
import {
  generateImagePlaceholders,
  generateTextVariants,
  regenerateImageForSlot,
  regenerateSingleText,
} from '@/lib/generators';

interface CampaignPreviewProps {
  data: CampaignSetupData;
  onBack: () => void;
}

export default function CampaignPreview({ data, onBack }: CampaignPreviewProps) {
  const [images, setImages] = useState<GeneratedImageSlot[]>([]);
  const [texts, setTexts] = useState<GeneratedTextVariant[]>([]);
  const [publiseringsdato, setPubliseringsdato] = useState('');
  const [publiseringstid, setPubliseringstid] = useState('');
  const [confirmation, setConfirmation] = useState<
    | {
        channels: string[];
        scheduledAt: string;
        imageSummary: string[];
        textSummary: string[];
      }
    | null
  >(null);
  const [scheduleError, setScheduleError] = useState('');

  useEffect(() => {
    setImages(generateImagePlaceholders(data.media));
    setTexts(generateTextVariants(data));
  }, [data]);

  const primaryImage = useMemo(
    () => data.media.find((file) => file.type === 'image') ?? data.media[0],
    [data.media],
  );

  const videos = useMemo(() => data.media.filter((file) => file.type === 'video'), [data.media]);

  const handleRegenerateImage = async (slot: number) => {
    const target = images.find((img) => img.slot === slot);
    if (target?.isCustom) return;
    const updated = await regenerateImageForSlot(slot, data.media);
    setImages((prev) => prev.map((img) => (img.slot === slot ? updated : img)));
  };

  const handleReplaceImage = (slot: number, event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    const customImage: GeneratedImageSlot = {
      slot,
      src: url,
      type: 'custom',
      isCustom: true,
    };
    setImages((prev) =>
      prev.map((img) => {
        if (img.slot === slot && img.src.startsWith('blob:')) {
          URL.revokeObjectURL(img.src);
        }
        return img.slot === slot ? customImage : img;
      }),
    );
    event.target.value = '';
  };

  const handleTextChange = (slot: number, value: string) => {
    setTexts((prev) =>
      prev.map((text) =>
        text.slot === slot
          ? {
              ...text,
              content: value,
              source: value === text.content ? text.source : 'custom',
            }
          : text,
      ),
    );
  };

  const handleRegenerateText = (slot: number) => {
    const regenerated = regenerateSingleText(data, slot);
    setTexts((prev) => prev.map((text) => (text.slot === slot ? regenerated : text)));
  };

  const validateSchedule = () => {
    if (!images.length || images.every((img) => !img.src)) {
      setScheduleError('Legg til minst ett bilde for publisering.');
      return false;
    }
    if (!texts.length || texts.every((text) => !text.content.trim())) {
      setScheduleError('Minst én tekst må være utfylt.');
      return false;
    }
    if (!publiseringsdato || !publiseringstid) {
      setScheduleError('Velg publiseringsdato og tidspunkt.');
      return false;
    }
    setScheduleError('');
    return true;
  };

  const handleSchedule = () => {
    if (!validateSchedule()) return;
    const scheduledAt = `${publiseringsdato}T${publiseringstid}`;
    const payload = {
      media: {
        originalImage: primaryImage?.url ?? null,
        generatedImages: images.map((img) => ({
          type: img.type,
          src: img.src,
          slot: img.slot,
        })),
      },
      texts: texts.map((text) => ({
        slot: text.slot,
        content: text.content,
        source: text.source,
      })),
      service: {
        category: data.service.category,
        subcategory: data.service.subcategory,
        categoryLabel: data.service.categoryLabel,
        subcategoryLabel: data.service.subcategoryLabel,
        tjenestebeskrivelse: data.service.tjenestebeskrivelse,
      },
      strategy: data.strategy,
      channels: data.channels,
      scheduledAt,
      status: 'scheduled',
    };

    console.log('Planlagt kampanje', payload);
    setConfirmation({
      channels: data.channels,
      scheduledAt: `${publiseringsdato} ${publiseringstid}`,
      imageSummary: images.map((img) => `Bilde ${img.slot} (${img.type === 'custom' ? 'eget' : 'AI'})`),
      textSummary: texts.map((text) => `Tekst ${text.slot} (${text.source === 'custom' ? 'tilpasset' : 'AI'})`),
    });
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.headerRow}>
        <h2 className={styles.sectionTitle}>Generert innhold</h2>
        <button className={styles.backLink} type="button" onClick={onBack}>
          ← Tilbake til konfigurasjon
        </button>
      </div>

      <section>
        <h3 className={styles.sectionTitle}>Originalmedia</h3>
        <div className={styles.mediaGrid}>
          {primaryImage && (
            <div className={styles.mediaCard}>
              <strong>Hovedbilde</strong>
              {primaryImage.type === 'image' ? (
                <img src={primaryImage.url} alt={primaryImage.name} style={{ marginTop: '0.75rem' }} />
              ) : (
                <p style={{ marginTop: '0.75rem' }}>📹 {primaryImage.name}</p>
              )}
            </div>
          )}
          {videos.length > 0 && (
            <div className={styles.mediaCard}>
              <strong>Videoer</strong>
              <ul>
                {videos.map((video) => (
                  <li key={video.id}>{video.name}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>

      <section>
        <h3 className={styles.sectionTitle}>AI-genererte bilder</h3>
        <div className={styles.generatedGrid}>
          {images.map((image) => (
            <div key={image.slot} className={styles.mediaCard}>
              <strong>Bilde {image.slot}</strong>
              <img src={image.src} alt={`Generert bilde ${image.slot}`} style={{ marginTop: '0.75rem' }} />
              <div className={styles.imageActions}>
                <button
                  className={styles.secondaryBtn}
                  type="button"
                  onClick={() => handleRegenerateImage(image.slot)}
                  disabled={image.isCustom}
                >
                  Regenerer bilde
                </button>
                <label className={styles.outlineBtn}>
                  Bytt til eget
                  <input
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={(event) => handleReplaceImage(image.slot, event)}
                  />
                </label>
              </div>
              {image.isCustom && <small>Eget bilde (overskrives ikke)</small>}
            </div>
          ))}
        </div>
      </section>

      <section>
        <h3 className={styles.sectionTitle}>Tekstforslag</h3>
        <div className={styles.generatedGrid}>
          {texts.map((text) => (
            <div key={text.slot} className={`${styles.mediaCard} ${styles.textCard}`}>
              <strong>Tekst {text.slot}</strong>
              <textarea
                value={text.content}
                onChange={(event) => handleTextChange(text.slot, event.target.value)}
              />
              <div className={styles.textActions}>
                <button className={styles.secondaryBtn} type="button" onClick={() => handleRegenerateText(text.slot)}>
                  Regenerer tekst
                </button>
              </div>
              <small>Kilde: {text.source === 'custom' ? 'tilpasset' : 'AI'}</small>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h3 className={styles.sectionTitle}>Planlegging og publisering</h3>
        <div className={styles.scheduleGrid}>
          <div>
            <label>Publiseringsdato</label>
            <input
              type="date"
              value={publiseringsdato}
              onChange={(event) => setPubliseringsdato(event.target.value)}
              style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '0.75rem', border: '1px solid #cbd5f5' }}
            />
          </div>
          <div>
            <label>Publiseringstid</label>
            <input
              type="time"
              value={publiseringstid}
              onChange={(event) => setPubliseringstid(event.target.value)}
              style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: '0.75rem', border: '1px solid #cbd5f5' }}
            />
          </div>
        </div>
        {scheduleError && <p style={{ color: '#dc2626' }}>{scheduleError}</p>}
        <button className={styles.publishBtn} type="button" onClick={handleSchedule}>
          Planlegg og publiser
        </button>
        {confirmation && (
          <div className={styles.confirmation}>
            <p style={{ marginTop: 0 }}>
              Kanaler: <strong>{confirmation.channels.join(', ')}</strong>
            </p>
            <p>
              Planlagt tidspunkt: <strong>{confirmation.scheduledAt}</strong>
            </p>
            <p>Bilder: {confirmation.imageSummary.join(', ')}</p>
            <p>Tekster: {confirmation.textSummary.join(', ')}</p>
          </div>
        )}
      </section>
    </div>
  );
}
