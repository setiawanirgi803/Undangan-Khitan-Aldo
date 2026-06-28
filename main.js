// =============================================
// DEFAULT DATA
// =============================================
const DEFAULT = {
  fullname: 'Andi Richardo Kaka',
  nick: 'ALDO',
  order: 'Anak ke-2 dari 2 bersaudara',
  father: 'Andi Untung Selamet',
  mother: 'Yayah Rohaya',
  sibling: 'Andi Shevchenko',
  dateDisplay: 'Sabtu, 15 Agustus 2026',
  dateISO: '2026-08-15T11:00:00',
  time: 'Pukul 11.00 - 16.00 WIB',
  venue: 'Ballroom Hotel Santika Jakarta',
  address: 'Jl. Hayam Wuruk No. 125, Jakarta Barat',
  mapsUrl: 'https://maps.google.com/?q=Hotel+Santika+Hayam+Wuruk+Jakarta',
  bcaNum: '8720235619',
  bcaHolder: 'a/n Andi Untung Selamet',
  mandiriNum: '1230045678912',
  mandiriHolder: 'a/n Yayah Rohaya',
  giftAddr: 'Jl. Kebon Jeruk No. 45, Jakarta Barat',
  photoSrc: 'images/aldo.png',
  musicUrl: '' // Custom override; leave blank to use built-in fallback list
};

const STORAGE_KEY = 'aldo_invitation_data';
const WISHES_KEY = 'aldo_wishes';

function getData() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? Object.assign({}, DEFAULT, JSON.parse(stored)) : Object.assign({}, DEFAULT);
  } catch (e) { return Object.assign({}, DEFAULT); }
}

function saveData(d) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(d));
}

// =============================================
// MAPS URL AUTO-EMBED CONVERTER
// =============================================
function mapsUrlToEmbed(url) {
  if (!url) return '';
  url = url.trim();
  
  // If it's already an embed URL
  if (url.includes('/maps/embed') || url.includes('output=embed')) {
    return url;
  }
  
  // If it's a full iframe HTML tag, extract the src attribute
  if (url.startsWith('<iframe')) {
    const match = url.match(/src="([^"]+)"/);
    if (match) return match[1];
  }

  // Handle various Google Maps URL types
  try {
    if (url.includes('google.com/maps')) {
      // 1. Extract place name from /place/PLACE_NAME
      const placeMatch = url.match(/\/place\/([^/]+)/);
      if (placeMatch) {
        return `https://maps.google.com/maps?q=${placeMatch[1]}&output=embed&z=16`;
      }
      
      // 2. Extract query from /search/QUERY
      const searchMatch = url.match(/\/search\/([^/]+)/);
      if (searchMatch) {
        return `https://maps.google.com/maps?q=${searchMatch[1]}&output=embed&z=16`;
      }
      
      // 3. Extract coordinates from @lat,lng
      const atMatch = url.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
      if (atMatch) {
        return `https://maps.google.com/maps?q=${atMatch[1]},${atMatch[2]}&output=embed&z=16`;
      }
    }
  } catch(e) {
    console.warn("Failed to parse map URL:", e);
  }

  // Fallback: If it has a ?q= query param
  try {
    const u = new URL(url);
    const q = u.searchParams.get('q');
    if (q) return `https://maps.google.com/maps?q=${encodeURIComponent(q)}&output=embed&z=16`;
  } catch(e) {}

  // Default fallback: treat the entire input as a location name query
  return `https://maps.google.com/maps?q=${encodeURIComponent(url)}&output=embed&z=16`;
}

// =============================================
// RENDER PAGE FROM DATA
// =============================================
function renderPage() {
  const d = getData();
  const urlParams = new URLSearchParams(window.location.search);
  const guestName = urlParams.get('to');

  // Cover
  setText('cover-name-display', d.nick);
  setText('cover-fullname-display', d.fullname);
  setText('cover-date-display', d.dateDisplay);
  setText('guest-name-display', guestName ? decodeURIComponent(guestName) : 'Tamu Undangan');

  // Profile
  setText('child-fullname-display', d.fullname);
  setText('child-nick-display', 'Panggilan: ' + d.nick);
  document.getElementById('child-nick-display').innerHTML = 'Panggilan: <strong>' + d.nick + '</strong>';
  setText('child-order-display', d.order);
  setText('parents-display', 'Bapak ' + d.father + ' & Ibu ' + d.mother);
  document.getElementById('sibling-display').innerHTML = 'Adik dari: <strong>' + d.sibling + '</strong>';

  // Event
  setText('event-date-display', d.dateDisplay);
  setText('event-time-display', d.time);
  setText('event-venue-display', d.venue);
  setText('event-address-display', d.address);
  const mapsLink = document.getElementById('maps-link');
  if (mapsLink) mapsLink.href = d.mapsUrl || '#';
  const mapsEmbed = document.getElementById('maps-embed');
  if (mapsEmbed) {
    // Auto-generate embed URL from the single mapsUrl field
    const embedSrc = mapsUrlToEmbed(d.mapsUrl || '');
    if (embedSrc) mapsEmbed.src = embedSrc;
  }

  // Gift
  setText('bca-num', d.bcaNum);
  setText('bca-holder', d.bcaHolder);
  setText('mandiri-num', d.mandiriNum);
  setText('mandiri-holder', d.mandiriHolder);
  setText('gift-addr', d.giftAddr);

  // Footer
  setText('footer-family-display', 'Bapak ' + d.father + ' & Ibu ' + d.mother);
  setText('footer-kids-display', d.sibling + ' & ' + d.nick);

  // Photo
  const photo = document.getElementById('profile-photo');
  if (photo) photo.src = d.photoSrc || DEFAULT.photoSrc;

  // Audio: schedule src init (runs after MUSIC section initializes)
  if (typeof initAudioSrc === 'function') initAudioSrc(d.musicUrl || '');
}

function setText(id, val) {
  const el = document.getElementById(id);
  if (el) el.textContent = val;
}

// =============================================
// COVER OPEN
// =============================================
document.getElementById('btn-open').addEventListener('click', () => {
  document.getElementById('cover-screen').classList.add('opened');
  document.body.classList.remove('scroll-locked');
  const main = document.getElementById('main-content');
  main.classList.remove('content-hidden');
  main.classList.add('content-visible');
  document.getElementById('music-btn').classList.remove('hidden');
  playMusic();
  startCountdown();
});

// =============================================
// PARTICLES
// =============================================
function spawnParticles() {
  const container = document.getElementById('cover-particles');
  if (!container) return;
  for (let i = 0; i < 30; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    p.style.left = Math.random() * 100 + '%';
    p.style.top = Math.random() * 100 + '%';
    p.style.width = (Math.random() * 4 + 2) + 'px';
    p.style.height = p.style.width;
    p.style.animationDuration = (Math.random() * 12 + 8) + 's';
    p.style.animationDelay = (Math.random() * 6) + 's';
    container.appendChild(p);
  }
}
spawnParticles();

// =============================================
// MUSIC  
// Robust multi-source audio with Web Audio API fallback
// =============================================

// Candidate remote URLs (tried in order)
const MUSIC_SOURCES = [
  'https://cdn.freesound.org/previews/706/706753_5674468-lq.mp3',
  'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'
];

const audio = document.getElementById('bg-audio');
let musicPlaying = false;
let audioReady = false;
let pendingPlay = false;
let currentSourceIdx = 0;
let synth = null; // Web Audio API context for fallback
let synthInterval = null; // Store interval ID for cleanup

// -- initAudioSrc: called from renderPage if admin sets custom URL
function initAudioSrc(customSrc) {
  if (!audio) return;
  const targetSrc = customSrc || MUSIC_SOURCES[0];
  const current = audio.getAttribute('data-src') || '';
  if (current === targetSrc) return;
  audio.setAttribute('data-src', targetSrc);
  audio.src = targetSrc;
  audio.volume = 0.45;
  audio.load();
  audioReady = false;
}

// -- Try next remote source on error
function tryNextSource() {
  currentSourceIdx++;
  if (currentSourceIdx < MUSIC_SOURCES.length) {
    audio.src = MUSIC_SOURCES[currentSourceIdx];
    audio.load();
  } else {
    // All remote sources failed – use synthesized ambient tone
    console.info('All remote audio sources failed. Starting synthesized ambient music.');
    startSynthMusic();
  }
}

audio.addEventListener('canplay', () => {
  audioReady = true;
  if (pendingPlay || synth) {
    // Remote audio is ready - stop synth if running and switch to real audio
    pendingPlay = false;
    if (synth) {
      stopSynthMusic();
    }
    audio.volume = 0.45;
    audio.play().then(() => {
      musicPlaying = true;
      updateMusicUI();
    }).catch(err => {
      console.warn('canplay play() blocked:', err);
      // Restart synth if audio play was blocked
      if (!musicPlaying) startSynthMusic();
    });
  }
});

audio.addEventListener('error', () => {
  console.warn('Audio source failed, trying next...');
  if (pendingPlay || musicPlaying) tryNextSource();
});

function playMusic() {
  // Strategy: immediately play remote audio if ready. Otherwise, trigger load or fall back to synth.
  const customUrl = getData().musicUrl || '';

  if (customUrl) {
    // Ensure correct source is set
    if (!audio.src || !audio.src.includes(customUrl)) {
      audio.src = customUrl;
      audio.volume = 0.45;
      audio.load();
      audioReady = false;
    }
    
    if (audioReady) {
      audio.play().then(() => {
        musicPlaying = true;
        updateMusicUI();
      }).catch(err => {
        console.warn('play() blocked for custom URL:', err);
        startSynthMusic();
      });
    } else {
      pendingPlay = true;
      // Fallback to synth if it takes too long to load (e.g. 4 seconds)
      setTimeout(() => {
        if (pendingPlay && !musicPlaying) {
          pendingPlay = false;
          startSynthMusic();
        }
      }, 4000);
    }
  } else {
    // No custom URL: play remote default if ready, otherwise start synth immediately and load in bg
    if (audioReady) {
      audio.play().then(() => {
        musicPlaying = true;
        updateMusicUI();
      }).catch(err => {
        console.warn('play() blocked for default URL:', err);
        startSynthMusic();
      });
    } else {
      startSynthMusic();
      // Load in background
      if (!audio.src || audio.src === window.location.href) {
        audio.src = MUSIC_SOURCES[currentSourceIdx];
        audio.volume = 0.45;
        audio.load();
      }
    }
  }
}

// -- Web Audio API synthesized ambient music (Islamic Maqam Rast-inspired soft tones)
function startSynthMusic() {
  if (synth) return; // already running
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    synth = ctx;
    // Islamic Maqam Rast-inspired pentatonic sequence (C D E G A)
    const notes = [264, 297, 330, 396, 440, 396, 352, 330, 297, 264];
    let noteIdx = 0;

    function playNote() {
      if (!synth || synth.state === 'closed') return;
      const now = ctx.currentTime;
      const freq = notes[noteIdx % notes.length];
      noteIdx++;

      // Primary oscillator (sine wave – warm and soft)
      const osc1 = ctx.createOscillator();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(freq, now);

      // Harmonic overtone (octave up, very soft)
      const osc2 = ctx.createOscillator();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(freq * 2, now);

      // Low-pass filter
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1200, now);

      // Gain envelope (soft attack and release)
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.12, now + 0.4);
      gain.gain.linearRampToValueAtTime(0.09, now + 1.4);
      gain.gain.linearRampToValueAtTime(0, now + 2.2);

      const gainOvt = ctx.createGain();
      gainOvt.gain.setValueAtTime(0, now);
      gainOvt.gain.linearRampToValueAtTime(0.03, now + 0.4);
      gainOvt.gain.linearRampToValueAtTime(0, now + 2.2);

      osc1.connect(filter);
      osc2.connect(gainOvt);
      filter.connect(gain);
      gainOvt.connect(ctx.destination);
      gain.connect(ctx.destination);

      osc1.start(now);
      osc1.stop(now + 2.2);
      osc2.start(now);
      osc2.stop(now + 2.2);
    }

    playNote();
    synthInterval = setInterval(() => {
      if (!synth || synth.state === 'closed') {
        clearInterval(synthInterval);
        synthInterval = null;
        return;
      }
      playNote();
    }, 2400);

    musicPlaying = true;
    updateMusicUI();
  } catch(e) {
    console.warn('Web Audio API not available:', e);
  }
}

function stopSynthMusic() {
  if (synthInterval) {
    clearInterval(synthInterval);
    synthInterval = null;
  }
  if (synth) {
    try { synth.close(); } catch(e) {}
    synth = null;
  }
}

function toggleMusic() {
  if (!audio) return;
  if (musicPlaying) {
    if (synth) {
      stopSynthMusic();
    } else {
      audio.pause();
    }
    musicPlaying = false;
  } else {
    if (audioReady) {
      audio.play().then(() => {
        musicPlaying = true;
      }).catch(() => startSynthMusic());
    } else {
      startSynthMusic();
    }
  }
  updateMusicUI();
}

function updateMusicUI() {
  const iconOn = document.getElementById('music-icon-on');
  const iconOff = document.getElementById('music-icon-off');
  if (iconOn && iconOff) {
    iconOn.classList.toggle('hidden', !musicPlaying);
    iconOff.classList.toggle('hidden', musicPlaying);
  }
}

// =============================================
// COUNTDOWN TIMER
// =============================================
let countdownTimer = null;

function startCountdown() {
  if (countdownTimer) return;
  const d = getData();
  const target = new Date(d.dateISO).getTime();

  function tick() {
    const now = Date.now();
    const diff = target - now;
    if (diff <= 0) {
      clearInterval(countdownTimer);
      ['cd-days','cd-hours','cd-minutes','cd-seconds'].forEach(id => setText(id, '00'));
      return;
    }
    setText('cd-days', pad(Math.floor(diff / 86400000)));
    setText('cd-hours', pad(Math.floor((diff % 86400000) / 3600000)));
    setText('cd-minutes', pad(Math.floor((diff % 3600000) / 60000)));
    setText('cd-seconds', pad(Math.floor((diff % 60000) / 1000)));
  }
  tick();
  countdownTimer = setInterval(tick, 1000);
}

function pad(n) { return String(n).padStart(2, '0'); }

// =============================================
// RSVP & WISHES
// =============================================
const DEFAULT_WISHES = [
  { name: 'Ustadz Ahmad Fauzi', status: 'Hadir', text: 'Selamat berkhitan Aldo. Semoga menjadi anak yang sholeh, berbakti pada orang tua, dan selalu dalam lindungan Allah SWT. Aamiin.', time: '2 jam yang lalu' },
  { name: 'Keluarga Pak Budi', status: 'Hadir', text: 'Selamat atas khitanannya! Semoga lekas sehat dan tumbuh menjadi kebanggaan keluarga dan bangsa.', time: '5 jam yang lalu' },
  { name: 'Tante Rina & Om Ferry', status: 'Tidak Hadir', text: 'Maaf belum bisa hadir. Doa terbaik kami selalu untuk Aldo yang pemberani!', time: '1 hari yang lalu' }
];

function getWishes() {
  try {
    const s = localStorage.getItem(WISHES_KEY);
    return s ? JSON.parse(s) : DEFAULT_WISHES;
  } catch(e) { return DEFAULT_WISHES; }
}

function renderWishes() {
  const feed = document.getElementById('wishes-feed');
  if (!feed) return;
  feed.innerHTML = '';
  getWishes().forEach(w => {
    const card = document.createElement('div');
    card.className = 'wish-card';
    const isHadir = w.status === 'Hadir';
    card.innerHTML = `<div class="wish-top"><span class="wish-name">${esc(w.name)}</span><span class="wish-badge ${isHadir ? 'badge-hadir' : 'badge-absent'}">${esc(w.status)}</span></div><p class="wish-text">"${esc(w.text)}"</p><span class="wish-time">${esc(w.time)}</span>`;
    feed.appendChild(card);
  });
}

function esc(s) {
  return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}

document.getElementById('rsvp-form').addEventListener('submit', e => {
  e.preventDefault();
  const name = document.getElementById('f-name').value.trim();
  const status = document.querySelector('input[name=att]:checked').value;
  const text = document.getElementById('f-wish').value.trim();
  if (!name || !text) return;
  const wishes = getWishes();
  wishes.unshift({ name, status, text, time: 'baru saja' });
  localStorage.setItem(WISHES_KEY, JSON.stringify(wishes));
  renderWishes();
  e.target.reset();
  document.getElementById('guests-fg').style.display = 'flex';
  showToast('✓ Konfirmasi & doa berhasil dikirim!');
});

document.querySelectorAll('input[name=att]').forEach(r => {
  r.addEventListener('change', e => {
    document.getElementById('guests-fg').style.display = e.target.value === 'Hadir' ? 'flex' : 'none';
  });
});

// =============================================
// GIFT TOGGLE
// =============================================
let giftOpen = false;
function toggleGift() {
  giftOpen = !giftOpen;
  const body = document.getElementById('gift-body');
  body.classList.toggle('collapsed', !giftOpen);
  body.classList.toggle('expanded', giftOpen);
  const btn = document.getElementById('gift-toggle');
  btn.textContent = giftOpen ? '▲ Sembunyikan' : '▾ Tampilkan Rekening & Hadiah';
}

// =============================================
// COPY TO CLIPBOARD
// =============================================
function copyEl(id, btn) {
  const text = document.getElementById(id).textContent.trim();
  const orig = btn.innerHTML;
  navigator.clipboard ? navigator.clipboard.writeText(text).then(() => copyFeedback(btn, orig)) : fallbackCopy(text, btn, orig);
}

function fallbackCopy(text, btn, orig) {
  const ta = document.createElement('textarea');
  ta.value = text;
  ta.style.position = 'fixed';
  document.body.appendChild(ta);
  ta.select();
  try { document.execCommand('copy'); copyFeedback(btn, orig); } catch(e) {}
  document.body.removeChild(ta);
}

function copyFeedback(btn, orig) {
  btn.textContent = '✓ Tersalin!';
  btn.style.color = 'var(--gold2)';
  showToast('✓ Berhasil disalin ke clipboard!');
  setTimeout(() => { btn.innerHTML = orig; btn.style.color = ''; }, 2000);
}

// =============================================
// TOAST
// =============================================
function showToast(msg) {
  const root = document.getElementById('toast-root');
  const t = document.createElement('div');
  t.className = 'toast';
  t.textContent = msg;
  root.appendChild(t);
  setTimeout(() => t.remove(), 3200);
}

// =============================================
// ADMIN PANEL
// =============================================
function openAdmin() {
  const d = getData();
  // Fill fields
  const fields = {
    'a-fullname': d.fullname, 'a-nick': d.nick, 'a-order': d.order,
    'a-father': d.father, 'a-mother': d.mother, 'a-sibling': d.sibling,
    'a-date-display': d.dateDisplay, 'a-time': d.time,
    'a-venue': d.venue, 'a-address': d.address,
    'a-maps-url': d.mapsUrl,
    'a-music-url': d.musicUrl || '',
    'a-bca-num': d.bcaNum, 'a-bca-holder': d.bcaHolder,
    'a-mandiri-num': d.mandiriNum, 'a-mandiri-holder': d.mandiriHolder,
    'a-gift-addr': d.giftAddr
  };
  Object.entries(fields).forEach(([id, val]) => {
    const el = document.getElementById(id);
    if (el) el.value = val || '';
  });
  const isoEl = document.getElementById('a-date-iso');
  if (isoEl) isoEl.value = d.dateISO ? d.dateISO.slice(0,16) : '';

  const preview = document.getElementById('a-photo-preview');
  if (preview) preview.src = d.photoSrc || DEFAULT.photoSrc;
  const photoUrl = document.getElementById('a-photo-url');
  if (photoUrl) photoUrl.value = d.photoSrc || '';

  populateExportCode();
  document.getElementById('admin-overlay').classList.remove('hidden');
}

function closeAdmin() {
  document.getElementById('admin-overlay').classList.add('hidden');
}

function closeAdminOutside(e) {
  if (e.target.id === 'admin-overlay') closeAdmin();
}

function switchTab(tabId, btn) {
  document.querySelectorAll('.admin-tab-content').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.atab').forEach(b => b.classList.remove('active'));
  document.getElementById(tabId).classList.add('active');
  btn.classList.add('active');
}

function saveAdminData() {
  const d = getData();
  const map = {
    fullname: 'a-fullname', nick: 'a-nick', order: 'a-order',
    father: 'a-father', mother: 'a-mother', sibling: 'a-sibling',
    dateDisplay: 'a-date-display', time: 'a-time',
    venue: 'a-venue', address: 'a-address',
    mapsUrl: 'a-maps-url',
    bcaNum: 'a-bca-num', bcaHolder: 'a-bca-holder',
    mandiriNum: 'a-mandiri-num', mandiriHolder: 'a-mandiri-holder',
    giftAddr: 'a-gift-addr', musicUrl: 'a-music-url'
  };
  Object.entries(map).forEach(([key, id]) => {
    const el = document.getElementById(id);
    if (el) d[key] = el.value.trim();
  });
  const isoEl = document.getElementById('a-date-iso');
  if (isoEl && isoEl.value) d.dateISO = isoEl.value;
  const photoUrl = document.getElementById('a-photo-url').value.trim();
  if (photoUrl) d.photoSrc = photoUrl;

  saveData(d);
  renderPage();
  populateExportCode();

  // If music URL changed, reload audio immediately
  const newMusicUrl = d.musicUrl || '';
  if (newMusicUrl) {
    // Reset audio to new URL and attempt play
    audio.removeAttribute('data-src'); // Force reinit
    stopSynthMusic();
    audioReady = false;
    musicPlaying = false;
    audio.src = newMusicUrl;
    audio.volume = 0.45;
    audio.load();
    pendingPlay = true; // Will play when canplay fires
  } else if (musicPlaying) {
    playMusic();
  }

  if (countdownTimer) { clearInterval(countdownTimer); countdownTimer = null; startCountdown(); }
  closeAdmin();
  showToast('✓ Perubahan berhasil disimpan!');
}

function resetAdminData() {
  if (!confirm('Reset semua data ke pengaturan awal?')) return;
  localStorage.removeItem(STORAGE_KEY);
  renderPage();
  if (musicPlaying) {
    playMusic();
  }
  if (countdownTimer) { clearInterval(countdownTimer); countdownTimer = null; startCountdown(); }
  closeAdmin();
  showToast('✓ Data berhasil direset ke default.');
}

function handlePhotoUpload(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    const src = e.target.result;
    document.getElementById('a-photo-preview').src = src;
    document.getElementById('a-photo-url').value = src;
  };
  reader.readAsDataURL(file);
}

// =============================================
// GUEST LINK GENERATOR
// =============================================
function generateGuestLink() {
  const name = document.getElementById('a-guest-name').value.trim();
  if (!name) { showToast('Masukkan nama tamu terlebih dahulu.'); return; }
  const base = window.location.origin + window.location.pathname;
  const link = `${base}?to=${encodeURIComponent(name)}`;
  document.getElementById('guest-link-output').value = link;
  document.getElementById('guest-link-result').classList.remove('hidden');
}

function copyGuestLink() {
  const val = document.getElementById('guest-link-output').value;
  if (!val) return;
  navigator.clipboard ? navigator.clipboard.writeText(val).then(() => showToast('✓ Link tamu berhasil disalin!')) : (() => {
    document.getElementById('guest-link-output').select();
    document.execCommand('copy');
    showToast('✓ Link tamu berhasil disalin!');
  })();
}

// =============================================
// EXPORT CONFIGURATION
// =============================================
function populateExportCode() {
  const currentData = getData();
  const textarea = document.getElementById('export-code-output');
  if (textarea) {
    textarea.value = `const DEFAULT = ${JSON.stringify(currentData, null, 2)};`;
  }
}

function exportConfig() {
  const currentData = getData();
  fetch('main.js')
    .then(r => r.text())
    .then(text => {
      const defaultRegex = /const DEFAULT = \{[\s\S]*?\};/;
      const newDefaultStr = `const DEFAULT = ${JSON.stringify(currentData, null, 2)};`;
      const newText = text.replace(defaultRegex, newDefaultStr);
      
      const blob = new Blob([newText], { type: 'application/javascript' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'main.js';
      a.click();
      URL.revokeObjectURL(url);
      showToast('✓ main.js berhasil di-download! Ganti file lama Anda.');
    })
    .catch(e => {
      console.error(e);
      showToast('Gagal memuat main.js untuk diekspor.');
    });
}

function copyExportCode() {
  const val = document.getElementById('export-code-output').value;
  if (!val) return;
  navigator.clipboard ? navigator.clipboard.writeText(val).then(() => showToast('✓ Kode DEFAULT berhasil disalin!')) : (() => {
    document.getElementById('export-code-output').select();
    document.execCommand('copy');
    showToast('✓ Kode DEFAULT berhasil disalin!');
  })();
}

function checkAdminAccess() {
  const urlParams = new URLSearchParams(window.location.search);
  const isAdmin = urlParams.has('admin');
  const settingsBtn = document.getElementById('settings-btn');
  if (settingsBtn) {
    if (isAdmin) {
      settingsBtn.classList.remove('hidden');
    } else {
      settingsBtn.classList.add('hidden');
    }
  }
}

// =============================================
// INIT
// =============================================
document.addEventListener('DOMContentLoaded', () => {
  renderPage();
  renderWishes();
  checkAdminAccess();
});
