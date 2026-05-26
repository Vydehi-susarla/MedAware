import React, { useState, useEffect } from 'react';
import { api } from '../utils/api';
import { Calendar, Package, User, Check, X, ShieldAlert, Award, RefreshCw, Key } from 'lucide-react';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('donations'); // 'donations' or 'claims'
  const [donations, setDonations] = useState([]);
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Verification code inputs state mapping: medicineId -> inputCode
  const [verificationCodes, setVerificationCodes] = useState({});

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError('');
      const donationData = await api.getMyDonations();
      const claimData = await api.getMyClaims();
      setDonations(donationData);
      setClaims(claimData);
    } catch (err) {
      setError(err.message || 'Failed to fetch dashboard records');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (id) => {
    const code = verificationCodes[id];
    if (!code || !code.trim()) {
      alert('Please enter the verification code first');
      return;
    }

    try {
      const result = await api.verifyHandover(id, code);
      alert(result.message || 'Handover verified successfully!');
      // Clear input
      setVerificationCodes(prev => ({ ...prev, [id]: '' }));
      // Refresh
      fetchDashboardData();
    } catch (err) {
      alert(err.message || 'Verification failed. Please double check the code.');
    }
  };

  const handleCancelClaim = async (id, medName) => {
    if (!window.confirm(`Are you sure you want to cancel the claim for "${medName}"? This medicine will become available for others to claim.`)) return;

    try {
      await api.cancelClaim(id);
      fetchDashboardData();
    } catch (err) {
      alert(err.message || 'Failed to cancel claim');
    }
  };

  const handleCodeInputChange = (id, val) => {
    setVerificationCodes(prev => ({ ...prev, [id]: val }));
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="container">
      <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2.25rem', marginBottom: '0.25rem' }}>Your Dashboard</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Manage your medicine donations, check claims status, and verify secure handovers.</p>
        </div>
        <button onClick={fetchDashboardData} className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', minHeight: '40px' }}>
          <RefreshCw size={16} /> Refresh
        </button>
      </header>

      {error && (
        <div className="glass-card" style={{ backgroundColor: 'var(--error-bg)', color: 'var(--error-color)', padding: '1rem', marginBottom: '1.5rem', fontWeight: 500 }}>
          {error}
        </div>
      )}

      {/* Tabs */}
      <div className="dashboard-tabs">
        <button 
          className={`tab-btn ${activeTab === 'donations' ? 'active' : ''}`}
          onClick={() => setActiveTab('donations')}
        >
          My Donations ({donations.length})
        </button>
        <button 
          className={`tab-btn ${activeTab === 'claims' ? 'active' : ''}`}
          onClick={() => setActiveTab('claims')}
        >
          My Claims ({claims.length})
        </button>
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
          <p style={{ color: 'var(--text-secondary)' }}>Loading dashboard...</p>
        </div>
      ) : activeTab === 'donations' ? (
        /* DONATIONS TAB */
        donations.length === 0 ? (
          <div className="glass-card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
            <Award size={48} style={{ color: 'var(--text-muted)', marginBottom: '1rem' }} />
            <h3>No Donations Yet</h3>
            <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem', marginBottom: '1.5rem' }}>
              You haven't listed any medicines for donation yet. Be a part of the solution!
            </p>
            <a href="/donate" className="btn btn-primary">Donate a Medicine</a>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {donations.map((med) => (
              <div key={med._id} className="glass-card" style={{ display: 'flex', flexDirection: 'row', gap: '1.5rem', flexWrap: 'wrap' }}>
                <div style={{ width: '100px', height: '100px', borderRadius: 'var(--radius-md)', overflow: 'hidden', backgroundColor: 'var(--bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {med.image ? (
                    <img src={med.image} alt={med.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <Package size={36} style={{ color: 'var(--primary-color)', opacity: 0.7 }} />
                  )}
                </div>

                <div style={{ flex: 1, minWidth: '250px', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                    <h3 style={{ fontSize: '1.25rem', margin: 0 }}>{med.name}</h3>
                    <span className={`badge ${
                      med.status === 'Available' ? 'badge-available' : 
                      med.status === 'Claimed' ? 'badge-claimed' : 'badge-completed'
                    }`}>
                      {med.status}
                    </span>
                  </div>
                  
                  <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                    <span>Quantity: <strong>{med.quantity}</strong></span>
                    <span>Expiry: <strong>{formatDate(med.expiryDate)}</strong></span>
                  </div>

                  {med.description && (
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>{med.description}</p>
                  )}
                </div>

                <div style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  justifyContent: 'center',
                  minWidth: '280px',
                  paddingLeft: '1.5rem',
                  borderLeft: '1px solid var(--border-glass)',
                  gap: '0.75rem'
                }}>
                  {med.status === 'Available' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', width: '100%' }}>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>This medicine is listed and waiting for someone to claim it.</p>
                    </div>
                  )}

                  {med.status === 'Claimed' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.50rem', width: '100%' }}>
                      <div style={{ fontSize: '0.85rem', backgroundColor: 'var(--warning-bg)', color: 'var(--warning-color)', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-sm)', marginBottom: '0.25rem', display: 'flex', gap: '0.35rem', alignItems: 'center' }}>
                        <ShieldAlert size={16} />
                        <span>Handover pending verification</span>
                      </div>
                      
                      {med.claimant && (
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                          Claimed by: <strong>{med.claimant.name}</strong> ({med.claimant.email})
                        </div>
                      )}

                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <input
                          type="text"
                          placeholder="Enter secret code"
                          value={verificationCodes[med._id] || ''}
                          onChange={(e) => handleCodeInputChange(med._id, e.target.value)}
                          style={{
                            minHeight: '40px',
                            padding: '0.5rem 0.75rem',
                            fontSize: '0.9rem',
                            textTransform: 'uppercase',
                            fontFamily: 'monospace',
                            flex: 1
                          }}
                        />
                        <button 
                          onClick={() => handleVerifyCode(med._id)} 
                          className="btn btn-accent"
                          style={{ minHeight: '40px', padding: '0 1rem' }}
                        >
                          Verify Handover
                        </button>
                      </div>
                      
                      <button 
                        onClick={() => handleCancelClaim(med._id, med.name)}
                        className="btn btn-secondary"
                        style={{ minHeight: '36px', fontSize: '0.8rem', color: 'var(--error-color)', borderColor: 'rgba(239, 68, 68, 0.2)' }}
                      >
                        Cancel Claim
                      </button>
                    </div>
                  )}

                  {med.status === 'Completed' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--success-color)', fontWeight: 600, fontSize: '0.9rem' }}>
                        <Check size={18} /> Handover Completed
                      </div>
                      {med.claimant && (
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                          Received by: {med.claimant.name} ({med.claimant.email})
                        </p>
                      )}
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        Verified on: {formatDate(med.createdAt)}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        /* CLAIMS TAB */
        claims.length === 0 ? (
          <div className="glass-card" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
            <Package size={48} style={{ color: 'var(--text-muted)', marginBottom: '1rem' }} />
            <h3>No Claims Yet</h3>
            <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem', marginBottom: '1.5rem' }}>
              You haven't claimed any medicines yet. Browse available medicines to claim.
            </p>
            <a href="/" className="btn btn-primary">Browse Medicines</a>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {claims.map((med) => (
              <div key={med._id} className="glass-card" style={{ display: 'flex', flexDirection: 'row', gap: '1.5rem', flexWrap: 'wrap' }}>
                <div style={{ width: '100px', height: '100px', borderRadius: 'var(--radius-md)', overflow: 'hidden', backgroundColor: 'var(--bg-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {med.image ? (
                    <img src={med.image} alt={med.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <Package size={36} style={{ color: 'var(--accent-color)', opacity: 0.7 }} />
                  )}
                </div>

                <div style={{ flex: 1, minWidth: '250px', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                    <h3 style={{ fontSize: '1.25rem', margin: 0 }}>{med.name}</h3>
                    <span className={`badge ${med.status === 'Claimed' ? 'badge-claimed' : 'badge-completed'}`}>
                      {med.status}
                    </span>
                  </div>
                  
                  <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                    <span>Quantity: <strong>{med.quantity}</strong></span>
                    <span>Expiry: <strong>{formatDate(med.expiryDate)}</strong></span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                    <User size={14} />
                    <span>Donor: <strong>{med.donor?.name || 'Anonymous'}</strong> ({med.donor?.email})</span>
                  </div>
                </div>

                <div style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  justifyContent: 'center',
                  minWidth: '280px',
                  paddingLeft: '1.5rem',
                  borderLeft: '1px solid var(--border-glass)',
                  gap: '0.75rem'
                }}>
                  {med.status === 'Claimed' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', width: '100%' }}>
                      <div style={{ 
                        backgroundColor: 'var(--primary-light)', 
                        border: '1px dashed var(--primary-color)',
                        borderRadius: 'var(--radius-md)', 
                        padding: '0.75rem 1rem',
                        textAlign: 'center'
                      }}>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase' }}>
                          Handover Secret Code
                        </span>
                        <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary-color)', fontFamily: 'monospace', letterSpacing: '0.05em' }}>
                          {med.secretCode}
                        </span>
                      </div>
                      
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: '1.3' }}>
                        Provide this code to the donor ({med.donor?.name}) when you receive the medicine.
                      </p>

                      <button 
                        onClick={() => handleCancelClaim(med._id, med.name)} 
                        className="btn btn-secondary"
                        style={{ minHeight: '36px', fontSize: '0.8rem', color: 'var(--error-color)', borderColor: 'rgba(239, 68, 68, 0.2)' }}
                      >
                        Cancel Claim
                      </button>
                    </div>
                  )}

                  {med.status === 'Completed' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--success-color)', fontWeight: 600, fontSize: '0.9rem' }}>
                        <Check size={18} /> Claim Completed
                      </div>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        You successfully received this medicine.
                      </p>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        Verified on: {formatDate(med.createdAt)}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
};

export default Dashboard;
