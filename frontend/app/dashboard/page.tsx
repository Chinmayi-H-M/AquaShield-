/** @jsxImportSource react */
'use client';

import React from 'react';
import {
    LineChart, Line, BarChart, Bar,
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, Legend,
} from 'recharts';

/* ── DATA ─────────────────────────────────────────────────────── */
const modelMetrics = [
    { metric: 'Accuracy', value: '92.4%', raw: 92.4 },
    { metric: 'Precision', value: '91.1%', raw: 91.1 },
    { metric: 'Recall', value: '93.7%', raw: 93.7 },
    { metric: 'F1 Score', value: '92.4%', raw: 92.4 },
    { metric: 'AUC-ROC', value: '0.967', raw: 96.7 },
];

const trainingHistory = [
    { epoch: 1, trainLoss: 0.68, valLoss: 0.71, trainAcc: 56, valAcc: 54 },
    { epoch: 5, trainLoss: 0.55, valLoss: 0.58, trainAcc: 72, valAcc: 69 },
    { epoch: 10, trainLoss: 0.42, valLoss: 0.46, trainAcc: 82, valAcc: 79 },
    { epoch: 20, trainLoss: 0.32, valLoss: 0.36, trainAcc: 87, valAcc: 84 },
    { epoch: 30, trainLoss: 0.24, valLoss: 0.28, trainAcc: 90, valAcc: 87 },
    { epoch: 40, trainLoss: 0.19, valLoss: 0.22, trainAcc: 92, valAcc: 90 },
    { epoch: 50, trainLoss: 0.16, valLoss: 0.19, trainAcc: 93.5, valAcc: 92.4 },
];

const rocData = [
    { fpr: 0, tpr: 0 }, { fpr: 0.02, tpr: 0.35 }, { fpr: 0.05, tpr: 0.65 },
    { fpr: 0.08, tpr: 0.80 }, { fpr: 0.12, tpr: 0.88 }, { fpr: 0.18, tpr: 0.93 },
    { fpr: 0.25, tpr: 0.96 }, { fpr: 0.35, tpr: 0.975 }, { fpr: 0.5, tpr: 0.985 },
    { fpr: 1.0, tpr: 1.0 },
];

const featureImportance = [
    { feature: 'Turbidity', importance: 0.48 },
    { feature: 'Sulfate', importance: 0.38 },
    { feature: 'Chloramines', importance: 0.32 },
    { feature: 'Trihalomethanes', importance: 0.28 },
    { feature: 'Solids', importance: 0.22 },
    { feature: 'Hardness', importance: 0.18 },
    { feature: 'Conductivity', importance: 0.15 },
    { feature: 'Organic Carbon', importance: 0.12 },
    { feature: 'pH', importance: 0.09 },
];

const sampleHistory = [
    { month: 'Jan', safe: 82, unsafe: 45 },
    { month: 'Feb', safe: 95, unsafe: 38 },
    { month: 'Mar', safe: 76, unsafe: 52 },
    { month: 'Apr', safe: 110, unsafe: 41 },
    { month: 'May', safe: 98, unsafe: 35 },
    { month: 'Jun', safe: 125, unsafe: 48 },
    { month: 'Jul', safe: 88, unsafe: 55 },
    { month: 'Aug', safe: 103, unsafe: 42 },
];

/* ── DESIGN TOKENS (mirrors globals.css) ───────────────────────── */
const C = {
    aqua: '#0ea5e9',
    aquaBright: '#38bdf8',
    safe: '#10b981',
    unsafe: '#ef4444',
    warn: '#f59e0b',
    purple: '#a78bfa',
    textPrimary: '#0f172a',
    textSecondary: '#334155',
    textMuted: '#64748b',
    bgPrimary: '#f7fafc',
    border: 'rgba(15,23,42,0.08)',
    borderBright: 'rgba(14,165,233,0.35)',
};

/* shared style helpers */
const glassCard = {
    background: 'rgba(255,255,255,0.82)',
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    border: `1px solid ${C.border}`,
    borderRadius: 20,
    padding: 24,
};

const sectionTitle = {
    fontFamily: "'Syne', sans-serif",
    fontSize: 17,
    fontWeight: 700,
    color: C.textPrimary,
    marginBottom: 20,
};

/* ── TOOLTIP ────────────────────────────────────────────────────── */
const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;
    return (
        <div style={{
            background: 'rgba(255,255,255,0.96)', border: `1px solid ${C.borderBright}`,
            borderRadius: 10, padding: '8px 12px', fontSize: 12,
            boxShadow: '0 4px 20px rgba(14,165,233,0.15)',
        }}>
            <div style={{ fontWeight: 700, color: C.textPrimary, marginBottom: 4 }}>{label}</div>
            {payload.map((p: any) => (
                <div key={p.dataKey} style={{ color: p.color }}>
                    {p.name || p.dataKey}: {typeof p.value === 'number' && p.value < 2 ? p.value.toFixed(3) : p.value}
                </div>
            ))}
        </div>
    );
};

/* ── PAGE ───────────────────────────────────────────────────────── */
export default function DashboardPage() {
    const total = 1250, safe = 732, unsafe = 518;

    return (
        <div style={{
            minHeight: '100vh',
            background: `
                linear-gradient(rgba(14,165,233,0.05) 1px, transparent 1px),
                linear-gradient(90deg, rgba(14,165,233,0.05) 1px, transparent 1px),
                #f7fafc`,
            backgroundSize: '60px 60px, 60px 60px, auto',
            paddingTop: 40,
            paddingBottom: 64,
            paddingLeft: 24,
            paddingRight: 24,
        }}>
            <div style={{ maxWidth: 1200, margin: '0 auto' }}>

                {/* ── HEADER ── */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 36 }}>
                    <div>
                        <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 500, color: C.aqua, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 6 }}>
                            Analytics Dashboard
                        </p>
                        <h1 style={{ fontFamily: "'Syne', sans-serif", fontSize: 36, fontWeight: 800, color: C.textPrimary, lineHeight: 1.1 }}>
                            Model Performance
                        </h1>
                    </div>
                    <div style={{
                        ...glassCard, padding: '8px 18px', borderRadius: 12,
                        display: 'flex', alignItems: 'center', gap: 8,
                        fontSize: 13, color: C.textSecondary,
                    }}>
                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: C.safe, boxShadow: `0 0 8px ${C.safe}` }} />
                        Live · Updated hourly
                    </div>
                </div>

                {/* ── TOP STAT CARDS ── */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 20, marginBottom: 28 }}>
                    {[
                        { label: 'Total Samples', value: total.toLocaleString(), color: C.aqua, sub: 'Water samples tested' },
                        { label: 'Safe Samples', value: safe.toLocaleString(), color: C.safe, sub: `${Math.round((safe / total) * 100)}% of total` },
                        { label: 'Unsafe Samples', value: unsafe.toLocaleString(), color: C.unsafe, sub: `${Math.round((unsafe / total) * 100)}% of total` },
                        { label: 'Model Accuracy', value: '92.4%', color: C.aquaBright, sub: 'On test set' },
                    ].map((s) => (
                        <div key={s.label} style={{
                            ...glassCard, padding: 22,
                            transition: 'transform 0.2s, box-shadow 0.2s',
                        }}
                            onMouseEnter={e => {
                                (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)';
                                (e.currentTarget as HTMLElement).style.boxShadow = '0 10px 30px rgba(14,165,233,0.15)';
                            }}
                            onMouseLeave={e => {
                                (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                                (e.currentTarget as HTMLElement).style.boxShadow = 'none';
                            }}
                        >
                            <div style={{ fontSize: 10, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>
                                {s.label}
                            </div>
                            <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 30, fontWeight: 800, color: s.color, marginBottom: 4 }}>
                                {s.value}
                            </div>
                            <div style={{ fontSize: 12, color: C.textMuted }}>{s.sub}</div>
                        </div>
                    ))}
                </div>

                {/* ── CLASSIFICATION METRICS ── */}
                <div style={{ ...glassCard, marginBottom: 28 }}>
                    <div style={sectionTitle}>Classification Metrics</div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 16 }}>
                        {modelMetrics.map((m) => (
                            <div key={m.metric} style={{
                                background: 'rgba(14,165,233,0.04)', border: `1px solid ${C.border}`,
                                borderRadius: 14, padding: '16px 12px', textAlign: 'center',
                            }}>
                                <div style={{ fontSize: 10, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>
                                    {m.metric}
                                </div>
                                <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 22, fontWeight: 800, color: C.aquaBright, marginBottom: 10 }}>
                                    {m.value}
                                </div>
                                {/* progress bar */}
                                <div style={{ height: 5, background: 'rgba(14,165,233,0.12)', borderRadius: 3, overflow: 'hidden' }}>
                                    <div style={{
                                        height: '100%', width: `${m.raw}%`,
                                        background: `linear-gradient(90deg, ${C.aqua}, ${C.safe})`,
                                        borderRadius: 3,
                                    }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── CONFUSION MATRIX + QUICK STATS ── */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 28 }}>

                    {/* Confusion Matrix */}
                    <div style={glassCard}>
                        <div style={sectionTitle}>Confusion Matrix</div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                            {[
                                { label: 'True Positive', value: 710, color: C.safe, bg: 'rgba(16,185,129,0.08)' },
                                { label: 'False Positive', value: 22, color: C.unsafe, bg: 'rgba(239,68,68,0.08)' },
                                { label: 'False Negative', value: 35, color: C.warn, bg: 'rgba(245,158,11,0.08)' },
                                { label: 'True Negative', value: 483, color: C.aqua, bg: 'rgba(14,165,233,0.08)' },
                            ].map(cell => (
                                <div key={cell.label} style={{
                                    background: cell.bg, border: `1px solid ${cell.color}30`,
                                    borderRadius: 12, padding: '16px', textAlign: 'center',
                                }}>
                                    <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 28, fontWeight: 800, color: cell.color }}>
                                        {cell.value}
                                    </div>
                                    <div style={{ fontSize: 11, color: C.textMuted, marginTop: 4 }}>{cell.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Safe vs Unsafe donut-style */}
                    <div style={glassCard}>
                        <div style={sectionTitle}>Sample Distribution</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, justifyContent: 'center', height: '80%' }}>
                            {[
                                { label: 'Safe Water', value: safe, pct: Math.round((safe / total) * 100), color: C.safe },
                                { label: 'Unsafe Water', value: unsafe, pct: Math.round((unsafe / total) * 100), color: C.unsafe },
                            ].map(row => (
                                <div key={row.label}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                                        <span style={{ fontSize: 13, color: C.textSecondary, fontWeight: 500 }}>{row.label}</span>
                                        <span style={{ fontSize: 13, fontWeight: 700, color: row.color }}>{row.value.toLocaleString()} ({row.pct}%)</span>
                                    </div>
                                    <div style={{ height: 10, background: 'rgba(0,0,0,0.05)', borderRadius: 5, overflow: 'hidden' }}>
                                        <div style={{ height: '100%', width: `${row.pct}%`, background: row.color, borderRadius: 5, transition: 'width 1s ease' }} />
                                    </div>
                                </div>
                            ))}
                            <div style={{ marginTop: 8, padding: '12px 16px', background: 'rgba(14,165,233,0.06)', borderRadius: 10, fontSize: 13, color: C.textSecondary }}>
                                Total <strong style={{ color: C.aqua }}>{total.toLocaleString()}</strong> water samples tested across <strong style={{ color: C.aqua }}>8 months</strong>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── CHARTS ROW 1: Training History + ROC ── */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 28 }}>

                    <div style={glassCard}>
                        <div style={sectionTitle}>Training History</div>
                        <ResponsiveContainer width="100%" height={240}>
                            <LineChart data={trainingHistory} margin={{ top: 4, right: 8, bottom: 4, left: -10 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(14,165,233,0.1)" />
                                <XAxis dataKey="epoch" tick={{ fontSize: 11, fill: C.textMuted }} />
                                <YAxis tick={{ fontSize: 11, fill: C.textMuted }} />
                                <Tooltip content={<CustomTooltip />} />
                                <Legend wrapperStyle={{ fontSize: 11 }} />
                                <Line type="monotone" dataKey="trainAcc" name="Train Acc" stroke={C.aqua} strokeWidth={2} dot={false} />
                                <Line type="monotone" dataKey="valAcc" name="Val Acc" stroke={C.safe} strokeWidth={2} dot={false} />
                                <Line type="monotone" dataKey="trainLoss" name="Train Loss" stroke={C.purple} strokeWidth={2} dot={false} strokeDasharray="4 2" />
                                <Line type="monotone" dataKey="valLoss" name="Val Loss" stroke={C.warn} strokeWidth={2} dot={false} strokeDasharray="4 2" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>

                    <div style={glassCard}>
                        <div style={sectionTitle}>ROC Curve <span style={{ fontSize: 12, color: C.textMuted, fontWeight: 400 }}>AUC = 0.967</span></div>
                        <ResponsiveContainer width="100%" height={240}>
                            <AreaChart data={rocData} margin={{ top: 4, right: 8, bottom: 4, left: -10 }}>
                                <defs>
                                    <linearGradient id="rocGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor={C.aqua} stopOpacity={0.3} />
                                        <stop offset="95%" stopColor={C.aqua} stopOpacity={0.02} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(14,165,233,0.1)" />
                                <XAxis dataKey="fpr" tick={{ fontSize: 11, fill: C.textMuted }} label={{ value: 'FPR', position: 'insideBottom', offset: -2, fontSize: 11, fill: C.textMuted }} />
                                <YAxis tick={{ fontSize: 11, fill: C.textMuted }} label={{ value: 'TPR', angle: -90, position: 'insideLeft', fontSize: 11, fill: C.textMuted }} />
                                <Tooltip content={<CustomTooltip />} />
                                <Area type="monotone" dataKey="tpr" stroke={C.aqua} strokeWidth={2.5} fill="url(#rocGrad)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* ── CHARTS ROW 2: Feature Importance + Monthly Samples ── */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>

                    <div style={glassCard}>
                        <div style={sectionTitle}>Feature Importance</div>
                        <ResponsiveContainer width="100%" height={280}>
                            <BarChart data={featureImportance} layout="vertical" margin={{ top: 4, right: 16, bottom: 4, left: 8 }}>
                                <defs>
                                    <linearGradient id="barGrad" x1="0" y1="0" x2="1" y2="0">
                                        <stop offset="0%" stopColor={C.aqua} />
                                        <stop offset="100%" stopColor={C.safe} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(14,165,233,0.1)" horizontal={false} />
                                <XAxis type="number" tick={{ fontSize: 11, fill: C.textMuted }} />
                                <YAxis type="category" dataKey="feature" tick={{ fontSize: 11, fill: C.textMuted }} width={100} />
                                <Tooltip content={<CustomTooltip />} />
                                <Bar dataKey="importance" fill="url(#barGrad)" radius={[0, 4, 4, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    <div style={glassCard}>
                        <div style={sectionTitle}>Monthly Samples</div>
                        <ResponsiveContainer width="100%" height={280}>
                            <BarChart data={sampleHistory} margin={{ top: 4, right: 8, bottom: 4, left: -10 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(14,165,233,0.1)" />
                                <XAxis dataKey="month" tick={{ fontSize: 11, fill: C.textMuted }} />
                                <YAxis tick={{ fontSize: 11, fill: C.textMuted }} />
                                <Tooltip content={<CustomTooltip />} />
                                <Legend wrapperStyle={{ fontSize: 11 }} />
                                <Bar dataKey="safe" name="Safe" fill={C.safe} radius={[4, 4, 0, 0]} />
                                <Bar dataKey="unsafe" name="Unsafe" fill={C.unsafe} radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                </div>
            </div>
        </div>
    );
}