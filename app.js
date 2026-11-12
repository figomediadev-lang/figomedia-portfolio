/**
 * FIGO MEDIA — THE PERFORMANCE & SOCIAL GROWTH AGENCY
 * Core Interactive Controller
 */

document.addEventListener('DOMContentLoaded', () => {

  // ========================================================================
  // 1. LIVE DUBAI GST CLOCK (UTC+4)
  // ========================================================================
  const clockElement = document.getElementById('clockTime');
  
  function updateDubaiClock() {
    if (!clockElement) return;
    const now = new Date();
    // Format in Dubai Timezone (Asia/Dubai, UTC+4)
    const options = {
      timeZone: 'Asia/Dubai',
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    };
    try {
      const timeString = new Intl.DateTimeFormat('en-GB', options).format(now);
      clockElement.textContent = `${timeString} GST`;
    } catch (e) {
      // Fallback calculation for UTC+4
      const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
      const dubaiTime = new Date(utc + (3600000 * 4));
      const h = String(dubaiTime.getHours()).padStart(2, '0');
      const m = String(dubaiTime.getMinutes()).padStart(2, '0');
      const s = String(dubaiTime.getSeconds()).padStart(2, '0');
      clockElement.textContent = `${h}:${m}:${s} GST`;
    }
  }

  updateDubaiClock();
  setInterval(updateDubaiClock, 1000);

  // ========================================================================
  // 2. MOBILE NAVIGATION DRAWER
  // ========================================================================
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const mobileDrawerClose = document.getElementById('mobileDrawerClose');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  function openDrawer() {
    mobileDrawer.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    mobileDrawer.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (mobileMenuBtn && mobileDrawer) {
    mobileMenuBtn.addEventListener('click', openDrawer);
    mobileDrawerClose.addEventListener('click', closeDrawer);
    mobileLinks.forEach(link => {
      link.addEventListener('click', closeDrawer);
    });
  }

  // ========================================================================
  // 3. CAPABILITIES / SERVICES ACCORDION
  // ========================================================================
  const serviceCards = document.querySelectorAll('.service-row-card');

  serviceCards.forEach(card => {
    const summaryBar = card.querySelector('.service-summary-bar');
    if (summaryBar) {
      summaryBar.addEventListener('click', () => {
        const isActive = card.classList.contains('active');
        // Toggle current card
        if (isActive) {
          card.classList.remove('active');
        } else {
          // Collapse others (optional, keeps view clean)
          serviceCards.forEach(c => c.classList.remove('active'));
          card.classList.add('active');
        }
      });
    }
  });

  // ========================================================================
  // 4. SELECTED WORK FILTERING
  // ========================================================================
  const filterBtns = document.querySelectorAll('.filter-btn');
  const workCards = document.querySelectorAll('.work-item-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterVal = btn.getAttribute('data-filter');

      workCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterVal === 'all' || category === filterVal) {
          card.style.display = 'flex';
          card.style.opacity = '1';
        } else {
          card.style.display = 'none';
          card.style.opacity = '0';
        }
      });
    });
  });

  // ========================================================================
  // 5. IN MOTION / VIDEO SHOWREEL HOVER & MODAL PLAYER
  // ========================================================================
  const reelCards = document.querySelectorAll('.reel-card');
  const videoModal = document.getElementById('videoModal');
  const videoModalClose = document.getElementById('videoModalClose');
  const modalVideoPlayer = document.getElementById('modalVideoPlayer');

  reelCards.forEach(card => {
    const videoUrl = card.getAttribute('data-video');
    const previewVideo = card.querySelector('.reel-video-preview');

    // On hover preview
    card.addEventListener('mouseenter', () => {
      if (previewVideo && videoUrl) {
        if (!previewVideo.src) {
          previewVideo.src = videoUrl;
        }
        card.classList.add('is-hovering');
        previewVideo.play().catch(() => {});
      }
    });

    card.addEventListener('mouseleave', () => {
      if (previewVideo) {
        card.classList.remove('is-hovering');
        previewVideo.pause();
      }
    });

    // On click -> Open fullscreen modal with sound
    card.addEventListener('click', () => {
      if (modalVideoPlayer && videoModal && videoUrl) {
        modalVideoPlayer.src = videoUrl;
        modalVideoPlayer.muted = false;
        videoModal.classList.add('open');
        document.body.style.overflow = 'hidden';
        modalVideoPlayer.play().catch(() => {});
      }
    });
  });

  function closeVideoModal() {
    if (modalVideoPlayer && videoModal) {
      modalVideoPlayer.pause();
      modalVideoPlayer.currentTime = 0;
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
      if (e.target === videoModal) closeVideoModal();
    });
  }

  // ========================================================================
  // 6. CASE STUDY DETAIL MODAL
  // ========================================================================
  const caseModal = document.getElementById('caseModal');
  const caseModalClose = document.getElementById('caseModalClose');
  const caseModalContent = document.getElementById('caseModalContent');

  const caseStudiesData = {
    ecom: {
      tag: "Performance & E-Commerce",
      title: "E-Commerce Revenue Engine ($285K+ Monthly Scale)",
      client: "Multi-Brand Consumer Goods (Shopify & Marketplaces)",
      heroImg: "assets/work-ecom-pSvyTuRE.jpg",
      metrics: [
        { val: "$285,420", label: "Monthly Gross Revenue" },
        { val: "4.82x", label: "Blended ROAS" },
        { val: "4,320", label: "Monthly Orders" },
        { val: "$18,753", label: "Ad Spend Optimized" }
      ],
      challenge: "The brand struggled with inconsistent customer acquisition costs on Meta and fragmented inventory tracking across Shopify, Noon, and Amazon UAE.",
      strategy: "Figo Media deployed a unified e-commerce scaling engine: full-funnel Meta and TikTok creative sprints testing 20+ hook variations per month, automated dynamic retargeting, and dynamic pricing rules across GCC marketplaces.",
      results: "Grew monthly revenue from $94,000 to over $285,000 within 90 days while maintaining a verified 4.82x blended ROAS.",
      deliverables: ["Meta & TikTok Ad Buying", "Dynamic Product Catalog Ads", "Shopify CRO", "Cross-Platform Inventory Sync", "Weekly Performance Audits"]
    },
    aggregators: {
      tag: "Aggregator Management // UAE",
      title: "Aggregator Dominance Suite (Talabat, Deliveroo, Noon, Careem)",
      client: "UAE F&B and Retail Chains",
      heroImg: "assets/work-aggregators-Dh4rNccG.jpg",
      metrics: [
        { val: "6 Apps", label: "Unified Management" },
        { val: "+140%", label: "Platform Visibility Surge" },
        { val: "Zero Lag", label: "Menu & Price Sync" },
        { val: "+34%", label: "Average Order Value (AOV)" }
      ],
      challenge: "Managing separate portals for Talabat, Deliveroo, Noon Food, Smiles, Keeta, and Careem caused high menu delays, stockouts, and poor algorithmic positioning.",
      strategy: "We implemented complete end-to-end aggregator operations: algorithmic menu restructuring, in-app banner bidding, optimized photography, and promotional bundling.",
      results: "Secured top-3 category ranking in prime Dubai delivery zones and expanded sales volume by 140% without hiring additional in-house staff.",
      deliverables: ["Portal Management", "Algorithmic In-App Ads", "Menu Engineering", "Instant Financial Reconciliation", "Driver Wait-Time Optimization"]
    },
    ads: {
      tag: "Paid Media // Growth",
      title: "Multi-Platform Precision Ads Scaling",
      client: "High-Growth DTC Lifestyle Brand",
      heroImg: "assets/work-ads-iShBXKIS.jpg",
      metrics: [
        { val: "$18,700", label: "Ad Spend Managed" },
        { val: "4.82x", label: "ROAS Achieved" },
        { val: "-38%", label: "Customer Acquisition Cost" },
        { val: "+210%", label: "Repeat Purchase Rate" }
      ],
      challenge: "High ad fatigue and rising CPAs on standard Meta image ads led to stalled scaling above $5,000/month.",
      strategy: "Figo Media introduced high-velocity vertical video ad creatives, scripting hook-first angles targeting distinct GCC customer personas, combined with CBO bidding structures.",
      results: "Successfully scaled ad spend from $5K to $18.7K+ per month profitably, cutting CPA by 38% while driving a 4.82x return on ad spend.",
      deliverables: ["Meta Ads Architecture", "TikTok Ads Testing", "Audience Segmentation", "UGC Creative Production", "ROAS Analytics"]
    },
    production: {
      tag: "Film & Production",
      title: "Commercial Cinematography & Product Films",
      client: "Luxury Lifestyle & Automotive Brands",
      heroImg: "assets/work-production-CdUKgkyP.jpg",
      metrics: [
        { val: "4K Master", label: "Cinema Grade Resolution" },
        { val: "9:16 + 16:9", label: "Multi-Ratio Cuts" },
        { val: "100%", label: "In-House Post Production" },
        { val: "30+ Reels", label: "Delivered Monthly" }
      ],
      challenge: "Brands needed cinema-quality visual storytelling that looked ultra-expensive without requiring a massive Hollywood production crew.",
      strategy: "Utilizing minimalist high-end camera rigs, creative lighting (smoke, practical motors, polarized fixtures), and rapid sprint shooting across UAE locations.",
      results: "Delivered striking commercial commercials, social reels, and product launch films that elevated brand perception and delivered record engagement on social.",
      deliverables: ["Creative Direction", "Location & Studio Shoot", "DaVinci Color Grade", "Sound Design & Scoring", "Social Media Cut-downs"]
    },
    model: {
      tag: "Commercial Photography",
      title: "Editorial Model & Fashion Photography",
      client: "Contemporary Fashion & Apparel Brands",
      heroImg: "assets/work-model-photo-DBnaOKIf.jpg",
      metrics: [
        { val: "High Fashion", label: "Art Direction" },
        { val: "Lookbook", label: "Catalog Ready" },
        { val: "Commercial", label: "High-End Retouching" },
        { val: "+85%", label: "CTR on Social Ads" }
      ],
      challenge: "Creating editorial campaign imagery that drives both high-fashion prestige and high click-through rates on paid social ads.",
      strategy: "Art-directed studio and urban shoots with professional models, styled for lifestyle resonance and cropped specifically for mobile feeds.",
      results: "Provided full seasonal lookbooks and high-converting ad creative collateral that outperformed standard product images by 85% CTR.",
      deliverables: ["Model Casting", "Art Direction", "Commercial Retouching", "Social Ad Crops", "Lookbook Production"]
    },
    product: {
      tag: "Studio Stills",
      title: "Luxury Product & Macro Photography",
      client: "Fragrance, Cosmetics & Fine Jewelry",
      heroImg: "assets/work-product-photo-DsF3P0Wn.jpg",
      metrics: [
        { val: "Polarized", label: "Zero-Reflection Light" },
        { val: "Macro 4K", label: "Ultra-Fine Detail" },
        { val: "E-Commerce", label: "Clean White + Sets" },
        { val: "Retina Ready", label: "Print & Digital Scalable" }
      ],
      challenge: "Reflective glass bottles and metallic surfaces require precision lighting to prevent harsh glare while showcasing bottle clarity and texture.",
      strategy: "Engineered customized studio setups using rotating turntables, polarized softboxes, and practical atmospheric effects (smoke, water mist).",
      results: "Produced gallery-grade product stills that command luxury pricing on e-commerce storefronts and social feeds.",
      deliverables: ["Studio Product Shoot", "Macro Detail Capture", "High-End Retouching", "E-Commerce Clean Cuts", "Lifestyle Set Stills"]
    },
    branding: {
      tag: "Identity & Strategy",
      title: "Brand Identity, Packaging & Collateral",
      client: "Emerging Consumer Ventures & Corporate Brands",
      heroImg: "assets/work-branding-CXzo-vUP.jpg",
      metrics: [
        { val: "Full IP", label: "Client Owned" },
        { val: "Vector", label: "Print & Screen Scalable" },
        { val: "Complete", label: "Brand Book & Guidelines" },
        { val: "Ready", label: "Stationery & Packaging" }
      ],
      challenge: "Brands entering the competitive UAE market needed a memorable, distinctive visual language that stood out against international legacy brands.",
      strategy: "Crafted unified visual identity systems: responsive typography hierarchies, custom marks, packaging die-lines, luxury business stationery, and brand guidelines.",
      results: "Launched cohesive, instantly recognizable brand identities that build immediate trust with consumers and enterprise retail partners.",
      deliverables: ["Logo System", "Typography & Palette", "Packaging Design", "Stationery & Collateral", "Digital Asset Kit"]
    },
    website: {
      tag: "Web Architecture",
      title: "High-Converting Web Architecture & CRO",
      client: "DTC Brands & Service Businesses",
      heroImg: "assets/work-website-CUU0C_MR.jpg",
      metrics: [
        { val: "< 0.8s", label: "Page Load Speed" },
        { val: "100/100", label: "Mobile Performance Score" },
        { val: "+45%", label: "Checkout Conversion Lift" },
        { val: "Seamless", label: "Pixel & CAPI Tracking" }
      ],
      challenge: "Slow WordPress and bloated themes causing high bounce rates and inaccurate attribution tracking from TikTok and Meta ads.",
      strategy: "Rebuilt the digital storefront using clean, modern, headless architecture with frictionless 1-click mobile checkout and server-side Conversions API.",
      results: "Reduced page load time to under 800ms and increased overall store conversion rate by 45%, unlocking scalable ad spend.",
      deliverables: ["Custom Web Architecture", "Conversion Rate Optimization", "Mobile-First UX", "Conversions API Setup", "Speed Optimization"]
    }
  };

  window.openWorkModal = function(key) {
    const data = caseStudiesData[key];
    if (!data || !caseModalContent || !caseModal) return;

    let metricsHtml = data.metrics.map(m => `
      <div style="background: rgba(255,255,255,0.03); border: 1px solid var(--border-line); border-radius: 6px; padding: 16px; text-align: center;">
        <div style="font-family: var(--font-mono); font-size: 22px; font-weight: 700; color: var(--color-brand);">${m.val}</div>
        <div style="font-family: var(--font-mono); font-size: 10px; color: var(--text-muted); text-transform: uppercase; margin-top: 4px;">${m.label}</div>
      </div>
    `).join('');

    let deliverablesHtml = data.deliverables.map(d => `
      <span style="font-family: var(--font-mono); font-size: 11px; background: rgba(0, 186, 204, 0.08); border: 1px solid rgba(0, 186, 204, 0.25); color: var(--color-brand); padding: 5px 12px; border-radius: 4px;">${d}</span>
    `).join('');

    caseModalContent.innerHTML = `
      <div style="margin-bottom: 24px;">
        <span style="font-family: var(--font-mono); font-size: 11px; color: var(--color-brand); text-transform: uppercase;">( Case Study ) // ${data.tag}</span>
        <h2 style="font-size: clamp(24px, 3.2vw, 36px); font-weight: 800; color: #fff; margin-top: 8px; letter-spacing: -0.02em;">${data.title}</h2>
        <p style="font-size: 14px; color: var(--text-muted); margin-top: 4px;">Partner: <strong style="color: #fff;">${data.client}</strong></p>
      </div>

      <div style="aspect-ratio: 16/9; border-radius: 8px; overflow: hidden; margin-bottom: 28px; border: 1px solid var(--border-line);">
        <img src="${data.heroImg}" alt="${data.title}" style="width: 100%; height: 100%; object-fit: cover;">
      </div>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 12px; margin-bottom: 32px;">
        ${metricsHtml}
      </div>

      <div style="display: grid; grid-template-columns: 1fr; gap: 20px; font-size: 14px; color: var(--text-muted); line-height: 1.6; margin-bottom: 32px;">
        <div>
          <h4 style="font-family: var(--font-mono); font-size: 12px; text-transform: uppercase; color: #fff; margin-bottom: 6px;">The Challenge</h4>
          <p>${data.challenge}</p>
        </div>
        <div>
          <h4 style="font-family: var(--font-mono); font-size: 12px; text-transform: uppercase; color: #fff; margin-bottom: 6px;">The Strategic Execution</h4>
          <p>${data.strategy}</p>
        </div>
        <div>
          <h4 style="font-family: var(--font-mono); font-size: 12px; text-transform: uppercase; color: var(--color-brand); margin-bottom: 6px;">The Growth Results</h4>
          <p>${data.results}</p>
        </div>
      </div>

      <div>
        <h4 style="font-family: var(--font-mono); font-size: 11px; text-transform: uppercase; color: var(--text-sub); margin-bottom: 12px;">Deliverables Included</h4>
        <div style="display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 32px;">
          ${deliverablesHtml}
        </div>
      </div>

      <div style="padding-top: 24px; border-top: 1px solid var(--border-line); display: flex; justify-content: space-between; align-items: center; flex-wrap: gap: 16px;">
        <span style="font-size: 13px; color: var(--text-muted);">Want similar performance metrics for your brand?</span>
        <a href="https://wa.me/971565533893?text=Hi%20Figo%20Media!%20I%20saw%20the%20${encodeURIComponent(data.title)}%20case%20study%20and%20want%20to%20discuss%20similar%20growth." target="_blank" rel="noopener" class="btn-brand-pill">
          <span>Inquire on WhatsApp</span> ↗
        </a>
      </div>
    `;

    caseModal.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  function closeCaseModal() {
    if (caseModal) {
      caseModal.classList.remove('open');
      document.body.style.overflow = '';
    }
  }

  if (caseModalClose) {
    caseModalClose.addEventListener('click', closeCaseModal);
  }
  if (caseModal) {
    caseModal.addEventListener('click', (e) => {
      if (e.target === caseModal) closeCaseModal();
    });
  }

  // ========================================================================
  // 7. FAQ ACCORDION
  // ========================================================================
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    if (question) {
      question.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        faqItems.forEach(f => f.classList.remove('active'));
        if (!isActive) {
          item.classList.add('active');
        }
      });
    }
  });

  // ========================================================================
  // 8. CONSULTATION FORM DISPATCH VIA WHATSAPP
  // ========================================================================
  const consultationForm = document.getElementById('consultationForm');
  if (consultationForm) {
    consultationForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('formName').value.trim();
      const brand = document.getElementById('formBrand').value.trim();
      const service = document.getElementById('formService').value;
      const message = document.getElementById('formMessage').value.trim();

      const text = `Hi Figo Media! I'd like to book a consultation:%0A%0A` +
                   `• Name: ${encodeURIComponent(name)}%0A` +
                   `• Brand: ${encodeURIComponent(brand)}%0A` +
                   `• Objective: ${encodeURIComponent(service)}%0A` +
                   `• Scope/Notes: ${encodeURIComponent(message || 'N/A')}`;

      const whatsappUrl = `https://wa.me/971565533893?text=${text}`;
      window.open(whatsappUrl, '_blank');
    });
  }

  // ========================================================================
  // 9. STICKY HEADER SHADOW ON SCROLL
  // ========================================================================
  const headerNav = document.querySelector('.header-nav');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      headerNav.style.background = 'rgba(12, 13, 15, 0.92)';
      headerNav.style.borderBottomColor = 'rgba(255, 255, 255, 0.1)';
    } else {
      headerNav.style.background = 'rgba(12, 13, 15, 0.78)';
      headerNav.style.borderBottomColor = 'rgba(255, 255, 255, 0.05)';
    }
  });

});
