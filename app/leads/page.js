'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AnnouncementBar from '@/components/AnnouncementBar';
import { 
  supabaseClient, 
  defaultMembersData, 
  defaultAvatar, 
  getRoleAcronym,
  getRoleFullTitle,
  formatBadgeNameLines,
  getSidebarInitials,
  getDepartmentName,
  sortMembersByIdNumber
} from '@/lib/db';

// Helper for instant, non-blocking member lookup across memory, localStorage and fallback
export function findMemberById(id, currentMembers = []) {
  if (!id) return null;
  const cleanId = id.toLowerCase().trim();

  // 1. Search current in-memory members
  if (currentMembers && currentMembers.length > 0) {
    const found = currentMembers.find(m => m.id && m.id.toLowerCase() === cleanId);
    if (found) return found;
  }

  // 2. Search local storage cache immediately
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem('iedc_directory_data_v2');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          const found = parsed.find(m => m.id && m.id.toLowerCase() === cleanId);
          if (found) return found;
        }
      }
    } catch (e) {}
  }

  // 3. Search default fallback list
  return defaultMembersData.find(m => m.id && m.id.toLowerCase() === cleanId) || null;
}

export default function MeetLeadsPage() {
  const [members, setMembers] = useState(defaultMembersData);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedMember, setSelectedMember] = useState(null);

  // 1. Instant Cache Hydration & Immediate Hash Pop-Up
  useEffect(() => {
    let initialMembers = defaultMembersData;
    const stored = localStorage.getItem('iedc_directory_data_v2');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.length > 0) {
          initialMembers = parsed;
          setMembers(parsed);
        }
      } catch (err) {}
    }

    // Instant resolution on mount (<1ms)
    const hash = window.location.hash.replace(/^#/, '').trim();
    if (hash && hash !== '/admin') {
      const immediateMatch = findMemberById(hash, initialMembers);
      if (immediateMatch) {
        setSelectedMember(immediateMatch);
      }
    }

    // Background asynchronous Supabase sync (does NOT block modal pop-up)
    async function syncSupabase() {
      try {
        const { data, error } = await supabaseClient.from('members').select('*');
        if (error) throw error;

        if (data && data.length > 0) {
          const mapped = data.map(item => {
            const member = { ...item, sidebarRole: item.sidebar_role };
            delete member.sidebar_role;
            return member;
          });
          setMembers(mapped);
          localStorage.setItem('iedc_directory_data_v2', JSON.stringify(mapped));

          // If hash is still active, ensure modal has the latest updated data
          const currentHash = window.location.hash.replace(/^#/, '').trim();
          if (currentHash && currentHash !== '/admin') {
            const freshMatch = mapped.find(m => m.id && m.id.toLowerCase() === currentHash.toLowerCase());
            if (freshMatch) {
              setSelectedMember(freshMatch);
            }
          }
        }
      } catch (e) {
        console.warn("Supabase background sync unavailable. Operating on local storage database.");
      }
    }

    syncSupabase();
  }, []);

  // 2. High-speed hashchange listener
  useEffect(() => {
    function handleHashRoute() {
      const hash = window.location.hash.replace(/^#/, '').trim();
      if (!hash || hash === '/admin') {
        setSelectedMember(null);
        return;
      }

      const match = findMemberById(hash, members);
      if (match) {
        setSelectedMember(match);
      } else {
        // Fast targeted fetch from Supabase if not present in local cache
        supabaseClient
          .from('members')
          .select('*')
          .ilike('id', hash)
          .single()
          .then(({ data }) => {
            if (data) {
              const member = { ...data, sidebarRole: data.sidebar_role };
              delete member.sidebar_role;
              setSelectedMember(member);
              setMembers(prev => {
                const exists = prev.some(m => m.id.toLowerCase() === member.id.toLowerCase());
                return exists ? prev : [member, ...prev];
              });
            }
          })
          .catch(() => {});
      }
    }

    window.addEventListener('hashchange', handleHashRoute);
    return () => window.removeEventListener('hashchange', handleHashRoute);
  }, [members]);

  const closeModal = () => {
    setSelectedMember(null);
    if (typeof window !== 'undefined' && window.location.hash) {
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
    }
  };

  // Filter & Search logic
  const filteredMembers = members.filter(member => {
    if (member.status === 'inactive') return false;

    const matchesFilter = activeFilter === 'all' || member.tier === activeFilter;
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch = 
      member.name.toLowerCase().includes(query) ||
      member.role.toLowerCase().includes(query) ||
      (member.skills && member.skills.some(skill => skill.toLowerCase().includes(query)));

    return matchesFilter && matchesSearch;
  });

  const leadershipMembers = filteredMembers.filter(m => m.tier === 'leadership').sort(sortMembersByIdNumber);
  const coreMembers = filteredMembers.filter(m => m.tier === 'core').sort(sortMembersByIdNumber);
  const memberTiers = filteredMembers.filter(m => m.tier === 'member').sort(sortMembersByIdNumber);

  return (
    <>
      <AnnouncementBar />
      <Navbar currentYear="2026-27" />

      {/* Light background with green gradient blobs */}
      <div className="leads-page-bg">
        <div className="leads-blob leads-blob-1" />
        <div className="leads-blob leads-blob-2" />
        <div className="leads-blob leads-blob-3" />
      </div>

      <main className="profile-container leads-light-theme" id="publicView" style={{ paddingTop: "7rem" }}>
        {/* Header */}
        <header className="profile-header">
          <h1>Innovators Directory</h1>
          <p className="subtitle">Meet the minds behind the mission at IEDC SIAS</p>
        </header>


        {/* Controls (Search & Filters) */}
        <div className="controls-wrapper">
          <div className="search-box-container">
            <input 
              type="text" 
              id="searchInput" 
              className="search-input" 
              placeholder="Search by name, role or skill..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-search"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          </div>
          <div className="filter-tabs" id="filterTabs">
            <button 
              className={`filter-tab ${activeFilter === 'all' ? 'active' : ''}`}
              onClick={() => setActiveFilter('all')}
            >
              All Tiers
            </button>
            <button 
              className={`filter-tab ${activeFilter === 'leadership' ? 'active' : ''}`}
              onClick={() => setActiveFilter('leadership')}
            >
              Executive Board
            </button>
            <button 
              className={`filter-tab ${activeFilter === 'core' ? 'active' : ''}`}
              onClick={() => setActiveFilter('core')}
            >
              Core Committees
            </button>
            <button 
              className={`filter-tab ${activeFilter === 'member' ? 'active' : ''}`}
              onClick={() => setActiveFilter('member')}
            >
              Assistants
            </button>
          </div>
        </div>

        {/* Empty State */}
        {filteredMembers.length === 0 && (
          <div className="empty-state" id="emptyState">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><line x1="17" y1="8" x2="22" y2="13"></line><line x1="22" y1="8" x2="17" y2="13"></line></svg>
            <h3>No Members Found</h3>
            <p>Try resetting your search filters or typing a different keyword.</p>
          </div>
        )}

        {/* TIER 1: LEADERSHIP SECTION */}
        {leadershipMembers.length > 0 && (
          <div className="section-tier" id="tier-leadership">
            <div className="section-header">
              <h2 className="section-title">Executive Board & Leadership</h2>
              <div className="section-line"></div>
            </div>
            <div className="card-grid">
              {leadershipMembers.map(member => (
                <MemberCard 
                  key={member.id} 
                  member={member} 
                  onClick={() => setSelectedMember(member)} 
                />
              ))}
            </div>
          </div>
        )}

        {/* TIER 2: CORE COMMITTEE SECTION */}
        {coreMembers.length > 0 && (
          <div className="section-tier" id="tier-core">
            <div className="section-header">
              <h2 className="section-title">Core Committees</h2>
              <div className="section-line"></div>
            </div>
            <div className="card-grid">
              {coreMembers.map(member => (
                <MemberCard 
                  key={member.id} 
                  member={member} 
                  onClick={() => setSelectedMember(member)} 
                />
              ))}
            </div>
          </div>
        )}

        {/* TIER 3: ASSISTANTS / GENERAL MEMBERS SECTION */}
        {memberTiers.length > 0 && (
          <div className="section-tier" id="tier-member">
            <div className="section-header">
              <h2 className="section-title">Assistants</h2>
              <div className="section-line"></div>
            </div>
            <div className="card-grid">
              {memberTiers.map(member => (
                <MemberCard 
                  key={member.id} 
                  member={member} 
                  onClick={() => setSelectedMember(member)} 
                />
              ))}
            </div>
          </div>
        )}

        {/* DETAIL MODAL */}
        {selectedMember && (
          <DetailModal member={selectedMember} onClose={closeModal} />
        )}
      </main>

      <Footer />
    </>
  );
}

// Inner Component: Official Kerala IEDC Emblem
export function KeralaIedcEmblem() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '5px', flexShrink: 0 }}>
      <svg width="22" height="20" viewBox="0 0 30 26" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="4" y="15" width="9" height="3" rx="1.5" transform="rotate(-45 4 15)" fill="#8b5cf6" />
        <rect x="8.5" y="10.5" width="9" height="3" rx="1.5" transform="rotate(-45 8.5 10.5)" fill="#d946ef" />
        <rect x="13" y="6" width="9" height="3" rx="1.5" transform="rotate(-45 13 6)" fill="#f97316" />
        <rect x="11.5" y="19.5" width="9" height="3" rx="1.5" transform="rotate(-45 11.5 19.5)" fill="#a855f7" />
        <rect x="16" y="15" width="9" height="3" rx="1.5" transform="rotate(-45 16 15)" fill="#ec4899" />
        <rect x="19" y="19.5" width="9" height="3" rx="1.5" transform="rotate(-45 19 19.5)" fill="#f43f5e" />
      </svg>
      <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.15 }}>
        <span style={{ fontSize: '4.8px', fontWeight: 700, color: '#ffffff', letterSpacing: '0.03em' }}>INNOVATION AND</span>
        <span style={{ fontSize: '4.8px', fontWeight: 700, color: '#ffffff', letterSpacing: '0.03em' }}>ENTREPRENEURSHIP</span>
        <span style={{ fontSize: '4.8px', fontWeight: 700, color: '#ffffff', letterSpacing: '0.03em' }}>DEVELOPMENT CENTRE</span>
      </div>
    </div>
  );
}

// Inner Component: Official SAFI Emblem
export function SafiLogoEmblem() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', lineHeight: 1.15, flexShrink: 0 }}>
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="11" fill="#ffffff" />
        <path d="M5 13C8 13 11 6 19 6C15 8 13 15 5 13Z" fill="#17181c" />
        <path d="M7 16C10 16 12 11 18 10C15 11 13 16 7 16Z" fill="#17181c" />
      </svg>
      <span style={{ fontSize: '6.5px', fontWeight: 700, color: '#ffffff', letterSpacing: '0.06em', marginTop: '2px' }}>SAFI</span>
    </div>
  );
}

// Inner Component: Official IEDC SIAS Header Logo
export function IedcSiasBadgeLogo() {
  return (
    <div className="badge-logo-brand">
      <svg className="badge-logo-icon" viewBox="0 0 44 54" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M22 4C13.5 4 7 10.5 7 19C7 24.5 10.5 28.5 13 31.5C14.5 33.5 15.5 35.5 15.5 38H28.5C28.5 35.5 29.5 33.5 31 31.5C33.5 28.5 37 24.5 37 19C37 10.5 30.5 4 22 4Z" stroke="#ffffff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M14 17C15 14.5 18 14 19.5 16.5C21 14 24 14 25.5 16.5C27 14.5 30 15 30 17.5C30 20.5 27 22.5 25.5 23.5C24 24.5 22 24.5 20 23.5C17.5 22 14 19.5 14 17Z" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M22 16.5V23.5" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M15.5 42H28.5M17 46H27M19 50H25" stroke="#ffffff" strokeWidth="2.6" strokeLinecap="round"/>
      </svg>
      <div className="badge-brand-text">
        <span className="badge-brand-title">IEDC</span>
        <span className="badge-brand-sub">SIAS</span>
      </div>
    </div>
  );
}

// Helpers for responsive dynamic card text scaling
function getNameStyle(line1, line2) {
  const maxLen = Math.max((line1 || '').length, (line2 || '').length);
  if (maxLen <= 7) return { fontSize: '1.65rem', letterSpacing: '0.06em' };
  if (maxLen <= 10) return { fontSize: '1.45rem', letterSpacing: '0.05em' };
  if (maxLen <= 13) return { fontSize: '1.25rem', letterSpacing: '0.03em' };
  if (maxLen <= 16) return { fontSize: '1.08rem', letterSpacing: '0.02em' };
  return { fontSize: '0.96rem', letterSpacing: '0.01em' };
}

function getAcronymStyle(acronym) {
  const len = (acronym || '').length;
  if (len <= 3) return { fontSize: '2.75rem', letterSpacing: '0.04em' };
  if (len === 4) return { fontSize: '2.2rem', letterSpacing: '0.03em' };
  if (len === 5) return { fontSize: '1.8rem', letterSpacing: '0.02em' };
  return { fontSize: '1.5rem', letterSpacing: '0.02em' };
}

function getRoleTitleStyle(words, acronym) {
  const acronymLen = (acronym || '').length;
  const longestWord = Math.max(...words.map(w => w.length), 0);
  
  if (acronymLen >= 5 || longestWord >= 9 || words.length >= 3) {
    return { fontSize: '0.70rem', letterSpacing: '0.06em', lineHeight: '1.25' };
  } else if (acronymLen === 4 || longestWord >= 8) {
    return { fontSize: '0.76rem', letterSpacing: '0.08em', lineHeight: '1.3' };
  }
  return { fontSize: '0.84rem', letterSpacing: '0.10em', lineHeight: '1.35' };
}

// Member ID Card Component
export function MemberCard({ member, onClick, isPreview = false }) {
  const acronym = getRoleAcronym(member);
  const fullTitle = getRoleFullTitle(member);
  const initialsCode = getSidebarInitials(member);
  const avatarSrc = member.avatar || defaultAvatar;
  const phoneNumber = member.phone || member.id.toUpperCase();
  const emailText = (member.email || 'INFO@IEDC.ORG').toUpperCase();
  const [nameLine1, nameLine2] = formatBadgeNameLines(member.name);

  const nameStyle = getNameStyle(nameLine1, nameLine2);
  const acronymStyle = getAcronymStyle(acronym);

  const roleWords = fullTitle.split(/\s+/).filter(Boolean);
  const roleTitleStyle = getRoleTitleStyle(roleWords, acronym);

  return (
    <div 
      className="id-card"
      onClick={!isPreview ? onClick : undefined}
      style={{ cursor: isPreview ? 'default' : 'pointer' }}
    >
      <div className="card-main">
        <div className="card-top-section">
          <div className="card-top-row">
            <img 
              className="badge-header-logo-img" 
              src="/brand_header_logo_clean.png" 
              alt="IEDC SIAS" 
            />
            <div className="color-swatch-bar">
              <div className="swatch-seg c1"></div>
              <div className="swatch-seg c2"></div>
              <div className="swatch-seg c3"></div>
              <div className="swatch-seg c4"></div>
            </div>
          </div>

          <div className="badge-designation-row">
            <div className="badge-acronym" style={acronymStyle}>{acronym}</div>
            <div className="badge-full-role" style={roleTitleStyle}>
              {roleWords.map((word, idx) => (
                <span key={idx}>{word}</span>
              ))}
            </div>
          </div>
        </div>

        <div className="card-lower-section">
          <img className="topo-pattern-bg" src="/clean_topo_bg.png" alt="" />

          <div className="badge-content-body">
            <div className="badge-photo-frame">
              <img className="badge-photo-img" src={avatarSrc} alt={member.name || 'Profile'} />
            </div>

            <h3 className="badge-name" style={nameStyle}>
              <span className="badge-name-line1">{nameLine1}</span>
              {nameLine2 && <span className="badge-name-line2">{nameLine2}</span>}
            </h3>
          </div>

          <div className="badge-footer">
            <div className="badge-footer-left">
              <span style={{ whiteSpace: 'nowrap', display: 'block' }}>Innovation & Entrepreneurship</span>
              <span style={{ whiteSpace: 'nowrap', display: 'block' }}>Development Centre, <strong>SIAS</strong></span>
            </div>
            <div className="badge-footer-right">
              <KeralaIedcEmblem />
              <SafiLogoEmblem />
            </div>
          </div>
        </div>
      </div>

      <div className="card-lime-strip">
        <div className="vertical-text-container">
          <span className="strip-text-email" title={emailText}>{emailText}</span>
          <span className="strip-text-phone">{phoneNumber}</span>
          <span className="strip-text-code">{initialsCode}</span>
        </div>
      </div>
    </div>
  );
}

// Detail Modal (Inner ID Card)
function DetailModal({ member, onClose }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    if (typeof window !== 'undefined') {
      if (window.location.hash.replace(/^#/, '').toLowerCase() !== member.id.toLowerCase()) {
        window.history.replaceState(null, '', `#${member.id}`);
      }
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [member.id]);

  const acronym = getRoleAcronym(member);
  const avatarSrc = member.avatar || defaultAvatar;

  return (
    <div className="modal-overlay open" onClick={onClose}>
      <div className="modal-card transparent-id-holder" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>

        {/* Lanyard Hanger */}
        <div className="lanyard-holder">
          <svg width="60" height="110" viewBox="0 0 60 110" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16 0H44V45C44 49 41 52 37 52H23C19 52 16 49 16 45V0Z" fill="url(#modalStrapGrad)" />
            <path d="M30 14C26.5 14 23.8 16.5 23.8 19.8C23.8 21.8 25.2 23.5 26.2 24.6C26.7 25.3 27.2 26 27.2 27H32.8C32.8 26 33.3 25.3 33.8 24.6C34.8 23.5 36.2 21.8 36.2 19.8C36.2 16.5 33.5 14 30 14Z" fill="white" opacity="0.9" />
            <path d="M26.5 29.5H33.5M27.2 31.5H32.8M28.2 33.5H31.8" stroke="white" strokeWidth="1.2" strokeLinecap="round" opacity="0.9" />
            <circle cx="30" cy="62" r="10" stroke="url(#modalMetalGrad)" strokeWidth="3" fill="none" />
            <rect x="28.5" y="71" width="3" height="7" rx="1" fill="url(#modalMetalGrad)" />
            <path d="M26 77.5H34V81C34 83.5 32 85.5 30 85.5C28 85.5 26 83.5 26 81V77.5Z" fill="url(#modalMetalGrad)" />
            <path d="M28 85C26 87 24.5 90 24.5 93C24.5 99 29.5 101 30 108C30.5 101 35.5 99 35.5 93C35.5 90 34 87 32 85" stroke="url(#modalMetalGrad)" strokeWidth="2.8" strokeLinecap="round" fill="none" />

            <defs>
              <linearGradient id="modalStrapGrad" x1="30" y1="0" x2="30" y2="52" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#4f8a04" />
                <stop offset="40%" stopColor="#6eb208" />
                <stop offset="100%" stopColor="#84dc13" />
              </linearGradient>
              <linearGradient id="modalMetalGrad" x1="24" y1="58" x2="36" y2="108" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#8a8e97" />
                <stop offset="25%" stopColor="#d2d5db" />
                <stop offset="50%" stopColor="#ffffff" />
                <stop offset="75%" stopColor="#9da2ac" />
                <stop offset="100%" stopColor="#4a4d53" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* Hanging Inner ID Card */}
        <div className="modal-id-card">
          <div className="modal-id-card-slot"></div>

          <div className="modal-id-card-top-half">
            <div className="modal-id-card-main">
              <img className="topo-pattern-bg" src="/clean_topo_bg.png" alt="" />
              
              <div className="modal-id-card-top">
                <IedcSiasBadgeLogo />
                <div className="color-swatch-bar">
                  <div className="swatch-seg c1"></div>
                  <div className="swatch-seg c2"></div>
                  <div className="swatch-seg c3"></div>
                  <div className="swatch-seg c4"></div>
                </div>
              </div>

              <div className="modal-id-card-lower">
                <div className="modal-id-card-body">
                  <div className="modal-id-photo-frame">
                    <img className="modal-id-photo" src={avatarSrc} alt={member.name} />
                  </div>

                  <div className="modal-id-details">
                    <h3 className="modal-id-name">{member.name}</h3>
                    <div className="modal-id-role">{member.role}</div>
                    <div className="modal-id-dept">{getDepartmentName(member)}</div>

                    <div className="modal-id-info-boxes">
                      <div className="modal-id-info-box">
                        <div className="modal-id-info-icon">
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M7 21v-2a4 4 0 0 1 4-4h2a4 4 0 0 1 4 4v2"/><circle cx="12" cy="11" r="3"/></svg>
                        </div>
                        <div className="modal-id-info-texts">
                          <span className="modal-id-info-label">Member ID</span>
                          <span className="modal-id-info-value mono">{member.id}</span>
                        </div>
                      </div>

                      <div className="modal-id-info-box">
                        <div className="modal-id-info-icon">
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
                        </div>
                        <div className="modal-id-info-texts">
                          <span className="modal-id-info-label">Joined</span>
                          <span className="modal-id-info-value">{member.joined || 'May 2024'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-id-lime-strip">
              <div className="modal-vertical-text-container" style={{ justifyContent: 'center' }}>
                <span className="modal-vertical-span" style={{ fontSize: '0.85rem', letterSpacing: '0.25em' }}>IEDC SIAS</span>
              </div>
            </div>
          </div>

          <div className="modal-id-card-divider"></div>

          <div className="modal-id-card-bottom-half">
            <p className="modal-id-bio">
              {member.bio || 'Leads entrepreneurial initiatives, venture partnerships, and campus innovation strategy at IEDC SIAS.'}
            </p>

            <div className="modal-id-connect">
              <span className="connect-title">Connect</span>
              <div className="connect-line"></div>
            </div>

            <div className="modal-id-socials">
              <a href={member.linkedin || '#'} target="_blank" rel="noopener noreferrer" className="modal-social-btn linkedin">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                LinkedIn
              </a>
              <a href={`mailto:${member.email || ''}`} className="modal-social-btn email">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"></rect><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path></svg>
                Email
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
