function escapeHtml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
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

export function renderNewsPage() {
  const section = document.createElement('section');
  section.className = 'legal-page-shell';
  section.id = 'news-page';

  const posts = readStoredNewsPosts();
  const postsMarkup = posts.length
    ? posts.map((post) => {
        const story = post.story ? `<p>${escapeHtml(post.story)}</p>` : '';
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
    : `
      <article class="legal-section">
        <h2>No stories yet</h2>
        <p>School news posts will appear here once they are added from the admin panel.</p>
      </article>
    `;

  section.innerHTML = `
    <div class="container legal-card">
      <div class="standalone-topbar">
        <a href="../home/" class="button button--secondary standalone-back" target="_self">Back</a>
      </div>
      <p class="eyebrow">School updates</p>
      <h1>Latest News and Updates</h1>
      <p class="legal-intro">Stay informed with school achievements, community stories, events, and announcements.</p>
      <div class="legal-list">
        ${postsMarkup}
      </div>
    </div>
  `;

  return section;
}
