import { getPrismaInstance } from '../datasources/prisma';
import { DashboardCacheType } from '@prisma/client';

export interface DashboardFilter {
    ageRange?: { min: number; max: number };
    gender?: string[];
    region?: string[];
    ckdCause?: string[];
    ckdStage?: string[];
    instituteId?: string;
    dateRange?: { start: Date; end: Date };
}

export interface CKDStageDistribution {
    stage: string;
    count: number;
    percentage: number;
}

export interface DemographicSummary {
    totalPatients: number;
    genderDistribution: { gender: string; count: number; percentage: number }[];
    ageGroups: { ageGroup: string; count: number; percentage: number }[];
    regionalDistribution: { region: string; count: number; percentage: number }[];
}

export interface DialysisPrevalence {
    totalCKDPatients: number;
    dialysisPatients: number;
    dialysisPercentage: number;
    modalityDistribution: { modality: string; count: number; percentage: number }[];
    accessDistribution: { accessType: string; count: number; percentage: number }[];
}

export interface ComorbidityAnalysis {
    hypertension: { count: number; percentage: number };
    anemia: { count: number; percentage: number };
    boneDiseaseCount: { count: number; percentage: number };
    growthFailure: { count: number; percentage: number };
    metabolicAcidosis: { count: number; percentage: number };
}

export interface GrowthTrends {
    heightZScoreDistribution: { range: string; count: number; percentage: number }[];
    bmiZScoreDistribution: { range: string; count: number; percentage: number }[];
    averageHeightZScore: number;
    averageBMIZScore: number;
}

export interface OutcomeMetrics {
    averageEGFR: number;
    eGFRTrends: { timePoint: string; averageEGFR: number }[];
    hospitalizationRate: number;
    medicationAdherence: number;
    qualityOfLifeScore: number;
}

export interface DataCompletenessReport {
    totalPatients: number;
    completenessMetrics: {
        field: string;
        completed: number;
        percentage: number;
        category: 'Demographics' | 'Clinical' | 'Laboratory' | 'Follow-up' | 'Dialysis';
    }[];
    overallCompleteness: number;
}

export class DashboardService {
    private prisma = getPrismaInstance();

    /**
     * Get CKD Stage Distribution
     */
    async getCKDStageDistribution(filters: DashboardFilter = {}): Promise<CKDStageDistribution[]> {
        const whereClause = this.buildWhereClause(filters);

        const stageDistribution = await this.prisma.patient.groupBy({
            by: ['currentCKDStage'],
            where: whereClause,
            _count: {
                currentCKDStage: true
            }
        });

        const totalPatients = stageDistribution.reduce((sum, stage) => sum + stage._count.currentCKDStage, 0);

        return stageDistribution.map(stage => ({
            stage: stage.currentCKDStage || 'Unknown',
            count: stage._count.currentCKDStage,
            percentage: Math.round((stage._count.currentCKDStage / totalPatients) * 100 * 10) / 10
        }));
    }

    /**
     * Get Demographic Summary
     */
    async getDemographicSummary(filters: DashboardFilter = {}): Promise<DemographicSummary> {
        const whereClause = this.buildWhereClause(filters);

        // Total patients
        const totalPatients = await this.prisma.patient.count({ where: whereClause });

        // Gender distribution
        const genderDistribution = await this.prisma.patient.groupBy({
            by: ['gender'],
            where: whereClause,
            _count: { gender: true }
        });

        // Age groups (calculated from dateOfBirth)
        const patients = await this.prisma.patient.findMany({
            where: whereClause,
            select: { dateOfBirth: true, address: { select: { state: true } } }
        });

        const ageGroups = this.calculateAgeGroups(patients.map(p => p.dateOfBirth));
        const regionalDistribution = this.calculateRegionalDistribution(
            patients.map(p => p.address?.state).filter(Boolean) as string[]
        );

        return {
            totalPatients,
            genderDistribution: genderDistribution.map(g => ({
                gender: g.gender,
                count: g._count.gender,
                percentage: Math.round((g._count.gender / totalPatients) * 100 * 10) / 10
            })),
            ageGroups,
            regionalDistribution
        };
    }

    /**
     * Get Dialysis Prevalence
     */
    async getDialysisPrevalence(filters: DashboardFilter = {}): Promise<DialysisPrevalence> {
        const whereClause = this.buildWhereClause(filters);

        // Total CKD patients
        const totalCKDPatients = await this.prisma.patient.count({ where: whereClause });

        // Dialysis patients
        const dialysisPatients = await this.prisma.patient.count({
            where: {
                ...whereClause,
                dialysisRecords: {
                    some: {
                        isActive: true,
                        status: 1
                    }
                }
            }
        });

        // Modality distribution
        const modalityDistribution = await this.prisma.patientDialysis.groupBy({
            by: ['initialDialysisModality'],
            where: {
                isActive: true,
                status: 1,
                patient: whereClause
            },
            _count: { initialDialysisModality: true }
        });

        // Access distribution (HD)
        const hdAccessDistribution = await this.prisma.patientDialysis.groupBy({
            by: ['hdAccessType'],
            where: {
                isActive: true,
                status: 1,
                initialDialysisModality: 'HEMODIALYSIS',
                patient: whereClause
            },
            _count: { hdAccessType: true }
        });

        // Access distribution (PD)
        const pdAccessDistribution = await this.prisma.patientDialysis.groupBy({
            by: ['pdCatheterType'],
            where: {
                isActive: true,
                status: 1,
                initialDialysisModality: 'PERITONEAL_DIALYSIS',
                patient: whereClause
            },
            _count: { pdCatheterType: true }
        });

        const accessDistribution = [
            ...hdAccessDistribution.map(a => ({
                accessType: `HD: ${a.hdAccessType}`,
                count: a._count.hdAccessType,
                percentage: Math.round((a._count.hdAccessType / dialysisPatients) * 100 * 10) / 10
            })),
            ...pdAccessDistribution.map(a => ({
                accessType: `PD: ${a.pdCatheterType}`,
                count: a._count.pdCatheterType,
                percentage: Math.round((a._count.pdCatheterType / dialysisPatients) * 100 * 10) / 10
            }))
        ];

        return {
            totalCKDPatients,
            dialysisPatients,
            dialysisPercentage: Math.round((dialysisPatients / totalCKDPatients) * 100 * 10) / 10,
            modalityDistribution: modalityDistribution.map(m => ({
                modality: m.initialDialysisModality,
                count: m._count.initialDialysisModality,
                percentage: Math.round((m._count.initialDialysisModality / dialysisPatients) * 100 * 10) / 10
            })),
            accessDistribution
        };
    }

    /**
     * Get Comorbidity Analysis
     */
    async getComorbidityAnalysis(filters: DashboardFilter = {}): Promise<ComorbidityAnalysis> {
        const whereClause = this.buildWhereClause(filters);

        const totalPatients = await this.prisma.patient.count({ where: whereClause });

        // Get latest follow-up for each patient to check current comorbidities
        const latestFollowUps = await this.prisma.patientFollowUp.findMany({
            where: {
                patient: whereClause,
                status: 1
            },
            orderBy: { followUpDate: 'desc' },
            distinct: ['patientId'],
            select: {
                hasHypertension: true,
                hasAnemia: true,
                hasBoneMineralDisease: true,
                hasGrowthFailure: true,
                hasMetabolicAcidosis: true
            }
        });

        const hypertensionCount = latestFollowUps.filter(f => f.hasHypertension).length;
        const anemiaCount = latestFollowUps.filter(f => f.hasAnemia).length;
        const boneDiseaseCount = latestFollowUps.filter(f => f.hasBoneMineralDisease).length;
        const growthFailureCount = latestFollowUps.filter(f => f.hasGrowthFailure).length;
        const metabolicAcidosisCount = latestFollowUps.filter(f => f.hasMetabolicAcidosis).length;

        return {
            hypertension: {
                count: hypertensionCount,
                percentage: Math.round((hypertensionCount / totalPatients) * 100 * 10) / 10
            },
            anemia: {
                count: anemiaCount,
                percentage: Math.round((anemiaCount / totalPatients) * 100 * 10) / 10
            },
            boneDiseaseCount: {
                count: boneDiseaseCount,
                percentage: Math.round((boneDiseaseCount / totalPatients) * 100 * 10) / 10
            },
            growthFailure: {
                count: growthFailureCount,
                percentage: Math.round((growthFailureCount / totalPatients) * 100 * 10) / 10
            },
            metabolicAcidosis: {
                count: metabolicAcidosisCount,
                percentage: Math.round((metabolicAcidosisCount / totalPatients) * 100 * 10) / 10
            }
        };
    }

    /**
     * Get Growth Trends
     */
    async getGrowthTrends(filters: DashboardFilter = {}): Promise<GrowthTrends> {
        const whereClause = this.buildWhereClause(filters);

        // Get latest follow-ups with growth data
        const growthData = await this.prisma.patientFollowUp.findMany({
            where: {
                patient: whereClause,
                status: 1,
                OR: [
                    { currentHeightSDS: { not: null } },
                    { currentBMISDS: { not: null } }
                ]
            },
            orderBy: { followUpDate: 'desc' },
            distinct: ['patientId'],
            select: {
                currentHeightSDS: true,
                currentBMISDS: true
            }
        });

        const heightZScores = growthData
            .map(d => d.currentHeightSDS)
            .filter(h => h !== null) as number[];

        const bmiZScores = growthData
            .map(d => d.currentBMISDS)
            .filter(b => b !== null) as number[];

        const heightZScoreDistribution = this.calculateZScoreDistribution(heightZScores);
        const bmiZScoreDistribution = this.calculateZScoreDistribution(bmiZScores);

        const averageHeightZScore = heightZScores.length > 0
            ? heightZScores.reduce((sum, z) => sum + z, 0) / heightZScores.length
            : 0;

        const averageBMIZScore = bmiZScores.length > 0
            ? bmiZScores.reduce((sum, z) => sum + z, 0) / bmiZScores.length
            : 0;

        return {
            heightZScoreDistribution,
            bmiZScoreDistribution,
            averageHeightZScore: Math.round(averageHeightZScore * 100) / 100,
            averageBMIZScore: Math.round(averageBMIZScore * 100) / 100
        };
    }

    /**
     * Get Data Completeness Report
     */
    async getDataCompletenessReport(filters: DashboardFilter = {}): Promise<DataCompletenessReport> {
        const whereClause = this.buildWhereClause(filters);
        const totalPatients = await this.prisma.patient.count({ where: whereClause });

        const completenessMetrics = [
            // Demographics
            {
                field: 'Date of Birth',
                completed: await this.prisma.patient.count({
                    where: { ...whereClause, dateOfBirth: { not: null } }
                }),
                category: 'Demographics' as const
            },
            {
                field: 'Gender',
                completed: await this.prisma.patient.count({
                    where: { ...whereClause, gender: { not: null } }
                }),
                category: 'Demographics' as const
            },
            {
                field: 'Address',
                completed: await this.prisma.patient.count({
                    where: { ...whereClause, address: { isNot: null } }
                }),
                category: 'Demographics' as const
            },

            // Clinical
            {
                field: 'Primary Renal Diagnosis',
                completed: await this.prisma.patient.count({
                    where: { ...whereClause, primaryRenalDiagnosis: { not: null } }
                }),
                category: 'Clinical' as const
            },
            {
                field: 'Current CKD Stage',
                completed: await this.prisma.patient.count({
                    where: { ...whereClause, currentCKDStage: { not: null } }
                }),
                category: 'Clinical' as const
            },

            // Laboratory
            {
                field: 'Serum Creatinine',
                completed: await this.prisma.patient.count({
                    where: { ...whereClause, serumCreatinine: { not: null } }
                }),
                category: 'Laboratory' as const
            },
            {
                field: 'eGFR',
                completed: await this.prisma.patient.count({
                    where: { ...whereClause, eGFR: { not: null } }
                }),
                category: 'Laboratory' as const
            },
            {
                field: 'Hemoglobin',
                completed: await this.prisma.patient.count({
                    where: { ...whereClause, hemoglobin: { not: null } }
                }),
                category: 'Laboratory' as const
            }
        ];

        const metricsWithPercentage = completenessMetrics.map(metric => ({
            ...metric,
            percentage: Math.round((metric.completed / totalPatients) * 100 * 10) / 10
        }));

        const overallCompleteness = Math.round(
            (metricsWithPercentage.reduce((sum, m) => sum + m.percentage, 0) / metricsWithPercentage.length) * 10
        ) / 10;

        return {
            totalPatients,
            completenessMetrics: metricsWithPercentage,
            overallCompleteness
        };
    }

    /**
     * Helper Methods
     */

    private buildWhereClause(filters: DashboardFilter) {
        const where: any = { status: 1 };

        if (filters.instituteId) {
            where.instituteId = filters.instituteId;
        }

        if (filters.gender && filters.gender.length > 0) {
            where.gender = { in: filters.gender };
        }

        if (filters.ckdCause && filters.ckdCause.length > 0) {
            where.primaryRenalDiagnosis = { in: filters.ckdCause };
        }

        if (filters.ckdStage && filters.ckdStage.length > 0) {
            where.currentCKDStage = { in: filters.ckdStage };
        }

        if (filters.ageRange) {
            const now = new Date();
            const maxDate = new Date(now.getFullYear() - filters.ageRange.min, now.getMonth(), now.getDate());
            const minDate = new Date(now.getFullYear() - filters.ageRange.max, now.getMonth(), now.getDate());

            where.dateOfBirth = {
                gte: minDate,
                lte: maxDate
            };
        }

        if (filters.region && filters.region.length > 0) {
            where.address = {
                state: { in: filters.region }
            };
        }

        if (filters.dateRange) {
            where.createdAt = {
                gte: filters.dateRange.start,
                lte: filters.dateRange.end
            };
        }

        return where;
    }

    private calculateAgeGroups(birthDates: Date[]) {
        const now = new Date();
        const ageGroups = {
            '0-2 years': 0,
            '3-5 years': 0,
            '6-12 years': 0,
            '13-17 years': 0,
            '18+ years': 0
        };

        birthDates.forEach(birthDate => {
            const age = now.getFullYear() - birthDate.getFullYear();

            if (age <= 2) ageGroups['0-2 years']++;
            else if (age <= 5) ageGroups['3-5 years']++;
            else if (age <= 12) ageGroups['6-12 years']++;
            else if (age <= 17) ageGroups['13-17 years']++;
            else ageGroups['18+ years']++;
        });

        const total = birthDates.length;
        return Object.entries(ageGroups).map(([ageGroup, count]) => ({
            ageGroup,
            count,
            percentage: Math.round((count / total) * 100 * 10) / 10
        }));
    }

    private calculateRegionalDistribution(states: string[]) {
        const stateCounts: Record<string, number> = {};

        states.forEach(state => {
            stateCounts[state] = (stateCounts[state] || 0) + 1;
        });

        const total = states.length;
        return Object.entries(stateCounts).map(([region, count]) => ({
            region,
            count,
            percentage: Math.round((count / total) * 100 * 10) / 10
        }));
    }

    private calculateZScoreDistribution(zScores: number[]) {
        const distribution = {
            'Severely low (< -3)': 0,
            'Low (-3 to -2)': 0,
            'Below average (-2 to -1)': 0,
            'Normal (-1 to +1)': 0,
            'Above average (+1 to +2)': 0,
            'High (+2 to +3)': 0,
            'Severely high (> +3)': 0
        };

        zScores.forEach(z => {
            if (z < -3) distribution['Severely low (< -3)']++;
            else if (z < -2) distribution['Low (-3 to -2)']++;
            else if (z < -1) distribution['Below average (-2 to -1)']++;
            else if (z <= 1) distribution['Normal (-1 to +1)']++;
            else if (z <= 2) distribution['Above average (+1 to +2)']++;
            else if (z <= 3) distribution['High (+2 to +3)']++;
            else distribution['Severely high (> +3)']++;
        });

        const total = zScores.length;
        return Object.entries(distribution).map(([range, count]) => ({
            range,
            count,
            percentage: Math.round((count / total) * 100 * 10) / 10
        }));
    }

    /**
     * Cache Management
     */
    async getCachedData(cacheKey: string, instituteId?: string | null): Promise<any> {
        const cached = await this.prisma.dashboardCache.findUnique({
            where: {
                instituteId_cacheKey: {
                    instituteId: (instituteId || null) as any,
                    cacheKey
                }
            }
        });

        if (cached && cached.expiresAt > new Date()) {
            return cached.data;
        }

        return null;
    }

    async setCachedData(
        cacheKey: string,
        data: any,
        cacheType: DashboardCacheType,
        instituteId?: string | null,
        expirationHours: number = 24
    ): Promise<void> {
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + expirationHours);

        await this.prisma.dashboardCache.upsert({
            where: {
                instituteId_cacheKey: {
                    instituteId: (instituteId || null) as any,
                    cacheKey
                }
            },
            update: {
                data,
                lastUpdated: new Date(),
                expiresAt
            },
            create: {
                instituteId: (instituteId || null) as any,
                cacheKey,
                cacheType,
                data,
                expiresAt
            }
        });
    }
}
