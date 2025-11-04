import React, { useState } from 'react';
import axios from 'axios';

const SearchForm = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState('vin');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const searchOptions = [
    { value: 'vin', label: 'VIN Number' },
    { value: 'engine_number', label: 'Engine Number' },
    { value: 'license_plate', label: 'License Plate' },
    { value: 'make_model', label: 'Make & Model' },
  ];

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    setLoading(true);
    setError('');
    
    try {
      let searchParams = {};
      
      if (searchType === 'make_model') {
        searchParams = { search: searchTerm };
      } else {
        searchParams = { [searchType]: searchTerm };
      }

      const response = await axios.get('/api/search/bikes/', {
        params: searchParams
      });
      
      setResults(response.data.results || []);
    } catch (error) {
      setError('Search failed. Please try again.');
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Search Form */}
      <form onSubmit={handleSearch} className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label htmlFor="search-type" className="block text-sm font-medium text-gray-700 mb-1">
              Search By
            </label>
            <select
              id="search-type"
              value={searchType}
              onChange={(e) => setSearchType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {searchOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex-1">
            <label htmlFor="search-term" className="block text-sm font-medium text-gray-700 mb-1">
              Search Term
            </label>
            <input
              type="text"
              id="search-term"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={`Enter ${searchOptions.find(opt => opt.value === searchType)?.label.toLowerCase()}`}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div className="flex items-end">
            <button
              type="submit"
              disabled={loading || !searchTerm.trim()}
              className="w-full md:w-auto px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>
        </div>
      </form>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Search Results */}
      <div className="space-y-4">
        {results.map((bike) => (
          <div
            key={bike.id}
            className={`bg-white rounded-lg shadow-md p-6 border-l-4 ${
              bike.status === 'STOLEN' ? 'border-red-500' : 'border-green-500'
            }`}
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {bike.year} {bike.make} {bike.model}
                </h3>
                <p className="text-gray-600">{bike.color}</p>
                
                <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
                  <div>
                    <span className="font-medium">VIN:</span> {bike.vin}
                  </div>
                  <div>
                    <span className="font-medium">Engine:</span> {bike.engine_number}
                  </div>
                  {bike.license_plate && (
                    <div>
                      <span className="font-medium">Plate:</span> {bike.license_plate}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="text-right">
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    bike.status === 'STOLEN'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-green-100 text-green-800'
                  }`}
                >
                  {bike.status === 'STOLEN' ? 'STOLEN' : 'CLEAN'}
                </span>
              </div>
            </div>
            
            {bike.status === 'STOLEN' && (
              <div className="mt-4 p-3 bg-red-50 rounded-md">
                <p className="text-red-800 text-sm">
                  ⚠️ This vehicle has been reported stolen. Please contact authorities if seen.
                </p>
              </div>
            )}
          </div>
        ))}
        
        {results.length === 0 && !loading && searchTerm && (
          <div className="text-center py-8">
            <p className="text-gray-500">No bikes found matching your search criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchForm;
