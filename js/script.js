/* ============================================================
   script.js — version corrigée complète
   Corrections :
   - ReferenceError "navLinks" → supprimé, on utilise navItems
   - Menu mobile : toggle is-open + overlay + fermeture au clic lien
   - aria-expanded mis à jour
   - Overlay backdrop ajouté dynamiquement
   ============================================================ */

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
  }

  function closeMenu() {
    menu.classList.remove('is-open');
    overlay.classList.remove('is-open');
    menuBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
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

  const intro = boite.querySelector('.intro');
  const image = boite.querySelector('.image');
  const activationSound = new Audio('/sound/Memory -Sequence-Synchronized.mp3');

  boite.addEventListener('click', () => {
    activationSound.play().catch(() => {});
    if (intro) intro.style.display = 'none';
    if (image) image.style.display = 'none';
  });
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