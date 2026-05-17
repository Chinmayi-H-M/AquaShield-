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
      <section style={{ 
        background: 'linear-gradient(135deg, #1e3a5f 0%, #1d4ed8 50%, #0ea5e9 100%)', 
        color: '#fff', 
        padding: '100px 24px 140px',
        position: 'relative'
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 60 }}>
          {/* Left text */}
          <div style={{ flex: 1 }}>
            <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '6px 16px', borderRadius: 999,
                background: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.2)',
                backdropFilter: 'blur(10px)',
                fontSize: 12, fontWeight: 700,
                color: '#fff', marginBottom: 24,
                fontFamily: 'var(--font-display)',
                letterSpacing: '0.05em'
            }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981', display: 'inline-block', boxShadow: '0 0 10px #10b981' }} />
                AI-DRIVEN WATER SAFETY
            </div>
            <h1 style={{ fontSize: 58, fontWeight: 800, lineHeight: 1.05, marginBottom: 24, fontFamily: 'var(--font-display)', letterSpacing: '-0.02em' }}>
              Is Your Water<br />
              <span style={{ color: '#93c5fd', textShadow: '0 0 30px rgba(147,197,253,0.3)' }}>Safe to Drink?</span>
            </h1>
            <p style={{ fontSize: 18, color: '#bfdbfe', marginBottom: 40, lineHeight: 1.7, maxWidth: 500 }}>
              Harness the power of Deep Neural Networks to analyze water potability in seconds. Accurate, fast, and accessible everywhere.
            </p>

            <div style={{ display: 'flex', gap: 16 }}>
              <Link href="/test" className="btn-hover-effect" style={{ 
                background: '#fff', color: '#1d4ed8', 
                padding: '14px 36px', borderRadius: 12, 
                fontWeight: 700, fontSize: 16, 
                textDecoration: 'none',
                boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                display: 'inline-block'
              }}>
                Start Free Test
              </Link>
              <Link href="/dashboard" style={{ 
                background: 'rgba(255,255,255,0.15)', color: '#fff', 
                padding: '14px 36px', borderRadius: 12, 
                fontWeight: 600, fontSize: 16, 
                textDecoration: 'none', 
                border: '1px solid rgba(255,255,255,0.3)',
                backdropFilter: 'blur(10px)'
              }}>
                View Metrics
              </Link>
            </div>
          </div>

          {/* Right — decorative water glass */}
          <div style={{ flex: 1, display: 'flex', justifyContent: 'center', position: 'relative' }}>
            <div style={{ position: 'relative', width: 360, height: 360 }}>
              {/* Floating blobs */}
              <div style={{ position: 'absolute', top: -20, left: -20, width: 100, height: 100, background: 'rgba(147,197,253,0.2)', borderRadius: '50%', filter: 'blur(30px)', animation: 'blobmove 8s infinite alternate' }} />
              <div style={{ position: 'absolute', bottom: -10, right: -10, width: 120, height: 120, background: 'rgba(56,189,248,0.2)', borderRadius: '50%', filter: 'blur(40px)', animation: 'blobmove 10s infinite alternate-reverse' }} />
              
              {/* Glass container */}
              <div style={{ 
                position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', 
                width: 180, height: 260, 
                background: 'linear-gradient(180deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.05) 100%)', 
                borderRadius: '12px 12px 40px 40px', 
                border: '2px solid rgba(255,255,255,0.4)', 
                backdropFilter: 'blur(20px)', 
                overflow: 'hidden',
                boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)'
              }}>
                <div style={{ 
                    position: 'absolute', bottom: 0, left: 0, right: 0, 
                    height: '70%', 
                    background: 'linear-gradient(180deg, rgba(56,189,248,0.6) 0%, rgba(37,99,235,0.8) 100%)',
                    transition: 'height 2s ease-in-out'
                }}>
                    <div style={{ 
                        position: 'absolute', top: 0, left: 0, right: 0, height: 20, 
                        background: 'rgba(255,255,255,0.2)', filter: 'blur(10px)',
                        borderRadius: '50%'
                    }} />
                </div>
                {/* Bubbles */}
                {[{ l: 30, b: 80, s: 8 }, { l: 80, b: 100, s: 5 }, { l: 50, b: 140, s: 6 }, { l: 20, b: 130, s: 4 }, { l: 100, b: 60, s: 7 }].map((b, i) => (
                  <div key={i} style={{ 
                      position: 'absolute', left: `${b.l}%`, bottom: b.b, 
                      width: b.s, height: b.s, borderRadius: '50%', 
                      background: 'rgba(255,255,255,0.4)', 
                      animation: `bubble${i} ${2 + Math.random() * 2}s ease-in-out infinite`, 
                      animationDelay: `${i * 0.4}s` 
                  }} />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Hero Wave Divider */}
        <div className="hero-wave">
            <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
                <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="shape-fill"></path>
            </svg>
        </div>
      </section>

      {/* ── STATS ── */}
      <section style={{ background: 'var(--bg-primary)', position: 'relative', zIndex: 10 }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
            <div className="glass-bright" style={{ 
                marginTop: -40, borderRadius: 24, 
                display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', 
                overflow: 'hidden',
                boxShadow: '0 20px 50px rgba(0,0,0,0.05)'
            }}>
            {[
                { v: '2B+', l: 'Lack Safe Water', c: 'var(--unsafe)' },
                { v: '92.4%', l: 'Model Accuracy', c: 'var(--safe)' },
                { v: '9+', l: 'Chemical Features', c: 'var(--aqua)' },
                { v: '<1s', l: 'Prediction Speed', c: 'var(--aqua-bright)' },
            ].map((s, i) => (
                <div key={s.l} style={{ 
                    textAlign: 'center', padding: '32px 24px', 
                    borderRight: i < 3 ? '1px solid var(--border)' : 'none' 
                }}>
                <div style={{ fontSize: 36, fontWeight: 800, color: s.c, marginBottom: 4, fontFamily: 'var(--font-display)' }}>{s.v}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.l}</div>
                </div>
            ))}
            </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section style={{ padding: '100px 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <div style={{ 
                display: 'inline-block', background: 'rgba(14,165,233,0.1)', 
                color: 'var(--aqua)', padding: '5px 16px', borderRadius: 999, 
                fontSize: 12, fontWeight: 700, marginBottom: 16,
                letterSpacing: '0.08em'
            }}>TECHNOLOGY</div>
            <h2 style={{ fontSize: 42, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 16, fontFamily: 'var(--font-display)', letterSpacing: '-0.01em' }}>Intelligence for Every Drop</h2>
            <p style={{ fontSize: 16, color: 'var(--text-muted)', maxWidth: 540, margin: '0 auto', lineHeight: 1.6 }}>Our platform combines state-of-the-art machine learning with global water standards to provide reliable health assessments.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 32 }}>
            {features.map(f => (
              <div key={f.title} className="card feature-card" style={{ padding: '40px 32px' }}>
                <div style={{ 
                    fontSize: 32, marginBottom: 20, 
                    width: 60, height: 60, 
                    background: 'var(--bg-primary)', 
                    borderRadius: 16, 
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: 'inset 0 0 15px rgba(0,0,0,0.02)'
                }}>{f.icon}</div>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 12, fontFamily: 'var(--font-display)' }}>{f.title}</h3>
                <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.7 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* ── HOW IT WORKS ── */}
      <section style={{ background: '#fff', padding: '100px 24px', borderTop: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <div style={{ 
                display: 'inline-block', background: 'rgba(14,165,233,0.1)', 
                color: 'var(--aqua)', padding: '5px 16px', borderRadius: 999, 
                fontSize: 12, fontWeight: 700, marginBottom: 16,
                letterSpacing: '0.08em'
            }}>WORKFLOW</div>
            <h2 style={{ fontSize: 42, fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-display)', letterSpacing: '-0.01em' }}>Seamless Testing Flow</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 48 }}>
            {[
              { step: '01', icon: '🧪', title: 'Input Parameters', desc: 'Input 9 key chemical measurements from your local sample.' },
              { step: '02', icon: '🤖', title: 'Neural Analysis', desc: 'Our MLP model processes features through trained hidden layers.' },
              { step: '03', icon: '✅', title: 'Actionable Verdict', desc: 'Get a clear safety status, risk score, and SHAP explanations.' },
            ].map((s, i) => (
              <div key={s.step} style={{ textAlign: 'center', position: 'relative' }}>
                <div style={{ 
                    width: 80, height: 80, 
                    background: 'var(--bg-primary)', 
                    borderRadius: '24px', 
                    display: 'flex', alignItems: 'center', justifyContent: 'center', 
                    margin: '0 auto 24px', fontSize: 32,
                    boxShadow: '0 10px 20px rgba(0,0,0,0.03)',
                    border: '1px solid var(--border)'
                }}>{s.icon}</div>
                <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--aqua)', marginBottom: 8, letterSpacing: '0.1em' }}>PHASE {s.step}</div>
                <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 12, fontFamily: 'var(--font-display)' }}>{s.title}</h3>
                <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.6 }}>{s.desc}</p>
                {i < 2 && (
                    <div style={{ 
                        position: 'absolute', top: 40, right: -40, 
                        width: 32, height: 2, 
                        background: 'linear-gradient(to right, var(--border), transparent)',
                        display: 'none' // Hide on mobile
                    }} />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section style={{ padding: '100px 24px' }}>
        <div style={{ 
            maxWidth: 1000, margin: '0 auto', 
            background: 'linear-gradient(135deg, #1e3a5f 0%, #1d4ed8 100%)', 
            borderRadius: 32, padding: '80px 48px', 
            textAlign: 'center', color: '#fff',
            position: 'relative', overflow: 'hidden',
            boxShadow: '0 30px 60px rgba(29, 78, 216, 0.2)'
        }}>
          {/* Decorative rings */}
          <div style={{ position: 'absolute', top: -100, right: -100, width: 300, height: 300, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.1)' }} />
          <div style={{ position: 'absolute', bottom: -50, left: -50, width: 200, height: 200, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.1)' }} />
          
          <h2 style={{ fontSize: 42, fontWeight: 800, marginBottom: 16, fontFamily: 'var(--font-display)', letterSpacing: '-0.01em' }}>Secure Your Water Future</h2>
          <p style={{ color: '#bfdbfe', fontSize: 18, marginBottom: 40, maxWidth: 600, margin: '0 auto 40px', lineHeight: 1.6 }}>Join the mission to bring AI-powered water safety to every community. Accurate results, zero lab costs.</p>
          <Link href="/test" className="btn-hover-effect" style={{ 
            background: '#fff', color: '#1d4ed8', 
            padding: '16px 48px', borderRadius: 14, 
            fontWeight: 700, fontSize: 17, 
            textDecoration: 'none', display: 'inline-block',
            boxShadow: '0 10px 20px rgba(0,0,0,0.1)'
          }}>
            Analyze Sample Now →
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
              <span style={{ color: '#fff', fontWeight: 700, fontSize: 14 }}>AquaShield</span>
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
          © 2026 AquaShield · Built for public good
        </div>
      </footer>
    </div>
  );
}