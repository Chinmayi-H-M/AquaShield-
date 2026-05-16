/** @jsxImportSource react */
'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { ArrowLeft, Info, FlaskConical } from 'lucide-react';
import { getLastResult, type PredictionResult } from '@/lib/prediction';

const WHO_LIMITS: Record<string, { min?: number; max: number; unit: string; note: string }> = {
    'pH': { min: 6.5, max: 8.5, unit: '', note: 'Optimal range for human consumption' },
    'Turbidity': { max: 4, unit: 'NTU', note: 'Higher values indicate suspended particles' },
    'Sulfate': { max: 400, unit: 'mg/L', note: 'Excess causes digestive issues' },
    'Chloramines': { max: 4, unit: 'ppm', note: 'Disinfectant; excess is carcinogenic' },
    'Trihalomethanes': { max: 80, unit: 'µg/L', note: 'Disinfection byproduct; carcinogenic at high levels' },
    'Solids': { max: 500, unit: 'ppm', note: 'Total dissolved solids; taste affected above limit' },
    'Hardness': { max: 300, unit: 'mg/L', note: 'Calcium and magnesium; scaling above limit' },
    'Conductivity': { max: 400, unit: 'µS/cm', note: 'Correlates with dissolved ions' },
    'Organic Carbon': { max: 10, unit: 'ppm', note: 'Precursor to disinfection byproducts' },
};

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="glass-bright" style={{ borderRadius: 10, padding: '10px 14px', fontSize: 12 }}>
                <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: 2 }}>{label}</div>
                <div style={{ color: 'var(--aqua-bright)' }}>SHAP: {(payload[0].value * 100).toFixed(2)}%</div>
            </div>
        );
    }
    return null;
};

export default function ExplainabilityPage() {
    const router = useRouter();
    const [result, setResult] = useState<PredictionResult | null>(null);
    const [selected, setSelected] = useState<string | null>(null);

    useEffect(() => {
        const r = getLastResult();
        if (!r) { router.push('/test'); return; }
        setResult(r);
        if (r.shapValues && r.shapValues.length > 0) {
            setSelected(r.shapValues[0].feature);
        }
    }, [router]);

    if (!result) return null;

    const { isSafe, riskScore, shapValues } = result;
    const statusColor = isSafe ? 'var(--safe)' : riskScore > 60 ? 'var(--unsafe)' : 'var(--warn)';
    const statusLabel = isSafe ? 'SAFE' : riskScore > 60 ? 'UNSAFE' : 'CAUTION';

    const chartData = shapValues.map(s => ({ name: s.feature, value: s.importance }));
    const selectedFeature = shapValues.find(s => s.feature === selected);
    const whoInfo = selected ? WHO_LIMITS[selected] : null;

    const explanations: Record<string, string> = {
        'Turbidity': `Turbidity of ${result.params.turbidity.toFixed(1)} NTU measures water cloudiness. WHO guideline is <4 NTU. High turbidity can indicate pathogenic microorganisms.`,
        'Sulfate': `Sulfate at ${result.params.sulfate} mg/L. Values above 400 mg/L can cause a laxative effect. This parameter had notable influence on the prediction.`,
        'Chloramines': `Chloramines level of ${result.params.chloramines.toFixed(1)} ppm. WHO guideline is <4 ppm. Chloramines are disinfectants but excessive levels can be harmful.`,
        'Trihalomethanes': `Trihalomethanes at ${result.params.trihalomethanes.toFixed(1)} µg/L. WHO limit is 80 µg/L. THMs are carcinogenic byproducts of water chlorination.`,
        'Solids': `Total Dissolved Solids: ${result.params.solids.toLocaleString()} ppm. High TDS affects taste and may indicate heavy contamination with dissolved minerals.`,
        'Hardness': `Hardness of ${result.params.hardness} mg/L. Hard water (>300 mg/L) is not directly harmful but indicates high mineral content.`,
        'Conductivity': `Conductivity of ${result.params.conductivity} µS/cm. High conductivity correlates with dissolved ions and can reflect industrial or agricultural contamination.`,
        'Organic Carbon': `Organic Carbon at ${result.params.organicCarbon.toFixed(1)} ppm. Elevated TOC can react with disinfectants to form harmful byproducts.`,
        'pH': `pH of ${result.params.ph.toFixed(1)}. Optimal drinking water range is 6.5–8.5. Outside this range, corrosion and taste issues can arise.`,
    };

    return (
        <div className="water-grid" style={{ minHeight: 'calc(100vh - 60px)', padding: '40px 24px 60px' }}>
            <div className="page-enter" style={{ maxWidth: 1000, margin: '0 auto' }}>

                {/* Back */}
                <Link
                    href="/prediction"
                    style={{
                        display: 'inline-flex', alignItems: 'center', gap: 6,
                        fontSize: 13, color: 'var(--text-muted)',
                        textDecoration: 'none', marginBottom: 28,
                    }}
                >
                    <ArrowLeft size={14} /> Back to Prediction
                </Link>

                {/* Page header */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
                    <div>
                        <div style={{
                            fontSize: 11, fontFamily: 'var(--font-display)', fontWeight: 700,
                            letterSpacing: '0.1em', color: 'var(--aqua)', marginBottom: 6,
                        }}>
                            MODEL EXPLAINABILITY
                        </div>
                        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.5px' }}>
                            Why This Prediction?
                        </h1>
                    </div>
                    <div className="card" style={{
                        padding: '14px 20px',
                        textAlign: 'right',
                        flexShrink: 0,
                    }}>
                        <div style={{ fontSize: 10, color: 'var(--text-muted)', marginBottom: 4, fontFamily: 'var(--font-display)', letterSpacing: '0.06em' }}>VERDICT</div>
                        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 20, color: statusColor }}>{statusLabel}</div>
                        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>Risk: {riskScore}%</div>
                    </div>
                </div>

                {/* Charts row */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>

                    {/* SHAP Chart */}
                    <div className="card" style={{ padding: '24px 28px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
                            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 700, color: 'var(--text-primary)' }}>
                                Feature Importance
                            </h2>
                            <div style={{ position: 'relative', display: 'inline-block' }}>
                                <Info size={13} style={{ color: 'var(--text-muted)', cursor: 'help' }} />
                            </div>
                        </div>
                        <ResponsiveContainer width="100%" height={260}>
                            <BarChart data={chartData} layout="vertical" margin={{ left: 100, right: 16, top: 0, bottom: 0 }}>
                                <XAxis
                                    type="number"
                                    tick={{ fill: 'var(--text-muted)', fontSize: 10 }}
                                    axisLine={false}
                                    tickLine={false}
                                    tickFormatter={(v: number) => `${(v * 100).toFixed(0)}%`}
                                />
                                <YAxis
                                    type="category"
                                    dataKey="name"
                                    tick={{ fill: 'var(--text-secondary)', fontSize: 12 }}
                                    axisLine={false}
                                    tickLine={false}
                                />
                                <Tooltip content={<CustomTooltip />} />
                                <Bar dataKey="value" radius={[0, 4, 4, 0]} onClick={(d: any) => setSelected(d.name ?? null)}>
                                    {chartData.map((entry: { name: string, value: number }) => (
                                        <Cell
                                            key={entry.name}
                                            fill={entry.name === selected ? 'var(--aqua-bright)' : 'var(--aqua)'}
                                            fillOpacity={entry.name === selected ? 1 : 0.55}
                                            cursor="pointer"
                                        />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                        <p style={{ fontSize: 11, color: 'var(--text-muted)', textAlign: 'center', marginTop: 8 }}>
                            Click a bar to view detailed explanation
                        </p>
                    </div>

                    {/* Feature Detail */}
                    <div className="card" style={{ padding: '24px 28px' }}>
                        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 20 }}>
                            Parameter Deep Dive
                        </h2>
                        {selected && selectedFeature ? (
                            <div>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                                    <span style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 700, color: 'var(--aqua-bright)' }}>
                                        {selected}
                                    </span>
                                    <span style={{
                                        background: 'var(--bg-primary)',
                                        border: '1px solid var(--border)',
                                        borderRadius: 999,
                                        padding: '3px 10px',
                                        fontSize: 11,
                                        fontFamily: 'var(--font-mono)',
                                        color: 'var(--text-secondary)',
                                    }}>
                                        {(selectedFeature.importance * 100).toFixed(2)}% weight
                                    </span>
                                </div>

                                <div style={{
                                    background: 'var(--bg-primary)',
                                    border: '1px solid var(--border)',
                                    borderRadius: 12,
                                    padding: '16px',
                                    marginBottom: 16,
                                }}>
                                    <div style={{ fontSize: 10, color: 'var(--text-muted)', marginBottom: 4, fontFamily: 'var(--font-display)', letterSpacing: '0.06em' }}>
                                        MEASURED VALUE
                                    </div>
                                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 24, fontWeight: 600, color: 'var(--text-primary)' }}>
                                        {typeof selectedFeature.value === 'number'
                                            ? selectedFeature.value > 100
                                                ? selectedFeature.value.toLocaleString()
                                                : selectedFeature.value.toFixed(1)
                                            : selectedFeature.value}
                                        <span style={{ fontSize: 12, color: 'var(--text-muted)', marginLeft: 4 }}>{whoInfo?.unit}</span>
                                    </div>
                                    {whoInfo && (
                                        <div style={{ fontSize: 11, marginTop: 6, color: statusColor, fontWeight: 500 }}>
                                            WHO limit: {whoInfo.min ? `${whoInfo.min} – ` : ''}{whoInfo.max} {whoInfo.unit}
                                        </div>
                                    )}
                                </div>

                                <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 14 }}>
                                    {explanations[selected]}
                                </p>

                                {whoInfo && (
                                    <div style={{
                                        background: 'var(--bg-primary)',
                                        border: '1px solid var(--border)',
                                        borderRadius: 10,
                                        padding: '10px 14px',
                                        fontSize: 12,
                                        color: 'var(--text-muted)',
                                        display: 'flex',
                                        alignItems: 'flex-start',
                                        gap: 6,
                                    }}>
                                        <Info size={12} style={{ marginTop: 1, flexShrink: 0 }} />
                                        {whoInfo.note}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div style={{ color: 'var(--text-muted)', fontSize: 13 }}>Select a feature from the chart.</div>
                        )}
                    </div>
                </div>

                {/* Summary */}
                <div className="card" style={{ padding: '28px 32px', marginBottom: 28 }}>
                    <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 16 }}>
                        Model Reasoning Summary
                    </h2>
                    <div style={{
                        background: 'var(--bg-primary)',
                        border: '1px solid var(--border)',
                        borderRadius: 12,
                        padding: '16px 20px',
                        fontSize: 13,
                        color: 'var(--text-secondary)',
                        lineHeight: 1.7,
                        marginBottom: 16,
                    }}>
                        The model classified this water sample as{' '}
                        <strong style={{ color: statusColor }}>{statusLabel}</strong>{' '}
                        with a risk score of{' '}
                        <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--aqua-bright)' }}>{riskScore}%</span>.
                        The main factors influencing this prediction are the current parameter values relative to WHO guidelines.
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                        {shapValues.map(({ feature, importance, value }: { feature: string, importance: number, value: number | string }) => {
                            const whoLimit = WHO_LIMITS[feature];
                            const numVal = typeof value === 'number' ? value : parseFloat(String(value));
                            const isOver = whoLimit && numVal > whoLimit.max;
                            const isUnder = whoLimit?.min && numVal < whoLimit.min;
                            const flag = isOver || isUnder;
                            return (
                                <div key={feature} style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 10,
                                    background: 'var(--bg-primary)',
                                    border: `1px solid ${flag ? 'rgba(239,68,68,0.2)' : 'var(--border)'}`,
                                    borderRadius: 10,
                                    padding: '10px 14px',
                                }}>
                                    <div style={{
                                        width: 7, height: 7,
                                        borderRadius: '50%',
                                        background: flag ? 'var(--unsafe)' : 'var(--safe)',
                                        flexShrink: 0,
                                    }} />
                                    <span style={{ fontSize: 13, color: 'var(--text-secondary)', flex: 1 }}>{feature}</span>
                                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)' }}>
                                        {(importance * 100).toFixed(1)}%
                                    </span>
                                    {flag && (
                                        <span style={{ fontSize: 10, color: 'var(--unsafe)', fontWeight: 600 }}>⚠ Over limit</span>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                    <p style={{ fontSize: 11, color: 'var(--text-muted)', textAlign: 'center', marginTop: 16 }}>
                        * Explanations generated using SHAP (SHapley Additive exPlanations) values
                    </p>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}>
                    <Link href="/test" className="btn-outline" style={{ gap: 6 }}>
                        <FlaskConical size={15} /> Test Another Sample
                    </Link>
                    <Link href="/dashboard" className="btn-primary" style={{ gap: 6 }}>
                        View Analytics Dashboard
                    </Link>
                </div>
            </div>
        </div>
    );
}