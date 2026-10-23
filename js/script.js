// Keep project summaries and optional URLs together for easy editing.
const projectInfo = {
  research: { title: 'Research Innovation Science Platform', description: 'A research management platform supporting research management, publication search, question modules, and author profiles. The project includes authentication, authorization, publication search, and database integration.', technologies: ['Laravel', 'PHP', 'PostgreSQL'], github: '', demo: '' },
  doctor: { title: 'Doctor Digital Marketing Plan System', description: 'A web-based marketing management system that helps agencies manage client projects, create and approve content, track revisions, and publish content to Facebook Pages.', technologies: ['Laravel', 'PHP', 'MySQL'], github: '', demo: '' },
  sport: { title: 'Sport Venue Booking System', description: 'A web application featuring responsive interfaces, venue detail pages, and category-based filtering.', technologies: ['Vue.js', 'NestJS', 'TypeScript', 'PostgreSQL'], github: '', demo: '' },
  brewmate: { title: 'BrewMate Café App', description: 'A mobile application developed following HCI principles, translating UI/UX designs into a functional Flutter app and applying state management.', technologies: ['Flutter', 'Dart'], github: '', demo: '' }
};

const menuButton = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
function closeMenu() {
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Open navigation');
  navLinks.classList.remove('open');
  document.body.classList.remove('menu-open');
}
menuButton.addEventListener('click', () => {
  const willOpen = menuButton.getAttribute('aria-expanded') !== 'true';
  menuButton.setAttribute('aria-expanded', String(willOpen));
  menuButton.setAttribute('aria-label', willOpen ? 'Close navigation' : 'Open navigation');
  navLinks.classList.toggle('open', willOpen);
  document.body.classList.toggle('menu-open', willOpen);
});
navLinks.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });

// Mark the section currently visible in the viewport.
const sectionLinks = [...document.querySelectorAll('.nav-links a[href^="#"]')];
const observedSections = [...document.querySelectorAll('main section[id]')];
if ('IntersectionObserver' in window) {
  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      sectionLinks.forEach(link => {
        const isCurrent = link.getAttribute('href') === `#${entry.target.id}`;
        link.classList.toggle('active', isCurrent);
        if (isCurrent) link.setAttribute('aria-current', 'page');
        else link.removeAttribute('aria-current');
      });
    });
  }, { rootMargin: '-25% 0px -65% 0px' });
  observedSections.forEach(section => sectionObserver.observe(section));
}

// Swap in the placeholder when a profile file is missing.
const portrait = document.querySelector('.portrait-image');
const portraitPlaceholder = document.querySelector('.portrait-placeholder');
portrait.addEventListener('load', () => {
  portrait.classList.add('is-loaded');
  portraitPlaceholder.hidden = true;
});
portrait.addEventListener('error', () => {
  portrait.classList.remove('is-loaded');
  portraitPlaceholder.hidden = false;
});
if (portrait.complete && portrait.naturalWidth) portrait.dispatchEvent(new Event('load'));

// Reveal content as it enters view, while honoring reduced-motion preferences.
if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches && 'IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add('visible'); revealObserver.unobserve(entry.target); }
  }), { threshold: 0.08 });
  document.querySelectorAll('.summary-card, .experience-card, .project-card, .skill-card, .education-card').forEach(item => {
    item.classList.add('reveal'); revealObserver.observe(item);
  });
}

// Project details dialog: optional external links appear only after real URLs are supplied above.
const dialog = document.querySelector('#project-dialog');
const dialogTitle = dialog.querySelector('#dialog-title');
const dialogDescription = dialog.querySelector('.dialog-description');
const dialogTags = dialog.querySelector('.dialog-tags');
const dialogLinks = dialog.querySelector('.dialog-links');
document.querySelectorAll('.details-button').forEach(button => button.addEventListener('click', () => {
  const project = projectInfo[button.closest('.project-card').dataset.project];
  dialogTitle.textContent = project.title;
  dialogDescription.textContent = project.description;
  dialogTags.replaceChildren(...project.technologies.map(technology => {
    const badge = document.createElement('span'); badge.textContent = technology; return badge;
  }));
  dialogLinks.replaceChildren();
  [['GitHub', project.github], ['Live demo', project.demo]].forEach(([label, url]) => {
    if (!url) return;
    const link = document.createElement('a'); link.className = 'button button-outline'; link.href = url;
    link.target = '_blank'; link.rel = 'noopener noreferrer'; link.textContent = `${label} ↗`; dialogLinks.append(link);
  });
  dialog.showModal();
}));
dialog.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });

// Static screenshots and captions for the experience project gallery.
const experienceInfo = {
  research: {
    title: 'Research Innovation Science Platform',
    description: 'A research platform for discovering publications, researchers, and scientific questions.',
    images: [
      { src: 'assets/images/ris.home.png', title: 'Research discovery', description: 'Browse featured research and search publications, authors, and questions.' },
      { src: 'assets/images/login-ris.png', title: 'Sign in to RIS', description: 'A dedicated sign-in page gives researchers access to their accounts.' },
      { src: 'assets/images/author-search.png', title: 'Profile search', description: 'The RIS sign-in experience shown within a laptop mockup.' }
    ]
  },
  doctor: {
    title: 'Doctor Digital Marketing Plan System',
    description: 'A web based workspace for planning and managing digital marketing activity.',
    images: [
      { src: 'assets/images/doctor-home.png', title: 'Marketing analytics leading page', description: 'A snapshot of campaign analytics, reach, and engagement insights.' }
    ]
  }
};
const experienceDialog = document.querySelector('#experience-dialog');
const experienceGallery = experienceDialog.querySelector('.experience-gallery');
document.querySelectorAll('.experience-explore').forEach(button => button.addEventListener('click', () => {
  const experience = experienceInfo[button.dataset.experience];
  experienceDialog.querySelector('#experience-dialog-title').textContent = experience.title;
  experienceDialog.querySelector('.experience-dialog-description').textContent = experience.description;
  experienceGallery.replaceChildren(...experience.images.map((image, index) => {
    const figure = document.createElement('figure');
    figure.className = 'experience-shot';
    let preview;
    if (image.src) {
      preview = document.createElement('img');
      preview.className = 'experience-gallery-image';
      preview.src = image.src;
      preview.alt = image.title;
    } else {
      preview = document.createElement('div');
      preview.className = 'experience-shot-preview';
      preview.setAttribute('aria-hidden', 'true');
      preview.innerHTML = '<div class="experience-shot-topbar"><i></i><i></i><i></i></div><div class="experience-shot-layout"><div class="experience-shot-sidebar"></div><div class="experience-shot-main"><div class="experience-shot-block"></div><div class="experience-shot-block"></div><div class="experience-shot-block"></div></div></div>';
    }
    const caption = document.createElement('figcaption');
    caption.className = 'experience-shot-caption';
    const heading = document.createElement('strong');
    heading.textContent = image.title || `Screenshot ${String(index + 1).padStart(2, '0')}`;
    const description = document.createElement('span');
    description.textContent = image.description || '';
    caption.append(heading, description);
    figure.append(preview, caption);
    return figure;
  }));
  experienceDialog.showModal();
}));
experienceDialog.querySelector('.experience-dialog-close').addEventListener('click', () => experienceDialog.close());
experienceDialog.addEventListener('click', event => { if (event.target === experienceDialog) experienceDialog.close(); });

// This front-end form validates input; connect a backend/email service to deliver messages.
const contactForm = document.querySelector('#contact-form');
const formMessage = document.querySelector('#form-message');
contactForm.addEventListener('submit', event => {
  event.preventDefault();
  const name = contactForm.elements.name;
  const email = contactForm.elements.email;
  const message = contactForm.elements.message;
  const emailLooksValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim());
  if (name.value.trim().length < 2 || !emailLooksValid || message.value.trim().length < 10) {
    formMessage.textContent = 'Please enter your name, a valid email address, and a message of at least 10 characters.';
    formMessage.className = 'form-message error';
    if (name.value.trim().length < 2) name.focus(); else if (!emailLooksValid) email.focus(); else message.focus();
    return;
  }
  formMessage.textContent = 'Your details look good. This demo form is not connected to a server, so your message was not sent.';
  formMessage.className = 'form-message';
});

document.querySelector('#year').textContent = new Date().getFullYear();
