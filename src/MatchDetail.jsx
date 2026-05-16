import React, { useEffect } from 'react';
import { data } from './data';
import './match.css';

function MatchDetail({ id }) {
  const match = data.matchesData.find(m => m.id === id);

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      const heroMock = document.getElementById('dynHeroMock');
      const heroSection = document.getElementById('dynHeroSection');
      if (y < 450) {
        if (heroMock) {
          heroMock.style.opacity = 1 - y / 300;
          heroMock.style.transform = `translateY(${y * 0.1}px)`;
        }
        if (heroSection) {
          heroSection.style.transform = `translateY(${y * 0.3}px)`;
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!match) return <div>Match not found</div>;

  return (
    <div className="app-container match-page">
      {/* Hero Image Section */}
      <div className="hero-image-section" id="dynHeroSection" style={match.heroBg ? { background: 'transparent' } : {}}>
        <div className="top-actions">
          <a href="/" className="action-btn" onClick={(e) => {
            e.preventDefault();
            window.history.pushState({}, '', '/');
            window.dispatchEvent(new Event('popstate'));
          }}>
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </a>
          <div className="right-actions">
            <button className="action-btn">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
              </svg>
            </button>
            <button className="action-btn">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
                <polyline points="16 6 12 2 8 6"></polyline>
                <line x1="12" y1="2" x2="12" y2="15"></line>
              </svg>
            </button>
          </div>
        </div>

        <div className="hero-bg-placeholder">
          {match.heroBg ? (
            <img src={match.heroBg} id="dynHeroImage" alt="Match Banner" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <div className="hero-content-mock" id="dynHeroMock">
              <div className="hero-logos">
                <div className={`hero-logo-circle ${match.team1.cssClass}`} id="dynTeam1Logo">
                  <img src={match.team1.logo} alt={match.team1.short} className="hero-logo-img" />
                </div>
                <div className="hero-vs">VS</div>
                <div className={`hero-logo-circle ${match.team2.cssClass}`} id="dynTeam2Logo">
                  <img src={match.team2.logo} alt={match.team2.short} className="hero-logo-img" />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Overlapping Bottom Sheet */}
      <div className="bottom-sheet">
        <div className="badges-row">
          <span className="badge">Cricket Matches</span>
          <span className="badge">Sports</span>
        </div>

        <h1 className="match-title" id="dynMatchTitle">
          TATA IPL 2026: {match.matchNumber} | {match.team1.name} vs {match.team2.name}
        </h1>
        <div className="match-datetime" id="dynMatchDateTime">
          {match.date.dayStr}, {match.date.dayNum} {match.date.month}, {match.time}
        </div>

        <div className="info-row">
          <div className="info-icon-box">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
          </div>
          <div className="info-text">
            <div className="info-main" id="dynVenue">{match.venue}</div>
            <div className="info-sub" id="dynDistance">{match.distance}</div>
          </div>
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#666" strokeWidth="2" className="chevron">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </div>

        <div className="info-row border-bottom">
          <div className="info-icon-box">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
          </div>
          <div className="info-text">
            <div className="info-main">Gates open at 4:30 PM</div>
            <div className="info-sub">View full schedule & timeline</div>
          </div>
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#666" strokeWidth="2" className="chevron">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </div>

        <div className="highlights-scroll">
          <div className="highlight-card standout">
            <div className="highlight-header">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#FFD700" strokeWidth="2">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
              </svg>
              Why this event stands out
            </div>
            <div className="highlight-body" id="dynStandoutText">
              High-octane clash: {match.team1.name} vs {match.team2.name}
            </div>
          </div>
          <div className="highlight-card jersey">
            <div className="jersey-img-mock"></div>
            <div className="highlight-text">
              <div className="j-sub" id="dynJerseyOffer">{match.team1.short} fan jersey 2026</div>
              <div className="j-main">Buy 2 tickets, get a jersey free</div>
            </div>
          </div>
        </div>

        <section className="content-section">
          <h2>About the event</h2>
          <p id="dynAboutText">
            Get set for an electrifying clash as {match.team1.name} take on {match.team2.name} in a battle packed with power-hitting and high-intensity action. Playing at their home ground, {match.team1.short} will look to capitalize on familiar conditio...
          </p>
          <button className="read-more">Read more &gt;</button>
        </section>

        <section className="content-section">
          <h2>Things to Know</h2>
          <ul className="things-list">
            <li>
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              Ticket needed for ages 2 and above
            </li>
            <li>
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
              Entry allowed for all ages
            </li>
            <li>
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
                <line x1="9" y1="9" x2="9.01" y2="9"></line>
                <line x1="15" y1="9" x2="15.01" y2="9"></line>
              </svg>
              Kid friendly
            </li>
            <li>
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 14C4.34 14 3 12.66 3 11s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm12 0c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z"></path>
                <path d="M12 16c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6z"></path>
              </svg>
              Pet friendly
            </li>
          </ul>
          <button className="read-more" style={{ marginTop: '12px' }}>See all &gt;</button>
        </section>

        <section className="content-section">
          <h2>Organised By</h2>
          <div className="organiser-card">
            <div className="org-left">
              <div className="org-avatar">
                <svg viewBox="0 0 24 24" width="32" height="32" fill="currentColor" stroke="none">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"></path>
                </svg>
              </div>
              <div className="org-name">Sun TV Network Limited</div>
            </div>
            <div className="org-right">
              <div className="stat-box">
                <div className="stat-val">90%</div>
                <div className="stat-label">Liked (8.5k ratings)</div>
              </div>
              <div className="stat-box">
                <div className="stat-val">14</div>
                <div className="stat-label">Hosted events</div>
              </div>
              <div className="stat-box">
                <div className="stat-val">6.2 years</div>
                <div className="stat-label">Hosting</div>
              </div>
            </div>
          </div>
        </section>

        <section className="content-section">
          <h2>More</h2>
          <div className="more-list">
            <a href="#" className="more-item">
              <div className="more-left">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                  <line x1="12" y1="17" x2="12.01" y2="17"></line>
                </svg>
                Frequently asked questions
              </div>
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#666" strokeWidth="2" className="chevron">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </a>
            <a href="#" className="more-item">
              <div className="more-left">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="8" y1="6" x2="21" y2="6"></line>
                  <line x1="8" y1="12" x2="21" y2="12"></line>
                  <line x1="8" y1="18" x2="21" y2="18"></line>
                  <line x1="3" y1="6" x2="3.01" y2="6"></line>
                  <line x1="3" y1="12" x2="3.01" y2="12"></line>
                  <line x1="3" y1="18" x2="3.01" y2="18"></line>
                </svg>
                Terms and conditions
              </div>
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#666" strokeWidth="2" className="chevron">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </a>
          </div>
        </section>

        <div className="bottom-spacer"></div>
      </div>

      <div className="bottom-buy-bar">
        <div className="price-info">
          <div className="sale-type">General Sale</div>
          <div className="price-amount" id="dynBasePrice">₹{match.basePrice || '699'} <span className="onwards">onwards</span></div>
        </div>
        <a href={`/?route=seats&id=${match.id}`} onClick={(e) => {
            e.preventDefault();
            window.history.pushState({}, '', `/?route=seats&id=${match.id}`);
            window.dispatchEvent(new Event('popstate'));
        }} id="btnBookTickets" className="btn-book-large" style={{ textDecoration: 'none', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          Book tickets
        </a>
      </div>
    </div>
  );
}

export default MatchDetail;
