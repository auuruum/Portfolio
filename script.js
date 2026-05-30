const timeEl = document.querySelector("#local-time");

function updateVilniusTime() {
  if (!timeEl) return;

  const value = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Vilnius",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date());

  timeEl.textContent = value;
}

updateVilniusTime();
setInterval(updateVilniusTime, 30_000);

async function loadDownloadStats() {
  const endpoints = [
    ["#modrinth-downloads", "https://aurumoracle.duckdns.org/api/modrinth/"],
    ["#curseforge-downloads", "https://aurumoracle.duckdns.org/api/curseforge/"],
  ];

  await Promise.all(
    endpoints.map(async ([selector, url]) => {
      const target = document.querySelector(selector);
      if (!target) return;

      try {
        const response = await fetch(url);
        if (!response.ok) return;
        const data = await response.json();
        if (data.downloads) target.textContent = data.downloads;
      } catch {
        // Static fallback values stay visible when the stats API is unreachable.
      }
    }),
  );
}

loadDownloadStats();

const canvas = document.querySelector("#signal-canvas");
const ctx = canvas.getContext("2d");
const particles = [];
const colors = ["#74f0c5", "#7bb7ff", "#ff7a6b", "#ffd166"];

function resizeCanvas() {
  const ratio = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.floor(window.innerWidth * ratio);
  canvas.height = Math.floor(window.innerHeight * ratio);
  canvas.style.width = `${window.innerWidth}px`;
  canvas.style.height = `${window.innerHeight}px`;
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
}

function seedParticles() {
  particles.length = 0;
  const count = Math.min(70, Math.max(32, Math.floor(window.innerWidth / 18)));

  for (let i = 0; i < count; i += 1) {
    particles.push({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.42,
      vy: (Math.random() - 0.5) * 0.42,
      size: 1.2 + Math.random() * 2.8,
      color: colors[i % colors.length],
    });
  }
}

function draw() {
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

  for (const point of particles) {
    point.x += point.vx;
    point.y += point.vy;

    if (point.x < -20) point.x = window.innerWidth + 20;
    if (point.x > window.innerWidth + 20) point.x = -20;
    if (point.y < -20) point.y = window.innerHeight + 20;
    if (point.y > window.innerHeight + 20) point.y = -20;

    ctx.beginPath();
    ctx.fillStyle = point.color;
    ctx.globalAlpha = 0.7;
    ctx.arc(point.x, point.y, point.size, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.globalAlpha = 0.14;
  ctx.strokeStyle = "#f5f0e8";
  for (let i = 0; i < particles.length; i += 1) {
    for (let j = i + 1; j < particles.length; j += 1) {
      const a = particles[i];
      const b = particles[j];
      const dx = a.x - b.x;
      const dy = a.y - b.y;
      const distance = Math.hypot(dx, dy);

      if (distance < 145) {
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }
    }
  }
  ctx.globalAlpha = 1;

  requestAnimationFrame(draw);
}

window.addEventListener("resize", () => {
  resizeCanvas();
  seedParticles();
});

resizeCanvas();
seedParticles();
draw();
