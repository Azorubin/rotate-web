(() => {
  const openYandexBtn = document.getElementById("openYandexBtn");
  const rotateBtn = document.getElementById("rotateBtn");
  const toggleAutoBtn = document.getElementById("toggleAutoBtn");
  const log = document.getElementById("log");

  let isPortrait = true;
  let autoEnabled = false;
  let autoTimer = null;

  function logMsg(msg) {
    const time = new Date().toLocaleTimeString();
    log.textContent = `${time} - ${msg}\n` + log.textContent;
  }

  async function toggleOrientation() {
    if (screen.orientation && screen.orientation.lock) {
      try {
        const target = screen.orientation.type.startsWith("portrait") ? "landscape" : "portrait";
        await screen.orientation.lock(target);
        isPortrait = !isPortrait;
        logMsg("Ориентация изменена на: " + target);
      } catch (e) {
        logMsg("Ошибка смены ориентации: " + e.message);
      }
    } else {
      // fallback: CSS rotate whole page visually
      isPortrait = !isPortrait;
      document.body.style.transition = "transform 0.5s ease";
      document.body.style.transform = isPortrait ? "rotate(0deg)" : "rotate(90deg)";
      logMsg("Визуальная ротация: " + (isPortrait ? "portrait" : "landscape"));
    }
  }

  function scheduleNext() {
    const delay = Math.floor(Math.random() * (50 - 30 + 1) + 30) * 1000;
    autoTimer = setTimeout(async () => {
      await toggleOrientation();
      if (autoEnabled) scheduleNext();
    }, delay);
    logMsg("Следующий автоповорот через " + delay/1000 + " секунд");
  }

  openYandexBtn.onclick = () => {
    window.open("https://yandex.ru/games", "_blank", "noopener");
    logMsg("Открыты Яндекс Игры в новой вкладке");
  };

  rotateBtn.onclick = toggleOrientation;

  toggleAutoBtn.onclick = () => {
    autoEnabled = !autoEnabled;
    toggleAutoBtn.textContent = "Авто-вращение: " + (autoEnabled ? "вкл" : "выкл");
    logMsg("Авто-вращение " + (autoEnabled ? "запущено" : "остановлено"));
    if (autoEnabled) scheduleNext();
    else clearTimeout(autoTimer);
  };

  // Регистрация service worker для PWA
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("service-worker.js")
      .then(() => logMsg("Service Worker зарегистрирован"))
      .catch(e => logMsg("Ошибка регистрации SW: " + e.message));
  }
})();
