import { useState } from 'react';

export default function Locator() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');

  const locations = [
    { id: 1, name: 'Connaught Place Branch', type: 'branch', address: 'Block A, Connaught Place, New Delhi - 110001', phone: '011-23410000', timing: '10:00 AM - 4:00 PM' },
    { id: 2, name: 'MG Road Branch & ATM', type: 'branch', address: 'MG Road, Sector 25, Gurugram, Haryana - 122002', phone: '0124-4567890', timing: '10:00 AM - 4:00 PM' },
    { id: 3, name: 'Indiranagar 100ft Rd ATM', type: 'atm', address: '100 Feet Rd, Indiranagar, Bengaluru, Karnataka - 560038', phone: '24/7 ATM Service', timing: '24 Hours' },
    { id: 4, name: 'Bandra West Branch', type: 'branch', address: 'Linking Road, Bandra West, Mumbai, Maharashtra - 400050', phone: '022-67890000', timing: '10:00 AM - 4:00 PM' },
    { id: 5, name: 'Cyber City ATM', type: 'atm', address: 'DLF Cyber City, Tower B, Gurugram, Haryana - 122002', phone: '24/7 ATM Service', timing: '24 Hours' },
    { id: 6, name: 'Anna Salai Branch & ATM', type: 'branch', address: 'Anna Salai, Thousand Lights, Chennai, Tamil Nadu - 600006', phone: '044-28500000', timing: '10:00 AM - 4:00 PM' },
  ];

  const filteredLocations = locations.filter(loc => {
    const matchesFilter = filter === 'all' || loc.type === filter;
    const matchesSearch = loc.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          loc.address.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="fade-in" style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 className="page-title">ATM & Branch Locator</h1>
        <p style={{ color: 'var(--color-text-secondary)' }}>Find your nearest KVN Bank branches and 24/7 ATMs across India.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '350px 1fr', gap: '2rem', minHeight: '600px' }}>
        {/* Search and List Column */}
        <div style={{ background: 'var(--color-surface)', padding: '1.5rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)' }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <input
              type="text"
              className="form-control"
              placeholder="Search by city, area or pincode..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ width: '100%', padding: '0.75rem', marginBottom: '1rem' }}
            />

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button 
                className={`btn btn-sm ${filter === 'all' ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => setFilter('all')}
              >
                All
              </button>
              <button 
                className={`btn btn-sm ${filter === 'branch' ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => setFilter('branch')}
              >
                Branches
              </button>
              <button 
                className={`btn btn-sm ${filter === 'atm' ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => setFilter('atm')}
              >
                ATMs
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '480px', overflowY: 'auto' }}>
            {filteredLocations.map(loc => (
              <div key={loc.id} style={{ padding: '1rem', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', background: 'white' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <h4 style={{ margin: 0, fontSize: '1rem' }}>{loc.name}</h4>
                  <span style={{ fontSize: '0.75rem', padding: '2px 8px', borderRadius: '12px', background: loc.type === 'branch' ? 'var(--color-primary-light)' : 'var(--color-success-light)', color: loc.type === 'branch' ? 'var(--color-primary)' : 'var(--color-success)' }}>
                    {loc.type.toUpperCase()}
                  </span>
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', margin: '0 0 0.5rem 0' }}>{loc.address}</p>
                <div style={{ fontSize: '0.8rem', color: 'var(--color-text-tertiary)' }}>
                  <span>📞 {loc.phone}</span> | <span>⏰ {loc.timing}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Map Preview Column */}
        <div style={{ background: 'var(--color-surface-alt)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', textAlign: 'center' }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🗺️</div>
          <h3>Interactive Map View</h3>
          <p style={{ color: 'var(--color-text-secondary)', maxWidth: '400px' }}>
            Showing {filteredLocations.length} locations matching your search criteria. Select a location on the left to view exact directions.
          </p>
        </div>
      </div>
    </div>
  );
}
