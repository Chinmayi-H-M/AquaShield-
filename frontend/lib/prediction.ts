// Simple in-memory store for passing data between pages
// In a real app, this would be a proper state manager or URL params

export interface WaterParams {
    ph: number;
    hardness: number;
    solids: number;
    chloramines: number;
    sulfate: number;
    conductivity: number;
    organicCarbon: number;
    trihalomethanes: number;
    turbidity: number;
}

export interface PredictionResult {
    isSafe: boolean;
    confidence: number;
    riskScore: number;
    params: WaterParams;
    shapValues: { feature: string; value: number; importance: number }[];
}

// Default safe sample
export const defaultParams: WaterParams = {
    ph: 7.2,
    hardness: 120,
    solids: 20000,
    chloramines: 4.0,
    sulfate: 250,
    conductivity: 400,
    organicCarbon: 10,
    trihalomethanes: 60,
    turbidity: 2.5,
};

// Simulate ANN prediction
export function runPrediction(params: WaterParams): PredictionResult {
    // WHO guidelines and scoring
    const scores = {
        ph: Math.abs(params.ph - 7.0) > 1.5 ? 0.3 : Math.abs(params.ph - 7.0) > 0.5 ? 0.1 : 0,
        hardness: params.hardness > 300 ? 0.15 : 0,
        solids: params.solids > 50000 ? 0.2 : params.solids > 30000 ? 0.1 : 0,
        chloramines: params.chloramines > 4 ? 0.2 : 0,
        sulfate: params.sulfate > 400 ? 0.15 : 0,
        conductivity: params.conductivity > 800 ? 0.1 : 0,
        organicCarbon: params.organicCarbon > 15 ? 0.15 : 0,
        trihalomethanes: params.trihalomethanes > 80 ? 0.25 : params.trihalomethanes > 60 ? 0.1 : 0,
        turbidity: params.turbidity > 4 ? 0.2 : params.turbidity > 2 ? 0.05 : 0,
    };

    const totalRisk = Object.values(scores).reduce((a, b) => a + b, 0);
    const riskScore = Math.min(Math.round(totalRisk * 100), 99);
    const isSafe = riskScore < 40;
    const confidence = isSafe ? 85 + Math.random() * 12 : 80 + Math.random() * 15;

    const shapValues = [
        { feature: 'Turbidity', value: params.turbidity, importance: scores.ph + 0.05 },
        { feature: 'Sulfate', value: params.sulfate, importance: scores.sulfate + 0.04 },
        { feature: 'Chloramines', value: params.chloramines, importance: scores.chloramines + 0.03 },
        { feature: 'Trihalomethanes', value: params.trihalomethanes, importance: scores.trihalomethanes + 0.03 },
        { feature: 'Solids', value: params.solids, importance: scores.solids + 0.025 },
        { feature: 'Hardness', value: params.hardness, importance: scores.hardness + 0.02 },
        { feature: 'Conductivity', value: params.conductivity, importance: scores.conductivity + 0.015 },
        { feature: 'Organic Carbon', value: params.organicCarbon, importance: scores.organicCarbon + 0.012 },
        { feature: 'pH', value: params.ph, importance: scores.ph + 0.008 },
    ].sort((a, b) => b.importance - a.importance);

    return { isSafe, confidence: Math.round(confidence), riskScore, params, shapValues };
}

// Global store (client-side only)
let _lastResult: PredictionResult | null = null;

export function setLastResult(r: PredictionResult) { _lastResult = r; }
export function getLastResult(): PredictionResult | null { return _lastResult; }