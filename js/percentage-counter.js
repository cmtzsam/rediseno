/**
 * Script para animación de contadores de porcentajes en los tabs
 * Utiliza GSAP para crear animaciones fluidas
 */

document.addEventListener('DOMContentLoaded', () => {
  // Esperar a que GSAP esté cargado
  if (typeof gsap !== 'undefined') {
    // Función para animar números en los spans con porcentajes
    function animatePercentages(container) {
      // Seleccionar todos los elementos h4 que contienen spans con porcentajes
      const percentElements = container.querySelectorAll('h4 span');
      // console.log(percentElements);
      
      percentElements.forEach(span => {
        // Verificar si el contenido es un número
        const value = parseInt(span.textContent);
        if (!isNaN(value)) {
          // Guardar el valor final para la animación
          span.setAttribute('data-final-value', value);
          // Establecer valor inicial en 0
          span.textContent = '0';
          
          // Crear animación con GSAP
          gsap.to(span, {
            duration: 1.5, // Duración de la animación
            ease: "power2.out", // Tipo de easing
            onUpdate: function() {
              // Calcular el valor actual basado en el progreso de la animación
              const progress = this.progress();
              const finalValue = parseInt(span.getAttribute('data-final-value'));
              const currentValue = Math.round(progress * finalValue);
              span.textContent = currentValue;
            },
            onComplete: function() {
              // Asegurar que el valor final sea exacto
              span.textContent = span.getAttribute('data-final-value');
            }
          });
        }
      });
    }

    // Función para observar cambios en el DOM y animar cuando aparecen nuevos tabs
    function setupObserver() {
      // Configurar un MutationObserver para detectar cuando se muestran nuevos tabs
      const tabsContainer = document.querySelector('.homePageRedesign--modalidadesBlock .tabsForDesktop');
      if (tabsContainer) {
        const observer = new MutationObserver(mutations => {
          mutations.forEach(mutation => {
            // Buscar elementos que hayan cambiado de 'display: none' a visible
            if (mutation.type === 'attributes' && 
                mutation.attributeName === 'class' && 
                mutation.target.classList.contains('show')) {
              // Animar los porcentajes en el nuevo tab visible
              animatePercentages(mutation.target);
            }
          });
        });
        
        // Observar cambios en los atributos de clase en todos los tabs
        const tabs = tabsContainer.querySelectorAll('.collapse');
        tabs.forEach(tab => {
          observer.observe(tab, { attributes: true });
        });
        
        // Animar el tab inicial que ya está visible
        const initialTab = tabsContainer.querySelector('.collapse.show');
        if (initialTab) {
          setTimeout(() => {
            animatePercentages(initialTab);
          }, 500);
        }
      }
    }
    
    // Animar también los elementos del acordeón móvil
    function setupMobileAnimations() {
      const accordionForm = document.querySelector('.accordionForm form');
      if (accordionForm) {
        // Animar el primer artículo (por defecto visible en móvil)
        const firstArticle = accordionForm.querySelector('article');
        if (firstArticle) {
          setTimeout(() => {
            animatePercentages(firstArticle);
          }, 500);
        }
        
        // Configurar listeners para cambios en los radio buttons
        const radios = accordionForm.querySelectorAll('input[type="radio"]');
        radios.forEach(radio => {
          radio.addEventListener('change', function() {
            if (this.checked) {
              // Buscar el artículo asociado a este radio button
              const label = this.nextElementSibling;
              const article = label.nextElementSibling;
              if (article && article.tagName === 'ARTICLE') {
                setTimeout(() => {
                  animatePercentages(article);
                }, 300);
              }
            }
          });
        });
      }
    }
    
    // Iniciar observadores y animaciones
    setupObserver();
    setupMobileAnimations();
  }
});
