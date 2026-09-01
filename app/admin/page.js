'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { QRCodeCanvas } from 'qrcode.react';
import { 
  supabaseClient, 
  defaultMembersData, 
  defaultAvatar, 
  getRoleAcronym,
  getRoleFullTitle,
  getDepartmentName,
  sortMembersByIdNumber
} from '@/lib/db';
import { MemberCard } from '@/app/leads/page';

export default function AdminPage() {
  const router = useRouter();
  
  // Authentication states
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');

  // Retrieve authenticated state from sessionStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const auth = sessionStorage.getItem('admin_authenticated');
      if (auth === 'true') {
        setIsAuthenticated(true);
      }
    }
  }, []);

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (passwordInput === 'iedc@sias') {
      setIsAuthenticated(true);
      sessionStorage.setItem('admin_authenticated', 'true');
      setLoginError('');
    } else {
      setLoginError('Incorrect password. Please try again.');
    }
  };

  const [activeTab, setActiveTab] = useState('list'); // list, form, settings
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Active QR member preview modal state
  const [activeQrMember, setActiveQrMember] = useState(null);
  
  // Toast notifications state
  const [toast, setToast] = useState({ show: false, message: '', isError: false });
  const showToast = (message, isError = false) => {
    setToast({ show: true, message, isError });
    setTimeout(() => {
      setToast(prev => ({ ...prev, show: false }));
    }, 3500);
  };

  // Form states
  const [formOriginalId, setFormOriginalId] = useState('');
  const [formId, setFormId] = useState('');
  const [formName, setFormName] = useState('');
  const [formRole, setFormRole] = useState('');
  const [formDept, setFormDept] = useState('');
  const [formSidebarRole, setFormSidebarRole] = useState('');
  const [formTier, setFormTier] = useState('leadership');
  const [formJoined, setFormJoined] = useState('');
  const [formStatus, setFormStatus] = useState('active');
  const [formEmail, setFormEmail] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formAcronym, setFormAcronym] = useState('');
  const [formLinkedin, setFormLinkedin] = useState('');
  const [formGithub, setFormGithub] = useState('');
  const [formSkills, setFormSkills] = useState('');
  const [formBio, setFormBio] = useState('');
  const [formPhotoUrl, setFormPhotoUrl] = useState('');
  const [uploadedBase64, setUploadedBase64] = useState('');

  // Drop zone states
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  // Load database
  useEffect(() => {
    function loadFallback() {
      const stored = localStorage.getItem('iedc_directory_data_v2');
      if (stored) {
        try {
          setMembers(JSON.parse(stored));
        } catch (err) {
          setMembers(defaultMembersData);
        }
      } else {
        setMembers(defaultMembersData);
        localStorage.setItem('iedc_directory_data_v2', JSON.stringify(defaultMembersData));
      }
    }

    async function loadData() {
      loadFallback();
      setLoading(false);

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
        }
      } catch (e) {
        console.warn("Supabase is unreachable (offline mode). Operating on local storage database.");
      }
    }

    loadData();
  }, []);

  const saveDatabaseToStorage = (updatedMembers) => {
    setMembers(updatedMembers);
    localStorage.setItem('iedc_directory_data_v2', JSON.stringify(updatedMembers));
  };

  // Toggle active/inactive status
  const handleToggleStatus = async (id, e) => {
    e.stopPropagation();
    const updated = members.map(m => {
      if (m.id === id) {
        const newStatus = m.status === 'active' ? 'inactive' : 'active';
        
        supabaseClient.from('members').update({ status: newStatus }).eq('id', id).then(({ error }) => {
          if (error) {
            console.error("Failed to update status in Supabase:", error);
            showToast("Failed to update status in cloud: " + error.message, true);
          } else {
            showToast(`Status of ${m.name} updated to ${newStatus}.`);
          }
        });

        return { ...m, status: newStatus };
      }
      return m;
    });
    saveDatabaseToStorage(updated);
  };

  // Edit member initialization
  const handleEditMember = (id) => {
    const member = members.find(m => m.id === id);
    if (!member) return;

    setFormOriginalId(member.id);
    setFormId(member.id);
    setFormName(member.name);
    setFormRole(member.role);
    setFormDept(member.dept || '');
    setFormSidebarRole(member.sidebarRole || '');
    setFormTier(member.tier);
    setFormJoined(member.joined);
    setFormStatus(member.status || 'active');
    setFormEmail(member.email || '');
    setFormPhone(member.phone || '');
    setFormAcronym(member.acronym || '');
    setFormLinkedin(member.linkedin || '');
    setFormGithub(member.github || '');
    setFormSkills(member.skills ? member.skills.join(', ') : '');
    setFormBio(member.bio || '');

    const isBase64 = member.avatar && member.avatar.startsWith('data:image/');
    if (isBase64) {
      setUploadedBase64(member.avatar);
      setFormPhotoUrl('');
    } else {
      setUploadedBase64('');
      setFormPhotoUrl(member.avatar || '');
    }

    setActiveTab('form');
  };

  // Delete member
  const handleDeleteMember = async (id) => {
    const member = members.find(m => m.id === id);
    if (!member) return;

    const confirmDelete = confirm(`Are you absolutely sure you want to delete ${member.name}'s ID card?`);
    if (confirmDelete) {
      let deletedLocallyOnly = false;
      try {
        const { error } = await supabaseClient.from('members').delete().eq('id', id);
        if (error) throw error;
      } catch (err) {
        console.warn("Supabase is unreachable. Deleting member from local storage database instead:", err);
        deletedLocallyOnly = true;
      }

      const updated = members.filter(m => m.id !== id);
      saveDatabaseToStorage(updated);
      
      if (deletedLocallyOnly) {
        showToast(`${member.name}'s card deleted (locally only).`);
      } else {
        showToast(`${member.name}'s card deleted successfully.`);
      }
    }
  };

  // Auto generate unique ID
  const handleAutoGenerateId = () => {
    let prefix = 'clb-';
    if (formTier === 'leadership') {
      prefix = 'iedc-exe-';
    }

    let maxNum = 0;
    members.forEach(member => {
      if (member.id.toLowerCase().startsWith(prefix)) {
        const numberPart = member.id.slice(prefix.length);
        const val = parseInt(numberPart, 10);
        if (!isNaN(val) && val > maxNum) {
          maxNum = val;
        }
      }
    });

    const nextNum = maxNum + 1;
    const paddedNum = prefix === 'iedc-exe-'
      ? String(nextNum).padStart(4, '0')
      : String(nextNum).padStart(3, '0');

    setFormId(prefix + paddedNum);
  };

  // Drag and drop zone file processing
  const processPhotoFile = (file) => {
    if (!file || !file.type.startsWith('image/')) {
      showToast('Please select a valid image file!', true);
      return;
    }

    const reader = new FileReader();
    reader.onload = function (e) {
      const img = new Image();
      img.onload = function () {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        const maxDim = 320;
        if (width > height) {
          if (width > maxDim) {
            height = Math.round(height * maxDim / width);
            width = maxDim;
          }
        } else {
          if (height > maxDim) {
            width = Math.round(width * maxDim / height);
            height = maxDim;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        const compressedBase64 = canvas.toDataURL('image/jpeg', 0.75);
        setUploadedBase64(compressedBase64);
        setFormPhotoUrl('');
        showToast('Image uploaded and optimized successfully.');
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      processPhotoFile(files[0]);
    }
  };

  // Reset/Cancel Form
  const handleCancelForm = () => {
    setFormOriginalId('');
    setFormId('');
    setFormName('');
    setFormRole('');
    setFormDept('');
    setFormSidebarRole('');
    setFormTier('leadership');
    setFormJoined('');
    setFormStatus('active');
    setFormEmail('');
    setFormPhone('');
    setFormAcronym('');
    setFormLinkedin('');
    setFormGithub('');
    setFormSkills('');
    setFormBio('');
    setFormPhotoUrl('');
    setUploadedBase64('');
    setActiveTab('list');
  };

  // Submit/Save Form
  const handleSaveMember = async (e) => {
    e.preventDefault();

    const id = formId.trim();
    const name = formName.trim();
    const role = formRole.trim();
    const acronym = formAcronym.trim();
    const phone = formPhone.trim();
    const dept = formDept.trim();
    const sidebarRole = formSidebarRole.trim();
    const tier = formTier;
    const joined = formJoined.trim();
    const status = formStatus;
    const email = formEmail.trim();
    const linkedin = formLinkedin.trim();
    const github = formGithub.trim();
    const bio = formBio.trim();
    const photoUrl = formPhotoUrl.trim();

    const idConflict = members.some(m => m.id.toLowerCase() === id.toLowerCase() && m.id !== formOriginalId);
    if (idConflict) {
      showToast(`Error: The ID "${id}" is already in use by another member!`, true);
      return;
    }

    const skills = formSkills ? formSkills.split(',').map(s => s.trim()).filter(s => s.length > 0) : [];
    
    let avatar = defaultAvatar;
    if (uploadedBase64) {
      avatar = uploadedBase64;
    } else if (photoUrl) {
      avatar = photoUrl;
    }

    const memberObj = {
      id, name, role, acronym, phone, dept, sidebarRole, tier, email, linkedin, github, avatar, joined, bio, skills, status
    };

    let savedLocallyOnly = false;
    try {
      if (formOriginalId && formOriginalId !== id) {
        await supabaseClient.from('members').delete().eq('id', formOriginalId);
      }

      const dbRow = { ...memberObj, sidebar_role: memberObj.sidebarRole };
      delete dbRow.sidebarRole;

      const { error } = await supabaseClient.from('members').upsert([dbRow]);
      if (error) throw error;
    } catch (err) {
      console.warn("Supabase is unreachable. Saving member to local storage database instead:", err);
      savedLocallyOnly = true;
    }

    let updated;
    if (formOriginalId) {
      updated = members.map(m => m.id === formOriginalId ? memberObj : m);
      if (formOriginalId !== id) {
        updated = members.filter(m => m.id !== formOriginalId);
        updated.push(memberObj);
      }
    } else {
      updated = [...members, memberObj];
    }

    saveDatabaseToStorage(updated);
    
    if (savedLocallyOnly) {
      showToast(formOriginalId 
        ? `Updated card details for ${name} (saved locally only).` 
        : `Created new ID card for ${name} (saved locally only).`
      );
    } else {
      showToast(formOriginalId 
        ? `Successfully updated card details for ${name}.` 
        : `Successfully created new ID card for ${name}!`
      );
    }
    handleCancelForm();
  };

  const handleDownloadQr = () => {
    if (!activeQrMember) return;
    const container = document.getElementById('admin-qr-canvas-container');
    const sourceCanvas = container ? container.querySelector('canvas') : null;
    if (sourceCanvas) {
      // Create high-res download canvas with rounded white background
      const downloadCanvas = document.createElement('canvas');
      const targetSize = 600;
      const margin = 50; // Generous quiet zone keeping finder markers safe from rounded edges
      const cornerRadius = 48; // Sleek modern rounded corner radius

      downloadCanvas.width = targetSize;
      downloadCanvas.height = targetSize;
      const ctx = downloadCanvas.getContext('2d');
      if (ctx) {
        // 1. Transparent base canvas
        ctx.clearRect(0, 0, targetSize, targetSize);

        // 2. Draw smooth rounded white background
        ctx.fillStyle = '#ffffff';
        if (typeof ctx.roundRect === 'function') {
          ctx.beginPath();
          ctx.roundRect(0, 0, targetSize, targetSize, cornerRadius);
          ctx.fill();
        } else {
          const r = cornerRadius;
          ctx.beginPath();
          ctx.moveTo(r, 0);
          ctx.lineTo(targetSize - r, 0);
          ctx.quadraticCurveTo(targetSize, 0, targetSize, r);
          ctx.lineTo(targetSize, targetSize - r);
          ctx.quadraticCurveTo(targetSize, targetSize, targetSize - r, targetSize);
          ctx.lineTo(r, targetSize);
          ctx.quadraticCurveTo(0, targetSize, 0, targetSize - r);
          ctx.lineTo(0, r);
          ctx.quadraticCurveTo(0, 0, r, 0);
          ctx.closePath();
          ctx.fill();
        }
        
        // 3. Render QR code centered with crisp pixelated sharpness
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(sourceCanvas, margin, margin, targetSize - (margin * 2), targetSize - (margin * 2));
        
        const url = downloadCanvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = url;
        link.download = `qr_${activeQrMember.name.toLowerCase().replace(/\s+/g, '_')}_${activeQrMember.id}.png`;
        link.click();
        showToast(`Rounded QR Code downloaded for ${activeQrMember.name}.`);
        return;
      }
    }
    showToast("Error generating download link.", true);
  };

  // Live Card Preview member model builder
  const dummyMember = {
    id: formId.trim() || 'iedc-exe-0001',
    name: formName.trim() || 'Fahmi H Murad',
    role: formRole.trim() || 'Chief Marketing Officer',
    acronym: formAcronym.trim() || 'CMO',
    dept: formDept.trim() || 'Executive Board',
    sidebarRole: formSidebarRole.trim() || '',
    tier: formTier,
    joined: formJoined.trim() || 'May 2024',
    phone: formPhone.trim() || '7025161262',
    email: formEmail.trim() || 'fhmurado10@gmail.com',
    linkedin: formLinkedin.trim() || '',
    github: formGithub.trim() || '',
    avatar: uploadedBase64 || formPhotoUrl || '/fahmi_murad.jpg',
    skills: formSkills ? formSkills.split(',').map(s => s.trim()).filter(s => s.length > 0) : [],
    status: 'active'
  };

  // Filter lists
  const filteredList = members.filter(member => {
    const query = searchQuery.toLowerCase().trim();
    return (
      member.name.toLowerCase().includes(query) ||
      member.role.toLowerCase().includes(query) ||
      member.id.toLowerCase().includes(query) ||
      (member.dept && member.dept.toLowerCase().includes(query))
    );
  }).sort(sortMembersByIdNumber);

  if (!isAuthenticated) {
    return (
      <div className="modal-overlay open" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#030712' }}>
        <div className="modal-card" style={{ maxWidth: '400px', width: '100%', textAlign: 'center', border: '1px solid rgba(255, 255, 255, 0.1)', background: 'rgba(13, 17, 23, 0.95)', backdropFilter: 'blur(20px)' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
            <img src="/IEDC LOGOS.png" alt="IEDC Logo" style={{ height: '60px', width: 'auto', objectFit: 'contain' }} />
          </div>
          <h2 className="modal-name" style={{ fontSize: '1.6rem', marginBottom: '0.5rem', letterSpacing: '-0.02em', color: '#ffffff' }}>Admin Authentication</h2>
          <p style={{ color: '#9ca3af', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
            Please enter the administrator password to manage the Innovators Directory.
          </p>
          
          <form onSubmit={handleLoginSubmit}>
            <div className="form-group" style={{ marginBottom: '1.25rem' }}>
              <input 
                type="password" 
                className="form-control" 
                placeholder="Enter password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                style={{ textAlign: 'center', padding: '0.75rem', fontSize: '1rem' }}
                autoFocus
                required
              />
            </div>
            
            {loginError && (
              <div style={{ color: '#ef4444', fontSize: '0.85rem', marginBottom: '1rem', fontWeight: 500 }}>
                {loginError}
              </div>
            )}
            
            <button 
              type="submit" 
              className="btn-premium btn-save" 
              style={{ width: '100%', padding: '0.75rem', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
              Unlock Admin Panel
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-view" id="adminView" style={{ display: 'block', paddingTop: '3rem' }}>
      <div className="admin-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <img src="/IEDC LOGOS.png" alt="IEDC Logo" style={{ height: '45px', width: 'auto', objectFit: 'contain' }} />
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.02em' }}>Admin Portal</h1>
        </div>
        <button className="btn-premium btn-secondary" onClick={() => router.push('/leads')}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0z"></path><circle cx="12" cy="12" r="3"></circle></svg> View Directory
        </button>
      </div>

      {/* Admin Navigation Tabs */}
      <div className="admin-nav" id="adminNav">
        <button 
          className={`admin-nav-btn ${activeTab === 'list' ? 'active' : ''}`} 
          onClick={() => setActiveTab('list')}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg> All Members
        </button>
        <button 
          className={`admin-nav-btn ${activeTab === 'form' ? 'active' : ''}`}
          onClick={() => {
            setFormOriginalId('');
            setFormId('');
            setFormName('');
            setFormRole('');
            setFormDept('');
            setFormSidebarRole('');
            setFormTier('leadership');
            setFormJoined('');
            setFormStatus('active');
            setFormEmail('');
            setFormLinkedin('');
            setFormGithub('');
            setFormSkills('');
            setFormBio('');
            setFormPhotoUrl('');
            setUploadedBase64('');
            setActiveTab('form');
            setTimeout(handleAutoGenerateId, 50);
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><line x1="19" y1="8" x2="19" y2="14"></line><line x1="22" y1="11" x2="16" y2="11"></line></svg> Add Member
        </button>
      </div>

      {/* TAB 1: ALL MEMBERS LIST */}
      {activeTab === 'list' && (
        <div className="admin-tab-panel" id="panel-list">
          <div className="admin-card">
            <div className="admin-card-title">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#05f0a1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M22 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
              <span>Member Directory Control Panel</span>
            </div>

            <div className="admin-controls-bar">
              <input 
                type="text" 
                className="form-control admin-search-input"
                placeholder="Search members by name, role, ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button 
                className="btn-premium btn-save"
                onClick={() => {
                  setFormOriginalId('');
                  setFormId('');
                  setFormName('');
                  setFormRole('');
                  setFormDept('');
                  setFormSidebarRole('');
                  setFormTier('leadership');
                  setFormJoined('');
                  setFormStatus('active');
                  setFormEmail('');
                  setFormLinkedin('');
                  setFormGithub('');
                  setFormSkills('');
                  setFormBio('');
                  setFormPhotoUrl('');
                  setUploadedBase64('');
                  setActiveTab('form');
                  setTimeout(handleAutoGenerateId, 50);
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><line x1="19" y1="8" x2="19" y2="14"></line><line x1="22" y1="11" x2="16" y2="11"></line></svg> Add New Member
              </button>
            </div>

            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Member</th>
                    <th>Role & Dept</th>
                    <th>Tier</th>
                    <th>Joined</th>
                    <th>Status</th>
                    <th style={{ width: '100px' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredList.map(member => {
                    const avatarSrc = member.avatar || defaultAvatar;
                    const tierName = member.tier === 'leadership' ? 'Leadership' : (member.tier === 'core' ? 'Core Committee' : 'Assistant');
                    return (
                      <tr key={member.id}>
                        <td>
                          <div className="admin-member-cell">
                            <img className="admin-avatar-mini" src={avatarSrc} alt={member.name} />
                            <div>
                              <div className="admin-member-name">{member.name}</div>
                              <div className="admin-member-id">{member.id}</div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div style={{ fontWeight: 500 }}>{member.role}</div>
                          <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>{member.dept || ''}</div>
                        </td>
                        <td>
                          <span className={`admin-tier-badge badge-${member.tier}`}>{tierName}</span>
                        </td>
                        <td style={{ color: '#9ca3af', fontSize: '0.85rem' }}>{member.joined}</td>
                        <td>
                          <div className="admin-status-toggle" onClick={(e) => handleToggleStatus(member.id, e)} style={{ cursor: 'pointer' }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={member.status === 'active' ? '#05f0a1' : '#6b7280'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={member.status === 'active' ? 'M22 11.08V12a10 10 0 1 1-5.93-9.14' : 'M22 12A10 10 0 1 1 12 2a10 10 0 0 1 10 10z'}></path>{member.status === 'active' && <polyline points="22 4 12 14.01 9 11.01"></polyline>}</svg>
                            <span style={{ fontSize: '0.8rem', color: member.status === 'active' ? '#ffffff' : '#6b7280', marginLeft: '0.25rem' }}>
                              {member.status === 'active' ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                        </td>
                        <td>
                          <div className="admin-table-actions">
                            <button 
                              className="btn-premium btn-edit" 
                              style={{ padding: '0.4rem', borderRadius: '6px' }} 
                              onClick={() => handleEditMember(member.id)}
                              title="Edit Member Card"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"></path></svg>
                            </button>
                            <button 
                              className="btn-premium btn-secondary" 
                              style={{ padding: '0.4rem', borderRadius: '6px', marginLeft: '0.35rem', backgroundColor: 'rgba(5, 240, 161, 0.15)', borderColor: 'rgba(5, 240, 161, 0.3)' }} 
                              onClick={() => setActiveQrMember(member)}
                              title="Get Member QR Code"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#05f0a1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="5" height="5" x="3" y="3" rx="1"></rect><rect width="5" height="5" x="16" y="3" rx="1"></rect><rect width="5" height="5" x="3" y="16" rx="1"></rect><path d="M21 16V21H16"></path><path d="M12 21v-9"></path><path d="M21 12h-9"></path></svg>
                            </button>
                            <button 
                              className="btn-premium btn-delete" 
                              style={{ padding: '0.4rem', borderRadius: '6px', marginLeft: '0.35rem' }} 
                              onClick={() => handleDeleteMember(member.id)}
                              title="Delete Member Card"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ADD/EDIT MEMBER FORM */}
      {activeTab === 'form' && (
        <div className="admin-tab-panel" id="panel-form" style={{ display: 'block' }}>
          <div className="admin-grid-two-col">
            <div className="admin-card">
              <div className="admin-card-title" id="formTitleText">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#05f0a1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><line x1="19" y1="8" x2="19" y2="14"></line><line x1="22" y1="11" x2="16" y2="11"></line></svg>
                <span>{formOriginalId ? 'Edit Member Card' : 'Add New Member Card'}</span>
              </div>

              <form id="memberForm" onSubmit={handleSaveMember}>
                <div className="form-grid-two-col" style={{ marginBottom: '1.25rem' }}>
                  <div className="form-group">
                    <label className="form-label" htmlFor="member_id">Member ID</label>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      <input 
                        type="text" 
                        id="member_id" 
                        className="form-control" 
                        style={{ flex: 1 }}
                        placeholder="e.g. iedc-exe-0003" 
                        value={formId}
                        onChange={(e) => setFormId(e.target.value)}
                        required 
                      />
                      <button 
                        type="button" 
                        className="btn-premium btn-generate" 
                        onClick={handleAutoGenerateId}
                        style={{ margin: 0 }}
                      >
                        Auto ID
                      </button>
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="member_name">Full Name</label>
                    <input 
                      type="text" 
                      id="member_name" 
                      className="form-control" 
                      placeholder="e.g. John Doe" 
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      required 
                    />
                  </div>
                </div>

                <div className="form-grid-three-col" style={{ marginBottom: '1.25rem' }}>
                  <div className="form-group">
                    <label className="form-label" htmlFor="member_role">Role Title</label>
                    <input 
                      type="text" 
                      id="member_role" 
                      className="form-control" 
                      placeholder="e.g. Chief Marketing Officer" 
                      value={formRole}
                      onChange={(e) => setFormRole(e.target.value)}
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="member_acronym">Role Acronym</label>
                    <input 
                      type="text" 
                      id="member_acronym" 
                      className="form-control" 
                      placeholder="e.g. CMO, CEO, NODAL" 
                      value={formAcronym}
                      onChange={(e) => setFormAcronym(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="member_dept">Department / Committee</label>
                    <input 
                      type="text" 
                      id="member_dept" 
                      className="form-control" 
                      placeholder="e.g. Executive Board"
                      value={formDept}
                      onChange={(e) => setFormDept(e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-grid-three-col" style={{ marginBottom: '1.25rem' }}>
                  <div className="form-group">
                    <label className="form-label" htmlFor="member_tier">Directory Tier</label>
                    <select 
                      id="member_tier" 
                      className="form-select" 
                      value={formTier}
                      onChange={(e) => setFormTier(e.target.value)}
                      required
                    >
                      <option value="leadership">Executive Board & Leadership</option>
                      <option value="core">Core Committee</option>
                      <option value="member">Assistant</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="member_joined">Joined Date</label>
                    <input 
                      type="text" 
                      id="member_joined" 
                      className="form-control" 
                      placeholder="e.g. Jun 2024" 
                      value={formJoined}
                      onChange={(e) => setFormJoined(e.target.value)}
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="member_status">Member Status</label>
                    <select 
                      id="member_status" 
                      className="form-select" 
                      value={formStatus}
                      onChange={(e) => setFormStatus(e.target.value)}
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </div>

                <div className="form-grid-three-col" style={{ marginBottom: '1.25rem' }}>
                  <div className="form-group">
                    <label className="form-label" htmlFor="member_email">Email Address</label>
                    <input 
                      type="email" 
                      id="member_email" 
                      className="form-control" 
                      placeholder="e.g. email@domain.com" 
                      value={formEmail}
                      onChange={(e) => setFormEmail(e.target.value)}
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="member_phone">Phone / Contact Number</label>
                    <input 
                      type="text" 
                      id="member_phone" 
                      className="form-control" 
                      placeholder="e.g. 7025161262"
                      value={formPhone}
                      onChange={(e) => setFormPhone(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="member_linkedin">LinkedIn URL</label>
                    <input 
                      type="url" 
                      id="member_linkedin" 
                      className="form-control" 
                      placeholder="e.g. https://linkedin.com/in/username"
                      value={formLinkedin}
                      onChange={(e) => setFormLinkedin(e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                  <label className="form-label" htmlFor="member_skills">Core Capabilities (comma-separated)</label>
                  <input 
                    type="text" 
                    id="member_skills" 
                    className="form-control" 
                    placeholder="e.g. Marketing Strategy, Growth, Leadership"
                    value={formSkills}
                    onChange={(e) => setFormSkills(e.target.value)}
                  />
                </div>

                <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                  <label className="form-label" htmlFor="member_bio">Short Professional Bio</label>
                  <textarea 
                    id="member_bio" 
                    className="form-textarea" 
                    placeholder="Explain the member's profile description..."
                    value={formBio}
                    onChange={(e) => setFormBio(e.target.value)}
                  ></textarea>
                </div>

                <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                  <label className="form-label">Profile Photo (Drag & Drop or URL)</label>
                  <div className="upload-row">
                    <div 
                      className={`upload-zone ${isDragOver ? 'dragover' : ''}`}
                      id="uploadDropZone"
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current.click()}
                      style={{ cursor: 'pointer' }}
                    >
                      <input 
                        type="file" 
                        id="member_photo_file" 
                        accept="image/*" 
                        style={{ display: 'none' }} 
                        ref={fileInputRef}
                        onChange={(e) => {
                          if (e.target.files.length > 0) {
                            processPhotoFile(e.target.files[0]);
                          }
                        }}
                      />
                      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="upload-icon"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                      <span className="upload-text">Drag & drop photo here or <strong>browse</strong></span>
                      <span className="upload-subtext">JPG, PNG, WebP supported. Re-sized automatically.</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', justifyContent: 'space-between' }}>
                      <div className="form-group">
                        <label className="form-label" htmlFor="member_photo_url" style={{ fontSize: '0.75rem' }}>Or Image URL</label>
                        <input 
                          type="text" 
                          id="member_photo_url" 
                          className="form-control" 
                          placeholder="https://image-path.jpg"
                          style={{ padding: '0.5rem 0.75rem', fontSize: '0.85rem' }}
                          value={formPhotoUrl}
                          onChange={(e) => {
                            setFormPhotoUrl(e.target.value);
                            setUploadedBase64('');
                          }}
                        />
                      </div>
                      <button 
                        type="button" 
                        className="btn-premium btn-secondary" 
                        style={{ fontSize: '0.8rem', padding: '0.5rem' }}
                        onClick={() => fileInputRef.current.click()}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect><circle cx="9" cy="9" r="2"></circle><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"></path></svg> Select File
                      </button>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', borderTop: '1px solid rgba(255, 255, 255, 0.05)', paddingTop: '1.5rem' }}>
                  <button type="button" className="btn-premium btn-secondary" onClick={handleCancelForm}>Cancel</button>
                  <button type="submit" className="btn-premium btn-save">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg> Save Member Card
                  </button>
                </div>
              </form>
            </div>

            {/* Live Preview Column */}
            <div className="preview-column">
              <div className="preview-title">Live ID Card Preview</div>
              <div className="preview-card-wrapper" id="previewCardWrapper">
                <MemberCard member={dummyMember} isPreview={true} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* QR CODE DOWNLOAD MODAL */}
      {activeQrMember && (
        <div className="modal-overlay open" onClick={() => setActiveQrMember(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '380px', textAlign: 'center' }}>
            <button className="modal-close-btn" onClick={() => setActiveQrMember(null)}>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
            <h2 className="modal-name" style={{ fontSize: '1.4rem', marginBottom: '0.25rem', color: '#ffffff' }}>{activeQrMember.name}</h2>
            <div style={{ color: '#9ca3af', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
              Scan QR to view profile details
            </div>
            
            <div style={{ 
              background: '#ffffff', 
              padding: '1rem', 
              borderRadius: '16px', 
              display: 'inline-block', 
              boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
              marginBottom: '1rem' 
            }} id="admin-qr-canvas-container">
              <QRCodeCanvas 
                value={typeof window !== 'undefined' ? `${window.location.origin}/leads#${activeQrMember.id}` : ''}
                size={200}
                bgColor="#ffffff"
                fgColor="#000000"
                level="H"
                includeMargin={true}
              />
            </div>

            {/* Target URL Preview & Copy */}
            <div style={{ 
              background: 'rgba(255, 255, 255, 0.05)', 
              border: '1px solid rgba(255, 255, 255, 0.1)', 
              borderRadius: '8px', 
              padding: '0.5rem 0.75rem', 
              marginBottom: '1.25rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '0.5rem',
              textAlign: 'left'
            }}>
              <div style={{ 
                fontSize: '0.75rem', 
                color: '#a3e635', 
                fontFamily: 'monospace', 
                overflow: 'hidden', 
                textOverflow: 'ellipsis', 
                whiteSpace: 'nowrap' 
              }}>
                {typeof window !== 'undefined' ? `${window.location.origin}/leads#${activeQrMember.id}` : ''}
              </div>
              <button 
                type="button"
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#9ca3af',
                  cursor: 'pointer',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center'
                }}
                title="Copy link"
                onClick={() => {
                  if (typeof window !== 'undefined') {
                    navigator.clipboard.writeText(`${window.location.origin}/leads#${activeQrMember.id}`);
                    showToast('Link copied to clipboard!');
                  }
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
              </button>
            </div>
            
            <button 
              className="btn-premium btn-save" 
              style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
              onClick={handleDownloadQr}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
              Download QR Code (High Res)
            </button>
          </div>
        </div>
      )}

      {/* TOAST NOTIFICATION CONTAINER */}
      <div className={`toast-notification ${toast.show ? 'show' : ''} ${toast.isError ? 'error' : ''}`} id="toastNotification">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="18" 
          height="18" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke={toast.isError ? '#ef4444' : '#8de81e'} 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          {toast.isError ? (
            <>
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </>
          ) : (
            <>
              <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path>
              <polyline points="9 11 12 14 22 4"></polyline>
            </>
          )}
        </svg>
        <span id="toastMessage">{toast.message}</span>
      </div>
    </div>
  );
}
