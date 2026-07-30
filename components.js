// Google Antigravity - System Design Guide Web Components

// Persisted UI state is per-page. Section ids are not unique across the site —
// `recap` exists on all twelve guides, `gotchas` on nine — so an unscoped key
// would carry one page's open sections, and its scroll position, onto another.
const PAGE_KEY = (location.pathname.split('/').pop() || 'index.html');
const stateKey = (name) => `sdg:${PAGE_KEY}:${name}`;

// Drop the previous site-wide keys so stale cross-page state doesn't linger.
try {
  Object.keys(localStorage)
    .filter((k) => k === 'sec-scroll-pos' || k.startsWith('sec-open-'))
    .forEach((k) => localStorage.removeItem(k));
} catch (e) { /* storage unavailable (private mode, file:// in some browsers) */ }

// 1. Sticky Header Component with Scroll Progress Bar
class SysHeader extends HTMLElement {
  connectedCallback() {
    const current = this.getAttribute('current') || '';
    this.innerHTML = `
      <div class="sticky-header">
        <div class="header-inner">
          <div class="breadcrumbs">
            <a href="index.html">System Design Guide</a>
            <span class="sep">/</span>
            <span class="curr">${current}</span>
          </div>
          <div class="toc-jump">
            <a href="#toc-top">Jump to Contents</a>
          </div>
        </div>
        <div class="progress-bar"></div>
      </div>
    `;

    const progressBar = this.querySelector('.progress-bar');
    window.updateProgress = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollHeight > 0) {
        const progress = (window.scrollY / scrollHeight) * 100;
        progressBar.style.width = `${progress}%`;
      } else {
        progressBar.style.width = '0%';
      }
    };

    window.addEventListener('scroll', window.updateProgress);
    window.addEventListener('resize', window.updateProgress);
    setTimeout(window.updateProgress, 100);
  }
}

// 2. Collapsible Details Section Component
class SysCollapse extends HTMLElement {
  connectedCallback() {
    const id = this.id;
    const title = this.getAttribute('title');
    const content = this.innerHTML;
    
    // Clear and build markup
    this.innerHTML = `
      <details class="sec-collapse" id="${id}">
        <summary><h2>${title}</h2></summary>
        <div class="sec-content">
          ${content}
        </div>
      </details>
    `;

    // The id now lives on the inner <details>. Leaving it on the host too would
    // make #id resolve to the host, whose closest('details') is null — so hash
    // links (the TOC) would scroll to a section without opening it.
    this.removeAttribute('id');

    const details = this.querySelector('details');
    const storedState = localStorage.getItem(stateKey(`sec-open:${id}`));

    if (storedState !== null) {
      details.open = storedState === 'true';
    } else {
      // The hub wants its sections open on arrival; guides start collapsed.
      details.open = this.hasAttribute('open');
    }

    details.addEventListener('toggle', () => {
      localStorage.setItem(stateKey(`sec-open:${id}`), details.open);
      if (window.updateProgress) {
        setTimeout(window.updateProgress, 60);
      }
    });
  }
}

// 3. Question Component (Check yourself quizzes)
class SysQuestion extends HTMLElement {
  connectedCallback() {
    const question = this.getAttribute('q');
    const answer = this.innerHTML;
    
    this.innerHTML = `
      <details class="q">
        <summary>${question}</summary>
        <div class="a">${answer}</div>
      </details>
    `;
  }
}

// Register Custom Elements
customElements.define('sys-header', SysHeader);
customElements.define('sys-collapse', SysCollapse);
customElements.define('sys-question', SysQuestion);

// --- Global Page Actions: Scroll Restoration & Hash Routing ---

// Restore scroll position
const storedScroll = localStorage.getItem(stateKey('scroll'));
if (storedScroll !== null && !window.location.hash) {
  setTimeout(() => {
    window.scrollTo({ top: parseInt(storedScroll, 10), behavior: 'auto' });
  }, 120);
}

// Save scroll position on scroll (debounced)
let scrollTimeout;
window.addEventListener('scroll', () => {
  clearTimeout(scrollTimeout);
  scrollTimeout = setTimeout(() => {
    localStorage.setItem(stateKey('scroll'), window.scrollY);
  }, 150);
});

// Auto-expand details elements when targeted by a hash link
function handleHashChange() {
  const hash = window.location.hash;
  if (hash) {
    const target = document.querySelector(hash);
    if (target) {
      let parent = target.closest('details');
      while (parent) {
        parent.open = true;
        parent = parent.parentElement.closest('details');
      }
      setTimeout(() => {
        target.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  }
}
window.addEventListener('hashchange', handleHashChange);
window.addEventListener('DOMContentLoaded', handleHashChange);
