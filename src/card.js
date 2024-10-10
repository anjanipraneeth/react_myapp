import React from 'react';

export const Card = ({ children, className }) => {
  return (
    <div className={`bg-gray-800 rounded-lg shadow-lg p-4 ${className}`}>
      {children}
    </div>
  );
};

export const CardHeader = ({ children, className }) => {
  return (
    <div className={`border-b border-gray-700 pb-2 ${className}`}>
      {children}
    </div>
  );
};

export const CardContent = ({ children }) => {
  return (
    <div className="pt-2">
      {children}
    </div>
  );
};
