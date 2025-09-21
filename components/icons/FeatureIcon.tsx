import React from 'react';

export const FeatureIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    {...props}
  >
    <path d="M10 22v-6.57"/>
    <path d="M12 11h.01"/>
    <path d="M14 22v-6.57"/>
    <path d="M12 22V10.5"/>
    <path d="M18.34 7.2a4.49 4.49 0 0 0-6.2-6.43 4.49 4.49 0 0 0-6.43 6.2 4.49 4.49 0 0 0 6.2 6.43 4.49 4.49 0 0 0 6.43-6.2Z"/>
    <path d="M12 10.5V2"/>
    <path d="M16.5 8.75a4.5 4.5 0 1 0-9 0"/>
  </svg>
);