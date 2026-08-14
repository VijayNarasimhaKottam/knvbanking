import { useState } from 'react';

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="fade-in">
      <div className="contact-hero" style={{ background: 'linear-gradient(135deg, var(--color-primary-dark), var(--color-primary))', color: 'white', padding: '4rem 2rem', textAlign: 'center' }}>
        <div className="contact-hero-content" style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>We're here to help</h1>
          <p style={{ opacity: 0.8, fontSize: '1.1rem' }}>Have a question or need assistance? Reach out to our dedicated support team.</p>
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '3rem auto', padding: '0 2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', marginBottom: '4rem' }}>
          <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>📞</div>
            <h3 style={{ marginBottom: '0.5rem' }}>Call Us 24/7</h3>
            <p style={{ color: 'var(--color-text-secondary)', marginBottom: '1rem', fontSize: '0.9rem' }}>For urgent queries, block cards, or general banking assistance.</p>
            <a href="tel:18001234567" className="btn btn-outline btn-sm">1800 123 4567</a>
          </div>

          <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>✉️</div>
            <h3 style={{ marginBottom: '0.5rem' }}>Email Support</h3>
            <p style={{ color: 'var(--color-text-secondary)', marginBottom: '1rem', fontSize: '0.9rem' }}>Drop us an email. We typically respond within 24 hours.</p>
            <a href="mailto:support@kvnbank.com" className="btn btn-outline btn-sm">support@kvnbank.com</a>
          </div>

          <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>📍</div>
            <h3 style={{ marginBottom: '0.5rem' }}>Visit Branch</h3>
            <p style={{ color: 'var(--color-text-secondary)', marginBottom: '1rem', fontSize: '0.9rem' }}>Find your nearest KVN Bank branch or ATM location.</p>
            <a href="/locator" className="btn btn-outline btn-sm">Branch Locator</a>
          </div>
        </div>

        <div className="card" style={{ maxWidth: '700px', margin: '0 auto', padding: '2.5rem' }}>
          <h2 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>Send Us a Message</h2>
          {submitted ? (
            <div style={{ textAlign: 'center', padding: '2rem 0' }}>
              <div style={{ fontSize: '3rem', color: 'var(--color-success)', marginBottom: '1rem' }}>✓</div>
              <h3>Thank You!</h3>
              <p style={{ color: 'var(--color-text-secondary)' }}>Your message has been sent successfully. We will get back to you soon.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Your Name</label>
                <input
                  type="text"
                  className="form-control"
                  required
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Email Address</label>
                <input
                  type="email"
                  className="form-control"
                  required
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Subject</label>
                <input
                  type="text"
                  className="form-control"
                  required
                  placeholder="How can we help?"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                />
              </div>
              <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Message</label>
                <textarea
                  className="form-control"
                  rows="5"
                  required
                  placeholder="Write your query here..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}
                ></textarea>
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.85rem' }}>
                Submit Query
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
