/**
 * ZYNDRIX - Protocolo de Interacción y Automatización
 * Script principal de la landing page
 */

document.addEventListener('DOMContentLoaded', () => {
  // === CONFIGURACIÓN Y ESTADO ===
  const state = {
    isMenuOpen: false,
    currentStep: 0,
    isScrolled: false
  };

  // === ELEMENTOS DEL DOM ===
  const navbar = document.getElementById('navbar');
  const mobileToggle = document.getElementById('mobileToggle');
  const navLinks = document.getElementById('navLinks');
  const navIndicator = document.getElementById('navIndicator');
  const contactForm = document.getElementById('contactForm');
  const formSubmit = document.getElementById('formSubmit');

  // URL del Webhook de n8n
  const N8N_WEBHOOK_URL = 'https://n8n.zyndrix.dev/webhook/zyndrix-lead-scoring';

  // === GESTIÓN DEL MENÚ MÓVIL ===
  const toggleMenu = () => {
    state.isMenuOpen = !state.isMenuOpen;
    mobileToggle.classList.toggle('active', state.isMenuOpen);
    navLinks.classList.toggle('active', state.isMenuOpen);
    document.body.style.overflow = state.isMenuOpen ? 'hidden' : '';
  };

  if (mobileToggle) {
    mobileToggle.addEventListener('click', toggleMenu);
  }

  // Cerrar menú al hacer clic en un enlace
  const allNavLinks = document.querySelectorAll('.nav-links a');
  allNavLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (state.isMenuOpen) toggleMenu();
    });
  });

  // === INDICADOR DE NAVEGACIÓN ACTIVA ===
  const updateNavIndicator = (activeElement) => {
    if (!activeElement || !navIndicator) return;
    
    const { offsetLeft, offsetWidth } = activeElement;
    navIndicator.style.left = `${offsetLeft}px`;
    navIndicator.style.width = `${offsetWidth}px`;
    navIndicator.style.opacity = '1';
  };

  allNavLinks.forEach(link => {
    link.addEventListener('mouseenter', (e) => updateNavIndicator(e.target));
  });

  navLinks?.addEventListener('mouseleave', () => {
    const activeLink = document.querySelector('.nav-links a.active');
    if (activeLink) {
      updateNavIndicator(activeLink);
    } else if (navIndicator) {
      navIndicator.style.opacity = '0';
    }
  });

  // === SCROLL EFFECTS ===
  const handleScroll = () => {
    const scrolled = window.scrollY > 50;
    if (scrolled !== state.isScrolled) {
      state.isScrolled = scrolled;
      navbar?.classList.toggle('scrolled', scrolled);
    }

    // Update active section based on scroll
    const sections = document.querySelectorAll('section[id]');
    const scrollPosition = window.scrollY + 100;

    sections.forEach(section => {
      const { offsetTop, offsetHeight, id } = section;
      if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
        allNavLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
            updateNavIndicator(link);
          }
        });
      }
    });
  };

  window.addEventListener('scroll', handleScroll);
  handleScroll(); // Initial check

  // === GESTIÓN DEL FORMULARIO DE CONTACTO ===
  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const originalBtnText = formSubmit.innerHTML;
      formSubmit.disabled = true;
      formSubmit.innerHTML = 'Enviando Protocolo... <span class="spinner"></span>';
      
      // Obtener datos del formulario
      const formData = {
        name: document.getElementById('formName')?.value,
        email: document.getElementById('formEmail')?.value,
        service: document.getElementById('formService')?.value,
        message: document.getElementById('formMessage')?.value,
        timestamp: new Date().toISOString(),
        source: window.location.href
      };

      try {
        // 1. Enviar a n8n Webhook
        const response = await fetch(N8N_WEBHOOK_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData)
        });

        if (response.ok) {
          // Éxito
          showMessage('success', 'Protocolo enviado con éxito. Nuestro agente se contactará pronto.');
          contactForm.reset();
        } else {
          throw new Error('Error en el servidor');
        }
      } catch (error) {
        console.error('Error al enviar formulario:', error);
        // Fallback or Error message
        showMessage('error', 'Error en la conexión. Por favor reintenta o contáctanos por email.');
      } finally {
        formSubmit.disabled = false;
        formSubmit.innerHTML = originalBtnText;
      }
    });
  }

  function showMessage(type, text) {
    const msgElement = document.createElement('div');
    msgElement.className = `form-message ${type}`;
    msgElement.textContent = text;
    
    contactForm.appendChild(msgElement);
    
    setTimeout(() => {
      msgElement.classList.add('fade-out');
      setTimeout(() => msgElement.remove(), 500);
    }, 5000);
  }

  // === ANIMACIONES GSAP / REVEAL ===
  // Nota: Estas animaciones requieren ScrollReveal o similar si se desea usar el atributo data-reveal
  const revealElements = document.querySelectorAll('[data-reveal]');
  
  const revealOnScroll = () => {
    revealElements.forEach(el => {
      const rect = el.getBoundingClientRect();
      const isVisible = rect.top <= (window.innerHeight * 0.85);
      if (isVisible) {
        el.classList.add('revealed');
      }
    });
  };

  window.addEventListener('scroll', revealOnScroll);
  revealOnScroll(); // Check once at start
});
