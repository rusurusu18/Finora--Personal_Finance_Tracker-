import { useNavigate } from 'react-router-dom'

const values = [
  {
    icon: '🇳🇵',
    title: 'Nepal-First',
    description:
      'Built for the Nepali financial reality — NPR-native, multi-source wallet support, and local spending patterns at the core.',
  },
  {
    icon: '🔍',
    title: 'Radical Clarity',
    description:
      'No jargon, no clutter. Every chart, card, and number is designed to tell you one thing: where your money actually is.',
  },
  {
    icon: '🔒',
    title: 'Privacy by Design',
    description:
      'Your financial data stays yours. Zero third-party selling, JWT-secured sessions, and encrypted credentials.',
  },
  {
    icon: '🚀',
    title: 'Always Improving',
    description:
      'Finora ships iteratively. Features are added based on real user feedback, not investor decks.',
  },
]

const stack = [
  { label: 'Frontend', tech: 'React + Vite' },
  { label: 'Styling', tech: 'Vanilla CSS + CSS Variables' },
  { label: 'Backend', tech: 'Node.js + Express' },
  { label: 'Database', tech: 'PostgreSQL + Prisma' },
  { label: 'Auth', tech: 'JWT (Access + Refresh tokens)' },
  { label: 'Validation', tech: 'Zod' },
]

export default function About() {
  const navigate = useNavigate()

  return (
    <main className="about-page">

      {/* ── Hero ── */}
      <section className="about-hero">
        <div className="about-hero-inner">
          <span className="about-badge">Our Story</span>
          <h1 className="about-title">
            Built for Nepal.<br />
            Designed for clarity.
          </h1>
          <p className="about-subtitle">
            Finora started as a frustration. Most finance apps are built for Western banking
            systems — one bank account, one currency, credit cards everywhere. In Nepal,
            money lives in bank accounts, eSewa wallets, Khalti, and cash simultaneously.
            We built Finora to match that reality.
          </p>
        </div>
      </section>

      {/* ── Mission ── */}
      <section className="about-section about-mission">
        <div className="about-container">
          <div className="about-mission-grid">
            <div>
              <h2 className="about-section-title">Our Mission</h2>
              <p className="about-body-text">
                To give every Nepali a clear, unified view of their finances — regardless
                of how many wallets, banks, or cash envelopes they juggle daily.
              </p>
              <p className="about-body-text" style={{ marginTop: '1rem' }}>
                We believe financial clarity is not a luxury. It is the foundation of
                every good decision: whether to save for a motorbike, plan a trek, or
                support a family back home.
              </p>
            </div>
            <div className="about-mission-stat-grid">
              {[
                { num: '7+', label: 'Finance modules' },
                { num: 'NPR', label: 'Native currency' },
                { num: '∞', label: 'Accounts supported' },
                { num: '0', label: 'Data sold' },
              ].map(({ num, label }) => (
                <div key={label} className="about-stat-card">
                  <span className="about-stat-num">{num}</span>
                  <span className="about-stat-label">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Values ── */}
      <section className="about-section about-values-section">
        <div className="about-container">
          <h2 className="about-section-title centered">What we stand for</h2>
          <p className="about-section-sub centered">
            Four principles guide every decision we make at Finora.
          </p>
          <div className="about-values-grid">
            {values.map(({ icon, title, description }) => (
              <div key={title} className="about-value-card">
                <span className="about-value-icon">{icon}</span>
                <h3 className="about-value-title">{title}</h3>
                <p className="about-value-desc">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Tech Stack ── */}
      <section className="about-section about-stack-section">
        <div className="about-container">
          <h2 className="about-section-title centered">Built with</h2>
          <p className="about-section-sub centered">
            Boring, proven technology — because your money deserves reliability over hype.
          </p>
          <div className="about-stack-grid">
            {stack.map(({ label, tech }) => (
              <div key={label} className="about-stack-row">
                <span className="about-stack-label">{label}</span>
                <span className="about-stack-tech">{tech}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="about-section about-cta-section">
        <div className="about-container about-cta-inner">
          <h2 className="about-cta-title">Ready to take control?</h2>
          <p className="about-cta-sub">
            Join Finora for free. No credit card. No BS.
          </p>
          <div className="about-cta-buttons">
            <button className="btn-primary" onClick={() => navigate('/register')}>
              Get Started Free
            </button>
            <button className="btn-ghost" onClick={() => navigate('/features')}>
              See Features
            </button>
          </div>
        </div>
      </section>

      <style>{`
        .about-page {
          min-height: 100vh;
        }

        /* Hero */
        .about-hero {
          background: linear-gradient(135deg, var(--color-primary, #6366f1) 0%, #8b5cf6 100%);
          color: #fff;
          padding: 5rem 1.5rem 6rem;
          text-align: center;
          clip-path: ellipse(110% 100% at 50% 0%);
        }
        .about-hero-inner {
          max-width: 680px;
          margin: 0 auto;
        }
        .about-badge {
          display: inline-block;
          background: rgba(255,255,255,0.2);
          border: 1px solid rgba(255,255,255,0.35);
          border-radius: 999px;
          padding: 0.3rem 1rem;
          font-size: 0.8rem;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          margin-bottom: 1.25rem;
        }
        .about-title {
          font-size: clamp(2rem, 5vw, 3.2rem);
          font-weight: 800;
          line-height: 1.15;
          margin: 0 0 1.25rem;
        }
        .about-subtitle {
          font-size: 1.05rem;
          line-height: 1.75;
          opacity: 0.88;
          max-width: 560px;
          margin: 0 auto;
        }

        /* Shared section styles */
        .about-section {
          padding: 5rem 1.5rem;
        }
        .about-container {
          max-width: 900px;
          margin: 0 auto;
        }
        .about-section-title {
          font-size: 1.75rem;
          font-weight: 700;
          margin: 0 0 1rem;
          color: var(--color-text, #0f172a);
        }
        .about-section-title.centered,
        .about-section-sub.centered {
          text-align: center;
        }
        .about-section-sub {
          color: var(--color-text-muted, #64748b);
          font-size: 1rem;
          margin: 0 0 2.5rem;
          line-height: 1.65;
        }
        .about-body-text {
          color: var(--color-text-muted, #64748b);
          line-height: 1.75;
          font-size: 1rem;
        }

        /* Mission */
        .about-mission {
          background: var(--color-surface, #f8fafc);
        }
        .about-mission-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 3rem;
          align-items: start;
        }
        @media (max-width: 680px) {
          .about-mission-grid { grid-template-columns: 1fr; }
        }
        .about-mission-stat-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }
        .about-stat-card {
          background: var(--color-bg, #fff);
          border: 1px solid var(--color-border, #e2e8f0);
          border-radius: 12px;
          padding: 1.25rem 1rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.4rem;
          text-align: center;
          box-shadow: 0 1px 4px rgba(0,0,0,0.06);
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .about-stat-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 6px 20px rgba(0,0,0,0.1);
        }
        .about-stat-num {
          font-size: 2rem;
          font-weight: 800;
          color: var(--color-primary, #6366f1);
          line-height: 1;
        }
        .about-stat-label {
          font-size: 0.8rem;
          color: var(--color-text-muted, #64748b);
          font-weight: 500;
        }

        /* Values */
        .about-values-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1.25rem;
        }
        .about-value-card {
          background: var(--color-bg, #fff);
          border: 1px solid var(--color-border, #e2e8f0);
          border-radius: 16px;
          padding: 1.75rem 1.5rem;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .about-value-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 24px rgba(99,102,241,0.12);
          border-color: var(--color-primary, #6366f1);
        }
        .about-value-icon {
          font-size: 2rem;
          display: block;
          margin-bottom: 0.75rem;
        }
        .about-value-title {
          font-size: 1rem;
          font-weight: 700;
          margin: 0 0 0.5rem;
          color: var(--color-text, #0f172a);
        }
        .about-value-desc {
          font-size: 0.875rem;
          color: var(--color-text-muted, #64748b);
          line-height: 1.65;
          margin: 0;
        }

        /* Stack */
        .about-stack-section {
          background: var(--color-surface, #f8fafc);
        }
        .about-stack-grid {
          background: var(--color-bg, #fff);
          border: 1px solid var(--color-border, #e2e8f0);
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 2px 12px rgba(0,0,0,0.06);
        }
        .about-stack-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem 1.5rem;
          border-bottom: 1px solid var(--color-border, #e2e8f0);
        }
        .about-stack-row:last-child { border-bottom: none; }
        .about-stack-label {
          font-size: 0.875rem;
          color: var(--color-text-muted, #64748b);
          font-weight: 500;
        }
        .about-stack-tech {
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--color-text, #0f172a);
          background: var(--color-surface, #f1f5f9);
          padding: 0.25rem 0.75rem;
          border-radius: 999px;
        }

        /* CTA */
        .about-cta-section {
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          color: #fff;
        }
        .about-cta-inner {
          text-align: center;
        }
        .about-cta-title {
          font-size: clamp(1.6rem, 4vw, 2.4rem);
          font-weight: 800;
          margin: 0 0 0.75rem;
        }
        .about-cta-sub {
          opacity: 0.85;
          font-size: 1rem;
          margin: 0 0 2rem;
        }
        .about-cta-buttons {
          display: flex;
          gap: 1rem;
          justify-content: center;
          flex-wrap: wrap;
        }
        .btn-primary {
          background: #fff;
          color: #6366f1;
          border: none;
          border-radius: 10px;
          padding: 0.75rem 1.75rem;
          font-size: 0.95rem;
          font-weight: 700;
          cursor: pointer;
          transition: transform 0.15s, box-shadow 0.15s;
        }
        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(0,0,0,0.2);
        }
        .btn-ghost {
          background: transparent;
          color: #fff;
          border: 2px solid rgba(255,255,255,0.6);
          border-radius: 10px;
          padding: 0.75rem 1.75rem;
          font-size: 0.95rem;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.15s, border-color 0.15s;
        }
        .btn-ghost:hover {
          background: rgba(255,255,255,0.12);
          border-color: #fff;
        }
      `}</style>

    </main>
  )
}
