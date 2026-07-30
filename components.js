// Google Antigravity - System Design Guide Web Components

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

    const details = this.querySelector('details');
    const storedState = localStorage.getItem(`sec-open-${id}`);
    
    if (storedState !== null) {
      details.open = storedState === 'true';
    } else {
      details.open = false;
    }

    details.addEventListener('toggle', () => {
      localStorage.setItem(`sec-open-${id}`, details.open);
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

// 4. Global Footer Component
class SysFooter extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <hr>
      <p class="footer">
        Part of <em>System Design Basics</em>. Sources:
        <a href="https://docs.aws.amazon.com/whitepapers/latest/database-caching-strategies-using-redis/caching-patterns.html">AWS — Database Caching Strategies Using Redis</a> ·
        <a href="https://redis.io/blog/how-to-tame-the-thundering-herd-problem/">Redis — Taming the Thundering Herd</a> ·
        <a href="https://accreditly.io/articles/the-practical-guide-to-http-caching-headers-cache-control-etag-and-304s">Accreditly — HTTP Caching Headers</a> ·
        <a href="https://blog.bytebytego.com/p/a-crash-course-in-caching-final-part">ByteByteGo — A Crash Course in Caching</a> ·
        <a href="https://read.engineerscodex.com/p/how-facebook-scaled-memcached">Scaling Memcache at Facebook</a> ·
        <a href="https://openconnect.netflix.com/">Netflix Open Connect</a> ·
        <a href="https://www.prisma.io/dataguide/managing-databases/introduction-database-caching">Prisma — Database Caching</a>
      </p>
    `;
  }
}

// Register Custom Elements
customElements.define('sys-header', SysHeader);
customElements.define('sys-collapse', SysCollapse);
customElements.define('sys-question', SysQuestion);
customElements.define('sys-footer', SysFooter);

// --- Global Page Actions: Scroll Restoration & Hash Routing ---

// Restore scroll position
const storedScroll = localStorage.getItem('sec-scroll-pos');
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
    localStorage.setItem('sec-scroll-pos', window.scrollY);
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
