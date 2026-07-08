/* ============================================================
   공통 끼워넣기 스크립트
   - [data-include="/partials/xxx.html"] 요소에 해당 파일을 fetch해 끼워넣음
   - 끼워넣은 뒤 현재 주소(location.pathname)와 일치하는 메뉴 링크에 is-active 부여
   - 헤더 스크롤 동작·모바일 드로어·.reveal 등장 애니 연결
   ※ fetch 방식이라 file:// 로 열면 동작하지 않습니다. 반드시 http(로컬서버/배포)에서 확인.
   ============================================================ */

/* ── 분석·광고 추적(전 페이지 공통) ────────────────────────────
   메타 픽셀 + (예정)GA4. 한 곳에서 관리해 17개 페이지에 자동 적용.
   전환: 견적 신청 클릭=Lead, 전화 클릭=Contact 자동 추적.        */
(function () {
  /* Meta Pixel */
  !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
  n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
  n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
  t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
  document,'script','https://connect.facebook.net/en_US/fbevents.js');
  fbq('init', '974391308967190');
  fbq('track', 'PageView');

  /* GA4 (Google Analytics) */
  var GA_ID = 'G-SY1XRW0QB5';
  var g = document.createElement('script'); g.async = true;
  g.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
  document.head.appendChild(g);
  window.dataLayer = window.dataLayer || [];
  function gtag(){ dataLayer.push(arguments); }
  window.gtag = gtag;
  gtag('js', new Date());
  gtag('config', GA_ID);

  /* 전환 추적(견적/전화 클릭) — 이벤트 위임이라 include 여부와 무관 */
  document.addEventListener('click', function (e) {
    var a = e.target && e.target.closest ? e.target.closest('a[href]') : null;
    if (!a) return;
    var href = a.getAttribute('href') || '';
    if (/foodtruck-quote\.vercel\.app/i.test(href)) {
      if (window.fbq) fbq('track', 'Lead', { content_name: '3분 견적 신청' });
      if (window.gtag) gtag('event', 'generate_lead', { method: '3분견적' });
    } else if (/^tel:/i.test(href)) {
      if (window.fbq) fbq('track', 'Contact');
      if (window.gtag) gtag('event', 'contact', { method: 'phone' });
    } else if (/pf\.kakao\.com/i.test(href)) {
      if (window.fbq) fbq('track', 'Contact', { content_name: '카카오톡 상담' });
      if (window.gtag) gtag('event', 'contact', { method: 'kakao' });
    }
  }, true);
})();

(function () {
  function norm(p) {
    p = (p || '').toLowerCase();
    if (p === '' || p === '/' || p.charAt(p.length - 1) === '/') p += 'index.html';
    return p;
  }

  function markActive() {
    var here = norm(location.pathname);
    document.querySelectorAll('header a[href], .drawer a[href]').forEach(function (a) {
      var href = a.getAttribute('href');
      if (!href || /^(https?:|tel:|mailto:|#)/i.test(href)) return;
      var p;
      try { p = norm(new URL(href, location.origin).pathname); } catch (e) { return; }
      if (p === here) a.classList.add('is-active');
    });
    // 자식(서브메뉴)이 활성이면 상위 드롭다운 토글에도 표시
    document.querySelectorAll('.nav-links .has-sub').forEach(function (sub) {
      if (sub.querySelector('.submenu a.is-active')) {
        var top = sub.querySelector(':scope > a');
        if (top) top.classList.add('is-active');
      }
    });
  }

  function initHeader() {
    var hdr = document.getElementById('hdr');
    var mb = document.getElementById('menuBtn');
    var dr = document.getElementById('drawer');
    var landing = document.body.classList.contains('landing');
    var last = 0;
    window.addEventListener('scroll', function () {
      var y = window.scrollY || window.pageYOffset;
      if (landing) {
        if (hdr) hdr.classList.toggle('scrolled', y > 40);
      } else if (hdr) {
        hdr.style.transform = (y > last && y > 240) ? 'translateY(-100%)' : 'translateY(0)';
      }
      last = y;
    }, { passive: true });
    if (mb && dr) {
      mb.addEventListener('click', function () {
        var o = dr.classList.toggle('open');
        mb.setAttribute('aria-expanded', o);
      });
      dr.querySelectorAll('a').forEach(function (a) {
        a.addEventListener('click', function () {
          dr.classList.remove('open');
          mb.setAttribute('aria-expanded', false);
        });
      });
    }
  }

  function initReveal() {
    var els = document.querySelectorAll('.reveal');
    if (!els.length) return;
    if (!('IntersectionObserver' in window)) {
      els.forEach(function (e) { e.classList.add('in'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.1 });
    els.forEach(function (el) { io.observe(el); });
  }

  function fillIncludes() {
    var nodes = document.querySelectorAll('[data-include]');
    return Promise.all([].map.call(nodes, function (n) {
      var url = n.getAttribute('data-include');
      return fetch(url)
        .then(function (r) { if (!r.ok) throw new Error(r.status + ' ' + url); return r.text(); })
        .then(function (html) { n.innerHTML = html; })
        .catch(function (e) { console.error('include 실패:', url, e); });
    }));
  }

  function run() {
    fillIncludes().then(function () {
      markActive();
      initHeader();
      initReveal();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run);
  } else {
    run();
  }
})();
