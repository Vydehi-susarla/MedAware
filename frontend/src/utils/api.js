const API_URL = 'http://localhost:5050/api';

const getHeaders = () => {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json'
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

export const api = {
  // Medicines
  getMedicines: async () => {
    const response = await fetch(`${API_URL}/medicines`, {
      headers: getHeaders()
    });
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || 'Failed to fetch medicines');
    }
    return response.json();
  },

  getMyDonations: async () => {
    const response = await fetch(`${API_URL}/medicines/my-donations`, {
      headers: getHeaders()
    });
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || 'Failed to fetch donations');
    }
    return response.json();
  },

  getMyClaims: async () => {
    const response = await fetch(`${API_URL}/medicines/my-claims`, {
      headers: getHeaders()
    });
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || 'Failed to fetch claims');
    }
    return response.json();
  },

  donateMedicine: async (medicineData) => {
    const response = await fetch(`${API_URL}/medicines`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(medicineData)
    });
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || 'Failed to donate medicine');
    }
    return response.json();
  },

  claimMedicine: async (id) => {
    const response = await fetch(`${API_URL}/medicines/${id}/claim`, {
      method: 'POST',
      headers: getHeaders()
    });
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || 'Failed to claim medicine');
    }
    return response.json();
  },

  verifyHandover: async (id, secretCode) => {
    const response = await fetch(`${API_URL}/medicines/${id}/verify`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ secretCode })
    });
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || 'Failed to verify handover');
    }
    return response.json();
  },

  cancelClaim: async (id) => {
    const response = await fetch(`${API_URL}/medicines/${id}/cancel-claim`, {
      method: 'POST',
      headers: getHeaders()
    });
    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || 'Failed to cancel claim');
    }
    return response.json();
  },

  // Chatbot
  askChatbot: async (message) => {
    const response = await fetch(`${API_URL}/chatbot`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ message })
    });
    if (!response.ok) {
      throw new Error('Chatbot request failed');
    }
    return response.json();
  }
};
