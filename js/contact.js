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

// ===== Suggestions Form Handling =====
const suggestionForm = document.getElementById('suggestionForm');
const suggestionStatus = document.getElementById('suggestionStatus');

suggestionForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  suggestionStatus.textContent = "Submitting suggestion...";

  const formData = new FormData(suggestionForm);
  const data = Object.fromEntries(formData.entries());

  try {
    const res = await fetch('https://gaurav.dapirates.xyz/api/suggestions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    const result = await res.json();
    suggestionStatus.textContent = result.message || '✅ Suggestion submitted!';
    suggestionForm.reset();
  } catch (err) {
    console.error(err);
    suggestionStatus.textContent = "❌ Failed to submit suggestion. Please try again.";
  }
});
