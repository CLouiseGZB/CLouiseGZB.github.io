// ===== ANIMATION H2 =====
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('animated-h2');
    } else {
      entry.target.classList.remove('animated-h2');
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('h2').forEach(h2 => observer.observe(h2));

// ===== MENU MOBILE =====
document.addEventListener('DOMContentLoaded', () => {
  const menuBtn  = document.querySelector('.mobile-menu-btn');
  const menu     = document.getElementById('menu');

  // Crée l'overlay backdrop et l'injecte dans le body
  const overlay  = document.createElement('div');
  overlay.className = 'menu-overlay';
  overlay.setAttribute('aria-hidden', 'true');
  document.body.appendChild(overlay);

  function openMenu() {
    menu.classList.add('is-open');
    overlay.classList.add('is-open');
    menuBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden'; // bloque le scroll derrière
    menuBtn.style.fontSize = '0'; // cache le texte du bouton pour éviter les doublons avec l'overlay 
  }

  function closeMenu() {
    menu.classList.remove('is-open');
    overlay.classList.remove('is-open');
    menuBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    menuBtn.style.fontSize = '';         // ← restaure le texte
  }

  menuBtn.addEventListener('click', () => {
    const isOpen = menu.classList.contains('is-open');
    isOpen ? closeMenu() : openMenu();
  });

  // Fermeture au clic sur l'overlay
  overlay.addEventListener('click', closeMenu);

  // Fermeture au clic sur un lien du menu
  menu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Fermeture à la touche Escape
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && menu.classList.contains('is-open')) {
      closeMenu();
      menuBtn.focus();
    }
  });

  // Fermeture si l'écran devient large (retour desktop)
  window.matchMedia('(min-width: 1051px)').addEventListener('change', e => {
    if (e.matches) closeMenu();
  });
});

// ===== SONS MENU =====
function addSoundToElements(selector, hoverSoundSrc, clickSoundSrc) {
  const elements = document.querySelectorAll(selector);

  function playSound(src) {
    const audio = new Audio(src);
    audio.preload = 'auto';
    audio.play().catch(() => {});
  }

  elements.forEach(el => {
    el.addEventListener('mouseover', () => playSound(hoverSoundSrc));
    el.addEventListener('click',     () => playSound(clickSoundSrc));
  });
}

document.addEventListener('DOMContentLoaded', () => {
  addSoundToElements('.item', '/sound/Hidden-Blade-Select.mp3', '/sound/Accept.mp3');
});

// ===== SON POMME D'EDEN =====
document.addEventListener('DOMContentLoaded', () => {
  const boite = document.querySelector('.boite');
  if (!boite) return;

  const activationSound = new Audio('/sound/Memory -Sequence-Synchronized.mp3');

  boite.addEventListener('click', () => {
  activationSound.play().catch(() => {});

  boite.classList.add('is-syncing');

  boite.innerHTML = `
    <div class="blueprint" aria-hidden="true">
      ${Array.from({ length: 20 }, () => `
        <div class="bar">
          <div class="dot1"></div>
          <div class="dot2"></div>
        </div>
      `).join('')}
    </div>
    <span class="sync-text">Synchronisation en cours...</span>
  `;

}, { once: true });
});

// ===== SON RETOUR EN HAUT =====
document.addEventListener('DOMContentLoaded', () => {
  const btn   = document.querySelector('#scroll_to_top');
  const sound = document.getElementById('topSound');
  if (!btn || !sound) return;

  btn.addEventListener('click', () => {
    sound.currentTime = 0;
    sound.play().catch(() => {});
  });
});

// ===== SON HOVER PROJETS =====
document.addEventListener('DOMContentLoaded', () => {
  const container = document.querySelector('.parent');
  const sound     = document.getElementById('projectSound');
  if (!container || !sound) return;

  container.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mouseover', () => {
      sound.currentTime = 0;
      sound.play().catch(() => {});
    });
  });
});

// ===== MENU DYNAMIQUE (progression + active) =====
const sections     = document.querySelectorAll('section, .hero');
const navItems     = document.querySelectorAll('.game-menu .item');
const progressBar  = document.querySelector('.progress span');
const syncText     = document.querySelector('#syncText');

let currentSyncValue = 20;
let syncAnimation    = null;

const progressValues = {
  top:      '20%',
  lore:     '40%',
  skills:   '60%',
  projects: '80%',
  cv:       '100%'
};

function setActive(id) {
  navItems.forEach(item => {
    const link = item.querySelector('a');
    item.classList.toggle('active', link.getAttribute('href') === `#${id}`);
  });

  const value = progressValues[id] || '20%';
  if (progressBar) progressBar.style.width = value;

  if (syncText) {
    const targetValue = parseInt(value);

    clearInterval(syncAnimation);
    syncText.classList.remove('sync-glitch');
    void syncText.offsetWidth; // force reflow pour relancer l'animation CSS
    syncText.classList.add('sync-glitch');

    syncAnimation = setInterval(() => {
      if (currentSyncValue === targetValue) {
        clearInterval(syncAnimation);
        return;
      }
      currentSyncValue += currentSyncValue < targetValue ? 1 : -1;
      syncText.textContent = `Synchronisation : ${currentSyncValue}%`;
    }, 20);
  }
}

// Clic sur un lien de nav
navItems.forEach(item => {
  item.querySelector('a').addEventListener('click', () => {
    const id = item.querySelector('a').getAttribute('href').replace('#', '');
    setActive(id);
  });
});

// Scroll spy
window.addEventListener('scroll', () => {
  let current = 'top';
  sections.forEach(section => {
    const top    = section.offsetTop - 200;
    const bottom = top + section.offsetHeight;
    if (window.scrollY >= top && window.scrollY < bottom) {
      current = section.id;
    }
  });
  setActive(current);
}, { passive: true });

setActive('top');

// ===== DESCRIPTION =====
document.addEventListener('DOMContentLoaded', () => {
  const memoryBtn = document.querySelector('.sync-trigger');
  const description = document.querySelector('.main_menu.description');

  if (!memoryBtn || !description) return;

  memoryBtn.addEventListener('click', () => {
    description.classList.toggle('expanded');

    memoryBtn.classList.remove('sync-glitch');
    void memoryBtn.offsetWidth;
    memoryBtn.classList.add('sync-glitch');

    memoryBtn.textContent = description.classList.contains('expanded')
      ? 'Désynchroniser mémoire'
      : 'Synchroniser mémoire';
  });
});

// ===== PAGINATION PROJETS =====
document.addEventListener('DOMContentLoaded', () => {
  const parent = document.querySelector('.parent');
  const pagination = document.querySelector('.project-pagination');
  if (!parent || !pagination) return;

  const projects = [...parent.querySelectorAll('a')];
  const perPage = 6;
  const totalPages = Math.ceil(projects.length / perPage);

  if (totalPages <= 1) return;

  let currentPage = 1;

  function showPage(page) {
    currentPage = page;

    projects.forEach((p, index) => {
      const pageOfProject = Math.ceil((index + 1) / perPage);
      p.style.display = pageOfProject === page ? 'block' : 'none';
    });

    [...pagination.querySelectorAll('.page-btn')].forEach(btn => {
      btn.classList.toggle('active', parseInt(btn.dataset.page) === page);
    });

    // Désactive les flèches aux extrémités
    prevBtn.disabled = page === 1;
    nextBtn.disabled = page === totalPages;
  }

  // Flèche gauche
  const prevBtn = document.createElement('button');
  prevBtn.textContent = '←';
  prevBtn.setAttribute('aria-label', 'Page précédente');
  prevBtn.addEventListener('click', () => {
    if (currentPage > 1) showPage(currentPage - 1);
  });
  pagination.appendChild(prevBtn);

  // Boutons numérotés
  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement('button');
    btn.textContent = `0${i}`;
    btn.dataset.page = i;
    btn.classList.add('page-btn');
    btn.setAttribute('aria-label', `Page ${i}`);
    btn.addEventListener('click', () => showPage(i));
    pagination.appendChild(btn);
  }

  // Flèche droite
  const nextBtn = document.createElement('button');
  nextBtn.textContent = '→';
  nextBtn.setAttribute('aria-label', 'Page suivante');
  nextBtn.addEventListener('click', () => {
    if (currentPage < totalPages) showPage(currentPage + 1);
  });
  pagination.appendChild(nextBtn);

  showPage(1);
});