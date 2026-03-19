/* ============================================================
   Zyndrix — JavaScript Interactivity
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

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

  // Close mobile menu on link click
  navLinks.querySelectorAll('a').forEach(link => {
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

  // ───── CONTACT FORM ─────
  const contactForm = document.getElementById('contactForm');
  const formSubmit = document.getElementById('formSubmit');

  if (contactForm && formSubmit) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const name = document.getElementById('formName')?.value;
      const email = document.getElementById('formEmail')?.value;
      const company = document.getElementById('formCompany')?.value || 'N/A';
      const msg = document.getElementById('formMessage')?.value || '';

      if (!name || !email) {
        alert('Por favor, completa los campos requeridos.');
        return;
      }

      // State: Sending
      const originalText = formSubmit.innerHTML;
      formSubmit.innerHTML = '<span class="loader-inline"></span> Enviando...';
      formSubmit.disabled = true;

      try {
        const response = await fetch('http://localhost:3005/api/leads', {
          method: 'POST',
          mode: 'cors',
          headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({ 
            company_name: company, 
            email: email, 
            name: name,
            message: msg,
            source: 'Landing Page v3'
          })
        });

        if (response.ok) {
          formSubmit.innerHTML = '✓ ¡Mensaje enviado con éxito!';
          formSubmit.style.background = 'linear-gradient(135deg, #0cebeb, #20e3b2)';
          contactForm.reset();
          
          setTimeout(() => {
            formSubmit.innerHTML = originalText;
            formSubmit.style.background = '';
            formSubmit.disabled = false;
          }, 4000);
        } else {
          const errorData = await response.json();
          throw new Error(errorData.details || 'Error en el servidor');
        }
      } catch (error) {
        console.error('Submission error:', error);
        formSubmit.innerHTML = '✕ Error al enviar. Reintentar?';
        formSubmit.style.background = 'linear-gradient(135deg, #ff4b2b, #ff416c)';
        formSubmit.disabled = false;
        
        setTimeout(() => {
          formSubmit.innerHTML = originalText;
          formSubmit.style.background = '';
        }, 5000);
      }
    });
  }

  // ───── MAGNETIC BUTTONS & SPATIAL CARDS (Elite Tier) ─────
  
  // Magnetic CTAs
  document.querySelectorAll('.btn-primary, .btn-secondary').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      
      btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px) scale(1.05)`;
      const icon = btn.querySelector('.btn-icon');
      if (icon) icon.style.transform = `translateX(${x * 0.1}px)`;
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
      const icon = btn.querySelector('.btn-icon');
      if (icon) icon.style.transform = '';
    });
  });

  // Spatial Cards Perspective Shift
  document.querySelectorAll('.glass-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = (y - centerY) / 15;
      const rotateY = (centerX - x) / 15;
      
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
      
      // Update highlight position
      const highlight = card.querySelector('.card-highlight');
      if (highlight) {
        highlight.style.left = `${x}px`;
        highlight.style.top = `${y}px`;
      }
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });

    // Create highlight element if not exists
    if (!card.querySelector('.card-highlight')) {
      const highlight = document.createElement('div');
      highlight.className = 'card-highlight';
      card.appendChild(highlight);
    }
  });

  // ───── PARALLAX ORBS (Hero) ─────
  const hero = document.querySelector('.hero');
  if (hero) {
    hero.addEventListener('mousemove', (e) => {
      const rect = hero.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      const orbs = hero.querySelectorAll('.hero-orb');
      orbs.forEach((orb, i) => {
        const speed = (i + 1) * 15;
        orb.style.transform = `translate(${x * speed}px, ${y * speed}px)`;
      });
    });
  }

  // ───── NEURAL PULSE WEB ─────
  const canvas = document.getElementById('aiNetworkCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let nodes = [];
    let pulses = [];
    const nodeCount = 60;
    const maxDistance = 150;
    let mouse = { x: null, y: null };

    class Node {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.originX = this.x;
        this.originY = this.y;
        this.vx = (Math.random() - 0.5) * 0.3;
        this.vy = (Math.random() - 0.5) * 0.3;
        this.radius = Math.random() * 2 + 1;
        this.glow = 10 + Math.random() * 10;
        this.opacity = 0.4 + Math.random() * 0.4;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        // Mouse interaction
        if (mouse.x && mouse.y) {
          const dx = this.x - mouse.x;
          const dy = this.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100) {
            this.x += dx * 0.02;
            this.y += dy * 0.02;
          }
        }

        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
      }

      draw() {
        ctx.save();
        ctx.fillStyle = `rgba(0, 245, 255, ${this.opacity})`;
        ctx.shadowBlur = this.glow;
        ctx.shadowColor = '#00f5ff';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    class Pulse {
      constructor(startNode, endNode) {
        this.start = startNode;
        this.end = endNode;
        this.progress = 0;
        this.speed = 0.008 + Math.random() * 0.015;
        this.color = Math.random() > 0.5 ? '#00f5ff' : '#fff';
      }

      update() {
        this.progress += this.speed;
        return this.progress < 1;
      }

      draw() {
        const x = this.start.x + (this.end.x - this.start.x) * this.progress;
        const y = this.start.y + (this.end.y - this.start.y) * this.progress;

        ctx.save();
        ctx.fillStyle = this.color;
        ctx.shadowBlur = 20;
        ctx.shadowColor = '#00f5ff';
        ctx.beginPath();
        // Dynamic size based on progress for "pulse" feel
        const size = 1.5 + Math.sin(this.progress * Math.PI) * 1.5;
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      init();
    }

    function init() {
      nodes = Array.from({ length: nodeCount }, () => new Node());
      pulses = [];
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Update Nodes
      nodes.forEach(node => {
        node.update();
        node.draw();
      });

      // Connections & Pulses spawning
      ctx.lineWidth = 0.8;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDistance) {
            ctx.strokeStyle = `rgba(0, 245, 255, ${(1 - dist / maxDistance) * 0.15})`;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();

            // Randomly spawn pulses on connections
            if (Math.random() < 0.0005 && pulses.length < 20) {
              pulses.push(new Pulse(nodes[i], nodes[j]));
            }
          }
        }
      }

      // Update & Draw Pulses
      pulses = pulses.filter(pulse => {
        const active = pulse.update();
        if (active) pulse.draw();
        return active;
      });

      requestAnimationFrame(animate);
    }

    window.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });

    window.addEventListener('resize', resize);
    
    setTimeout(() => {
      resize();
      animate();
      console.log('Neural Pulse Web Active');
    }, 100);
  }
});
