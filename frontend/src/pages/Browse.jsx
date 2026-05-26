import React, { useState, useEffect } from 'react';
import { api } from '../utils/api';
import { Search, Calendar, Package, User, CheckCircle2, Copy, X, HeartHandshake } from 'lucide-react';

const Browse = () => {
  const [medicines, setMedicines] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Claim Success Modal State
  const [claimedMed, setClaimedMed] = useState(null);
  const [secretCode, setSecretCode] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchMedicines();
  }, []);

  const fetchMedicines = async () => {
    try {
      setLoading(true);
      const data = await api.getMedicines();
      setMedicines(data);
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to fetch medicines');
    } finally {
      setLoading(false);
    }
  };

  const handleClaim = async (id, medName) => {
    if (!window.confirm(`Are you sure you want to claim "${medName}"?`)) return;

    try {
      const result = await api.claimMedicine(id);
      setClaimedMed(result.medicine);
      setSecretCode(result.secretCode);
      setCopied(false);
      // Refresh the available list
      fetchMedicines();
    } catch (err) {
      alert(err.message || 'Failed to claim medicine');
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(secretCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const filteredMedicines = medicines.filter(med => 
    med.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (med.description && med.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const getExpiryStatus = (dateString) => {
    const expiry = new Date(dateString);
    const today = new Date();
    const diffTime = expiry - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return { text: 'Expired', color: 'var(--error-color)', bg: 'var(--error-bg)' };
    } else if (diffDays <= 30) {
      return { text: `Expiring soon (${diffDays} days)`, color: 'var(--warning-color)', bg: 'var(--warning-bg)' };
    } else {
      return { text: `Expires: ${expiry.toLocaleDateString()}`, color: 'var(--text-secondary)', bg: 'transparent' };
    }
  };

  return (
    <div className="container">
      <header style={{ marginBottom: '2.5rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Browse Available Medicines</h1>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
          Search and claim unused medicines donated by other members of the community. All claims require a secret code verification during physical handover.
        </p>
      </header>

      {/* Search Bar */}
      <div style={{
        position: 'relative',
        maxWidth: '500px',
        margin: '0 auto 2.5rem auto'
      }}>
        <Search size={20} style={{
          position: 'absolute',
          left: '16px',
          top: '50%',
          transform: 'translateY(-50%)',
          color: 'var(--text-muted)'
        }} />
        <input
          type="text"
          placeholder="Search by medicine name or description..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            paddingLeft: '3rem',
            borderRadius: 'var(--radius-full)',
            border: '1px solid var(--border-glass)',
            boxShadow: 'var(--shadow-sm)',
            minHeight: '52px'
          }}
        />
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <div className="spinner" style={{
            width: '40px',
            height: '40px',
            border: '4px solid var(--primary-light)',
            borderTop: '4px solid var(--primary-color)',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 1rem auto'
          }}></div>
          <p style={{ color: 'var(--text-secondary)' }}>Loading medicines...</p>
        </div>
      ) : error ? (
        <div className="glass-card" style={{ 
          backgroundColor: 'var(--error-bg)', 
          color: 'var(--error-color)',
          textAlign: 'center',
          padding: '2rem'
        }}>
          <h3>Failed to load medicines</h3>
          <p style={{ marginTop: '0.5rem' }}>{error}</p>
          <button onClick={fetchMedicines} className="btn btn-primary" style={{ marginTop: '1rem' }}>Retry</button>
        </div>
      ) : filteredMedicines.length === 0 ? (
        <div className="glass-card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <Package size={48} style={{ color: 'var(--text-muted)', marginBottom: '1rem' }} />
          <h3>No Medicines Found</h3>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
            {searchQuery 
              ? "We couldn't find any available medicines matching your search." 
              : "There are currently no available medicines for donation from other users."}
          </p>
        </div>
      ) : (
        <div className="grid-3">
          {filteredMedicines.map((med) => {
            const expiry = getExpiryStatus(med.expiryDate);
            return (
              <div key={med._id} className="glass-card" style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ 
                  height: '180px', 
                  backgroundColor: 'var(--bg-primary)',
                  borderRadius: 'var(--radius-md)',
                  overflow: 'hidden',
                  position: 'relative',
                  marginBottom: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {med.image ? (
                    <img 
                      src={med.image} 
                      alt={med.name} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    <div style={{
                      width: '100%',
                      height: '100%',
                      background: 'linear-gradient(135deg, var(--primary-light), var(--accent-light))',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'var(--primary-color)'
                    }}>
                      <HeartHandshake size={48} style={{ opacity: 0.7 }} />
                    </div>
                  )}
                  <span className="badge badge-available" style={{ position: 'absolute', top: '12px', right: '12px' }}>
                    Available
                  </span>
                </div>

                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <h3 style={{ fontSize: '1.25rem', margin: 0 }}>{med.name}</h3>
                  
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.35rem', 
                    fontSize: '0.9rem',
                    padding: '0.2rem 0.5rem',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: expiry.bg,
                    color: expiry.color,
                    width: 'fit-content'
                  }}>
                    <Calendar size={14} />
                    <span style={{ fontWeight: expiry.bg !== 'transparent' ? 600 : 400 }}>
                      {expiry.text}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                    <Package size={14} />
                    <span>Quantity: {med.quantity}</span>
                  </div>

                  {med.description && (
                    <p style={{ 
                      color: 'var(--text-secondary)', 
                      fontSize: '0.9rem',
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      marginTop: '0.5rem',
                      marginBottom: '1rem',
                      minHeight: '4.2em'
                    }}>
                      {med.description}
                    </p>
                  )}

                  <div style={{ 
                    marginTop: 'auto', 
                    paddingTop: '1rem', 
                    borderTop: '1px solid var(--border-glass)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.75rem'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      <User size={14} />
                      <span>Donated by: {med.donor?.name || 'Anonymous'}</span>
                    </div>

                    <button 
                      onClick={() => handleClaim(med._id, med.name)} 
                      className="btn btn-primary"
                      style={{ width: '100%', minHeight: '40px' }}
                    >
                      Claim Medicine
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Claim Success Overlay Modal */}
      {claimedMed && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.7)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1100,
          padding: '1.5rem'
        }}>
          <div className="glass-card" style={{
            width: '100%',
            maxWidth: '500px',
            backgroundColor: 'var(--bg-secondary)',
            textAlign: 'center',
            position: 'relative',
            padding: '2.5rem',
            animation: 'slideUp 0.3s ease'
          }}>
            <button 
              onClick={() => setClaimedMed(null)}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--text-muted)'
              }}
              aria-label="Close modal"
            >
              <X size={20} />
            </button>

            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              backgroundColor: 'var(--success-bg)',
              color: 'var(--success-color)',
              marginBottom: '1.25rem'
            }}>
              <CheckCircle2 size={32} />
            </div>

            <h2 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>Claimed Successfully!</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
              You have claimed <strong>{claimedMed.name}</strong>. A secret verification code has been generated.
            </p>

            <div style={{
              backgroundColor: 'var(--bg-primary)',
              border: '1px dashed var(--border-glass)',
              borderRadius: 'var(--radius-md)',
              padding: '1rem',
              marginBottom: '1.5rem',
              position: 'relative'
            }}>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.25rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Secret Verification Code
              </p>
              <div style={{ 
                fontSize: '2rem', 
                fontWeight: 800, 
                color: 'var(--primary-color)',
                fontFamily: 'monospace',
                letterSpacing: '0.1em',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '1rem',
                margin: '0.5rem 0'
              }}>
                {secretCode}
                <button 
                  onClick={copyToClipboard}
                  className="btn btn-secondary"
                  style={{
                    minHeight: '36px',
                    width: '36px',
                    padding: 0,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  title="Copy to Clipboard"
                >
                  <Copy size={16} />
                </button>
              </div>
              {copied && <span style={{ color: 'var(--success-color)', fontSize: '0.8rem', fontWeight: 600 }}>Copied to clipboard!</span>}
            </div>

            <div style={{ 
              textAlign: 'left', 
              fontSize: '0.85rem', 
              backgroundColor: 'var(--primary-light)',
              padding: '1rem',
              borderRadius: 'var(--radius-md)',
              lineHeight: '1.45',
              color: 'var(--primary-color)'
            }}>
              <h4 style={{ color: 'var(--primary-color)', marginBottom: '0.25rem', fontSize: '0.9rem' }}>Important Handover Instructions:</h4>
              <ol style={{ paddingLeft: '1.2rem' }}>
                <li>Copy the secret code above.</li>
                <li>Share this code with the donor (e.g. verbally, or via SMS/WhatsApp) when you pick up the medicine.</li>
                <li>The donor will enter this code in their dashboard to confirm the secure handover.</li>
              </ol>
            </div>

            <button 
              onClick={() => setClaimedMed(null)} 
              className="btn btn-primary"
              style={{ width: '100%', marginTop: '1.5rem' }}
            >
              Done, Go to My Dashboard
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Browse;
