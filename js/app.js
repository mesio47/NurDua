// NurDua: Filter, Favoriten, Lernfortschritt, Audio-Wiedergabe, Copy, Share, Statistik, Export, PWA

const FAVORITES_KEY = "nurdua:favorites";
const LEARNED_KEY = "nurdua:learned";
const STATS_KEY = "nurdua:stats";
const RECITER = "Alafasy_128kbps";

/**
 * STATISTICS TRACKING MODEL (Persistent)
 * ========================================
 * localStorage structure:
 * {
 *   "nurdua:stats": {
 *     "2026-01-15": { listened: 5, learned: 2 },
 *     "2026-01-16": { listened: 3, learned: 1 },
 *     ...
 *   },
 *   "nurdua:favorites": ["q1-5", "q2-127-128", ...],
 *   "nurdua:learned": ["q1-5", "q2-127-128", ...]  // Persistent "Auswendig gelernt" list
 * }
 *
 * Labels shown to user:
 * - "Bereits gehört" = Total from ALL daily stats (sum of all "listened" values)
 * - "Auswendig gelernt" = Count of IDs in LEARNED_KEY list (persistent, not daily)
 *
 * When user clicks heart: Toggles favorite (instant)
 * When user clicks checkmark:
 *   - If NOW learned: incrementStat("learned") + add to LEARNED_KEY
 *   - If UNLEARNING: decrementStat("learned") + remove from LEARNED_KEY
 */

// Statistik-Tracking
function getStats() {
  try {
    return JSON.parse(localStorage.getItem(STATS_KEY) || "{}");
  } catch {
    return {};
  }
}

function incrementStat(key) {
  const stats = getStats();
  const today = new Date().toISOString().split("T")[0];
  stats[today] = stats[today] || { listened: 0, learned: 0 };
  if (key === "listened") stats[today].listened++;
  if (key === "learned") stats[today].learned++;

  try {
    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
  } catch (e) {
    if (e.name === "QuotaExceededError") {
      console.warn("localStorage quota exceeded – stats not saved");
      showToast("⚠️ Speicher voll – Statistiken werden nicht gespeichert");
    }
  }
}

function decrementStat(key) {
  const stats = getStats();
  const today = new Date().toISOString().split("T")[0];
  stats[today] = stats[today] || { listened: 0, learned: 0 };
  if (key === "listened" && stats[today].listened > 0) stats[today].listened--;
  if (key === "learned" && stats[today].learned > 0) stats[today].learned--;

  try {
    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
  } catch (e) {
    if (e.name === "QuotaExceededError") {
      console.warn("localStorage quota exceeded – stats not saved");
      showToast("⚠️ Speicher voll – Änderungen können nicht gespeichert werden");
    }
  }
}

function getTodayStats() {
  const stats = getStats();
  const today = new Date().toISOString().split("T")[0];
  return stats[today] || { listened: 0, learned: 0 };
}

// Toast Notifications
function showToast(message, duration = 2000) {
  const existingToast = document.getElementById("toast-notification");
  if (existingToast) {
    existingToast.remove();
  }

  const toast = document.createElement("div");
  toast.id = "toast-notification";
  toast.textContent = message;
  toast.style.cssText = `
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: linear-gradient(135deg, #204838 0%, #336b54 100%);
    color: #fff;
    padding: 16px 24px;
    border-radius: 999px;
    font-size: 0.95rem;
    font-weight: 500;
    box-shadow: 0 8px 24px rgba(32, 72, 56, 0.3);
    animation: slideUpToast 0.3s ease-out;
    z-index: 9999;
  `;

  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = "slideDownToast 0.3s ease-out";
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

// Persistent toast (for long operations like PDF export)
function showPersistentToast(message) {
  const existingToast = document.getElementById("toast-persistent");
  if (existingToast) {
    existingToast.remove();
  }

  const toast = document.createElement("div");
  toast.id = "toast-persistent";
  toast.textContent = message;
  toast.style.cssText = `
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: linear-gradient(135deg, #204838 0%, #336b54 100%);
    color: #fff;
    padding: 16px 24px;
    border-radius: 999px;
    font-size: 0.95rem;
    font-weight: 500;
    box-shadow: 0 8px 24px rgba(32, 72, 56, 0.3);
    animation: slideUpToast 0.3s ease-out;
    z-index: 9999;
  `;

  document.body.appendChild(toast);
  return toast;
}

// Remove persistent toast with animation
function removePersistentToast(toast) {
  if (toast) {
    toast.style.animation = "slideDownToast 0.3s ease-out";
    setTimeout(() => toast.remove(), 300);
  }
}

function getStoredIds(key) {
  try {
    return JSON.parse(localStorage.getItem(key) || "[]");
  } catch {
    return [];
  }
}

function toggleStoredId(key, id) {
  const ids = getStoredIds(key);

  // SECURITY FIX: Max 1000 Einträge pro Key (DoS-Prävention)
  if (ids.length >= 1000) {
    showToast("❌ Zu viele Einträge – bitte einige löschen");
    return ids;
  }

  const idx = ids.indexOf(id);
  if (idx === -1) {
    ids.push(id);
  } else {
    ids.splice(idx, 1);
  }

  try {
    const json = JSON.stringify(ids);
    // SECURITY FIX: Max 50KB pro Key
    if (json.length > 50000) {
      showToast("❌ Zu viele Daten – bitte einige löschen");
      return getStoredIds(key); // Revert change
    }
    localStorage.setItem(key, json);
  } catch (e) {
    if (e.name === "QuotaExceededError") {
      console.warn("localStorage quota exceeded – changes not saved");
      showToast("⚠️ Speicher voll – Änderungen können nicht gespeichert werden");
      return getStoredIds(key); // Revert to saved state
    }
  }

  return ids;
}

function getFavorites() {
  return getStoredIds(FAVORITES_KEY);
}

function toggleFavorite(id) {
  return toggleStoredId(FAVORITES_KEY, id);
}

function getLearned() {
  return getStoredIds(LEARNED_KEY);
}

function toggleLearned(id) {
  return toggleStoredId(LEARNED_KEY, id);
}

function pad3(n) {
  return String(n).padStart(3, "0");
}

function audioUrlFor(sura, ayah) {
  return `https://everyayah.com/data/${RECITER}/${pad3(sura)}${pad3(ayah)}.mp3`;
}

function sourceLabel(dua) {
  const range = dua.ayahs.length > 1
    ? `${dua.ayahs[0]}–${dua.ayahs[dua.ayahs.length - 1]}`
    : `${dua.ayahs[0]}`;
  return `Koran ${dua.sura}:${range}`;
}

const EMPTY_STATE_MESSAGES = {
  favoriten: "Hier ist noch nichts – tippe auf das Herz bei einer Dua, um sie zu deinen Favoriten hinzuzufügen.",
  gelernt: "Hier ist noch nichts – tippe auf das Häkchen bei einer Dua, um sie als auswendig gelernt zu markieren.",
  default: "Hier ist noch nichts."
};

function currentCategory() {
  const hash = window.location.hash.replace("#", "");
  return CATEGORIES.some((c) => c.id === hash) ? hash : "alle";
}

function getFilteredDuas() {
  const category = currentCategory();
  if (category === "alle") return DUAS;
  if (category === "favoriten") {
    const favorites = getFavorites();
    return DUAS.filter((d) => favorites.includes(d.id));
  }
  if (category === "gelernt") {
    const learned = getLearned();
    return DUAS.filter((d) => learned.includes(d.id));
  }
  return DUAS.filter((d) => d.category === category);
}

function renderFilterBar() {
  const bar = document.getElementById("filter-bar");
  const active = currentCategory();
  bar.innerHTML = CATEGORIES.map((c) => {
    const label = c.suffix ? `${c.label} ${c.suffix}` : c.label;
    return `<a class="filter-pill${c.id === active ? " is-active" : ""}" href="#${c.id}" data-cat="${c.id}">${label}</a>`;
  }).join("");
}

function renderStatistics() {
  const today = getTodayStats();
  const duasEl = document.getElementById("total-duas");
  const listenedEl = document.getElementById("today-listened");
  const learnedEl = document.getElementById("today-learned");
  const listenedLabelEl = document.getElementById("today-listened-label");
  const learnedLabelEl = document.getElementById("today-learned-label");

  if (duasEl) duasEl.textContent = DUAS.length;
  if (listenedEl) listenedEl.textContent = today.listened || 0;
  if (learnedEl) learnedEl.textContent = today.learned || 0;
  if (listenedLabelEl) listenedLabelEl.textContent = "Bereits gehört";
  if (learnedLabelEl) learnedLabelEl.textContent = "Auswendig gelernt";
}

function renderDuas() {
  const favorites = getFavorites();
  const learned = getLearned();
  const items = getFilteredDuas();
  const list = document.getElementById("dua-list");
  const emptyState = document.getElementById("empty-state");
  const count = document.getElementById("dua-count");

  count.textContent = `${items.length} ${items.length === 1 ? "Bittgebet" : "Bittgebete"}`;

  if (items.length === 0) {
    list.innerHTML = "";
    emptyState.textContent = EMPTY_STATE_MESSAGES[currentCategory()] || EMPTY_STATE_MESSAGES.default;
    emptyState.hidden = false;
    return;
  }
  emptyState.hidden = true;

  list.innerHTML = items.map((dua) => {
    const isFav = favorites.includes(dua.id);
    const isLearned = learned.includes(dua.id);
    return `
      <article class="dua-card" data-dua-id="${dua.id}">
        <p class="dua-arabic">${dua.arabic}</p>
        <p class="dua-translit">${dua.translit}</p>
        <p class="dua-translation">${dua.translation}</p>
        <p class="dua-source">${sourceLabel(dua)}${dua.note ? ` · ${dua.note}` : ""}${dua.truncated ? " (Auszug)" : ""}</p>
        <div class="dua-actions">
          <button class="icon-btn play-btn" type="button" data-action="play" aria-label="Rezitation abspielen">${PLAY_ICON}</button>
          <button class="icon-btn loop-btn" type="button" data-action="loop" aria-label="In Dauerschleife (unendlich) abspielen" title="In Dauerschleife (unendlich) abspielen">${LOOP_ICON}</button>
          <button class="icon-btn copy-btn" type="button" data-action="copy" aria-label="Text kopieren" title="Dua-Text kopieren">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="M15 2H9a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1z"/></svg>
            <span>Kopieren</span>
          </button>
          <button class="icon-btn share-btn" type="button" data-action="share" aria-label="Teilen" title="Dua teilen">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>
            <span>Teilen</span>
          </button>
          <div class="dua-actions-right">
            <button class="icon-btn learned-btn${isLearned ? " is-active" : ""}" type="button" data-action="learned"
                    aria-label="${isLearned ? "Bereits auswendig gelernt" : "Als auswendig gelernt markieren"}"
                    title="${isLearned ? "Bereits auswendig gelernt" : "Als auswendig gelernt markieren"}">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="9"/><path d="M8.5 12.5l2.5 2.5 5-5"/></svg>
            </button>
            <button class="icon-btn heart-btn${isFav ? " is-active" : ""}" type="button" data-action="favorite"
                    aria-label="${isFav ? "Gespeichert – aus meinen Duas entfernen" : "In meinen Duas speichern"}"
                    title="${isFav ? "Gespeichert – aus meinen Duas entfernen" : "In meinen Duas speichern"}">
              <svg viewBox="0 0 24 24" fill="${isFav ? "currentColor" : "none"}" stroke="currentColor" stroke-width="1.8"><path d="M12 21s-7.5-4.6-10-9.3C.5 8.1 2.3 4.5 6 4c2.1-.3 3.9.8 6 3 2.1-2.2 3.9-3.3 6-3 3.7.5 5.5 4.1 4 7.7-2.5 4.7-10 9.3-10 9.3Z"/></svg>
            </button>
          </div>
        </div>
      </article>`;
  }).join("");

  syncButtonsUI();
  updateExportButton();
  updatePlayAllButton();
}

// SECURITY: PDF export lock (prevent DoS via parallel exports)
let pdfExportInProgress = false;

const PLAY_ICON = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg><span>Anhören</span>`;
const STOP_ICON = `<svg viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="6" width="12" height="12" rx="1.5"/></svg><span>Stoppen</span>`;
const LOOP_ICON = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 2 21 6 17 10"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><path d="M7 22 3 18 7 14"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg><span>Dauerschleife</span>`;
const LOOP_STOP_ICON = `<svg viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="6" width="12" height="12" rx="1.5"/></svg><span>Stoppen</span>`;
const PLAY_ALL_ICON = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg><span>Alle Bittgebete anhören</span>`;
const PLAY_ALL_STOP_ICON = `<svg viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="6" width="12" height="12" rx="1.5"/></svg><span>Wiedergabe stoppen</span>`;

let currentPlayback = null; // { mode: "single" | "loop" | "queue", duaId, audio, queue?, queueIndex? }

function setBtnVisual(btn, isPlaying, playHtml, stopHtml) {
  btn.classList.toggle("is-playing", isPlaying);
  btn.innerHTML = isPlaying ? stopHtml : playHtml;
}

function findPlayButton(duaId) {
  return document.querySelector(`.dua-card[data-dua-id="${duaId}"] .play-btn`);
}

function findLoopButton(duaId) {
  return document.querySelector(`.dua-card[data-dua-id="${duaId}"] .loop-btn`);
}

function syncButtonsUI() {
  if (!currentPlayback) return;
  if (currentPlayback.mode === "loop") {
    const btn = findLoopButton(currentPlayback.duaId);
    if (btn) setBtnVisual(btn, true, LOOP_ICON, LOOP_STOP_ICON);
  } else {
    const btn = findPlayButton(currentPlayback.duaId);
    if (btn) setBtnVisual(btn, true, PLAY_ICON, STOP_ICON);
  }
}

function stopPlayback() {
  if (!currentPlayback) return;
  const { mode, duaId, audio, timeUpdateListener, endedListener } = currentPlayback;

  // Clean up all event listeners to prevent memory leaks
  if (endedListener) audio.removeEventListener("ended", endedListener);
  if (timeUpdateListener) audio.removeEventListener("timeupdate", timeUpdateListener);

  audio.pause();
  audio.src = "";

  if (mode === "loop") {
    const btn = findLoopButton(duaId);
    if (btn) setBtnVisual(btn, false, LOOP_ICON, LOOP_STOP_ICON);
  } else {
    const btn = findPlayButton(duaId);
    if (btn) setBtnVisual(btn, false, PLAY_ICON, STOP_ICON);
  }

  const playAllBtn = document.getElementById("play-all-btn");
  if (playAllBtn) setBtnVisual(playAllBtn, false, PLAY_ALL_ICON, PLAY_ALL_STOP_ICON);

  currentPlayback = null;
}

// Plays a single dua's ayah sequence (respecting audioStart/audioEnd) on the given
// audio element. Calls onDone() when finished. If loop=true, restarts from the top
// indefinitely instead (used for the endless "Dauerschleife" mode).
function playDuaOn(audio, dua, { loop = false, onDone } = {}) {
  const urls = dua.ayahs.map((a) => audioUrlFor(dua.sura, a));
  preloadNextAudio(dua.id); // Lazy-preload next audio for smooth playback
  let i = 0;
  const isCurrent = () => currentPlayback && currentPlayback.audio === audio;

  // BUG FIX: Remove ALL old event listeners to prevent race conditions with multi-ayah duas
  audio.pause();
  audio.currentTime = 0;
  audio.removeEventListener("ended", audio._playNextListener);
  audio._playNextListener = null;

  const playNext = () => {
    if (!isCurrent()) return;
    if (i >= urls.length) {
      if (loop) {
        i = 0;
        playNext();
      } else if (onDone) {
        onDone();
      } else {
        stopPlayback();
      }
      return;
    }
    const isFirst = i === 0;
    const isLast = i === urls.length - 1;
    audio.src = urls[i];
    i += 1;

    const onTimeUpdate = () => {
      if (dua.audioEnd && audio.currentTime >= dua.audioEnd) {
        audio.removeEventListener("timeupdate", onTimeUpdate);
        playNext();
      }
    };

    const start = () => {
      if (!isCurrent()) return;
      if (isFirst && dua.audioStart) {
        audio.currentTime = dua.audioStart;
      }
      if (isLast && dua.audioEnd) {
        // Store timeUpdateListener for cleanup
        if (currentPlayback) currentPlayback.timeUpdateListener = onTimeUpdate;
        audio.addEventListener("timeupdate", onTimeUpdate);
      }
      audio.play().catch(() => {
        if (isCurrent()) stopPlayback();
      });
    };

    if (isFirst && dua.audioStart) {
      audio.addEventListener("loadedmetadata", start, { once: true });
      audio.load();
    } else {
      start();
    }
  };

  // Store listeners in currentPlayback for cleanup in stopPlayback()
  if (currentPlayback) {
    currentPlayback.endedListener = playNext;
  }

  // Register "ended" event listener ONLY ONCE per audio element
  // Multiple listeners would cause race conditions with multi-ayah duas (e.g., q14-40-41)
  if (!audio._playNextListener) {
    audio._playNextListener = playNext;
    audio.addEventListener("ended", playNext);
  }

  playNext();
}

function startSinglePlayback(dua, btn) {
  const audio = new Audio();
  currentPlayback = { mode: "single", duaId: dua.id, audio };
  setBtnVisual(btn, true, PLAY_ICON, STOP_ICON);
  playDuaOn(audio, dua);
}

function startLoopPlayback(dua, btn) {
  const audio = new Audio();
  currentPlayback = { mode: "loop", duaId: dua.id, audio };
  setBtnVisual(btn, true, LOOP_ICON, LOOP_STOP_ICON);
  playDuaOn(audio, dua, { loop: true });
}

function startQueuePlayback(duas, playAllBtn) {
  if (duas.length === 0) return;
  const audio = new Audio();
  currentPlayback = { mode: "queue", duaId: duas[0].id, audio, queue: duas, queueIndex: 0 };
  setBtnVisual(playAllBtn, true, PLAY_ALL_ICON, PLAY_ALL_STOP_ICON);

  const playAt = (idx) => {
    if (!currentPlayback || currentPlayback.audio !== audio) return;
    if (idx >= duas.length) {
      stopPlayback();
      return;
    }
    const prevBtn = findPlayButton(currentPlayback.duaId);
    if (prevBtn) setBtnVisual(prevBtn, false, PLAY_ICON, STOP_ICON);

    currentPlayback.duaId = duas[idx].id;
    currentPlayback.queueIndex = idx;
    const nowBtn = findPlayButton(duas[idx].id);
    if (nowBtn) setBtnVisual(nowBtn, true, PLAY_ICON, STOP_ICON);
    nowBtn?.scrollIntoView({ behavior: "smooth", block: "center" });

    playDuaOn(audio, duas[idx], { onDone: () => playAt(idx + 1) });
  };

  playAt(0);
}

function copyDuaToClipboard(dua) {
  const text = `${dua.translation}\n\n${dua.translit}\n\nQuelle: ${sourceLabel(dua)}\n\n✨ Von NurDua – www.nurdua.de`;
  navigator.clipboard.writeText(text).then(() => {
    showToast("✓ Dua kopiert!");
  }).catch(() => {
    showToast("❌ Kopieren nicht möglich");
  });
}

function shareDua(dua) {
  const text = `📖 "${dua.translation}"\n\n${dua.translit}\n\nQuelle: ${sourceLabel(dua)}\n\n✨ Von NurDua – Bittgebete aus dem Koran`;
  const url = "https://www.nurdua.de";

  if (navigator.share) {
    navigator.share({
      title: "NurDua – Dua teilen",
      text: text,
      url: url
    }).catch((err) => console.log("Share error:", err));
  } else {
    // Fallback: WhatsApp, Email, etc.
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text + "\n" + url)}`;
    const emailUrl = `mailto:?subject=Eine Dua von NurDua&body=${encodeURIComponent(text + "\n\n" + url)}`;

    // Backdrop
    const backdrop = document.createElement("div");
    backdrop.style.cssText = `
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      z-index: 9998;
      animation: fadeIn 0.2s ease-out;
    `;

    // Dialog with A11y attributes
    const dialog = document.createElement("div");
    dialog.setAttribute("role", "dialog");
    dialog.setAttribute("aria-modal", "true");
    dialog.setAttribute("aria-labelledby", "share-dialog-title");
    dialog.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: white;
      padding: 20px;
      border-radius: 12px;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
      z-index: 9999;
      width: min(90vw, 320px);
      max-height: 90vh;
      overflow-y: auto;
      animation: slideUpDialog 0.3s ease-out;
    `;
    dialog.innerHTML = `
      <p id="share-dialog-title" style="margin: 0 0 16px; font-weight: 600; font-size: 16px;">Wie möchtest du teilen?</p>
      <a href="${whatsappUrl}" style="display: block; padding: 12px; margin: 10px 0; background: #25D366; color: white; text-decoration: none; border-radius: 6px; text-align: center; font-weight: 500;" aria-label="Auf WhatsApp teilen">📱 WhatsApp</a>
      <a href="${emailUrl}" style="display: block; padding: 12px; margin: 10px 0; background: #0078D4; color: white; text-decoration: none; border-radius: 6px; text-align: center; font-weight: 500;" aria-label="Per Email teilen">📧 Email</a>
      <button style="display: block; width: 100%; padding: 12px; margin: 10px 0; background: #e0e0e0; border: none; border-radius: 6px; cursor: pointer; font-weight: 500;" aria-label="Dialog schließen">Abbrechen</button>
    `;

    // Close handler with focus restoration
    const closeDialog = () => {
      backdrop.remove();
      dialog.remove();
      document.removeEventListener("keydown", handleKeydown);
      document.removeEventListener("keydown", handleTabTrap);
    };

    // ESC-key handler
    const handleKeydown = (e) => {
      if (e.key === "Escape") closeDialog();
    };

    // Focus trap (prevent Tab from leaving dialog)
    const handleTabTrap = (e) => {
      if (e.key !== "Tab") return;

      const focusables = dialog.querySelectorAll("a, button");
      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    // Button click handler
    const closeBtn = dialog.querySelector("button");
    closeBtn.addEventListener("click", closeDialog);

    // Backdrop click handler
    backdrop.addEventListener("click", closeDialog);

    // ESC-key listener
    document.addEventListener("keydown", handleKeydown);
    // Tab focus trap listener
    document.addEventListener("keydown", handleTabTrap);

    document.body.appendChild(backdrop);
    document.body.appendChild(dialog);

    // Auto-focus first link for accessibility
    const firstLink = dialog.querySelector("a");
    if (firstLink) setTimeout(() => firstLink.focus(), 100);
  }
}

// Schnell-Update für einzelne Buttons (ohne komplettes Rerender)
function updateButtonUI(btn, isActive, activeClass) {
  btn.classList.toggle(activeClass, isActive);
  if (activeClass === "is-active") {
    // Für Heart-Button: SVG fill updaten
    if (btn.classList.contains("heart-btn")) {
      const svg = btn.querySelector("svg");
      if (svg) svg.setAttribute("fill", isActive ? "currentColor" : "none");
    }
  }
}

function onListClick(e) {
  const card = e.target.closest(".dua-card");
  if (!card) return;
  const dua = DUAS.find((d) => d.id === card.dataset.duaId);
  if (!dua) return;

  if (e.target.closest('[data-action="favorite"]')) {
    const btn = e.target.closest(".heart-btn");
    toggleFavorite(dua.id);
    const isFav = getFavorites().includes(dua.id);
    updateButtonUI(btn, isFav, "is-active");
    // Wenn auf "Favoriten"-Seite: neu rendern um Dua zu entfernen
    if (currentCategory() === "favoriten") {
      renderDuas();
    }
    renderStatistics();
  } else if (e.target.closest('[data-action="learned"]')) {
    const btn = e.target.closest(".learned-btn");
    const isNowLearned = !getLearned().includes(dua.id);
    toggleLearned(dua.id);
    // Inkrementieren wenn selektiert, dekrementieren wenn deselektiert
    if (isNowLearned) {
      incrementStat("learned");
      showToast("✨ Mashallah, mach weiter so! ✨");
    } else {
      decrementStat("learned");
    }
    updateButtonUI(btn, isNowLearned, "is-active");
    // Wenn auf "Gelernt"-Seite: neu rendern um Dua zu entfernen (wie bei Favoriten)
    if (currentCategory() === "gelernt") {
      renderDuas();
    }
    renderStatistics();
  } else if (e.target.closest('[data-action="copy"]')) {
    copyDuaToClipboard(dua);
  } else if (e.target.closest('[data-action="share"]')) {
    shareDua(dua);
  } else if (e.target.closest('[data-action="play"]')) {
    const wasPlayingThis = currentPlayback && currentPlayback.mode !== "loop" && currentPlayback.duaId === dua.id;
    stopPlayback();
    if (!wasPlayingThis) {
      // Only increment stat when STARTING new playback, not when stopping
      incrementStat("listened");
      startSinglePlayback(dua, e.target.closest(".play-btn"));
    }
  } else if (e.target.closest('[data-action="loop"]')) {
    const wasLoopingThis = currentPlayback && currentPlayback.mode === "loop" && currentPlayback.duaId === dua.id;
    stopPlayback();
    if (!wasLoopingThis) {
      // Only increment stat when STARTING new playback, not when stopping
      incrementStat("listened");
      startLoopPlayback(dua, e.target.closest(".loop-btn"));
    }
  }
}

function onPlayAllClick() {
  const playAllBtn = document.getElementById("play-all-btn");
  const wasQueuePlaying = currentPlayback && currentPlayback.mode === "queue";
  stopPlayback();
  if (!wasQueuePlaying) {
    startQueuePlayback(getFilteredDuas(), playAllBtn);
  }
}

// Audio Preloading für schnelleres Abspielen
// Lazy-preload next audio to improve playback smoothness
function preloadNextAudio(duaId) {
  const currentIndex = DUAS.findIndex((d) => d.id === duaId);
  if (currentIndex === -1 || currentIndex >= DUAS.length - 1) return;

  const nextDua = DUAS[currentIndex + 1];
  const url = audioUrlFor(nextDua.sura, nextDua.ayahs[0]);

  // Create or reuse hidden audio element for preload
  let preloadElement = document.getElementById(`preload-${nextDua.id}`);
  if (!preloadElement) {
    preloadElement = document.createElement("audio");
    preloadElement.id = `preload-${nextDua.id}`;
    preloadElement.preload = "metadata";
    preloadElement.style.display = "none";
    preloadElement.src = url;
    document.body.appendChild(preloadElement);

    // Cleanup old preload elements (keep only last 3)
    // This prevents DOM bloat & memory accumulation on long sessions
    const allPreloads = document.querySelectorAll("audio[id^='preload-']");
    if (allPreloads.length > 3) {
      allPreloads[0].remove(); // Remove oldest preload element
    }
  }
}

// Check if PDF libraries are available
function checkPDFLibraries() {
  if (typeof html2canvas === "undefined") {
    showToast("❌ PDF-Funktion nicht verfügbar (Offline?)");
    return false;
  }
  if (typeof jspdf === "undefined" || !window.jspdf?.jsPDF) {
    showToast("❌ PDF-Funktion nicht verfügbar (Offline?)");
    return false;
  }
  return true;
}

// Export Funktion mit jsPDF
async function exportDuasAsPDF(duas, filename) {
  // SECURITY FIX: Prevent parallel PDF exports (DoS via CPU/Memory exhaustion)
  if (pdfExportInProgress) {
    showToast("⏳ PDF-Export läuft bereits – bitte warten...");
    return;
  }

  if (duas.length === 0) {
    showToast("❌ Keine Duas zum Exportieren vorhanden.");
    return;
  }

  if (!checkPDFLibraries()) return;

  pdfExportInProgress = true;

  // Show persistent toast + disable export button during generation
  const persistentToast = showPersistentToast("📄 PDF wird generiert...");
  const exportBtn = document.getElementById("export-btn");
  const wasDisabled = exportBtn?.disabled;
  if (exportBtn) exportBtn.disabled = true;

  // Erstelle HTML für PDF
  const container = document.createElement("div");
  container.style.cssText = "width: 800px; padding: 40px; font-family: Arial, sans-serif; background: white;";
  container.innerHTML = `
    <div style="text-align: center; padding: 15px 0; border-bottom: 2px solid #b0913f; margin-bottom: 30px;">
      <p style="color: #b0913f; font-size: 14px; font-weight: bold; margin: 0;">www.nurdua.de</p>
    </div>
    <h1 style="text-align: center; color: #204838; font-size: 28px; margin: 0 0 10px 0;">NurDua – Bittgebete aus dem Koran</h1>
    <p style="text-align: center; color: #999; font-size: 12px; margin-bottom: 30px;">Exportiert am ${new Date().toLocaleDateString("de-DE")}</p>
    ${duas.map((dua) => `
      <div style="margin: 25px 0; padding: 15px; border-left: 4px solid #b0913f;">
        <div style="font-size: 16px; direction: rtl; font-weight: bold; margin-bottom: 10px; font-family: 'Amiri', serif;">${dua.arabic}</div>
        <div style="font-style: italic; color: #8a7130; font-size: 12px; margin-bottom: 8px;">${dua.translit}</div>
        <div style="font-size: 13px; color: #333; margin-bottom: 8px;">${dua.translation}</div>
        <div style="font-size: 11px; color: #999;"><strong>Quelle:</strong> ${sourceLabel(dua)}</div>
      </div>
    `).join("")}
  `;

  document.body.appendChild(container);

  try {
    const canvas = await html2canvas(container, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: "#ffffff"
    });

    const imgData = canvas.toDataURL("image/png");
    const imgWidth = 210; // A4 width in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF({
      orientation: imgHeight > imgWidth ? "p" : "p",
      unit: "mm",
      format: "a4"
    });

    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= 297; // A4 height in mm

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= 297;
    }

    pdf.save(filename.replace(".html", ".pdf"));
    removePersistentToast(persistentToast);
    showToast("✨ PDF erfolgreich exportiert!");
  } catch (error) {
    console.error("PDF-Fehler:", error);
    removePersistentToast(persistentToast);
    showToast("❌ PDF-Generierung fehlgeschlagen");
  } finally {
    document.body.removeChild(container);
    // Re-enable export button
    if (exportBtn) exportBtn.disabled = wasDisabled;
    // SECURITY FIX: Release PDF export lock
    pdfExportInProgress = false;
  }
}

// Favoriten exportieren
function exportFavoritesAsPDF() {
  const favorites = getFavorites();
  const favDuas = DUAS.filter((d) => favorites.includes(d.id));

  if (favDuas.length === 0) {
    showToast("❌ Noch keine Favoriten. Tippe das Herz an!");
    return;
  }

  const filename = `nurdua-meine-duas-${new Date().toISOString().split("T")[0]}.pdf`;
  showToast(`📄 Exportiere ${favDuas.length} Favoriten...`);
  exportDuasAsPDF(favDuas, filename);
}

// Kategorie exportieren
function exportCategoryAsPDF() {
  const category = currentCategory();
  const categoryDuas = getFilteredDuas();
  const categoryLabel = CATEGORIES.find(c => c.id === category)?.label || "Duas";
  const filename = `nurdua-${category}-${new Date().toISOString().split("T")[0]}.pdf`;
  exportDuasAsPDF(categoryDuas, filename);
}

// Alle Duas exportieren
function exportAllAsPDF() {
  const filename = `nurdua-alle-duas-${new Date().toISOString().split("T")[0]}.pdf`;
  showToast(`📄 Exportiere ${DUAS.length} Duas...`);
  exportDuasAsPDF(DUAS, filename);
}

// Update Play-All Button Label Dynamically
function updatePlayAllButton() {
  const category = currentCategory();
  const playAllBtn = document.getElementById("play-all-btn");
  const playAllLabel = document.getElementById("play-all-btn-label");

  if (!playAllBtn || !playAllLabel) return;

  const categoryDuas = getFilteredDuas();
  const count = categoryDuas.length;

  // Different labels for different categories
  if (category === "favoriten") {
    playAllLabel.textContent = `Meine Duas abspielen (${count})`;
    playAllBtn.title = "Alle favorisierten Duas abspielen";
  } else if (category === "gelernt") {
    playAllLabel.textContent = `Gelernte Duas abspielen (${count})`;
    playAllBtn.title = "Alle auswendig gelernten Duas abspielen";
  } else if (category === "alle") {
    playAllLabel.textContent = `Alle ${count} Bittgebete abspielen`;
    playAllBtn.title = "Alle Bittgebete abspielen";
  } else {
    // Get category label from CATEGORIES array
    const categoryLabel = CATEGORIES.find(c => c.id === category)?.label || "Duas";
    playAllLabel.textContent = `Alle ${categoryLabel}-Duas abspielen (${count})`;
    playAllBtn.title = `Alle ${categoryLabel}-Duas abspielen`;
  }
}

// Export Button Label & Handler
function updateExportButton() {
  const category = currentCategory();
  const exportBtn = document.getElementById("export-btn");
  const exportLabel = document.getElementById("export-btn-label");

  if (!exportBtn) return;

  // Entferne alten Click-Handler
  exportBtn.onclick = null;

  // Setze neuen Handler basierend auf Kategorie
  if (category === "favoriten") {
    exportLabel.textContent = "Meine Duas exportieren";
    exportBtn.title = "Favorisierte Duas exportieren";
    exportBtn.onclick = exportFavoritesAsPDF;
  } else if (category === "gelernt") {
    exportLabel.textContent = "Gelerntes exportieren";
    exportBtn.title = "Auswendig gelernte Duas exportieren";
    exportBtn.onclick = exportCategoryAsPDF;
  } else if (category === "alle") {
    exportLabel.textContent = "Exportieren";
    exportBtn.title = "Alle Duas exportieren";
    exportBtn.onclick = exportAllAsPDF;
  } else {
    exportLabel.textContent = "Exportieren";
    exportBtn.title = `${CATEGORIES.find(c => c.id === category)?.label || "Kategorie"} exportieren`;
    exportBtn.onclick = exportCategoryAsPDF;
  }
}

window.addEventListener("hashchange", () => {
  renderFilterBar();
  renderDuas();
  updateExportButton();
  updatePlayAllButton();
});

// Dark Mode Handler
function initDarkMode() {
  const toggle = document.getElementById("theme-toggle");
  const isDarkMode = localStorage.getItem("nurdua:darkmode") === "true";

  if (isDarkMode) {
    document.body.classList.add("dark-mode");
    toggle.textContent = "☀️";
  }

  toggle?.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    const newMode = document.body.classList.contains("dark-mode");
    try {
      localStorage.setItem("nurdua:darkmode", newMode);
    } catch (e) {
      console.warn("Could not save dark mode preference");
    }
    toggle.textContent = newMode ? "☀️" : "🌙";
  });
}

// Scroll-to-Top Button with Throttled Event
function initScrollToTop() {
  const scrollBtn = document.getElementById("scroll-to-top-btn");
  if (!scrollBtn) return;

  let scrollTimeout;
  let lastScrollState = false;

  window.addEventListener("scroll", () => {
    // Throttle scroll events to 100ms (not 100x/sec)
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      const isVisible = window.scrollY > 300;
      // Only update DOM if state changed (reduces unnecessary reflows)
      if (isVisible !== lastScrollState) {
        scrollBtn.classList.toggle("visible", isVisible);
        lastScrollState = isVisible;
      }
    }, 100);
  }, { passive: true }); // passive flag improves scroll performance

  scrollBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

// Keyboard Navigation (Arrow Keys + Space)
function initKeyboardNav() {
  let currentFocusIndex = -1; // Track currently focused card

  document.addEventListener("keydown", (e) => {
    // Ignore if user is typing in an input
    if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;

    const duas = getFilteredDuas();
    if (duas.length === 0) return;

    // Get all visible dua cards
    const cards = Array.from(document.querySelectorAll(".dua-card"));
    if (cards.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      // Move focus to next card sequentially
      currentFocusIndex = Math.min(currentFocusIndex + 1, cards.length - 1);
      cards[currentFocusIndex]?.scrollIntoView({ behavior: "smooth", block: "center" });
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      // Move focus to previous card sequentially
      currentFocusIndex = Math.max(currentFocusIndex - 1, 0);
      cards[currentFocusIndex]?.scrollIntoView({ behavior: "smooth", block: "center" });
    } else if (e.key === " ") {
      e.preventDefault();
      // Play/Stop the focused card's audio
      const focusedCard = currentFocusIndex >= 0 ? cards[currentFocusIndex] : cards[0];
      if (focusedCard) {
        const playBtn = focusedCard.querySelector(".play-btn");
        if (playBtn) playBtn.click();
      }
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  renderFilterBar();
  renderDuas();
  renderStatistics();
  updateExportButton();
  updatePlayAllButton();
  initDarkMode();
  initScrollToTop();
  initKeyboardNav();

  document.getElementById("dua-list").addEventListener("click", onListClick);
  document.getElementById("play-all-btn")?.addEventListener("click", onPlayAllClick);

  // Export Button wird dynamisch in updateExportButton() zugewiesen
  // (onclick wird dort je nach Kategorie gesetzt)

  // PWA Service Worker registrieren
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("service-worker.js").catch(() => {
      console.log("PWA nicht verfügbar");
    });
  }

  // Audio preloading is now lazy (triggered when playing a dua)
});
