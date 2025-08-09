document.addEventListener('DOMContentLoaded', () => {

  // ===== HAMBURGER MENU =====
  const hamburger = document.querySelector(".hamburger");
  const navLinks = document.querySelector(".nav-links");

  hamburger.addEventListener("click", (e) => {
    e.stopPropagation();
    navLinks.classList.toggle("active");
  });

  document.addEventListener("click", (e) => {
    if (!navLinks.contains(e.target) && !hamburger.contains(e.target)) {
      navLinks.classList.remove("active");
    }
  });

  // ===== TYPEWRITER EFFECT =====
  const words = ["Web Developer", "Freelancer", "Open Source Contributor", "Bot Developer"];
  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  const element = document.getElementById("typewriter");

  const type = () => {
    const currentWord = words[wordIndex];
    const text = isDeleting
      ? currentWord.substring(0, charIndex--)
      : currentWord.substring(0, charIndex++);

    element.textContent = text;

    let delay = isDeleting ? 80 : 120;

    if (!isDeleting && charIndex === currentWord.length) {
      delay = 1500;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      delay = 500;
    }

    setTimeout(type, delay);
  };

  type();

  // ===== RIPPLE EFFECT FOR SOCIAL BUTTONS =====
  const socialBtns = document.querySelectorAll('.social-btn');

  socialBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const platform = btn.getAttribute('data-platform');
      console.log(`Clicked on ${platform}`);

      const ripple = document.createElement('span');
      ripple.classList.add('ripple');

      const rect = btn.getBoundingClientRect();
      ripple.style.left = `${e.clientX - rect.left}px`;
      ripple.style.top = `${e.clientY - rect.top}px`;

      btn.appendChild(ripple);

      setTimeout(() => ripple.remove(), 600);
    });
  });

});
