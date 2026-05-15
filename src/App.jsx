import React, { useState, useEffect } from 'react';
import { data } from './data';
import './index.css';
import MatchDetail from './MatchDetail';
import Seats from './Seats.jsx';
import Review from './Review.jsx';

function Home() {
  const { TEAM_LOGOS, TEAMS_INFO, matchesData } = data;
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    const thresholdDate = new Date('2026-05-16T00:00:00+05:30');
    const futureMatches = matchesData.filter(m => new Date(m.datetime) >= thresholdDate);
    setMatches(futureMatches);
  }, []);

  const partnerLogos = ['CSK', 'DC', 'PBKS', 'GT', 'RR'];

  const handleNavigate = (e, id) => {
    e.preventDefault();
    window.history.pushState({}, '', `/?id=${id}`);
    window.dispatchEvent(new Event('popstate'));
  };

  return (
    <div className="app-container">
      {/* Top Bar: Logo */}
      <header className="top-header" style={{ justifyContent: 'flex-start', padding: '20px 20px 10px' }}>
        <img src="https://b.zmtcdn.com/data/edition_assets/17466982242413.svg" alt="District Logo" style={{ height: '28px' }} />
      </header>

      {/* Search Bar */}
      <div className="search-section">
        <div className="search-box">
          <svg viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2" className="search-icon">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input type="text" placeholder="Search for 'Delhi Capitals'" />
        </div>
      </div>

      {/* Hero Banner */}
      <div className="hero-banner" style={{ background: "url('https://media.insider.in/image/upload/c_crop,g_custom/v1774013590/j6f2eofwpfzqwdgehsyj.png') center/cover no-repeat" }}>
      </div>

      {/* Exclusive Partner Section */}
      <div className="section-divider">
        <span className="line"></span>
        <span className="text">EXCLUSIVE TICKETING PARTNER FOR</span>
        <span className="line"></span>
      </div>
      
      <div className="partner-logos">
        {partnerLogos.map(team => (
          <div key={team} className={`team-logo-small ${TEAMS_INFO[team].cssClass}`}>
            <img src={TEAM_LOGOS[team]} alt={team} className="partner-logo-img" />
          </div>
        ))}
      </div>

      {/* Tickets On Sale Section */}
      <h2 style={{ color: 'white', fontSize: '24px', fontWeight: 'bold', margin: '32px 20px 16px', textAlign: 'left' }}>
        Tickets on sale
      </h2>

      <div className="match-list" style={{ gap: '20px' }}>
        {matches.map(match => (
          <div key={match.id} className="match-item" style={{ gap: '12px' }}>
            <div className="date-tab" style={{ backgroundColor: '#222', border: '1px solid #333', borderRadius: '12px', width: '60px', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0', flexShrink: 0, overflow: 'hidden', alignSelf: 'flex-start' }}>
              <div style={{ backgroundColor: '#333335', width: '100%', textAlign: 'center', padding: '6px 0', fontSize: '13px', color: '#ccc', borderBottom: '1px solid #222' }}>
                {match.date.dayStr}
              </div>
              <div style={{ padding: '12px 0 16px', textAlign: 'center', backgroundColor: '#1C1C1E', width: '100%' }}>
                <div style={{ fontSize: '22px', fontWeight: 'bold', color: 'white', lineHeight: '1' }}>{match.date.dayNum}</div>
                <div style={{ fontSize: '13px', color: '#999', marginTop: '4px' }}>{match.date.month}</div>
              </div>
            </div>

            <div className="match-card" style={{ flex: 1, backgroundColor: '#1C1C1E', border: '1px solid #333', borderRadius: '16px', padding: '0', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              <div className="match-teams-row" style={{ backgroundColor: '#2A2A2D', padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderRadius: '16px', border: '1px solid #333', margin: '-1px' }}>
                <div className="team-logo" style={{ width: '48px', height: '48px', borderRadius: '0', background: 'transparent', boxShadow: 'none' }}>
                  <img src={match.team1.logo} alt={match.team1.short} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                </div>
                <div className="team-names" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', flex: 1 }}>
                  <span style={{ fontSize: '16px', fontWeight: 'bold', color: 'white' }}>{match.team1.name}</span>
                  <span style={{ fontSize: '14px', color: 'white', fontWeight: 'bold', margin: '4px 0' }}>vs</span>
                  <span style={{ fontSize: '16px', fontWeight: 'bold', color: 'white' }}>{match.team2.name}</span>
                </div>
                <div className="team-logo" style={{ width: '48px', height: '48px', borderRadius: '0', background: 'transparent', boxShadow: 'none' }}>
                  <img src={match.team2.logo} alt={match.team2.short} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                </div>
              </div>
              
              <div style={{ padding: '16px 20px 20px' }}>
                <div className="match-venue" style={{ fontSize: '15px', color: 'white', textAlign: 'left', marginBottom: '8px', fontWeight: '500' }}>
                  {match.venue}
                </div>
                <div className="match-time" style={{ fontSize: '15px', color: '#999', textAlign: 'left', marginBottom: '18px', fontWeight: '500' }}>
                  {match.time} Onwards
                </div>
                <div className="match-footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0' }}>
                  {match.status === 'live' ? (
                    <>
                      <div className="sale-status" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '15px', color: 'white', fontWeight: '500' }}>
                        <span style={{ width: '8px', height: '8px', backgroundColor: '#34C759', borderRadius: '50%' }}></span> Sale is live
                      </div>
                      <a href={`/?id=${match.id}`} onClick={(e) => handleNavigate(e, match.id)} className="btn-book" style={{ backgroundColor: 'white', color: 'black', textDecoration: 'none', padding: '10px 20px', borderRadius: '24px', fontSize: '15px', fontWeight: 'bold' }}>
                        Book tickets
                      </a>
                    </>
                  ) : (
                    <button className="btn-coming-soon" style={{ width: '100%', background: '#2A2A2D', color: '#999', padding: '12px', borderRadius: '24px', fontSize: '15px', fontWeight: '600', border: 'none' }}>Coming soon</button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Schedule Button */}
      <div className="schedule-btn-container">
        <button className="btn-full-schedule">
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" className="icon-calendar">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
          <span>TATA IPL 2026 schedule</span>
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" className="chevron-right">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </button>
      </div>

      {/* Teams Section */}
      <div className="section-divider">
        <span className="line"></span>
        <span className="text">TEAMS</span>
        <span className="line"></span>
      </div>

      <div className="teams-list">
        {Object.keys(TEAMS_INFO).map(teamKey => (
          <div key={teamKey} className="team-row">
            <div className={`team-logo-tiny ${TEAMS_INFO[teamKey].cssClass}`}>
              <img src={TEAM_LOGOS[teamKey]} alt={teamKey} className="tiny-logo-img" />
            </div>
            <span className="team-full-name">{TEAMS_INFO[teamKey].name}</span>
          </div>
        ))}
      </div>

      {/* Disclaimer */}
      <div className="section-divider">
        <span className="line"></span>
        <span className="text">DISCLAIMER</span>
        <span className="line"></span>
      </div>

      <div className="disclaimer-text">
        All proprietary elements such as names, logos etc used on this page are the property of the Indian Premier League and their respective teams.
      </div>
    </div>
  );
}

function App() {
  const [currentSearch, setCurrentSearch] = useState(window.location.search);

  useEffect(() => {
    const handlePopState = () => setCurrentSearch(window.location.search);
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const params = new URLSearchParams(currentSearch);
  const id = params.get('id');
  const route = params.get('route');

  if (route === 'review' && id) {
    return <Review id={id} />;
  }

  if (route === 'seats' && id) {
    return <Seats id={id} />;
  }

  if (id) {
    return <MatchDetail id={id} />;
  }

  return <Home />;
}

export default App;
