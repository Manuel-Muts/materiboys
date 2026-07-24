import { createOfflineNoticeMarkup, isBrowserOnline } from './network-status.js';

function escapeHtml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function sanitizeNewsStoryHtml(html = '') {
  if (!html) {
    return '';
  }

  const container = document.createElement('div');
  container.innerHTML = html;

  const allowedTags = new Set(['p', 'div', 'span', 'br', 'strong', 'b', 'em', 'i', 'u', 'ul', 'ol', 'li', 'a', 'blockquote', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6']);
  const allowedStyles = new Set(['font-weight', 'font-style', 'text-decoration', 'color', 'background-color', 'text-align', 'font-size']);

  const sanitizeNode = (node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      return;
    }

    if (node.nodeType !== Node.ELEMENT_NODE) {
      return;
    }

    const tagName = node.tagName.toLowerCase();
    if (!allowedTags.has(tagName)) {
      const fragment = document.createDocumentFragment();
      Array.from(node.childNodes).forEach((child) => fragment.appendChild(child));
      node.replaceWith(fragment);
      return;
    }

    if (tagName === 'a') {
      const href = node.getAttribute('href');
      const isSafeHref = href && /^(https?:|mailto:|tel:|\/)/i.test(href);
      if (!isSafeHref) {
        node.removeAttribute('href');
      }
      node.setAttribute('rel', 'noopener noreferrer');
      node.setAttribute('target', '_blank');
    }

    const styleAttr = node.getAttribute('style');
    if (styleAttr) {
      const sanitizedStyles = styleAttr
        .split(';')
        .map((entry) => entry.trim())
        .filter(Boolean)
        .map((entry) => {
          const [property, ...valueParts] = entry.split(':');
          const normalizedProperty = property.trim().toLowerCase();
          const value = valueParts.join(':').trim();
          if (!allowedStyles.has(normalizedProperty)) {
            return '';
          }

          const safeValue = value.replace(/javascript:/gi, '').replace(/on\w+/gi, '').trim();
          return `${normalizedProperty}: ${safeValue}`;
        })
        .filter(Boolean);

      const hasHighlight = sanitizedStyles.some((entry) => entry.toLowerCase().includes('background-color'));
      if (hasHighlight) {
        node.classList.add('news-highlight');
        const hasExplicitColor = sanitizedStyles.some((entry) => entry.toLowerCase().startsWith('color:'));
        if (!hasExplicitColor) {
          sanitizedStyles.push('color: #07111f');
        }
      }

      if (sanitizedStyles.length) {
        node.setAttribute('style', sanitizedStyles.join('; '));
      } else {
        node.removeAttribute('style');
      }
    }

    Array.from(node.attributes).forEach((attribute) => {
      const attributeName = attribute.name.toLowerCase();
      if (attributeName === 'style' || attributeName === 'href' || attributeName === 'target' || attributeName === 'rel' || attributeName === 'class') {
        return;
      }
      node.removeAttribute(attribute.name);
    });

    Array.from(node.childNodes).forEach(sanitizeNode);
  };

  Array.from(container.childNodes).forEach(sanitizeNode);
  return container.innerHTML;
}

const FIREBASE_CONFIG = {
  apiKey: 'AIzaSyBIGqZLYcDg3CR5VamDwBhtOOfl2Y0NYeI',
  authDomain: 'timotech-films.firebaseapp.com',
  projectId: 'timotech-films',
  storageBucket: 'timotech-films.firebasestorage.app',
  messagingSenderId: '563809562931',
  appId: '1:563809562931:web:750ff7e819f2d57e9dce46'
};

let firebaseDb = null;

if (window.firebase?.app && typeof window.firebase.initializeApp === 'function') {
  const hasConfig = FIREBASE_CONFIG.apiKey && FIREBASE_CONFIG.authDomain && FIREBASE_CONFIG.projectId && FIREBASE_CONFIG.appId;
  if (hasConfig) {
    try {
      const app = window.firebase.apps?.length > 0 ? window.firebase.app() : window.firebase.initializeApp(FIREBASE_CONFIG);
      firebaseDb = window.firebase.firestore(app);
    } catch (error) {
      console.warn('Firebase init in news module failed:', error);
    }
  }
}

function getAttachmentPreview(post) {
  const attachmentUrl = post.attachmentUrl || '';
  const attachmentFileName = post.attachmentFileName || 'attachment';
  const attachmentMimeType = post.attachmentMimeType || '';
  if (!attachmentUrl) {
    return '';
  }

  const safeName = escapeHtml(attachmentFileName);
  const isImage = attachmentMimeType.startsWith('image/');
  const isPdf = attachmentMimeType === 'application/pdf';
  const previewMarkup = isImage
    ? `<div style="margin-top: 1rem;"><img src="${escapeHtml(attachmentUrl)}" alt="${safeName}" style="max-width: 100%; border-radius: 12px;" /></div>`
    : isPdf
      ? `<div style="margin-top: 1rem;"><iframe src="${escapeHtml(attachmentUrl)}" title="${safeName}" loading="lazy" style="width: 100%; min-height: 420px; border: 0; border-radius: 12px;"></iframe></div>`
      : '';

  return `
    <p><a href="${escapeHtml(attachmentUrl)}" target="_blank" rel="noopener noreferrer" download="${safeName}">Open / download ${safeName}</a></p>
    ${previewMarkup}
  `;
}

function getYoutubeEmbedUrl(url = '') {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/i);
  return match ? `https://www.youtube.com/embed/${match[1]}` : '';
}

function readStoredNewsPosts() {
  try {
    return JSON.parse(window.localStorage.getItem('school-news-posts') || '[]');
  } catch (error) {
    return [];
  }
}

async function fetchNewsPostsFromFirestore() {
  if (!navigator.onLine) {
    return { posts: readStoredNewsPosts(), offline: true };
  }

  if (!firebaseDb) {
    return { posts: readStoredNewsPosts(), offline: true };
  }

  try {
    const snapshot = await firebaseDb.collection('news-posts').orderBy('createdAt', 'desc').get();
    const posts = [];
    snapshot.forEach((doc) => {
      posts.push({ ...doc.data(), id: doc.id });
    });
    return { posts: posts.length > 0 ? posts : readStoredNewsPosts(), offline: false };
  } catch (error) {
    console.warn('Firestore fetch failed, using localStorage:', error);
    return { posts: readStoredNewsPosts(), offline: true };
  }
}

export async function renderNewsPage() {
  const section = document.createElement('section');
  section.className = 'legal-page-shell';
  section.id = 'news-page';

  const { posts, offline } = await fetchNewsPostsFromFirestore();
  const postsMarkup = posts.length
    ? posts.map((post) => {
        const story = post.story ? `<div class="news-story-content">${sanitizeNewsStoryHtml(post.story)}</div>` : '';
        const attachment = getAttachmentPreview(post);
        const youtubeEmbed = post.youtubeUrl ? getYoutubeEmbedUrl(post.youtubeUrl) : '';
        const videoMarkup = youtubeEmbed
          ? `<div class="news-video" style="margin-top: 1rem;"><iframe src="${escapeHtml(youtubeEmbed)}" title="${escapeHtml(post.title)}" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>`
          : '';

        return `
          <article class="legal-section">
            <h2>${escapeHtml(post.title || 'School news story')}</h2>
            ${story}
            ${attachment}
            ${videoMarkup}
          </article>
        `;
      }).join('')
    : offline
      ? createOfflineNoticeMarkup({
          title: 'News unavailable right now',
          message: 'We could not load the latest school news because the connection is unavailable or the feed is temporarily unreachable.'
        })
      : `
        <article class="legal-section">
          <h2>No stories yet</h2>
          <p>School news posts will appear here once they are added by the school.</p>
        </article>
      `;

  section.innerHTML = `
    <section class="legal-page">
      <div class="container legal-card">
        <div class="standalone-topbar">
          <button type="button" class="button button--secondary standalone-back">Back</button>
        </div>
        <p class="eyebrow">School updates</p>
        <h1>Latest News and Updates</h1>
        <p class="legal-intro">Stay informed with school achievements, community stories, events, and announcements.</p>
        <div class="legal-list">
          ${postsMarkup}
        </div>
      </div>
    </section>
  `;

  const backButton = section.querySelector('.standalone-back');
  if (backButton) {
    backButton.addEventListener('click', () => {
      if (window.history.length > 1) {
        window.history.back();
      } else {
        window.location.assign('../home/');
      }
    });
  }

  return section;
}
