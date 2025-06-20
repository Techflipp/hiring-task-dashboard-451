import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Header from './Header';

// Mock Next.js Link component
jest.mock('next/link', () => {
  return function MockLink({ 
    children, 
    href 
  }: { 
    children: React.ReactNode; 
    href: string;
  }) {
    return <a href={href}>{children}</a>;
  };
});

describe('Header', () => {
  it('renders the header with correct title', () => {
    render(<Header />);
    
    expect(screen.getByText('Camera Analytics Dashboard')).toBeInTheDocument();
  });

  it('renders navigation link to cameras', () => {
    render(<Header />);
    
    const camerasLink = screen.getByText('Cameras');
    expect(camerasLink).toBeInTheDocument();
    
    // Since the Button uses component={Link}, it should render as an anchor
    const linkElement = camerasLink.closest('a');
    expect(linkElement).toHaveAttribute('href', '/');
  });

  it('renders camera icon', () => {
    render(<Header />);
    
    // The icon should be present (Material-UI icons are rendered as SVG elements)
    expect(document.querySelector('svg')).toBeInTheDocument();
  });

  it('renders the main title as a link', () => {
    render(<Header />);
    
    const titleLink = screen.getByText('Camera Analytics Dashboard');
    expect(titleLink.closest('a')).toHaveAttribute('href', '/');
  });
}); 