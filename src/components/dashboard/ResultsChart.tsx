'use client'

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts'

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#8dd1e1', '#d0ed57', '#a4de6c']

const toChartData = (obj: Record<string, number>) =>
  Object.entries(obj).map(([name, value]) => ({ name, value }))

export const AnalyticsCharts = ({
  gender,
  age,
  emotion,
  ethnicity
}: {
  gender?: Record<string, number>
  age?: Record<string, number>
  emotion?: Record<string, number>
  ethnicity?: Record<string, number>
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Gender Chart */}
      {gender && (
        <div>
          <h3 className="text-lg font-semibold mb-2">Gender</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={toChartData(gender)} dataKey="value" nameKey="name" outerRadius={80} label>
                {toChartData(gender).map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Emotion */}
      {emotion && (
        <div>
          <h3 className="text-lg font-semibold mb-2">Emotion</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={toChartData(emotion)}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Age */}
      {age && (
        <div>
          <h3 className="text-lg font-semibold mb-2">Age</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={toChartData(age)}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#ffc658" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Ethnicity */}
      {ethnicity && (
        <div>
          <h3 className="text-lg font-semibold mb-2">Ethnicity</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={toChartData(ethnicity)} dataKey="value" nameKey="name" outerRadius={80} label>
                {toChartData(ethnicity).map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}
