import { createClient } from '@supabase/supabase-js';

// Supabase Credentials from Environment Variables with fallback
export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://vdjcbtaajitzrdlchbdk.supabase.co';
export const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_HmctEXxLzolbXzlzbGpwRw_ZFbkKskm';

// Create Supabase Client safely
export const supabaseClient = createClient(supabaseUrl, supabaseKey);

// 1. Hardcoded Fallback Database (Matches IEDC EXECOM 2026 TAGS)
export const defaultMembersData = [
  {
    id: "IEDC-EXE-0003",
    name: "Hazwa Sabjan V",
    role: "Chief Executive Officer",
    acronym: "CEO",
    dept: "Executive Board",
    sidebarRole: "CEO",
    tier: "leadership",
    phone: "IEDC-EXE-0003",
    email: "hazwasabjan123@gmail.com",
    linkedin: "https://linkedin.com",
    github: "https://github.com",
    avatar: "/hazwa_sabjan.jpg",
    joined: "May 2024",
    bio: "Chief Executive Officer at IEDC SIAS. Leads entrepreneurial initiatives, venture partnerships, and campus innovation strategy.",
    skills: ["Strategic Vision", "Executive Leadership", "Incubation", "Public Relations"],
    status: "active"
  },
  {
    id: "IEDC-EXE-0004",
    name: "Muhammed Shamil O",
    role: "Chief Executive Officer",
    acronym: "CEO",
    dept: "Executive Board",
    sidebarRole: "CEO",
    tier: "leadership",
    phone: "IEDC-EXE-0004",
    email: "muhammedshamilodakkal@gmail.com",
    linkedin: "https://linkedin.com",
    github: "https://github.com",
    avatar: "/muhammed_shamil.jpg",
    joined: "May 2024",
    bio: "Chief Executive Officer at IEDC SIAS driving executive vision, entrepreneurship incubation and student startup acceleration.",
    skills: ["Strategic Vision", "Executive Leadership", "Incubation", "Fundraising", "Public Speaking"],
    status: "active"
  },
  {
    id: "IEDC-EXE-0005",
    name: "B.A Faatimah Raneen",
    role: "Chief Technical Officer",
    acronym: "CTO",
    dept: "Executive Board",
    sidebarRole: "CTO",
    tier: "leadership",
    phone: "IEDC-EXE-0005",
    email: "raneenayn@gmail.com",
    linkedin: "https://linkedin.com",
    github: "https://github.com",
    avatar: "/faatimah_raneen.jpg",
    joined: "May 2024",
    bio: "Chief Technical Officer at IEDC SIAS. Architecting digital platforms, mentoring developers, and steering tech innovations.",
    skills: ["Full Stack Development", "Cloud Architecture", "System Design", "Technical Strategy"],
    status: "active"
  },
  {
    id: "IEDC-EXE-0001",
    name: "Fahmi H Murad",
    role: "Chief Marketing Officer",
    acronym: "CMO",
    dept: "Executive Board",
    sidebarRole: "MM",
    tier: "leadership",
    phone: "7025161262",
    email: "fhmurado10@gmail.com",
    linkedin: "https://linkedin.com",
    github: "https://github.com",
    avatar: "/fahmi_murad.jpg",
    joined: "May 2024",
    bio: "Chief Marketing Officer at IEDC SIAS. Spearheads strategic brand outreach, ecosystem partnerships, and student innovation initiatives.",
    skills: ["Marketing Strategy", "Brand Building", "Growth", "Leadership", "Public Relations"],
    status: "active"
  },
  {
    id: "IEDC-EXE-0002",
    name: "Vasil Vafeeque",
    role: "Nodal Officer",
    acronym: "NODAL",
    dept: "Dept of Commerce",
    sidebarRole: "NO",
    tier: "leadership",
    phone: "9847123456",
    email: "vasilvafeeque2@gmail.com",
    linkedin: "https://www.linkedin.com/in/vasil-vafeeque",
    github: "https://github.com",
    avatar: "/vasil_sir_pic_transparent.png",
    joined: "Jun 2023",
    bio: "Nodal Officer of IEDC SIAS. Assistant Professor in the Department of Commerce, facilitating entrepreneurship, innovation, and leadership growth among students.",
    skills: ["Commerce", "Mentorship", "Innovation", "Management", "Leadership"],
    status: "active"
  },
  {
    id: "CLB-011",
    name: "Elena Rostova",
    role: "Technical Lead",
    acronym: "TECH",
    dept: "Technical Committee",
    sidebarRole: "CR",
    tier: "core",
    phone: "9123456780",
    email: "elena.r@club.org",
    linkedin: "https://linkedin.com",
    github: "https://github.com",
    avatar: "/faatimah_raneen.jpg",
    joined: "May 2024",
    bio: "Full stack wizard and cloud solutions architect. Oversees core development teams, selects technical frameworks, and maintains production systems.",
    skills: ["React", "Node.js", "AWS Cloud", "Docker", "System Design"],
    status: "active"
  },
  {
    id: "CLB-051",
    name: "Liam Thompson",
    role: "Frontend Developer",
    acronym: "DEV",
    dept: "Creative Committee",
    sidebarRole: "AS",
    tier: "member",
    phone: "9876543210",
    email: "liam.t@club.org",
    linkedin: "https://linkedin.com",
    github: "https://github.com",
    avatar: "/fahmi_murad.jpg",
    joined: "Sep 2024",
    bio: "Aspiring software engineer specializing in interactive responsive websites, smooth CSS transitions, and modular frontend architectures.",
    skills: ["Vue.js", "Tailwind CSS", "JavaScript", "Webpack", "CSS Grid"],
    status: "active"
  }
];

// Clean inline SVG avatar fallback when no photo is uploaded
export const defaultAvatar = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="%2364748b" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>`;

// Helper to extract role acronym for the large badge header (e.g. CMO, CEO, NODAL, CTO)
export function getRoleAcronym(member) {
  if (!member) return 'IEDC';
  if (member.acronym && member.acronym.trim()) {
    return member.acronym.trim().toUpperCase();
  }

  const roleLower = (member.role || '').toLowerCase();
  if (roleLower.includes('executive') && roleLower.includes('chief')) return 'CEO';
  if (roleLower.includes('marketing') && roleLower.includes('chief')) return 'CMO';
  if (roleLower.includes('technology') && roleLower.includes('chief')) return 'CTO';
  if (roleLower.includes('technical') && roleLower.includes('chief')) return 'CTO';
  if (roleLower.includes('operating') && roleLower.includes('chief')) return 'COO';
  if (roleLower.includes('financial') && roleLower.includes('chief')) return 'CFO';
  if (roleLower.includes('nodal')) return 'NODAL';
  if (roleLower.includes('tech') || roleLower.includes('head of tech')) return 'CTO';
  if (roleLower.includes('creative') || roleLower.includes('design')) return 'DESIGN';
  if (roleLower.includes('frontend') || roleLower.includes('developer') || roleLower.includes('full stack')) return 'DEV';
  if (roleLower.includes('lead') || roleLower.includes('head')) return 'LEAD';

  if (member.sidebarRole && member.sidebarRole.length <= 6) {
    return member.sidebarRole.toUpperCase();
  }

  const words = (member.role || 'MEMBER').split(/\s+/).filter(Boolean);
  if (words.length >= 2) {
    const acronym = words.map(w => w[0]).join('').toUpperCase();
    if (acronym.length >= 2 && acronym.length <= 5) return acronym;
  }

  return (words[0] || 'IEDC').slice(0, 5).toUpperCase();
}

// Helper to format full role title in clean uppercase (e.g. CHIEF MARKETING OFFICER)
export function getRoleFullTitle(member) {
  if (!member || !member.role) return 'INNOVATOR';
  return member.role.toUpperCase();
}

// Helper to format member name into balanced uppercase lines matching the reference design
export function formatBadgeNameLines(name) {
  if (!name) return ['MEMBER', ''];
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return ['MEMBER', ''];
  if (parts.length === 1) return [parts[0].toUpperCase(), ''];
  if (parts.length === 2) return [parts[0].toUpperCase(), parts[1].toUpperCase()];

  // For 3 or more words, find the split index that best balances the two lines
  let bestSplit = 1;
  let minDiff = Infinity;
  for (let i = 1; i < parts.length; i++) {
    const len1 = parts.slice(0, i).join(' ').length;
    const len2 = parts.slice(i).join(' ').length;
    const penalty = len1 > 14 ? (len1 - 14) * 3 : 0;
    const diff = Math.abs(len1 - len2) + penalty;
    if (diff < minDiff) {
      minDiff = diff;
      bestSplit = i;
    }
  }
  return [
    parts.slice(0, bestSplit).join(' ').toUpperCase(),
    parts.slice(bestSplit).join(' ').toUpperCase()
  ];
}

// Helper to derive sidebar top letters / code (e.g. CEO, CTO, MM, NO, CR, AS)
export function getSidebarInitials(member) {
  if (!member) return 'CEO';
  if (member.sidebarRole && member.sidebarRole.trim()) {
    return member.sidebarRole.trim().toUpperCase();
  }
  if (member.acronym && member.acronym.trim()) {
    return member.acronym.trim().toUpperCase();
  }
  if (member.tier === 'leadership') return 'CEO';
  if (member.tier === 'core') return 'CTO';
  if (member.tier === 'member') return 'DEV';
  return 'MM';
}

// Helper to generate unique horizontal barcode lines based on member ID
export function generateBarcodeSVG(memberId) {
  let hash = 0;
  for (let i = 0; i < (memberId || '').length; i++) {
    hash = memberId.charCodeAt(i) + ((hash << 5) - hash);
  }

  let seed = Math.abs(hash);
  function nextRandom() {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  }

  let svgLines = '';
  let currentY = 2;
  const maxHeight = 85;

  while (currentY < maxHeight - 3) {
    const rand = nextRandom();
    const thickness = rand > 0.45 ? (rand > 0.8 ? 3 : 1.5) : 0.8;
    const spacing = 1.5 + nextRandom() * 4.0;

    svgLines += `<rect x="0" y="${currentY}" width="26" height="${thickness}" fill="#ffffff" opacity="0.85" />`;
    currentY += thickness + spacing;
  }

  return (
    `<svg width="26" height="${maxHeight}" viewBox="0 0 26 ${maxHeight}" xmlns="http://www.w3.org/2000/svg">
      ${svgLines}
    </svg>`
  );
}

// Get Department name based on role or tier
export function getDepartmentName(member) {
  if (member.dept) return member.dept.toUpperCase();
  if (member.tier === "leadership") return "EXECUTIVE BOARD";
  
  const roleLower = (member.role || '').toLowerCase();
  if (roleLower.includes("tech") || roleLower.includes("frontend") || roleLower.includes("full stack")) {
    return "TECHNICAL COMMITTEE";
  } else if (roleLower.includes("creative") || roleLower.includes("ux") || roleLower.includes("design")) {
    return "CREATIVE COMMITTEE";
  } else if (roleLower.includes("operations")) {
    return "OPERATIONS COMMITTEE";
  } else if (roleLower.includes("marketing")) {
    return "MARKETING COMMITTEE";
  }
  return "ASSISTANT";
}

// Helper to sort members by the numeric value at the end of their ID (e.g. iedc-exe-0002 -> 2)
export function sortMembersByIdNumber(a, b) {
  const matchA = a.id ? a.id.match(/\d+$/) : null;
  const matchB = b.id ? b.id.match(/\d+$/) : null;
  const numA = matchA ? parseInt(matchA[0], 10) : 0;
  const numB = matchB ? parseInt(matchB[0], 10) : 0;
  return numA - numB;
}
