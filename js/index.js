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

document.addEventListener('DOMContentLoaded', function() {
  const words = ["Web Developer", "Freelancer", "Open Source Contributor", "Bot Developer"];
  let currentWordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let delay = 100;

  const element = document.getElementById("typewriter");

  function type() {
    const currentWord = words[currentWordIndex];
    let displayedText;

    if (isDeleting) {
      displayedText = currentWord.substring(0, charIndex);
      element.textContent = displayedText;
      if (charIndex > 0) {
        charIndex--;
        delay = 80;
      } else {
        isDeleting = false;
        currentWordIndex = (currentWordIndex + 1) % words.length;
        delay = 500;
      }
    } else {
      displayedText = currentWord.substring(0, charIndex);
      element.textContent = displayedText;
      if (charIndex < currentWord.length) {
        charIndex++;
        delay = 120;
      } else {
        delay = 1500;
        isDeleting = true;
      }
    }
    setTimeout(type, delay);
  }

  type(); // start typing
});

       // Add ripple effect to social buttons
       const socialBtns = document.querySelectorAll('.social-btn');
        
       socialBtns.forEach(btn => {
           btn.addEventListener('click', function(e) {
               const platform = this.getAttribute('data-platform');
               console.log(`Clicked on ${platform}`);
               
               // Create ripple effect
               const ripple = document.createElement('span');
               ripple.classList.add('ripple');
               this.appendChild(ripple);
               
               const x = e.clientX - e.target.getBoundingClientRect().left;
               const y = e.clientY - e.target.getBoundingClientRect().top;
               
               ripple.style.left = `${x}px`;
               ripple.style.top = `${y}px`;
               
               setTimeout(() => {
                   ripple.remove();
               }, 600);
           });
       });