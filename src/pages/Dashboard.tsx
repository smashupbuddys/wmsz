import React from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {/* Today's Summary */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Today's Summary</h2>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Total Bills</span>
            <span className="font-medium">0</span>
          </div>
          <div className="flex justify-between">
            <span>Total Amount</span>
            <span className="font-medium">₹0</span>
          </div>
        </div>
      </div>

      {/* Recent Bills */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Recent Bills</h2>
        <div className="space-y-2">
          <p className="text-gray-500">No recent bills</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
        <div className="space-y-2">
          <button 
            onClick={() => navigate('/quick-bill')}
            className="w-full bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700"
          >
            New Quick Bill
          </button>
          <button 
            onClick={() => navigate('/customers')}
            className="w-full bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700"
          >
            Add Customer
          </button>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
