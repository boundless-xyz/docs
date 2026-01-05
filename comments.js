(function() {
  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGiscus);
  } else {
    initGiscus();
  }

  function initGiscus() {
    const pagination = document.getElementById('pagination');

    if (!pagination) {
      console.warn('pagination element not found, skipping Giscus initialization');
      return;
    }

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

    pagination.insertAdjacentElement('afterend', script);
  }
})();
