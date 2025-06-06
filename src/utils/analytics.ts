import {
  DemographicsResult,
  Gender,
  AgeGroup,
  Emotion,
  EthnicGroup,
  DemographicsAnalytics,
  ApiAnalytics,
} from "@/types";

export function aggregateDemographicsData(
  input: DemographicsResult[] | ApiAnalytics | null
): DemographicsAnalytics {
  if (!input || (Array.isArray(input) && input.length === 0)) {
    return {
      total: 0,
      gender: Object.values(Gender).reduce(
        (acc, g) => ({ ...acc, [g]: 0 }),
        {} as Record<Gender, number>
      ),
      age: Object.values(AgeGroup).reduce(
        (acc, a) => ({ ...acc, [a]: 0 }),
        {} as Record<AgeGroup, number>
      ),
      emotion: Object.values(Emotion).reduce(
        (acc, e) => ({ ...acc, [e]: 0 }),
        {} as Record<Emotion, number>
      ),
      ethnicity: Object.values(EthnicGroup).reduce(
        (acc, e) => ({ ...acc, [e]: 0 }),
        {} as Record<EthnicGroup, number>
      ),
    };
  }

  if (Array.isArray(input)) {
    const total = input.length;

    const genderCounts = Object.values(Gender).reduce((acc, gender) => {
      acc[gender] = input.filter((r) => r.gender === gender).length;
      return acc;
    }, {} as Record<Gender, number>);

    const ageCounts = Object.values(AgeGroup).reduce((acc, age) => {
      acc[age] = input.filter((r) => r.age === age).length;
      return acc;
    }, {} as Record<AgeGroup, number>);

    const emotionCounts = Object.values(Emotion).reduce((acc, emotion) => {
      acc[emotion] = input.filter((r) => r.emotion === emotion).length;
      return acc;
    }, {} as Record<Emotion, number>);

    const ethnicityCounts = Object.values(EthnicGroup).reduce(
      (acc, ethnicity) => {
        acc[ethnicity] = input.filter((r) => r.ethnicity === ethnicity).length;
        return acc;
      },
      {} as Record<EthnicGroup, number>
    );

    return {
      total,
      gender: genderCounts,
      age: ageCounts,
      emotion: emotionCounts,
      ethnicity: ethnicityCounts,
    };
  }

  const total = Object.values(input.gender_distribution).reduce(
    (sum: number, count: number) => sum + count,
    0
  );

  return {
    total,
    gender: input.gender_distribution as Record<Gender, number>,
    age: input.age_distribution as Record<AgeGroup, number>,
    emotion: input.emotion_distribution as Record<Emotion, number>,
    ethnicity: input.ethnicity_distribution as Record<EthnicGroup, number>,
  };
}

export function prepareChartData<T extends string>(
  data: Record<T, number>,
  labelFormatter?: (key: T) => string
) {
  return (Object.entries(data) as [T, number][])
    .filter(([, value]) => value > 0)
    .map(([key, value]) => ({
      name: labelFormatter ? labelFormatter(key) : key,
      value: value,
    }));
}

export function prepareTimeSeriesData(items: DemographicsResult[]) {
  if (!Array.isArray(items) || items.length === 0) {
    return [];
  }

  const groupedByDate = items.reduce((acc, result) => {
    const date = new Date(result.created_at).toISOString().split("T")[0];
    if (!acc[date]) {
      acc[date] = {
        total: 0,
        male: 0,
        female: 0,
      };
    }
    acc[date].total += 1;
    if (result.gender === "male") acc[date].male += 1;
    if (result.gender === "female") acc[date].female += 1;
    return acc;
  }, {} as Record<string, { total: number; male: number; female: number }>);

  return Object.entries(groupedByDate)
    .map(([date, counts]) => ({
      timestamp: date,
      ...counts,
    }))
    .sort((a, b) => a.timestamp.localeCompare(b.timestamp));
}

export function calculateAverageConfidence(
  items: DemographicsResult[]
): number {
  if (!items || items.length === 0) return 0;
  const total = items.reduce((acc, item) => acc + (item.confidence || 0), 0);
  return Number(((total / items.length) * 100).toFixed(1));
}

export interface ChartDataPoint {
  name: string;
  value: number;
}

export interface TimeSeriesDataPoint {
  timestamp: string;
  total: number;
  male: number;
  female: number;
}
