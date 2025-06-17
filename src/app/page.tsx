"use client";
import Link from 'next/link';
import { FiCamera, FiBarChart2, FiActivity, FiPieChart, FiUsers } from 'react-icons/fi';
import { motion } from 'framer-motion';
import HomePageHooks from '@/hooks/HomePageHooks';

const HomePage = () => {

  const { features } = HomePageHooks();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-50">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16 md:py-24 text-center">
        <motion.h1 
          className="text-4xl md:text-6xl font-bold text-gray-900 mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            TechFlipp Vision
          </span>
        </motion.h1>
        
        <motion.p 
          className="text-xl text-gray-700 max-w-3xl mx-auto mb-10"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Advanced camera management and demographic analytics platform for modern surveillance systems
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className='flex justify-center'>
            <Link 
              href="/cameras" 
              className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-4 rounded-full text-lg font-medium shadow-lg hover:shadow-xl transition-all hover:scale-105"
            >
              Get Started
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="text-center mb-16">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Powerful Features
          </motion.h2>
          <motion.p 
            className="text-xl text-gray-600 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Everything you need to manage your cameras and analyze demographic data
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all hover:-translate-y-1 border border-gray-100"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              whileHover={{ scale: 1.03 }}
            >
              <div className={`${feature.color} p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4 mx-auto`}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2 text-center">{feature.title}</h3>
              <p className="text-gray-600 text-center">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Analytics Preview Section */}
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="md:w-1/2">
            <motion.h2 
              className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              Advanced Analytics Dashboard
            </motion.h2>
            <motion.p 
              className="text-xl text-gray-600 mb-6"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Gain valuable insights with our advanced demographic analytics dashboard
            </motion.p>
            
            <motion.ul 
              className="space-y-4 mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <li className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-3">
                  <FiPieChart className="text-green-600" />
                </div>
                <span className="text-gray-700 font-medium">Age and gender distribution</span>
              </li>
              <li className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                  <FiUsers className="text-blue-600" />
                </div>
                <span className="text-gray-700 font-medium">Emotion and ethnicity analysis</span>
              </li>
              <li className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                  <FiActivity className="text-purple-600" />
                </div>
                <span className="text-gray-700 font-medium">Time-based activity trends</span>
              </li>
            </motion.ul>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Link 
                href="/cameras" 
                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-lg font-medium inline-flex items-center shadow-md hover:shadow-lg transition-all"
              >
                <FiBarChart2 className="mr-2" />
                Explore Analytics
              </Link>
            </motion.div>
          </div>
          
          <motion.div 
            className="md:w-1/2 bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                <h3 className="text-lg font-semibold text-gray-800 ml-2">Analytics Dashboard Preview</h3>
              </div>
            </div>
            
            <div className="p-6">
              {/* Analytics Charts */}
              <div className="space-y-8">
                {/* Age Distribution Chart */}
                <div>
                  <h4 className="font-medium text-gray-700 mb-3">Age Distribution</h4>
                  <div className="flex items-end h-32 gap-2">
                    {[
                      { label: '0-18', height: '30%', color: 'bg-indigo-400' },
                      { label: '19-30', height: '70%', color: 'bg-indigo-500' },
                      { label: '31-45', height: '90%', color: 'bg-indigo-600' },
                      { label: '46-60', height: '60%', color: 'bg-indigo-700' },
                      { label: '60+', height: '40%', color: 'bg-indigo-800' }
                    ].map((item, index) => (
                      <div key={index} className="flex flex-col items-center flex-1">
                        <div 
                          className={`w-full ${item.color} rounded-t-lg transition-all duration-700`}
                          style={{ height: item.height }}
                        ></div>
                        <span className="text-xs mt-2 text-gray-500">{item.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Gender Distribution */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-gray-700">Gender Distribution</h4>
                    <div className="flex space-x-4">
                      <span className="flex items-center text-sm">
                        <div className="w-3 h-3 bg-indigo-500 rounded-full mr-1"></div>
                        Male
                      </span>
                      <span className="flex items-center text-sm">
                        <div className="w-3 h-3 bg-pink-500 rounded-full mr-1"></div>
                        Female
                      </span>
                    </div>
                  </div>
                  
                  <div className="w-full bg-gray-200 rounded-full h-3 mb-1">
                    <div 
                      className="bg-gradient-to-r from-indigo-500 to-pink-500 h-3 rounded-full" 
                      style={{ width: '65%' }}
                    ></div>
                  </div>
                  
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>65% Male</span>
                    <span>35% Female</span>
                  </div>
                </div>
                
                {/* Emotion Analysis */}
                <div>
                  <h4 className="font-medium text-gray-700 mb-3">Emotion Analysis</h4>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { emotion: 'Happy', value: 45, color: 'bg-green-500' },
                      { emotion: 'Neutral', value: 30, color: 'bg-blue-500' },
                      { emotion: 'Surprised', value: 15, color: 'bg-yellow-500' },
                      { emotion: 'Angry', value: 10, color: 'bg-red-500' }
                    ].map((item, index) => (
                      <div key={index} className="flex items-center">
                        <div className={`w-4 h-4 ${item.color} rounded mr-2`}></div>
                        <span className="text-sm text-gray-600 flex-1">{item.emotion}</span>
                        <span className="text-sm font-medium">{item.value}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-indigo-700 to-purple-800 py-16">
        <div className="container mx-auto px-4 text-center">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold text-white mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Ready to get started?
          </motion.h2>
          <motion.p 
            className="text-xl text-indigo-100 max-w-2xl mx-auto mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Join thousands of businesses using our camera management platform
          </motion.p>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Link 
              href="/cameras" 
              className="bg-white text-indigo-700 px-8 py-4 rounded-full text-lg font-bold shadow-lg hover:bg-gray-100 hover:scale-105 transition-all inline-flex items-center"
            >
              <FiCamera className="mr-2" />
              Start Managing Cameras
            </Link>
          </motion.div>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="mb-6">
              <div className="text-2xl font-bold text-white inline-flex items-center">
                <FiCamera className="mr-2" />
                TechFlipp Vision
              </div>
            </div>
            <p className="max-w-2xl mx-auto mb-6">
              Advanced camera management and demographic analytics platform for modern surveillance systems
            </p>
            <p className="text-sm">
              © {new Date().getFullYear()} TechFlipp. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default HomePage;