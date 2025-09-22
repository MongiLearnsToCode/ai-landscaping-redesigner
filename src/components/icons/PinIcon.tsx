import React from 'react';

interface PinIconProps extends React.SVGProps<SVGSVGElement> {
  filled?: boolean;
}

export const PinIcon: React.FC<PinIconProps> = ({ filled = false, ...props }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill={filled ? "currentColor" : "none"} 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    {...props}
  >
    <path d="M12 17v5" />
    <path d="M9 17H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2h-4" />
    <path d="M12 17L9 2" />
    <path d="M15 2L12 17" />
  </svg>
);