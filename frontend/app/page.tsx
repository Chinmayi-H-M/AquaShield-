'use client';
import Link from 'next/link';

const features = [
  { icon: '🧪', title: '9+ Chemical Parameters', desc: 'Analyzes pH, hardness, chloramines, sulfate, conductivity, TOC, trihalomethanes, and turbidity.' },
  { icon: '🤖', title: 'AI / ML Powered', desc: 'Deep ANN trained on thousands of real-world water samples for accurate binary classification.' },
  { icon: '⚡', title: 'Instant Results', desc: 'Get potability prediction with risk score in under one second — no lab required.' },
  { icon: '🔍', title: 'Model Explainability', desc: 'SHAP-based explanations show exactly which parameters drove the prediction.' },
  { icon: '📊', title: 'Analytics Dashboard', desc: 'Track model performance metrics, confusion matrix, ROC curve and training history.' },
  { icon: '🌍', title: 'Built for Crisis Zones', desc: 'Designed for underserved and disaster-affected regions where labs are unavailable.' },
];

export default function LandingPage() {
  return (
    <div style={{ background: '#f9fafb', minHeight: '100vh' }}>

      {/* ── HERO ── */}
      <section style={{ background: 'linear-gradient(135deg, #1e3a5f 0%, #1d4ed8 50%, #0ea5e9 100%)', color: '#fff', padding: '80px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 60 }}>
          {/* Left text */}
          <div style={{ flex: 1 }}>
            <h1 style={{ fontSize: 52, fontWeight: 800, lineHeight: 1.1, marginBottom: 20 }}>
              Is Your Water<br />
              <span style={{ color: '#93c5fd' }}>Safe to Drink?</span>
            </h1>
            <p style={{ fontSize: 17, color: '#bfdbfe', marginBottom: 32, lineHeight: 1.7, maxWidth: 460 }}>
              AI-powered water quality prediction system for real-time safety analysis using 9+ physicochemical parameters.
            </p>

            {/* Pills */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 36 }}>
              {['✓  9+ Chemical Parameters', '✓  AI / ML Powered', '✓  Instant Results'].map(t => (
                <span key={t} style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.25)', borderRadius: 999, padding: '5px 14px', fontSize: 13, fontWeight: 500, backdropFilter: 'blur(8px)' }}>{t}</span>
              ))}
            </div>

            <div style={{ display: 'flex', gap: 12 }}>
              <Link href="/test" style={{ background: '#fff', color: '#1d4ed8', padding: '12px 28px', borderRadius: 8, fontWeight: 700, fontSize: 15, textDecoration: 'none' }}>
                Test Water Now
              </Link>
              <Link href="/dashboard" style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', padding: '12px 28px', borderRadius: 8, fontWeight: 600, fontSize: 15, textDecoration: 'none', border: '1px solid rgba(255,255,255,0.3)' }}>
                Learn More
              </Link>
            </div>
          </div>

          {/* Right — decorative water glass */}
          <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
            <div style={{ position: 'relative', width: 320, height: 320 }}>
              {/* Glow */}
              <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle, rgba(147,197,253,0.3) 0%, transparent 70%)', borderRadius: '50%' }} />
              {/* Glass */}
              <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 160, height: 220, background: 'linear-gradient(180deg, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.1) 100%)', borderRadius: '8px 8px 24px 24px', border: '2px solid rgba(255,255,255,0.4)', backdropFilter: 'blur(20px)', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '65%', background: 'linear-gradient(180deg, rgba(147,197,253,0.6) 0%, rgba(59,130,246,0.8) 100%)' }} />
                {/* Bubbles */}
                {[{ l: 30, b: 80, s: 8 }, { l: 80, b: 100, s: 5 }, { l: 50, b: 140, s: 6 }, { l: 20, b: 130, s: 4 }, { l: 100, b: 60, s: 7 }].map((b, i) => (
                  <div key={i} style={{ position: 'absolute', left: b.l, bottom: b.b, width: b.s, height: b.s, borderRadius: '50%', background: 'rgba(255,255,255,0.5)', animation: `bubble${i} 3s ease-in-out infinite`, animationDelay: `${i * 0.6}s` }} />
                ))}
              </div>
              {/* Ripple rings */}
              <div style={{ position: 'absolute', bottom: 30, left: '50%', transform: 'translateX(-50%)', width: 100, height: 20, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.3)' }} />
              <div style={{ position: 'absolute', bottom: 22, left: '50%', transform: 'translateX(-50%)', width: 150, height: 28, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.15)' }} />
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section style={{ background: '#fff', borderBottom: '1px solid #e5e7eb' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 24px', display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 0 }}>
          {[
            { v: '2B+', l: 'People Lack Safe Water' },
            { v: '92.4%', l: 'Model Accuracy' },
            { v: '9+', l: 'Chemical Parameters' },
            { v: '<1s', l: 'Prediction Speed' },
          ].map((s, i) => (
            <div key={s.l} style={{ textAlign: 'center', padding: '24px', borderRight: i < 3 ? '1px solid #e5e7eb' : 'none' }}>
              <div style={{ fontSize: 32, fontWeight: 800, color: '#2563eb', marginBottom: 4 }}>{s.v}</div>
              <div style={{ fontSize: 13, color: '#6b7280' }}>{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section style={{ padding: '72px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div style={{ display: 'inline-block', background: '#eff6ff', color: '#2563eb', padding: '4px 14px', borderRadius: 999, fontSize: 12, fontWeight: 600, marginBottom: 12 }}>CAPABILITIES</div>
            <h2 style={{ fontSize: 34, fontWeight: 800, color: '#111827', marginBottom: 12 }}>Built for Real Impact</h2>
            <p style={{ fontSize: 15, color: '#6b7280', maxWidth: 500, margin: '0 auto' }}>Combining AI, public health data and WHO guidelines for reliable water safety classification.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 24 }}>
            {features.map(f => (
              <div key={f.title} className="card" style={{ padding: 28 }}>
                <div style={{ fontSize: 28, marginBottom: 14 }}>{f.icon}</div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: '#111827', marginBottom: 8 }}>{f.title}</h3>
                <p style={{ fontSize: 13, color: '#6b7280', lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section style={{ background: '#fff', padding: '72px 24px', borderTop: '1px solid #e5e7eb' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div style={{ display: 'inline-block', background: '#eff6ff', color: '#2563eb', padding: '4px 14px', borderRadius: 999, fontSize: 12, fontWeight: 600, marginBottom: 12 }}>WORKFLOW</div>
            <h2 style={{ fontSize: 34, fontWeight: 800, color: '#111827' }}>How It Works</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 32 }}>
            {[
              { step: '01', icon: '🧪', title: 'Input Parameters', desc: 'Enter 9 physicochemical measurements from your water sample.' },
              { step: '02', icon: '🤖', title: 'AI Analysis', desc: 'Our ANN processes features through trained classification layers.' },
              { step: '03', icon: '✅', title: 'Get Results', desc: 'Receive safety verdict, risk score, and SHAP-based explanation.' },
            ].map((s, i) => (
              <div key={s.step} style={{ textAlign: 'center' }}>
                <div style={{ width: 56, height: 56, background: '#eff6ff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: 22 }}>{s.icon}</div>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#2563eb', marginBottom: 6 }}>STEP {s.step}</div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: '#111827', marginBottom: 8 }}>{s.title}</h3>
                <p style={{ fontSize: 13, color: '#6b7280', lineHeight: 1.6 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section style={{ padding: '72px 24px' }}>
        <div style={{ maxWidth: 800, margin: '0 auto', background: 'linear-gradient(135deg,#1e3a5f,#2563eb)', borderRadius: 20, padding: '56px 48px', textAlign: 'center', color: '#fff' }}>
          <h2 style={{ fontSize: 32, fontWeight: 800, marginBottom: 12 }}>Ready to Test Your Water?</h2>
          <p style={{ color: '#bfdbfe', fontSize: 15, marginBottom: 32 }}>Get an instant AI-powered safety assessment with full explainability.</p>
          <Link href="/test" style={{ background: '#fff', color: '#1d4ed8', padding: '13px 32px', borderRadius: 8, fontWeight: 700, fontSize: 15, textDecoration: 'none', display: 'inline-block' }}>
            Start Analysis →
          </Link>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ background: '#111827', color: '#9ca3af', padding: '48px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 40 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <div style={{ width: 28, height: 28, background: 'linear-gradient(135deg,#2563eb,#0ea5e9)', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 2C12 2 4 10 4 15a8 8 0 0016 0c0-5-8-13-8-13z" fill="white" /></svg>
              </div>
              <span style={{ color: '#fff', fontWeight: 700, fontSize: 14 }}>AquaSafe AI</span>
            </div>
            <p style={{ fontSize: 13, lineHeight: 1.7, maxWidth: 260 }}>AI-powered water quality prediction system for a safer tomorrow.</p>
            <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
              {['f', 't', 'in', 'gh'].map(s => (
                <div key={s} style={{ width: 30, height: 30, borderRadius: '50%', background: '#374151', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, color: '#9ca3af', cursor: 'pointer' }}>{s}</div>
              ))}
            </div>
          </div>
          {[
            { title: 'Quick Links', items: ['Home', 'Test Water', 'Dashboard', 'About', 'Team'] },
            { title: 'Resources', items: ['Documentation', 'Dataset', 'API', 'GitHub'] },
            { title: 'Contact Us', items: ['info@aquasafe.ai', '+1 234 567 8900', '123 Water Street, Clean City, Earth'] },
          ].map(col => (
            <div key={col.title}>
              <div style={{ color: '#fff', fontWeight: 600, fontSize: 13, marginBottom: 14 }}>{col.title}</div>
              {col.items.map(item => (
                <div key={item} style={{ fontSize: 13, marginBottom: 8, cursor: 'pointer' }}>{item}</div>
              ))}
            </div>
          ))}
        </div>
        <div style={{ maxWidth: 1200, margin: '32px auto 0', paddingTop: 24, borderTop: '1px solid #374151', textAlign: 'center', fontSize: 12 }}>
          © 2026 AquaSafe AI · Built for public good
        </div>
      </footer>
    </div>
  );
}