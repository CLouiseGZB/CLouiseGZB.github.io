// ***************** animation h2************************
const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animated-h2');

        } else {
            // Optionnel : Retirer la classe si l'élément sort du viewport
            entry.target.classList.remove('animated-h2');
        }
    });
}, {
    threshold: 0.5 // L'élément doit être visible à 50% pour déclencher l'animation
});

const h2Elements = document.querySelectorAll('h2');
h2Elements.forEach(h2 => observer.observe(h2));
// ***************** animation h2 fin************************

function createInteractiveElement(element, hoverSound, clickSound) {
    element.addEventListener('mouseover', () => {
      playSound(hoverSound);
    });
  
    element.addEventListener('click', () => {
      playSound(clickSound);
      
    });
  
    function playSound(soundFile) {
      const audio = new Audio();
      audio.preload = 'auto';
      audio.src = soundFile;
      audio.play().catch(error => {
        console.error('Erreur lors de la lecture du son:', error);
        
      });
    }
  }
  
  // Utilisation :
  document.addEventListener('DOMContentLoaded', () => {
    const elements = document.querySelectorAll('.item');
  
    elements.forEach(element => {
      createInteractiveElement(element, '/sound/Hidden-Blade-Select.mp3', '/sound/Accept.mp3');
    });
  });
  



