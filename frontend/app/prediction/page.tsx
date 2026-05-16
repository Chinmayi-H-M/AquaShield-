'use client';

import { useEffect, useState } from 'react';
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
                        PREDICTION RESULT
                    </div>

                    {/* Icon */}
                    <div style={{
                        width: 88, height: 88,
                        borderRadius: '50%',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        margin: '0 auto 20px',
                        background: `${statusColor}18`,
                        border: `3px solid ${statusColor}`,
                        transform: revealed ? 'scale(1)' : 'scale(0)',
                        transition: 'transform 0.6s cubic-bezier(0.34,1.56,0.64,1)',
                    }}>
                        <StatusIcon size={42} style={{ color: statusColor }} />
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
                            ? 'Your water quality is within acceptable parameters for human consumption.'
                            : riskScore > 60
                                ? 'This water sample exceeds safety thresholds and poses health risks.'
                                : 'Some parameters are borderline. Further testing is recommended.'}
                    </p>

                    {/* Confidence & Risk Score */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, maxWidth: 320, margin: '0 auto 28px' }}>
                        {[
                            { label: 'Confidence', value: `${confidence}%` },
                            { label: 'Risk Score', value: `${riskScore}%` },
                        ].map(item => (
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

                    {/* Risk bar */}
                    <div style={{ maxWidth: 420, margin: '0 auto' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--text-muted)', marginBottom: 6 }}>
                            <span>Risk Score</span>
                            <span style={{ color: statusColor }}>
                                {riskScore}% — {riskScore < 30 ? 'Low Risk' : riskScore < 60 ? 'Moderate Risk' : 'High Risk'}
                            </span>
                        </div>
                        <div style={{ height: 8, background: '#e2e8f0', borderRadius: 4, overflow: 'hidden' }}>
                            <div style={{
                                height: '100%', borderRadius: 4,
                                width: revealed ? `${riskScore}%` : '0%',
                                background: `linear-gradient(to right, var(--safe), ${riskScore > 60 ? 'var(--unsafe)' : riskScore > 40 ? 'var(--warn)' : 'var(--safe)'})`,
                                transition: 'width 1s cubic-bezier(0.4,0,0.2,1)',
                            }} />
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: '#9ca3af', marginTop: 4 }}>
                            <span>0% Safe</span><span>100% Unsafe</span>
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
                <div className="card" style={{ padding: '28px 32px', marginBottom: 28 }}>
                    <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 20 }}>
                        Top Contributing Factors
                    </h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        {shapValues.slice(0, 5).map(({ feature, importance }, i) => {
                            const pct = Math.min((importance / shapValues[0].importance) * 100, 100);
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