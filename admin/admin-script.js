/**
 * admin/admin-script.js — Admin Dashboard Controller & Storage Engine
 */
(function () {
    'use strict';

    function q(s) { return document.querySelector(s); }
    function qa(s) { return Array.prototype.slice.call(document.querySelectorAll(s)); }

    /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
       STATIC / DEFAULT CONTENT REGISTRY
    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
    var DEFAULT_PROJECTS = [
        { id: 'def_p1', title: 'E-Commerce Flower Shop', badge: '📱 MOBILE & WEB SHOP', img: '../assets/e-commerce flower shop.png', desc: 'Desain antarmuka toko bunga berbasis aplikasi seluler dan web shop dengan fokus visual produk menawan.', isDefault: true },
        { id: 'def_p2', title: 'Website Bukit Penganten', badge: '🌐 WEBSITE PROYEK', img: '../assets/website wisata bukit penganten .png', desc: 'Website informasi destinasi wisata dengan tampilan antarmuka yang bersih, responsif, dan interaktif.', isDefault: true },
        { id: 'def_p3', title: 'Website Kedai Kopi Minimalis', badge: '🌐 KEDAI KOPI', img: '../assets/web kopi.png', desc: 'Desain antarmuka kedai kopi bernuansa hangat dengan penataan menu favorit yang menonjol.', isDefault: true },
        { id: 'def_p4', title: 'AGRI-POS: Manajemen Ritel', badge: '⚙️ RITEL PERTANIAN', img: '../assets/pos pertanian.png', desc: 'Sistem inventarisasi dan pencatatan hasil ritel pertanian dalam bentuk dashboard terstruktur.', isDefault: true },
        { id: 'def_p5', title: 'UI/UX Sistem Kasir POS (Posfy)', badge: '⚙️ SISTEM KASIR', img: '../assets/pos kasir.png', desc: 'Rancangan antarmuka aplikasi mesin kasir serbaguna dengan tombol cepat (quick action).', isDefault: true },
        { id: 'def_p6', title: 'UX/UI Destinasi Wisata EKSBUM', badge: '🎨 UI/UX DESIGN', img: '../assets/ux eksbum.png', desc: 'Desain aplikasi eksplorasi destinasi wisata lokal dengan peta interaktif dan ulasan tempat.', isDefault: true },
        { id: 'def_p7', title: 'UX/UI Platform Manajemen UKM', badge: '🎨 FIGMA PROTOTYPE', img: '../assets/ukm.png', desc: 'Rancangan platform digital terpadu untuk pelaku Usaha Kecil Menengah yang informatif.', isDefault: true },
        { id: 'def_p8', title: 'Website Portofolio Indah', badge: '🌐 PERSONAL WEB', img: '../assets/portofolio.png', desc: 'Pengembangan website portofolio interaktif berbasis HTML, CSS, dan JavaScript modern.', isDefault: true }
    ];

    var DEFAULT_ARTICLES = [
        { id: 'def_a1', title: 'Dasar UX Writing untuk Antarmuka Digital', tag: '✍️ UX WRITING', date: '15 Mei 2026 • 3 min read', desc: 'Menulis teks antarmuka yang singkat, jelas, dan membantu pengguna memahami langkah berikutnya tanpa kebingungan.', isDefault: true },
        { id: 'def_a2', title: 'Layout Responsif & Adaptif Modern', tag: '💻 FRONT-END DEV', date: '10 Mei 2026 • 4 min read', desc: 'Menyusun tata letak antarmuka yang tetap rapi dan fleksibel di berbagai ukuran layar perangkat tanpa membuat elemen saling bertabrakan.', isDefault: true }
    ];

    /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
       PORTFOLIO STORAGE ENGINE
    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
    var PortfolioStorage = {
        KEYS: {
            PROJECTS: 'indah_portfolio_projects',
            ARTICLES: 'indah_portfolio_articles'
        },
        getProjects: function () {
            try {
                var data = localStorage.getItem(this.KEYS.PROJECTS);
                return data ? JSON.parse(data) : [];
            } catch (e) { return []; }
        },
        saveProjects: function (projects) {
            localStorage.setItem(this.KEYS.PROJECTS, JSON.stringify(projects));
        },
        getArticles: function () {
            try {
                var data = localStorage.getItem(this.KEYS.ARTICLES);
                return data ? JSON.parse(data) : [];
            } catch (e) { return []; }
        },
        saveArticles: function (articles) {
            localStorage.setItem(this.KEYS.ARTICLES, JSON.stringify(articles));
        },
        addProject: function (proj) {
            var list = this.getProjects();
            proj.id = 'proj_' + Date.now();
            proj.createdAt = new Date().toISOString();
            list.unshift(proj);
            this.saveProjects(list);
            return proj;
        },
        updateProject: function (id, updatedProj) {
            var list = this.getProjects();
            for (var i = 0; i < list.length; i++) {
                if (list[i].id === id) {
                    updatedProj.id = id;
                    updatedProj.createdAt = list[i].createdAt;
                    list[i] = updatedProj;
                    break;
                }
            }
            this.saveProjects(list);
        },
        deleteProject: function (id) {
            var list = this.getProjects().filter(function (p) { return p.id !== id; });
            this.saveProjects(list);
        },
        addArticle: function (art) {
            var list = this.getArticles();
            art.id = 'art_' + Date.now();
            art.createdAt = new Date().toISOString();
            list.unshift(art);
            this.saveArticles(list);
            return art;
        },
        updateArticle: function (id, updatedArt) {
            var list = this.getArticles();
            for (var i = 0; i < list.length; i++) {
                if (list[i].id === id) {
                    updatedArt.id = id;
                    updatedArt.createdAt = list[i].createdAt;
                    list[i] = updatedArt;
                    break;
                }
            }
            this.saveArticles(list);
        },
        deleteArticle: function (id) {
            var list = this.getArticles().filter(function (a) { return a.id !== id; });
            this.saveArticles(list);
        }
    };

    /* Expose globally for sharing if needed */
    window.PortfolioStorage = PortfolioStorage;

    /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
       ADMIN CONTROLLER
    ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
    var PASSCODE = 'admin123';
    var activeImageSrc = '';

    function showToast(msg) {
        var toast = q('#adminToast');
        var msgEl = q('#adminToastMsg');
        if (!toast || !msgEl) return;
        msgEl.textContent = msg;
        toast.classList.add('show');
        setTimeout(function () {
            toast.classList.remove('show');
        }, 3000);
    }

    var overlay = q('#adminLoginOverlay');
    var mainContent = q('#adminMainContent');
    var loginForm = q('#adminLoginForm');
    var passInput = q('#adminPasscode');
    var errorMsg = q('#loginErrorMsg');

    function checkAuth() {
        var isAuth = sessionStorage.getItem('indah_admin_auth') === 'true';
        if (isAuth) {
            if (overlay) overlay.style.display = 'none';
            if (mainContent) mainContent.style.display = 'flex';
            refreshAdminStats();
            refreshManageLists();
        } else {
            if (overlay) overlay.style.display = 'flex';
            if (mainContent) mainContent.style.display = 'none';
        }
    }

    if (loginForm) {
        loginForm.addEventListener('submit', function (e) {
            e.preventDefault();
            if (passInput.value === PASSCODE) {
                sessionStorage.setItem('indah_admin_auth', 'true');
                errorMsg.style.display = 'none';
                checkAuth();
                showToast('Selamat datang kembali, Indah! 👋');
            } else {
                errorMsg.style.display = 'block';
            }
        });
    }

    // Logout Handlers
    function handleLogout() {
        sessionStorage.removeItem('indah_admin_auth');
        closeSidebar();
        checkAuth();
    }

    var logoutBtn = q('#adminLogoutBtn');
    var mobileLogoutBtn = q('#mobileLogoutBtn');
    if (logoutBtn) logoutBtn.addEventListener('click', handleLogout);
    if (mobileLogoutBtn) mobileLogoutBtn.addEventListener('click', handleLogout);

    // Sidebar Mobile Toggle
    var sidebarToggleBtn = q('#sidebarToggleBtn');
    var sidebarCloseBtn = q('#sidebarCloseBtn');
    var sidebarBackdrop = q('#sidebarBackdrop');
    var adminSidebar = q('#adminSidebar');

    function openSidebar() {
        if (adminSidebar) adminSidebar.classList.add('open');
        if (sidebarBackdrop) sidebarBackdrop.classList.add('open');
        document.body.style.overflow = 'hidden';
    }

    function closeSidebar() {
        if (adminSidebar) adminSidebar.classList.remove('open');
        if (sidebarBackdrop) sidebarBackdrop.classList.remove('open');
        document.body.style.overflow = '';
    }

    if (sidebarToggleBtn) sidebarToggleBtn.addEventListener('click', openSidebar);
    if (sidebarCloseBtn) sidebarCloseBtn.addEventListener('click', closeSidebar);
    if (sidebarBackdrop) sidebarBackdrop.addEventListener('click', closeSidebar);

    checkAuth();

    // Tabs Switcher
    qa('.admin-tab-btn').forEach(function (btn) {
        btn.addEventListener('click', function () {
            var targetId = btn.getAttribute('data-target');
            qa('.admin-tab-btn').forEach(function (b) { b.classList.remove('active'); });
            qa('.admin-tab-content').forEach(function (c) { c.classList.remove('active'); });
            btn.classList.add('active');
            var targetContent = q('#' + targetId);
            if (targetContent) targetContent.classList.add('active');
            closeSidebar();
        });
    });

    // Image Upload Mode
    var btnModeFile = q('#btnModeFile');
    var btnModeUrl = q('#btnModeUrl');
    var boxModeFile = q('#boxModeFile');
    var boxModeUrl = q('#boxModeUrl');
    var projFileInput = q('#projFile');
    var projUrlInput = q('#projUrl');
    var projImgPreviewBox = q('#projImgPreviewBox');
    var projImgPreview = q('#projImgPreview');

    if (btnModeFile && btnModeUrl) {
        btnModeFile.addEventListener('click', function () {
            btnModeFile.classList.add('active');
            btnModeUrl.classList.remove('active');
            boxModeFile.style.display = 'block';
            boxModeUrl.style.display = 'none';
        });

        btnModeUrl.addEventListener('click', function () {
            btnModeUrl.classList.add('active');
            btnModeFile.classList.remove('active');
            boxModeFile.style.display = 'none';
            boxModeUrl.style.display = 'block';
        });
    }

    if (projFileInput) {
        projFileInput.addEventListener('change', function () {
            var file = projFileInput.files[0];
            if (file) {
                var reader = new FileReader();
                reader.onload = function (e) {
                    activeImageSrc = e.target.result;
                    projImgPreview.src = activeImageSrc;
                    projImgPreviewBox.style.display = 'flex';
                };
                reader.readAsDataURL(file);
            }
        });
    }

    if (projUrlInput) {
        projUrlInput.addEventListener('input', function () {
            activeImageSrc = projUrlInput.value.trim();
            if (activeImageSrc) {
                projImgPreview.src = activeImageSrc;
                projImgPreviewBox.style.display = 'flex';
            } else {
                projImgPreviewBox.style.display = 'none';
            }
        });
    }

    // Submit Project Form
    var formAddProject = q('#formAddProject');
    if (formAddProject) {
        formAddProject.addEventListener('submit', function (e) {
            e.preventDefault();
            var editId = q('#editProjectId').value;
            var title = q('#projTitle').value.trim();
            var badge = q('#projBadge').value;
            var desc = q('#projDesc').value.trim();
            var demoUrl = q('#projDemoUrl').value.trim();
            var detailUrl = q('#projDetailUrl').value.trim();

            var imgSrc = activeImageSrc || 'assets/e-commerce flower shop.png';

            var projData = {
                title: title,
                badge: badge,
                img: imgSrc,
                desc: desc,
                demoUrl: demoUrl,
                detailUrl: detailUrl
            };

            if (editId) {
                PortfolioStorage.updateProject(editId, projData);
                showToast('Proyek berhasil diperbarui! ✏️');
            } else {
                PortfolioStorage.addProject(projData);
                showToast('Proyek baru berhasil dipublikasikan! 🚀');
            }

            formAddProject.reset();
            q('#editProjectId').value = '';
            activeImageSrc = '';
            projImgPreviewBox.style.display = 'none';
            q('#btnSubmitProject').textContent = '✨ Simpan & Publikasikan Proyek';
            q('#btnCancelEditProject').style.display = 'none';

            refreshAdminStats();
            refreshManageLists();
        });
    }

    q('#btnCancelEditProject')?.addEventListener('click', function () {
        formAddProject.reset();
        q('#editProjectId').value = '';
        activeImageSrc = '';
        projImgPreviewBox.style.display = 'none';
        q('#btnSubmitProject').textContent = '✨ Simpan & Publikasikan Proyek';
        q('#btnCancelEditProject').style.display = 'none';
    });

    // Submit Article Form
    var formAddArticle = q('#formAddArticle');
    if (formAddArticle) {
        formAddArticle.addEventListener('submit', function (e) {
            e.preventDefault();
            var editId = q('#editArticleId').value;
            var title = q('#artTitle').value.trim();
            var tag = q('#artTag').value;
            var date = q('#artDate').value.trim();
            var readTime = q('#artReadTime').value.trim();
            var desc = q('#artDesc').value.trim();
            var detailUrl = q('#artDetailUrl').value.trim();

            var artData = {
                title: title,
                tag: tag,
                date: date,
                readTime: readTime,
                desc: desc,
                detailUrl: detailUrl
            };

            if (editId) {
                PortfolioStorage.updateArticle(editId, artData);
                showToast('Artikel berhasil diperbarui! ✏️');
            } else {
                PortfolioStorage.addArticle(artData);
                showToast('Artikel baru berhasil dipublikasikan! ✍️');
            }

            formAddArticle.reset();
            q('#editArticleId').value = '';
            q('#btnSubmitArticle').textContent = '✨ Simpan & Publikasikan Artikel';
            q('#btnCancelEditArticle').style.display = 'none';

            refreshAdminStats();
            refreshManageLists();
        });
    }

    q('#btnCancelEditArticle')?.addEventListener('click', function () {
        formAddArticle.reset();
        q('#editArticleId').value = '';
        q('#btnSubmitArticle').textContent = '✨ Simpan & Publikasikan Artikel';
        q('#btnCancelEditArticle').style.display = 'none';
    });

    // Animated Number Counter Helper
    function updateStatNumber(elementId, targetValue) {
        var el = q('#' + elementId);
        if (!el) return;
        var startValue = parseInt(el.textContent, 10) || 0;
        if (startValue === targetValue) {
            el.textContent = targetValue;
            return;
        }

        // Add pulse animation
        el.classList.add('pulse');
        setTimeout(function () { el.classList.remove('pulse'); }, 400);

        var duration = 400; // ms
        var startTime = null;

        function step(timestamp) {
            if (!startTime) startTime = timestamp;
            var progress = Math.min((timestamp - startTime) / duration, 1);
            var current = Math.floor(progress * (targetValue - startValue) + startValue);
            el.textContent = current;
            if (progress < 1) {
                requestAnimationFrame(step);
            } else {
                el.textContent = targetValue;
            }
        }
        requestAnimationFrame(step);
    }

    // Stats Counter Refresh
    function refreshAdminStats() {
        var customProjects = PortfolioStorage.getProjects();
        var customArticles = PortfolioStorage.getArticles();
        var pCount = DEFAULT_PROJECTS.length + customProjects.length;
        var aCount = DEFAULT_ARTICLES.length + customArticles.length;
        var totalCount = pCount + aCount;

        // Animated Counters
        updateStatNumber('statProjectsCount', pCount);
        updateStatNumber('statArticlesCount', aCount);
        updateStatNumber('statTotalCount', totalCount);

        // Update Subtexts & Badges
        if (q('#statProjectsDetail')) {
            q('#statProjectsDetail').textContent = DEFAULT_PROJECTS.length + ' Bawaan' + (customProjects.length > 0 ? ' + ' + customProjects.length + ' Upload Custom' : ' Website Live');
        }
        if (q('#statArticlesDetail')) {
            q('#statArticlesDetail').textContent = DEFAULT_ARTICLES.length + ' Bawaan' + (customArticles.length > 0 ? ' + ' + customArticles.length + ' Upload Custom' : ' Website Live');
        }
        if (q('#statTotalDetail')) {
            q('#statTotalDetail').textContent = pCount + ' Proyek + ' + aCount + ' Artikel Live';
        }
        if (q('#badgeTotalManage')) {
            q('#badgeTotalManage').textContent = totalCount;
        }
        if (q('#countProjList')) {
            q('#countProjList').textContent = pCount;
        }
        if (q('#countArtList')) {
            q('#countArtList').textContent = aCount;
        }
    }

    // Refresh Manage Lists
    function refreshManageLists() {
        var projContainer = q('#uploadedProjectsContainer');
        var artContainer = q('#uploadedArticlesContainer');

        if (projContainer) {
            var customProjects = PortfolioStorage.getProjects();
            projContainer.innerHTML = '';

            // Render Custom Uploaded Projects
            customProjects.forEach(function (p) {
                var card = document.createElement('div');
                card.className = 'admin-card-item';
                card.innerHTML =
                    '<div class="admin-card-thumb">' +
                        '<img src="' + (p.img || '../assets/e-commerce flower shop.png') + '" alt="' + p.title + '">' +
                    '</div>' +
                    '<div class="admin-card-body">' +
                        '<div style="display:flex;justify-content:space-between;align-items:center;">' +
                            '<span class="admin-card-badge">' + p.badge + '</span>' +
                            '<span style="font-size:0.68rem;font-weight:700;color:#2563eb;background:#eff6ff;padding:2px 6px;border-radius:4px;">🚀 UPLOAD CUSTOM</span>' +
                        '</div>' +
                        '<div class="admin-card-title">' + p.title + '</div>' +
                        '<div class="admin-card-desc">' + p.desc + '</div>' +
                        '<div class="admin-card-actions">' +
                            '<button class="admin-btn-secondary btn-edit-proj" data-id="' + p.id + '" style="padding:6px 12px;font-size:0.8rem;">✏️ Edit</button>' +
                            '<button class="admin-btn-danger-sm btn-del-proj" data-id="' + p.id + '">🗑️ Hapus</button>' +
                        '</div>' +
                    '</div>';
                projContainer.appendChild(card);
            });

            // Render Default Built-in Projects
            DEFAULT_PROJECTS.forEach(function (p) {
                var card = document.createElement('div');
                card.className = 'admin-card-item';
                card.style.opacity = '0.92';
                card.innerHTML =
                    '<div class="admin-card-thumb">' +
                        '<img src="' + p.img + '" alt="' + p.title + '">' +
                    '</div>' +
                    '<div class="admin-card-body">' +
                        '<div style="display:flex;justify-content:space-between;align-items:center;">' +
                            '<span class="admin-card-badge">' + p.badge + '</span>' +
                            '<span style="font-size:0.68rem;font-weight:700;color:#475569;background:#f1f5f9;padding:2px 6px;border-radius:4px;">📌 BAWAAN WEBSITE</span>' +
                        '</div>' +
                        '<div class="admin-card-title">' + p.title + '</div>' +
                        '<div class="admin-card-desc">' + p.desc + '</div>' +
                        '<div class="admin-card-actions">' +
                            '<span style="font-size:0.78rem;color:#64748b;font-weight:600;padding:6px 0;">✅ Proyek Statis Website</span>' +
                        '</div>' +
                    '</div>';
                projContainer.appendChild(card);
            });
        }

        if (artContainer) {
            var customArticles = PortfolioStorage.getArticles();
            artContainer.innerHTML = '';

            // Render Custom Uploaded Articles
            customArticles.forEach(function (a) {
                var item = document.createElement('div');
                item.className = 'admin-list-item';
                item.innerHTML =
                    '<div class="admin-list-info">' +
                        '<div style="display:flex;gap:8px;align-items:center;">' +
                            '<span class="admin-list-tag">' + a.tag + '</span>' +
                            '<span style="font-size:0.68rem;font-weight:700;color:#2563eb;background:#eff6ff;padding:2px 6px;border-radius:4px;">🚀 UPLOAD CUSTOM</span>' +
                        '</div>' +
                        '<div class="admin-list-title">' + a.title + '</div>' +
                        '<div class="admin-list-meta">' + a.date + ' • ' + a.readTime + '</div>' +
                    '</div>' +
                    '<div style="display:flex;gap:8px;">' +
                        '<button class="admin-btn-secondary btn-edit-art" data-id="' + a.id + '" style="padding:6px 12px;font-size:0.8rem;">✏️ Edit</button>' +
                        '<button class="admin-btn-danger-sm btn-del-art" data-id="' + a.id + '">🗑️ Hapus</button>' +
                    '</div>';
                artContainer.appendChild(item);
            });

            // Render Default Built-in Articles
            DEFAULT_ARTICLES.forEach(function (a) {
                var item = document.createElement('div');
                item.className = 'admin-list-item';
                item.style.opacity = '0.92';
                item.innerHTML =
                    '<div class="admin-list-info">' +
                        '<div style="display:flex;gap:8px;align-items:center;">' +
                            '<span class="admin-list-tag">' + a.tag + '</span>' +
                            '<span style="font-size:0.68rem;font-weight:700;color:#475569;background:#f1f5f9;padding:2px 6px;border-radius:4px;">📌 BAWAAN WEBSITE</span>' +
                        '</div>' +
                        '<div class="admin-list-title">' + a.title + '</div>' +
                        '<div class="admin-list-meta">' + a.date + '</div>' +
                    '</div>' +
                    '<div style="display:flex;gap:8px;">' +
                        '<span style="font-size:0.78rem;color:#64748b;font-weight:600;">✅ Artikel Statis</span>' +
                    '</div>';
                artContainer.appendChild(item);
            });
        }

        // Bind Action Buttons
        qa('.btn-del-proj').forEach(function (b) {
            b.addEventListener('click', function () {
                var id = b.getAttribute('data-id');
                if (confirm('Yakin ingin menghapus proyek ini?')) {
                    PortfolioStorage.deleteProject(id);
                    showToast('Proyek berhasil dihapus 🗑️');
                    refreshAdminStats();
                    refreshManageLists();
                }
            });
        });

        qa('.btn-edit-proj').forEach(function (b) {
            b.addEventListener('click', function () {
                var id = b.getAttribute('data-id');
                var projects = PortfolioStorage.getProjects();
                var p = projects.find(function (x) { return x.id === id; });
                if (p) {
                    q('#editProjectId').value = p.id;
                    q('#projTitle').value = p.title;
                    q('#projBadge').value = p.badge;
                    q('#projDesc').value = p.desc;
                    q('#projDemoUrl').value = p.demoUrl || '';
                    q('#projDetailUrl').value = p.detailUrl || '';
                    activeImageSrc = p.img || '';
                    if (activeImageSrc) {
                        projImgPreview.src = activeImageSrc;
                        projImgPreviewBox.style.display = 'flex';
                    }
                    q('#btnSubmitProject').textContent = '💾 Simpan Perubahan Proyek';
                    q('#btnCancelEditProject').style.display = 'inline-block';
                    q('[data-target="tabUploadProject"]').click();
                }
            });
        });

        qa('.btn-del-art').forEach(function (b) {
            b.addEventListener('click', function () {
                var id = b.getAttribute('data-id');
                if (confirm('Yakin ingin menghapus artikel ini?')) {
                    PortfolioStorage.deleteArticle(id);
                    showToast('Artikel berhasil dihapus 🗑️');
                    refreshAdminStats();
                    refreshManageLists();
                }
            });
        });

        qa('.btn-edit-art').forEach(function (b) {
            b.addEventListener('click', function () {
                var id = b.getAttribute('data-id');
                var articles = PortfolioStorage.getArticles();
                var a = articles.find(function (x) { return x.id === id; });
                if (a) {
                    q('#editArticleId').value = a.id;
                    q('#artTitle').value = a.title;
                    q('#artTag').value = a.tag;
                    q('#artDate').value = a.date;
                    q('#artReadTime').value = a.readTime;
                    q('#artDesc').value = a.desc;
                    q('#artDetailUrl').value = a.detailUrl || '';
                    q('#btnSubmitArticle').textContent = '💾 Simpan Perubahan Artikel';
                    q('#btnCancelEditArticle').style.display = 'inline-block';
                    q('[data-target="tabUploadArticle"]').click();
                }
            });
        });
    }

    // Export Backup JSON
    var btnExport = q('#btnExportJSON');
    if (btnExport) {
        btnExport.addEventListener('click', function () {
            var backup = {
                projects: PortfolioStorage.getProjects(),
                articles: PortfolioStorage.getArticles(),
                exportedAt: new Date().toISOString()
            };
            var jsonStr = JSON.stringify(backup, null, 2);
            var blob = new Blob([jsonStr], { type: 'application/json' });
            var url = URL.createObjectURL(blob);
            var a = document.createElement('a');
            a.href = url;
            a.download = 'indah_portfolio_backup_' + new Date().toISOString().slice(0, 10) + '.json';
            a.click();
            URL.revokeObjectURL(url);
            showToast('File backup JSON berhasil diunduh! 💾');
        });
    }

    // Import Restore JSON
    var btnTriggerImport = q('#btnTriggerImportJSON');
    var importFile = q('#importJSONFile');
    if (btnTriggerImport && importFile) {
        btnTriggerImport.addEventListener('click', function () {
            importFile.click();
        });
        importFile.addEventListener('change', function () {
            var file = importFile.files[0];
            if (file) {
                var reader = new FileReader();
                reader.onload = function (e) {
                    try {
                        var data = JSON.parse(e.target.result);
                        if (data.projects && Array.isArray(data.projects)) {
                            PortfolioStorage.saveProjects(data.projects);
                        }
                        if (data.articles && Array.isArray(data.articles)) {
                            PortfolioStorage.saveArticles(data.articles);
                        }
                        refreshAdminStats();
                        refreshManageLists();
                        showToast('Data berhasil di-import dari file JSON! 📂');
                    } catch (err) {
                        alert('Format file JSON tidak valid!');
                    }
                };
                reader.readAsText(file);
            }
        });
    }

    // Reset Data
    var btnReset = q('#btnResetData');
    if (btnReset) {
        btnReset.addEventListener('click', function () {
            if (confirm('APAKAH ANDA YAKIN? Seluruh proyek dan artikel yang diupload akan dihapus!')) {
                localStorage.removeItem(PortfolioStorage.KEYS.PROJECTS);
                localStorage.removeItem(PortfolioStorage.KEYS.ARTICLES);
                refreshAdminStats();
                refreshManageLists();
                showToast('Seluruh data upload telah direset 🗑️');
            }
        });
    }

})();
