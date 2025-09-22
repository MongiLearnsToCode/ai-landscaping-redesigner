import React from 'react';

export const PlantIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
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
    <path d="M2 22c1.25-.98 2.22-2.33 2.89-3.89 1.4-3.21 2.82-6.42 4.24-9.63C9.92 6.6 9.22 5.12 8.29 4.19c-1.88-1.88-4.95-1.88-6.83 0s-1.88 4.95 0 6.83c.93.93 2.41 1.63 4.31.85 3.21-1.42 6.42-2.84 9.63-4.24C17.67 6.78 19.02 5.81 20 4.56"/>
    <path d="M12.89 11.11c-2.73 2.73-7.17 7.17-9.9 9.9"/>
    <path d="m5.33 12.67 4 4"/>
  </svg>
);