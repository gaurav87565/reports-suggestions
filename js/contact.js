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

const form = document.getElementById('contactForm');
const status = document.getElementById('status');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  status.textContent = "Sending...";

  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());

  try {
    const res = await fetch('https://gaurav.dapirates.xyz/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    const result = await res.json();
    status.textContent = result.message || 'Message sent!';
    form.reset();
  } catch (err) {
    console.error(err);
    status.textContent = "❌ Failed to send message. Please try again.";
  }
});