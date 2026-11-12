/**
 * FIGO MEDIA — THE PERFORMANCE & SOCIAL GROWTH AGENCY
 * Core Interactive System: Live Video Previews, In-Card Audio Toggle,
 * Category Filtering, Adaptive Cinema Modal & Real-Time Dubai Clock
 */

document.addEventListener('DOMContentLoaded', () => {

  // ========================================================================
  // 1. LIVE DUBAI GST CLOCK (UTC+4) & FOOTER CLOCK
  // ========================================================================
  const clockElement = document.getElementById('clockTime');
  const footerClockElement = document.getElementById('footerClock');
  const timecodeElement = document.getElementById('timecodeDisplay');

  let frameCount = 14;

  function updateDubaiClock() {
    const now = new Date();
    const options = {
      timeZone: 'Asia/Dubai',
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    };

    try {
      const timeString = new Intl.DateTimeFormat('en-GB', options).format(now);
      if (clockElement) clockElement.textContent = `${timeString} GST`;
      if (footerClockElement) footerClockElement.textContent = `${timeString} GST`;

      if (timecodeElement) {
        frameCount = (frameCount + 1) % 25;
        const framesStr = String(frameCount).padStart(2, '0');
        timecodeElement.textContent = `TC ${timeString}:${framesStr}`;
      }
    } catch (e) {
      const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
      const dubaiTime = new Date(utc + (3600000 * 4));
      const h = String(dubaiTime.getHours()).padStart(2, '0');
      const m = String(dubaiTime.getMinutes()).padStart(2, '0');
      const s = String(dubaiTime.getSeconds()).padStart(2, '0');
      const fallbackStr = `${h}:${m}:${s}`;
      if (clockElement) clockElement.textContent = `${fallbackStr} GST`;
      if (footerClockElement) footerClockElement.textContent = `${fallbackStr} GST`;
    }
  }

  updateDubaiClock();
  setInterval(updateDubaiClock, 1000);

  // ========================================================================
  // 2. MOBILE DRAWER MENU
  // ========================================================================
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const mobileDrawerClose = document.getElementById('mobileDrawerClose');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  if (mobileMenuBtn && mobileDrawer) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileDrawer.classList.add('open');
      document.body.style.overflow = 'hidden';
    });

    if (mobileDrawerClose) {
      mobileDrawerClose.addEventListener('click', () => {
        mobileDrawer.classList.remove('open');
        document.body.style.overflow = '';
      });
    }

    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileDrawer.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // ========================================================================
  // 3. CATEGORY FILTERING WITH SMOOTH TRANSITION
  // ========================================================================
  const filterBtns = document.querySelectorAll('.filter-btn');
  const workCards = document.querySelectorAll('.work-card-landscape, .work-card-portrait');

  window.setCategoryFilter = function(category) {
    filterBtns.forEach(btn => {
      if (btn.getAttribute('data-filter') === category) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    workCards.forEach(card => {
      const cardCategory = card.getAttribute('data-category');
      if (category === 'all' || cardCategory === category) {
        card.style.display = 'flex';
        requestAnimationFrame(() => {
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        });
      } else {
        card.style.opacity = '0';
        card.style.transform = 'translateY(10px)';
        setTimeout(() => {
          if (card.style.opacity === '0') {
            card.style.display = 'none';
          }
        }, 250);
      }
    });
  };

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const cat = btn.getAttribute('data-filter');
      window.setCategoryFilter(cat);
    });
  });

  // ========================================================================
  // 4. LIVE IN-CARD VIDEO PLAYBACK & AUDIO CONTROLS
  // ========================================================================
  const liveVideos = document.querySelectorAll('.card-live-video');

  // IntersectionObserver to pause offscreen videos (optimizes GPU/CPU)
  if ('IntersectionObserver' in window) {
    const videoObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const video = entry.target;
        if (entry.isIntersecting) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      });
    }, { threshold: 0.15 });

    liveVideos.forEach(v => videoObserver.observe(v));
  }

  // Global Sound Toggle for Inline Video Cards
  window.toggleCardSound = function(btn, event) {
    if (event) event.stopPropagation();

    const card = btn.closest('.work-card-landscape, .work-card-portrait');
    if (!card) return;
    const video = card.querySelector('.card-live-video');
    if (!video) return;

    const isMuted = video.muted;

    // Mute all other videos first
    liveVideos.forEach(v => {
      if (v !== video) {
        v.muted = true;
        const otherBtn = v.closest('.work-card-landscape, .work-card-portrait')?.querySelector('.card-sound-toggle');
        if (otherBtn) updateSoundButtonState(otherBtn, true);
      }
    });

    // Toggle current video
    video.muted = !isMuted;
    updateSoundButtonState(btn, !isMuted);

    // If unmuting, ensure it is playing
    if (!video.muted && video.paused) {
      video.play().catch(() => {});
    }
  };

  function updateSoundButtonState(btn, isMuted) {
    const iconMuted = btn.querySelector('.sound-icon-muted');
    const iconUnmuted = btn.querySelector('.sound-icon-unmuted');
    const textLabel = btn.querySelector('.sound-label');

    if (isMuted) {
      if (iconMuted) iconMuted.style.display = 'inline-block';
      if (iconUnmuted) iconUnmuted.style.display = 'none';
      if (textLabel) textLabel.textContent = 'Mute';
      btn.classList.remove('sound-active');
    } else {
      if (iconMuted) iconMuted.style.display = 'none';
      if (iconUnmuted) iconUnmuted.style.display = 'inline-block';
      if (textLabel) textLabel.textContent = 'Playing Sound';
      btn.classList.add('sound-active');
    }
  }

  // ========================================================================
  // 5. ADAPTIVE CINEMA MODAL (Widescreen 16:9 & Vertical 9:16)
  // ========================================================================
  const videoModal = document.getElementById('videoModal');
  const modalBox = document.querySelector('.modal-box');
  const videoModalClose = document.getElementById('videoModalClose');
  const modalVideoPlayer = document.getElementById('modalVideoPlayer');
  const modalTitle = document.getElementById('modalVideoTitle');
  const modalCategory = document.getElementById('modalVideoCategory');

  window.openVideoPlayer = function(videoUrl, aspect = '16:9', title = '', category = '') {
    if (!modalVideoPlayer || !videoModal || !videoUrl) return;

    // Mute inline videos while modal is open
    liveVideos.forEach(v => {
      v.muted = true;
      const b = v.closest('.work-card-landscape, .work-card-portrait')?.querySelector('.card-sound-toggle');
      if (b) updateSoundButtonState(b, true);
    });

    modalVideoPlayer.src = videoUrl;
    modalVideoPlayer.muted = false;
    modalVideoPlayer.volume = 1.0;
    modalVideoPlayer.currentTime = 0;

    if (modalBox) {
      modalBox.classList.remove('landscape-mode', 'portrait-mode');
      if (aspect === '9:16') {
        modalBox.classList.add('portrait-mode');
      } else {
        modalBox.classList.add('landscape-mode');
      }
    }

    if (modalTitle) modalTitle.textContent = title || 'FIGO MEDIA Cinema Showcase';
    if (modalCategory) modalCategory.textContent = category || 'Selected Work';

    videoModal.classList.add('open');
    document.body.style.overflow = 'hidden';

    modalVideoPlayer.play().catch(err => {
      console.warn('Playback with audio prevented; trying muted:', err);
      modalVideoPlayer.muted = true;
      modalVideoPlayer.play().catch(e => console.error('Play failed:', e));
    });
  };

  function closeVideoModal() {
    if (modalVideoPlayer && videoModal) {
      modalVideoPlayer.pause();
      modalVideoPlayer.src = '';
      videoModal.classList.remove('open');
      document.body.style.overflow = '';
    }
  }

  if (videoModalClose) {
    videoModalClose.addEventListener('click', closeVideoModal);
  }

  if (videoModal) {
    videoModal.addEventListener('click', (e) => {
      if (e.target === videoModal) {
        closeVideoModal();
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && videoModal && videoModal.classList.contains('open')) {
      closeVideoModal();
    }
  });

  // ========================================================================
  // 6. BEHIND THE FRAME / FAQ ACCORDION
  // ========================================================================
  const faqRows = document.querySelectorAll('.faq-row');
  faqRows.forEach(row => {
    const qBar = row.querySelector('.faq-q-bar');
    if (qBar) {
      qBar.addEventListener('click', () => {
        const isActive = row.classList.contains('active');
        faqRows.forEach(r => r.classList.remove('active'));
        if (!isActive) {
          row.classList.add('active');
        }
      });
    }
  });

  // ========================================================================
  // 7. STICKY HEADER & SCROLL BEHAVIOR
  // ========================================================================
  const header = document.querySelector('.header-nav');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      if (header) {
        header.style.background = 'rgba(8, 9, 10, 0.94)';
        header.style.borderBottomColor = 'rgba(255, 255, 255, 0.08)';
      }
    } else {
      if (header) {
        header.style.background = 'rgba(8, 9, 10, 0.72)';
        header.style.borderBottomColor = 'rgba(255, 255, 255, 0.05)';
      }
    }
  });

});
