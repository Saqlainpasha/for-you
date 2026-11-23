// ---------- Simple, reliable HTML5 audio player ----------

const audio    = document.getElementById('song');
const playBtn  = document.getElementById('playBtn');
const iconPlay = document.getElementById('iconPlay');
const iconPause = document.getElementById('iconPause');
const progressWrap = document.getElementById('progressWrap');
const progressBar  = document.getElementById('progressBar');
const currentTimeEl = document.getElementById('currentTime');
const durationEl    = document.getElementById('duration');

function formatTime(seconds) {
  if (!isFinite(seconds)) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return m + ':' + (s < 10 ? '0' : '') + s;
}

// Show total duration once the file's metadata is loaded
audio.addEventListener('loadedmetadata', function () {
  durationEl.textContent = formatTime(audio.duration);
});
// Fallback if metadata fails on some browsers
if (audio.readyState >= 1) {
  durationEl.textContent = formatTime(audio.duration);
}

// Update progress bar and elapsed time while playing
audio.addEventListener('timeupdate', function () {
  if (audio.duration) {
    progressBar.style.width = (audio.currentTime / audio.duration * 100) + '%';
  }
  currentTimeEl.textContent = formatTime(audio.currentTime);
});

// Swap play/pause icons
function showPlayIcon()  { iconPlay.style.display = 'block';  iconPause.style.display = 'none'; }
function showPauseIcon() { iconPlay.style.display = 'none';   iconPause.style.display = 'block'; }

playBtn.addEventListener('click', function () {
  if (audio.paused) {
    audio.play();
  } else {
    audio.pause();
  }
});

audio.addEventListener('play',  showPauseIcon);
audio.addEventListener('pause', showPlayIcon);
audio.addEventListener('ended', function () {
  showPlayIcon();
  progressBar.style.width = '0%';
  currentTimeEl.textContent = '0:00';
});

// Allow seeking by tapping / dragging on the progress bar
function seekFromEvent(e) {
  const rect = progressWrap.getBoundingClientRect();
  const clientX = (e.touches && e.touches.length) ? e.touches[0].clientX : e.clientX;
  let ratio = (clientX - rect.left) / rect.width;
  ratio = Math.max(0, Math.min(1, ratio)); // keep between 0 and 1
  if (audio.duration) {
    audio.currentTime = ratio * audio.duration;
  }
}

let seeking = false;

progressWrap.addEventListener('pointerdown', function (e) {
  seeking = true;
  seekFromEvent(e);
});
window.addEventListener('pointermove', function (e) {
  if (seeking) seekFromEvent(e);
});
window.addEventListener('pointerup', function () {
  seeking = false;
});
