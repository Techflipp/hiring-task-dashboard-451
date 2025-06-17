import React from 'react'
import { FiCamera, FiBarChart2, FiSettings, FiUser } from 'react-icons/fi';

const HomePageHooks = () => {
    const features = [
        {
          icon: <FiCamera className="w-8 h-8" />,
          title: 'Camera Management',
          description: 'View, manage, and configure all your surveillance cameras in one place.',
          color: 'bg-indigo-100 text-indigo-600'
        },
        {
          icon: <FiBarChart2 className="w-8 h-8" />,
          title: 'Demographics Analytics',
          description: 'Get insights into age, gender, emotion, and ethnicity demographics.',
          color: 'bg-green-100 text-green-600'
        },
        {
          icon: <FiSettings className="w-8 h-8" />,
          title: 'Configuration',
          description: 'Fine-tune camera and analytics settings for optimal performance.',
          color: 'bg-yellow-100 text-yellow-600'
        },
        {
          icon: <FiUser className="w-8 h-8" />,
          title: 'Real-time Monitoring',
          description: 'Monitor live streams and receive instant notifications.',
          color: 'bg-blue-100 text-blue-600'
        }
      ];
  return {
    features
  }
}

export default HomePageHooks