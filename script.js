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

function bindHeroMotion() {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const root = document.documentElement;

  function updateHeroVars() {
    if (prefersReducedMotion.matches) {
      root.style.removeProperty("--hero-scale");
      root.style.removeProperty("--hero-opacity");
      return;
    }

    const progress = Math.min(window.scrollY / Math.max(window.innerHeight * 0.8, 1), 1);
    root.style.setProperty("--hero-scale", String(1 + progress * 0.16));
    root.style.setProperty("--hero-opacity", String(1 - progress * 0.38));
  }

  updateHeroVars();
  window.addEventListener("scroll", updateHeroVars, { passive: true });
  prefersReducedMotion.addEventListener("change", updateHeroVars);
}

loadDownloadStats();
bindHeroMotion();
