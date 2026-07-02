
const header = document.querySelector(".site-header");
const sections = document.querySelectorAll(".section, .hero");
const rainLayer = document.querySelector(".rain-layer");
const audioButton = document.querySelector(".audio-toggle");

let ambientAudio = null;
let isAudioPlaying = false;

window.addEventListener("scroll", () => {
  if (window.scrollY > 40) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  },
  {
    threshold: 0.15,
  }
);

sections.forEach((section) => {
  section.classList.add("fade-in");
  observer.observe(section);
});

function createDustParticles() {
  const particleContainer = document.createElement("div");
  particleContainer.classList.add("dust-particles");
  document.body.appendChild(particleContainer);

  for (let i = 0; i < 48; i++) {
    const particle = document.createElement("span");

    particle.style.left = `${Math.random() * 100}%`;
    particle.style.top = `${Math.random() * 100}%`;
    particle.style.animationDelay = `${Math.random() * 12}s`;
    particle.style.animationDuration = `${9 + Math.random() * 12}s`;
    particle.style.opacity = `${0.25 + Math.random() * 0.65}`;

    particleContainer.appendChild(particle);
  }
}

function createRainLines() {
  if (!rainLayer) return;

  for (let i = 0; i < 65; i++) {
    const drop = document.createElement("span");

    drop.classList.add("rain-drop");
    drop.style.left = `${Math.random() * 100}%`;
    drop.style.animationDelay = `${Math.random() * 2.5}s`;
    drop.style.animationDuration = `${0.55 + Math.random() * 0.75}s`;
    drop.style.opacity = `${0.12 + Math.random() * 0.35}`;

    rainLayer.appendChild(drop);
  }
}

function getCurrentMood() {
  const hour = new Date().getHours();

  if (hour >= 5 && hour < 12) {
    return "morning";
  }

  if (hour >= 12 && hour < 18) {
    return "afternoon";
  }

  return "night";
}

function setTimeMood() {
  const mood = getCurrentMood();

  document.body.classList.remove("mood-morning", "mood-afternoon", "mood-night");
  document.body.classList.add(`mood-${mood}`);
}

function getAmbientAudioPath() {
  const mood = getCurrentMood();

  const audioMap = {
    morning: "assets/audio/rain-morning.mp3",
    afternoon: "assets/audio/rain-afternoon.mp3",
    night: "assets/audio/rain-night.mp3",
  };

  return audioMap[mood];
}

function setupAmbientAudio() {
  if (!audioButton) return;

  audioButton.addEventListener("click", async () => {
    if (!ambientAudio) {
      ambientAudio = new Audio(getAmbientAudioPath());
      ambientAudio.loop = true;
      ambientAudio.volume = 0.45;

      ambientAudio.addEventListener("error", () => {
        isAudioPlaying = false;
        audioButton.classList.remove("is-playing");
        audioButton.textContent = "☔ Áudio ainda não adicionado";
        console.warn(
          "Arquivo de áudio não encontrado. Crie a pasta assets/audio e adicione os arquivos rain-morning.mp3, rain-afternoon.mp3 e rain-night.mp3."
        );
      });
    }

    try {
      if (isAudioPlaying) {
        ambientAudio.pause();
        isAudioPlaying = false;
        audioButton.classList.remove("is-playing");
        audioButton.textContent = "☔ Som da biblioteca";
      } else {
        await ambientAudio.play();
        isAudioPlaying = true;
        audioButton.classList.add("is-playing");
        audioButton.textContent = "☔ Som ligado";
      }
    } catch (error) {
      audioButton.textContent = "☔ Clique novamente";
      console.warn("O navegador bloqueou o áudio até haver interação do usuário.", error);
    }
  });
}

function addCardInteractions() {
  const cards = document.querySelectorAll(
    ".collection-card, .location-card, .feature-item, .inspiration-card, .timeline-item"
  );

  cards.forEach((card) => {
    card.addEventListener("mouseenter", () => {
      card.classList.add("is-hovered");
    });

    card.addEventListener("mouseleave", () => {
      card.classList.remove("is-hovered");
    });
  });
}

function typeHeroTitle() {
  const title = document.querySelector(".hero h1");
  if (!title) return;

  const originalText = title.textContent.trim();
  title.textContent = "";

  let index = 0;

  const interval = setInterval(() => {
    title.textContent += originalText[index];
    index++;

    if (index >= originalText.length) {
      clearInterval(interval);
      title.classList.add("title-ready");
    }
  }, 120);
}

createDustParticles();
createRainLines();
setTimeMood();
setupAmbientAudio();
addCardInteractions();
typeHeroTitle();
