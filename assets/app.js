import { projects } from './projects.js';

const dialog = document.querySelector('#player-dialog');
const player = document.querySelector('#project-player');
const filters = document.querySelectorAll('[data-filter]');
const portraitRail = document.querySelector('#portrait-grid');
const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
let returnFocus = null;

const durationLabel = seconds => `${Math.floor(seconds / 60).toString().padStart(2, '0')}:${Math.floor(seconds % 60).toString().padStart(2, '0')}`;

// Posters are the only media loaded in the gallery. A single video source is
// assigned after an explicit click and released when its dialog closes.
function openProject(id, trigger) {
  const project = projects.find(item => item.id === id);
  if (!project) return;
  returnFocus = trigger;
  document.querySelector('#player-title').textContent = project.title;
  document.querySelector('#player-meta').textContent = `${project.category} / ${project.label} / ${durationLabel(project.duration)}`;
  document.querySelector('#player-audio').textContent = project.hasAudio ? 'Sound on — use the player controls to mute.' : 'Silent motion study.';
  document.querySelector('#player-error').hidden = true;
  document.querySelector('#player-loading').hidden = false;
  document.querySelector('#player-fallback').href = project.source;
  player.classList.toggle('portrait', project.height > project.width);
  player.setAttribute('aria-label', `${project.title} video`);
  player.poster = project.poster;
  player.src = project.source;
  player.muted = false;
  player.loop = false;
  dialog.showModal();
  document.body.classList.add('modal-open');
  document.querySelector('.player-close').focus({ preventScroll: true });
  player.play().catch(() => { /* Native controls remain available if playback is blocked. */ });
}

function closePlayer() {
  if (dialog.open) dialog.close();
}

function releasePlayer() {
  player.pause();
  document.querySelector('#player-loading').hidden = true;
  player.removeAttribute('src');
  player.removeAttribute('poster');
  player.load();
  document.body.classList.remove('modal-open');
  returnFocus?.focus({ preventScroll: true });
  returnFocus = null;
}

document.addEventListener('click', event => {
  const trigger = event.target.closest('[data-project]');
  if (trigger) openProject(trigger.dataset.project, trigger);
});
document.querySelector('.player-close').addEventListener('click', closePlayer);
dialog.addEventListener('close', releasePlayer);
dialog.addEventListener('click', event => {
  if (event.target !== dialog) return;
  const bounds = dialog.getBoundingClientRect();
  if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) closePlayer();
});
player.addEventListener('canplay', () => { document.querySelector('#player-loading').hidden = true; });
player.addEventListener('error', () => {
  if (dialog.open && player.hasAttribute('src')) {
    document.querySelector('#player-loading').hidden = true;
    document.querySelector('#player-error').hidden = false;
  }
});
document.addEventListener('visibilitychange', () => { if (document.hidden) player.pause(); });

function filterProjects(category) {
  filters.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.filter === category)));
  const visible = projects.filter(project => category === 'All' || project.category === category);
  document.querySelectorAll('.project').forEach(card => { card.hidden = category !== 'All' && card.dataset.category !== category; });
  ['cinema', 'portrait', 'motion'].forEach(group => {
    document.querySelector(`#${group}-group`).hidden = !visible.some(project => project.group === group);
  });
  portraitRail.scrollTo({ left: 0, behavior: 'instant' });
  document.querySelector('#filter-status').textContent = `${visible.length} ${visible.length === 1 ? 'piece' : 'pieces'} / ${category === 'All' ? 'All work' : category}`;
  updateRailControls();
}
filters.forEach(button => button.addEventListener('click', () => filterProjects(button.dataset.filter)));

function updateRailControls() {
  const maxScroll = portraitRail.scrollWidth - portraitRail.clientWidth;
  document.querySelector('[data-rail="previous"]').disabled = portraitRail.scrollLeft <= 2;
  document.querySelector('[data-rail="next"]').disabled = portraitRail.scrollLeft >= maxScroll - 2;
}
document.querySelectorAll('[data-rail]').forEach(button => button.addEventListener('click', () => {
  const direction = button.dataset.rail === 'next' ? 1 : -1;
  portraitRail.scrollBy({ left: direction * portraitRail.clientWidth * .8, behavior: motionPreference.matches ? 'instant' : 'smooth' });
}));
portraitRail.addEventListener('scroll', updateRailControls, { passive: true });
new ResizeObserver(updateRailControls).observe(portraitRail);
updateRailControls();

// Highlight navigation using actual section visibility, without shifting focus.
const navigation = document.querySelectorAll('.navigation a');
const sectionObserver = new IntersectionObserver(entries => {
  for (const entry of entries) {
    if (!entry.isIntersecting) continue;
    navigation.forEach(link => {
      if (link.hash === `#${entry.target.id}`) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }
}, { rootMargin: '-10% 0px -65% 0px', threshold: 0 });
['work', 'about', 'contact'].forEach(id => sectionObserver.observe(document.querySelector(`#${id}`)));
document.querySelector('#year').textContent = new Date().getFullYear();
