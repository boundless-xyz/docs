(function() {
  let giscusContainer = null;
  let observer = null;

  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  function init() {
    initGiscus();
    watchPageTitle();
  }

  function initGiscus() {
    const pagination = document.getElementById('pagination');

    if (!pagination) {
      console.warn('pagination element not found, skipping Giscus initialization');
      return;
    }

    // Remove existing Giscus widget if present
    if (giscusContainer) {
      giscusContainer.remove();
    }

    // Create container for Giscus
    giscusContainer = document.createElement('div');
    giscusContainer.className = 'giscus-container';

    const script = document.createElement('script');
    script.src = 'https://giscus.app/client.js';
    script.setAttribute('data-repo', 'boundless-xyz/docs');
    script.setAttribute('data-repo-id', 'R_kgDOP7HR5w');
    script.setAttribute('data-category', 'Announcements');
    script.setAttribute('data-category-id', 'DIC_kwDOP7HR584C0m6O');
    script.setAttribute('data-mapping', 'pathname');
    script.setAttribute('data-strict', '0');
    script.setAttribute('data-reactions-enabled', '0');
    script.setAttribute('data-emit-metadata', '1');
    script.setAttribute('data-input-position', 'bottom');
    script.setAttribute('data-theme', 'preferred_color_scheme');
    script.setAttribute('data-lang', 'en');
    script.setAttribute('data-loading', 'lazy');
    script.setAttribute('crossorigin', 'anonymous');
    script.async = true;

    giscusContainer.appendChild(script);
    pagination.insertAdjacentElement('afterend', giscusContainer);
  }

  function watchPageTitle() {
    let lastTitle = '';
    const pageTitle = document.getElementById('page-title');

    if (pageTitle) {
      lastTitle = pageTitle.textContent;
    }

    // Watch the entire document body for changes to page-title
    observer = new MutationObserver(function(mutations) {
      const currentPageTitle = document.getElementById('page-title');
      if (currentPageTitle) {
        const currentTitle = currentPageTitle.textContent;
        if (currentTitle !== lastTitle) {
          console.log('page title changed from', lastTitle, 'to', currentTitle);
          lastTitle = currentTitle;
          initGiscus();
        }
      }
    });

    // Observe the body or main content area for all changes
    observer.observe(document.body, {
      childList: true,
      characterData: true,
      subtree: true
    });
  }
})();
