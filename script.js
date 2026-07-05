const header = document.querySelector(".site-header");
const sections = document.querySelectorAll(".section, .hero");
const rainLayer = document.querySelector(".rain-layer");
const audioButton = document.querySelector(".audio-toggle");

let ambientAudio = null;
let isAudioPlaying = false;

/* header */

window.addEventListener("scroll", () => {
  if (window.scrollY > 40) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }
});

/* fade-in sections */

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

/* extra rain drops */

function createRainDrops() {
  if (!rainLayer) return;

  const amount = window.innerWidth < 700 ? 20 : 45;

  for (let i = 0; i < amount; i++) {
    const drop = document.createElement("span");

    drop.className = "rain-drop";
    drop.style.left = `${Math.random() * 100}%`;
    drop.style.animationDuration = `${0.65 + Math.random() * 0.9}s`;
    drop.style.animationDelay = `${Math.random() * 2}s`;
    drop.style.opacity = `${0.15 + Math.random() * 0.35}`;

    rainLayer.appendChild(drop);
  }
}

createRainDrops();

/* dust particles */

function createDustParticles() {
  const dustLayer = document.createElement("div");
  dustLayer.className = "dust-particles";
  document.body.appendChild(dustLayer);

  const amount = window.innerWidth < 700 ? 18 : 38;

  for (let i = 0; i < amount; i++) {
    const particle = document.createElement("span");

    particle.style.left = `${Math.random() * 100}%`;
    particle.style.top = `${Math.random() * 100}%`;
    particle.style.animationDuration = `${6 + Math.random() * 8}s`;
    particle.style.animationDelay = `${Math.random() * 8}s`;
    particle.style.opacity = `${0.15 + Math.random() * 0.45}`;

    dustLayer.appendChild(particle);
  }
}

createDustParticles();

/* title animation */

const title = document.querySelector(".hero h1");

if (title) {
  window.setTimeout(() => {
    title.classList.add("title-ready");
  }, 500);
}

/* ambient sound */

/* ambient sound */

const audioTracks = {
  morning: "assets/audio/rain-morning.mp3",
  afternoon: "assets/audio/rain-afternoon.mp3",
  night: "assets/audio/rain-night.mp3",
};

function getCurrentMood() {
  if (document.body.classList.contains("mood-night")) return "night";
  if (document.body.classList.contains("mood-afternoon")) return "afternoon";
  return "morning";
}

function createAmbientAudio() {
  const audio = new Audio(audioTracks[getCurrentMood()]);
  audio.loop = true;
  audio.volume = 0.45;

  return audio;
}

function setAudioButtonText() {
  if (!audioButton) return;

  const isPortuguese = document.documentElement.lang === "pt-BR";

  if (isAudioPlaying) {
    audioButton.textContent = isPortuguese ? "som ligado" : "sound on";
    audioButton.classList.add("is-playing");
    audioButton.setAttribute(
      "aria-label",
      isPortuguese
        ? "Desligar som ambiente"
        : "Turn off ambient sound"
    );
  } else {
    audioButton.textContent = isPortuguese
      ? "som da biblioteca"
      : "library sound";
    audioButton.classList.remove("is-playing");
    audioButton.setAttribute(
      "aria-label",
      isPortuguese
        ? "Ligar som ambiente"
        : "Turn on ambient sound"
    );
  }
}

function updateAmbientTrack() {
  if (!ambientAudio || !isAudioPlaying) return;

  const newSource = audioTracks[getCurrentMood()];

  if (ambientAudio.src.includes(newSource)) return;

  const currentTime = ambientAudio.currentTime;

  ambientAudio.pause();

  ambientAudio = new Audio(newSource);
  ambientAudio.loop = true;
  ambientAudio.volume = 0.45;
  ambientAudio.currentTime = currentTime;

  ambientAudio.play();
}

if (audioButton) {
  audioButton.addEventListener("click", async () => {
    if (!ambientAudio) {
      ambientAudio = createAmbientAudio();
    }

    isAudioPlaying = !isAudioPlaying;

    if (isAudioPlaying) {
      await ambientAudio.play();
    } else {
      ambientAudio.pause();
    }

    setAudioButtonText();
  });

  setAudioButtonText();
}

function setAudioButtonText() {
  if (!audioButton) return;

  const isPortuguese = document.documentElement.lang === "pt-BR";

  if (isAudioPlaying) {
    audioButton.textContent = isPortuguese
      ? "som ligado"
      : "sound on";
    audioButton.classList.add("is-playing");
    audioButton.setAttribute(
      "aria-label",
      isPortuguese ? "Desligar som ambiente" : "Turn off ambient sound"
    );
  } else {
    audioButton.textContent = isPortuguese
      ? "som da biblioteca"
      : "library sound";
    audioButton.classList.remove("is-playing");
    audioButton.setAttribute(
      "aria-label",
      isPortuguese ? "Ligar som ambiente" : "Turn on ambient sound"
    );
  }
}

if (audioButton) {
  audioButton.addEventListener("click", async () => {
    if (!ambientAudio) {
      ambientAudio = createAmbientAudio();
    }

    if (ambientAudio.context.state === "suspended") {
      await ambientAudio.context.resume();
    }

    isAudioPlaying = !isAudioPlaying;

    if (isAudioPlaying) {
      ambientAudio.rainGain.gain.value = 0.045;
      ambientAudio.fanGain.gain.value = 0.012;
    } else {
      ambientAudio.rainGain.gain.value = 0;
      ambientAudio.fanGain.gain.value = 0;
    }

    setAudioButtonText();
  });

  setAudioButtonText();
}

/* subtle page mood */

function updateMoodByScroll() {
  const scrollProgress =
    window.scrollY / (document.body.scrollHeight - window.innerHeight);

  document.body.classList.remove("mood-morning", "mood-afternoon", "mood-night");

  if (scrollProgress < 0.33) {
    document.body.classList.add("mood-morning");
  } else if (scrollProgress < 0.72) {
    document.body.classList.add("mood-afternoon");
  } else {
    document.body.classList.add("mood-night");
  }
}

window.addEventListener("scroll", updateMoodByScroll);
updateMoodByScroll();