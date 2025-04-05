import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../../config/axios';

const Vaccines = () => {
  const [vaccines, setVaccines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newVaccine, setNewVaccine] = useState({
    name: '',
    description: '',
    manufacturer: '',
    dosageRequired: 1,
    daysUntilNextDose: 0,
    ageGroup: '',
    sideEffects: '',
    price: '',
    stockAvailable: 0
  });

  useEffect(() => {
    fetchVaccines();
  }, []);

  const fetchVaccines = async () => {
    try {
      const response = await api.get('/vaccines');
      setVaccines(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching vaccines:', error);
      toast.error('Failed to load vaccines');
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewVaccine(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/vaccines', newVaccine);
      toast.success('Vaccine added successfully');
      setShowAddModal(false);
      setNewVaccine({
        name: '',
        description: '',
        manufacturer: '',
        dosageRequired: 1,
        daysUntilNextDose: 0,
        ageGroup: '',
        sideEffects: '',
        price: '',
        stockAvailable: 0
      });
      fetchVaccines(); // Refresh the list
    } catch (error) {
      console.error('Error adding vaccine:', error);
      toast.error(error.response?.data?.message || 'Failed to add vaccine');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Vaccine Management</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-300"
        >
          Add New Vaccine
        </button>
      </div>

      {/* Vaccines List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {vaccines.map((vaccine) => (
          <div
            key={vaccine._id}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
          >
            <div className="flex justify-between items-start">
              <h3 className="text-lg font-semibold text-gray-900">{vaccine.name}</h3>
              <span className={`px-3 py-1 rounded-full text-sm ${
                vaccine.stockAvailable > 10
                  ? 'bg-green-100 text-green-800'
                  : vaccine.stockAvailable > 0
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-red-100 text-red-800'
              }`}>
                Stock: {vaccine.stockAvailable}
              </span>
            </div>
            <p className="text-gray-600 mt-2">{vaccine.description}</p>
            <div className="mt-4 space-y-2">
              <p className="text-sm text-gray-600">
                <span className="font-medium">Manufacturer:</span> {vaccine.manufacturer}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Dosage Required:</span> {vaccine.dosageRequired}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Age Group:</span> {vaccine.ageGroup}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Price:</span> ₹{vaccine.price}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Add Vaccine Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">Add New Vaccine</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={newVaccine.name}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Manufacturer</label>
                  <input
                    type="text"
                    name="manufacturer"
                    value={newVaccine.manufacturer}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Price (₹)</label>
                  <input
                    type="number"
                    name="price"
                    value={newVaccine.price}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Stock Available</label>
                  <input
                    type="number"
                    name="stockAvailable"
                    value={newVaccine.stockAvailable}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Dosage Required</label>
                  <input
                    type="number"
                    name="dosageRequired"
                    value={newVaccine.dosageRequired}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                    min="1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Days Until Next Dose</label>
                  <input
                    type="number"
                    name="daysUntilNextDose"
                    value={newVaccine.daysUntilNextDose}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                    min="0"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Age Group</label>
                  <input
                    type="text"
                    name="ageGroup"
                    value={newVaccine.ageGroup}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                    placeholder="e.g., 0-5 years"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    name="description"
                    value={newVaccine.description}
                    onChange={handleInputChange}
                    rows="3"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Side Effects</label>
                  <textarea
                    name="sideEffects"
                    value={newVaccine.sideEffects}
                    onChange={handleInputChange}
                    rows="2"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Add Vaccine
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Vaccines; 