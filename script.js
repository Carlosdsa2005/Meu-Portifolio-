/**
 * ==========================================================================
 * CARLOS DANIEL GOMES DE SÁ - PORTFÓLIO PROFISSIONAL
 * Script de Interatividade (script.js)
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
  // 5. CANVAS INTERATIVO DE FUNDO TECNOLÓGICO (CYBER NODES / CONSTELLATION)
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
        this.vx = (Math.random() - 0.5) * 0.6;
        this.vy = (Math.random() - 0.5) * 0.6;
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
        ctx.fillStyle = 'rgba(0, 242, 254, 0.45)';
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
            const alpha = (1 - dist / 125) * 0.22;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(0, 242, 254, ${alpha})`;
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
  // 6. TERMINAL INTERATIVO NO HERO
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
            <span style="color: var(--accent-cyan);">Comandos disponíveis:</span><br>
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
            <strong style="color: var(--accent-cyan);">[Linguagens]</strong> C, Java, Python, JavaScript, HTML5/CSS3, Bash/Shell<br>
            <strong style="color: var(--accent-cyan);">[Fundamentos]</strong> Árvores AVL, Listas Encadeadas, Algoritmos de Ordenação, Big-O<br>
            <strong style="color: var(--accent-cyan);">[Infraestrutura]</strong> Diagnóstico de Hardware, Redes TCP/IP, Montagem e Helpdesk N1/N2
          </div>
        `;
        break;

      case 'projects':
        outputBlock.innerHTML = `
          <div class="term-output">
            1. <strong>Estruturas de Dados e Algoritmos</strong> (C, Java, Python)<br>
            2. <strong>NetPulse: Diagnóstico de Redes</strong> (Python & Shell Script)<br>
            3. <strong>Visualizador de Árvores AVL</strong> (JavaScript & Canvas)<br>
            4. <strong>Portfólio Web Pessoal</strong> (HTML5, CSS3 Glassmorphism, JS)<br>
            <em style="color: var(--text-muted);">Dica: Role até a seção #projetos para ver detalhes!</em>
          </div>
        `;
        break;

      case 'contact':
        outputBlock.innerHTML = `
          <div class="term-output">
            📧 E-mail: <span style="color: var(--accent-cyan);">carlosdaniel.sa.dev@gmail.com</span><br>
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
          <p class="term-output" style="color: #f87171;"><i class="fa-solid fa-lock"></i> Permissão negada: você não está no arquivo sudoers. Este incidente será reportado!</p>
        `;
        break;

      default:
        outputBlock.innerHTML = `
          <p class="term-output" style="color: #f87171;">Comando não reconhecido: "${escapeHtml(cmd)}". Digite <span style="color: var(--accent-cyan);">help</span> para ver os comandos válidos.</p>
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
  // 7. FILTROS DINÂMICOS DA SEÇÃO DE PROJETOS
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
  // 8. MODAL DE CURRÍCULO PROFISSIONAL
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
  // 9. MODAL DE DETALHES DO PROJETO
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
    estruturas: {
      title: 'Estruturas de Dados e Algoritmos',
      badge: 'Ciência da Computação & Otimização',
      icon: 'fa-code-branch',
      github: 'https://github.com/Carlosdsa2005',
      content: `
        <div class="project-detail-section">
          <h4><i class="fa-solid fa-layer-group"></i> Visão Geral</h4>
          <p>Projeto acadêmico dedicado à implementação em baixo e médio nível (C e Java) de estruturas fundamentais que compõem os alicerces dos sistemas modernos de software.</p>
        </div>
        <div class="project-detail-section">
          <h4><i class="fa-solid fa-gears"></i> Funcionalidades & Algoritmos Implementados</h4>
          <ul class="project-detail-features">
            <li><strong>Árvores AVL:</strong> Balanceamento dinâmico rigoroso com verificação de fator de balanceamento e rotações simples (Direita-Direita, Esquerda-Esquerda) e duplas (Direita-Esquerda, Esquerda-Direita). Complexidade O(log n) garantida.</li>
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
          <p>Ferramenta desenvolvida a partir da necessidade prática no suporte técnico da Secretaria de Saúde para automatizar a identificação de quedas de links, gargalos de latência e hosts inativos em redes locais.</p>
        </div>
        <div class="project-detail-section">
          <h4><i class="fa-solid fa-gears"></i> Principais Módulos</h4>
          <ul class="project-detail-features">
            <li><strong>Scanner de Sub-rede ICMP:</strong> Varredura rápida assíncrona por range CIDR (/24) identificando IPs em uso e tempos de resposta em milissegundos.</li>
            <li><strong>Port Check Rápido:</strong> Validação de portas críticas de rede (HTTP 80, HTTPS 443, DNS 53, SSH 22, SMB 445 e RDP 3389).</li>
            <li><strong>Relatório e Alerta em Log:</strong> Geração automatizada de logs estruturados em JSON para acompanhamento do histórico de oscilações da infraestrutura.</li>
          </ul>
        </div>
        <div class="project-detail-section">
          <h4><i class="fa-solid fa-server"></i> Tecnologias & Protocolos</h4>
          <p>Python (módulos socket e subprocess), Shell Scripting para automação no Linux e entendimento da pilha de protocolos TCP/IP.</p>
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
          <p>Aplicação web interativa criada para demonstrar de forma visual e intuitiva como ocorrem as inserções, remoções e o recalculo das alturas dos nós em uma árvore binária de busca auto-balanceável.</p>
        </div>
        <div class="project-detail-section">
          <h4><i class="fa-solid fa-gears"></i> Recursos Interativos</h4>
          <ul class="project-detail-features">
            <li><strong>Inserção e Remoção ao Vivo:</strong> O usuário adiciona qualquer valor numérico e observa a árvore reorganizando os nós em tempo real.</li>
            <li><strong>Destaque de Rotações:</strong> Exibição animada quando ocorre desbalanceamento (|FB| &gt; 1), indicando qual rotação foi executada.</li>
            <li><strong>Renderização com Canvas API:</strong> Cálculo geométrico dinâmico de nós, arestas e coordenadas para garantir que galhos não se sobreponham.</li>
          </ul>
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
          <p>Site profissional construído sem frameworks pesados, aplicando as melhores práticas da web moderna: Vanilla CSS com Glassmorphism, JavaScript ES6+ modular, total acessibilidade e otimização para SEO.</p>
        </div>
        <div class="project-detail-section">
          <h4><i class="fa-solid fa-gears"></i> Destaques de Implementação</h4>
          <ul class="project-detail-features">
            <li><strong>Terminal Interativo Embutido:</strong> Interpretador de comandos reais em JavaScript com histórico e autoscroll.</li>
            <li><strong>Background com Canvas 2D:</strong> Simulação de rede de partículas (Cyber Nodes) com interação ao cursor do mouse.</li>
            <li><strong>Currículo com Modo de Impressão:</strong> Folha de estilos otimizada via @media print para conversão em PDF limpo em alta resolução.</li>
          </ul>
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
  // 10. COPIAR E-MAIL COM FEEDBACK VISUAL
  // ==========================================================================
  const btnCopyEmail = document.getElementById('btnCopyEmail');
  const emailToCopy = 'carlosdaniel.sa.dev@gmail.com';

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
  // 11. FORMULÁRIO DE CONTATO COM VALIDAÇÃO & FEEDBACK ELEGANTE
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

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let isValid = true;

      // Validação do Nome
      if (!contactName.value.trim() || contactName.value.trim().length < 2) {
        nameError.classList.add('show');
        contactName.style.borderColor = '#f87171';
        isValid = false;
      } else {
        nameError.classList.remove('show');
        contactName.style.borderColor = '';
      }

      // Validação do E-mail
      if (!emailRegex.test(contactEmail.value.trim())) {
        emailError.classList.add('show');
        contactEmail.style.borderColor = '#f87171';
        isValid = false;
      } else {
        emailError.classList.remove('show');
        contactEmail.style.borderColor = '';
      }

      // Validação da Mensagem
      if (!contactMessage.value.trim() || contactMessage.value.trim().length < 5) {
        messageError.classList.add('show');
        contactMessage.style.borderColor = '#f87171';
        isValid = false;
      } else {
        messageError.classList.remove('show');
        contactMessage.style.borderColor = '';
      }

      if (!isValid) return;

      // Estado de Carregamento
      btnSubmitContact.classList.add('loading');
      btnSubmitContact.disabled = true;

      // Simulação de envio com feedback amigável
      setTimeout(() => {
        btnSubmitContact.classList.remove('loading');
        btnSubmitContact.disabled = false;
        contactForm.reset();

        showToast('Mensagem enviada com sucesso! Obrigado pelo contato.', 'success');
      }, 1200);
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
  // 12. UTILITÁRIO DE TOAST NOTIFICATION PREMIUM
  // ==========================================================================
  function showToast(message, type = 'info') {
    const existingToast = document.querySelector('.custom-toast');
    if (existingToast) existingToast.remove();

    const toast = document.createElement('div');
    toast.className = 'custom-toast';

    let iconHtml = '<i class="fa-solid fa-circle-info" style="color: var(--accent-cyan);"></i>';
    let borderColor = 'rgba(0, 242, 254, 0.4)';

    if (type === 'success') {
      iconHtml = '<i class="fa-solid fa-circle-check" style="color: #34d399;"></i>';
      borderColor = 'rgba(16, 185, 129, 0.4)';
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
      backgroundColor: 'rgba(9, 14, 26, 0.96)',
      color: '#f8fafc',
      padding: '12px 24px',
      borderRadius: '30px',
      boxShadow: '0 12px 30px rgba(0, 0, 0, 0.7), 0 0 15px rgba(0, 242, 254, 0.25)',
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
