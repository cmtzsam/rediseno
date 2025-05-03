/**
 * Animaciones avanzadas para los tabs de modalidades
 * Este script implementa animaciones con GSAP para los elementos de los tabs
 */

document.addEventListener('DOMContentLoaded', () => {
  // Configuración inicial de GSAP
  gsap.registerPlugin(ScrollTrigger);
  
  // Elementos a animar
  const tabButtons = document.querySelectorAll('.homePageRedesign--modalidadesBlock .tabsForDesktop .btn');
  const tabContents = document.querySelectorAll('.homePageRedesign--modalidadesBlock .tabsForDesktop .collapse');
  
  // Función para animar el contenido de un tab con GSAP
  function animateTabContentWithGSAP(tabElement) {
    // Seleccionar los elementos a animar dentro del tab
    const heading = tabElement.querySelector('h3');
    const paragraphs = tabElement.querySelectorAll('p');
    const lists = tabElement.querySelectorAll('li');
    const image = tabElement.querySelector('img');
    const percentageValues = tabElement.querySelectorAll('h4');
    
    // Detener cualquier animación previa en estos elementos
    gsap.killTweensOf([heading, ...paragraphs, ...lists, image, ...percentageValues]);
    
    // Establecer estados iniciales
    gsap.set(heading, { opacity: 0, y: 30 });
    gsap.set(paragraphs, { opacity: 0, y: 20 });
    gsap.set(lists, { opacity: 0, x: 25 });
    gsap.set(image, { opacity: 0, scale: 0.9 });
    gsap.set(percentageValues, { opacity: 0, y: 15 });
    
    // Timeline para secuenciar las animaciones
    const tl = gsap.timeline();
    
    // Animación del título
    tl.to(heading, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: "power2.out"
    });
    
    // Animación de los porcentajes con contador
    tl.to(percentageValues, {
      opacity: 1,
      y: 0,
      duration: 0.7,
      stagger: 0.15,
      ease: "power2.out",
      onComplete: function() {
        // Animación de contador para cada número
        percentageValues.forEach(el => {
          const span = el.querySelector('span');
          if (span && !isNaN(parseInt(span.textContent))) {
            const finalValue = parseInt(span.textContent);
            gsap.fromTo(span, 
              { innerHTML: '0' }, 
              { 
                innerHTML: finalValue, 
                duration: 1.5, 
                ease: "power2.out",
                snap: { innerHTML: 1 }, // Para asegurar valores enteros
                delay: 0.1
              }
            );
          }
        });
      }
    }, "-=0.3");
    
    // Animación de párrafos con efecto escalonado
    tl.to(paragraphs, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      stagger: 0.1,
      ease: "power2.out"
    }, "-=0.5");
    
    // Animación de los elementos de lista
    tl.to(lists, {
      opacity: 1,
      x: 0,
      duration: 0.7,
      stagger: 0.08,
      ease: "power3.out"
    }, "-=0.4");
    
    // Animación de la imagen
    tl.to(image, {
      opacity: 1,
      scale: 1,
      duration: 0.8,
      ease: "back.out(1.5)"
    }, "-=0.3");
    
    return tl;
  }
  
  // Animar el tab inicial al cargar la página
  const initialTab = document.querySelector('.homePageRedesign--modalidadesBlock .tabsForDesktop .collapse.show');
  if (initialTab) {
    setTimeout(() => {
      animateTabContentWithGSAP(initialTab);
    }, 500);
  }
  
  // Configurar listeners para todos los botones de tabs
  tabButtons.forEach((btn, index) => {
    btn.addEventListener('click', () => {
      // Efecto al hacer clic en el botón
      gsap.fromTo(btn, 
        { scale: 0.95 }, 
        { scale: 1, duration: 0.3, ease: "back.out(2)" }
      );
      
      // Animar el contenido del tab después de un breve retraso
      setTimeout(() => {
        animateTabContentWithGSAP(tabContents[index]);
      }, 100);
    });
  });
  
  // Animaciones para la versión móvil (acordeón)
  const mobileRadios = document.querySelectorAll('.accordionForm input[type="radio"]');
  const mobileArticles = document.querySelectorAll('.accordionForm article');
  
  function animateMobileTabContent(article) {
    // Seleccionar elementos a animar
    const heading = article.querySelector('h3');
    const paragraphs = article.querySelectorAll('p');
    const lists = article.querySelectorAll('li');
    const image = article.querySelector('img');
    const percentageValues = article.querySelectorAll('h4');
    
    // Timeline para las animaciones
    const tl = gsap.timeline();
    
    // Establecer estados iniciales
    gsap.set([heading, paragraphs, lists, image, percentageValues], { opacity: 0 });
    gsap.set(heading, { y: 20 });
    gsap.set(paragraphs, { y: 15 });
    gsap.set(lists, { x: 20 });
    gsap.set(image, { scale: 0.9 });
    gsap.set(percentageValues, { y: 15 });
    
    // Secuencia de animaciones
    tl.to(heading, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" })
      .to(percentageValues, { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: "power2.out" }, "-=0.3")
      .to(paragraphs, { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, ease: "power2.out" }, "-=0.4")
      .to(lists, { opacity: 1, x: 0, duration: 0.5, stagger: 0.1, ease: "power2.out" }, "-=0.3")
      .to(image, { opacity: 1, scale: 1, duration: 0.6, ease: "back.out(1.5)" }, "-=0.3");
    
    // Efecto de contador para los valores numéricos
    percentageValues.forEach(el => {
      const span = el.querySelector('span');
      if (span && !isNaN(parseInt(span.textContent))) {
        const finalValue = parseInt(span.textContent);
        setTimeout(() => {
          gsap.fromTo(span, 
            { innerHTML: '0' }, 
            { 
              innerHTML: finalValue, 
              duration: 1.2, 
              ease: "power1.out",
              snap: { innerHTML: 1 }
            }
          );
        }, 400);
      }
    });
    
    return tl;
  }
  
  // Configurar evento para los radio buttons del acordeón móvil
  mobileRadios.forEach((radio, index) => {
    radio.addEventListener('change', () => {
      if (radio.checked) {
        // Efecto visual para la etiqueta seleccionada
        const label = radio.nextElementSibling;
        gsap.fromTo(label, 
          { backgroundColor: "rgba(220, 53, 69, 0.2)" },
          { backgroundColor: "rgba(220, 53, 69, 0)", duration: 0.5 }
        );
        
        // Animar el contenido del artículo
        setTimeout(() => {
          animateMobileTabContent(mobileArticles[index]);
        }, 300);
      }
    });
  });
  
  // Animar el tab inicial en móvil
  const initialRadio = document.querySelector('.accordionForm input[type="radio"]:checked');
  if (initialRadio) {
    const index = Array.from(mobileRadios).indexOf(initialRadio);
    setTimeout(() => {
      animateMobileTabContent(mobileArticles[index]);
    }, 500);
  }
  
  // Añadir CSS dinámico para mejorar las transiciones
  const style = document.createElement('style');
  style.textContent = `
    .homePageRedesign--modalidadesBlock .tabsForDesktop .btn.btn-primary {
      transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
    }
    .homePageRedesign--modalidadesBlock .tabsForDesktop .btn.btn-primary:hover {
      transform: scale(1.05);
      box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
    }
    .homePageRedesign--modalidadesBlock .card-body article h3,
    .homePageRedesign--modalidadesBlock .card-body article h4,
    .homePageRedesign--modalidadesBlock .card-body article p,
    .homePageRedesign--modalidadesBlock .card-body article li,
    .homePageRedesign--modalidadesBlock .card-body article img {
      will-change: opacity, transform;
    }
    .accordionForm label {
      transition: background-color 0.3s ease, transform 0.3s ease;
    }
    .accordionForm label:hover {
      transform: translateX(5px);
    }
    .accordionForm input[type="radio"]:checked + label {
      box-shadow: 0 3px 10px rgba(220, 53, 69, 0.2);
    }
  `;
  document.head.appendChild(style);
});
