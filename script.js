(function(){
  const frame = document.getElementById('browserFrame');
  const backBtn = document.getElementById('backBtn');
  const reloadBtn = document.getElementById('reloadBtn');

  let isPortrait = true;
  let timerId = null;

  function scheduleNext() {
    const next = Math.floor(Math.random() * (50 - 30 + 1) + 30) * 1000;
    timerId = setTimeout(rotateScreen, next);
    console.log('Next rotation in', next/1000, 's');
  }

  function rotateScreen(){
    isPortrait = !isPortrait;
    // rotate iframe visually
    frame.style.transform = isPortrait ? 'rotate(0deg)' : 'rotate(90deg)';

    // when rotated 90deg, we also fit it by swapping width/height visually using scale for small screens
    if (!isPortrait) {
      frame.style.width = '100vh';
      frame.style.height = '100vw';
    } else {
      frame.style.width = '100%';
      frame.style.height = '100%';
    }

    // schedule next
    scheduleNext();
  }

  // start first rotation after a random delay
  scheduleNext();

  // Back button: try to navigate iframe history, fallback to window.history
  backBtn.addEventListener('click', () => {
    try {
      const fw = frame.contentWindow;
      if (fw && fw.history && fw.history.length > 1) {
        fw.history.back();
      } else {
        if (window.history.length > 1) window.history.back();
      }
    } catch (e) {
      // cross-origin iframe -> cannot access history
      // fallback: reload frame to its src or navigate parent
      frame.src = frame.src;
    }
  });

  // reload button
  reloadBtn.addEventListener('click', () => {
    try {
      frame.contentWindow.location.reload();
    } catch(e) {
      frame.src = frame.src;
    }
  });

  // Pause rotation while user interacts (touchstart), resume after short idle
  let idleTimeout = null;
  function onUserActivity(){
    if (timerId) { clearTimeout(timerId); timerId = null; }
    if (idleTimeout) clearTimeout(idleTimeout);
    idleTimeout = setTimeout(()=>{ scheduleNext(); }, 10000);
  }
  window.addEventListener('touchstart', onUserActivity, {passive:true});
  window.addEventListener('mousemove', onUserActivity);

  // accessibility: allow keyboard B key to go back
  window.addEventListener('keydown', (e)=> {
    if (e.key === 'b' || e.key === 'B') {
      backBtn.click();
    }
  });

})();