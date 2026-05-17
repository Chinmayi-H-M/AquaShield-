/** @jsxImportSource react */
'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle2, XCircle, AlertTriangle, FlaskConical, ArrowLeft, BarChart2 } from 'lucide-react';
import { getLastResult, type PredictionResult } from '@/lib/prediction';

export default function PredictionPage() {
    const router = useRouter();
    const [result, setResult] = useState<PredictionResult | null>(null);
    const [revealed, setRevealed] = useState(false);

    useEffect(() => {
        const r = getLastResult();
        if (!r) { router.push('/test'); return; }
        setResult(r);
        setTimeout(() => setRevealed(true), 300);
    }, [router]);

    if (!result) return null;

    const { isSafe, confidence, riskScore, params, shapValues } = result;

    const statusColor = isSafe ? 'var(--safe)' : riskScore > 60 ? 'var(--unsafe)' : 'var(--warn)';
    const statusLabel = isSafe ? 'SAFE TO DRINK' : riskScore > 60 ? 'UNSAFE TO DRINK' : 'USE WITH CAUTION';
    const StatusIcon = isSafe ? CheckCircle2 : riskScore > 60 ? XCircle : AlertTriangle;

    const paramEntries = [
        { label: 'pH', value: params.ph.toFixed(1), unit: '' },
        { label: 'Hardness', value: String(params.hardness), unit: 'mg/L' },
        { label: 'Solids', value: params.solids.toLocaleString(), unit: 'ppm' },
        { label: 'Chloramines', value: params.chloramines.toFixed(1), unit: 'ppm' },
        { label: 'Sulfate', value: String(params.sulfate), unit: 'mg/L' },
        { label: 'Conductivity', value: String(params.conductivity), unit: 'µS/cm' },
        { label: 'Organic Carbon', value: params.organicCarbon.toFixed(1), unit: 'ppm' },
        { label: 'Trihalomethanes', value: params.trihalomethanes.toFixed(1), unit: 'µg/L' },
        { label: 'Turbidity', value: params.turbidity.toFixed(1), unit: 'NTU' },
    ];

    return (
        <div
            className="water-grid"
            style={{ minHeight: 'calc(100vh - 60px)', padding: '40px 24px 60px' }}
        >
            <div className="page-enter" style={{ maxWidth: 800, margin: '0 auto' }}>

                {/* Back */}
                <Link
                    href="/test"
                    style={{
                        display: 'inline-flex', alignItems: 'center', gap: 6,
                        fontSize: 13, color: 'var(--text-muted)',
                        textDecoration: 'none', marginBottom: 28,
                        transition: 'color 0.15s',
                    }}
                >
                    <ArrowLeft size={14} /> Back to Test
                </Link>

                {/* Result card */}
                <div
                    className="card"
                    style={{
                        padding: '48px 40px',
                        textAlign: 'center',
                        marginBottom: 24,
                        borderColor: `${statusColor}33`,
                        boxShadow: `0 0 60px ${statusColor}18`,
                        position: 'relative',
                        overflow: 'hidden',
                    }}
                >
                    {/* Ripple rings */}
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none', opacity: 0.08 }}>
                        {[1, 2, 3].map(i => (
                            <div key={i} style={{
                                position: 'absolute',
                                borderRadius: '50%',
                                border: `1px solid ${statusColor}`,
                                width: `${i * 200}px`,
                                height: `${i * 200}px`,
                                animation: `ripple ${i + 1}s linear infinite`,
                                animationDelay: `${i * 0.5}s`,
                            }} />
                        ))}
                    </div>

                    {/* Badge */}
                    <div style={{
                        display: 'inline-flex', alignItems: 'center', gap: 6,
                        padding: '5px 14px', borderRadius: 999,
                        background: `${statusColor}12`,
                        border: `1px solid ${statusColor}40`,
                        color: statusColor,
                        fontSize: 11, fontWeight: 700,
                        letterSpacing: '0.08em',
                        fontFamily: 'var(--font-display)',
                        marginBottom: 24,
                    }}>
                        <span style={{ width: 6, height: 6, borderRadius: '50%', background: statusColor, display: 'inline-block' }} />
                        AQUASHIELD ANALYSIS
                    </div>

                    {/* Liquid Animation Container */}
                    <div className="liquid-container" style={{ borderColor: `${statusColor}40` }}>
                        <div 
                            className="liquid" 
                            style={{ 
                                height: revealed ? `${100 - riskScore}%` : '0%',
                                background: statusColor 
                            }} 
                        />
                        <div style={{ 
                            position: 'absolute', inset: 0, 
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            zIndex: 10,
                            transform: revealed ? 'scale(1)' : 'scale(0)',
                            transition: 'transform 0.6s cubic-bezier(0.34,1.56,0.64,1) 0.5s',
                        }}>
                            <StatusIcon size={48} style={{ color: isSafe ? '#fff' : riskScore > 60 ? '#fff' : statusColor }} />
                        </div>
                    </div>

                    <h1 style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: 38,
                        fontWeight: 800,
                        color: statusColor,
                        marginBottom: 10,
                        letterSpacing: '-0.5px',
                    }}>
                        {statusLabel}
                    </h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 32, lineHeight: 1.6, maxWidth: 440, margin: '0 auto 32px' }}>
                        {isSafe
                            ? 'Your water quality is within acceptable parameters for human consumption according to WHO guidelines.'
                            : riskScore > 60
                                ? 'This water sample exceeds safety thresholds and poses health risks. Immediate filtration or treatment required.'
                                : 'Some parameters are borderline. While not strictly toxic, further professional testing is recommended.'}
                    </p>

                    {/* Confidence & Risk Score */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, maxWidth: 320, margin: '0 auto 28px' }}>
                        {[
                            { label: 'Model Confidence', value: `${confidence}%` },
                            { label: 'Risk Score', value: `${riskScore}%` },
                        ].map((item: { label: string, value: string }) => (
                            <div key={item.label} style={{
                                background: `${statusColor}08`,
                                border: `1px solid ${statusColor}25`,
                                borderRadius: 12,
                                padding: '16px 12px',
                            }}>
                                <div style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6, fontFamily: 'var(--font-display)' }}>
                                    {item.label}
                                </div>
                                <div style={{ fontFamily: 'var(--font-display)', fontSize: 30, fontWeight: 800, color: statusColor }}>
                                    {item.value}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Risk bar (Safety Spectrum) */}
                    <div style={{ maxWidth: 460, margin: '0 auto' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 12 }}>
                            <div style={{ textAlign: 'left' }}>
                                <div style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 2 }}>Current Status</div>
                                <div style={{ fontSize: 14, fontWeight: 700, color: statusColor }}>
                                    {riskScore < 30 ? 'Safe / Low Risk' : riskScore < 60 ? 'Caution / Moderate' : 'Unsafe / High Risk'}
                                </div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <div style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 2 }}>Risk Score</div>
                                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 18, fontWeight: 700, color: statusColor }}>{riskScore}%</div>
                            </div>
                        </div>

                        {/* Spectrum Bar */}
                        <div style={{ position: 'relative', height: 12, marginBottom: 24 }}>
                            {/* Track Background (Gradient) */}
                            <div style={{
                                position: 'absolute', inset: 0,
                                background: 'linear-gradient(to right, var(--safe) 0%, var(--warn) 50%, var(--unsafe) 100%)',
                                borderRadius: 6,
                                opacity: 0.2,
                            }} />
                            
                            {/* The colored track itself */}
                            <div style={{
                                position: 'absolute', inset: 0,
                                background: 'linear-gradient(to right, var(--safe) 0%, var(--warn) 50%, var(--unsafe) 100%)',
                                borderRadius: 6,
                                clipPath: `inset(0 ${100 - (revealed ? riskScore : 0)}% 0 0)`,
                                transition: 'clip-path 1.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
                            }} />

                            {/* Indicator / Pointer */}
                            <div style={{
                                position: 'absolute',
                                top: '50%',
                                left: `${revealed ? riskScore : 0}%`,
                                transform: 'translate(-50%, -50%)',
                                width: 20,
                                height: 20,
                                background: '#fff',
                                border: `3px solid ${statusColor}`,
                                borderRadius: '50%',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                                zIndex: 10,
                                transition: 'left 1.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
                            }}>
                                <div style={{ position: 'absolute', top: -20, left: '50%', transform: 'translateX(-50%)', width: 2, height: 8, background: statusColor }} />
                            </div>
                        </div>

                        {/* Legend Labels */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--text-muted)', fontWeight: 600 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--safe)' }} />
                                SAFE
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--warn)' }} />
                                CAUTION
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--unsafe)' }} />
                                UNSAFE
                            </div>
                        </div>
                    </div>
                </div>

                {/* Input summary */}
                <div className="card" style={{ padding: '28px 32px', marginBottom: 20 }}>
                    <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 20 }}>
                        Input Summary
                    </h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
                        {paramEntries.map(({ label, value, unit }) => (
                            <div key={label} style={{
                                background: 'var(--bg-primary)',
                                border: '1px solid var(--border)',
                                borderRadius: 10,
                                padding: '12px 14px',
                            }}>
                                <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4, fontFamily: 'var(--font-display)', letterSpacing: '0.04em' }}>
                                    {label}
                                </div>
                                <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, fontSize: 14, color: 'var(--text-primary)' }}>
                                    {value}
                                    {unit && <span style={{ fontSize: 11, color: 'var(--text-muted)', marginLeft: 3 }}>{unit}</span>}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Top factors */}
                <div className="card" style={{ padding: '28px 32px', marginBottom: 20 }}>
                    <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 20 }}>
                        Top Contributing Factors
                    </h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        {shapValues.slice(0, 5).map(({ feature, importance }, i) => {
                            const pct = Math.min((importance / (shapValues[0]?.importance || 1)) * 100, 100);
                            return (
                                <div key={feature} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                                    <div style={{ width: 110, fontSize: 13, color: 'var(--text-secondary)', flexShrink: 0 }}>{feature}</div>
                                    <div style={{ flex: 1, height: 7, background: '#e2e8f0', borderRadius: 4, overflow: 'hidden' }}>
                                        <div style={{
                                            height: '100%', borderRadius: 4,
                                            width: revealed ? `${pct}%` : '0%',
                                            background: 'linear-gradient(to right, var(--aqua), var(--aqua-bright))',
                                            transition: `width 0.7s ease ${i * 0.1}s`,
                                        }} />
                                    </div>
                                    <div style={{ width: 42, textAlign: 'right', fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)' }}>
                                        {(importance * 100).toFixed(1)}%
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Model Insights */}
                <div className="card" style={{ padding: '28px 32px', marginBottom: 28, background: 'linear-gradient(to bottom right, #fff, #f8fafc)' }}>
                    <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 12 }}>
                        Model Insights
                    </h2>
                    <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 16 }}>
                        This prediction was generated using a <strong>Deep Artificial Neural Network (ANN)</strong> trained on over 3,000 water samples. The model evaluates complex non-linear relationships between chemical parameters to determine potability.
                    </p>
                    <div style={{ display: 'flex', gap: 20 }}>
                        <div style={{ flex: 1, background: '#fff', border: '1px solid var(--border)', borderRadius: 12, padding: '12px 16px' }}>
                            <div style={{ fontSize: 10, color: 'var(--text-muted)', marginBottom: 4, fontWeight: 700 }}>ARCHITECTURE</div>
                            <div style={{ fontSize: 13, color: 'var(--text-primary)', fontWeight: 600 }}>4-Layer Sequential MLP</div>
                        </div>
                        <div style={{ flex: 1, background: '#fff', border: '1px solid var(--border)', borderRadius: 12, padding: '12px 16px' }}>
                            <div style={{ fontSize: 10, color: 'var(--text-muted)', marginBottom: 4, fontWeight: 700 }}>ENGINE</div>
                            <div style={{ fontSize: 13, color: 'var(--text-primary)', fontWeight: 600 }}>Scikit-Learn / MLPClassifier</div>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}>
                    <Link href="/test" className="btn-outline" style={{ gap: 6 }}>
                        <FlaskConical size={15} /> Test Another Sample
                    </Link>
                    <Link href="/explainability" className="btn-primary" style={{ gap: 6 }}>
                        <BarChart2 size={15} /> View Full Explanation
                    </Link>
                </div>
            </div>
        </div>
    );
}