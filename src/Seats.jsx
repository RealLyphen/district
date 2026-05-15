import React, { useState, useEffect } from 'react';
import { data } from './data';
import './seats.css';

function Seats({ id }) {
  const match = data.matchesData.find(m => m.id === id);
  const [liveViewers, setLiveViewers] = useState(2400 + Math.floor(Math.random() * 800));
  
  const [activeSection, setActiveSection] = useState(null);
  const [toastVisible, setToastVisible] = useState(false);
  const [overlayOpen, setOverlayOpen] = useState(false);
  
  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  
  const [reserving, setReserving] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [processing, setProcessing] = useState(false);

  const [userName, setUserName] = useState('');
  const [userPhone, setUserPhone] = useState('');
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveViewers(prev => Math.max(1800, prev + Math.floor(Math.random() * 18) - 5));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Handle outside click for toast
  useEffect(() => {
    const handleClick = (e) => {
      // Don't clear if overlay or details sheet is open
      if (document.getElementById('seatOverlay')?.classList.contains('active')) return;
      if (document.querySelector('.details-sheet')?.classList.contains('active')) return;

      if (!e.target.closest('.stadium-svg') && !e.target.closest('.section-toast')) {
        setToastVisible(false);
        setActiveSection(null);
      }
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  const generateSeats = () => {
    const total = 144;
    const booked = Math.floor(144 * 0.2);
    let newSeats = Array(total).fill('available');
    let bookedAdded = 0;
    while (bookedAdded < booked) {
      let idx = Math.floor(Math.random() * total);
      let block = 6 + Math.floor(Math.random() * 10);
      for(let i = 0; i < block && bookedAdded < booked; i++) {
        let p = (idx + i) % total;
        if(newSeats[p] === 'available') {
          newSeats[p] = 'booked';
          bookedAdded++;
        }
      }
    }
    
    return newSeats.map((status, index) => ({
      id: index,
      row: Math.floor(index / 12),
      col: index % 12,
      status
    }));
  };

  const handleSectionClick = (e, name, price) => {
    e.stopPropagation();
    setActiveSection({ name, price });
    setToastVisible(true);
  };

  const handlePickSeats = () => {
    setSeats(generateSeats());
    setSelectedSeats([]);
    setOverlayOpen(true);
  };

  const handleSeatClick = (seat) => {
    if (seat.status === 'booked') return;
    
    const isSelected = selectedSeats.includes(seat.id);
    if (isSelected) {
      setSelectedSeats(selectedSeats.filter(id => id !== seat.id));
    } else {
      setSelectedSeats([...selectedSeats, seat.id]);
    }
  };

  const handleProceed = () => {
    setReserving(true);
    setTimeout(() => {
      setReserving(false);
      setDetailsOpen(true);
    }, 2000);
  };

  const handleConfirm = () => {
    if (!userName.trim()) return alert("Please enter your name.");
    if (userPhone.length < 10) return alert("Please enter a valid 10-digit mobile number.");
    if (!userEmail.includes('@')) return alert("Please enter a valid email address.");

    setProcessing(true);
    
    const bookingData = {
      matchId: id,
      sectionName: activeSection.name,
      sectionPrice: activeSection.price,
      seatsCount: selectedSeats.length,
      totalAmount: selectedSeats.length * activeSection.price,
      userData: { name: userName, phone: '+91 ' + userPhone, email: userEmail }
    };
    localStorage.setItem('bookingData', JSON.stringify(bookingData));
    
    setTimeout(() => {
      window.history.pushState({}, '', `/?route=review&id=${id}`);
      window.dispatchEvent(new Event('popstate'));
    }, 3000);
  };

  if (!match) return <div>Match not found</div>;

  const venueCity = match.venue.split(',').pop().trim();
  const totalAmount = selectedSeats.length * (activeSection ? activeSection.price : 0);

  return (
    <div className="app-container seats-page">
      <header className="top-header">
        <a href={`/?id=${id}`} className="back-btn" onClick={(e) => {
          e.preventDefault();
          window.history.pushState({}, '', `/?id=${id}`);
          window.dispatchEvent(new Event('popstate'));
        }}>
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
        </a>
        <div className="header-titles">
          <div className="h-title" id="dynSeatTitle">TATA IPL 2026: {match.matchNumber} | {match.team1.short} vs {match.team2.short}</div>
          <div className="h-subtitle" id="dynSeatSubtitle">{match.date.dayStr}, {match.date.dayNum} {match.date.month}, {match.time} | {venueCity}</div>
        </div>
      </header>

      <div className="live-viewers-banner">
        <span className="pulse-dot"></span>
        <span id="liveViewers">{liveViewers.toLocaleString()}</span> people are viewing this match right now
      </div>

      <div className="stadium-section">
        <h1 className="section-heading">Select your stand</h1>
        <p className="section-sub">Tap on a highlighted area to pick seats</p>

        <div className="stadium-container">
          <svg className="stadium-svg" viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg">
            {/* Outer Ring */}
            <path className="std-section booked" d="M 145 55 A 230 230 0 0 1 355 55 L 325 95 A 180 180 0 0 0 175 95 Z"><title>North Central Third Floor — Sold Out</title></path>
            <path className="std-section booked" d="M 355 55 A 230 230 0 0 1 445 145 L 405 175 A 180 180 0 0 0 325 95 Z"><title>North East Third Floor — Sold Out</title></path>
            <path className={`std-section avail tier-upper ${activeSection?.name === 'Upper Tier — East' ? 'active-section' : ''}`} onClick={(e) => handleSectionClick(e, "Upper Tier — East", 1599)} d="M 445 145 A 230 230 0 0 1 445 355 L 405 325 A 180 180 0 0 0 405 175 Z"><title>East Stand Second Floor — ₹1,599</title></path>
            <path className="std-section booked" d="M 445 355 A 230 230 0 0 1 355 445 L 325 405 A 180 180 0 0 0 405 325 Z"><title>South East Third Floor — Sold Out</title></path>
            <path className="std-section booked" d="M 355 445 A 230 230 0 0 1 145 445 L 175 405 A 180 180 0 0 0 325 405 Z"><title>Old Club House Corporate Boxes — Sold Out</title></path>
            <path className={`std-section avail tier-general ${activeSection?.name === 'Hill B — South West' ? 'active-section' : ''}`} onClick={(e) => handleSectionClick(e, "Hill B — South West", 999)} d="M 145 445 A 230 230 0 0 1 55 355 L 95 325 A 180 180 0 0 0 175 405 Z"><title>Hill B South West — ₹999</title></path>
            <path className="std-section booked" d="M 55 355 A 230 230 0 0 1 55 145 L 95 175 A 180 180 0 0 0 95 325 Z"><title>West Stand Third Floor — Sold Out</title></path>
            <path className="std-section booked" d="M 55 145 A 230 230 0 0 1 145 55 L 175 95 A 180 180 0 0 0 95 175 Z"><title>North West Third Floor — Sold Out</title></path>

            {/* Middle Ring */}
            <path className="std-section booked" d="M 175 95 A 180 180 0 0 1 325 95 L 305 130 A 140 140 0 0 0 195 130 Z"><title>North Central Second Floor — Sold Out</title></path>
            <path className="std-section booked" d="M 325 95 A 180 180 0 0 1 405 175 L 370 195 A 140 140 0 0 0 305 130 Z"><title>North East Second Floor — Sold Out</title></path>
            <path className={`std-section avail tier-premium ${activeSection?.name === 'East Stand — First Floor' ? 'active-section' : ''}`} onClick={(e) => handleSectionClick(e, "East Stand — First Floor", 4999)} d="M 405 175 A 180 180 0 0 1 405 325 L 370 305 A 140 140 0 0 0 370 195 Z"><title>East Stand First Floor — ₹4,999</title></path>
            <path className={`std-section avail tier-general ${activeSection?.name === 'Hill A — Super Hospitality' ? 'active-section' : ''}`} onClick={(e) => handleSectionClick(e, "Hill A — Super Hospitality", 999)} d="M 405 325 A 180 180 0 0 1 325 405 L 305 370 A 140 140 0 0 0 370 305 Z"><title>Hill A Super Hospitality — ₹999</title></path>
            <path className="std-section booked" d="M 325 405 A 180 180 0 0 1 175 405 L 195 370 A 140 140 0 0 0 305 370 Z"><title>Old Club House First Floor — Sold Out</title></path>
            <path className="std-section booked" d="M 175 405 A 180 180 0 0 1 95 325 L 130 305 A 140 140 0 0 0 195 370 Z"><title>West Corporate Boxes — Sold Out</title></path>
            <path className={`std-section avail tier-upper ${activeSection?.name === 'West Stand — Second Floor' ? 'active-section' : ''}`} onClick={(e) => handleSectionClick(e, "West Stand — Second Floor", 1599)} d="M 95 325 A 180 180 0 0 1 95 175 L 130 195 A 140 140 0 0 0 130 305 Z"><title>West Stand Second Floor — ₹1,599</title></path>
            <path className={`std-section avail tier-premium-first ${activeSection?.name === 'North West — First Floor Premium' ? 'active-section' : ''}`} onClick={(e) => handleSectionClick(e, "North West — First Floor Premium", 4999)} d="M 95 175 A 180 180 0 0 1 175 95 L 195 130 A 140 140 0 0 0 130 195 Z"><title>North West First Floor Premium — ₹4,999</title></path>

            {/* Inner Ring */}
            <path className="std-section booked" d="M 195 130 A 140 140 0 0 1 305 130 L 290 165 A 100 100 0 0 0 210 165 Z"><title>North Central Ground Floor — Sold Out</title></path>
            <path className={`std-section avail tier-corporate ${activeSection?.name === 'N.E. Ground Floor Premium' ? 'active-section' : ''}`} onClick={(e) => handleSectionClick(e, "N.E. Ground Floor Premium", 6999)} d="M 305 130 A 140 140 0 0 1 370 195 L 335 210 A 100 100 0 0 0 290 165 Z"><title>N.E. Ground Floor Premium — ₹6,999</title></path>
            <path className="std-section booked" d="M 370 195 A 140 140 0 0 1 370 305 L 335 290 A 100 100 0 0 0 335 210 Z"><title>East Stand Ground Floor — Sold Out</title></path>
            <path className="std-section booked" d="M 370 305 A 140 140 0 0 1 305 370 L 290 335 A 100 100 0 0 0 335 290 Z"><title>South East Ground Floor — Sold Out</title></path>
            <path className="std-section booked" d="M 305 370 A 140 140 0 0 1 195 370 L 210 335 A 100 100 0 0 0 290 335 Z"><title>Pavilion Ground Floor — Sold Out</title></path>
            <path className="std-section booked" d="M 195 370 A 140 140 0 0 1 130 305 L 165 290 A 100 100 0 0 0 210 335 Z"><title>DC Lounge — Sold Out</title></path>
            <path className={`std-section avail tier-pavilion ${activeSection?.name === 'West Stand — Ground Floor' ? 'active-section' : ''}`} onClick={(e) => handleSectionClick(e, "West Stand — Ground Floor", 8999)} d="M 130 305 A 140 140 0 0 1 130 195 L 165 210 A 100 100 0 0 0 165 290 Z"><title>West Stand Ground Floor — ₹8,999</title></path>
            <path className={`std-section avail tier-corporate ${activeSection?.name === 'N.W. Ground Floor Premium' ? 'active-section' : ''}`} onClick={(e) => handleSectionClick(e, "N.W. Ground Floor Premium", 6999)} d="M 130 195 A 140 140 0 0 1 195 130 L 210 165 A 100 100 0 0 0 165 210 Z"><title>N.W. Ground Floor Premium — ₹6,999</title></path>

            {/* Pitch (center) */}
            <ellipse cx="250" cy="250" rx="55" ry="55" fill="#1a1a1a" stroke="#333" strokeWidth="1.5"/>
            <rect x="240" y="225" width="20" height="50" rx="3" fill="#2a2a2a" stroke="#444" strokeWidth="0.8"/>
            <text x="250" y="253" textAnchor="middle" fill="#555" fontSize="10" fontWeight="700">PITCH</text>

            <text x="250" y="82" textAnchor="middle" fill="#666" fontSize="7" fontWeight="600">NORTH CENTRAL</text>
            <text x="425" y="253" textAnchor="middle" fill="#fff" fontSize="6.5" fontWeight="700" transform="rotate(90, 425, 253)">EAST 2ND FLOOR</text>
            <text x="75" y="253" textAnchor="middle" fill="#fff" fontSize="6.5" fontWeight="700" transform="rotate(-90, 75, 253)">WEST 3RD FLOOR</text>
            <text x="250" y="425" textAnchor="middle" fill="#666" fontSize="7" fontWeight="600">SOUTH — CLUB HOUSE</text>

            <text className="price-label" x="380" y="250" textAnchor="middle" fill="#fff" fontSize="8" fontWeight="800">₹1,599</text>
            <text className="price-label" x="135" y="250" textAnchor="middle" fill="#fff" fontSize="7" fontWeight="800">₹8,999</text>
            <text className="price-label" x="155" y="155" textAnchor="middle" fill="#fff" fontSize="7" fontWeight="800">₹4,999</text>
            <text className="price-label" x="340" y="175" textAnchor="middle" fill="#fff" fontSize="7" fontWeight="800">₹6,999</text>
            <text className="price-label" x="160" y="345" textAnchor="middle" fill="#fff" fontSize="7" fontWeight="800">₹6,999</text>
            <text className="price-label" x="365" y="250" textAnchor="middle" fill="#fff" fontSize="7" fontWeight="800">₹4,999</text>
            <text className="price-label" x="120" y="370" textAnchor="middle" fill="#fff" fontSize="8" fontWeight="800">₹999</text>
            <text className="price-label" x="370" y="340" textAnchor="middle" fill="#fff" fontSize="8" fontWeight="800">₹999</text>
            <text className="price-label" x="120" y="250" textAnchor="middle" fill="#fff" fontSize="7" fontWeight="800">₹1,599</text>
          </svg>
        </div>

        <div className="map-legend">
          <div className="legend-item"><span className="legend-dot" style={{background:'#FFD700'}}></span> Pavilion ₹8,999</div>
          <div className="legend-item"><span className="legend-dot" style={{background:'#A78BFA'}}></span> Corporate ₹6,999</div>
          <div className="legend-item"><span className="legend-dot" style={{background:'#60A5FA'}}></span> Premium ₹4,999</div>
          <div className="legend-item"><span className="legend-dot" style={{background:'#34D399'}}></span> Upper ₹1,599</div>
          <div className="legend-item"><span className="legend-dot" style={{background:'#FB923C'}}></span> General ₹999</div>
          <div className="legend-item"><span className="legend-dot" style={{background:'#2C2C2C'}}></span> Sold Out</div>
        </div>
      </div>

      <div className={`section-toast ${toastVisible ? 'visible' : ''}`} id="sectionToast">
        <div className="toast-left">
          <div className="toast-name">{activeSection?.name}</div>
          <div className="toast-meta">
            <span className="toast-price">₹{activeSection?.price.toLocaleString()}</span>
            <span className="toast-seats">· {Math.floor(Math.random() * 15) + 3} seats left</span>
          </div>
        </div>
        <button className="toast-btn" onClick={handlePickSeats}>PICK SEATS →</button>
      </div>

      <div className="offer-banner">
        <div className="offer-icon">🎽</div>
        <span>Buy 2 tickets, get an official fan jersey <strong>FREE</strong></span>
      </div>

      <div className="trust-badges">
        <div className="trust-item">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#34C759" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
          <span>100% Secure</span>
        </div>
        <div className="trust-item">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F8CB64" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
          <span>Instant Confirmation</span>
        </div>
        <div className="trust-item">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#E880E8" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
          <span>Official Partner</span>
        </div>
      </div>

      <div className="bottom-spacer"></div>

      {/* Overlay: Seat Grid */}
      <div className={`seat-overlay ${overlayOpen ? 'active' : ''}`} id="seatOverlay">
        <div className="seat-overlay-header">
          <button className="close-btn" onClick={() => setOverlayOpen(false)}>
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
          </button>
          <div className="overlay-title">
            <h2>Select Seats</h2>
            <span className="sub-text">₹{activeSection?.price.toLocaleString()} per seat</span>
          </div>
          <div className="overlay-demand-badge" style={{ display: activeSection?.price >= 4999 ? 'block' : 'none' }}>
            {activeSection?.price >= 8999 ? '🔥 High demand' : '⚡ Filling fast'}
          </div>
        </div>
        
        <div className="seat-legend">
          <div className="s-legend"><div className="seat-icon available"></div> Available</div>
          <div className="s-legend"><div className="seat-icon selected"></div> Selected</div>
          <div className="s-legend"><div className="seat-icon booked"></div> Booked</div>
        </div>

        <div className="seat-grid-container">
          <div className="screen-indicator">⬇ FIELD SIDE ⬇</div>
          <div className="grid-wrapper">
            <div className="row-labels">
              {"ABCDEFGHIJKL".split('').map(l => <div key={l} className="row-label">{l}</div>)}
            </div>
            <div className="seat-grid">
              {seats.map(seat => (
                <div 
                  key={seat.id} 
                  className={`seat ${seat.status} ${selectedSeats.includes(seat.id) ? 'selected' : ''}`}
                  onClick={() => handleSeatClick(seat)}
                >
                  {seat.status === 'available' || selectedSeats.includes(seat.id) ? (seat.col + 1) : ''}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bottom-action-bar">
          <div className="total-info">
            <div className="t-label">Total Amount</div>
            <div className="t-amount">₹{totalAmount.toLocaleString('en-IN')}</div>
            {selectedSeats.length >= 2 && (
              <div className="t-savings" style={{display: 'block'}}>🎽 Free jersey included!</div>
            )}
          </div>
          <button 
            className="btn-proceed" 
            disabled={selectedSeats.length === 0}
            onClick={handleProceed}
          >
            {selectedSeats.length > 0 ? `Proceed · ${selectedSeats.length} seat${selectedSeats.length > 1 ? 's' : ''}` : 'Proceed'}
          </button>
        </div>
      </div>

      {reserving && (
        <div className="reserving-overlay active">
          <div className="loader-content">
            <div className="premium-spinner"></div>
            <h3 className="reserving-text">Reserving your seats...</h3>
            <p className="reserving-sub">Please do not refresh or go back</p>
          </div>
        </div>
      )}

      {detailsOpen && <div className="details-backdrop active" onClick={() => setDetailsOpen(false)}></div>}
      <div className={`details-sheet ${detailsOpen ? 'active' : ''}`}>
        <div className="sheet-handle"></div>
        <h2 className="sheet-title">Complete your booking</h2>
        <p className="sheet-sub">Enter details to receive your M-Tickets</p>

        <div className="sheet-order-summary">
          <div className="sos-row">
            <span className="sos-label">Section</span>
            <span className="sos-val">{activeSection?.name}</span>
          </div>
          <div className="sos-row">
            <span className="sos-label">Seats</span>
            <span className="sos-val">{selectedSeats.length} seat{selectedSeats.length > 1 ? 's' : ''}</span>
          </div>
          <div className="sos-row sos-total">
            <span className="sos-label">Total</span>
            <span className="sos-val">₹{totalAmount.toLocaleString('en-IN')}</span>
          </div>
        </div>

        <div className="sheet-form">
          <div className="sf-group">
            <label className="sf-label">Full Name</label>
            <input type="text" placeholder="e.g. Rahul Sharma" className="sf-input" value={userName} onChange={e => setUserName(e.target.value)} />
          </div>
          
          <div className="sf-group">
            <label className="sf-label">Mobile Number</label>
            <div className="sf-phone-row">
              <div className="sf-country">
                <img src="https://flagcdn.com/w20/in.png" alt="IN" className="flag" />
                <span>+91</span>
              </div>
              <input type="tel" placeholder="98765 43210" className="sf-input sf-phone" maxLength="10" value={userPhone} onChange={e => setUserPhone(e.target.value)} />
            </div>
          </div>
          
          <div className="sf-group">
            <label className="sf-label">Email Address</label>
            <input type="email" placeholder="you@example.com" className="sf-input" value={userEmail} onChange={e => setUserEmail(e.target.value)} />
          </div>
        </div>

        <button className="btn-confirm-booking" onClick={handleConfirm}>Confirm & Continue →</button>
        
        <p className="sheet-terms">
          By continuing, you agree to our
          <a href="#">Terms of Service</a> & <a href="#">Privacy Policy</a>
        </p>
      </div>

      {processing && (
        <div className="processing-overlay active">
          <div className="loader-content">
            <div className="premium-spinner proc-spinner"></div>
            <h3 className="reserving-text">Processing your order...</h3>
            <p className="reserving-sub">Securing seats & generating M-Tickets</p>
          </div>
        </div>
      )}

    </div>
  );
}

export default Seats;
