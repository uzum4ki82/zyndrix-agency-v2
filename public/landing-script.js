/* ============================================================
   Zyndrix — JavaScript Interactivity
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  /* ───── PROFESSIONAL CONFIGURATION ───── */
  const CONFIG = {
    supabase: {
      url: 'https://vrvfftftnlspajplqjye.supabase.co',
      anonKey: 'sb_publishable_04ivizRHZPLg2eH6YkQUtw_MJG7DXfE'
    },
    n8n: {
      webhookUrl: 'https://n8n.zyndrix.dev/webhook/zyndrix-lead-scoring'
    },
    validation: {
      emailRegex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    }
  };

  // ───── NAVBAR SCROLL EFFECT ─────
  const navbar = document.getElementById('navbar');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;
    if (currentScroll > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    lastScroll = currentScroll;
  });

  // ───── MOBILE MENU TOGGLE ─────
  const mobileToggle = document.getElementById('mobileToggle');
  const navLinks = document.getElementById('navLinks');

  mobileToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    document.body.classList.toggle('nav-open');
    // Animate hamburger
    const spans = mobileToggle.querySelectorAll('span');
    if (navLinks.classList.contains('open')) {
      spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
    } else {
      spans[0].style.transform = '';
      spans[1].style.opacity = '';
      spans[2].style.transform = '';
    }
  });

  // ───── NEURAL CAPSULE MENU INTERACTION ─────
  const navIndicator = document.getElementById('navIndicator');
  const navItems = navLinks.querySelectorAll('a');

  function moveIndicator(element) {
    if (!element) return;
    const rect = element.getBoundingClientRect();
    const parentRect = navLinks.getBoundingClientRect();
    
    navIndicator.style.width = `${rect.width}px`;
    navIndicator.style.left = `${rect.left - parentRect.left}px`;
    navIndicator.style.top = `${rect.top - parentRect.top}px`;
    navIndicator.style.opacity = '1';
  }

  navItems.forEach(item => {
    item.addEventListener('mouseenter', () => {
      moveIndicator(item);
    });

    item.addEventListener('click', (e) => {
      navItems.forEach(nav => nav.classList.remove('active'));
      item.classList.add('active');
    });
  });

  navLinks.addEventListener('mouseleave', () => {
    const activeItem = navLinks.querySelector('a.active');
    if (activeItem) {
      moveIndicator(activeItem);
    } else {
      navIndicator.style.opacity = '0';
    }
  });

  // Initial position for active section (default to first or based on hash)
  setTimeout(() => {
    const hash = window.location.hash;
    const initialActive = hash ? navLinks.querySelector(`a[href="${hash}"]`) : navItems[0];
    if (initialActive) {
      initialActive.classList.add('active');
      moveIndicator(initialActive);
    }
  }, 500);

  // ───── SECTION SCROLL DETECTION (Sync Active Menu) ─────
  const sections = document.querySelectorAll('section[id]');
  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        const activeLink = navLinks.querySelector(`a[href="#${id}"]`);
        if (activeLink) {
          navItems.forEach(nav => nav.classList.remove('active'));
          activeLink.classList.add('active');
          moveIndicator(activeLink);
        }
      }
    });
  }, { threshold: 0.5, rootMargin: '-10% 0px -80% 0px' });

  sections.forEach(section => navObserver.observe(section));

  // Close mobile menu on link click
  navItems.forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      document.body.classList.remove('nav-open');
      const spans = mobileToggle.querySelectorAll('span');
      spans[0].style.transform = '';
      spans[1].style.opacity = '';
      spans[2].style.transform = '';
    });
  });

  // ───── SCROLL REVEAL (Intersection Observer) ─────
  const revealElements = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // ───── ANIMATED COUNTERS (Expert Animation) ─────
  const counters = document.querySelectorAll('[data-target]');
  const countObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const counter = entry.target;
        const target = parseFloat(counter.dataset.target);
        const suffix = counter.dataset.suffix || '';
        let current = 0;
        const duration = 2000;
        const stepTime = 16;
        const increment = target / (duration / stepTime);

        const timer = setInterval(() => {
          current += increment;
          if (current >= target) {
            counter.textContent = target + suffix;
            clearInterval(timer);
          } else {
            // Check if it's an integer target or float
            counter.textContent = (target % 1 === 0 ? Math.floor(current) : current.toFixed(1)) + suffix;
          }
        }, stepTime);
        countObserver.unobserve(counter);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => countObserver.observe(counter));

  // ───── DEMO CHAT ANIMATION ─────
  const demoChat = document.getElementById('demoChat');
  let demoStarted = false;

  const demoMessages = [
    { type: 'user', text: 'Hola, necesito automatizar la atención al cliente de mi e-commerce' },
    { type: 'bot', text: '¡Perfecto! Puedo ayudarte con eso. ¿Cuántas consultas recibes al día aproximadamente?' },
    { type: 'user', text: 'Unas 200 consultas diarias, sobre pedidos, devoluciones y preguntas frecuentes' },
    { type: 'bot', text: 'Excelente. Con un agente IA podemos resolver automáticamente el 85% de esas consultas. Te propongo:\n\n✅ Agente conversacional 24/7\n✅ Integración con tu CRM\n✅ Escalado inteligente a agentes humanos\n✅ Dashboard de métricas en tiempo real' },
    { type: 'user', text: '¿Y cuánto tiempo tardaría en estar funcionando?' },
    { type: 'bot', text: '¡En 2 semanas lo tendríamos operativo! El primer sprint incluye el agente base y en el segundo optimizamos con tus datos reales. ¿Agendamos una llamada para definir el alcance? 🚀' },
  ];

  const demoObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !demoStarted) {
        demoStarted = true;
        startDemoChat();
      }
    });
  }, { threshold: 0.3 });

  if (demoChat) {
    demoObserver.observe(demoChat);
  }

  function startDemoChat() {
    demoChat.innerHTML = '';
    let delay = 500;

    demoMessages.forEach((msg, i) => {
      delay += 800; // Pause before each message

      // Show typing indicator for bot messages
      if (msg.type === 'bot') {
        setTimeout(() => {
          const typing = createTypingIndicator();
          demoChat.appendChild(typing);
          demoChat.scrollTop = demoChat.scrollHeight;
        }, delay);
        delay += 1200;
      }

      setTimeout(() => {
        // Remove typing indicator
        const existingTyping = demoChat.querySelector('.demo-typing-wrapper');
        if (existingTyping) existingTyping.remove();

        const messageEl = document.createElement('div');
        messageEl.className = `demo-message ${msg.type}`;
        messageEl.style.opacity = '1';
        messageEl.style.transform = 'none';
        messageEl.innerHTML = `
          <div class="demo-message-avatar">${msg.type === 'bot' ? '⚡' : '👤'}</div>
          <div class="demo-message-content">${msg.text.replace(/\n/g, '<br>')}</div>
        `;
        demoChat.appendChild(messageEl);
        
        // Use requestAnimationFrame for smoother scrolling
        requestAnimationFrame(() => {
          demoChat.scrollTo({
            top: demoChat.scrollHeight,
            behavior: 'smooth'
          });
        });
      }, delay);

      delay += 600;
    });
  }

  function createTypingIndicator() {
    const wrapper = document.createElement('div');
    wrapper.className = 'demo-message bot demo-typing-wrapper';
    wrapper.style.opacity = '1';
    wrapper.style.transform = 'none';
    wrapper.innerHTML = `
      <div class="demo-message-avatar">⚡</div>
      <div class="demo-typing">
        <span></span><span></span><span></span>
      </div>
    `;
    return wrapper;
  }

  // ───── FAQ ACCORDION ─────
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const btn = item.querySelector('.faq-question');
    btn.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      
      // Close all others
      faqItems.forEach(otherItem => {
        otherItem.classList.remove('active');
      });

      // Toggle current
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });

  // ───── CHAT WIDGET ─────
  const chatToggle = document.getElementById('chatToggle');
  const chatWindow = document.getElementById('chatWindow');
  const chatInput = document.getElementById('chatInput');
  const chatSend = document.getElementById('chatSend');
  const chatMessages = document.getElementById('chatMessages');

  const botResponses = [
    '¡Buena pregunta! Nuestros agentes de IA se personalizan completamente para cada negocio. ¿Te gustaría agendar una demo?',
    'Trabajamos con empresas de todos los tamaños. El primer paso es una consulta gratuita donde analizamos tus necesidades específicas.',
    'La implementación típica tarda entre 2 y 4 semanas. Siempre mostramos resultados desde la primera semana. 🚀',
    'Nuestras soluciones se integran con las herramientas que ya usas: CRM, email, Slack, bases de datos y más. Sin disrupciones.',
    '¡Por supuesto! Puedo ayudarte a entender mejor nuestros servicios. ¿Qué área de tu negocio te gustaría automatizar?',
    'La inversión depende del alcance, pero siempre ofrecemos un ROI medible. La consulta inicial es 100% gratuita para poder darte un presupuesto exacto.'
  ];

  let responseIndex = 0;

  chatToggle.addEventListener('click', () => {
    chatWindow.classList.toggle('open');
    chatToggle.textContent = chatWindow.classList.contains('open') ? '✕' : '💬';
    
    if (chatWindow.classList.contains('open')) {
      chatMessages.scrollTop = chatMessages.scrollHeight;
      setTimeout(() => chatInput.focus(), 400);
    }
  });

  function sendChatMessage() {
    const text = chatInput.value.trim();
    if (!text) return;

    // Add user message
    addChatMessage('user', text);
    chatInput.value = '';

    // Simulate bot typing
    setTimeout(() => {
      const response = botResponses[responseIndex % botResponses.length];
      responseIndex++;
      addChatMessage('bot', response);
    }, 1000 + Math.random() * 1000);
  }

  function addChatMessage(type, text) {
    const msg = document.createElement('div');
    msg.className = `demo-message ${type}`;
    msg.style.opacity = '1';
    msg.style.transform = 'none';
    msg.innerHTML = `
      <div class="demo-message-avatar">${type === 'bot' ? '⚡' : '👤'}</div>
      <div class="demo-message-content">${text}</div>
    `;
    chatMessages.appendChild(msg);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  chatSend.addEventListener('click', sendChatMessage);
  chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendChatMessage();
  });

  // ───── CURSOR AURA (Ultra-Elite) ─────
  const aura = document.createElement('div');
  aura.className = 'cursor-aura';
  document.body.appendChild(aura);

  let mouseX = 0, mouseY = 0;
  let auraX = 0, auraY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function animateAura() {
    // Smooth easing for the aura
    const dx = mouseX - auraX;
    const dy = mouseY - auraY;
    auraX += dx * 0.1;
    auraY += dy * 0.1;

    aura.style.transform = `translate(${auraX - 150}px, ${auraY - 150}px)`;
    requestAnimationFrame(animateAura);
  }
  animateAura();

  // ───── MAGNETIC BUTTONS ─────
  const magneticBtns = document.querySelectorAll('.btn-primary, .btn-secondary, .btn-primary-elite, .btn-secondary-elite, .nav-logo');
  
  magneticBtns.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      
      // Pull strength (adjust for subtlety)
      const strength = 15;
      const moveX = (x / rect.width) * strength;
      const moveY = (y / rect.height) * strength;
      
      btn.style.transform = `translate(${moveX}px, ${moveY}px) scale(1.02)`;
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });

  // ───── MICRO-NOISE OVERLAY ─────
  const noise = document.createElement('div');
  noise.className = 'micro-noise';
  document.body.appendChild(noise);

  // ───── CONTACT FORM & WEBHOOK INTEGRATION (Professionalized) ─────
  const contactForm = document.getElementById('contactForm');
  const formSubmit = document.getElementById('formSubmit');

  if (contactForm && formSubmit) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const name = document.getElementById('formName')?.value?.trim();
      const email = document.getElementById('formEmail')?.value?.trim();
      const company = document.getElementById('formCompany')?.value?.trim() || 'N/A';
      const service = document.getElementById('formService')?.value || 'No especificado';
      const budget = document.getElementById('formBudget')?.value || 'No especificado';
      const msg = document.getElementById('formMessage')?.value?.trim() || '';

      // 1. Better Validation
      if (!name || !email) {
        showFormStatus('Por favor, completa los campos requeridos.', 'error');
        return;
      }
      if (!CONFIG.validation.emailRegex.test(email)) {
        showFormStatus('Por favor, introduce un email válido.', 'error');
        return;
      }

      // 2. Loading State
      const originalText = formSubmit.innerHTML;
      formSubmit.innerHTML = 'Enviando lead... <span class="btn-icon">⏳</span>';
      formSubmit.style.opacity = '0.7';
      formSubmit.disabled = true;

      const payload = {
        name,
        email,
        company_name: company,
        message: `[Interés: ${service}] [Presupuesto: ${budget}] - ${msg}`
      };

      try {
        const response = await fetch(`${CONFIG.supabase.url}/rest/v1/leads`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'apikey': CONFIG.supabase.anonKey,
            'Authorization': `Bearer ${CONFIG.supabase.anonKey}`,
            'Prefer': 'return=minimal'
          },
          body: JSON.stringify(payload)
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Error al guardar en Supabase');
        }

        // 3. Parallel n8n Webhook Call (Fire and forget, don't block success)
        fetch(CONFIG.n8n.webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...payload,
            source: 'Landing Page',
            timestamp: new Date().toISOString()
          })
        }).catch(err => console.error('n8n Webhook Error:', err));

        // 4. Success State
        formSubmit.innerHTML = '¡Lead Recibido! <span class="btn-icon">✅</span>';
        formSubmit.style.backgroundColor = '#10B981'; 
        formSubmit.style.boxShadow = '0 0 40px rgba(16, 185, 129, 0.5)';
        contactForm.reset();

      } catch (error) {
        console.error('Submission error:', error);
        formSubmit.innerHTML = '✕ Error de red. ¿Reintentar?';
        formSubmit.style.backgroundColor = '#EF4444';
        formSubmit.style.boxShadow = '0 0 30px rgba(239, 68, 68, 0.4)';
        formSubmit.disabled = false;
      } finally {
        setTimeout(() => {
          formSubmit.innerHTML = originalText;
          formSubmit.style.opacity = '1';
          formSubmit.style.backgroundColor = '';
          formSubmit.style.boxShadow = '';
          formSubmit.disabled = false;
        }, 6000);
      }
    });
  }

  // ───── VIDEO SHOWCASE HOVER PLAY ─────
  const showcaseCards = document.querySelectorAll('.showcase-card');
  showcaseCards.forEach(card => {
    const video = card.querySelector('video.showcase-video-player');
    if (video) {
      card.addEventListener('mouseenter', () => {
        video.play().catch(() => {}); // Ignore interaction blocking
      });
      card.addEventListener('mouseleave', () => {
        video.pause();
      });
    }
  });

  // ───── READING PROGRESS BAR ─────
  const readProgress = document.getElementById('readProgress');
  window.addEventListener('scroll', () => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (window.scrollY / totalHeight) * 100;
    if (readProgress) readProgress.style.width = `${progress}%`;
  });

  // ───── AI NETWORK PARTICLES (Hero) ─────
  const canvas = document.getElementById('aiNetworkCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    const particleCount = 80;
    const connectionDistance = 160;
    let mouse = { x: null, y: null };

    window.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    });

    class Particle {
      constructor() { this.reset(); }
      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.4;
        this.vy = (Math.random() - 0.5) * 0.4;
        this.radius = Math.random() * 1.5 + 1;
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(45, 212, 191, 0.3)';
        ctx.fill();
      }
    }

    function initParticles() {
      const parent = canvas.parentElement;
      canvas.width = parent.offsetWidth;
      canvas.height = parent.offsetHeight;
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    }

    function animateParticles() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p, index) => {
        p.update();
        p.draw();
        for (let j = index + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
          if (dist < connectionDistance) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(45, 212, 191, ${0.1 * (1 - dist / connectionDistance)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
        // Interaction with mouse
        if (mouse.x && mouse.y) {
          const distM = Math.hypot(p.x - mouse.x, p.y - mouse.y);
          if (distM < 100) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.strokeStyle = `rgba(45, 212, 191, ${0.1 * (1 - distM / 100)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      });
      requestAnimationFrame(animateParticles);
    }

    window.addEventListener('resize', () => {
      initParticles();
    });
    initParticles();
    animateParticles();
  }

  function showFormStatus(message, type) {
    // Elegant toast or simple alert for now, but let's make it a professional alert
    const statusEl = document.createElement('div');
    statusEl.style.cssText = `
      position: fixed;
      bottom: 24px;
      left: 50%;
      transform: translateX(-50%);
      padding: 12px 24px;
      border-radius: 99px;
      font-size: 0.9rem;
      font-weight: 600;
      z-index: 10000;
      color: white;
      background: ${type === 'error' ? '#EF4444' : '#10B981'};
      box-shadow: 0 10px 30px rgba(0,0,0,0.5);
      animation: message-in 0.4s ease forwards;
    `;
    statusEl.textContent = message;
    document.body.appendChild(statusEl);
    setTimeout(() => {
      statusEl.style.animation = 'fade-up 0.4s ease reverse forwards';
      setTimeout(() => statusEl.remove(), 400);
    }, 4000);
  }
    }
  }
});

// ============ ROI CALCULATOR LOGIC ============
(function() {
    const roiEmployees = document.getElementById('roi-employees');
    const roiCost = document.getElementById('roi-cost');
    const roiSavings = document.getElementById('roi-savings');
    const roiBar = document.getElementById('roi-bar');

    function updateROI() {
        if (!roiEmployees || !roiCost || !roiSavings || !roiBar) return;
        
        const employees = parseInt(roiEmployees.value) || 0;
        const cost = parseInt(roiCost.value) || 0;
        
        const monthlySavings = (employees * cost) * 0.4;
        const annualSavings = monthlySavings * 12;
        
        const formatter = new Intl.NumberFormat('es-ES', {
            style: 'currency',
            currency: 'EUR',
            maximumFractionDigits: 0
        });
        
        if (roiSavings) roiSavings.innerText = formatter.format(annualSavings);
        if (roiBar) roiBar.style.width = Math.min((annualSavings / 500000) * 100, 100) + '%';
    }

    if (roiEmployees && roiCost) {
        roiEmployees.addEventListener('input', updateROI);
        roiCost.addEventListener('input', updateROI);
        setTimeout(updateROI, 1000);
    }
})();
