const WHATSAPP_NUMBER = '254721272094';

const quickActions = [
  { label: 'Admissions', key: 'admissions' },
  { label: 'Academic pathways', key: 'academics' },
  { label: 'Alumni', key: 'alumni' },
  { label: 'Fees', key: 'fees' },
  { label: 'Downloads', key: 'downloads' },
  { label: 'School location', key: 'location' },
  { label: 'Contact school', key: 'contact' }
];

const responses = {
  admissions: 'Materi Boys offers Grade 10, Grade 11, and Grade 12 enrollment through the STEM, Social Sciences, and Arts & Sport Science pathways. You can begin on the admissions page and submit the application form to the school admissions team.',
  academics: 'The available pathways are STEM, Social Sciences, and Arts & Sport Science. STEM includes pure and applied science options; Social Sciences covers humanities and languages; Arts & Sport Science includes creative arts, performance, and sport activities.',
  alumni: 'The alumni page highlights former students, community events, and opportunities to stay involved or give back. It includes alumni stories, a gallery, and a way to join the alumni community.',
  fees: 'The latest fee schedule should be confirmed with the admissions office. Fees and payment details are shared with applicants on request so that families receive current information.',
  downloads: 'You can find the application form, fee schedule, interview requirements, and prospectus in the Downloads section. Some documents may be updated as they are prepared for publication.',
  location: 'Materi Boys\' Senior School is near St. Orsola Hospital in Chiakariga Subcounty, Tharaka Nithi County, approximately 6 km from Kathwana County Headquarters. Open directions in Google Maps: https://www.google.com/maps/search/?api=1&query=St.%20Orsola%20Hospital%20Chiakariga',
  contact: 'For enquiries, call 072 667 7666 or WhatsApp 254721272094. You can also email matirischool@gmail.com or matiriboys@gmail.com. Regular visiting hours are Monday to Friday, 8:00 AM to 5:00 PM.',
  fallback: 'I can help with admissions, academic pathways, fees, downloads, and school contacts. For anything else, please send your question to the school on WhatsApp.'
};

const pageContextMap = {
  home: {
    title: 'Home',
    summary: 'This is the main landing page with the school overview, admissions highlight, and links to key sections.'
  },
  about: {
    title: 'About us',
    summary: 'This page introduces the school, its values, and the community behind Materi Boys.'
  },
  academics: {
    title: 'Academics',
    summary: 'This page explains the academic pathways and subject choices available to learners.'
  },
  admissions: {
    title: 'Admissions',
    summary: 'This page covers enrollment, application steps, and the admissions process for families.'
  },
  contact: {
    title: 'Contact',
    summary: 'This page shares the school contact details, phone numbers, email addresses, and physical location.'
  },
  alumni: {
    title: 'Alumni',
    summary: 'This page highlights alumni stories and the school community through its gallery.'
  },
  facilities: {
    title: 'Facilities',
    summary: 'This page showcases the learning spaces and facilities that support student growth.'
  },
  history: {
    title: 'History',
    summary: 'This page tells the story of the school and its journey over time.'
  },
  mission: {
    title: 'Mission and vision',
    summary: 'This page shares the school mission, vision, and core values.'
  },
  staff: {
    title: 'Staff',
    summary: 'This page highlights the teachers, leaders, and staff behind the school community.'
  },
  downloads: {
    title: 'Downloads',
    summary: 'This page gives access to application documents, fee schedules, prospectuses, and interview guidance.'
  },
  privacy: {
    title: 'Privacy',
    summary: 'This page explains the school privacy policy and how information is handled.'
  },
  terms: {
    title: 'Terms',
    summary: 'This page outlines the terms of service and usage guidelines for the website.'
  }
};

function getCurrentPageContext() {
  const pathname = window.location.pathname.replace(/\/+$/, '');
  const segments = pathname.split('/').filter(Boolean);
  const lastSegment = segments[segments.length - 1] || 'home';

  if (segments.includes('downloads')) {
    return pageContextMap.downloads;
  }

  if (lastSegment && pageContextMap[lastSegment]) {
    return pageContextMap[lastSegment];
  }

  return pageContextMap.home;
}

function getPageContextFromText(text) {
  const normalized = text.toLowerCase();

  const pageMatches = [
    { keys: ['home', 'homepage', 'landing page', 'main page', 'front page'], page: 'home' },
    { keys: ['about', 'about us', 'about us page', 'who we are'], page: 'about' },
    { keys: ['academic', 'academics', 'program', 'programs', 'pathway', 'pathways'], page: 'academics' },
    { keys: ['admission', 'admissions', 'enroll', 'enrollment', 'apply', 'application'], page: 'admissions' },
    { keys: ['contact', 'contact us', 'reach us', 'get in touch'], page: 'contact' },
    { keys: ['alumni', 'old boys', 'graduates'], page: 'alumni' },
    { keys: ['facility', 'facilities', 'campus'], page: 'facilities' },
    { keys: ['history', 'our story'], page: 'history' },
    { keys: ['mission', 'vision', 'mission and vision', 'values'], page: 'mission' },
    { keys: ['staff', 'teachers', 'team'], page: 'staff' },
    { keys: ['download', 'downloads', 'documents', 'prospectus', 'fee schedule', 'interview'], page: 'downloads' },
    { keys: ['privacy', 'privacy policy'], page: 'privacy' },
    { keys: ['terms', 'terms of service', 'terms page'], page: 'terms' }
  ];

  const match = pageMatches.find((entry) => entry.keys.some((key) => normalized.includes(key)));
  return match ? pageContextMap[match.page] : null;
}

function isPageInquiry(text) {
  return /(what('|’)?s on this page|what can i find here|what is this page about|tell me about this page|what is on this page|which page am i on|where am i|show me this page|page overview|this page|what is on the .*page|tell me about the .*page|show me the .*page)/.test(text);
}

function pageContextReply(text, explicitPageContext = null) {
  const pageContext = explicitPageContext || getCurrentPageContext();
  const pageName = pageContext?.title || 'this page';

  if (text.includes('where am i') || text.includes('which page am i on')) {
    return `You are currently on the ${pageName} page.`;
  }

  return `The ${pageName} page covers ${pageContext?.summary || 'important information about Materi Boys.'}`;
}

function responseFor(message) {
  const text = message.toLowerCase().trim();

  if (isGreeting(text)) return greetingResponse(text);
  if (isFarewell(text)) return farewellResponse(text);

  const explicitPageContext = getPageContextFromText(text);
  if (explicitPageContext && (isPageInquiry(text) || /tell me about|show me|what is on/.test(text))) {
    return pageContextReply(text, explicitPageContext);
  }

  if (isPageInquiry(text)) return pageContextReply(text);

  if (text.includes('admission') || text.includes('apply') || text.includes('enrol')) return responses.admissions;
  if (text.includes('academic') || text.includes('subject') || text.includes('pathway') || text.includes('stem')) return responses.academics;
  if (text.includes('alumni') || text.includes('old boys') || text.includes('graduates')) return responses.alumni;
  if (text.includes('fee') || text.includes('cost') || text.includes('pay')) return responses.fees;
  if (text.includes('download') || text.includes('form') || text.includes('prospectus') || text.includes('interview')) return responses.downloads;
  if (text.includes('direction') || text.includes('where') || text.includes('location') || text.includes('address') || text.includes('map') || text.includes('route') || text.includes('landmark') || text.includes('get there')) return responses.location;
  if (text.includes('contact') || text.includes('phone') || text.includes('email') || text.includes('visit')) return responses.contact;

  return responses.fallback;
}

function isFarewell(text) {
  const normalized = text
    .replace(/[\p{Extended_Pictographic}\uFE0F]/gu, ' ')
    .replace(/[!?.,;:()[\]{}]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  return /^(bye|goodbye|good bye|bye bye|see you|see you later|see you soon|take care|farewell|good night|thanks|thank you|thankyou|thenks)( (for now|everyone|there|then))?$/.test(normalized);
}

function farewellResponse(text) {
  if (text.includes('good night')) {
    return 'Good night! 🌙 Thank you for visiting Materi Boys\' Senior School. Have a peaceful evening, and we\'ll be here whenever you need us. 😊';
  }

  if (text.includes('see you')) {
    return 'See you soon! 👋 Thank you for visiting Materi Boys\' Senior School. Have a wonderful day! 😊';
  }

  return 'Goodbye! 👋 Thank you for visiting Materi Boys\' Senior School. Have a wonderful day, and feel free to come back anytime. 😊';
}

function greetingResponse(text) {
  if (text.includes('good morning')) {
    return 'Good morning! 🌞 Welcome to Materi Boys\' Senior School. How can I help you today? 😊';
  }

  if (text.includes('good afternoon')) {
    return 'Good afternoon! ☀️ Welcome to Materi Boys\' Senior School. How can I help you today? 😊';
  }

  if (text.includes('good evening')) {
    return 'Good evening! 🌇 Welcome to Materi Boys\' Senior School. How can I help you today? 😊';
  }

  if (text.includes('good night')) {
    return 'Good night! 🌙 Thank you for visiting Materi Boys\' Senior School. I\'m here whenever you need information. 😊';
  }

  if (text.includes('jambo') || text.includes('habari') || text.includes('salaam')) {
    return 'Jambo! 👋 Welcome to Materi Boys\' Senior School. How may I help you today? 😊';
  }

  return 'Hello! 👋 Welcome to Materi Boys\' Senior School. I\'m happy to help you today. 😊';
}

function isGreeting(text) {
  const greetingEmojiPattern = /[👋🙋😊🙂😃😄🤗✋]/u;
  const emojiFreeText = text.replace(/[\p{Extended_Pictographic}\uFE0F]/gu, '').trim();

  if (!emojiFreeText && greetingEmojiPattern.test(text)) return true;

  const normalized = text
    .replace(/[\p{Extended_Pictographic}\uFE0F]/gu, ' ')
    .replace(/[!?.,;:()[\]{}]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  const greetingPatterns = [
    /^(hi|hiya|hello|hey|heya|howdy|greetings|jambo|habari|salaam|shalom)$/,
    /^(hi|hiya|hello|hey|heya|howdy|greetings) (there|everyone|folks|materi boys)$/,
    /^good (morning|afternoon|evening|day|night)( (there|everyone|folks|materi boys))?$/,
    /^(how are you|how is it going|how is your day|what's up|whats up|nice to meet you)$/
  ];

  return greetingPatterns.some((pattern) => pattern.test(normalized));
}

function addMessage(messages, text, type) {
  const message = document.createElement('div');
  message.className = `chat-assistant__message chat-assistant__message--${type}`;

  const mapsPrefix = 'Open directions in Google Maps: ';
  const mapsUrl = 'https://www.google.com/maps/search/?api=1&query=St.%20Orsola%20Hospital%20Chiakariga';

  if (type === 'bot' && text === responses.academics) {
    message.classList.add('chat-assistant__message--pathways');

    const heading = document.createElement('strong');
    heading.textContent = 'Academic pathways';
    message.append(heading);

    const pathways = [
      {
        name: 'STEM',
        icon: '🔬',
        details: [
          'Pure Science: Maths, Physics, Chemistry, Biology',
          'Applied Science: Computer, Business, Agriculture, Building & Construction, Woodwork'
        ]
      },
      {
        name: 'Social Sciences',
        icon: '📚',
        details: ['Geography, History & Citizenship, Literature and English, Religion, Fasihi ya Kiswahili']
      },
      {
        name: 'Arts & Sport Science',
        icon: '🎨',
        details: ['Drama, Music & Dance, Theater & Film, Soccer, Volleyball, Rugby, Basketball, Tennis']
      }
    ];

    pathways.forEach((pathway) => {
      const section = document.createElement('section');
      section.className = 'chat-assistant__pathway';

      const title = document.createElement('strong');
      title.textContent = `${pathway.icon} ${pathway.name}`;
      section.append(title);

      pathway.details.forEach((detail) => {
        const detailText = document.createElement('span');
        detailText.textContent = detail;
        section.append(detailText);
      });

      message.append(section);
    });
  } else if (type === 'bot' && text === responses.contact) {
    message.classList.add('chat-assistant__message--contact');

    const heading = document.createElement('strong');
    heading.textContent = 'Contact the school';
    message.append(heading);

    const phone = document.createElement('a');
    phone.href = 'tel:+254726677666';
    phone.textContent = '072 667 7666';
    phone.setAttribute('aria-label', 'Call Materi Boys on 072 667 7666');
    message.append(phone);

    const schoolEmail = document.createElement('a');
    schoolEmail.href = 'mailto:matirischool@gmail.com';
    schoolEmail.textContent = 'matirischool@gmail.com';
    message.append(schoolEmail);

    const additionalEmail = document.createElement('a');
    additionalEmail.href = 'mailto:matiriboys@gmail.com';
    additionalEmail.textContent = 'matiriboys@gmail.com';
    message.append(additionalEmail);

    const hours = document.createElement('span');
    hours.textContent = 'Visiting hours: Monday - Friday, 8:00 AM - 5:00 PM';
    message.append(hours);
  } else if (type === 'bot' && text.includes(mapsUrl)) {
    message.append(document.createTextNode(text.replace(` ${mapsPrefix}${mapsUrl}`, '')));
    message.append(document.createTextNode(` ${mapsPrefix}`));

    const mapsLink = document.createElement('a');
    mapsLink.href = mapsUrl;
    mapsLink.target = '_blank';
    mapsLink.rel = 'noopener noreferrer';
    mapsLink.textContent = 'Open Google Maps';
    message.append(mapsLink);
  } else {
    message.textContent = text;
  }

  messages.appendChild(message);
  messages.scrollTop = messages.scrollHeight;
}

export function initChatAssistant() {
  if (document.querySelector('.chat-assistant')) return;

  const root = document.createElement('aside');
  root.className = 'chat-assistant';
  root.innerHTML = `
    <button class="chat-assistant__toggle" type="button" aria-expanded="false" aria-controls="materi-chat-panel" aria-label="Open Materi Boys assistant">
      <span class="chat-assistant__toggle-icon" aria-hidden="true">✦</span>
      <span>Chat with us</span>
    </button>
    <div class="chat-assistant__panel" id="materi-chat-panel" hidden>
      <div class="chat-assistant__header">
        <div>
          <strong>Materi Boys Assistant</strong>
          <span><i aria-hidden="true"></i> Online</span>
        </div>
        <button class="chat-assistant__close" type="button" aria-label="Close chat">×</button>
      </div>
      <div class="chat-assistant__messages" aria-live="polite">
        <div class="chat-assistant__message chat-assistant__message--bot">Hello! I can help with admissions, academic pathways, fees, downloads, and school contacts.</div>
      </div>
      <div class="chat-assistant__quick-actions" aria-label="Common questions">
        ${quickActions.map((action) => `<button type="button" data-chat-key="${action.key}">${action.label}</button>`).join('')}
      </div>
      <form class="chat-assistant__form">
        <label class="sr-only" for="materi-chat-input">Ask the Materi Boys Assistant</label>
        <input id="materi-chat-input" name="message" maxlength="240" autocomplete="off" placeholder="Ask about the school..." />
        <button type="submit" aria-label="Send message" title="Send message">
          <svg class="chat-assistant__send-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path d="M21.7 2.3a1 1 0 0 0-1.05-.22l-18 7a1 1 0 0 0 .08 1.9l7.4 2.47 2.47 7.4a1 1 0 0 0 .91.68h.06a1 1 0 0 0 .93-.63l7.4-18a1 1 0 0 0-.2-.6ZM5.96 10.08 18.42 5.23l-7.23 6.03-5.23-1.18Zm7.2 8.03-1.18-3.54 6.03-7.23-4.85 10.77Z" />
          </svg>
        </button>
      </form>
      <a class="chat-assistant__whatsapp" href="https://wa.me/${WHATSAPP_NUMBER}?text=Hello%20Materi%20Boys%2C%20I%20have%20a%20question." target="_blank" rel="noopener noreferrer">
        <span class="chat-assistant__whatsapp-text">Talk to the school on whatsapp</span>
        <span class="chat-assistant__whatsapp-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" focusable="false">
            <path d="M12.04 2.5C6.68 2.5 2.5 6.65 2.5 12c0 1.98.57 3.85 1.56 5.43L2.5 21.5l4.18-1.08A9.46 9.46 0 0 0 12.04 21.5c5.36 0 9.71-4.15 9.71-9.5S17.4 2.5 12.04 2.5Zm0 17.3a7.76 7.76 0 0 1-3.95-1.08l-.28-.17-2.48.64.66-2.42-.18-.28A7.76 7.76 0 0 1 4.28 12c0-4.28 3.48-7.76 7.76-7.76 4.28 0 7.76 3.48 7.76 7.76 0 4.28-3.48 7.76-7.76 7.76Zm4.25-5.74c-.23-.12-1.37-.68-1.58-.76-.21-.08-.36-.12-.51.12-.15.24-.58.76-.71.92-.13.15-.26.17-.49.06-.23-.12-.97-.36-1.85-1.15-.68-.61-1.14-1.37-1.27-1.6-.13-.23-.01-.36.1-.48.1-.1.23-.26.34-.39.11-.13.15-.23.23-.38.08-.15.04-.29-.02-.41-.06-.12-.51-1.24-.7-1.7-.18-.45-.37-.39-.51-.39-.13 0-.28-.02-.42-.02-.14 0-.38.06-.58.28-.2.23-.76.74-.76 1.8 0 1.06.78 2.1 .89 2.24.11.15 1.53 2.33 3.71 3.26 2.18.93 2.18.62 2.57.58.39-.04 1.27-.52 1.44-1.02.17-.5.17-.93.12-1.02-.05-.08-.2-.12-.43-.24Z" />
          </svg>
        </span>
      </a>
    </div>
  `;

  document.body.appendChild(root);

  const toggle = root.querySelector('.chat-assistant__toggle');
  const close = root.querySelector('.chat-assistant__close');
  const panel = root.querySelector('.chat-assistant__panel');
  const messages = root.querySelector('.chat-assistant__messages');
  const form = root.querySelector('.chat-assistant__form');
  const input = root.querySelector('#materi-chat-input');

  const setOpen = (isOpen) => {
    panel.hidden = !isOpen;
    toggle.setAttribute('aria-expanded', String(isOpen));
    root.classList.toggle('is-open', isOpen);
    if (isOpen) input.focus();
  };

  const answer = (message, key) => {
    addMessage(messages, message, 'user');
    window.setTimeout(() => addMessage(messages, key ? responses[key] : responseFor(message), 'bot'), 260);
  };

  toggle.addEventListener('click', () => setOpen(!root.classList.contains('is-open')));
  close.addEventListener('click', () => setOpen(false));

  root.querySelectorAll('[data-chat-key]').forEach((button) => {
    button.addEventListener('click', () => answer(button.textContent, button.dataset.chatKey));
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const message = input.value.trim();
    if (!message) return;
    answer(message);
    input.value = '';
  });

}