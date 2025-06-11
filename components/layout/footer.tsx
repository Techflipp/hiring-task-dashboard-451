'use client';

import Link from 'next/link';
import { 
  Camera, 
  Mail, 
  Phone, 
  MapPin, 
  Github, 
  Twitter, 
  Linkedin,
  ExternalLink
} from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  const navigationLinks = [
    {
      title: 'Platform',
      links: [
        { name: 'Dashboard', href: '/' },
        { name: 'Cameras', href: '/cameras' },
        { name: 'Analytics', href: '/analytics' },
        { name: 'Demographics', href: '/demographics' },
      ]
    },
    {
      title: 'Management',
      links: [
        { name: 'Settings', href: '/settings' },
        { name: 'Users', href: '/users' },
        { name: 'Tags', href: '/tags' },
        { name: 'Reports', href: '/reports' },
      ]
    },
    {
      title: 'Support',
      links: [
        { name: 'Documentation', href: '/docs' },
        { name: 'API Reference', href: '/api-docs' },
        { name: 'Help Center', href: '/help' },
        { name: 'Contact Support', href: '/support' },
      ]
    },
    {
      title: 'Company',
      links: [
        { name: 'About Us', href: '/about' },
        { name: 'Privacy Policy', href: '/privacy' },
        { name: 'Terms of Service', href: '/terms' },
        { name: 'Security', href: '/security' },
      ]
    }
  ];

  const socialLinks = [
    { name: 'GitHub', href: '#', icon: Github },
    { name: 'Twitter', href: '#', icon: Twitter },
    { name: 'LinkedIn', href: '#', icon: Linkedin },
  ];

  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Camera className="h-6 w-6 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold text-white">TechFlipp</span>
                <span className="block text-sm text-gray-400 -mt-1">Camera Management</span>
              </div>
            </div>
            
            <p className="text-gray-400 mb-6 max-w-md">
              Advanced camera management and analytics platform providing real-time monitoring, 
              demographics analysis, and comprehensive security solutions.
            </p>
            
            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <Mail className="h-4 w-4 text-blue-400" />
                <a href="mailto:contact@techflipp.com" className="hover:text-white transition-colors">
                  contact@techflipp.com
                </a>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Phone className="h-4 w-4 text-blue-400" />
                <a href="tel:+1234567890" className="hover:text-white transition-colors">
                  +1 (234) 567-8900
                </a>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <MapPin className="h-4 w-4 text-blue-400" />
                <span>San Francisco, CA</span>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          {/* {navigationLinks.map((section) => (
            <div key={section.title}>
              <h3 className="text-white font-semibold mb-4">{section.title}</h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link 
                      href={link.href}
                      className="text-sm hover:text-white transition-colors flex items-center gap-1 group"
                    >
                      {link.name}
                      {link.href.startsWith('http') && (
                        <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))} */}
        </div>

        {/* Newsletter Signup */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h3 className="text-white font-semibold mb-2">Stay Updated</h3>
              <p className="text-gray-400 text-sm max-w-md">
                Get the latest updates on new features, security patches, and platform improvements.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 lg:max-w-md">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium whitespace-nowrap">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-sm text-gray-400">
              <span>© {currentYear} TechFlipp. All rights reserved.</span>
              <span className="hidden sm:block">•</span>
              <span>Built with ❤️ for security professionals</span>
            </div>
            
            {/* Social Links */}
            <div className="flex items-center gap-4">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-md transition-colors"
                    aria-label={social.name}
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Status Indicator */}
      {/* <div className="bg-green-900 border-t border-green-800">
        <div className="container mx-auto px-4 py-2">
          <div className="flex items-center justify-center gap-2 text-green-300 text-xs">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span>All systems operational</span>
          </div>
        </div>
      </div> */}
    </footer>
  );
}