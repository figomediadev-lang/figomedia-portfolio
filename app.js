/**
 * FIGO MEDIA — THE PERFORMANCE & SOCIAL GROWTH AGENCY
 * Core Controller & Video Player System
 */

document.addEventListener('DOMContentLoaded', () => {

  // ========================================================================
  // 1. LIVE DUBAI GST CLOCK (UTC+4) & FOOTER CLOCK
  // ========================================================================
  const clockElement = document.getElementById('clockTime');
  const footerClockElement = document.getElementById('footerClock');
  const timecodeElement = document.getElementById('timecodeDisplay');

  let frameCount = 12;

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

      // Update REC Timecode with running frames
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
  // 3. CATEGORY FILTERING (Reels, Motorsport, Real Estate, Content, Events)
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
        card.style.opacity = '1';
      } else {
        card.style.display = 'none';
        card.style.opacity = '0';
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
  // 4. VIDEO PLAYER MODAL (Widescreen 16:9 & Vertical 9:16 Support)
  // ========================================================================
  const videoModal = document.getElementById('videoModal');
  const videoModalClose = document.getElementById('videoModalClose');
  const modalVideoPlayer = document.getElementById('modalVideoPlayer');

  window.openVideoPlayer = function(videoUrl) {
    if (!modalVideoPlayer || !videoModal || !videoUrl) return;

    modalVideoPlayer.src = videoUrl;
    modalVideoPlayer.muted = false;
    modalVideoPlayer.currentTime = 0;
    videoModal.classList.add('open');
    document.body.style.overflow = 'hidden';

    modalVideoPlayer.play().catch(err => {
      console.warn('Playback prevented or muted fallback needed:', err);
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
  // 5. FAQ ACCORDION
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
  // 6. SCROLL OPACITY EFFECTS
  // ========================================================================
  const header = document.querySelector('.header-nav');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.style.background = 'rgba(8, 9, 10, 0.94)';
      header.style.borderBottomColor = 'rgba(255, 255, 255, 0.08)';
    } else {
      header.style.background = 'rgba(8, 9, 10, 0.72)';
      header.style.borderBottomColor = 'rgba(255, 255, 255, 0.05)';
    }
  });

});
