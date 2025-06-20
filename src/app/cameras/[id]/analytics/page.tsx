 
"use client";
import Link from 'next/link';
import React, { useState, useEffect, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Users, Eye, Calendar, Settings, TrendingUp, RefreshCw } from 'lucide-react';
import { getDemographicsResults } from "@/lib/getDemographicsResults"; // Assuming this is your API function
import { useParams } from 'next/navigation';

// Define types
interface DemographicsData {
    analytics: {
        total_count: number;
        gender_distribution: Record<string, number>;
        age_distribution: Record<string, number>;
        emotion_distribution: Record<string, number>;
        ethnicity_distribution: Record<string, number>;
    };
    items: DemographicsItem[];
}

interface DemographicsItem {
    id: string;
    count: number;
    gender: string;
    age: string;
    ethnicity: string;
    emotion: string;
    created_at: string;
}

interface StatCardProps {
    title: string;
    value: string | number;
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    subtitle?: string;
    iconColor?: string;
}

interface MetricSelectorProps {
    metrics: { key: MetricKey; label: string }[];
    selected: MetricKey;
    onSelect: (metric: MetricKey) => void;
}

type MetricKey = 'gender' | 'age' | 'emotion' | 'ethnicity';

const Dashboard = () => {
    const [data, setData] = useState<DemographicsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedMetric, setSelectedMetric] = useState<MetricKey>('gender');
    const params = useParams();
    const cameraId = params?.id as string;

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                if (!cameraId) {
                    throw new Error('Camera ID is required');
                }
                const result = await getDemographicsResults(cameraId);
                setData(result);
            } catch (err: any) {
                setError(err.message || 'Failed to load data');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [cameraId]);

    const formatChartData = useMemo(() => {
        return (distribution: Record<string, number>) => {
            if (!data) return [];
            const totalCount = data.analytics.total_count;
            return Object.entries(distribution).map(([key, value]) => ({
                name: key.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
                value: value,
                percentage: ((value / totalCount) * 100).toFixed(1)
            }));
        };
    }, [data]);

    const getChartColors = (index: number) => {
        const colors = ['#1f2937', '#374151', '#4b5563', '#6b7280', '#9ca3af'];
        return colors[index % colors.length];
    };

    const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, subtitle, iconColor = '#6b7280' }) => (
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-600">{title}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
                    {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                    <Icon className="w-6 h-6" style={{ color: iconColor }} />
                </div>
            </div>
        </div>
    );

    const MetricSelector: React.FC<MetricSelectorProps> = ({ metrics, selected, onSelect }) => (
        <div className="flex flex-wrap gap-2 mb-6">
            {metrics.map((metric) => (
                <button
                    key={metric.key}
                    onClick={() => onSelect(metric.key)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${selected === metric.key
                        ? 'bg-gray-900 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                >
                    {metric.label}
                </button>
            ))}
        </div>
    );

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="flex items-center space-x-3">
                    <RefreshCw className="w-6 h-6 animate-spin text-gray-600" />
                    <span className="text-gray-600 font-medium">Loading analytics...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Eye className="w-8 h-8 text-red-600" />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Data</h2>
                    <p className="text-gray-600 mb-4">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    if (!data) return null;

    const metrics = [
        { key: 'gender', label: 'Gender' },
        { key: 'age', label: 'Age Groups' },
        { key: 'emotion', label: 'Emotions' },
        { key: 'ethnicity', label: 'Ethnicity' }
    ];

    const currentData = formatChartData(data.analytics[`${selectedMetric}_distribution`]);
    const recentItems = data.items.slice(0, 5);

    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center">
                  <Eye className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-xl font-semibold text-gray-900">
                  Camera Analytics
                </h1>
              </div>
              <div className="flex items-center space-x-3">
                <Link
                  href={`/cameras/${cameraId}/demographics/edit`}
                  className="flex items-center space-x-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                >
                  <Settings className="w-4 h-4" />
                  <span>Edit Configuration</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              title="Total Detections"
              value={data.analytics.total_count.toLocaleString()}
              icon={Users}
              subtitle="All time"
            />
            <StatCard
              title="Active Sessions"
              value={data.items.length}
              icon={Eye}
              subtitle="Current period"
            />
            <StatCard
              title="Peak Age Group"
              value="19-30"
              icon={TrendingUp}
              subtitle={`${data.analytics.age_distribution["19-30"]} detections`}
            />
            <StatCard
              title="Dominant Emotion"
              value="Neutral"
              icon={Calendar}
              subtitle={`${(
                (data.analytics.emotion_distribution.neutral /
                  data.analytics.total_count) *
                100
              ).toFixed(1)}%`}
            />
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Distribution Chart */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">
                  Distribution Analysis
                </h2>
              </div>

              <MetricSelector
                  // @ts-ignore
                metrics={metrics}
                selected={selectedMetric}
                onSelect={setSelectedMetric}
              />

              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={currentData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 12, fill: "#6b7280" }}
                      axisLine={{ stroke: "#e5e7eb" }}
                    />
                    <YAxis
                      tick={{ fontSize: 12, fill: "#6b7280" }}
                      axisLine={{ stroke: "#e5e7eb" }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1f2937",
                        border: "none",
                        borderRadius: "8px",
                        color: "#ffffff",
                      }}
                      formatter={(value, name) => [
                        value.toLocaleString(),
                        "Count",
                      ]}
                    />
                    <Bar dataKey="value" fill="#1f2937" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Pie Chart */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">
                Gender Distribution
              </h2>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={formatChartData(data.analytics.gender_distribution)}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={120}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {formatChartData(data.analytics.gender_distribution).map(
                        (entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={getChartColors(index)}
                          />
                        )
                      )}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1f2937",
                        border: "none",
                        borderRadius: "8px",
                        color: "#ffffff",
                      }}
                      formatter={(value) => [value.toLocaleString(), "Count"]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center space-x-6 mt-4">
                {formatChartData(data.analytics.gender_distribution).map(
                  (entry, index) => (
                    <div
                      key={entry.name}
                      className="flex items-center space-x-2"
                    >
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: getChartColors(index) }}
                      />
                      <span className="text-sm text-gray-600">
                        {entry.name}
                      </span>
                      <span className="text-sm font-medium text-gray-900">
                        {entry.percentage}%
                      </span>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                Recent Activity
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Count
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Demographics
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Emotion
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Timestamp
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {recentItems.map((item) => (
                    <tr
                      key={item.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {item.count}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {item.gender.charAt(0).toUpperCase() +
                            item.gender.slice(1)}{" "}
                          • {item.age} • {item.ethnicity.replace("_", " ")}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            item.emotion === "happy"
                              ? "bg-green-100 text-green-800"
                              : item.emotion === "sad"
                              ? "bg-red-100 text-red-800"
                              : item.emotion === "angry"
                              ? "bg-red-100 text-red-800"
                              : item.emotion === "surprise"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {item.emotion.charAt(0).toUpperCase() +
                            item.emotion.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(item.created_at).toLocaleDateString()}{" "}
                        {new Date(item.created_at).toLocaleTimeString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                          Active
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
};

export default Dashboard;