import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../config/axios';

const BookAppointment = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [centers, setCenters] = useState([]);
  const [vaccines, setVaccines] = useState([]);
  const [selectedCenter, setSelectedCenter] = useState('');
  const [selectedVaccine, setSelectedVaccine] = useState('');
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [formData, setFormData] = useState({
    centerId: '',
    vaccineId: '',
    appointmentDate: '',
    appointmentTime: '',
    notes: ''
  });

  useEffect(() => {
    fetchCenters();
    fetchVaccines();
  }, []);

  const fetchCenters = async () => {
    try {
      const response = await api.get('/centers');
      setCenters(response.data.data);
    } catch (error) {
      console.error('Error fetching centers:', error);
      toast.error('Failed to fetch vaccination centers');
    }
  };

  const fetchVaccines = async () => {
    try {
      const response = await api.get('/vaccines');
      setVaccines(response.data.data);
    } catch (error) {
      console.error('Error fetching vaccines:', error);
      toast.error('Failed to fetch vaccines');
    } finally {
      setLoading(false);
    }
  };

  const handleCenterChange = async (e) => {
    const centerId = e.target.value;
    setSelectedCenter(centerId);
    setFormData(prev => ({ ...prev, centerId }));
    
    if (centerId) {
      try {
        const response = await api.get(`/centers/${centerId}/slots`);
        setAvailableSlots(response.data.data);
      } catch (error) {
        console.error('Error fetching slots:', error);
        toast.error('Failed to fetch available slots');
      }
    }
  };

  const handleVaccineChange = (e) => {
    const vaccineId = e.target.value;
    setSelectedVaccine(vaccineId);
    setFormData(prev => ({ ...prev, vaccineId }));
  };

  const handleSlotChange = (e) => {
    const slot = e.target.value;
    setSelectedSlot(slot);
    const [date, time] = slot.split('T');
    setFormData(prev => ({ ...prev, appointmentDate: date, appointmentTime: time }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/appointments', formData);
      if (response.data.success) {
        toast.success('Appointment booked successfully!');
        navigate('/user/dashboard');
      }
    } catch (error) {
      console.error('Error booking appointment:', error);
      toast.error(error.response?.data?.message || 'Failed to book appointment');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Book Vaccination Appointment</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Center Selection */}
            <div>
              <label htmlFor="center" className="block text-sm font-medium text-gray-700 mb-2">
                Select Vaccination Center
              </label>
              <select
                id="center"
                value={selectedCenter}
                onChange={handleCenterChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select a center</option>
                {centers.map(center => (
                  <option key={center.id} value={center.id}>
                    {center.name} - {center.address}
                  </option>
                ))}
              </select>
            </div>

            {/* Vaccine Selection */}
            <div>
              <label htmlFor="vaccine" className="block text-sm font-medium text-gray-700 mb-2">
                Select Vaccine
              </label>
              <select
                id="vaccine"
                value={selectedVaccine}
                onChange={handleVaccineChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select a vaccine</option>
                {vaccines.map(vaccine => (
                  <option key={vaccine.id} value={vaccine.id}>
                    {vaccine.name} - {vaccine.manufacturer}
                  </option>
                ))}
              </select>
            </div>

            {/* Available Slots */}
            {selectedCenter && (
              <div>
                <label htmlFor="slot" className="block text-sm font-medium text-gray-700 mb-2">
                  Select Appointment Slot
                </label>
                <select
                  id="slot"
                  value={selectedSlot}
                  onChange={handleSlotChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select a time slot</option>
                  {availableSlots.map(slot => (
                    <option key={slot.id} value={slot.datetime}>
                      {new Date(slot.datetime).toLocaleString()}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Additional Notes */}
            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
                Additional Notes (Optional)
              </label>
              <textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="3"
              />
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Book Appointment
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookAppointment; 