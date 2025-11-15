import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="home-wrapper">
      <div className="home-card">
        <h1 className="page-title">Velkommen til kampanjebyggeren</h1>
        <p className="page-text">
          Sett opp og planlegg en helhetlig kampanje med bilder, tekster og publiseringsplan på få minutter.
        </p>
        <Link className="link-reset primary-btn" href="/kampanje">
          Start kampanje
        </Link>
      </div>
    </main>
  );
}
