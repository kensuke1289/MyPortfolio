// ヘッダースクロール処理
const header = document.querySelector('.header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 60);
});

// メニュータブ切り替え
const tabs = document.querySelectorAll('.menu__tab');
const contents = document.querySelectorAll('.menu__content');

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    const target = tab.dataset.tab;

    tabs.forEach(t => t.classList.remove('active'));
    contents.forEach(c => c.classList.remove('active'));

    tab.classList.add('active');
    document.getElementById(`tab-${target}`).classList.add('active');
  });
});

// スクロールアニメーション
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
);

document.querySelectorAll(
  '.about__text, .about__image, .menu__header, .menu-card, .menu-item, .wine-card, ' +
  '.ambiance__quote, .ambiance__stats, .access__info, .access__map, .ambiance__stat'
).forEach(el => {
  el.classList.add('reveal');
  revealObserver.observe(el);
});

// スタッガードアニメーション（カードを順番に表示）
const staggerGroups = [
  '.menu-card',
  '.wine-card',
  '.ambiance__stat'
];

staggerGroups.forEach(selector => {
  document.querySelectorAll(selector).forEach((el, i) => {
    el.style.transitionDelay = `${i * 0.12}s`;
  });
});

// スムーズスクロール（ナビリンク）
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// カウントアップアニメーション（数字）
const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const strong = entry.target.querySelector('strong');
        const target = parseFloat(strong.textContent);
        const isDecimal = strong.textContent.includes('.');
        const suffix = strong.textContent.replace(/[\d.]/g, '');
        let start = 0;
        const duration = 1500;
        const startTime = performance.now();

        const update = (currentTime) => {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          const current = start + (target - start) * eased;

          strong.textContent = (isDecimal ? current.toFixed(1) : Math.floor(current)) + suffix;

          if (progress < 1) requestAnimationFrame(update);
        };

        requestAnimationFrame(update);
        counterObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.5 }
);

document.querySelectorAll('.ambiance__stat').forEach(el => {
  counterObserver.observe(el);
});
