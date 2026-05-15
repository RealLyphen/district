import React, { useState, useEffect } from 'react';
import { data } from './data';
import './review.css';

function Review({ id }) {
  const [booking, setBooking] = useState(null);
  const [match, setMatch] = useState(null);
  
  const [feeOpen, setFeeOpen] = useState(false);
  const [paymentOverlayOpen, setPaymentOverlayOpen] = useState(false);
  const [isPaying, setIsPaying] = useState(false);
  const [showQR, setShowQR] = useState(false);
  
  const [payMethod, setPayMethod] = useState({
    name: 'Google Pay UPI',
    logo: 'https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/google-pay-icon.png'
  });

  useEffect(() => {
    const bookingStr = localStorage.getItem('bookingData');
    if (bookingStr) {
      const b = JSON.parse(bookingStr);
      setBooking(b);
      const m = data.matchesData.find(match => match.id === b.matchId);
      setMatch(m || data.matchesData[0]);
    }
  }, []);

  const handlePay = () => {
    setIsPaying(true);
    setTimeout(() => {
      setIsPaying(false);
      
      const upiParams = `pa=9355918501@jio&pn=Ankit%20Kumar&am=${grandTotal}&cu=INR`;
      let upiUrl = `upi://pay?${upiParams}`;
      
      if (payMethod.name === "Google Pay UPI") {
        upiUrl = `tez://upi/pay?${upiParams}`;
      } else if (payMethod.name === "PhonePe UPI") {
        upiUrl = `phonepe://pay?${upiParams}`;
      } else if (payMethod.name === "Paytm UPI") {
        upiUrl = `paytmmp://pay?${upiParams}`;
      }

      window.location.href = upiUrl;
    }, 800);
  };

  const selectPayMethod = (name, logo) => {
    setPayMethod({ name, logo });
    setPaymentOverlayOpen(false);
  };

  if (!booking || !match) return <div style={{ color: 'white', padding: '20px' }}>Loading...</div>;

  const baseFee = booking.totalAmount * 0.03;
  const convenienceFee = Math.round(baseFee * 0.82);
  const gst = Math.round(baseFee * 0.18);
  const totalFee = convenienceFee + gst;
  const grandTotal = booking.totalAmount + totalFee;

  return (
    <div className="app-container review-page">
      <header className="top-header">
        <a href={`/?route=seats&id=${match.id}`} onClick={(e) => {
            e.preventDefault();
            window.history.pushState({}, '', `/?route=seats&id=${match.id}`);
            window.dispatchEvent(new Event('popstate'));
        }} className="back-btn">
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
        </a>
        <h1 className="header-title">Review your booking</h1>
      </header>

      <div className="success-chip anim-card" style={{ '--i': 0 }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#34C759" strokeWidth="3" strokeLinecap="round">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
        <span>Seats reserved for you — complete payment to confirm</span>
      </div>

      <div className="match-hero-card anim-card" style={{ '--i': 1 }}>
        <div className="hero-gradient-bg" style={match.heroBg ? { backgroundImage: `url(${match.heroBg})` } : {}}></div>
        <div className="hero-inner">
          <div className="hero-teams">
            <div className="hero-team">
              <img className="team-logo" src={match.team1.logo} alt={match.team1.short} />
              <span className="team-short">{match.team1.short}</span>
            </div>
            <div className="hero-vs">VS</div>
            <div className="hero-team">
              <img className="team-logo" src={match.team2.logo} alt={match.team2.short} />
              <span className="team-short">{match.team2.short}</span>
            </div>
          </div>
          <div className="hero-match-label">TATA IPL 2026 · {match.matchNumber}</div>

          <div className="hero-details-grid">
            <div className="hdg-item">
              <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="#999" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
              <span>{match.date.dayStr}, {match.date.dayNum} {match.date.month} · {match.time}</span>
            </div>
            <div className="hdg-item">
              <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="#999" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
              <span>{match.venue}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="card ticket-card anim-card" style={{ '--i': 2 }}>
        <div className="ticket-header-label">YOUR TICKETS</div>
        <div className="divider" style={{ marginTop: '10px' }}></div>

        <div className="t-row">
          <div className="t-seat-info">{booking.seatsCount} x {booking.sectionName}</div>
          <div className="t-price-col">
            <div className="t-price">₹{booking.totalAmount.toLocaleString('en-IN')}</div>
          </div>
        </div>

        <div className="perforation"></div>

        <div className="t-mticket">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
          </svg>
          <span>M-Ticket — Entry via QR code on your phone</span>
        </div>
      </div>

      {booking.seatsCount >= 2 && (
        <div className="discount-applied anim-card" style={{ '--i': 3, display: 'flex' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#34C759" strokeWidth="2.5" strokeLinecap="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          <span>🎽 Free official fan jersey with 2+ tickets — <strong>Applied!</strong></span>
        </div>
      )}

      <div className="section-divider anim-card" style={{ '--i': 4 }}>
        <span className="line"></span>
        <span className="text">PAYMENT SUMMARY</span>
        <span className="line"></span>
      </div>

      <div className="card payment-card anim-card" style={{ '--i': 4 }}>
        <div className="pay-row">
          <div className="pay-label">Order amount</div>
          <div className="pay-val">₹{booking.totalAmount.toLocaleString('en-IN')}</div>
        </div>
        
        <div className="pay-row sub fee-toggle" onClick={() => setFeeOpen(!feeOpen)}>
          <div className="pay-label">Fees & charges <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" style={{ transition: 'transform 0.3s ease', transform: feeOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </div>
          <div className="pay-val">₹{totalFee.toLocaleString('en-IN')}</div>
        </div>
        <div className={`fee-breakdown ${feeOpen ? 'open' : ''}`}>
          <div className="fb-row"><span>Convenience fee</span><span>₹{convenienceFee.toLocaleString('en-IN')}</span></div>
          <div className="fb-row"><span>GST (18%)</span><span>₹{gst.toLocaleString('en-IN')}</span></div>
        </div>

        <div className="divider"></div>

        <div className="pay-row total">
          <div className="pay-label">Grand Total</div>
          <div className="pay-val">₹{grandTotal.toLocaleString('en-IN')}</div>
        </div>
      </div>

      <div className="trust-strip anim-card" style={{ '--i': 5 }}>
        <div className="trust-pill"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#34C759" strokeWidth="2.5"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg> 256-bit Encrypted</div>
        <div className="trust-pill"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#60A5FA" strokeWidth="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg> PCI Compliant</div>
        <div className="trust-pill"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#F8CB64" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg> 100% Refund</div>
      </div>

      <div className="section-divider anim-card" style={{ '--i': 6 }}>
        <span className="line"></span>
        <span className="text">INVOICE DETAILS</span>
        <span className="line"></span>
      </div>

      <div className="card invoice-card anim-card" style={{ '--i': 6 }}>
        <div className="inv-row">
          <div className="inv-left">
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" className="user-icon">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
            <div className="inv-details">
              <div className="inv-name">{booking.userData.name}</div>
              <div className="inv-contact">{booking.userData.email}</div>
              <div className="inv-contact">{booking.userData.phone}</div>
            </div>
          </div>
        </div>
        <div className="inv-footer">
          This information will be used for your invoice and M-Ticket delivery.
        </div>
      </div>

      <div className="bottom-spacer"></div>

      <div className="bottom-pay-bar">
        <div className="bp-main">
          <div className="bp-left" onClick={() => setPaymentOverlayOpen(true)}>
            <div className="pay-using">
              {payMethod.logo && <img className="pay-logo-sm" src={payMethod.logo} alt="Logo" />}
              Pay using <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"></polyline></svg>
            </div>
            <div className="pay-method">{payMethod.name}</div>
          </div>
          <button className="btn-pay-now" onClick={handlePay} style={{ pointerEvents: isPaying ? 'none' : 'auto' }}>
            <div className="btn-pay-left">
              <span className="amt">₹{grandTotal.toLocaleString('en-IN')}</span>
              <span className="lbl">Total</span>
            </div>
            <div className="btn-pay-right">
              {isPaying ? <div className="btn-spinner"></div> : "Pay now >"}
            </div>
          </button>
        </div>
      </div>

      <div className={`payment-overlay ${paymentOverlayOpen ? 'active' : ''}`}>
        <div className="payment-overlay-header">
          <button className="close-btn" onClick={() => setPaymentOverlayOpen(false)}>
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
          </button>
          <h2>Select Payment Method</h2>
        </div>

        <div className="payment-options-scroll">
          <div className="pay-section-title">Pay by any UPI app</div>

          <div className="card pay-list-card">
            <div className="pay-list-item" onClick={() => selectPayMethod("Google Pay UPI", "https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/google-pay-icon.png")}>
              <div className="pay-item-left">
                <img className="pay-logo" src="https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/google-pay-icon.png" alt="Google Pay" />
                <span>Google Pay UPI</span>
              </div>
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#666" strokeWidth="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
            </div>
            <div className="divider"></div>
            <div className="pay-list-item" onClick={() => selectPayMethod("PhonePe UPI", "https://e7.pngegg.com/pngimages/332/615/png-clipart-phonepe-india-unified-payments-interface-india-purple-violet.png")}>
              <div className="pay-item-left">
                <img className="pay-logo" src="https://e7.pngegg.com/pngimages/332/615/png-clipart-phonepe-india-unified-payments-interface-india-purple-violet.png" alt="PhonePe" />
                <span>PhonePe UPI</span>
              </div>
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#666" strokeWidth="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
            </div>
            <div className="divider"></div>
            <div className="pay-list-item" onClick={() => selectPayMethod("Paytm UPI", "https://stagvinecip01.blob.core.windows.net/stc-gvine-blob-centralindia-prod-001-django/images/company/97078ceb-517d-4e92-96b2-5bf65bf15f95/profile/20231121070850.png")}>
              <div className="pay-item-left">
                <img className="pay-logo" src="https://stagvinecip01.blob.core.windows.net/stc-gvine-blob-centralindia-prod-001-django/images/company/97078ceb-517d-4e92-96b2-5bf65bf15f95/profile/20231121070850.png" alt="Paytm" />
                <span>Paytm UPI</span>
              </div>
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#666" strokeWidth="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
            </div>
            <div className="divider"></div>
            <div className="pay-list-item" onClick={() => selectPayMethod("Other UPI Apps", "")}>
              <div className="pay-item-left">
                <div className="pay-icon-upi">
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="white" strokeWidth="1.5">
                    <rect x="2" y="5" width="20" height="14" rx="3"></rect>
                    <path d="M7 15l3-6 3 6"></path>
                    <path d="M15 9v6"></path>
                  </svg>
                </div>
                <span>Other UPI Apps</span>
              </div>
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#666" strokeWidth="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

export default Review;
