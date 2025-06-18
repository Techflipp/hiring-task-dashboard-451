import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { fetchAnalyticsData } from '@/lib/api';
import { AnalyticsData } from '@/lib/types';

const AnalyticsPageHooks = () => {

    const params = useParams();
    const id = params.id as string;
    const [data, setData] = useState<AnalyticsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filters, setFilters] = useState<Record<string, string>>({});
    const [showFilterPanel, setShowFilterPanel] = useState(false);
    const [tempFilters, setTempFilters] = useState<Record<string, string>>({});
    
    const filterOptions = {
      gender: ['male', 'female'],
      age: ['0-18', '19-30', '31-45', '46-60', '60+'],
      emotion: ['angry', 'fear', 'happy', 'neutral', 'sad', 'surprise'],
      ethnicity: ['white', 'african', 'south_asian', 'east_asian', 'middle_eastern']
    };
  
    useEffect(() => {
      document.body.style.overflow = showFilterPanel ? 'hidden' : 'auto';
      return () => {
        document.body.style.overflow = 'auto';
      };
    }, [showFilterPanel]);
    
    
  
    useEffect(() => {
      if (!id) return;
  
      const loadData = async () => {
        setLoading(true);
        try {
          const analyticsData = await fetchAnalyticsData(id, filters);
          setData(analyticsData);
          setError(null);
        } catch (err) {
          setError('Failed to load analytics data');
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
  
      loadData();
    }, [id, filters]);
  

const handleFilterChange = (key: string, value: string) => {
  setTempFilters(prev => {
    if (value === '') {
      const rest = { ...prev };
      delete rest[key];
      return rest;
    }
    return { ...prev, [key]: value };
  });
};
  
    const applyFilters = () => {
      setFilters(tempFilters);
      setShowFilterPanel(false);
    };
  
    const resetFilters = () => {
      setTempFilters({});
      setFilters({});
      setShowFilterPanel(false);
    };
  
    const activeFiltersCount = Object.keys(filters).length;


  return {
    data,
    loading,
    error,
    filters,
    showFilterPanel,
    tempFilters,
    filterOptions,
    handleFilterChange,
    applyFilters,
    resetFilters,
    activeFiltersCount,
    id,
    setShowFilterPanel,
    setFilters,
    setTempFilters
  }
}

export default AnalyticsPageHooks