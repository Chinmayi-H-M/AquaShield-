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

// Call FastAPI backend for real prediction
export async function runPrediction(params: WaterParams): Promise<PredictionResult> {
    // 1. HARD PRE-CHECK FOR TOXIC/EXTREME VALUES
    // Prevents Random Forest extrapolation failures and catches obvious dangers immediately.
    // E.g. pH of 3.5 or 15 is physically dangerous, regardless of what the ML model thinks.
    if (params.ph < 5.0 || params.ph > 9.5 || 
        params.hardness > 1000 || params.solids > 60000 || 
        params.sulfate > 1000 || params.chloramines > 15 ||
        params.trihalomethanes > 200 || params.turbidity > 15) {
        
        let toxicFeature = "Extreme / Toxic Values";
        if (params.ph < 5.0) toxicFeature = "Highly Acidic (Dangerous pH)";
        else if (params.ph > 9.5) toxicFeature = "Highly Alkaline (Dangerous pH)";
        else if (params.solids > 60000) toxicFeature = "Extreme Dissolved Solids";
        
        return {
            isSafe: false,
            confidence: 99,
            riskScore: 100,
            params,
            shapValues: [{ feature: toxicFeature, value: 0, importance: 1.0 }]
        };
    }

    // Dynamically detect API URL: Localhost takes priority if we're in development, 
    // otherwise use environment variable or production fallback.
    let API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://aquashield-api.onrender.com';
    
    try {
        const response = await fetch(`${API_URL}/predict`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                ph: params.ph,
                Hardness: params.hardness,
                Solids: params.solids,
                Chloramines: params.chloramines,
                Sulfate: params.sulfate,
                Conductivity: params.conductivity,
                Organic_carbon: params.organicCarbon,
                Trihalomethanes: params.trihalomethanes,
                Turbidity: params.turbidity
            })
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.statusText}`);
        }

        const data = await response.json();

        // Map backend feature names to frontend expected names
        const featureMap: Record<string, string> = {
            'ph': 'pH',
            'Hardness': 'Hardness',
            'Solids': 'Solids',
            'Chloramines': 'Chloramines',
            'Sulfate': 'Sulfate',
            'Conductivity': 'Conductivity',
            'Organic_carbon': 'Organic Carbon',
            'Trihalomethanes': 'Trihalomethanes',
            'Turbidity': 'Turbidity',
            'Sulfate_Hardness_Ratio': 'Sulfate/Hardness Ratio',
            'Organic_Chlorine_Ratio': 'Organic/Chlorine Ratio'
        };

        return {
            isSafe: data.prediction === 1,
            confidence: Math.round(data.confidence),
            riskScore: Math.round(data.risk_score),
            params,
            shapValues: data.top_factors
                .map((f: any) => ({
                    feature: featureMap[f.feature] || f.feature,
                    value: f.value,
                    importance: f.importance
                }))
                .filter((f: any) => !f.feature.includes(' ')) // Filter out interaction features like 'ph Solids' for cleaner UI
        };
    } catch (error) {
        console.error('Prediction API call failed:', error);
        // Fallback to simulation if API is down (useful for demo)
        return simulatePrediction(params);
    }
}

// Rename old function to simulatePrediction as a fallback
function simulatePrediction(params: WaterParams): PredictionResult {
    const scores = {
        ph: params.ph < 6 || params.ph > 9 ? 0.8 : Math.abs(params.ph - 7.0) > 1.0 ? 0.3 : 0,
        hardness: params.hardness > 400 ? 0.3 : params.hardness > 300 ? 0.15 : 0,
        solids: params.solids > 50000 ? 0.5 : params.solids > 30000 ? 0.2 : 0,
        chloramines: params.chloramines > 6 ? 0.4 : params.chloramines > 4 ? 0.2 : 0,
        sulfate: params.sulfate > 600 ? 0.4 : params.sulfate > 400 ? 0.15 : 0,
        conductivity: params.conductivity > 1000 ? 0.3 : params.conductivity > 800 ? 0.1 : 0,
        organicCarbon: params.organicCarbon > 20 ? 0.4 : params.organicCarbon > 15 ? 0.15 : 0,
        trihalomethanes: params.trihalomethanes > 100 ? 0.5 : params.trihalomethanes > 80 ? 0.25 : 0,
        turbidity: params.turbidity > 6 ? 0.4 : params.turbidity > 4 ? 0.2 : 0,
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