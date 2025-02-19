import React from 'react';

const Reports: React.FC = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Reports</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">GST Report</h2>
          <button className="w-full bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700">
            Generate GSTR-1
          </button>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Sales Report</h2>
          <button className="w-full bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700">
            Generate Sales Report
          </button>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Customer Report</h2>
          <button className="w-full bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700">
            Generate Customer Report
          </button>
        </div>
      </div>
    </div>
  );
}

export default Reports;
