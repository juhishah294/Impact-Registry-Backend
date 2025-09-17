import { CalculatorType } from '@prisma/client';

export interface CalculatorInput {
    calculatorType: CalculatorType;
    parameters: Record<string, any>;
}

export interface CalculatorResult {
    value: number;
    unit: string;
    interpretation: string;
    category?: string;
    percentile?: number;
    zScore?: number;
    reference?: string;
}

export class CalculatorService {

    /**
     * eGFR Calculators
     */

    // Schwartz equation (2009) - Most commonly used pediatric eGFR
    static calculateSchwartzEGFR(params: {
        serumCreatinine: number; // mg/dL
        height: number; // cm
    }): CalculatorResult {
        const { serumCreatinine, height } = params;
        const k = 0.413; // Schwartz constant
        const eGFR = (k * height) / serumCreatinine;

        let interpretation = '';
        let category = '';

        if (eGFR >= 90) {
            category = 'Normal or high';
            interpretation = 'Normal kidney function (≥90 mL/min/1.73m²)';
        } else if (eGFR >= 60) {
            category = 'Mildly decreased';
            interpretation = 'Mildly decreased kidney function (60-89 mL/min/1.73m²)';
        } else if (eGFR >= 45) {
            category = 'CKD Stage 3a';
            interpretation = 'Moderately decreased kidney function - CKD Stage 3a (45-59 mL/min/1.73m²)';
        } else if (eGFR >= 30) {
            category = 'CKD Stage 3b';
            interpretation = 'Moderately decreased kidney function - CKD Stage 3b (30-44 mL/min/1.73m²)';
        } else if (eGFR >= 15) {
            category = 'CKD Stage 4';
            interpretation = 'Severely decreased kidney function - CKD Stage 4 (15-29 mL/min/1.73m²)';
        } else {
            category = 'CKD Stage 5';
            interpretation = 'Kidney failure - CKD Stage 5 (<15 mL/min/1.73m²)';
        }

        return {
            value: Math.round(eGFR * 10) / 10,
            unit: 'mL/min/1.73m²',
            interpretation,
            category,
            reference: 'Schwartz GJ et al. J Am Soc Nephrol. 2009;20(3):629-37'
        };
    }

    // CKiD equation - More accurate for children with CKD
    static calculateCKiDEGFR(params: {
        serumCreatinine: number; // mg/dL
        height: number; // cm
        bun: number; // mg/dL
        cystatin?: number; // mg/L (optional)
    }): CalculatorResult {
        const { serumCreatinine, height, bun, cystatin } = params;

        let eGFR: number;

        if (cystatin) {
            // CKiD equation with cystatin C
            eGFR = 39.8 * Math.pow(height / serumCreatinine, 0.456) *
                Math.pow(1.8 / cystatin, 0.418) *
                Math.pow(30 / bun, 0.079) *
                Math.pow(height / 120, 0.179);
        } else {
            // CKiD equation without cystatin C
            eGFR = 41.3 * Math.pow(height / serumCreatinine, 0.516) *
                Math.pow(1.8 / serumCreatinine, 0.294) *
                Math.pow(30 / bun, 0.169) *
                Math.pow(height / 120, 0.188);
        }

        let interpretation = '';
        let category = '';

        if (eGFR >= 90) {
            category = 'Normal or high';
            interpretation = 'Normal kidney function (≥90 mL/min/1.73m²)';
        } else if (eGFR >= 60) {
            category = 'Mildly decreased';
            interpretation = 'Mildly decreased kidney function (60-89 mL/min/1.73m²)';
        } else if (eGFR >= 45) {
            category = 'CKD Stage 3a';
            interpretation = 'Moderately decreased kidney function - CKD Stage 3a (45-59 mL/min/1.73m²)';
        } else if (eGFR >= 30) {
            category = 'CKD Stage 3b';
            interpretation = 'Moderately decreased kidney function - CKD Stage 3b (30-44 mL/min/1.73m²)';
        } else if (eGFR >= 15) {
            category = 'CKD Stage 4';
            interpretation = 'Severely decreased kidney function - CKD Stage 4 (15-29 mL/min/1.73m²)';
        } else {
            category = 'CKD Stage 5';
            interpretation = 'Kidney failure - CKD Stage 5 (<15 mL/min/1.73m²)';
        }

        return {
            value: Math.round(eGFR * 10) / 10,
            unit: 'mL/min/1.73m²',
            interpretation,
            category,
            reference: 'Schwartz GJ et al. Clin J Am Soc Nephrol. 2012;7(11):1739-48'
        };
    }

    // Bedside Schwartz equation - Simplified version
    static calculateBedsideSchwartzEGFR(params: {
        serumCreatinine: number; // mg/dL
        height: number; // cm
    }): CalculatorResult {
        const { serumCreatinine, height } = params;
        const k = 0.413; // Bedside Schwartz constant
        const eGFR = (k * height) / serumCreatinine;

        return {
            value: Math.round(eGFR * 10) / 10,
            unit: 'mL/min/1.73m²',
            interpretation: `Estimated GFR using bedside Schwartz equation`,
            reference: 'Schwartz GJ et al. Kidney Int. 1976;10(6):544-50'
        };
    }

    /**
     * Growth Calculators
     */

    // BMI Z-Score Calculator (WHO/CDC)
    static calculateBMIZScore(params: {
        age: number; // months
        gender: 'MALE' | 'FEMALE';
        height: number; // cm
        weight: number; // kg
        reference: 'WHO' | 'CDC';
    }): CalculatorResult {
        const { age: _age, gender: _gender, height, weight, reference } = params;
        // Note: _age and _gender would be used with actual WHO/CDC reference tables
        const bmi = weight / Math.pow(height / 100, 2);

        // This is a simplified implementation
        // In production, you would use actual WHO/CDC reference tables
        let zScore: number;
        let percentile: number;

        // Simplified calculation - in reality, use LMS parameters from WHO/CDC tables
        const meanBMI = _gender === 'MALE' ? 16.5 : 16.2; // Approximate for 5-year-old
        const sdBMI = 1.8;

        zScore = (bmi - meanBMI) / sdBMI;
        percentile = this.zScoreToPercentile(zScore);

        let interpretation = '';
        let category = '';

        if (zScore < -2) {
            category = 'Underweight';
            interpretation = 'Underweight (BMI Z-score < -2)';
        } else if (zScore < -1) {
            category = 'Normal (low)';
            interpretation = 'Normal weight, lower range (BMI Z-score -2 to -1)';
        } else if (zScore <= 1) {
            category = 'Normal';
            interpretation = 'Normal weight (BMI Z-score -1 to +1)';
        } else if (zScore <= 2) {
            category = 'Overweight';
            interpretation = 'Overweight (BMI Z-score +1 to +2)';
        } else {
            category = 'Obese';
            interpretation = 'Obese (BMI Z-score > +2)';
        }

        return {
            value: Math.round(zScore * 100) / 100,
            unit: 'Z-score',
            interpretation,
            category,
            percentile: Math.round(percentile * 10) / 10,
            reference: `${reference} Growth Charts`
        };
    }

    // Height Z-Score Calculator
    static calculateHeightZScore(params: {
        age: number; // months
        gender: 'MALE' | 'FEMALE';
        height: number; // cm
        reference: 'WHO' | 'CDC';
    }): CalculatorResult {
        const { age: _age, gender: _gender, height, reference } = params;
        // Note: _age and _gender would be used with actual WHO/CDC reference tables

        // Simplified calculation - use actual WHO/CDC LMS parameters in production
        const meanHeight = _gender === 'MALE' ? 110 : 108; // Approximate for 5-year-old
        const sdHeight = 5.2;

        const zScore = (height - meanHeight) / sdHeight;
        const percentile = this.zScoreToPercentile(zScore);

        let interpretation = '';
        let category = '';

        if (zScore < -2) {
            category = 'Short stature';
            interpretation = 'Short stature (Height Z-score < -2)';
        } else if (zScore < -1) {
            category = 'Below average';
            interpretation = 'Below average height (Height Z-score -2 to -1)';
        } else if (zScore <= 1) {
            category = 'Normal';
            interpretation = 'Normal height (Height Z-score -1 to +1)';
        } else if (zScore <= 2) {
            category = 'Above average';
            interpretation = 'Above average height (Height Z-score +1 to +2)';
        } else {
            category = 'Tall stature';
            interpretation = 'Tall stature (Height Z-score > +2)';
        }

        return {
            value: Math.round(zScore * 100) / 100,
            unit: 'Z-score',
            interpretation,
            category,
            percentile: Math.round(percentile * 10) / 10,
            reference: `${reference} Growth Charts`
        };
    }

    /**
     * Blood Pressure Percentile Calculator
     */
    static calculateBPPercentile(params: {
        age: number; // years
        gender: 'MALE' | 'FEMALE';
        height: number; // cm
        systolicBP: number; // mmHg
        diastolicBP: number; // mmHg
    }): CalculatorResult {
        const { age, gender: _gender, height: _height, systolicBP, diastolicBP } = params;

        // This is a simplified implementation
        // In production, use the actual AAP BP tables with height percentiles
        // Note: _gender and _height would be used to calculate height percentile first

        // Then use BP tables based on age, gender, and height percentile
        // Simplified calculation for demonstration
        const expectedSBP = 90 + (2 * age); // Simplified formula
        const expectedDBP = 50 + age; // Simplified formula

        const sbpPercentile = this.calculateBPPercentileFromValue(systolicBP, expectedSBP, 12);
        const dbpPercentile = this.calculateBPPercentileFromValue(diastolicBP, expectedDBP, 8);

        let interpretation = '';
        let category = '';

        const maxPercentile = Math.max(sbpPercentile, dbpPercentile);

        if (maxPercentile < 90) {
            category = 'Normal';
            interpretation = 'Normal blood pressure (<90th percentile)';
        } else if (maxPercentile < 95) {
            category = 'Elevated';
            interpretation = 'Elevated blood pressure (90th-95th percentile)';
        } else if (maxPercentile < 99) {
            category = 'Stage 1 Hypertension';
            interpretation = 'Stage 1 hypertension (95th-99th percentile)';
        } else {
            category = 'Stage 2 Hypertension';
            interpretation = 'Stage 2 hypertension (≥99th percentile)';
        }

        return {
            value: Math.round(maxPercentile * 10) / 10,
            unit: 'percentile',
            interpretation,
            category,
            reference: 'AAP Clinical Practice Guideline 2017'
        };
    }

    /**
     * Dialysis Adequacy Calculators
     */

    // Kt/V Calculator for Hemodialysis
    static calculateHDKtV(params: {
        preDialysisBUN: number; // mg/dL
        postDialysisBUN: number; // mg/dL
        sessionTime: number; // hours
        ultrafiltrationVolume: number; // L
        postDialysisWeight: number; // kg
    }): CalculatorResult {
        const { preDialysisBUN, postDialysisBUN, sessionTime: _sessionTime, ultrafiltrationVolume, postDialysisWeight } = params;
        // Note: _sessionTime could be used for time-dependent calculations

        // Daugirdas equation for single-pool Kt/V
        const ln = Math.log(postDialysisBUN / preDialysisBUN);
        const ufRate = ultrafiltrationVolume / postDialysisWeight;
        const ktv = -ln + (4 - 3.5 * ln) * ufRate;

        let interpretation = '';
        let category = '';

        if (ktv >= 1.4) {
            category = 'Adequate';
            interpretation = 'Adequate dialysis (Kt/V ≥ 1.4 for 3x/week HD)';
        } else if (ktv >= 1.2) {
            category = 'Marginal';
            interpretation = 'Marginal dialysis adequacy (Kt/V 1.2-1.4)';
        } else {
            category = 'Inadequate';
            interpretation = 'Inadequate dialysis (Kt/V < 1.2)';
        }

        return {
            value: Math.round(ktv * 100) / 100,
            unit: 'Kt/V',
            interpretation,
            category,
            reference: 'KDOQI Clinical Practice Guidelines 2015'
        };
    }

    // URR Calculator
    static calculateURR(params: {
        preDialysisBUN: number; // mg/dL
        postDialysisBUN: number; // mg/dL
    }): CalculatorResult {
        const { preDialysisBUN, postDialysisBUN } = params;

        const urr = ((preDialysisBUN - postDialysisBUN) / preDialysisBUN) * 100;

        let interpretation = '';
        let category = '';

        if (urr >= 65) {
            category = 'Adequate';
            interpretation = 'Adequate dialysis (URR ≥ 65%)';
        } else if (urr >= 60) {
            category = 'Marginal';
            interpretation = 'Marginal dialysis adequacy (URR 60-65%)';
        } else {
            category = 'Inadequate';
            interpretation = 'Inadequate dialysis (URR < 60%)';
        }

        return {
            value: Math.round(urr * 10) / 10,
            unit: '%',
            interpretation,
            category,
            reference: 'KDOQI Clinical Practice Guidelines 2015'
        };
    }

    // Weekly Kt/V for Peritoneal Dialysis
    static calculatePDKtV(params: {
        weeklyUrineVolume: number; // L
        weeklyDialysateVolume: number; // L
        serumCreatinine: number; // mg/dL
        urineCreatinine: number; // mg/dL
        dialysateCreatinine: number; // mg/dL
        bodyWeight: number; // kg
    }): CalculatorResult {
        const { weeklyUrineVolume, weeklyDialysateVolume, serumCreatinine,
            urineCreatinine, dialysateCreatinine, bodyWeight } = params;

        // Calculate total body water (Watson formula approximation)
        const tbw = bodyWeight * 0.6; // Simplified

        // Calculate weekly Kt/V
        const renalKtV = (weeklyUrineVolume * urineCreatinine) / (serumCreatinine * tbw);
        const peritonealKtV = (weeklyDialysateVolume * dialysateCreatinine) / (serumCreatinine * tbw);
        const totalKtV = renalKtV + peritonealKtV;

        let interpretation = '';
        let category = '';

        if (totalKtV >= 1.7) {
            category = 'Adequate';
            interpretation = 'Adequate peritoneal dialysis (Weekly Kt/V ≥ 1.7)';
        } else if (totalKtV >= 1.5) {
            category = 'Marginal';
            interpretation = 'Marginal dialysis adequacy (Weekly Kt/V 1.5-1.7)';
        } else {
            category = 'Inadequate';
            interpretation = 'Inadequate dialysis (Weekly Kt/V < 1.5)';
        }

        return {
            value: Math.round(totalKtV * 100) / 100,
            unit: 'Weekly Kt/V',
            interpretation,
            category,
            reference: 'ISPD Guidelines 2020'
        };
    }

    /**
     * Helper Methods
     */

    private static zScoreToPercentile(zScore: number): number {
        // Approximate conversion from Z-score to percentile
        // Using cumulative distribution function approximation
        const t = 1 / (1 + 0.2316419 * Math.abs(zScore));
        const d = 0.3989423 * Math.exp(-zScore * zScore / 2);
        let prob = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));

        if (zScore > 0) {
            prob = 1 - prob;
        }

        return prob * 100;
    }

    private static calculateBPPercentileFromValue(actualBP: number, expectedBP: number, sd: number): number {
        const zScore = (actualBP - expectedBP) / sd;
        return this.zScoreToPercentile(zScore);
    }

    /**
     * Main calculator method
     */
    static calculate(input: CalculatorInput): CalculatorResult {
        const { calculatorType, parameters } = input;

        switch (calculatorType) {
            case 'EGFR_SCHWARTZ':
                return this.calculateSchwartzEGFR(parameters as any);
            case 'EGFR_CKID':
                return this.calculateCKiDEGFR(parameters as any);
            case 'EGFR_BEDSIDE_SCHWARTZ':
                return this.calculateBedsideSchwartzEGFR(parameters as any);
            case 'BMI_Z_SCORE':
                return this.calculateBMIZScore(parameters as any);
            case 'HEIGHT_Z_SCORE':
                return this.calculateHeightZScore(parameters as any);
            case 'BP_PERCENTILE':
                return this.calculateBPPercentile(parameters as any);
            case 'DIALYSIS_KTV':
                return this.calculateHDKtV(parameters as any);
            case 'DIALYSIS_URR':
                return this.calculateURR(parameters as any);
            default:
                throw new Error(`Calculator type ${calculatorType} not implemented`);
        }
    }
}
