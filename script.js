/**
 * ==========================================================================
 * CARLOS DANIEL GOMES DE SÁ - PORTFÓLIO PROFISSIONAL
 * Script de Interatividade (script.js) — v2.0 Redesign
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  // --- Elementos Globais do DOM ---
  const header = document.getElementById('header');
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');
  const backToTopBtn = document.getElementById('backToTop');
  const sections = document.querySelectorAll('section[id]');
  const fadeElements = document.querySelectorAll('.fade-in');

  // ==========================================================================
  // 1. MENU MOBILE (HAMBÚRGUER)
  // ==========================================================================
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('open');
      navToggle.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (navMenu.classList.contains('open')) {
          navMenu.classList.remove('open');
          navToggle.classList.remove('open');
          navToggle.setAttribute('aria-expanded', 'false');
          document.body.style.overflow = '';
        }
      });
    });

    document.addEventListener('click', (e) => {
      if (navMenu.classList.contains('open') && 
          !navMenu.contains(e.target) && 
          !navToggle.contains(e.target)) {
        navMenu.classList.remove('open');
        navToggle.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navMenu.classList.contains('open')) {
        navMenu.classList.remove('open');
        navToggle.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 768 && navMenu.classList.contains('open')) {
        navMenu.classList.remove('open');
        navToggle.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    }, { passive: true });
  }

  // ==========================================================================
  // 2. HEADER SCROLL EFFECT & BACK TO TOP BUTTON
  // ==========================================================================
  const handleScrollEffects = () => {
    const scrollPosition = window.scrollY;

    if (header) {
      if (scrollPosition > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }

    if (backToTopBtn) {
      if (scrollPosition > 350) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }
  };

  window.addEventListener('scroll', handleScrollEffects, { passive: true });
  handleScrollEffects();

  // ==========================================================================
  // 3. SCROLLSPY (DESTAQUE AUTOMÁTICO NA NAVBAR)
  // ==========================================================================
  const activateNavOnScroll = () => {
    const scrollY = window.pageYOffset;

    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');
      const navTarget = document.querySelector(`.nav-menu a[href*='${sectionId}']`);

      if (navTarget) {
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          navTarget.classList.add('active');
        } else {
          navTarget.classList.remove('active');
        }
      }
    });
  };

  window.addEventListener('scroll', activateNavOnScroll, { passive: true });

  // ==========================================================================
  // 4. ANIMAÇÃO DE FADE-IN AO ROLAR (INTERSECTION OBSERVER)
  // ==========================================================================
  if ('IntersectionObserver' in window) {
    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -40px 0px',
      threshold: 0.12
    };

    const fadeInObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    fadeElements.forEach(el => fadeInObserver.observe(el));
  } else {
    fadeElements.forEach(el => el.classList.add('visible'));
  }

  // ==========================================================================
  // 5. CANVAS INTERATIVO DE FUNDO — PARTÍCULAS VERDES
  // ==========================================================================
  const initTechCanvas = () => {
    const canvas = document.getElementById('techCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    let particles = [];
    const particleCount = Math.min(Math.floor(window.innerWidth / 28), 50);

    const mouse = { x: -1000, y: -1000 };

    window.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    }, { passive: true });

    window.addEventListener('mouseleave', () => {
      mouse.x = -1000;
      mouse.y = -1000;
    });

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    }, { passive: true });

    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.radius = Math.random() * 1.5 + 0.8;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;

        // Efeito sutil com o mouse
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          this.x -= (dx / dist) * 0.8;
          this.y -= (dy / dist) * 0.8;
        }
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(5, 150, 105, 0.4)';
        ctx.fill();
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    const animateCanvas = () => {
      ctx.clearRect(0, 0, width, height);

      // Conexão entre nós próximos
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();

        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 125) {
            const alpha = (1 - dist / 125) * 0.15;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(5, 150, 105, ${alpha})`;
            ctx.lineWidth = 0.75;
            ctx.stroke();
          }
        }
      }

      requestAnimationFrame(animateCanvas);
    };

    animateCanvas();
  };

  initTechCanvas();

  // ==========================================================================
  // 6. TYPED TEXT EFFECT NO HERO
  // ==========================================================================
  const initTypedText = () => {
    const typedEl = document.getElementById('typedText');
    if (!typedEl) return;

    const phrases = [
      'Estudante de Ciência da Computação',
      'Suporte de TI & Infraestrutura',
      'Apaixonado por Algoritmos & Dados',
      'Desenvolvedor em Formação'
    ];

    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 60;

    const type = () => {
      const currentPhrase = phrases[phraseIndex];

      if (isDeleting) {
        typedEl.textContent = currentPhrase.substring(0, charIndex - 1);
        charIndex--;
        typingSpeed = 30;
      } else {
        typedEl.textContent = currentPhrase.substring(0, charIndex + 1);
        charIndex++;
        typingSpeed = 70;
      }

      if (!isDeleting && charIndex === currentPhrase.length) {
        // Pause at end of phrase
        typingSpeed = 2000;
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        typingSpeed = 400;
      }

      setTimeout(type, typingSpeed);
    };

    // Start after a small delay
    setTimeout(type, 800);
  };

  initTypedText();

  // ==========================================================================
  // 7. CONTADORES ANIMADOS (CountUp)
  // ==========================================================================
  const initCounters = () => {
    const counters = document.querySelectorAll('.counter');
    if (!counters.length) return;

    const animateCounter = (counter) => {
      const target = parseInt(counter.getAttribute('data-target'));
      const duration = 1800; // ms
      const startTime = performance.now();

      const updateCounter = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Ease-out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(eased * target);

        counter.textContent = current;

        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        } else {
          counter.textContent = target;
        }
      };

      requestAnimationFrame(updateCounter);
    };

    if ('IntersectionObserver' in window) {
      const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const counter = entry.target;
            animateCounter(counter);
            counterObserver.unobserve(counter);
          }
        });
      }, { threshold: 0.5 });

      counters.forEach(counter => counterObserver.observe(counter));
    } else {
      counters.forEach(counter => {
        counter.textContent = counter.getAttribute('data-target');
      });
    }
  };

  initCounters();

  // ==========================================================================
  // 8. PARALLAX SUTIL NOS BACKGROUND GLOWS
  // ==========================================================================
  const initParallax = () => {
    const glow1 = document.querySelector('.bg-glow-1');
    const glow2 = document.querySelector('.bg-glow-2');
    if (!glow1 && !glow2) return;

    let ticking = false;

    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          if (glow1) glow1.style.transform = `translateY(${scrollY * 0.08}px)`;
          if (glow2) glow2.style.transform = `translateY(${scrollY * -0.05}px)`;
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  };

  initParallax();

  // ==========================================================================
  // 9. TERMINAL INTERATIVO NO HERO
  // ==========================================================================
  const terminalForm = document.getElementById('terminalForm');
  const termInput = document.getElementById('termInput');
  const terminalHistory = document.getElementById('terminalHistory');
  const terminalBody = document.getElementById('terminalBody');
  const termChips = document.querySelectorAll('.term-chip');

  const executeCommand = (rawCmd) => {
    const cmd = rawCmd.trim().toLowerCase();
    if (!cmd) return;

    // Linha do comando digitado
    const cmdLine = document.createElement('p');
    cmdLine.innerHTML = `<span class="term-prompt">$</span> <span class="term-cmd">${escapeHtml(cmd)}</span>`;
    terminalHistory.appendChild(cmdLine);

    const outputBlock = document.createElement('div');
    outputBlock.className = 'term-output-block';

    switch (cmd) {
      case 'help':
        outputBlock.innerHTML = `
          <div class="term-output">
            <span style="color: #10b981;">Comandos disponíveis:</span><br>
            • <strong>whoami</strong>: Quem sou eu e resumo de atuação<br>
            • <strong>skills</strong>: Lista de habilidades técnicas e linguagens<br>
            • <strong>projects</strong>: Destaques dos projetos desenvolvidos<br>
            • <strong>contact</strong>: Formas de contato e e-mail<br>
            • <strong>about</strong>: Resumo acadêmico e profissional<br>
            • <strong>clear</strong>: Limpa a tela do terminal<br>
            • <strong>sudo</strong>: Executar como superusuário
          </div>
        `;
        break;

      case 'whoami':
        outputBlock.innerHTML = `
          <p class="term-output">Carlos Daniel Gomes de Sá | Estudante de Ciência da Computação (UVV) e Suporte de TI (Secretaria de Saúde).</p>
        `;
        break;

      case 'skills':
        outputBlock.innerHTML = `
          <div class="term-output">
            <strong style="color: #10b981;">[Linguagens]</strong> C, Java, Python, JavaScript, HTML5/CSS3, Bash/Shell<br>
            <strong style="color: #10b981;">[Fundamentos]</strong> Árvores AVL, Listas Encadeadas, Algoritmos de Ordenação, Big-O<br>
            <strong style="color: #10b981;">[Infraestrutura]</strong> Diagnóstico de Hardware, Redes TCP/IP, Montagem e Helpdesk N1/N2
          </div>
        `;
        break;

      case 'projects':
        outputBlock.innerHTML = `
          <div class="term-output">
            1. <strong>BoraJunto</strong> (Python, Flask, SQLAlchemy, Admin, Pytest)<br>
            2. <strong>Encurtador de URL com Redis</strong> (Java, Spring Boot, Redis Cache, Docker)<br>
            3. <strong>YouTube Clone Backend</strong> (Java, Spring Boot, Docker, REST API)<br>
            4. <strong>WhatsApp Clone Backend</strong> (Java, Spring Boot, WebSockets/REST, Docker)<br>
            5. <strong>Meu Portfólio Tecnológico</strong> (HTML5, Vanilla CSS, JS ES6+)<br>
            6. <strong>Estruturas de Dados & Algoritmos</strong> (C, Java, Árvores AVL, Big-O)<br>
            <em style="color: #059669;">Dica: Role até a seção #projetos para testar os filtros e ver detalhes!</em>
          </div>
        `;
        break;

      case 'contact':
        outputBlock.innerHTML = `
          <div class="term-output">
            📧 E-mail: <span style="color: #10b981;">carlosdsa2005@gmail.com</span><br>
            📱 WhatsApp: <span style="color: #10b981;">(27) 99818-4143</span><br>
            💼 LinkedIn: <span style="color: #10b981;">linkedin.com/in/carlos-daniel-gomes-de-sa-7217b1289</span><br>
            📍 Localização: Vila Velha - ES, Brasil<br>
            💬 Rolando até a seção de contato...
          </div>
        `;
        setTimeout(() => {
          const contactSec = document.getElementById('contato');
          if (contactSec) contactSec.scrollIntoView({ behavior: 'smooth' });
        }, 500);
        break;

      case 'about':
        outputBlock.innerHTML = `
          <p class="term-output">Estudante de Ciência da Computação apaixonado por estruturas de dados e arquitetura de computadores, unindo o rigor teórico à experiência prática em suporte e manutenção de infraestrutura crítica de saúde.</p>
        `;
        break;

      case 'clear':
        terminalHistory.innerHTML = '';
        if (termInput) termInput.value = '';
        return;

      case 'sudo':
        outputBlock.innerHTML = `
          <p class="term-output" style="color: #dc2626;"><i class="fa-solid fa-lock"></i> Permissão negada: você não está no arquivo sudoers. Este incidente será reportado!</p>
        `;
        break;

      default:
        outputBlock.innerHTML = `
          <p class="term-output" style="color: #dc2626;">Comando não reconhecido: "${escapeHtml(cmd)}". Digite <span style="color: #10b981;">help</span> para ver os comandos válidos.</p>
        `;
        break;
    }

    terminalHistory.appendChild(outputBlock);

    // Auto rolagem para o final do terminal
    if (terminalBody) {
      terminalBody.scrollTop = terminalBody.scrollHeight;
    }

    if (termInput) termInput.value = '';
  };

  if (terminalForm && termInput) {
    terminalForm.addEventListener('submit', (e) => {
      e.preventDefault();
      executeCommand(termInput.value);
    });
  }

  // Cliques nos chips rápidos
  termChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const cmd = chip.getAttribute('data-cmd');
      if (cmd) {
        if (termInput) termInput.value = cmd;
        executeCommand(cmd);
      }
    });
  });

  // ==========================================================================
  // 10. FILTROS DINÂMICOS DA SEÇÃO DE PROJETOS
  // ==========================================================================
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');

        if (filterValue === 'all' || cardCategory === filterValue) {
          card.classList.remove('is-hidden');
          // Reaplica suave animação
          card.style.opacity = '0';
          card.style.transform = 'translateY(15px)';
          requestAnimationFrame(() => {
            card.style.transition = 'all 0.4s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          });
        } else {
          card.classList.add('is-hidden');
        }
      });
    });
  });

  // ==========================================================================
  // 11. MODAL DE CURRÍCULO PROFISSIONAL
  // ==========================================================================
  const btnDownloadCv = document.getElementById('btnDownloadCv');
  const cvModalBackdrop = document.getElementById('cvModalBackdrop');
  const btnCloseCvModal = document.getElementById('btnCloseCvModal');
  const btnCloseCvModalBottom = document.getElementById('btnCloseCvModalBottom');
  const btnPrintCv = document.getElementById('btnPrintCv');

  const openCvModal = () => {
    if (cvModalBackdrop) {
      cvModalBackdrop.classList.add('open');
      cvModalBackdrop.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }
  };

  const closeCvModal = () => {
    if (cvModalBackdrop) {
      cvModalBackdrop.classList.remove('open');
      cvModalBackdrop.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
  };

  if (btnDownloadCv) btnDownloadCv.addEventListener('click', openCvModal);
  if (btnCloseCvModal) btnCloseCvModal.addEventListener('click', closeCvModal);
  if (btnCloseCvModalBottom) btnCloseCvModalBottom.addEventListener('click', closeCvModal);

  if (cvModalBackdrop) {
    cvModalBackdrop.addEventListener('click', (e) => {
      if (e.target === cvModalBackdrop) closeCvModal();
    });
  }

  if (btnPrintCv) {
    btnPrintCv.addEventListener('click', () => {
      window.print();
    });
  }

  // ==========================================================================
  // 12. MODAL DE DETALHES DO PROJETO
  // ==========================================================================
  const projectModalBackdrop = document.getElementById('projectModalBackdrop');
  const btnCloseProjectModal = document.getElementById('btnCloseProjectModal');
  const btnCloseProjectModalBottom = document.getElementById('btnCloseProjectModalBottom');
  const modalProjectTitle = document.getElementById('modalProjectTitle');
  const modalProjectBadge = document.getElementById('modalProjectBadge');
  const modalProjectBody = document.getElementById('modalProjectBody');
  const modalProjectLink = document.getElementById('modalProjectLink');
  const btnProjectDetails = document.querySelectorAll('.btn-project-detail');

  const projectsDatabase = {
    borajunto: {
      title: 'BoraJunto: Planejador de Viagens Colaborativo',
      badge: 'Fullstack Web & Python / Flask',
      icon: 'fa-plane-departure',
      github: 'https://github.com/Carlosdsa2005/Bora_Junto',
      content: `
        <div class="project-detail-section">
          <h4><i class="fa-solid fa-layer-group"></i> Visão Geral</h4>
          <p>Aplicação web colaborativa completa desenvolvida para planejar, organizar e centralizar viagens em grupo. Elimina planilhas avulsas e mensagens dispersas ao reunir cronogramas, logística, upload de documentos e gestão de membros em um único ambiente seguro.</p>
        </div>
        <div class="project-detail-section">
          <h4><i class="fa-solid fa-gears"></i> Funcionalidades & Arquitetura</h4>
          <ul class="project-detail-features">
            <li><strong>Autenticação & Controle de Sessões:</strong> Registro e login seguro de usuários utilizando Flask-Login e formulários validados com proteção CSRF (Flask-WTF).</li>
            <li><strong>Gestão de Viagens & Convites por Link:</strong> Criação e configuração de viagens com datas e destinos, gerando links de convite exclusivos para novos integrantes.</li>
            <li><strong>Mural Logístico de Tarefas:</strong> Quadro de tarefas com atribuição de responsáveis, status de execução e prazos.</li>
            <li><strong>Repositório de Comprovantes & Galeria:</strong> Upload seguro com validação rígida de extensões para passagens/reservas e compartilhamento de fotos da viagem.</li>
            <li><strong>Painel Administrativo Corporativo:</strong> Integração com Flask-Admin para gerenciamento completo dos registros e permissões da base de dados.</li>
            <li><strong>Testes Automatizados:</strong> Suite abrangente de testes automatizados com pytest assegurando a estabilidade das regras de negócio.</li>
          </ul>
        </div>
        <div class="project-detail-section">
          <h4><i class="fa-solid fa-code"></i> Tecnologias Utilizadas</h4>
          <p>Python 3.10+, Flask (Application Factory & Blueprints), Flask-SQLAlchemy (ORM), Flask-Login, Flask-Admin, Flask-WTF, Jinja2, Bootstrap 5, SQLite, pytest e python-dotenv.</p>
        </div>
      `
    },
    encurtador: {
      title: 'Encurtador de URL com Cache em Redis',
      badge: 'Microsserviços & Cache Distribuído',
      icon: 'fa-bolt',
      github: 'https://github.com/Carlosdsa2005/Encurtador-de-URL-com-cache-em-Redis',
      content: `
        <div class="project-detail-section">
          <h4><i class="fa-solid fa-layer-group"></i> Visão Geral</h4>
          <p>Microsserviço de alta performance e baixa latência para encurtamento e redirecionamento de links web. Projetado sob princípios de escalabilidade horizontal, desacoplamento e estratégia de caching em memória com Redis.</p>
        </div>
        <div class="project-detail-section">
          <h4><i class="fa-solid fa-gears"></i> Destaques de Engenharia</h4>
          <ul class="project-detail-features">
            <li><strong>Cache em Memória com Redis:</strong> Consultas de redirecionamento atendidas em tempo sub-milissegundo diretamente da RAM do Redis, aliviando o tráfego do banco relacional.</li>
            <li><strong>Geração de Hash Único:</strong> Algoritmo de codificação compacto alfanumérico para identificadores de URLs encurtadas com tratamento de colisões.</li>
            <li><strong>Arquitetura RESTful em Camadas:</strong> Separação estrita de Controllers, Services, Repositories e DTOs no ecossistema Spring Boot.</li>
            <li><strong>Containerização Completa:</strong> Orquestração pronta via Docker Compose, permitindo subir a aplicação e a instância do servidor Redis com um único comando.</li>
          </ul>
        </div>
        <div class="project-detail-section">
          <h4><i class="fa-solid fa-server"></i> Tecnologias & Ferramentas</h4>
          <p>Java, Spring Boot, Spring Data Redis, Servidor Redis, Docker, Docker Compose e Maven.</p>
        </div>
      `
    },
    youtube: {
      title: 'YouTube Clone Backend',
      badge: 'Arquitetura Audiovisual & Microsserviços',
      icon: 'fa-youtube',
      github: 'https://github.com/Carlosdsa2005/youtube-clone',
      content: `
        <div class="project-detail-section">
          <h4><i class="fa-solid fa-layer-group"></i> Visão Geral</h4>
          <p>API e microsserviços inspirados na infraestrutura do YouTube para catalogação, publicação e consumo de mídias em vídeo, estruturada com padrões corporativos no ecossistema Spring.</p>
        </div>
        <div class="project-detail-section">
          <h4><i class="fa-solid fa-gears"></i> Recursos Implementados</h4>
          <ul class="project-detail-features">
            <li><strong>Autenticação & Autorização:</strong> Gestão de perfis e segurança de endpoints com Spring Security.</li>
            <li><strong>Upload e Metadados de Mídia:</strong> Tratamento de metadados, títulos, tags, descrições, miniaturas e status de processamento dos vídeos.</li>
            <li><strong>Engajamento & Canais:</strong> Modelagem de canais, sistema de inscrições, contadores de visualizações, curtidas e comentários.</li>
            <li><strong>Ambiente Docker:</strong> Conteinerização dos serviços e banco de dados via Docker Compose para implantação consistente.</li>
          </ul>
        </div>
        <div class="project-detail-section">
          <h4><i class="fa-solid fa-code"></i> Tecnologias</h4>
          <p>Java, Spring Boot, Spring Security, RESTful Web Services, Docker Compose e Maven.</p>
        </div>
      `
    },
    whatsapp: {
      title: 'WhatsApp Clone Backend',
      badge: 'Mensageria & Tempo Real',
      icon: 'fa-whatsapp',
      github: 'https://github.com/Carlosdsa2005/Whatsapp-Clone',
      content: `
        <div class="project-detail-section">
          <h4><i class="fa-solid fa-layer-group"></i> Visão Geral</h4>
          <p>Serviço de backend para mensageria instantânea com comunicação bidirecional em tempo real, modelado para suportar trocas dinâmicas de mensagens entre usuários individuais e salas de grupos.</p>
        </div>
        <div class="project-detail-section">
          <h4><i class="fa-solid fa-gears"></i> Funcionalidades Principais</h4>
          <ul class="project-detail-features">
            <li><strong>Comunicação em Tempo Real:</strong> Troca de mensagens instantâneas com baixa latência via WebSockets e REST.</li>
            <li><strong>Histórico & Persistência:</strong> Armazenamento estruturado de mensagens, timestamps e rastreamento de status de envio/entrega.</li>
            <li><strong>Salas e Grupos de Conversa:</strong> Gerenciamento de participantes, metadados e permissões em salas coletivas.</li>
            <li><strong>Infraestrutura Conteinerizada:</strong> Ambiente com Docker Compose para rápida replicação de banco de dados e aplicação.</li>
          </ul>
        </div>
        <div class="project-detail-section">
          <h4><i class="fa-solid fa-code"></i> Tecnologias</h4>
          <p>Java, Spring Boot, WebSockets, REST APIs, Docker Compose e Maven.</p>
        </div>
      `
    },
    portfolio: {
      title: 'Portfólio Web Pessoal Tecnológico',
      badge: 'Front-End Moderno & UI/UX',
      icon: 'fa-laptop-code',
      github: 'https://github.com/Carlosdsa2005/Meu-Portifolio-',
      content: `
        <div class="project-detail-section">
          <h4><i class="fa-solid fa-layer-group"></i> Visão Geral</h4>
          <p>Interface web de alto padrão visual desenvolvida com estética clean branca e verde esmeralda, aplicando as melhores práticas de front-end: Vanilla CSS estruturado, JavaScript ES6+ modular, total acessibilidade e otimização para SEO.</p>
        </div>
        <div class="project-detail-section">
          <h4><i class="fa-solid fa-gears"></i> Destaques de Implementação</h4>
          <ul class="project-detail-features">
            <li><strong>Terminal Interativo Embutido:</strong> Interpretador de comandos reais em JavaScript puro com histórico, autoscroll e atalhos.</li>
            <li><strong>Background com Canvas 2D:</strong> Simulação de rede de partículas (Cyber Nodes) com conexões dinâmicas e reação ao cursor.</li>
            <li><strong>Filtro Dinâmico de Projetos:</strong> Sistema fluido por categoria (Backend, Web, Ciência da Computação).</li>
            <li><strong>Contadores Animados (CountUp):</strong> Métrica progressiva ativada via IntersectionObserver ao rolar a página.</li>
            <li><strong>Currículo com Modo de Impressão:</strong> Folha de estilos otimizada via @media print para exportação limpa em PDF de alta resolução.</li>
          </ul>
        </div>
        <div class="project-detail-section">
          <h4><i class="fa-solid fa-code"></i> Tecnologias</h4>
          <p>HTML5 Semântico, Vanilla CSS, JavaScript ES6+, Canvas 2D API, EmailJS.</p>
        </div>
      `
    },
    estruturas: {
      title: 'Estruturas de Dados e Algoritmos',
      badge: 'Ciência da Computação & Otimização',
      icon: 'fa-code-branch',
      github: 'https://github.com/Carlosdsa2005',
      content: `
        <div class="project-detail-section">
          <h4><i class="fa-solid fa-layer-group"></i> Visão Geral</h4>
          <p>Implementações rigorosas de baixo e médio nível (C e Java) desenvolvidas no curso de Ciência da Computação da UVV, explorando estruturas que compõem os alicerces dos sistemas modernos de software.</p>
        </div>
        <div class="project-detail-section">
          <h4><i class="fa-solid fa-gears"></i> Funcionalidades & Algoritmos Implementados</h4>
          <ul class="project-detail-features">
            <li><strong>Árvores AVL:</strong> Balanceamento dinâmico rigoroso com verificação de fator de balanceamento e rotações simples (LL/RR) e duplas (LR/RL). Complexidade O(log n) garantida.</li>
            <li><strong>Listas Duplamente Encadeadas:</strong> Gerenciamento granular de ponteiros, prevenção de memory leaks e alocação dinâmica contínua.</li>
            <li><strong>Algoritmos de Ordenação:</strong> Análise comparativa de benchmark temporal e espacial entre QuickSort, MergeSort e InsertionSort.</li>
          </ul>
        </div>
        <div class="project-detail-section">
          <h4><i class="fa-solid fa-microchip"></i> Aprendizados & Engenharia</h4>
          <p>Domínio profundo de aritmética de ponteiros, alocação de memória na Heap e Stack, depuração de referências e raciocínio analítico de complexidade assintótica (Big-O).</p>
        </div>
      `
    },
    netpulse: {
      title: 'NetPulse: Monitor & Diagnóstico de Redes',
      badge: 'Infraestrutura & Redes de Computadores',
      icon: 'fa-network-wired',
      github: 'https://github.com/Carlosdsa2005',
      content: `
        <div class="project-detail-section">
          <h4><i class="fa-solid fa-layer-group"></i> Visão Geral</h4>
          <p>Ferramenta orientada a suporte técnico para automatizar a identificação de quedas de links, gargalos de latência e hosts inativos em redes locais.</p>
        </div>
      `
    },
    avl: {
      title: 'Visualizador Interativo de Árvores AVL',
      badge: 'Computação Visual & Didática',
      icon: 'fa-sitemap',
      github: 'https://github.com/Carlosdsa2005',
      content: `
        <div class="project-detail-section">
          <h4><i class="fa-solid fa-layer-group"></i> Visão Geral</h4>
          <p>Simulador gráfico interativo demonstrando passo a passo rotações e balanceamento de árvores AVL.</p>
        </div>
      `
    }
  };

  const openProjectModal = (projectKey) => {
    const project = projectsDatabase[projectKey];
    if (!project || !projectModalBackdrop) return;

    if (modalProjectTitle) modalProjectTitle.textContent = project.title;
    if (modalProjectBadge) modalProjectBadge.textContent = project.badge;
    if (modalProjectBody) modalProjectBody.innerHTML = project.content;
    if (modalProjectLink) modalProjectLink.href = project.github;

    projectModalBackdrop.classList.add('open');
    projectModalBackdrop.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const closeProjectModal = () => {
    if (projectModalBackdrop) {
      projectModalBackdrop.classList.remove('open');
      projectModalBackdrop.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
  };

  btnProjectDetails.forEach(btn => {
    btn.addEventListener('click', () => {
      const key = btn.getAttribute('data-project');
      if (key) openProjectModal(key);
    });
  });

  if (btnCloseProjectModal) btnCloseProjectModal.addEventListener('click', closeProjectModal);
  if (btnCloseProjectModalBottom) btnCloseProjectModalBottom.addEventListener('click', closeProjectModal);

  if (projectModalBackdrop) {
    projectModalBackdrop.addEventListener('click', (e) => {
      if (e.target === projectModalBackdrop) closeProjectModal();
    });
  }

  // Fechar qualquer modal ativo com a tecla Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeCvModal();
      closeProjectModal();
    }
  });

  // ==========================================================================
  // 13. COPIAR E-MAIL COM FEEDBACK VISUAL
  // ==========================================================================
  const btnCopyEmail = document.getElementById('btnCopyEmail');
  const emailToCopy = 'carlosdsa2005@gmail.com';

  if (btnCopyEmail) {
    btnCopyEmail.addEventListener('click', () => {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(emailToCopy)
          .then(() => {
            showToast('E-mail copiado para a área de transferência!', 'success');
          })
          .catch(() => {
            fallbackCopyText(emailToCopy);
          });
      } else {
        fallbackCopyText(emailToCopy);
      }
    });
  }

  const fallbackCopyText = (text) => {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.opacity = '0';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
      showToast('E-mail copiado para a área de transferência!', 'success');
    } catch (err) {
      showToast('Não foi possível copiar. E-mail: ' + text, 'info');
    }
    document.body.removeChild(textArea);
  };

  // ==========================================================================
  // 14. FORMULÁRIO DE CONTATO COM VALIDAÇÃO & EMAILJS
  // ==========================================================================
  const contactForm = document.getElementById('contactForm');
  const contactName = document.getElementById('contactName');
  const contactEmail = document.getElementById('contactEmail');
  const contactMessage = document.getElementById('contactMessage');
  const btnSubmitContact = document.getElementById('btnSubmitContact');

  const nameError = document.getElementById('nameError');
  const emailError = document.getElementById('emailError');
  const messageError = document.getElementById('messageError');

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // === EmailJS Configuration ===
  // Para ativar o envio real, substitua os valores abaixo:
  const EMAILJS_PUBLIC_KEY = 'YOUR_PUBLIC_KEY';  // Substitua pela sua Public Key
  const EMAILJS_SERVICE_ID = 'YOUR_SERVICE_ID';  // Substitua pelo seu Service ID
  const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID'; // Substitua pelo seu Template ID

  // Inicializar EmailJS (só se configurado)
  const isEmailJSConfigured = EMAILJS_PUBLIC_KEY !== 'YOUR_PUBLIC_KEY';
  if (isEmailJSConfigured && typeof emailjs !== 'undefined') {
    emailjs.init(EMAILJS_PUBLIC_KEY);
  }

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;

      // Validação do Nome
      if (!contactName.value.trim() || contactName.value.trim().length < 2) {
        nameError.classList.add('show');
        contactName.style.borderColor = '#dc2626';
        isValid = false;
      } else {
        nameError.classList.remove('show');
        contactName.style.borderColor = '';
      }

      // Validação do E-mail
      if (!emailRegex.test(contactEmail.value.trim())) {
        emailError.classList.add('show');
        contactEmail.style.borderColor = '#dc2626';
        isValid = false;
      } else {
        emailError.classList.remove('show');
        contactEmail.style.borderColor = '';
      }

      // Validação da Mensagem
      if (!contactMessage.value.trim() || contactMessage.value.trim().length < 5) {
        messageError.classList.add('show');
        contactMessage.style.borderColor = '#dc2626';
        isValid = false;
      } else {
        messageError.classList.remove('show');
        contactMessage.style.borderColor = '';
      }

      if (!isValid) return;

      // Estado de Carregamento
      btnSubmitContact.classList.add('loading');
      btnSubmitContact.disabled = true;

      if (isEmailJSConfigured && typeof emailjs !== 'undefined') {
        // Envio real via EmailJS
        emailjs.sendForm(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, contactForm)
          .then(() => {
            btnSubmitContact.classList.remove('loading');
            btnSubmitContact.disabled = false;
            contactForm.reset();
            showToast('Mensagem enviada com sucesso! Obrigado pelo contato.', 'success');
          })
          .catch((error) => {
            btnSubmitContact.classList.remove('loading');
            btnSubmitContact.disabled = false;
            showToast('Erro ao enviar. Tente novamente ou use o e-mail direto.', 'info');
            console.error('EmailJS Error:', error);
          });
      } else {
        // Simulação de envio (fallback quando EmailJS não está configurado)
        setTimeout(() => {
          btnSubmitContact.classList.remove('loading');
          btnSubmitContact.disabled = false;
          contactForm.reset();
          showToast('Mensagem enviada com sucesso! Obrigado pelo contato.', 'success');
        }, 1200);
      }
    });

    // Limpeza de erros ao digitar
    [contactName, contactEmail, contactMessage].forEach(input => {
      if (input) {
        input.addEventListener('input', () => {
          input.style.borderColor = '';
          const group = input.closest('.form-group');
          if (group) {
            const err = group.querySelector('.form-error');
            if (err) err.classList.remove('show');
          }
        });
      }
    });
  }

  // ==========================================================================
  // 15. UTILITÁRIO DE TOAST NOTIFICATION PREMIUM
  // ==========================================================================
  function showToast(message, type = 'info') {
    const existingToast = document.querySelector('.custom-toast');
    if (existingToast) existingToast.remove();

    const toast = document.createElement('div');
    toast.className = 'custom-toast';

    let iconHtml = '<i class="fa-solid fa-circle-info" style="color: #059669;"></i>';
    let borderColor = 'rgba(5, 150, 105, 0.3)';

    if (type === 'success') {
      iconHtml = '<i class="fa-solid fa-circle-check" style="color: #059669;"></i>';
      borderColor = 'rgba(5, 150, 105, 0.35)';
    }

    toast.innerHTML = `
      ${iconHtml}
      <span>${escapeHtml(message)}</span>
    `;

    Object.assign(toast.style, {
      position: 'fixed',
      bottom: '25px',
      left: '50%',
      transform: 'translateX(-50%) translateY(50px)',
      backgroundColor: '#ffffff',
      color: '#1e293b',
      padding: '12px 24px',
      borderRadius: '30px',
      boxShadow: '0 12px 30px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(5, 150, 105, 0.15)',
      border: `1px solid ${borderColor}`,
      fontSize: '0.92rem',
      fontFamily: 'var(--font-sans)',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      zIndex: '3000',
      transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
      opacity: '0',
      maxWidth: '90vw',
      textAlign: 'center'
    });

    document.body.appendChild(toast);

    requestAnimationFrame(() => {
      toast.style.transform = 'translateX(-50%) translateY(0)';
      toast.style.opacity = '1';
    });

    setTimeout(() => {
      toast.style.transform = 'translateX(-50%) translateY(50px)';
      toast.style.opacity = '0';
      setTimeout(() => toast.remove(), 400);
    }, 4000);
  }

  // Função auxiliar de escape para proteção XSS no terminal
  function escapeHtml(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
});
