// Shared header + footer for every page on the site.
// Each page sets <body data-root="../" data-section="apps"> (root = path back to site root).
(function () {
  const body = document.body;
  const root = body.dataset.root || '';
  const section = body.dataset.section || 'home';
  const links = [
    { id: 'home', label: 'About', href: '' },
    { id: 'now', label: "What I'm Up To", href: 'now/' },
    { id: 'apps', label: 'Apps', href: 'apps/' },
    { id: 'forge', label: 'Campaign Forge', href: 'apps/campaign-forge/' }
  ];
  const nav = document.createElement('nav');
  nav.className = 'site-nav';
  nav.innerHTML = `<div class="site-nav__inner">
      <a class="site-nav__brand" href="${root || './'}">Jonathan Coppola</a>
      <button class="site-nav__toggle" aria-label="Menu" aria-expanded="false">☰</button>
      <div class="site-nav__links">
        ${links.map(l => `<a href="${root}${l.href}" class="${l.id === section ? 'is-active' : ''}">${l.label}</a>`).join('')}
        <a class="site-nav__cta" href="mailto:coppolajonathan@gmail.com">Say hello</a>
      </div>
    </div>`;
  body.prepend(nav);
  const t = nav.querySelector('.site-nav__toggle');
  t.addEventListener('click', () => { const o = nav.classList.toggle('is-open'); t.setAttribute('aria-expanded', o); });

  const foot = document.createElement('footer');
  foot.className = 'site-foot';
  foot.innerHTML = `<div class="site-foot__inner">
      <div><b>Jonathan Coppola, MS</b><br><span>Tampa, FL · technical curriculum · stage · table</span></div>
      <div class="site-foot__links">
        ${links.map(l => `<a href="${root}${l.href}">${l.label}</a>`).join('')}
        <a href="https://www.linkedin.com/in/jcoppola1" target="_blank" rel="noopener">LinkedIn</a>
        <a href="https://github.com/coppolajonathan-lab" target="_blank" rel="noopener">GitHub</a>
      </div>
    </div>`;
  body.append(foot);
})();
