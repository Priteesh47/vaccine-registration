import React from 'react';

const DashboardHeader = ({ title, description }) => {
  return (
    <div className="mb-8">
      <div className="bg-white shadow-sm rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        {description && (
          <p className="mt-2 text-gray-600">{description}</p>
        )}
      </div>
    </div>
  );
};

export default DashboardHeader; 