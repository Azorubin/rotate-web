(function(){
  const rotateBtn = document.getElementById('rotateBtn');
  const toggleAutoBtn = document.getElementById('toggleAutoBtn');
  const log = document.getElementById('log');

  let isPortrait = true;
  let autoTimer = null;
  let autoEnabled = false;

  function logMsg(msg) {
    const time = new Date().toLocaleTimeString();
    log.textContent = `${time} — ${msg}`;
  }

  async function toggleOrientation() {
    // Try Screen Orientation API
    if (screen.orientation && screen.orientation.lock) {
      try {
        const target = screen.orientation.type.startsWith('portrait') ? 'landscape' : 'portrait';
        await screen.orientation.lock(target);
        logMsg('Ориентация установлена: ' + target);
      } catch (err) {
        logMsg('Не удалось сменить ориентацию: ' + err);
      }
    } else {
      // Fallback: rotate the whole body visually
      isPortrait = !isPortrait;
      document.body.style.transform = isPortrait ? 'rotate(0deg)' : 'rotate(90deg)';
      document.body.style.transformOrigin = 'center center';
      document.body.style.transition = 'transform 0.5s ease';
      logMsg('Визуальная ротация: ' + (isPortrait ? 'portrait' : 'landscape'));
    }
  }

  function scheduleNext() {
    const next = Math.floor(Math.random() * (50 - 30 + 1) + 30) * 1000;
    autoTimer = setTimeout(async () => {
      await toggleOrientation();
      if (autoEnabled) scheduleNext();
    }, next);
    logMsg('Следующая автопереключение через ' + (next/1000) + ' с');
  }

  rotateBtn.addEventListener('click', toggleOrientation);

  toggleAutoBtn.addEventListener('click', () => {
    autoEnabled = !autoEnabled;
    toggleAutoBtn.textContent = 'Авто-вращение: ' + (autoEnabled ? 'вкл' : 'выкл');
    if (autoEnabled) {
      scheduleNext();
    } else {
      clearTimeout(autoTimer);
      autoTimer = null;
      logMsg('Авто-вращение остановлено');
    }
  });

  // Register SW
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('service-worker.js').then(() => {
      logMsg('Service Worker зарегистрирован');
    }).catch(err => {
      logMsg('SW: ' + err);
    });
  }

  // Prompt install on supporting browsers
  let deferredPrompt;
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    // show a custom install prompt (could add UI)
    logMsg('PWA готова к установке (можно добавить на главный экран)');
  });

})();