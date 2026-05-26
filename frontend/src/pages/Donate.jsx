import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../utils/api';
import { PlusCircle, Upload, Calendar, Package, FileText, CheckCircle2, AlertCircle } from 'lucide-react';

const Donate = () => {
  const [formData, setFormData] = useState({
    name: '',
    expiryDate: '',
    quantity: '1',
    description: ''
  });
  const [image, setImage] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  // Client-side image resizing and Base64 conversion
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        // Resize image to max 400x400 to keep Base64 payload small
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 400;
        const MAX_HEIGHT = 400;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        const dataUrl = canvas.toDataURL('image/jpeg', 0.7); // 70% quality jpeg
        setImage(dataUrl);
        setImagePreview(dataUrl);
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validations
    if (!formData.name.trim() || !formData.expiryDate || !formData.quantity) {
      setError('Please fill in all required fields');
      setLoading(false);
      return;
    }

    const quantityNum = parseInt(formData.quantity);
    if (isNaN(quantityNum) || quantityNum <= 0) {
      setError('Quantity must be at least 1');
      setLoading(false);
      return;
    }

    const expiry = new Date(formData.expiryDate);
    const today = new Date();
    today.setHours(0,0,0,0);
    if (expiry < today) {
      if (!window.confirm('WARNING: The medicine expiry date is in the past. Are you sure you want to donate expired medicine?')) {
        setLoading(false);
        return;
      }
    }

    try {
      await api.donateMedicine({
        name: formData.name,
        expiryDate: formData.expiryDate,
        quantity: quantityNum,
        description: formData.description,
        image
      });
      
      setSuccess(true);
      setFormData({ name: '', expiryDate: '', quantity: '1', description: '' });
      setImage('');
      setImagePreview(null);
      
      setTimeout(() => {
        setSuccess(false);
        navigate('/dashboard');
      }, 2000);
    } catch (err) {
      setError(err.message || 'Failed to submit donation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        <header style={{ marginBottom: '2rem', textAlign: 'center' }}>
          <h1 style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontSize: '2.25rem' }}>
            <PlusCircle style={{ color: 'var(--primary-color)' }} /> Donate Medicine
          </h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
            List your unused, unexpired, or safe medicines to share them with someone in need.
          </p>
        </header>

        {success ? (
          <div className="glass-card" style={{
            textAlign: 'center',
            padding: '3rem 2rem',
            borderColor: 'var(--success-color)'
          }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              backgroundColor: 'var(--success-bg)',
              color: 'var(--success-color)',
              marginBottom: '1rem'
            }}>
              <CheckCircle2 size={36} />
            </div>
            <h2>Donated Successfully!</h2>
            <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
              Your medicine is now listed for others to claim. Redirecting to your dashboard...
            </p>
          </div>
        ) : (
          <div className="glass-card">
            {error && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                backgroundColor: 'var(--error-bg)',
                color: 'var(--error-color)',
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-md)',
                marginBottom: '1.5rem',
                fontSize: '0.9rem',
                fontWeight: 500
              }}>
                <AlertCircle size={18} />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">Medicine Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  placeholder="e.g. Paracetamol 500mg, Amoxicillin"
                  value={formData.name}
                  onChange={handleInputChange}
                />
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label htmlFor="expiryDate">Expiry Date *</label>
                  <input
                    type="date"
                    id="expiryDate"
                    name="expiryDate"
                    required
                    value={formData.expiryDate}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="quantity">Quantity *</label>
                  <input
                    type="number"
                    id="quantity"
                    name="quantity"
                    required
                    min="1"
                    placeholder="e.g. 10, 2"
                    value={formData.quantity}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="description">Usage / Storage Details / Description</label>
                <textarea
                  id="description"
                  name="description"
                  rows="3"
                  placeholder="Enter details about dosage, storage conditions, or custom instructions..."
                  value={formData.description}
                  onChange={handleInputChange}
                  style={{ minHeight: '100px', resize: 'vertical' }}
                />
              </div>

              <div className="form-group" style={{ marginBottom: '2rem' }}>
                <label>Medicine Image (Optional)</label>
                <div style={{
                  border: '2px dashed var(--border-input)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1.5rem',
                  textAlign: 'center',
                  cursor: 'pointer',
                  backgroundColor: 'var(--bg-primary)',
                  position: 'relative',
                  transition: 'border-color var(--transition-fast)'
                }}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      opacity: 0,
                      cursor: 'pointer'
                    }}
                  />
                  {imagePreview ? (
                    <div style={{ position: 'relative', display: 'inline-block' }}>
                      <img 
                        src={imagePreview} 
                        alt="Preview" 
                        style={{ maxWidth: '100%', maxHeight: '150px', borderRadius: 'var(--radius-sm)' }}
                      />
                      <button 
                        type="button" 
                        onClick={(e) => {
                          e.stopPropagation();
                          setImage('');
                          setImagePreview(null);
                        }}
                        style={{
                          position: 'absolute',
                          top: '-8px',
                          right: '-8px',
                          backgroundColor: 'var(--error-color)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '50%',
                          width: '24px',
                          height: '24px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: 'var(--shadow-sm)'
                        }}
                      >
                        &times;
                      </button>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}>
                      <Upload size={32} style={{ color: 'var(--primary-color)' }} />
                      <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>Click or Drag image here to upload</p>
                      <span style={{ fontSize: '0.75rem' }}>JPEG, PNG up to 10MB (automatically resized)</span>
                    </div>
                  )}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <button 
                  type="button" 
                  onClick={() => navigate('/dashboard')} 
                  className="btn btn-secondary"
                  style={{ flex: 1 }}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  style={{ flex: 1 }}
                  disabled={loading}
                >
                  {loading ? 'Submitting...' : 'Submit Donation'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Donate;
