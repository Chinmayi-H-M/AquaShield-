'use client';

import {
    LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, Legend, ScatterChart, Scatter
} from 'recharts';

const modelMetrics = [
    { metric: 'Accuracy', value: '92.4%', raw: 92.4 },
    { metric: 'Precision', value: '91.1%', raw: 91.1 },
    { metric: 'Recall', value: '93.7%', raw: 93.7 },
    { metric: 'F1 Score', value: '92.4%', raw: 92.4 },
    { metric: 'AUC-ROC', value: '0.967', raw: 96.7 },
];

const confusionMatrix = {
    tp: 710, fp: 22, fn: 35, tn: 483,
};

const rocData = [
    { fpr: 0, tpr: 0 },
    { fpr: 0.02, tpr: 0.35 },
    { fpr: 0.05, tpr: 0.65 },
    { fpr: 0.08, tpr: 0.80 },
    { fpr: 0.12, tpr: 0.88 },
    { fpr: 0.18, tpr: 0.93 },
    { fpr: 0.25, tpr: 0.96 },
    { fpr: 0.35, tpr: 0.975 },
    { fpr: 0.5, tpr: 0.985 },
    { fpr: 1.0, tpr: 1.0 },
];

const paramDistribution = [
    { ph: 6.5, count: 45 }, { ph: 6.8, count: 78 }, { ph: 7.0, count: 132 },
    { ph: 7.2, count: 167 }, { ph: 7.4, count: 145 }, { ph: 7.6, count: 98 },
    { ph: 7.8, count: 62 }, { ph: 8.0, count: 34 }, { ph: 8.2, count: 18 },
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

const customTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="glass-bright rounded-xl p-3 text-xs">
                <div className="font-600 text-[var(--text-primary)] mb-1">{label}</div>
                {payload.map((p: any) => (
                    <div key={p.dataKey} style={{ color: p.color }}>{p.name || p.dataKey}: {typeof p.value === 'number' && p.value < 2 ? p.value.toFixed(3) : p.value}</div>
                ))}
            </div>
        );
    }
    return null;
};

export default function DashboardPage() {
    const total = 1250;
    const safe = 732;
    const unsafe = 518;

    return (
        <div className="min-h-screen water-grid pt-24 pb-16 px-6">
            {/* IMPORTANT: extra wrapper to align everything under fixed navbar */}
            <div className="max-w-7xl mx-auto page-enter space-y-10">

                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-[var(--aqua)] text-sm font-mono uppercase tracking-widest mb-2">
                            Analytics Dashboard
                        </p>
                        <h1 className="font-display text-4xl font-700 text-[var(--text-primary)]">
                            Model Performance
                        </h1>
                    </div>

                    <div className="glass rounded-xl px-4 py-2 flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                        <div className="w-2 h-2 rounded-full bg-[var(--safe)] animate-pulse" />
                        Live · Updated hourly
                    </div>
                </div>

                {/* Top stats */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                        { label: 'Total Samples', value: total.toLocaleString(), color: 'var(--aqua)', sub: 'Water samples tested' },
                        { label: 'Safe Samples', value: safe.toLocaleString(), color: 'var(--safe)', sub: `${Math.round((safe / total) * 100)}% of total` },
                        { label: 'Unsafe Samples', value: unsafe.toLocaleString(), color: 'var(--unsafe)', sub: `${Math.round((unsafe / total) * 100)}% of total` },
                        { label: 'Model Accuracy', value: '92.4%', color: 'var(--aqua-bright)', sub: 'On test set' },
                    ].map((s) => (
                        <div key={s.label} className="glass rounded-2xl p-5 metric-card">
                            <div className="text-xs text-[var(--text-muted)] uppercase tracking-widest mb-2">
                                {s.label}
                            </div>
                            <div
                                className="font-display text-3xl font-700 mb-1"
                                style={{ color: s.color }}
                            >
                                {s.value}
                            </div>
                            <div className="text-xs text-[var(--text-muted)]">{s.sub}</div>
                        </div>
                    ))}
                </div>

                {/* Model metrics */}
                <div className="glass rounded-2xl p-6">
                    <h2 className="font-display text-lg font-600 mb-5">
                        Classification Metrics
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
                        {modelMetrics.map((m) => (
                            <div key={m.metric} className="glass rounded-xl p-4 text-center">
                                <div className="text-xs text-[var(--text-muted)] mb-2 uppercase tracking-widest">
                                    {m.metric}
                                </div>
                                <div className="font-display text-2xl font-700 text-[var(--aqua-bright)]">
                                    {m.value}
                                </div>
                                <div className="mt-2 h-1.5 bg-[var(--bg-card)] rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-[var(--aqua)] to-[var(--safe)] rounded-full"
                                        style={{ width: `${m.raw}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* CHARTS ROW 1 */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="glass rounded-2xl p-6">
                        <h2 className="font-display text-lg font-600 mb-5">
                            Training History
                        </h2>
                        <ResponsiveContainer width="100%" height={240}>
                            <LineChart data={trainingHistory}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="epoch" />
                                <YAxis />
                                <Tooltip content={customTooltip} />
                                <Legend />
                                <Line dataKey="trainAcc" stroke="var(--aqua)" />
                                <Line dataKey="valAcc" stroke="var(--safe)" />
                                <Line dataKey="trainLoss" stroke="#a78bfa" />
                                <Line dataKey="valLoss" stroke="var(--warn)" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="glass rounded-2xl p-6">
                        <h2 className="font-display text-lg font-600 mb-5">ROC Curve</h2>
                        <ResponsiveContainer width="100%" height={240}>
                            <AreaChart data={rocData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="fpr" />
                                <YAxis />
                                <Tooltip content={customTooltip} />
                                <Area dataKey="tpr" stroke="var(--aqua)" fill="var(--aqua)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* keep rest unchanged but IMPORTANT spacing fix */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Feature importance */}
                    <div className="glass rounded-2xl p-6">
                        <h2 className="font-display text-lg font-600 mb-5">
                            Feature Importance
                        </h2>
                        <ResponsiveContainer width="100%" height={260}>
                            <BarChart data={featureImportance} layout="vertical">
                                <XAxis type="number" />
                                <YAxis type="category" dataKey="feature" />
                                <Tooltip content={customTooltip} />
                                <Bar dataKey="importance" fill="var(--aqua)" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="glass rounded-2xl p-6">
                        <h2 className="font-display text-lg font-600 mb-5">
                            Monthly Samples
                        </h2>
                        <ResponsiveContainer width="100%" height={260}>
                            <BarChart data={sampleHistory}>
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip content={customTooltip} />
                                <Bar dataKey="safe" fill="var(--safe)" />
                                <Bar dataKey="unsafe" fill="var(--unsafe)" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

            </div>
        </div>
    );
}