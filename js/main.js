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
  var sections = ['about', 'business', 'blog', 'contact']
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

  // 本文はシンプルな Markdown 風テキスト（空行区切り = 段落、"## " = 見出し）を想定
  function renderMarkdown(md) {
    return md.split(/\n\n+/).map(function (block) {
      block = block.trim();
      if (block.indexOf('## ') === 0) {
        return '<h2>' + escapeHtml(block.slice(3).trim()) + '</h2>';
      }
      return '<p>' + escapeHtml(block).replace(/\n/g, ' ') + '</p>';
    }).join('\n');
  }

  function buildBlogCardHTML(post, categories, index, basePath) {
    var thumbVariant = (index % 3) + 1;
    var label = categoryLabel(categories, post.category);
    var articleUrl = basePath + 'article.html?slug=' + encodeURIComponent(post.slug);
    var categoryUrl = basePath + 'index.html?category=' + encodeURIComponent(post.category);
    return (
      '<article class="blog-card" data-category="' + post.category + '">' +
        '<a href="' + articleUrl + '" class="blog-card-link">' +
          '<div class="blog-thumb blog-thumb--0' + thumbVariant + '" aria-hidden="true"></div>' +
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
          return buildBlogCardHTML(post, data.categories, i, 'blog/');
        }).join('');
      })
      .catch(function () {
        blogPreviewGrid.innerHTML = '<p class="blog-empty">記事を読み込めませんでした。</p>';
      });
  }

  /* ---------- Blog listing page (render + keyword/category search + calendar) ---------- */
  var blogListGrid = document.getElementById('blog-grid');
  if (blogListGrid && document.getElementById('blog-search-keyword')) {
    fetch(getPostsJsonUrl())
      .then(function (res) { return res.json(); })
      .then(function (data) { initBlogListing(data.posts, data.categories); })
      .catch(function () {
        var emptyEl = document.getElementById('blog-empty');
        if (emptyEl) { emptyEl.hidden = false; emptyEl.textContent = '記事データを読み込めませんでした。'; }
      });
  }

  function initBlogListing(posts, categories) {
    var sorted = posts.slice().sort(function (a, b) { return b.date.localeCompare(a.date); });
    blogListGrid.innerHTML = sorted.map(function (post, i) {
      return buildBlogCardHTML(post, categories, i, '');
    }).join('');

    var blogKeywordInput = document.getElementById('blog-search-keyword');
    var blogClearButton = document.getElementById('blog-search-clear');
    var blogSearchStatus = document.getElementById('blog-search-status');
    var blogEmptyEl = document.getElementById('blog-empty');
    var blogCards = Array.prototype.slice.call(blogListGrid.querySelectorAll('.blog-card'));
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

      if (blogEmptyEl) blogEmptyEl.hidden = visibleCount !== 0;

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

        document.getElementById('article-eyebrow').textContent = slugToEyebrow(post.category);
        document.getElementById('article-title').textContent = post.title;

        var dateEl = document.getElementById('article-date');
        dateEl.setAttribute('datetime', post.date);
        dateEl.textContent = formatDateDots(post.date);

        var catLink = document.getElementById('article-category-link');
        catLink.textContent = categoryLabel(data.categories, post.category);
        catLink.setAttribute('href', 'index.html?category=' + encodeURIComponent(post.category));

        articleContentEl.innerHTML = renderMarkdown(post.body);
      })
      .catch(function () {
        document.getElementById('article-title').textContent = '記事を読み込めませんでした';
        var notFoundEl = document.getElementById('article-not-found');
        if (notFoundEl) { notFoundEl.hidden = false; notFoundEl.textContent = '時間をおいて再度お試しください。'; }
      });
  }
})();
