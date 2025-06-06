import { aggregateDemographicsData, prepareChartData } from "../analytics";
import {
  DemographicsResult,
  Gender,
  AgeGroup,
  Emotion,
  EthnicGroup,
} from "@/types";

describe("Analytics Utils", () => {
  describe("aggregateDemographicsData", () => {
    it("returns empty counts for empty array", () => {
      const result = aggregateDemographicsData([]);

      expect(result.total).toBe(0);
      expect(result.gender[Gender.MALE]).toBe(0);
      expect(result.gender[Gender.FEMALE]).toBe(0);
    });

    it("correctly counts demographics data", () => {
      const mockData: DemographicsResult[] = [
        {
          id: "1",
          camera_id: "123",
          gender: Gender.MALE,
          age: AgeGroup.NINETEEN_THIRTY,
          emotion: Emotion.HAPPY,
          ethnicity: EthnicGroup.WHITE,
          confidence: 0.95,
          timestamp: "2024-01-01",
          created_at: "2024-01-01",
        },
        {
          id: "2",
          camera_id: "123",
          gender: Gender.FEMALE,
          age: AgeGroup.NINETEEN_THIRTY,
          emotion: Emotion.NEUTRAL,
          ethnicity: EthnicGroup.ASIAN,
          confidence: 0.9,
          timestamp: "2024-01-01",
          created_at: "2024-01-01",
        },
        {
          id: "3",
          camera_id: "123",
          gender: Gender.MALE,
          age: AgeGroup.THIRTYONE_FORTYFIVE,
          emotion: Emotion.HAPPY,
          ethnicity: EthnicGroup.WHITE,
          confidence: 0.85,
          timestamp: "2024-01-01",
          created_at: "2024-01-01",
        },
      ];

      const result = aggregateDemographicsData(mockData);

      expect(result.total).toBe(3);
      expect(result.gender[Gender.MALE]).toBe(2);
      expect(result.gender[Gender.FEMALE]).toBe(1);
      expect(result.emotion[Emotion.HAPPY]).toBe(2);
      expect(result.emotion[Emotion.NEUTRAL]).toBe(1);
    });
  });

  describe("prepareChartData", () => {
    it("converts object to chart data format", () => {
      const data = {
        male: 10,
        female: 15,
      };

      const result = prepareChartData(data);

      expect(result).toEqual([
        { name: "male", value: 10 },
        { name: "female", value: 15 },
      ]);
    });

    it("applies label formatter", () => {
      const data = {
        male: 10,
        female: 15,
      };

      const result = prepareChartData(data, (key) => key.toUpperCase());

      expect(result).toEqual([
        { name: "MALE", value: 10 },
        { name: "FEMALE", value: 15 },
      ]);
    });

    it("filters out zero values", () => {
      const data = {
        male: 10,
        female: 0,
        other: 5,
      };

      const result = prepareChartData(data);

      expect(result).toEqual([
        { name: "male", value: 10 },
        { name: "other", value: 5 },
      ]);
      expect(result).toHaveLength(2);
    });
  });
});
