import { useState, useEffect } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { DemographicsResult } from '@/types';

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

interface ChartDataset {
  label: string;
  data: number[];
  backgroundColor: string | string[];
  borderColor: string | string[];
  borderWidth: number;
}

interface ChartData {
  labels: string[];
  datasets: ChartDataset[];
}

interface ChartDataState {
  age: ChartData;
  gender: ChartData;
  emotion: ChartData;
  ethnicity: ChartData;
}

const emptyChartData: ChartDataState = {
  age: { labels: [], datasets: [] },
  gender: { labels: [], datasets: [] },
  emotion: { labels: [], datasets: [] },
  ethnicity: { labels: [], datasets: [] }
};

const getEmptyDataset = (label: string): ChartDataset => ({
  label,
  data: [],
  backgroundColor: 'rgba(200, 200, 200, 0.5)',
  borderColor: 'rgba(200, 200, 200, 1)',
  borderWidth: 1,
});

const getAgeGroup = (age: string | number): string => {
  const ageNum = typeof age === 'string' ? parseInt(age, 10) : age;
  if (isNaN(ageNum)) return 'Unknown';
  if (ageNum < 18) return '0-17';
  if (ageNum < 26) return '18-25';
  if (ageNum < 41) return '26-40';
  if (ageNum < 61) return '41-60';
  return '65+';
};

// Enhanced data processing with better error handling
const processData = (results: DemographicsResult[]) => {
  
  if (!Array.isArray(results) || results.length === 0) {
    return emptyChartData;
  }

  const distributions = {
    age: {} as Record<string, number>,
    gender: {} as Record<string, number>,
    emotion: {} as Record<string, number>,
    ethnicity: {} as Record<string, number>
  };

  results.forEach((item) => {
    
    // Process age with multiple strategies
    if (item.age !== undefined && item.age !== null) {
      const ageGroup = getAgeGroup(item.age);
      distributions.age[ageGroup] = (distributions.age[ageGroup] || 0) + 1;
    }
    
    // Process gender
    if (item.gender !== undefined && item.gender !== null) {
      const gender = String(item.gender);
      distributions.gender[gender] = (distributions.gender[gender] || 0) + 1;
    }
    
    // Process emotion
    if (item.emotion !== undefined && item.emotion !== null) {
      const emotion = String(item.emotion);
      distributions.emotion[emotion] = (distributions.emotion[emotion] || 0) + 1;
    }
    
    // Process ethnicity
    if (item.ethnicity !== undefined && item.ethnicity !== null) {
      const ethnicity = String(item.ethnicity);
      distributions.ethnicity[ethnicity] = (distributions.ethnicity[ethnicity] || 0) + 1;
    }
  });

  // Create chart data objects
  const createChartData = (distribution: Record<string, number>): ChartData => {
    
    const labels = Object.keys(distribution);
    const data = Object.values(distribution);
    
    
    if (labels.length === 0) {
      return {
        labels: ['No data'],
        datasets: [{
          ...getEmptyDataset('No data'),
          data: [1]
        }]
      };
    }
    
    // Generate colors based on the number of labels
    const colorPalettes = {
      primary: [
        'rgba(54, 162, 235, 0.8)',
        'rgba(255, 99, 132, 0.8)',
        'rgba(255, 206, 86, 0.8)',
        'rgba(75, 192, 192, 0.8)',
        'rgba(153, 102, 255, 0.8)',
        'rgba(255, 159, 64, 0.8)',
        'rgba(199, 199, 199, 0.8)',
        'rgba(83, 102, 255, 0.8)',
      ],
      border: [
        'rgba(54, 162, 235, 1)',
        'rgba(255, 99, 132, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)',
        'rgba(199, 199, 199, 1)',
        'rgba(83, 102, 255, 1)',
      ]
    };
    
    const backgroundColors = labels.map((_, index) => 
      colorPalettes.primary[index % colorPalettes.primary.length]
    );
    
    const borderColors = labels.map((_, index) => 
      colorPalettes.border[index % colorPalettes.border.length]
    );
    
    return {
      labels,
      datasets: [{
        label: 'Count',
        data,
        backgroundColor: backgroundColors,
        borderColor: borderColors,
        borderWidth: 1,
      }]
    };
  };
  
  return {
    age: createChartData(distributions.age),
    gender: createChartData(distributions.gender),
    emotion: createChartData(distributions.emotion),
    ethnicity: createChartData(distributions.ethnicity),
  };
};

interface DemographicsChartProps {
  results: DemographicsResult[];
}

export default function DemographicsChart({ results }: DemographicsChartProps) {
  
  const [activeTab, setActiveTab] = useState('age');
  const [chartData, setChartData] = useState<ChartDataState>(emptyChartData);
  
  useEffect(() => {
    
    try {
      if (!results) {
        setChartData(emptyChartData);
        return;
      }

      if (!Array.isArray(results)) {
        
        // Try to extract array from object
        type ResultsObject = {
          items?: DemographicsResult[];
          results?: DemographicsResult[];
          data?: DemographicsResult[];
        };
        const resultsObj = results as ResultsObject;
        let extractedResults = null;
        
        if (resultsObj.results && Array.isArray(resultsObj.results)) {
          extractedResults = resultsObj.results;
        } else if (resultsObj.data && Array.isArray(resultsObj.data)) {
          extractedResults = resultsObj.data;
        } else if (resultsObj.items && Array.isArray(resultsObj.items)) {
          extractedResults = resultsObj.items;
        }
        
        if (extractedResults) {
          const processedData = processData(extractedResults);
          setChartData(processedData);
        } else {
          setChartData(emptyChartData);
        }
        return;
      }

      if (results.length === 0) {
        setChartData(emptyChartData);
        return;
      }
      
      const processedData = processData(results);
      setChartData(processedData);
      
    } catch (error) {
      console.error(error);
      setChartData(emptyChartData);
    }
  }, [results]);

  // Show different states based on data availability
  if (!results) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">No demographic data available</p>
      </div>
    );
  }

  if (Array.isArray(results) && results.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">No demographic data found for selected filters</p>
      </div>
    );
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { 
        display: false,
        position: 'top' as const
      },
      title: { 
        display: true,
        font: { size: 16 }
      },
      tooltip: {
        callbacks: {
          label: function(context: { label: string; parsed: { y?: number } | number }) {
            const value = typeof context.parsed === 'number' ? context.parsed : context.parsed.y || 0;
            const percentage = ((value / results.length) * 100).toFixed(1);
            return `${context.label}: ${value} (${percentage}%)`;
          }
        }
      }
    },
    scales: {
      y: { 
        beginAtZero: true, 
        ticks: { precision: 0 },
        title: {
          display: true,
          text: 'Count'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Category'
        }
      }
    }
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { 
        position: 'right' as const,
        labels: {
          padding: 20,
          usePointStyle: true
        }
      },
      title: { 
        display: true,
        font: { size: 16 }
      },
      tooltip: {
        callbacks: {
          label: function(context: { label: string; parsed: number; dataset: { data: number[] } }) {
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((context.parsed / total) * 100).toFixed(1);
            return `${context.label}: ${context.parsed} (${percentage}%)`;
          }
        }
      }
    }
  };

  return (
    <div className="w-full">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="age">Age ({Object.keys(chartData.age.datasets[0]?.data || {}).length})</TabsTrigger>
          <TabsTrigger value="gender">Gender ({Object.keys(chartData.gender.datasets[0]?.data || {}).length})</TabsTrigger>
          <TabsTrigger value="emotion">Emotion ({Object.keys(chartData.emotion.datasets[0]?.data || {}).length})</TabsTrigger>
          <TabsTrigger value="ethnicity">Ethnicity ({Object.keys(chartData.ethnicity.datasets[0]?.data || {}).length})</TabsTrigger>
        </TabsList>
        
        <TabsContent value="age">
          <Bar 
            data={chartData.age} 
            options={{
              ...chartOptions,
              plugins: {
                ...chartOptions.plugins,
                title: { ...chartOptions.plugins.title, text: 'Age Distribution' }
              }
            }} 
          />
        </TabsContent>
        
        <TabsContent value="gender">
          <Pie 
            data={chartData.gender} 
            options={{
              ...pieOptions,
              plugins: {
                ...pieOptions.plugins,
                title: { ...pieOptions.plugins.title, text: 'Gender Distribution' }
              }
            }} 
          />
        </TabsContent>
        
        <TabsContent value="emotion">
          <Bar 
            data={chartData.emotion} 
            options={{
              ...chartOptions,
              plugins: {
                ...chartOptions.plugins,
                title: { ...chartOptions.plugins.title, text: 'Emotion Distribution' }
              }
            }} 
          />
        </TabsContent>
        
        <TabsContent value="ethnicity">
          <Pie 
            data={chartData.ethnicity} 
            options={{
              ...pieOptions,
              plugins: {
                ...pieOptions.plugins,
                title: { ...pieOptions.plugins.title, text: 'Ethnicity Distribution' }
              }
            }} 
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}