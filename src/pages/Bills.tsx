import React, { useState, useEffect } from 'react';
import { db } from '../lib/db';
import { formatCurrency } from '../lib/billUtils';
import BillPreview from '../components/BillPreview';

interface BillData {
  id: string;
  billNumber: string;
  customerData: string;
  amount: number;
  items: string;
  gstType: string;
  gstAmount: number;
  total: number;
  createdAt: string;
  splitGroupId?: string;
  splitIndex?: number;
  totalSplits?: number;
}

const Bills: React.FC = () => {
  const [bills, setBills] = useState<BillData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBill, setSelectedBill] = useState<BillData | null>(null);
  const [dateFilter, setDateFilter] = useState({
    startDate: '',
    endDate: ''
  });

  useEffect(() => {
    loadBills();
  }, []);

  const loadBills = async () => {
    try {
      const allBills = await db.getAllBills();
      setBills(allBills);
    } catch (error) {
      console.error('Error loading bills:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery) {
      loadBills();
      return;
    }
    const results = await db.searchBills(searchQuery);
    setBills(results);
  };

  const handleDateFilter = async () => {
    if (dateFilter.startDate && dateFilter.endDate) {
      const results = await db.getBillsByDateRange(
        dateFilter.startDate,
        dateFilter.endDate
      );
      setBills(results);
    }
  };

  const viewBillDetails = (bill: BillData) => {
    setSelectedBill(bill);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Bills</h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of all bills generated in the system
          </p>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div>
          <label className="block text-sm font-medium text-gray-700">Search</label>
          <div className="mt-1 flex rounded-md shadow-sm">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
              placeholder="Search by bill number, customer..."
            />
            <button
              onClick={handleSearch}
              className="ml-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
              Search
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Start Date</label>
          <input
            type="date"
            value={dateFilter.startDate}
            onChange={(e) => setDateFilter(prev => ({ ...prev, startDate: e.target.value }))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">End Date</label>
          <div className="mt-1 flex rounded-md shadow-sm">
            <input
              type="date"
              value={dateFilter.endDate}
              onChange={(e) => setDateFilter(prev => ({ ...prev, endDate: e.target.value }))}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
            />
            <button
              onClick={handleDateFilter}
              className="ml-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
              Filter
            </button>
          </div>
        </div>
      </div>

      {/* Bills Table */}
      <div className="mt-8 flex flex-col">
        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Bill No</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Date</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Customer</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Amount</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">GST</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Total</th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Split</th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {loading ? (
                    <tr>
                      <td colSpan={8} className="px-3 py-4 text-sm text-gray-500 text-center">
                        Loading bills...
                      </td>
                    </tr>
                  ) : bills.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-3 py-4 text-sm text-gray-500 text-center">
                        No bills found
                      </td>
                    </tr>
                  ) : (
                    bills.map((bill) => {
                      const customer = JSON.parse(bill.customerData);
                      return (
                        <tr key={bill.id}>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{bill.billNumber}</td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {new Date(bill.createdAt).toLocaleDateString()}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {customer.name}
                            <br />
                            <span className="text-xs text-gray-400">{customer.phone}</span>
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{formatCurrency(bill.amount)}</td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{formatCurrency(bill.gstAmount)}</td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{formatCurrency(bill.total)}</td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {bill.splitIndex !== undefined && (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                {bill.splitIndex + 1} of {bill.totalSplits}
                              </span>
                            )}
                          </td>
                          <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                            <button
                              onClick={() => viewBillDetails(bill)}
                              className="text-purple-600 hover:text-purple-900"
                            >
                              View<span className="sr-only">, {bill.billNumber}</span>
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Bill Preview Modal */}
      {selectedBill && (
        <BillPreview 
          bill={selectedBill} 
          onClose={() => setSelectedBill(null)} 
        />
      )}
    </div>
  );
};

export default Bills;
