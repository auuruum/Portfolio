document.body.classList.add("loading");

const loader = document.querySelector("#loader");
const loaderCount = document.querySelector("#loader-count");
const loaderProgress = document.querySelector("#loader-progress");
const loaderWord = document.querySelector("#loader-word");
const words = ["Design", "Create", "Ship"];
let loaderStarted = performance.now();

function animateLoader(now) {
  const elapsed = now - loaderStarted;
  const progress = Math.min(elapsed / 1900, 1);
  const count = Math.round(progress * 100);

  loaderCount.textContent = String(count).padStart(3, "0");
  loaderProgress.style.transform = `scaleX(${progress})`;
  loaderWord.textContent = words[Math.min(words.length - 1, Math.floor(progress * words.length))];

  if (progress < 1) {
    requestAnimationFrame(animateLoader);
    return;
  }

  window.setTimeout(() => {
    loader.classList.add("done");
    document.body.classList.remove("loading");
  }, 320);
}

requestAnimationFrame(animateLoader);

const header = document.querySelector("#site-header");
window.addEventListener("scroll", () => {
  header.classList.toggle("scrolled", window.scrollY > 100);
});

const roleWord = document.querySelector("#role-word");
const roles = ["builder", "modder", "hardware maker", "toolsmith", "visual creator"];
let roleIndex = 0;

window.setInterval(() => {
  roleIndex = (roleIndex + 1) % roles.length;
  roleWord.animate(
    [
      { opacity: 0, transform: "translateY(8px)" },
      { opacity: 1, transform: "translateY(0)" },
    ],
    { duration: 380, easing: "ease-out" },
  );
  roleWord.textContent = roles[roleIndex];
}, 2000);

function attachHls(video) {
  if (!video) return;

  const source = "https://stream.mux.com/Aa02T7oM1wH5Mk5EEVDYhbZ1ChcdhRsS2m1NYyx4Ua1g.m3u8";

  if (window.Hls && window.Hls.isSupported()) {
    const hls = new window.Hls();
    hls.loadSource(source);
    hls.attachMedia(video);
    return;
  }

  if (video.canPlayType("application/vnd.apple.mpegurl")) {
    video.src = source;
  }
}

attachHls(document.querySelector("#hero-video"));
attachHls(document.querySelector("#footer-video"));

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
        // Static fallback values stay visible when stats API is unreachable.
      }
    }),
  );
}

loadDownloadStats();
