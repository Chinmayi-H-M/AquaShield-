/** @jsxImportSource react */
'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { defaultParams, runPrediction, setLastResult, type WaterParams } from '@/lib/prediction';

interface Param {
  key: keyof WaterParams;
  label: string;
  unit: string;
  min: number;
  max: number;
  step: number;
  who: string;
}

const PARAMS: Param[] = [
  { key: 'ph', label: 'pH', unit: '', min: 0, max: 14, step: 0.1, who: '6.5 – 8.5' },
  { key: 'conductivity', label: 'Conductivity', unit: 'µS/cm', min: 0, max: 2000, step: 10, who: '< 400' },
  { key: 'hardness', label: 'Hardness', unit: 'mg/L', min: 0, max: 500, step: 1, who: '< 300' },
  { key: 'organicCarbon', label: 'Organic Carbon', unit: 'ppm', min: 0, max: 30, step: 0.1, who: '< 10' },
  { key: 'solids', label: 'Total Dissolved Solids', unit: 'ppm', min: 0, max: 100000, step: 100, who: '< 500' },
  { key: 'trihalomethanes', label: 'Trihalomethanes', unit: 'µg/L', min: 0, max: 160, step: 0.5, who: '< 80' },
  { key: 'chloramines', label: 'Chloramines', unit: 'ppm', min: 0, max: 12, step: 0.1, who: '< 4' },
  { key: 'turbidity', label: 'Turbidity', unit: 'NTU', min: 0, max: 10, step: 0.1, who: '< 1' },
  { key: 'sulfate', label: 'Sulfate', unit: 'mg/L', min: 0, max: 1000, step: 1, who: '< 400' },
];

function fmt(key: keyof WaterParams, v: number) {
  if (key === 'solids') return v.toLocaleString();
  if (['ph', 'turbidity', 'chloramines', 'organicCarbon', 'trihalomethanes'].includes(key)) return v.toFixed(1);
  return String(v);
}

export default function TestPage() {
  const router = useRouter();
  const [params, setParams] = useState<WaterParams>({ ...defaultParams });
  const [loading, setLoading] = useState(false);

  const set = (key: keyof WaterParams, v: number) => setParams((p: WaterParams) => ({ ...p, [key]: v }));

  const handlePredict = async () => {
    setLoading(true);
    // Simulate a bit of processing delay for UX
    await new Promise(r => setTimeout(r, 1000));
    const result = await runPrediction(params);
    setLastResult(result);
    router.push('/prediction');
  };

  return (
    <div className="water-grid" style={{ minHeight: 'calc(100vh - 60px)', padding: '40px 24px 60px' }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{
            display: 'inline-block',
            background: '#eff6ff',
            color: '#2563eb',
            padding: '4px 14px',
            borderRadius: 999,
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: '0.08em',
            marginBottom: 12,
            fontFamily: 'var(--font-display)',
          }}>
            WATER ANALYSIS
          </div>
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 30,
            fontWeight: 800,
            color: 'var(--text-primary)',
            marginBottom: 8,
          }}>
            Test Your Water Quality
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>
            Adjust the 9 physicochemical parameters below to get an instant AI-powered safety prediction.
          </p>
        </div>

        {/* Parameter Card */}
        <div className="card" style={{ padding: '36px 40px', marginBottom: 28 }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '32px 56px',
          }}>
            {PARAMS.map(p => {
              const val = params[p.key];
              const pct = ((val - p.min) / (p.max - p.min)) * 100;

              return (
                <div key={p.key}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
                    <label style={{
                      fontSize: 12,
                      fontWeight: 600,
                      color: 'var(--text-secondary)',
                      fontFamily: 'var(--font-display)',
                      letterSpacing: '0.02em',
                    }}>
                      {p.label}
                      {p.unit && (
                        <span style={{ color: 'var(--text-muted)', fontWeight: 400, marginLeft: 4, fontSize: 11 }}>
                          ({p.unit})
                        </span>
                      )}
                    </label>
                    <span style={{
                      fontSize: 15,
                      fontWeight: 700,
                      color: '#2563eb',
                      fontFamily: 'var(--font-mono)',
                      minWidth: 60,
                      textAlign: 'right',
                    }}>
                      {fmt(p.key, val)}
                    </span>
                  </div>
                  <div style={{ position: 'relative', marginBottom: 6 }}>
                    {/* Filled track */}
                    <div style={{
                      position: 'absolute',
                      top: '50%',
                      left: 0,
                      width: `${pct}%`,
                      height: 4,
                      background: 'linear-gradient(90deg, #1d4ed8, #0ea5e9)',
                      borderRadius: 2,
                      transform: 'translateY(-50%)',
                      pointerEvents: 'none',
                      zIndex: 1,
                    }} />
                    <input
                      type="range"
                      min={p.min}
                      max={p.max}
                      step={p.step}
                      value={val}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => set(p.key, parseFloat(e.target.value))}
                      style={{ position: 'relative', zIndex: 2, background: 'transparent' }}
                    />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#9ca3af' }}>
                    <span>{p.min}</span>
                    <span style={{ color: '#6b7280', fontWeight: 500 }}>WHO: {p.who}</span>
                    <span>{p.max.toLocaleString()}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 12 }}>
          <button
            className="btn-outline"
            onClick={() => setParams({ ...defaultParams })}
            style={{ padding: '11px 32px' }}
          >
            Reset to Defaults
          </button>
          <button
            className="btn-primary"
            onClick={handlePredict}
            disabled={loading}
            style={{ padding: '11px 40px', fontSize: 15 }}
          >
            {loading ? (
              <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{
                  width: 16, height: 16,
                  border: '2px solid rgba(255,255,255,0.35)',
                  borderTopColor: '#fff',
                  borderRadius: '50%',
                  display: 'inline-block',
                  animation: 'spin 0.7s linear infinite',
                }} />
                Predicting…
              </span>
            ) : 'Run Prediction →'}
          </button>
        </div>
      </div>

      {/* Loading overlay */}
      {loading && (
        <div style={{
          position: 'fixed', inset: 0,
          background: 'rgba(247,250,252,0.88)',
          backdropFilter: 'blur(6px)',
          zIndex: 999,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', gap: 16,
        }}>
          <div style={{
            width: 52, height: 52,
            border: '3px solid #e2e8f0',
            borderTopColor: '#2563eb',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
          }} />
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>
            Analyzing water quality…
          </div>
          <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>Running ANN classification model</div>
        </div>
      )}
    </div>
  );
}