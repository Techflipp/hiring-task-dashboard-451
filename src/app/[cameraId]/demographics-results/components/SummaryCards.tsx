import { Analytics, Emotion, Ethnicity } from "@/types/camera";

interface SummaryCardsProps {
  analytics: Analytics;
}

const SummaryCards = ({ analytics }: SummaryCardsProps) => {
  const commonEmotion = Object.entries(
    analytics.emotion_distribution ?? {}
  ).sort((a, b) => b[1] - a[1])[0]?.[0] as keyof typeof Emotion;
  const commonEthnicity = Object.entries(
    analytics.ethnicity_distribution ?? {}
  ).sort((a, b) => b[1] - a[1])[0]?.[0] as keyof typeof Ethnicity;
  const mostCommonAge =
    Object.entries(analytics.age_distribution).sort(
      (a, b) => b[1] - a[1]
    )[0]?.[0] || "N/A";
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-sm font-medium text-gray-500">Total Records</h3>
        <p className="text-2xl font-semibold">{analytics.total_count}</p>
      </div> */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-sm font-medium text-gray-500">Filtered Records</h3>
        <p className="text-2xl font-semibold">{analytics.total_count}</p>
      </div>
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-sm font-medium text-gray-500">
          Most Common Emotion
        </h3>
        <p className="text-2xl font-semibold">
          {Emotion[commonEmotion] ?? "NA"}
        </p>
      </div>
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-sm font-medium text-gray-500">
          Most Common Ethnicity
        </h3>
        <p className="text-2xl font-semibold">
          {Ethnicity[commonEthnicity] ?? "NA"}
        </p>
      </div>
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-sm font-medium text-gray-500">
          Most Common Age Group
        </h3>
        <p className="text-2xl font-semibold">{mostCommonAge}</p>
      </div>
    </div>
  );
};

export default SummaryCards;
