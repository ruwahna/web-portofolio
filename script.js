(function () {
    var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var MOTION = {
        overlayFade: 220,
        overlayScale: 260,
        revealDuration: 420,
        revealOffset: 14,
        groupGap: 70,
        itemGap: 30
    };
    var canHover = window.matchMedia && window.matchMedia('(hover: hover)').matches;

    function getBasePath() {
        return window.location.pathname.indexOf('/pages/') !== -1 ? '../../' : '';
    }

    function resolveImagePath(path) {
        if (!path) {
            return getBasePath() + 'assets/piagam.jpg';
        }

        if (path.indexOf('http://') === 0 || path.indexOf('https://') === 0 || path.indexOf('data:') === 0) {
            return path;
        }

        if (path.indexOf('../../') === 0 || path.indexOf('../') === 0) {
            return path;
        }

        if (path.indexOf('assets/') === 0) {
            return getBasePath() + path;
        }

        return getBasePath() + 'assets/' + path.replace(/^\/?/, '');
    }

    function animateIn(element, delay) {
        if (!element || element.dataset.revealed === '1') {
            return;
        }

        element.dataset.revealed = '1';

        if (reduceMotion) {
            element.style.opacity = '1';
            element.style.transform = 'none';
            return;
        }

        element.style.opacity = '0';
        element.style.transform = 'translateY(' + MOTION.revealOffset + 'px)';

        if (element.animate) {
            element.animate(
                [
                    { opacity: 0, transform: 'translateY(' + MOTION.revealOffset + 'px)' },
                    { opacity: 1, transform: 'translateY(0)' }
                ],
                {
                    duration: MOTION.revealDuration,
                    delay: delay,
                    easing: 'cubic-bezier(0.22, 0.61, 0.36, 1)',
                    fill: 'forwards'
                }
            );
            return;
        }

        element.style.transition =
            'opacity ' + MOTION.revealDuration + 'ms cubic-bezier(0.22, 0.61, 0.36, 1), ' +
            'transform ' + MOTION.revealDuration + 'ms cubic-bezier(0.22, 0.61, 0.36, 1)';

        setTimeout(function () {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, delay);
    }

    function observeReveal(elements, baseDelay) {
        var list = Array.prototype.slice.call(elements || []).filter(Boolean);
        if (!list.length) {
            return;
        }

        if (reduceMotion) {
            list.forEach(function (el, index) {
                animateIn(el, baseDelay + index * MOTION.itemGap);
            });
            return;
        }

        list.forEach(function (el) {
            el.style.opacity = '0';
            el.style.transform = 'translateY(' + MOTION.revealOffset + 'px)';
        });

        requestAnimationFrame(function () {
            list.forEach(function (el, index) {
                animateIn(el, baseDelay + index * MOTION.itemGap);
            });
        });
    }

    function addInteractiveLift(elements, liftY, shadow) {
        if (reduceMotion) {
            return;
        }

        Array.prototype.slice.call(elements || []).forEach(function (element) {
            if (!element || element.dataset.interactiveLift === '1') {
                return;
            }

            element.dataset.interactiveLift = '1';
            var existingTransition = element.style.transition || '';
            var hoverTransition = 'transform 180ms ease, box-shadow 180ms ease';
            element.style.transition = existingTransition ? (existingTransition + ', ' + hoverTransition) : hoverTransition;

            function active() {
                element.style.transform = 'translateY(' + liftY + 'px)';
                if (shadow) {
                    element.style.boxShadow = shadow;
                }
            }

            function reset() {
                element.style.transform = '';
                if (shadow) {
                    element.style.boxShadow = '';
                }
            }

            if (canHover) {
                element.addEventListener('mouseenter', active);
                element.addEventListener('mouseleave', reset);
            }
            element.addEventListener('focus', active);
            element.addEventListener('blur', reset);
            element.addEventListener('touchstart', active, { passive: true });
            element.addEventListener('touchend', reset, { passive: true });
        });
    }

    function initPageIntroAnimation() {
        if (reduceMotion || !document.body) {
            return;
        }

        document.body.style.opacity = '0';
        document.body.style.transform = 'translateY(10px)';
        document.body.style.transition = 'opacity 420ms ease, transform 420ms ease';

        requestAnimationFrame(function () {
            document.body.style.opacity = '1';
            document.body.style.transform = 'translateY(0)';
        });
    }

    function createOverlay(imageSrc, imageAlt) {
        var overlay = document.createElement('div');
        overlay.style.position = 'fixed';
        overlay.style.inset = '0';
        overlay.style.background = 'rgba(0, 0, 0, 0.92)';
        overlay.style.display = 'flex';
        overlay.style.alignItems = 'center';
        overlay.style.justifyContent = 'center';
        overlay.style.padding = '24px';
        overlay.style.zIndex = '9999';
        overlay.style.cursor = 'zoom-out';
        overlay.style.opacity = '0';
        overlay.style.transition = 'opacity ' + MOTION.overlayFade + 'ms ease';

        var closeButton = document.createElement('button');
        closeButton.type = 'button';
        closeButton.textContent = 'Tutup';
        closeButton.style.position = 'fixed';
        closeButton.style.top = '18px';
        closeButton.style.right = '18px';
        closeButton.style.border = '0';
        closeButton.style.borderRadius = '8px';
        closeButton.style.padding = '10px 16px';
        closeButton.style.fontWeight = '700';
        closeButton.style.background = '#4a5aa0';
        closeButton.style.color = '#fff';
        closeButton.style.cursor = 'pointer';

        var img = document.createElement('img');
        img.src = resolveImagePath(imageSrc);
        img.alt = imageAlt || 'Certificate preview';
        img.style.maxWidth = 'min(92vw, 1200px)';
        img.style.maxHeight = '90vh';
        img.style.width = 'auto';
        img.style.height = 'auto';
        img.style.objectFit = 'contain';
        img.style.boxShadow = '0 18px 50px rgba(0,0,0,0.45)';
        img.style.borderRadius = '10px';
        img.style.background = '#fff';
        img.style.cursor = 'default';
        img.style.transform = 'scale(0.95)';
        img.style.transition = 'transform ' + MOTION.overlayScale + 'ms cubic-bezier(0.22, 0.61, 0.36, 1)';

        function closeOverlay() {
            if (!overlay || !overlay.parentNode) {
                return;
            }

            overlay.style.opacity = '0';
            img.style.transform = 'scale(0.95)';
            setTimeout(function () {
                if (overlay && overlay.parentNode) {
                    overlay.parentNode.removeChild(overlay);
                }
            }, reduceMotion ? 0 : 180);

            document.removeEventListener('keydown', onKeyDown);
        }

        function onKeyDown(event) {
            if (event.key === 'Escape') {
                closeOverlay();
            }
        }

        overlay.appendChild(img);
        overlay.appendChild(closeButton);
        document.body.appendChild(overlay);

        if (!reduceMotion) {
            requestAnimationFrame(function () {
                overlay.style.opacity = '1';
                img.style.transform = 'scale(1)';
            });
        } else {
            overlay.style.opacity = '1';
            img.style.transform = 'scale(1)';
        }

        overlay.addEventListener('click', function (event) {
            if (event.target === overlay) {
                closeOverlay();
            }
        });

        closeButton.addEventListener('click', closeOverlay);
        document.addEventListener('keydown', onKeyDown);
    }

    function initCertificateViewer() {
        var imageNode = document.getElementById('certificateImage');
        var closeBtn = document.getElementById('closeViewerBtn');
        if (!imageNode || !closeBtn) {
            return;
        }

        var params = new URLSearchParams(window.location.search);
        var imgParam = params.get('img') || 'assets/piagam.jpg';
        var backParam = params.get('back') || (window.location.pathname.indexOf('/pages/') !== -1 ? '../../portfolio.html' : 'portfolio.html');

        imageNode.src = resolveImagePath(imgParam);

        closeBtn.addEventListener('click', function () {
            if (window.history.length > 1) {
                window.history.back();
                return;
            }
            window.location.href = backParam;
        });
    }

    function initCertificatePageZoom() {
        document.querySelectorAll('.cert-zoomable').forEach(function (image) {
            image.addEventListener('click', function () {
                createOverlay(image.getAttribute('data-full') || image.src, image.alt);
            });
        });

        document.querySelectorAll('.project-actions.cert-actions a[href*="certificate-viewer"]').forEach(function (link) {
            link.addEventListener('click', function (event) {
                event.preventDefault();
                var href = new URL(link.href, window.location.href);
                var image = href.searchParams.get('img');
                if (!image) {
                    return;
                }

                createOverlay(image, link.textContent.trim());
            });
        });
    }

    function initGlobalPageAnimations() {
        var group1 = document.querySelectorAll('nav, .project-detail-breadcrumb, .portfolio-tabs, .hero-text > h1, .hero-text > h2, .hero-intro, .page-title, .cert-more-title');
        var group2 = document.querySelectorAll('.hero-text > p, .portfolio-showcase > p, .page-text, .project-detail-copy > p, .detail-actions-row, .hero-actions');
        var group3 = document.querySelectorAll('.hero-image, .project-card, .page-card, .project-preview, .feature-card, .project-detail-shell');
        var group4 = document.querySelectorAll('.feature-card li, .tech-tags span, .project-actions a, .btn, .tab, .detail-back');

        observeReveal(group1, 20);
        observeReveal(group2, 20 + MOTION.groupGap);
        observeReveal(group3, 20 + MOTION.groupGap * 2);
        observeReveal(group4, 20 + MOTION.groupGap * 3);

        addInteractiveLift(document.querySelectorAll('.project-card, .page-card, .feature-card'), -3, '0 14px 28px rgba(0, 0, 0, 0.28)');
        addInteractiveLift(document.querySelectorAll('.btn, .project-actions a, .tab, .detail-back, nav a, .tech-tags span'), -2, '');
        addInteractiveLift(document.querySelectorAll('.project-thumb img, .preview-image, .hero-image img, .cert-zoomable'), -1, '');
    }

    initPageIntroAnimation();
    initCertificateViewer();
    initCertificatePageZoom();
    initGlobalPageAnimations();
})();