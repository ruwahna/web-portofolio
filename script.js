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
    var ENABLE_CURSOR_REACTIVE_MOTION = true;

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
       3. CUSTOM CURSOR — dot + lagging glowing ring
    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
    if (ENABLE_CUSTOM_CURSOR && !RM && HOVER && !MOBILE) {
        var dot  = document.createElement('div');
        var ring = document.createElement('div');
        dot.style.cssText =
            'position:fixed;pointer-events:none;width:8px;height:8px;border-radius:50%;' +
            'background:#00d2ff;box-shadow:0 0 10px #00d2ff, 0 0 20px #00d2ff;' +
            'transform:translate(-50%,-50%);z-index:99998;' +
            'top:0;left:0;opacity:0;transition:opacity 300ms ease,transform 150ms ease;';
        ring.style.cssText =
            'position:fixed;pointer-events:none;width:40px;height:40px;border-radius:50%;' +
            'border:1.5px solid rgba(0,210,255,.5);box-shadow:0 0 15px rgba(0,210,255,.2);' +
            'transform:translate(-50%,-50%);' +
            'z-index:99997;top:0;left:0;opacity:0;' +
            'transition:width 250ms ease,height 250ms ease,border-color 250ms ease,background 250ms ease,opacity 300ms ease;';
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
                    rx += (mx - rx) * .15; ry += (my - ry) * .15;
                    ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
                    if (Math.abs(mx - rx) > .4 || Math.abs(my - ry) > .4) loop();
                });
            })();
        });
        document.addEventListener('mouseleave', function () {
            dot.style.opacity = ring.style.opacity = '0';
        });
        var _hov = 'a,button,.btn,.project-card,.page-card,.feature-card,.focus-card,.neo-card,.polaroid-frame,.tab,.tech-tags span,input,textarea,.cert-zoomable,[role=button],.social-icon';
        document.addEventListener('mouseover', function (e) {
            if (!e.target.closest(_hov)) return;
            ring.style.width = ring.style.height = '60px';
            ring.style.borderColor = 'rgba(126,112,255,.8)';
            ring.style.background = 'rgba(0,210,255,.06)';
            dot.style.transform = 'translate(-50%,-50%) scale(2)';
            dot.style.background = '#7e70ff';
        });
        document.addEventListener('mouseout', function (e) {
            if (!e.target.closest(_hov)) return;
            ring.style.width = ring.style.height = '40px';
            ring.style.borderColor = 'rgba(0,210,255,.5)';
            ring.style.background = 'transparent';
            dot.style.transform = 'translate(-50%,-50%) scale(1)';
            dot.style.background = '#00d2ff';
        });
    }

    /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
       4. PARTICLE CONSTELLATION (WITH MOUSE INTERACTION)
    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
    if (!RM && !MOBILE) {
        var hero = q('.portfolio-hero') || q('.hero') || q('.page-section') || q('.contact-section-simple') || q('header') || q('section');
        if (hero) {
            var cv = document.createElement('canvas');
            cv.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:0;opacity:.65;';
            if (getComputedStyle(hero).position === 'static') hero.style.position = 'relative';
            hero.insertBefore(cv, hero.firstChild);
            var ctx = cv.getContext('2d');
            var pts = [];
            var PCNT = 60;
            var mousePos = { x: -1000, y: -1000 };
            hero.addEventListener('mousemove', function(e) {
                var rect = hero.getBoundingClientRect();
                mousePos.x = e.clientX - rect.left;
                mousePos.y = e.clientY - rect.top;
            });
            hero.addEventListener('mouseleave', function() {
                mousePos.x = -1000; mousePos.y = -1000;
            });
            function presize() { cv.width = hero.offsetWidth; cv.height = hero.offsetHeight; }
            function mkpt() {
                return { x: Math.random() * cv.width, y: Math.random() * cv.height,
                         vx: (Math.random() - .5) * .5, vy: (Math.random() - .5) * .5,
                         r: Math.random() * 2 + 1, a: Math.random() * .6 + .2 };
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

                    // Mouse repulsion / connection glow
                    var mdx = p.x - mousePos.x, mdy = p.y - mousePos.y;
                    var mdist = Math.sqrt(mdx * mdx + mdy * mdy);
                    if (mdist < 120) {
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(mousePos.x, mousePos.y);
                        ctx.strokeStyle = 'rgba(0, 210, 255, ' + (0.4 * (1 - mdist / 120)) + ')';
                        ctx.lineWidth = 1;
                        ctx.stroke();
                    }

                    ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                    ctx.fillStyle = 'rgba(0, 210, 255,' + p.a + ')'; ctx.fill();
                });
                for (var a = 0; a < pts.length; a++) {
                    for (var b = a + 1; b < pts.length; b++) {
                        var ddx = pts[a].x - pts[b].x, ddy = pts[a].y - pts[b].y;
                        var dd  = Math.sqrt(ddx * ddx + ddy * ddy);
                        if (dd < 110) {
                            ctx.beginPath(); ctx.moveTo(pts[a].x, pts[a].y); ctx.lineTo(pts[b].x, pts[b].y);
                            ctx.strokeStyle = 'rgba(126,112,255,' + (.2 * (1 - dd / 110)) + ')';
                            ctx.lineWidth = .7; ctx.stroke();
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
            '.project-card','.page-card','.feature-card','.focus-card','.stat-card',
            '.neo-card','.polaroid-frame','.about-photo-wrapper','.education-card','.experience-card',
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
        var TILT_SEL = '.project-card, .page-card, .feature-card, .focus-card, .neo-card, .polaroid-frame, .stat-card, .about-photo-card, .education-card, .experience-card, .contact-card-container';
        document.addEventListener('mousemove', function (e) {
            qa(TILT_SEL).forEach(function (card) {
                var r = card.getBoundingClientRect();
                if (e.clientX < r.left - 20 || e.clientX > r.right  + 20 ||
                    e.clientY < r.top  - 20 || e.clientY > r.bottom + 20) {
                    card.style.transform  = 'perspective(900px) rotateX(0) rotateY(0) scale(1)';
                    card.style.transition = 'transform 450ms ease';
                    return;
                }
                var cx = (e.clientX - r.left) / r.width  - .5;
                var cy = (e.clientY - r.top)  / r.height - .5;
                card.style.transform  = 'perspective(900px) rotateX(' + (cy * -9) + 'deg) rotateY(' + (cx * 9) + 'deg) scale(1.025)';
                card.style.transition = 'transform 80ms cubic-bezier(.1,.5,.2,1)';
            });
        }, { passive: true });
        qa(TILT_SEL).forEach(function (c) {
            c.addEventListener('mouseleave', function () {
                c.style.transform  = 'perspective(900px) rotateX(0) rotateY(0) scale(1)';
                c.style.transition = 'transform 450ms cubic-bezier(.22,.61,.36,1)';
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

    /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
       17. PORTFOLIO PROJECT CATEGORY FILTER
    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
    window.filterProjects = function (cat, btn) {
        var btns = document.querySelectorAll('.filter-btn');
        for (var i = 0; i < btns.length; i++) {
            btns[i].classList.remove('active');
        }
        if (btn) btn.classList.add('active');

        var cards = document.querySelectorAll('.project-card');
        for (var j = 0; j < cards.length; j++) {
            var card = cards[j];
            var rawCat = card.getAttribute('data-category') || '';
            var categories = rawCat.split(' ');
            if (cat === 'all' || categories.indexOf(cat) !== -1) {
                card.style.display = 'flex';
                card.style.opacity = '1';
                card.style.transform = 'scale(1)';
                card.classList.remove('filter-hide');
            } else {
                card.style.display = 'none';
                card.style.opacity = '0';
                card.style.transform = 'scale(0.95)';
                card.classList.add('filter-hide');
            }
        }
    };

    /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
       18. LIVE INTERACTIVE DIRECT SEARCH ENGINE
    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
    var SEARCH_DB = [
        // Projects
        { keywords: ['bukit', 'penganten', 'wisata'], title: 'Website Bukit Penganten', type: 'Proyek Web', url: 'pages/projects/bukit-penganten.html', desc: 'Website informasi destinasi wisata' },
        { keywords: ['flower', 'bunga', 'e-commerce', 'ecommerce', 'toko'], title: 'E-Commerce Flower Shop', type: 'Proyek Web', url: 'pages/projects/ecommerce-flower.html', desc: 'Tampilan e-commerce toko bunga' },
        { keywords: ['portofolio', 'portfolio', 'web indah', 'profil web'], title: 'Website Portofolio', type: 'Proyek Web', url: 'pages/projects/website-portofolio.html', desc: 'Website digital perangkum karya Indah' },
        { keywords: ['kopi', 'kedai', 'coffee', 'cafe'], title: 'Website Kedai Kopi', type: 'Proyek Web', url: 'pages/projects/website-kedai-kopi.html', desc: 'Website kedai kopi nuansa hangat' },
        { keywords: ['agripos', 'agri', 'pertanian', 'ritel', 'stok'], title: 'AGRI-POS Pertanian', type: 'App & Sistem', url: 'pages/projects/agripos.html', desc: 'Manajemen ritel & stok hasil pertanian' },
        { keywords: ['posfy', 'kasir', 'sistem kasir', 'transaksi'], title: 'UI/UX Sistem Kasir Posfy', type: 'App & Sistem', url: 'pages/projects/posfy.html', desc: 'Alur kasir & transaksi intuitif' },
        { keywords: ['eksbum', 'wisata eksbum', 'ux eksbum'], title: 'UI/UX Destinasi Wisata EKSBUM', type: 'Desain & UI/UX', url: 'pages/projects/eksbum.html', desc: 'Rancangan promosi & eksplorasi wisata' },
        { keywords: ['ukm', 'manajemen ukm', 'umkm'], title: 'UI/UX Platform Manajemen UKM', type: 'Desain & UI/UX', url: 'pages/projects/ukm-terpadu.html', desc: 'Platform terpadu kelola kebutuhan UKM' },
        
        // Pages
        { keywords: ['about', 'tentang', 'profil', 'biografi', 'indah'], title: 'About Me (Tentang Indah)', type: 'Halaman', url: 'about.html', desc: 'Profil, latar belakang, dan keahlian' },
        { keywords: ['education', 'pendidikan', 'edukasi', 'upb', 'kuliah', 'kampus'], title: 'Education (Pendidikan)', type: 'Halaman', url: 'education.html', desc: 'Riwayat pendidikan & pencapaian' },
        { keywords: ['experience', 'pengalaman', 'karir', 'organisasi'], title: 'Experience (Pengalaman)', type: 'Halaman', url: 'experience.html', desc: 'Pengalaman kerja & organisasi' },
        { keywords: ['contact', 'kontak', 'hubungi', 'email', 'wa', 'whatsapp', 'telepon'], title: 'Contact (Hubungi Saya)', type: 'Halaman', url: 'contact.html', desc: 'Kirim pesan, WhatsApp, Email' },
        { keywords: ['sertifikat', 'certificate', 'piagam', 'penghargaan'], title: 'Certificates (Sertifikat)', type: 'Halaman', url: 'portfolio.html', desc: 'Lihat koleksi sertifikat & piagam' },
        { keywords: ['tech', 'stack', 'skill', 'keahlian', 'html', 'css', 'javascript', 'figma', 'git'], title: 'Tech Stack (Keahlian)', type: 'Halaman', url: 'portfolio-techstack.html', desc: 'Tools & bahasa pemrograman' },

        // Categories
        { keywords: ['website', 'web'], title: 'Lihat Semua Proyek Website', type: 'Kategori', url: 'portfolio-projects.html?cat=website', desc: '4 Proyek Website Interaktif' },
        { keywords: ['desain', 'design', 'figma'], title: 'Lihat Semua Desain & UI/UX', type: 'Kategori', url: 'portfolio-projects.html?cat=desain', desc: 'Rancangan Antarmuka & Wireframe' },
        { keywords: ['uiux', 'ui/ux', 'ui', 'ux'], title: 'Lihat Semua Proyek UI/UX', type: 'Kategori', url: 'portfolio-projects.html?cat=uiux', desc: 'Desain Pengalaman Pengguna' },
        { keywords: ['app', 'sistem', 'aplikasi'], title: 'Lihat Semua Aplikasi & Sistem', type: 'Kategori', url: 'portfolio-projects.html?cat=app', desc: 'Aplikasi Web & Sistem Dashboard' }
    ];

    function getBaseUrl() {
        return window.location.pathname.indexOf('/pages/') !== -1 ? '../../' : '';
    }

    function executeDirectSearch(qStr) {
        var query = (qStr || '').trim().toLowerCase();
        if (!query) return;

        // 1. Check exact or high match in database
        var bestMatch = null;
        for (var i = 0; i < SEARCH_DB.length; i++) {
            var item = SEARCH_DB[i];
            for (var k = 0; k < item.keywords.length; k++) {
                if (item.keywords[k] === query || (query.length > 2 && item.keywords[k].includes(query))) {
                    bestMatch = item;
                    break;
                }
            }
            if (bestMatch) break;
        }

        if (bestMatch) {
            window.location.href = getBaseUrl() + bestMatch.url;
        } else {
            window.location.href = getBaseUrl() + 'portfolio-projects.html?q=' + encodeURIComponent(query);
        }
    }

    // Attach search handlers to inputs and search pills
    qa('.search-pill').forEach(function (pill) {
        var input = pill.querySelector('input');
        var btn   = pill.querySelector('.search-btn');
        if (!input) return;

        // Ensure relative position for dropdown
        if (getComputedStyle(pill).position === 'static') pill.style.position = 'relative';

        // Dropdown container
        var drop = document.createElement('div');
        drop.className = 'search-dropdown-menu';
        drop.style.cssText =
            'position:absolute;top:calc(100% + 10px);left:0;right:0;background:rgba(8,18,52,0.96);' +
            'border:1px solid rgba(0,210,255,0.35);border-radius:18px;backdrop-filter:blur(16px);' +
            'box-shadow:0 18px 45px rgba(0,0,0,0.7), 0 0 25px rgba(0,210,255,0.15);' +
            'z-index:99999;max-height:360px;overflow-y:auto;display:none;padding:10px 0;';
        pill.appendChild(drop);

        function renderMatches(val) {
            var qVal = (val || '').trim().toLowerCase();
            if (!qVal || qVal.length < 1) {
                drop.style.display = 'none';
                drop.innerHTML = '';
                return;
            }

            var matches = SEARCH_DB.filter(function (item) {
                if (item.title.toLowerCase().includes(qVal) || item.desc.toLowerCase().includes(qVal)) return true;
                return item.keywords.some(function (k) { return k.includes(qVal); });
            });

            if (!matches.length) {
                drop.innerHTML = '<div style="padding:16px 20px;font-size:0.88rem;color:rgba(255,255,255,0.6);text-align:center;">' +
                    'Tekan <strong style="color:#00d2ff;">Enter</strong> untuk mencari "<strong>' + qVal + '</strong>" di halaman proyek</div>';
                drop.style.display = 'block';
                return;
            }

            var html = '';
            matches.slice(0, 6).forEach(function (item) {
                var targetUrl = getBaseUrl() + item.url;
                html += '<a href="' + targetUrl + '" class="search-drop-item" style="' +
                    'display:flex;align-items:center;justify-content:space-between;padding:12px 20px;' +
                    'text-decoration:none;border-bottom:1px solid rgba(255,255,255,0.05);transition:background 0.2s ease;">' +
                    '<div style="text-align:left;">' +
                        '<div style="font-weight:700;font-size:0.93rem;color:#ffffff;">' + item.title + '</div>' +
                        '<div style="font-size:0.78rem;color:rgba(255,255,255,0.6);margin-top:2px;">' + item.desc + '</div>' +
                    '</div>' +
                    '<span style="font-size:0.72rem;font-weight:700;padding:3px 10px;border-radius:999px;background:rgba(0,210,255,0.12);color:#00d2ff;border:1px solid rgba(0,210,255,0.25);white-space:nowrap;margin-left:12px;">' +
                        item.type +
                    '</span>' +
                '</a>';
            });
            drop.innerHTML = html;
            drop.style.display = 'block';

            // Hover effects on dropdown items
            qa('.search-drop-item', drop).forEach(function (a) {
                a.addEventListener('mouseenter', function () { a.style.background = 'rgba(0,210,255,0.12)'; });
                a.addEventListener('mouseleave', function () { a.style.background = 'transparent'; });
            });
        }

        var isProjectsPage = window.location.pathname.indexOf('portfolio-projects.html') !== -1;

        input.addEventListener('input', function () {
            if (!isProjectsPage) renderMatches(input.value);
        });

        input.addEventListener('focus', function () {
            if (!isProjectsPage && input.value.trim()) renderMatches(input.value);
        });

        input.addEventListener('keydown', function (e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                drop.style.display = 'none';
                executeDirectSearch(input.value);
            }
        });

        if (btn) {
            btn.addEventListener('click', function (e) {
                e.preventDefault();
                drop.style.display = 'none';
                executeDirectSearch(input.value);
            });
        }

        document.addEventListener('click', function (e) {
            if (!pill.contains(e.target)) drop.style.display = 'none';
        });
    });

    // Auto-filter on portfolio-projects.html when URL contains ?q= or ?cat=
    if (window.location.pathname.indexOf('portfolio-projects.html') !== -1) {
        var params = new URLSearchParams(window.location.search);
        var qParam = params.get('q') || '';
        var catParam = params.get('cat') || '';

        if (catParam) {
            var catBtn = q('.filter-btn[data-filter="' + catParam + '"]');
            if (catBtn) window.filterProjects(catParam, catBtn);
        } else if (qParam) {
            var projInput = document.getElementById('projectSearchInput');
            if (projInput) projInput.value = qParam;

            var cards = qa('.project-card');
            var qLower = qParam.toLowerCase();
            cards.forEach(function (card) {
                var text = card.textContent.toLowerCase();
                if (text.includes(qLower)) {
                    card.style.display = 'flex';
                    card.style.opacity = '1';
                    card.style.transform = 'scale(1)';
                } else {
                    card.style.display = 'none';
                }
            });
        }

        var projInput = document.getElementById('projectSearchInput');
        if (projInput) {
            projInput.addEventListener('input', function () {
                var val = projInput.value.trim().toLowerCase();
                qa('.project-card').forEach(function (card) {
                    var text = card.textContent.toLowerCase();
                    if (!val || text.includes(val)) {
                        card.style.display = 'flex';
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        }
    }

    /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
       19. CV DOWNLOAD HANDLER WITH HELPER NOTICE
    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
    qa('.btn-cv').forEach(function (btn) {
        btn.addEventListener('click', function (e) {
            var href = btn.getAttribute('href');
            fetch(href, { method: 'HEAD' }).then(function (res) {
                if (!res.ok) {
                    showCvNotice();
                }
            }).catch(function () {
                showCvNotice();
            });
        });
    });

    function showCvNotice() {
        var modal = document.createElement('div');
        modal.style.cssText =
            'position:fixed;inset:0;background:rgba(5,12,38,0.85);backdrop-filter:blur(10px);' +
            'z-index:999999;display:flex;align-items:center;justify-content:center;padding:20px;';
        modal.innerHTML =
            '<div style="background:rgba(12,24,62,0.95);border:1px solid rgba(0,210,255,0.4);padding:30px;' +
            'border-radius:24px;max-width:480px;text-align:center;box-shadow:0 20px 60px rgba(0,0,0,0.6);">' +
                '<div style="font-size:2rem;margin-bottom:10px;">📄</div>' +
                '<h3 style="color:#ffffff;font-size:1.3rem;margin-bottom:10px;">Tombol CV Siap Digunakan!</h3>' +
                '<p style="color:#b2c2ea;font-size:0.92rem;line-height:1.5;margin-bottom:20px;">' +
                    'Silakan simpan file PDF CV Anda dengan nama <strong style="color:#00d2ff;">CV_Indah_Ruwahna.pdf</strong> di dalam folder <strong style="color:#00d2ff;">assets/</strong>.<br><br>' +
                    'Setelah ditaruh di folder <code>assets/CV_Indah_Ruwahna.pdf</code>, tombol ini akan mengunduh CV Anda secara otomatis!' +
                '</p>' +
                '<button type="button" class="btn-cv-close" style="background:#00d2ff;color:#050c26;border:0;padding:10px 24px;' +
                'border-radius:999px;font-weight:700;cursor:pointer;font-size:0.9rem;">Siap, Mengerti!</button>' +
            '</div>';
        document.body.appendChild(modal);
        modal.querySelector('.btn-cv-close').addEventListener('click', function () {
            if (modal.parentNode) modal.parentNode.removeChild(modal);
        });
        modal.addEventListener('click', function (e) {
            if (e.target === modal && modal.parentNode) modal.parentNode.removeChild(modal);
        });
    }

})();