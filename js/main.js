(function () {
  'use strict';

  /* ---------- Header: scrolled state ---------- */
  var header = document.getElementById('site-header');
  var backToTop = document.getElementById('back-to-top');

  function onScroll() {
    var scrolled = window.scrollY > 20;
    header.classList.toggle('is-scrolled', scrolled);
    backToTop.classList.toggle('is-visible', window.scrollY > 400);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  backToTop.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ---------- QR code modal ---------- */
  var qrModal = document.getElementById('qr-modal');
  if (qrModal) {
    var qrModalImage = document.getElementById('qr-modal-image');
    var qrModalLabel = document.getElementById('qr-modal-label');
    var qrModalLink = document.getElementById('qr-modal-link');
    var qrTriggers = document.querySelectorAll('[data-qr-image]');
    var qrLastFocused = null;

    function openQrModal(trigger) {
      qrModalImage.setAttribute('src', trigger.getAttribute('data-qr-image'));
      qrModalImage.setAttribute('alt', trigger.getAttribute('data-qr-label') + 'のQRコード');
      qrModalLabel.textContent = trigger.getAttribute('data-qr-label');
      qrModalLink.setAttribute('href', trigger.getAttribute('data-qr-link'));
      qrLastFocused = trigger;
      qrModal.hidden = false;
      document.body.style.overflow = 'hidden';
      qrModal.querySelector('.qr-modal-close').focus();
    }

    function closeQrModal() {
      qrModal.hidden = true;
      document.body.style.overflow = '';
      if (qrLastFocused) qrLastFocused.focus();
    }

    qrTriggers.forEach(function (trigger) {
      trigger.addEventListener('click', function () {
        var isMobile = window.matchMedia('(max-width: 720px)').matches;
        if (isMobile && trigger.getAttribute('data-mobile-direct') === 'true') {
          // モバイルではQRコードを自分の端末で読み取っても意味がないため、
          // アプリ（インストール済みの場合）またはブラウザで直接リンク先を開く
          window.location.href = trigger.getAttribute('data-qr-link');
          return;
        }
        openQrModal(trigger);
      });
    });

    qrModal.querySelectorAll('[data-qr-close]').forEach(function (el) {
      el.addEventListener('click', closeQrModal);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !qrModal.hidden) closeQrModal();
    });
  }

  /* ---------- Contact form modal ---------- */
  var contactModal = document.getElementById('contact-modal');
  if (contactModal) {
    var contactOpenBtn = document.getElementById('contact-open-btn');
    var contactLastFocused = null;

    function openContactModal() {
      contactLastFocused = document.activeElement;
      contactModal.hidden = false;
      document.body.style.overflow = 'hidden';
      var firstField = document.getElementById('name');
      if (firstField) firstField.focus();
    }

    function closeContactModal() {
      contactModal.hidden = true;
      document.body.style.overflow = '';
      if (contactLastFocused) contactLastFocused.focus();
    }

    if (contactOpenBtn) {
      contactOpenBtn.addEventListener('click', openContactModal);
    }

    contactModal.querySelectorAll('[data-contact-close]').forEach(function (el) {
      el.addEventListener('click', closeContactModal);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !contactModal.hidden) closeContactModal();
    });

    // ハッシュリンク（#contact など）でも開けるようにする
    document.querySelectorAll('a[href="#contact"], a[href$="#contact"]').forEach(function (link) {
      link.addEventListener('click', function () {
        if (document.getElementById('contact')) openContactModal();
      });
    });
  }

  /* ---------- App description modal (community page) ---------- */
  var appDescModal = document.getElementById('app-desc-modal');
  if (appDescModal) {
    var appDescModalTitle = document.getElementById('app-desc-modal-title');
    var appDescModalBody = document.getElementById('app-desc-modal-body');
    var appDescLastFocused = null;

    var openAppDescModal = function (title, description) {
      appDescModalTitle.textContent = title || 'アプリの説明';
      appDescModalBody.innerHTML = (description || '').split('\n')
        .filter(function (line) { return line.trim(); })
        .map(function (line) { return '<p>' + escapeHtml(line) + '</p>'; })
        .join('');
      appDescLastFocused = document.activeElement;
      appDescModal.hidden = false;
      document.body.style.overflow = 'hidden';
      appDescModal.querySelector('.contact-modal-close').focus();
    };

    function closeAppDescModal() {
      appDescModal.hidden = true;
      document.body.style.overflow = '';
      if (appDescLastFocused) appDescLastFocused.focus();
    }

    appDescModal.querySelectorAll('[data-app-desc-close]').forEach(function (el) {
      el.addEventListener('click', closeAppDescModal);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !appDescModal.hidden) closeAppDescModal();
    });
  }

  /* ---------- Mobile nav toggle ---------- */
  var navToggle = document.getElementById('nav-toggle');
  var nav = document.getElementById('nav');
  var navOverlay = document.getElementById('nav-overlay');
  var navLinks = nav.querySelectorAll('.nav-link');

  function openNav() {
    nav.classList.add('is-open');
    navToggle.classList.add('is-open');
    navOverlay.classList.add('is-visible');
    navToggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeNav() {
    nav.classList.remove('is-open');
    navToggle.classList.remove('is-open');
    navOverlay.classList.remove('is-visible');
    navToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  navToggle.addEventListener('click', function () {
    if (nav.classList.contains('is-open')) {
      closeNav();
    } else {
      openNav();
    }
  });

  navOverlay.addEventListener('click', closeNav);
  navLinks.forEach(function (link) {
    link.addEventListener('click', closeNav);
  });

  window.addEventListener('resize', function () {
    if (window.innerWidth > 720) closeNav();
  });

  /* ---------- Active nav link on scroll ---------- */
  var sections = ['news', 'about', 'business', 'blog', 'contact']
    .map(function (id) { return document.getElementById(id); })
    .filter(Boolean);

  function updateActiveLink() {
    var scrollPos = window.scrollY + window.innerHeight / 3;
    var currentId = null;

    sections.forEach(function (section) {
      if (section.offsetTop <= scrollPos) {
        currentId = section.id;
      }
    });

    navLinks.forEach(function (link) {
      var isActive = currentId && link.getAttribute('href') === '#' + currentId;
      link.classList.toggle('is-active', !!isActive);
    });
  }
  window.addEventListener('scroll', updateActiveLink, { passive: true });
  updateActiveLink();

  /* ---------- Contact form: validation + Web3Forms submission ---------- */
  // https://web3forms.com で sangmedica@gmail.com を登録して取得したアクセスキーに置き換えてください。
  var WEB3FORMS_ACCESS_KEY = '39dffe79-0949-4f21-9d7a-34a161423b03';

  var form = document.getElementById('contact-form');
  var status = document.getElementById('form-status');
  var submitButton = form ? form.querySelector('button[type="submit"]') : null;

  function setError(field, message) {
    var errorEl = form.querySelector('[data-error-for="' + field.name + '"]');
    if (errorEl) errorEl.textContent = message || '';
    field.classList.toggle('is-invalid', !!message);
  }

  function validateField(field) {
    if (field.hasAttribute('required') && !field.value.trim()) {
      setError(field, '入力してください。');
      return false;
    }
    if (field.type === 'email' && field.value.trim()) {
      var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(field.value.trim())) {
        setError(field, 'メールアドレスの形式が正しくありません。');
        return false;
      }
    }
    setError(field, '');
    return true;
  }

  if (form) {
    ['name', 'email', 'message'].forEach(function (fieldName) {
      var field = form.elements[fieldName];
      if (field) {
        field.addEventListener('blur', function () { validateField(field); });
      }
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      // ハニーポット：ボットが自動入力した場合は送信せず、成功したように見せて処理を終える
      var honeypot = form.elements['website'];
      if (honeypot && honeypot.value.trim() !== '') {
        status.textContent = '送信しました。担当者より折り返しご連絡いたします。';
        status.classList.add('is-success');
        form.reset();
        if (contactModal) {
          setTimeout(function () {
            contactModal.hidden = true;
            document.body.style.overflow = '';
            status.textContent = '';
            status.classList.remove('is-success');
          }, 2200);
        }
        return;
      }

      var requiredFields = ['name', 'email', 'message'].map(function (n) { return form.elements[n]; });
      var isValid = requiredFields.reduce(function (acc, field) {
        return validateField(field) && acc;
      }, true);

      if (!isValid) {
        status.textContent = '入力内容をご確認ください。';
        status.classList.remove('is-success');
        return;
      }

      if (WEB3FORMS_ACCESS_KEY === 'YOUR_WEB3FORMS_ACCESS_KEY') {
        status.textContent = '送信設定が未完了です。web3forms.com で取得したアクセスキーを js/main.js に設定してください。';
        status.classList.remove('is-success');
        return;
      }

      var nameValue = form.elements['name'].value.trim();
      var companyValue = form.elements['company'].value.trim();
      var emailValue = form.elements['email'].value.trim();
      var subjectValue = form.elements['subject'].value.trim() || 'お問い合わせ';
      var messageValue = form.elements['message'].value.trim();

      // 箇条書き形式に整形したうえで送信する
      var formattedMessage = [
        '・お名前: ' + nameValue,
        '・会社名: ' + (companyValue || '(未入力)'),
        '・メールアドレス: ' + emailValue,
        '・件名: ' + subjectValue,
        '',
        '■お問い合わせ内容',
        messageValue
      ].join('\n');

      if (submitButton) submitButton.disabled = true;
      status.textContent = '送信しています…';
      status.classList.remove('is-success');

      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          access_key: WEB3FORMS_ACCESS_KEY,
          subject: '【SANGMEDICA株式会社 サイトお問い合わせ】' + subjectValue,
          from_name: nameValue,
          email: emailValue,
          message: formattedMessage
        })
      })
        .then(function (res) { return res.json(); })
        .then(function (data) {
          if (data.success) {
            status.textContent = '送信しました。担当者より折り返しご連絡いたします。';
            status.classList.add('is-success');
            form.reset();
            if (contactModal) {
              setTimeout(function () {
                contactModal.hidden = true;
                document.body.style.overflow = '';
                status.textContent = '';
                status.classList.remove('is-success');
              }, 2200);
            }
          } else {
            status.textContent = '送信に失敗しました。時間をおいて再度お試しください。';
            status.classList.remove('is-success');
          }
        })
        .catch(function () {
          status.textContent = '通信エラーが発生しました。時間をおいて再度お試しください。';
          status.classList.remove('is-success');
        })
        .finally(function () {
          if (submitButton) submitButton.disabled = false;
        });
    });
  }

  /* ---------- Blog data helpers ---------- */
  function getPostsJsonUrl() {
    return window.location.pathname.indexOf('/blog/') !== -1 ? 'posts.json' : 'blog/posts.json';
  }

  function escapeHtml(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function formatDateDots(dateStr) {
    return dateStr.split('-').join('.');
  }

  function slugToEyebrow(slug) {
    return slug.replace(/-/g, ' ').toUpperCase();
  }

  function categoryLabel(categories, slug) {
    var found = categories.filter(function (c) { return c.slug === slug; })[0];
    return found ? found.label : slug;
  }

  // インライン記法: [文字](URL) をリンクに変換（前段で escapeHtml 済みのテキストに対して行う）
  function renderInlineMarkdown(text) {
    return escapeHtml(text).replace(/\[([^\]]+)\]\(([^)]+)\)/g, function (m, label, url) {
      return '<a href="' + url + '">' + label + '</a>';
    });
  }

  // 本文はシンプルな Markdown 風テキスト（空行区切り = 段落、"## " = 見出し、"![alt](url)" = 画像単独ブロック）を想定
  function renderMarkdown(md) {
    return md.split(/\n\n+/).map(function (block) {
      block = block.trim();
      if (block.indexOf('## ') === 0) {
        return '<h2>' + escapeHtml(block.slice(3).trim()) + '</h2>';
      }
      var imageMatch = block.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
      if (imageMatch) {
        return '<figure class="article-figure"><img src="' + imageMatch[2] + '" alt="' + escapeHtml(imageMatch[1]) + '" loading="lazy"></figure>';
      }
      return '<p>' + renderInlineMarkdown(block).replace(/\n/g, ' ') + '</p>';
    }).join('\n');
  }

  /* ---------- Blog view counts ---------- */
  var VIEWS_ENDPOINT = '/.netlify/functions/views';

  function recordArticleView(slug) {
    fetch(VIEWS_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug: slug })
    }).catch(function () { /* 閲覧数の記録に失敗しても記事表示自体には影響させない */ });
  }

  /* ---------- Blog ratings ---------- */
  var RATE_ENDPOINT = '/.netlify/functions/rate';

  function starsForAverage(avg) {
    var n = Math.max(0, Math.min(5, Math.ceil(avg)));
    var stars = '';
    for (var i = 0; i < n; i++) stars += '⭐️';
    return stars;
  }

  function populateCardRatings() {
    var badges = document.querySelectorAll('[data-rating-slug]');
    if (!badges.length) return;
    Promise.all([
      fetch(RATE_ENDPOINT).then(function (res) { return res.json(); }).catch(function () { return {}; }),
      fetch(VIEWS_ENDPOINT).then(function (res) { return res.json(); }).catch(function () { return {}; })
    ])
      .then(function (results) {
        var ratings = results[0] || {};
        var views = results[1] || {};
        badges.forEach(function (el) {
          var slug = el.getAttribute('data-rating-slug');
          var info = ratings[slug];
          var viewCount = views[slug] || 0;
          var hasRating = info && info.count > 0;
          if (!hasRating && viewCount === 0) return;

          var textParts = [];
          var ariaParts = [];
          if (hasRating) {
            textParts.push(starsForAverage(info.average));
            ariaParts.push('評価 星' + Math.ceil(info.average) + 'つ（' + info.count + '件のレビュー）');
          }
          textParts.push(viewCount + '回閲覧');
          ariaParts.push(viewCount + '回閲覧');

          el.textContent = textParts.join(' ・ ');
          el.setAttribute('aria-label', ariaParts.join('、'));
          el.hidden = false;
        });
      })
      .catch(function () { /* 評価・閲覧数が取得できなくても記事一覧の表示は継続する */ });
  }

  function buildBlogCardHTML(post, categories, index, basePath, showLatestBadge) {
    var thumbVariant = (index % 3) + 1;
    var label = categoryLabel(categories, post.category);
    var articleUrl = basePath + 'article.html?slug=' + encodeURIComponent(post.slug);
    var categoryUrl = basePath + 'index.html?category=' + encodeURIComponent(post.category);
    var thumbHTML = post.image
      ? '<img src="' + escapeHtml(post.image) + '" alt="" class="blog-thumb blog-thumb-img" loading="lazy">'
      : '<div class="blog-thumb blog-thumb--0' + thumbVariant + '" aria-hidden="true"></div>';
    var latestBadgeHTML = showLatestBadge ? '<span class="blog-card-badge">最新記事</span>' : '';
    return (
      '<article class="blog-card" data-category="' + post.category + '">' +
        '<a href="' + articleUrl + '" class="blog-card-link">' +
          thumbHTML +
          latestBadgeHTML +
          '<span class="blog-card-rating" data-rating-slug="' + escapeHtml(post.slug) + '" hidden></span>' +
        '</a>' +
        '<div class="blog-body">' +
          '<div class="blog-meta">' +
            '<a href="' + categoryUrl + '" class="blog-tag">' + escapeHtml(label) + '</a>' +
            '<time datetime="' + post.date + '">' + formatDateDots(post.date) + '</time>' +
          '</div>' +
          '<h3><a href="' + articleUrl + '" class="blog-title-link">' + escapeHtml(post.title) + '</a></h3>' +
          '<p>' + escapeHtml(post.excerpt) + '</p>' +
        '</div>' +
      '</article>'
    );
  }

  /* ---------- News section on homepage (最新20件) ---------- */
  var newsListEl = document.getElementById('news-list');
  if (newsListEl) {
    var NEWS_CATEGORY_PALETTE = [
      { bg: '#eef2ff', text: '#4338ca' },
      { bg: '#fef3c7', text: '#92400e' },
      { bg: '#dcfce7', text: '#166534' },
      { bg: '#fee2e2', text: '#991b1b' },
      { bg: '#e0f2fe', text: '#075985' },
      { bg: '#f3e8ff', text: '#6b21a8' }
    ];

    function newsCategoryColor(slug) {
      var hash = 0;
      for (var i = 0; i < slug.length; i++) hash = (hash * 31 + slug.charCodeAt(i)) >>> 0;
      return NEWS_CATEGORY_PALETTE[hash % NEWS_CATEGORY_PALETTE.length];
    }

    Promise.all([
      fetch('news/news.json').then(function (res) { return res.json(); }),
      fetch('news/categories.json').then(function (res) { return res.json(); }).catch(function () { return { categories: [] }; })
    ])
      .then(function (results) {
        var data = results[0];
        var categories = (results[1] && results[1].categories) || [];
        var categoryLabels = {};
        categories.forEach(function (c) { categoryLabels[c.slug] = c.label; });

        var items = (data.items || [])
          .slice()
          .sort(function (a, b) { return b.date.localeCompare(a.date); })
          .slice(0, 20);

        if (items.length === 0) {
          newsListEl.innerHTML = '<p class="blog-empty">近日公開予定です。</p>';
          return;
        }

        newsListEl.innerHTML = items.map(function (item) {
          var categoryHTML = '';
          if (item.category && categoryLabels[item.category]) {
            var color = newsCategoryColor(item.category);
            categoryHTML = '<span class="news-category" style="background:' + color.bg + ';color:' + color.text + ';">' +
              escapeHtml(categoryLabels[item.category]) + '</span>';
          }
          return (
            '<div class="news-item">' +
              '<time datetime="' + item.date + '">' + formatDateDots(item.date) + '</time>' +
              categoryHTML +
              '<p>' + escapeHtml(item.title) + '</p>' +
            '</div>'
          );
        }).join('');

        // 1画面に5件表示し、残りはインナースクロールで閲覧できるようにする
        var rows = newsListEl.querySelectorAll('.news-item');
        if (rows.length > 5) {
          var visibleHeight = 0;
          for (var i = 0; i < 5; i++) { visibleHeight += rows[i].offsetHeight; }
          newsListEl.style.maxHeight = visibleHeight + 'px';
          newsListEl.classList.add('news-list--scroll');
        }
      })
      .catch(function () {
        newsListEl.innerHTML = '<p class="blog-empty">お知らせを読み込めませんでした。</p>';
      });
  }

  /* ---------- Homepage blog preview (latest 3 posts) ---------- */
  var blogPreviewGrid = document.getElementById('blog-preview-grid');
  if (blogPreviewGrid) {
    fetch('blog/posts.json')
      .then(function (res) { return res.json(); })
      .then(function (data) {
        var sorted = data.posts.slice().sort(function (a, b) { return b.date.localeCompare(a.date); });
        if (sorted.length === 0) {
          blogPreviewGrid.innerHTML = '<p class="blog-empty">近日公開予定です。</p>';
          return;
        }
        blogPreviewGrid.innerHTML = sorted.slice(0, 3).map(function (post, i) {
          return buildBlogCardHTML(post, data.categories, i, 'blog/', true);
        }).join('');
        populateCardRatings();
      })
      .catch(function () {
        blogPreviewGrid.innerHTML = '<p class="blog-empty">記事を読み込めませんでした。</p>';
      });
  }

  /* ---------- Blog listing page (評価ランキング / 閲覧数ランキング + keyword/category search + calendar) ---------- */
  var blogListGridLatest = document.getElementById('blog-grid-latest');
  var blogListGridPopular = document.getElementById('blog-grid-popular');
  if (blogListGridLatest && blogListGridPopular && document.getElementById('blog-search-keyword')) {
    Promise.all([
      fetch(getPostsJsonUrl()).then(function (res) { return res.json(); }),
      fetch(VIEWS_ENDPOINT).then(function (res) { return res.json(); }).catch(function () { return {}; }),
      fetch(RATE_ENDPOINT).then(function (res) { return res.json(); }).catch(function () { return {}; })
    ])
      .then(function (results) {
        initBlogListing(results[0].posts, results[0].categories, results[1] || {}, results[2] || {});
      })
      .catch(function () {
        var emptyEl = document.getElementById('blog-empty');
        if (emptyEl) { emptyEl.hidden = false; emptyEl.textContent = '記事データを読み込めませんでした。'; }
      });
  }

  function initBlogListing(posts, categories, viewsData, ratingsData) {
    var sorted = posts.slice().sort(function (a, b) { return b.date.localeCompare(a.date); });

    var ratingPosts = posts.slice().sort(function (a, b) {
      var ratingA = ratingsData[a.slug] ? Math.round(ratingsData[a.slug].average * 100) / 100 : 0;
      var ratingB = ratingsData[b.slug] ? Math.round(ratingsData[b.slug].average * 100) / 100 : 0;
      if (ratingB !== ratingA) return ratingB - ratingA;
      var countA = ratingsData[a.slug] ? ratingsData[a.slug].count : 0;
      var countB = ratingsData[b.slug] ? ratingsData[b.slug].count : 0;
      if (countB !== countA) return countB - countA;
      return b.date.localeCompare(a.date);
    }).slice(0, 3);
    var popularPosts = posts.slice().sort(function (a, b) {
      var viewsA = viewsData[a.slug] || 0;
      var viewsB = viewsData[b.slug] || 0;
      if (viewsB !== viewsA) return viewsB - viewsA;
      return b.date.localeCompare(a.date);
    }).slice(0, 3);

    blogListGridLatest.innerHTML = ratingPosts.length
      ? ratingPosts.map(function (post, i) { return buildBlogCardHTML(post, categories, i, ''); }).join('')
      : '<p class="blog-empty">近日公開予定です。</p>';

    blogListGridPopular.innerHTML = popularPosts.length
      ? popularPosts.map(function (post, i) { return buildBlogCardHTML(post, categories, i, ''); }).join('')
      : '<p class="blog-empty">近日公開予定です。</p>';

    populateCardRatings();

    var blogKeywordInput = document.getElementById('blog-search-keyword');
    var blogClearButton = document.getElementById('blog-search-clear');
    var blogSearchStatus = document.getElementById('blog-search-status');
    var blogEmptyEl = document.getElementById('blog-empty');
    var blogCards = Array.prototype.slice.call(
      document.querySelectorAll('#blog-grid-latest .blog-card, #blog-grid-popular .blog-card')
    );
    var blogCategoryPills = Array.prototype.slice.call(document.querySelectorAll('.blog-category-pill'));

    var urlParams = new URLSearchParams(window.location.search);
    var activeCategory = urlParams.get('category') || 'all';
    var activeCategoryLabel = '';

    blogCategoryPills.forEach(function (pill) {
      var isActive = pill.getAttribute('data-category') === activeCategory;
      pill.classList.toggle('is-active', isActive);
      if (isActive) activeCategoryLabel = pill.textContent.trim();
    });
    if (!activeCategoryLabel) activeCategory = 'all';

    function applyBlogFilter() {
      var keyword = blogKeywordInput.value.trim().toLowerCase();
      var visibleCount = 0;

      blogCards.forEach(function (card) {
        var text = card.textContent.toLowerCase();
        var matchesKeyword = !keyword || text.indexOf(keyword) !== -1;
        var matchesCategory = activeCategory === 'all' || card.getAttribute('data-category') === activeCategory;
        var isVisible = matchesKeyword && matchesCategory;

        card.style.display = isVisible ? '' : 'none';
        if (isVisible) visibleCount++;
      });

      if (blogEmptyEl) blogEmptyEl.hidden = sorted.length === 0 || visibleCount !== 0;

      if (blogSearchStatus) {
        var parts = [];
        if (activeCategory !== 'all') parts.push('「' + activeCategoryLabel + '」カテゴリー');
        if (keyword) parts.push('キーワード「' + blogKeywordInput.value.trim() + '」');
        blogSearchStatus.textContent = parts.length ? parts.join(' / ') + '：' + visibleCount + '件の記事が見つかりました。' : '';
      }
    }

    blogKeywordInput.addEventListener('input', applyBlogFilter);

    if (blogClearButton) {
      blogClearButton.addEventListener('click', function () {
        blogKeywordInput.value = '';
        applyBlogFilter();
      });
    }

    applyBlogFilter();

    /* ---- calendar ---- */
    var blogCalendarGrid = document.getElementById('blog-calendar-grid');
    if (!blogCalendarGrid) return;

    var calendarTitleEl = document.getElementById('blog-calendar-title');
    var calendarPrevBtn = document.getElementById('blog-calendar-prev');
    var calendarNextBtn = document.getElementById('blog-calendar-next');

    var postsByDate = {};
    sorted.forEach(function (post) {
      if (!postsByDate[post.date]) postsByDate[post.date] = [];
      postsByDate[post.date].push({
        url: 'article.html?slug=' + encodeURIComponent(post.slug),
        title: post.title
      });
    });

    function pad2(n) { return n < 10 ? '0' + n : '' + n; }

    var initialYear, initialMonth;
    var dateKeys = Object.keys(postsByDate).sort();
    if (dateKeys.length) {
      var latest = dateKeys[dateKeys.length - 1].split('-');
      initialYear = parseInt(latest[0], 10);
      initialMonth = parseInt(latest[1], 10) - 1;
    } else {
      var today = new Date();
      initialYear = today.getFullYear();
      initialMonth = today.getMonth();
    }

    var viewYear = initialYear;
    var viewMonth = initialMonth;

    function renderCalendar() {
      calendarTitleEl.textContent = viewYear + '年' + (viewMonth + 1) + '月';
      blogCalendarGrid.innerHTML = '';

      var firstWeekday = new Date(viewYear, viewMonth, 1).getDay();
      var daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

      for (var i = 0; i < firstWeekday; i++) {
        var pad = document.createElement('span');
        pad.className = 'blog-calendar-pad';
        blogCalendarGrid.appendChild(pad);
      }

      for (var day = 1; day <= daysInMonth; day++) {
        var dateKey = viewYear + '-' + pad2(viewMonth + 1) + '-' + pad2(day);
        var dayPosts = postsByDate[dateKey];

        if (dayPosts && dayPosts.length) {
          var link = document.createElement('a');
          link.href = dayPosts[0].url;
          link.className = 'blog-calendar-day has-post';
          link.textContent = day;
          link.setAttribute('aria-label', dateKey + '　' + dayPosts.map(function (p) { return p.title; }).join('、'));
          blogCalendarGrid.appendChild(link);
        } else {
          var span = document.createElement('span');
          span.className = 'blog-calendar-day';
          span.textContent = day;
          blogCalendarGrid.appendChild(span);
        }
      }
    }

    calendarPrevBtn.addEventListener('click', function () {
      viewMonth -= 1;
      if (viewMonth < 0) { viewMonth = 11; viewYear -= 1; }
      renderCalendar();
    });
    calendarNextBtn.addEventListener('click', function () {
      viewMonth += 1;
      if (viewMonth > 11) { viewMonth = 0; viewYear += 1; }
      renderCalendar();
    });

    renderCalendar();
  }

  /* ---------- Article page (renders a single post from posts.json) ---------- */
  var articleContentEl = document.getElementById('article-content');
  if (articleContentEl) {
    var articleSlug = new URLSearchParams(window.location.search).get('slug');

    fetch(getPostsJsonUrl())
      .then(function (res) { return res.json(); })
      .then(function (data) {
        var post = data.posts.filter(function (p) { return p.slug === articleSlug; })[0];
        var notFoundEl = document.getElementById('article-not-found');

        if (!post) {
          document.getElementById('article-title').textContent = '記事が見つかりませんでした';
          document.getElementById('article-eyebrow').textContent = '';
          document.querySelector('.article-meta').hidden = true;
          if (notFoundEl) notFoundEl.hidden = false;
          return;
        }

        var fullTitle = post.title + ' | SANGMEDICA株式会社';
        document.title = fullTitle;
        var descMeta = document.getElementById('article-doc-description');
        if (descMeta) descMeta.setAttribute('content', post.excerpt);

        var articleUrlAbs = 'https://sangmedica.netlify.app/blog/article.html?slug=' + encodeURIComponent(post.slug);
        [
          ['article-og-url', 'content', articleUrlAbs],
          ['article-og-title', 'content', fullTitle],
          ['article-og-description', 'content', post.excerpt],
          ['article-twitter-title', 'content', fullTitle],
          ['article-twitter-description', 'content', post.excerpt]
        ].forEach(function (item) {
          var el = document.getElementById(item[0]);
          if (el) el.setAttribute(item[1], item[2]);
        });

        var canonicalEl = document.getElementById('article-canonical');
        if (canonicalEl) canonicalEl.setAttribute('href', articleUrlAbs);

        var imageAbs = post.image ? 'https://sangmedica.netlify.app' + post.image : 'https://sangmedica.netlify.app/images/og-image.jpg';
        var ldJson = {
          '@context': 'https://schema.org',
          '@type': 'BlogPosting',
          headline: post.title,
          description: post.excerpt,
          image: imageAbs,
          datePublished: post.date,
          url: articleUrlAbs,
          mainEntityOfPage: articleUrlAbs,
          author: { '@type': 'Person', name: '喜多真也' },
          publisher: {
            '@type': 'Organization',
            name: 'SANGMEDICA株式会社',
            logo: { '@type': 'ImageObject', url: 'https://sangmedica.netlify.app/favicon/icon-180.png' }
          }
        };
        var ldScript = document.createElement('script');
        ldScript.type = 'application/ld+json';
        ldScript.textContent = JSON.stringify(ldJson);
        document.head.appendChild(ldScript);

        if (post.image) {
          var heroImgEl = document.getElementById('article-hero-bg-img');
          if (heroImgEl) heroImgEl.setAttribute('src', post.image);
          var ogImageEl = document.getElementById('article-og-image');
          if (ogImageEl) ogImageEl.setAttribute('content', 'https://sangmedica.netlify.app' + post.image);
        }

        if (post.video) {
          var videoWrapEl = document.getElementById('article-video');
          var videoEl = document.getElementById('article-video-el');
          if (videoWrapEl && videoEl) {
            videoEl.setAttribute('src', post.video);
            if (post.image) videoEl.setAttribute('poster', post.image);
            videoWrapEl.hidden = false;
          }
        }

        document.getElementById('article-eyebrow').textContent = slugToEyebrow(post.category);
        document.getElementById('article-title').textContent = post.title;

        var dateEl = document.getElementById('article-date');
        dateEl.setAttribute('datetime', post.date);
        dateEl.textContent = formatDateDots(post.date);

        var catLink = document.getElementById('article-category-link');
        catLink.textContent = categoryLabel(data.categories, post.category);
        catLink.setAttribute('href', 'index.html?category=' + encodeURIComponent(post.category));

        articleContentEl.innerHTML = renderMarkdown(post.body);

        setupArticleRating(post.slug);
        recordArticleView(post.slug);
      })
      .catch(function () {
        document.getElementById('article-title').textContent = '記事を読み込めませんでした';
        var notFoundEl = document.getElementById('article-not-found');
        if (notFoundEl) { notFoundEl.hidden = false; notFoundEl.textContent = '時間をおいて再度お試しください。'; }
      });
  }

  function setupArticleRating(slug) {
    var widget = document.getElementById('star-rating');
    var statusEl = document.getElementById('rating-status');
    var badgeEl = document.getElementById('article-rating-badge');
    if (!widget) return;

    var buttons = Array.prototype.slice.call(widget.querySelectorAll('.star-btn'));
    var storageKey = 'sangmedica_rated_' + slug;
    var alreadyRatedValue = null;
    try { alreadyRatedValue = localStorage.getItem(storageKey); } catch (e) { /* プライベートブラウズ等でlocalStorageが使えない場合は無視 */ }

    function renderAverage(avg, count) {
      if (!badgeEl) return;
      if (count > 0) {
        badgeEl.textContent = starsForAverage(avg) + '（' + count + '件）';
        badgeEl.hidden = false;
      } else {
        badgeEl.hidden = true;
      }
    }

    function paintStars(value) {
      buttons.forEach(function (btn) {
        var v = Number(btn.getAttribute('data-value'));
        btn.classList.toggle('is-active', v <= value);
      });
    }

    fetch(RATE_ENDPOINT + '?slug=' + encodeURIComponent(slug))
      .then(function (res) { return res.json(); })
      .then(function (data) { renderAverage(data.average, data.count); })
      .catch(function () { /* 平均評価が取得できなくても記事表示は継続する */ });

    if (alreadyRatedValue) {
      paintStars(Number(alreadyRatedValue));
      buttons.forEach(function (btn) { btn.disabled = true; });
      statusEl.textContent = 'すでに評価済みです（★' + alreadyRatedValue + '）。ご協力ありがとうございました。';
      return;
    }

    buttons.forEach(function (btn) {
      btn.addEventListener('mouseenter', function () { paintStars(Number(btn.getAttribute('data-value'))); });
      btn.addEventListener('mouseleave', function () { paintStars(0); });
      btn.addEventListener('focus', function () { paintStars(Number(btn.getAttribute('data-value'))); });

      btn.addEventListener('click', function () {
        var value = Number(btn.getAttribute('data-value'));
        buttons.forEach(function (b) { b.disabled = true; });
        statusEl.textContent = '送信しています…';

        fetch(RATE_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ slug: slug, rating: value })
        })
          .then(function (res) { return res.json(); })
          .then(function (data) {
            try { localStorage.setItem(storageKey, String(value)); } catch (e) { /* 保存できなくても評価自体は完了している */ }
            paintStars(value);
            statusEl.textContent = 'ご評価ありがとうございました（★' + value + '）。';
            renderAverage(data.average, data.count);
          })
          .catch(function () {
            statusEl.textContent = '送信に失敗しました。時間をおいて再度お試しください。';
            buttons.forEach(function (b) { b.disabled = false; });
          });
      });
    });
  }

  /* ---------- Community page: featured apps (public, no password) ---------- */
  var communityFeaturedEl = document.getElementById('community-featured');
  if (communityFeaturedEl) {
    fetch('community/featured.json')
      .then(function (res) { return res.json(); })
      .then(function (data) {
        var apps = (data && Array.isArray(data.apps)) ? data.apps : (data && (data.title || data.url) ? [data] : []);
        apps = apps.filter(function (app) { return app && (app.title || app.url || app.video); });
        if (!apps.length) return;

        var listEl = document.getElementById('community-featured-list');
        if (listEl) {
          listEl.innerHTML = apps.map(buildFeaturedAppCardHTML).join('');
          listEl.addEventListener('click', function (e) {
            var trigger = e.target.closest('.app-desc-trigger');
            if (!trigger) return;
            var app = apps[Number(trigger.getAttribute('data-desc-index'))];
            if (app) openAppDescModal(app.title, app.description);
          });
        }
        communityFeaturedEl.hidden = false;
      })
      .catch(function () { /* 代表アプリが取得できなくてもページ表示自体は継続する */ });
  }

  /* ---------- Community page: password保護アプリの簡易プレビュー(公開・タイトル/説明/動画のみ) ---------- */
  var communityPreviewEl = document.getElementById('community-preview');
  if (communityPreviewEl) {
    fetch('/.netlify/functions/community-preview')
      .then(function (res) { return res.json(); })
      .then(function (data) {
        var apps = (data && Array.isArray(data.apps)) ? data.apps : [];
        apps = apps.filter(function (app) { return app && (app.title || app.description || app.video); });
        if (!apps.length) return;

        var listEl = document.getElementById('community-preview-list');
        if (listEl) {
          listEl.innerHTML = apps.map(buildFeaturedAppCardHTML).join('');
          listEl.addEventListener('click', function (e) {
            var trigger = e.target.closest('.app-desc-trigger');
            if (!trigger) return;
            var app = apps[Number(trigger.getAttribute('data-desc-index'))];
            if (app) openAppDescModal(app.title, app.description);
          });
        }
        communityPreviewEl.hidden = false;
      })
      .catch(function () { /* プレビューが取得できなくてもページ表示自体は継続する */ });
  }

  function buildFeaturedAppCardHTML(app, index) {
    var videoHtml = app.video
      ? '<video controls playsinline preload="metadata" class="community-featured-video" src="' + escapeHtml(app.video) + '"></video>'
      : '';
    var links = '';
    if (app.url) {
      links += '<a href="' + escapeHtml(app.url) + '" target="_blank" rel="noopener" class="btn btn-outline-dark">' + escapeHtml(app.linkLabel || 'アプリを開く') + '</a>';
    }
    if (app.apkUrl) {
      links += '<a href="' + escapeHtml(app.apkUrl) + '" download class="btn btn-outline-dark">' + escapeHtml(app.apkLinkLabel || 'APKをダウンロード') + '</a>';
    }
    var descBtn = app.description
      ? '<button type="button" class="blog-tag app-desc-trigger" data-desc-index="' + index + '">アプリの説明</button>'
      : '';
    return (
      '<article class="community-app-card">' +
        videoHtml +
        '<h3>' + escapeHtml(app.title || '') + '</h3>' +
        descBtn +
        links +
      '</article>'
    );
  }

  /* ---------- Community page (password gate) ---------- */
  var COMMUNITY_VIEWS_ENDPOINT = '/.netlify/functions/community-views';

  var communityForm = document.getElementById('community-form');
  if (communityForm) {
    var communityPasswordInput = document.getElementById('community-password');
    var communityError = document.getElementById('community-error');
    var communityGate = document.getElementById('community-gate');
    var communityContent = document.getElementById('community-content');
    var communitySubmitBtn = communityForm.querySelector('button[type="submit"]');

    function buildCommunityAppCardHTML(app, viewsData) {
      var count = viewsData[app.slug] || 0;
      var videoHtml = app.video
        ? '<video controls playsinline preload="metadata" src="' + escapeHtml(app.video) + '"></video>'
        : '';
      var catHtml = app.category
        ? '<a href="javascript:void(0)" class="blog-tag community-app-category" data-category="' + escapeHtml(app.category) + '">' + escapeHtml(app.category) + '</a>'
        : '';
      var linkHtml = app.url
        ? '<a href="' + escapeHtml(app.url) + '" target="_blank" rel="noopener" class="btn btn-outline-dark community-app-link" data-app-slug="' + escapeHtml(app.slug || '') + '">アプリを開く</a>'
        : '';
      var descBtn = app.description
        ? '<button type="button" class="blog-tag app-desc-trigger" data-desc-slug="' + escapeHtml(app.slug || '') + '">アプリの説明</button>'
        // キーワード検索(アプリ名・説明文で検索)が引き続き説明文を対象にできるよう、
        // 非表示のまま説明文をDOMに保持しておく(textContentには残るため検索は効く)
        + '<span hidden>' + escapeHtml(app.description) + '</span>'
        : '';
      return (
        '<article class="community-app-card" data-category="' + escapeHtml(app.category || '') + '" data-slug="' + escapeHtml(app.slug || '') + '">' +
          videoHtml +
          '<div class="community-app-meta">' + catHtml + '<span class="community-app-views">' + count + '回アクセス</span></div>' +
          '<h3>' + escapeHtml(app.title || '') + '</h3>' +
          descBtn +
          linkHtml +
        '</article>'
      );
    }

    function setupCommunityFilter() {
      var keywordInput = document.getElementById('community-search-keyword');
      var clearBtn = document.getElementById('community-search-clear');
      var statusEl = document.getElementById('community-search-status');
      var emptyEl = document.getElementById('community-apps-empty');
      var categoryPills = Array.prototype.slice.call(document.querySelectorAll('#community-categories .blog-category-pill'));
      var cards = Array.prototype.slice.call(document.querySelectorAll('#community-apps .community-app-card'));
      var activeCategory = 'all';

      function setActiveCategory(category) {
        activeCategory = category;
        categoryPills.forEach(function (p) {
          p.classList.toggle('is-active', p.getAttribute('data-category') === category);
        });
        applyFilter();
      }

      function applyFilter() {
        var keyword = (keywordInput.value || '').trim().toLowerCase();
        var visibleCount = 0;
        cards.forEach(function (card) {
          var text = card.textContent.toLowerCase();
          var matchesKeyword = !keyword || text.indexOf(keyword) !== -1;
          var matchesCategory = activeCategory === 'all' || card.getAttribute('data-category') === activeCategory;
          var visible = matchesKeyword && matchesCategory;
          card.style.display = visible ? '' : 'none';
          if (visible) visibleCount++;
        });
        if (emptyEl) emptyEl.hidden = visibleCount !== 0;
        if (statusEl) {
          statusEl.textContent = (keyword || activeCategory !== 'all')
            ? visibleCount + '件のアプリが見つかりました。'
            : '';
        }
      }

      categoryPills.forEach(function (pill) {
        pill.addEventListener('click', function () {
          setActiveCategory(pill.getAttribute('data-category'));
        });
      });

      document.querySelectorAll('#community-apps .community-app-category').forEach(function (tag) {
        tag.addEventListener('click', function () {
          setActiveCategory(tag.getAttribute('data-category'));
        });
      });

      if (keywordInput) keywordInput.addEventListener('input', applyFilter);
      if (clearBtn) {
        clearBtn.addEventListener('click', function () {
          keywordInput.value = '';
          setActiveCategory('all');
        });
      }

      applyFilter();
    }

    function renderCommunityContent(data) {
      var apps = data.apps || [];

      var notionWrap = document.getElementById('community-notion');
      var notionLink = document.getElementById('community-notion-link');
      if (notionWrap && notionLink && data.notionUrl) {
        notionLink.setAttribute('href', data.notionUrl);
        notionWrap.hidden = false;
      }

      var categories = [];
      apps.forEach(function (app) {
        var c = (app.category || '').trim();
        if (c && categories.indexOf(c) === -1) categories.push(c);
      });

      var categoriesEl = document.getElementById('community-categories');
      if (categoriesEl) {
        var pillsHtml = '<p class="blog-categories-label">カテゴリー</p>' +
          '<button type="button" class="blog-category-pill is-active" data-category="all">すべて</button>' +
          categories.map(function (c) {
            return '<button type="button" class="blog-category-pill" data-category="' + escapeHtml(c) + '">' + escapeHtml(c) + '</button>';
          }).join('');
        categoriesEl.innerHTML = pillsHtml;
      }

      fetch(COMMUNITY_VIEWS_ENDPOINT)
        .then(function (res) { return res.json(); })
        .catch(function () { return {}; })
        .then(function (viewsData) {
          viewsData = viewsData || {};

          var appsGrid = document.getElementById('community-apps');
          if (appsGrid) {
            appsGrid.innerHTML = apps.length
              ? apps.map(function (app) { return buildCommunityAppCardHTML(app, viewsData); }).join('')
              : '<p class="blog-empty">現在紹介中のアプリはありません。</p>';
            appsGrid.addEventListener('click', function (e) {
              var trigger = e.target.closest('.app-desc-trigger');
              if (!trigger) return;
              var app = apps.filter(function (a) { return a.slug === trigger.getAttribute('data-desc-slug'); })[0];
              if (app) openAppDescModal(app.title, app.description);
            });
          }

          var rankingWrap = document.getElementById('community-ranking');
          var rankingList = document.getElementById('community-ranking-list');
          var ranked = apps.slice()
            .filter(function (a) { return (viewsData[a.slug] || 0) > 0; })
            .sort(function (a, b) { return (viewsData[b.slug] || 0) - (viewsData[a.slug] || 0); })
            .slice(0, 5);
          if (rankingWrap && rankingList && ranked.length) {
            rankingList.innerHTML = ranked.map(function (app, i) {
              return (
                '<div class="community-ranking-item">' +
                  '<span class="community-ranking-num">' + (i + 1) + '</span>' +
                  '<span class="community-ranking-title">' + escapeHtml(app.title || '') + '</span>' +
                  '<span class="community-ranking-count">' + (viewsData[app.slug] || 0) + '回</span>' +
                '</div>'
              );
            }).join('');
            rankingWrap.hidden = false;
          }

          document.querySelectorAll('#community-apps .community-app-link').forEach(function (link) {
            link.addEventListener('click', function () {
              var slug = link.getAttribute('data-app-slug');
              if (!slug) return;
              fetch(COMMUNITY_VIEWS_ENDPOINT, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ slug: slug })
              }).catch(function () { /* 記録に失敗してもアプリ遷移自体には影響させない */ });
            });
          });

          setupCommunityFilter();
        });
    }

    communityForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var password = communityPasswordInput.value;
      if (!password) return;

      communityError.textContent = '';
      if (communitySubmitBtn) communitySubmitBtn.disabled = true;

      fetch('/.netlify/functions/community', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: password })
      })
        .then(function (res) {
          if (res.status === 401) throw new Error('パスワードが正しくありません。');
          if (!res.ok) throw new Error('エラーが発生しました。時間をおいて再度お試しください。');
          return res.json();
        })
        .then(function (data) {
          renderCommunityContent(data);
          communityGate.hidden = true;
          communityContent.hidden = false;
        })
        .catch(function (err) {
          communityError.textContent = err.message;
        })
        .finally(function () {
          if (communitySubmitBtn) communitySubmitBtn.disabled = false;
        });
    });
  }
})();
