import React, { useState, useEffect } from 'react';
import { db } from '../lib/db';

interface CustomerSearchProps {
  onSelect: (customer: any) => void;
}

const CustomerSearch: React.FC<CustomerSearchProps> = ({ onSelect }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (query.length >= 3) {
      searchCustomers();
    } else {
      setResults([]);
    }
  }, [query]);

  const searchCustomers = async () => {
    setLoading(true);
    try {
      const customers = await db.searchCustomers(query);
      setResults(customers);
    } catch (error) {
      console.error('Error searching customers:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
        placeholder="Search by phone, name or ID..."
      />
      
      {loading && (
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          <svg className="animate-spin h-5 w-5 text-purple-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      )}

      {results.length > 0 && (
        <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md border border-gray-200 max-h-60 overflow-auto">
          {results.map((customer) => (
            <div
              key={customer.id}
              className="px-4 py-2 hover:bg-purple-50 cursor-pointer"
              onClick={() => {
                onSelect(customer);
                setQuery('');
                setResults([]);
              }}
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-medium">{customer.name}</div>
                  <div className="text-sm text-gray-600">{customer.phone}</div>
                </div>
                <div className="text-right text-sm text-gray-500">
                  <div>{customer.state}</div>
                  <div>{customer.idType}: {customer.idNumber}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomerSearch;
