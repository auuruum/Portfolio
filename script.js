const marqueeImages = [
  "https://motionsites.ai/assets/hero-space-voyage-preview-eECLH3Yc.gif",
  "https://motionsites.ai/assets/hero-codenest-preview-Cgppc2qV.gif",
  "https://motionsites.ai/assets/hero-vex-ventures-preview-BczMFIiw.gif",
  "https://motionsites.ai/assets/hero-stellar-ai-v2-preview-DjvxjG3C.gif",
  "https://motionsites.ai/assets/hero-asme-preview-B_nGDnTP.gif",
  "https://motionsites.ai/assets/hero-transform-data-preview-Cx5OU29N.gif",
  "https://motionsites.ai/assets/hero-vitara-preview-Cjz2QYyU.gif",
  "https://motionsites.ai/assets/hero-terra-preview-BFjrCr7T.gif",
  "https://motionsites.ai/assets/hero-skyelite-preview-DHaZIgUv.gif",
  "https://motionsites.ai/assets/hero-aethera-preview-DknSlcTa.gif",
  "https://motionsites.ai/assets/hero-designpro-preview-D8c5_een.gif",
  "https://motionsites.ai/assets/hero-stellar-ai-preview-D3HL6bw1.gif",
  "https://motionsites.ai/assets/hero-xportfolio-preview-D4A8maiC.gif",
  "https://motionsites.ai/assets/hero-orbit-web3-preview-BXt4OttD.gif",
  "https://motionsites.ai/assets/hero-nexora-preview-cx5HmUgo.gif",
  "https://motionsites.ai/assets/hero-evr-ventures-preview-DZxeVFEX.gif",
  "https://motionsites.ai/assets/hero-planet-orbit-preview-DWAP8Z1P.gif",
  "https://motionsites.ai/assets/hero-new-era-preview-CocuDUm9.gif",
  "https://motionsites.ai/assets/hero-wealth-preview-B70idl_u.gif",
  "https://motionsites.ai/assets/hero-luminex-preview-CxOP7ce6.gif",
  "https://motionsites.ai/assets/hero-celestia-preview-0yO3jXO8.gif",
];

const rows = document.querySelectorAll(".marquee-row");

rows.forEach((row, rowIndex) => {
  const set = rowIndex === 0 ? marqueeImages.slice(0, 11) : marqueeImages.slice(11);
  const tripled = [...set, ...set, ...set];

  tripled.forEach((src) => {
    const img = document.createElement("img");
    img.src = src;
    img.alt = "Project preview";
    img.loading = "lazy";
    row.append(img);
  });
});

const fadeObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        fadeObserver.unobserve(entry.target);
      }
    });
  },
  { rootMargin: "50px", threshold: 0 },
);

document.querySelectorAll(".fade-in").forEach((el, index) => {
  el.style.transitionDelay = `${Math.min(index * 70, 500)}ms`;
  fadeObserver.observe(el);
});

document.querySelectorAll(".magnet").forEach((element) => {
  const strength = Number(element.dataset.strength || 3);
  const padding = Number(element.dataset.padding || 150);

  function reset() {
    element.style.transition = "transform 0.6s ease-in-out";
    element.style.transform = window.innerWidth <= 760 ? "translate(-50%, -50%)" : "translateX(-50%)";
  }

  element.addEventListener("mousemove", (event) => {
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const x = event.clientX - centerX;
    const y = event.clientY - centerY;
    const inside =
      event.clientX >= rect.left - padding &&
      event.clientX <= rect.right + padding &&
      event.clientY >= rect.top - padding &&
      event.clientY <= rect.bottom + padding;

    if (!inside) return reset();

    element.style.transition = "transform 0.3s ease-out";
    const base = window.innerWidth <= 760 ? "translate(-50%, -50%)" : "translateX(-50%)";
    element.style.transform = `${base} translate3d(${x / strength}px, ${y / strength}px, 0)`;
  });

  element.addEventListener("mouseleave", reset);
});

const animatedText = document.querySelector(".animated-text");
if (animatedText) {
  const chars = [...animatedText.textContent];
  animatedText.textContent = "";
  chars.forEach((char) => {
    const span = document.createElement("span");
    span.textContent = char;
    animatedText.append(span);
  });
}

function updateScrollEffects() {
  const scrollY = window.scrollY;
  const viewport = window.innerHeight;

  rows.forEach((row) => {
    const section = row.closest(".marquee-section");
    const rect = section.getBoundingClientRect();
    const sectionTop = scrollY + rect.top;
    const offset = (scrollY - sectionTop + viewport) * 0.3;
    const value = row.dataset.direction === "right" ? offset - 200 : -(offset - 200);
    row.style.transform = `translateX(${value}px)`;
  });

  if (animatedText) {
    const rect = animatedText.getBoundingClientRect();
    const start = viewport * 0.8;
    const end = viewport * 0.2;
    const progress = Math.min(1, Math.max(0, (start - rect.top) / (start - end + rect.height)));
    const letters = animatedText.querySelectorAll("span");

    letters.forEach((letter, index) => {
      const threshold = index / Math.max(letters.length - 1, 1);
      letter.style.opacity = progress >= threshold ? "1" : "0.22";
    });
  }

  document.querySelectorAll(".sticky-card").forEach((card, index, cards) => {
    const rect = card.getBoundingClientRect();
    const past = Math.min(1, Math.max(0, (96 - rect.top) / Math.max(rect.height, 1)));
    const targetScale = 1 - (cards.length - 1 - index) * 0.03;
    const scale = 1 - past * (1 - targetScale);
    card.style.transform = `scale(${scale})`;
  });
}

window.addEventListener("scroll", updateScrollEffects, { passive: true });
window.addEventListener("resize", updateScrollEffects);
updateScrollEffects();
