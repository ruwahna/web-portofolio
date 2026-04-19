/**
 * animations.js — Full Animation Engine (ekizr.com style)
 * 1.  Page load fade + rise
 * 2.  Scroll progress bar
 * 3.  Custom cursor dot + lagging ring
 * 4.  Particle / constellation background
 * 5.  Typing effect        [data-typing="Word One|Word Two"]
 * 6.  Scroll reveal        (IntersectionObserver)
 * 7.  Magnetic hover       (buttons & nav links)
 * 8.  Ripple click effect
 * 9.  3-D tilt cards
 * 10. Smooth scroll + active nav highlight
 * 11. Interactive lift     (hover raise + shadow)
 * 12. Counter animation    [data-count="99"]
 * 13. Lazy image fade-in   [data-src="photo.jpg"]
 * 14. Lightbox overlay
 * 15. Certificate viewer page
 * 16. Page transition curtain
 */
(function () {
    'use strict';

    var RM     = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var HOVER  = window.matchMedia && window.matchMedia('(hover: hover)').matches;
    var MOBILE = window.innerWidth < 768;
    var ENABLE_CUSTOM_CURSOR = false;
    var ENABLE_CURSOR_REACTIVE_MOTION = false;

    function q(s)   { return document.querySelector(s); }
    function qa(s)  { return Array.prototype.slice.call(document.querySelectorAll(s)); }
    function raf(f) { return requestAnimationFrame(f); }

    /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
       1. PAGE LOAD FADE + RISE
    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
    if (!RM && document.body) {
        document.body.style.opacity   = '0';
        document.body.style.transform = 'translateY(14px)';
        document.body.style.transition =
            'opacity 700ms cubic-bezier(.22,.61,.36,1),' +
            'transform 700ms cubic-bezier(.22,.61,.36,1)';
        raf(function () {
            document.body.style.opacity   = '1';
            document.body.style.transform = 'translateY(0)';
        });
    }

    /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
       2. SCROLL PROGRESS BAR
    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
    if (!RM) {
        var bar = document.createElement('div');
        bar.style.cssText =
            'position:fixed;top:0;left:0;height:3px;width:0%;z-index:99999;pointer-events:none;' +
            'background:linear-gradient(90deg,#4a5aa0,#8fa0e8);border-radius:0 2px 2px 0;' +
            'transition:width 60ms linear;';
        document.body.appendChild(bar);
        var _rid = null;
        window.addEventListener('scroll', function () {
            if (_rid) return;
            _rid = raf(function () {
                _rid = null;
                var s = document.documentElement.scrollTop;
                var h = document.documentElement.scrollHeight - window.innerHeight;
                bar.style.width = (h > 0 ? Math.round(s / h * 100) : 0) + '%';
            });
        }, { passive: true });
    }

    /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
       3. CUSTOM CURSOR — dot + lagging ring
    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
    if (ENABLE_CUSTOM_CURSOR && !RM && HOVER && !MOBILE) {
        var dot  = document.createElement('div');
        var ring = document.createElement('div');
        dot.style.cssText =
            'position:fixed;pointer-events:none;width:8px;height:8px;border-radius:50%;' +
            'background:#4a5aa0;transform:translate(-50%,-50%);z-index:99998;' +
            'top:0;left:0;opacity:0;transition:opacity 300ms ease,transform 150ms ease;';
        ring.style.cssText =
            'position:fixed;pointer-events:none;width:38px;height:38px;border-radius:50%;' +
            'border:1.5px solid rgba(74,90,160,.45);transform:translate(-50%,-50%);' +
            'z-index:99997;top:0;left:0;opacity:0;' +
            'transition:width 250ms ease,height 250ms ease,border-color 250ms ease,opacity 300ms ease;';
        document.body.appendChild(dot);
        document.body.appendChild(ring);

        var mx=0,my=0,rx=0,ry=0,crid=null;
        document.addEventListener('mousemove', function (e) {
            mx = e.clientX; my = e.clientY;
            dot.style.left = mx + 'px'; dot.style.top = my + 'px';
            dot.style.opacity = ring.style.opacity = '1';
            if (crid) return;
            (function loop() {
                crid = raf(function () {
                    crid = null;
                    rx += (mx - rx) * .12; ry += (my - ry) * .12;
                    ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
                    if (Math.abs(mx - rx) > .4 || Math.abs(my - ry) > .4) loop();
                });
            })();
        });
        document.addEventListener('mouseleave', function () {
            dot.style.opacity = ring.style.opacity = '0';
        });
        var _hov = 'a,button,.btn,.project-card,.page-card,.feature-card,.tab,.tech-tags span,input,textarea,.cert-zoomable,[role=button]';
        document.addEventListener('mouseover', function (e) {
            if (!e.target.closest(_hov)) return;
            ring.style.width = ring.style.height = '56px';
            ring.style.borderColor = 'rgba(74,90,160,.8)';
            dot.style.transform = 'translate(-50%,-50%) scale(1.8)';
        });
        document.addEventListener('mouseout', function (e) {
            if (!e.target.closest(_hov)) return;
            ring.style.width = ring.style.height = '38px';
            ring.style.borderColor = 'rgba(74,90,160,.45)';
            dot.style.transform = 'translate(-50%,-50%) scale(1)';
        });
    }

    /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
       4. PARTICLE CONSTELLATION
    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
    if (!RM && !MOBILE) {
        var hero = q('.hero') || q('header') || q('section');
        if (hero) {
            var cv = document.createElement('canvas');
            cv.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:0;opacity:.45;';
            if (getComputedStyle(hero).position === 'static') hero.style.position = 'relative';
            hero.insertBefore(cv, hero.firstChild);
            var ctx = cv.getContext('2d');
            var pts = [];
            var PCNT = 55;
            function presize() { cv.width = hero.offsetWidth; cv.height = hero.offsetHeight; }
            function mkpt() {
                return { x: Math.random() * cv.width, y: Math.random() * cv.height,
                         vx: (Math.random() - .5) * .45, vy: (Math.random() - .5) * .45,
                         r: Math.random() * 1.8 + .8, a: Math.random() * .55 + .2 };
            }
            presize();
            for (var _i = 0; _i < PCNT; _i++) pts.push(mkpt());
            window.addEventListener('resize', presize, { passive: true });
            (function draw() {
                raf(draw);
                ctx.clearRect(0, 0, cv.width, cv.height);
                pts.forEach(function (p) {
                    p.x += p.vx; p.y += p.vy;
                    if (p.x < 0) p.x = cv.width;  if (p.x > cv.width)  p.x = 0;
                    if (p.y < 0) p.y = cv.height; if (p.y > cv.height) p.y = 0;
                    ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                    ctx.fillStyle = 'rgba(74,90,160,' + p.a + ')'; ctx.fill();
                });
                for (var a = 0; a < pts.length; a++) {
                    for (var b = a + 1; b < pts.length; b++) {
                        var ddx = pts[a].x - pts[b].x, ddy = pts[a].y - pts[b].y;
                        var dd  = Math.sqrt(ddx * ddx + ddy * ddy);
                        if (dd < 100) {
                            ctx.beginPath(); ctx.moveTo(pts[a].x, pts[a].y); ctx.lineTo(pts[b].x, pts[b].y);
                            ctx.strokeStyle = 'rgba(74,90,160,' + (.14 * (1 - dd / 100)) + ')';
                            ctx.lineWidth = .6; ctx.stroke();
                        }
                    }
                }
            })();
        }
    }

    /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
       5. TYPING EFFECT
       <span data-typing="Hello World|Web Dev"></span>
    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
    qa('[data-typing]').forEach(function (el) {
        var words  = el.getAttribute('data-typing').split('|');
        var speed  = parseInt(el.getAttribute('data-typing-speed') || '85', 10);
        var pause  = parseInt(el.getAttribute('data-typing-pause') || '1600', 10);
        var wi = 0, ci = 0, del = false;
        var cur = document.createElement('span');
        cur.textContent = '|';
        cur.style.cssText = 'display:inline-block;color:#4a5aa0;animation:_tblink .7s step-end infinite;margin-left:1px;';
        el.after(cur);
        if (!q('#_t-style')) {
            var _ts = document.createElement('style');
            _ts.id  = '_t-style';
            _ts.textContent = '@keyframes _tblink{0%,100%{opacity:1}50%{opacity:0}}';
            document.head.appendChild(_ts);
        }
        function tick() {
            var word = words[wi];
            ci = del ? ci - 1 : ci + 1;
            el.textContent = word.substring(0, ci);
            var next = del ? speed / 2 : speed;
            if (!del && ci === word.length) { next = pause; del = true; }
            else if (del && ci === 0) { del = false; wi = (wi + 1) % words.length; next = 380; }
            setTimeout(tick, next);
        }
        tick();
    });

    /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
       6. SCROLL REVEAL
    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
    if (!RM) {
        var _sel = [
            'nav','header','h1','h2','h3','h4','p','blockquote',
            '.hero-text','.hero-image','.hero-intro','.hero-actions',
            '.project-card','.page-card','.feature-card',
            '.project-detail-shell','.project-preview','.project-thumb',
            '.project-actions','.portfolio-tabs','.portfolio-showcase',
            '.tech-tags span','.btn','.tab','.detail-back',
            '.detail-actions-row','.cert-more-title','.page-title',
            'section > *','footer > *',
            '.about-content','.skills-list','.timeline-item','.contact-form','.social-links'
        ].join(',');
        var _els = [];
        try { _els = qa(_sel); } catch (e) {}
        _els.forEach(function (el) {
            if (el.dataset.rv) return;
            el.dataset.rv = '1';
            el.style.opacity   = '0';
            el.style.transform = 'translateY(22px)';
            el.style.transition =
                'opacity 560ms cubic-bezier(.22,.61,.36,1),' +
                'transform 560ms cubic-bezier(.22,.61,.36,1)';
        });
        if ('IntersectionObserver' in window) {
            var _io = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (!entry.isIntersecting) return;
                    var el = entry.target;
                    el.style.opacity = '1'; el.style.transform = 'translateY(0)';
                    _io.unobserve(el);
                });
            }, { threshold: .1, rootMargin: '0px 0px -36px 0px' });
            _els.forEach(function (el) { _io.observe(el); });
        } else {
            _els.forEach(function (el) { el.style.opacity = '1'; el.style.transform = 'none'; });
        }
    }

    /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
       7. MAGNETIC HOVER
    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
    if (ENABLE_CURSOR_REACTIVE_MOTION && !RM && HOVER && !MOBILE) {
        document.addEventListener('mousemove', function (e) {
            qa('.btn,.project-actions a,nav a,.tab').forEach(function (el) {
                var r  = el.getBoundingClientRect();
                var cx = r.left + r.width / 2, cy = r.top + r.height / 2;
                var dx = e.clientX - cx, dy = e.clientY - cy;
                var d  = Math.sqrt(dx * dx + dy * dy);
                if (d < 80) {
                    var pull = (1 - d / 80) * 10;
                    el.style.transform  = 'translate(' + (dx / d * pull) + 'px,' + (dy / d * pull) + 'px)';
                    el.style.transition = 'transform 100ms ease';
                } else if (el.style.transform) {
                    el.style.transform  = 'translate(0,0)';
                    el.style.transition = 'transform 400ms cubic-bezier(.22,.61,.36,1)';
                }
            });
        }, { passive: true });
    }

    /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
       8. RIPPLE CLICK
    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
    if (!RM) {
        if (!q('#_rpl-s')) {
            var _rs = document.createElement('style');
            _rs.id  = '_rpl-s';
            _rs.textContent = '@keyframes _rpl{to{transform:scale(1);opacity:0}}';
            document.head.appendChild(_rs);
        }
        document.addEventListener('click', function (e) {
            var el = e.target.closest('a,button,.btn,.project-card,.page-card,.tab,.tech-tags span');
            if (!el) return;
            if (getComputedStyle(el).position === 'static') el.style.position = 'relative';
            el.style.overflow = 'hidden';
            var r  = el.getBoundingClientRect();
            var sp = document.createElement('span');
            var sz = Math.max(r.width, r.height) * 2;
            sp.style.cssText =
                'position:absolute;border-radius:50%;pointer-events:none;' +
                'background:rgba(74,90,160,.18);transform:scale(0);' +
                'animation:_rpl 600ms ease-out forwards;' +
                'width:' + sz + 'px;height:' + sz + 'px;' +
                'left:' + (e.clientX - r.left - sz / 2) + 'px;' +
                'top:'  + (e.clientY - r.top  - sz / 2) + 'px;';
            el.appendChild(sp);
            setTimeout(function () { if (sp.parentNode) sp.parentNode.removeChild(sp); }, 650);
        });
    }

    /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
       9. 3-D TILT CARDS
    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
    if (ENABLE_CURSOR_REACTIVE_MOTION && !RM && HOVER && !MOBILE) {
        document.addEventListener('mousemove', function (e) {
            qa('.project-card,.page-card,.feature-card').forEach(function (card) {
                var r = card.getBoundingClientRect();
                if (e.clientX < r.left - 30 || e.clientX > r.right  + 30 ||
                    e.clientY < r.top  - 30 || e.clientY > r.bottom + 30) {
                    card.style.transform  = 'perspective(800px) rotateX(0) rotateY(0) scale(1)';
                    card.style.transition = 'transform 500ms ease';
                    return;
                }
                var cx = (e.clientX - r.left) / r.width  - .5;
                var cy = (e.clientY - r.top)  / r.height - .5;
                card.style.transform  = 'perspective(800px) rotateX(' + (cy * -7) + 'deg) rotateY(' + (cx * 7) + 'deg) scale(1.03)';
                card.style.transition = 'transform 80ms ease';
            });
        }, { passive: true });
        qa('.project-card,.page-card,.feature-card').forEach(function (c) {
            c.addEventListener('mouseleave', function () {
                c.style.transform  = 'perspective(800px) rotateX(0) rotateY(0) scale(1)';
                c.style.transition = 'transform 500ms cubic-bezier(.22,.61,.36,1)';
            });
        });
    }

    /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
       10. SMOOTH SCROLL + ACTIVE NAV
    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
    document.addEventListener('click', function (e) {
        var link = e.target.closest('a[href^="#"]');
        if (!link) return;
        var id = link.getAttribute('href').slice(1);
        if (!id) return;
        var t  = document.getElementById(id);
        if (!t) return;
        e.preventDefault();
        t.scrollIntoView({ behavior: RM ? 'auto' : 'smooth', block: 'start' });
    });
    var _cur = window.location.pathname.split('/').pop() || 'index.html';
    qa('nav a').forEach(function (a) {
        var href = (a.getAttribute('href') || '').split('/').pop();
        if (href && href === _cur) a.setAttribute('aria-current', 'page');
    });

    /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
       11. INTERACTIVE LIFT (hover raise)
    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
    if (!RM) {
        function addLift(sel, ly, sh) {
            qa(sel).forEach(function (el) {
                if (el.dataset.lift) return;
                el.dataset.lift = '1';
                var base = el.style.transition || '';
                var ext  = 'transform 200ms ease,box-shadow 200ms ease';
                el.style.transition = base ? base + ',' + ext : ext;
                function on()  { el.style.transform = 'translateY(' + ly + 'px)'; if (sh) el.style.boxShadow = sh; }
                function off() { el.style.transform = ''; if (sh) el.style.boxShadow = ''; }
                if (HOVER) { el.addEventListener('mouseenter', on); el.addEventListener('mouseleave', off); }
                el.addEventListener('focus',      on);
                el.addEventListener('blur',       off);
                el.addEventListener('touchstart', on,  { passive: true });
                el.addEventListener('touchend',   off, { passive: true });
            });
        }
        addLift('.project-card,.page-card,.feature-card', -4, '0 18px 36px rgba(0,0,0,.22)');
        addLift('.btn,.project-actions a,.tab,.detail-back,.tech-tags span', -2, '');
        addLift('.project-thumb img,.hero-image img,.cert-zoomable', -2, '');
    }

    /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
       12. COUNTER ANIMATION
       <span data-count="150">0</span>
    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
    if (!RM) {
        var _cnts = qa('[data-count]');
        if (_cnts.length && 'IntersectionObserver' in window) {
            var _cio = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (!entry.isIntersecting) return;
                    var el  = entry.target;
                    var end = parseInt(el.getAttribute('data-count'), 10);
                    var t0  = null;
                    raf(function step(ts) {
                        if (!t0) t0 = ts;
                        var prog = Math.min((ts - t0) / 1400, 1);
                        el.textContent = Math.round((1 - Math.pow(1 - prog, 3)) * end);
                        if (prog < 1) raf(step);
                    });
                    _cio.unobserve(el);
                });
            }, { threshold: .5 });
            _cnts.forEach(function (el) { _cio.observe(el); });
        }
    }

    /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
       13. LAZY IMAGE FADE-IN
       <img data-src="photo.jpg" alt="...">
    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
    if ('IntersectionObserver' in window) {
        var _limgs = qa('img[data-src]');
        if (_limgs.length) {
            var _lio = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (!entry.isIntersecting) return;
                    var img = entry.target;
                    img.src = img.getAttribute('data-src');
                    img.removeAttribute('data-src');
                    img.style.transition = 'opacity 500ms ease';
                    img.onload = function () { img.style.opacity = '1'; };
                    _lio.unobserve(img);
                });
            }, { threshold: .1 });
            _limgs.forEach(function (img) { img.style.opacity = '0'; _lio.observe(img); });
        }
    }

    /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
       14. LIGHTBOX OVERLAY
    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
    function getBase() { return window.location.pathname.indexOf('/pages/') !== -1 ? '../../' : ''; }
    function resolveSrc(p) {
        if (!p) return getBase() + 'assets/piagam.jpg';
        if (/^(https?:|data:)/.test(p)) return p;
        if (/^(\.\.\/)+/.test(p)) return p;
        if (p.indexOf('assets/') === 0) return getBase() + p;
        return getBase() + 'assets/' + p.replace(/^\/?/, '');
    }
    function openOverlay(src, alt) {
        var ov = document.createElement('div');
        ov.style.cssText =
            'position:fixed;inset:0;background:rgba(0,0,0,.92);' +
            'display:flex;align-items:center;justify-content:center;' +
            'padding:24px;z-index:99999;cursor:zoom-out;opacity:0;' +
            'transition:opacity 220ms ease;';
        var btn = document.createElement('button');
        btn.type = 'button'; btn.textContent = 'Tutup';
        btn.style.cssText =
            'position:fixed;top:18px;right:18px;border:0;border-radius:8px;' +
            'padding:10px 18px;font-weight:700;font-size:14px;' +
            'background:#4a5aa0;color:#fff;cursor:pointer;' +
            'transition:background 200ms ease;';
        btn.onmouseenter = function () { btn.style.background = '#3a4a90'; };
        btn.onmouseleave = function () { btn.style.background = '#4a5aa0'; };
        var img = document.createElement('img');
        img.src = resolveSrc(src); img.alt = alt || 'Preview';
        img.style.cssText =
            'max-width:min(92vw,1200px);max-height:90vh;width:auto;height:auto;' +
            'object-fit:contain;border-radius:10px;background:#fff;cursor:default;' +
            'transform:scale(.92);transition:transform 280ms cubic-bezier(.22,.61,.36,1);';
        function close() {
            if (!ov.parentNode) return;
            ov.style.opacity = '0'; img.style.transform = 'scale(.92)';
            setTimeout(function () { if (ov.parentNode) ov.parentNode.removeChild(ov); }, RM ? 0 : 200);
            document.removeEventListener('keydown', onKey);
        }
        function onKey(e) { if (e.key === 'Escape') close(); }
        ov.appendChild(img); ov.appendChild(btn);
        document.body.appendChild(ov);
        raf(function () { ov.style.opacity = '1'; img.style.transform = 'scale(1)'; });
        ov.addEventListener('click', function (e) { if (e.target === ov) close(); });
        btn.addEventListener('click', close);
        document.addEventListener('keydown', onKey);
    }
    qa('.cert-zoomable').forEach(function (img) {
        img.style.cursor = 'zoom-in';
        img.addEventListener('click', function () {
            openOverlay(img.getAttribute('data-full') || img.src, img.alt);
        });
    });
    qa('.project-actions.cert-actions a[href*="certificate-viewer"]').forEach(function (link) {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            var href = new URL(link.href, window.location.href);
            var im   = href.searchParams.get('img');
            if (im) openOverlay(im, link.textContent.trim());
        });
    });

    /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
       15. CERTIFICATE VIEWER PAGE
    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
    var _cimg = document.getElementById('certificateImage');
    var _cbtn = document.getElementById('closeViewerBtn');
    if (_cimg && _cbtn) {
        var _cp   = new URLSearchParams(window.location.search);
        _cimg.src = resolveSrc(_cp.get('img') || 'assets/piagam.jpg');
        var _back = _cp.get('back') ||
            (window.location.pathname.indexOf('/pages/') !== -1 ? '../../portfolio.html' : 'portfolio.html');
        _cbtn.addEventListener('click', function () {
            if (window.history.length > 1) { window.history.back(); return; }
            window.location.href = _back;
        });
    }

    /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
       16. PAGE TRANSITION CURTAIN
    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
    if (!RM) {
        var curtain = document.createElement('div');
        curtain.style.cssText =
            'position:fixed;inset:0;background:#4a5aa0;z-index:999999;' +
            'opacity:0;pointer-events:none;transition:opacity 300ms ease;';
        document.body.appendChild(curtain);
        document.addEventListener('click', function (e) {
            var link = e.target.closest('a[href]');
            if (!link) return;
            var href = link.getAttribute('href');
            if (!href || href[0] === '#' || href.indexOf('javascript') === 0) return;
            if (link.target === '_blank' || e.ctrlKey || e.metaKey || e.shiftKey) return;
            if (/^https?:\/\//.test(href) && !href.includes(window.location.hostname)) return;
            e.preventDefault();
            curtain.style.pointerEvents = 'all';
            curtain.style.opacity = '.3';
            setTimeout(function () { window.location.href = href; }, 320);
        });
    }

})();