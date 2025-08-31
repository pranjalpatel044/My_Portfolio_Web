// body Background pattern
const canvas = document.getElementById('bgCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particlesArray = [];

for (let i = 0; i < 100; i++) {
    particlesArray.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 2,
        dx: (Math.random() - 0.5) * 0.5,
        dy: (Math.random() - 0.5) * 0.5,
    });
}
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particlesArray.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = "#ffffff22";
        ctx.fill();
        p.x += p.dx;
        p.y += p.dy;
        if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
    });
    requestAnimationFrame(animate);
}
animate();

// cursor
const cursorDot = document.querySelector(".cursor-dot");
const cursorOutline = document.querySelector(".cursor-outline");

document.addEventListener("mousemove", e => {
    cursorDot.style.top = `${e.clientY}px`;
    cursorDot.style.left = `${e.clientX}px`;

    cursorOutline.style.top = `${e.clientY}px`;
    cursorOutline.style.left = `${e.clientX}px`;
});



// Preloader animation
window.addEventListener('load', () => {
    setTimeout(() => {
        const loader = document.querySelector('.loader-wrapper');
        loader.style.opacity = '0';
        setTimeout(() => {
            loader.style.display = 'none';
        }, 500);
    }, 2000);
});

// Toggle mobile menu
function toggleMenu() {
    document.getElementById("nav-links").classList.toggle("active");
}

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (!target) return;
        const headerOffset = document.querySelector('.header').offsetHeight;
        const elementPosition = target.offsetTop - headerOffset;

        window.scrollTo({
            top: elementPosition,
            behavior: 'smooth'
        });

        // Close menu on mobile
        document.getElementById("nav-links").classList.remove("active");
    });
});

// Header scroll + active link
const header = document.querySelector('.header');
const links = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        header.classList.add('header-scrolled');
    } else {
        header.classList.remove('header-scrolled');
    }

    // Highlight active section link
    const scrollPos = window.scrollY + header.offsetHeight + 20;

    links.forEach(link => {
        const section = document.querySelector(link.getAttribute('href'));
        if (section &&
            section.offsetTop <= scrollPos &&
            section.offsetTop + section.offsetHeight > scrollPos) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
});



// ScrollTOTopBtn
// Get button
const scrollBtn = document.getElementById("scrollTopBtn");

// Show/hide on scroll
window.onscroll = function () {
    if (document.body.scrollTop > 200 || document.documentElement.scrollTop > 200) {
        scrollBtn.style.display = "block";
    } else {
        scrollBtn.style.display = "none";
    }
};

// Smooth scroll to top
scrollBtn.addEventListener("click", function () {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
});


// =============== AI CHAT SCRIPT ===============
const chatButton = document.getElementById("chatButton");
const chatWindow = document.getElementById("chatWindow");
const closeChat = document.getElementById("closeChat");
const sendBtn = document.getElementById("sendBtn");
const userInput = document.getElementById("userInput");
const chatbox = document.getElementById("chatbox");

// Toggle chat
chatButton.onclick = () => {
  chatWindow.style.display = "flex";
  chatButton.style.display = "none";
};
closeChat.onclick = () => {
  chatWindow.style.display = "none";
  chatButton.style.display = "block";
};

// Send on button / enter
sendBtn.onclick = sendMessage;
userInput.addEventListener("keypress", e => {
  if (e.key === "Enter") sendMessage();
});

async function sendMessage() {
  let message = userInput.value.trim();
  if (!message) return;

  // Show user message
  chatbox.innerHTML += `<div class="message user">${message}</div>`;
  userInput.value = "";
  chatbox.scrollTop = chatbox.scrollHeight;

  // Typing indicator
  let typingEl = document.createElement("div");
  typingEl.className = "message bot typing";
  typingEl.innerText = "Thinking…";
  chatbox.appendChild(typingEl);
  chatbox.scrollTop = chatbox.scrollHeight;

  try {
    let response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message })  
    });
    let reply = await response.text();

    // Replace typing with real reply
    typingEl.remove();
    chatbox.innerHTML += `<div class="message bot">${reply}</div>`;
    chatbox.scrollTop = chatbox.scrollHeight;

  } catch (err) {
    typingEl.remove();
    chatbox.innerHTML += `<div class="message bot">⚠️ Error: ${err.message}</div>`;
  }
}
