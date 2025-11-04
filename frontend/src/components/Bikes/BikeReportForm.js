import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';

const BikeReportForm = () => {
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [bikeData, setBikeData] = useState({
    vin: '',
    engine_number: '',
    license_plate: '',
    make: '',
    model: '',
    year: new Date().getFullYear(),
    color: '',
    bike_type: 'SPORT',
  });
  
  const [theftData, setTheftData] = useState({
    last_seen_location: '',
    last_seen_date: '',
    police_report_number: '',
    contact_phone: '',
    additional_details: '',
  });

  const handleBikeInfoSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // First, create the bike
      const response = await axios.post('/api/bikes/', bikeData);
      setBikeData(prev => ({ ...prev, id: response.data.id }));
      setStep(2);
    } catch (error) {
      console.error('Error creating bike:', error);
      alert('Error creating bike record. Please check your information.');
    } finally {
      setLoading(false);
    }
  };

  handleTheftReportSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await axios.post(`/api/bikes/${bikeData.id}/report_stolen/`, theftData);
      alert('Bike reported stolen successfully!');
      // Redirect to dashboard or show success message
    } catch (error) {
      console.error('Error reporting theft:', error);
      alert('Error reporting bike as stolen. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Report Stolen Motorcycle</h2>
        <div className="flex items-center mt-2">
          <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
            step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'
          }`}>
            1
          </div>
          <div className={`flex-1 h-1 mx-2 ${
            step >= 2 ? 'bg-blue-600' : 'bg-gray-300'
          }`}></div>
          <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
            step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'
          }`}>
            2
          </div>
        </div>
      </div>

      {step === 1 && (
        <form onSubmit={handleBikeInfoSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                VIN Number *
              </label>
              <input
                type="text"
                required
                maxLength={17}
                value={bikeData.vin}
                onChange={(e) => setBikeData({ ...bikeData, vin: e.target.value.toUpperCase() })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="17-character VIN"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Engine Number *
              </label>
              <input
                type="text"
                required
                value={bikeData.engine_number}
                onChange={(e) => setBikeData({ ...bikeData, engine_number: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Additional bike fields */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Make *
              </label>
              <input
                type="text"
                required
                value={bikeData.make}
                onChange={(e) => setBikeData({ ...bikeData, make: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Model *
              </label>
              <input
                type="text"
                required
                value={bikeData.model}
                onChange={(e) => setBikeData({ ...bikeData, model: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="mt-6">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Continue to Theft Details'}
            </button>
          </div>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={handleTheftReportSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Last Seen Location *
              </label>
              <textarea
                required
                value={theftData.last_seen_location}
                onChange={(e) => setTheftData({ ...theftData, last_seen_location: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Street address, landmark, or area where the bike was last seen"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Last Seen Date & Time *
              </label>
              <input
                type="datetime-local"
                required
                value={theftData.last_seen_date}
                onChange={(e) => setTheftData({ ...theftData, last_seen_date: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Police Report Number
              </label>
              <input
                type="text"
                value={theftData.police_report_number}
                onChange={(e) => setTheftData({ ...theftData, police_report_number: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="If available"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contact Phone *
              </label>
              <input
                type="tel"
                required
                value={theftData.contact_phone}
                onChange={(e) => setTheftData({ ...theftData, contact_phone: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Phone number for tips"
              />
            </div>
          </div>

          <div className="mt-6 flex gap-4">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50"
            >
              {loading ? 'Reporting...' : 'Report as Stolen'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default BikeReportForm;
