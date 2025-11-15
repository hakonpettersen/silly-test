'use client';

import { useState } from 'react';
import styles from './kampanje.module.css';
import CampaignSetup from '@/components/CampaignSetup';
import CampaignPreview from '@/components/CampaignPreview';
import { CampaignSetupData } from '@/types/campaign';

const defaultSetup: CampaignSetupData = {
  media: [],
  channels: [],
  strategy: '',
  service: { tjenestebeskrivelse: '' },
};

export default function KampanjePage() {
  const [step, setStep] = useState<1 | 2>(1);
  const [setupData, setSetupData] = useState<CampaignSetupData>(defaultSetup);

  const handleNext = (data: CampaignSetupData) => {
    setSetupData(data);
    setStep(2);
  };

  const handleBack = () => setStep(1);

  return (
    <main className={styles.pageWrapper}>
      <div className={styles.inner}>
        <div className={styles.header}>
          <h1 style={{ marginBottom: '0.4rem' }}>To-trinns kampanjebygger</h1>
          <p style={{ margin: 0, color: '#475569' }}>
            Last opp media, velg tjenester og få ferdige forslag til tekst og bilde før du planlegger publisering.
          </p>
          <div className={styles.stepper} style={{ marginTop: '1rem' }}>
            <span
              className={`${styles.step} ${step === 1 ? styles.stepActive : ''}`}
            >
              1. Konfigurasjon
            </span>
            <span
              className={`${styles.step} ${step === 2 ? styles.stepActive : ''}`}
            >
              2. Innhold og publisering
            </span>
          </div>
        </div>
        <div className={styles.card}>
          {step === 1 ? (
            <CampaignSetup initialData={setupData} onNext={handleNext} />
          ) : (
            <CampaignPreview data={setupData} onBack={handleBack} />
          )}
        </div>
      </div>
    </main>
  );
}
