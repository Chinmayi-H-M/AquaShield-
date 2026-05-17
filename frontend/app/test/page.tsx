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


export default function TestPage() {
  const router = useRouter();
  const [params, setParams] = useState<WaterParams>({ ...defaultParams });
  const [loading, setLoading] = useState(false);

  const set = (key: keyof WaterParams, v: number) => setParams((p: WaterParams) => ({ ...p, [key]: v }));

  const handlePredict = async () => {
    setLoading(true);
    // Simulate a bit of processing delay for UX
    await new Promise(r => setTimeout(r, 1000));
    
    // Ensure no NaNs are passed
    const cleanParams = { ...params };
    for (const key of Object.keys(cleanParams) as (keyof WaterParams)[]) {
        if (Number.isNaN(cleanParams[key])) {
            cleanParams[key] = 0;
        }
    }

    const result = await runPrediction(cleanParams);
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

              return (
                <div key={p.key}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
                    <label style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: 'var(--text-secondary)',
                      fontFamily: 'var(--font-display)',
                      letterSpacing: '0.02em',
                    }}>
                      {p.label}
                    </label>
                    <span style={{ color: '#6b7280', fontSize: 11, fontWeight: 500 }}>
                      WHO: {p.who} {p.unit}
                    </span>
                  </div>
                  <div style={{ position: 'relative', marginBottom: 6 }}>
                    <input
                      type="number"
                      min={p.min}
                      max={p.max}
                      step={p.step}
                      value={Number.isNaN(val) ? '' : val}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        const newVal = e.target.value === '' ? NaN : parseFloat(e.target.value);
                        set(p.key, newVal);
                      }}
                      placeholder={`e.g. ${p.min}`}
                      style={{ 
                        width: '100%', 
                        padding: '12px 16px', 
                        borderRadius: '10px', 
                        border: '1px solid #e2e8f0', 
                        fontSize: '15px', 
                        fontFamily: 'var(--font-mono)', 
                        color: 'var(--text-primary)',
                        background: '#f8fafc',
                        outline: 'none',
                        transition: 'all 0.2s ease',
                        boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)'
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#3b82f6';
                        e.target.style.background = '#ffffff';
                        e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = '#e2e8f0';
                        e.target.style.background = '#f8fafc';
                        e.target.style.boxShadow = 'inset 0 2px 4px rgba(0,0,0,0.02)';
                      }}
                    />
                    {p.unit && (
                      <div style={{ 
                        position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', 
                        color: '#94a3b8', fontSize: 13, pointerEvents: 'none' 
                      }}>
                        {p.unit}
                      </div>
                    )}
                  </div>
                  <div style={{ fontSize: 11, color: '#9ca3af', display: 'flex', justifyContent: 'space-between' }}>
                    <span>Min: {p.min}</span>
                    <span>Max: {p.max.toLocaleString()}</span>
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
          <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>Running Random Forest classification model</div>
        </div>
      )}
    </div>
  );
}