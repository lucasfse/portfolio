const navLinks = document.querySelectorAll('.site-nav a');
const sections = [...navLinks]
  .map(link => document.querySelector(link.getAttribute('href')))
  .filter(Boolean);

const menuToggle = document.querySelector('.menu-toggle');
const siteNav = document.querySelector('.site-nav');
const modals = document.querySelectorAll('.modal');
const detailsButtons = document.querySelectorAll('.details-button');
const closeButtons = document.querySelectorAll('.close');

let activeModal = null;
let lastTrigger = null;

function closeMenu() {
  if (!menuToggle || !siteNav) {
    return;
  }

  menuToggle.setAttribute('aria-expanded', 'false');
  siteNav.classList.remove('is-open');
  document.body.classList.remove('menu-open');
}

function openModal(modal, trigger) {
  if (!modal) {
    return;
  }

  activeModal = modal;
  lastTrigger = trigger || null;
  modal.classList.add('is-open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');

  const focusTarget = modal.querySelector('.modal-content');
  if (focusTarget) {
    focusTarget.focus();
  }
}

function closeModal(modal) {
  if (!modal) {
    return;
  }

  modal.classList.remove('is-open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('modal-open');

  if (lastTrigger) {
    lastTrigger.focus();
  }

  activeModal = null;
  lastTrigger = null;
}

navLinks.forEach(link => {
  link.addEventListener('click', event => {
    const targetSelector = link.getAttribute('href');
    const targetSection = document.querySelector(targetSelector);

    if (!targetSection) {
      return;
    }

    event.preventDefault();
    targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    closeMenu();
  });
});

if (menuToggle && siteNav) {
  menuToggle.addEventListener('click', () => {
    const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', String(!isOpen));
    siteNav.classList.toggle('is-open', !isOpen);
    document.body.classList.toggle('menu-open', !isOpen);
  });
}

const observer = new IntersectionObserver(
  entries => {
    const visibleEntry = entries
      .filter(entry => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

    if (!visibleEntry) {
      return;
    }

    const currentId = `#${visibleEntry.target.id}`;
    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === currentId);
    });
  },
  {
    rootMargin: '-25% 0px -55% 0px',
    threshold: [0.2, 0.35, 0.55],
  }
);

sections.forEach(section => observer.observe(section));

detailsButtons.forEach(button => {
  button.addEventListener('click', () => {
    const modalId = button.getAttribute('data-modal');
    const modal = document.getElementById(modalId);
    openModal(modal, button);
  });
});

closeButtons.forEach(button => {
  button.addEventListener('click', () => {
    closeModal(button.closest('.modal'));
  });
});

modals.forEach(modal => {
  modal.addEventListener('click', event => {
    if (event.target === modal) {
      closeModal(modal);
    }
  });
});

document.addEventListener('keydown', event => {
  if (event.key === 'Escape') {
    if (activeModal) {
      closeModal(activeModal);
      return;
    }

    closeMenu();
  }
});
