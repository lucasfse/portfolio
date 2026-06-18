const navLinks = document.querySelectorAll('.site-nav a');
const sections = document.querySelectorAll('[data-section]');
const menuToggle = document.querySelector('.menu-toggle');
const siteNav = document.querySelector('.site-nav');
const revealItems = document.querySelectorAll('.reveal');
const scrollRoot = document.querySelector('.snap-pages');
const modals = document.querySelectorAll('.modal');

let activeModal = null;
let lastModalTrigger = null;

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
  lastModalTrigger = trigger || null;
  modal.classList.add('is-open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');

  const panel = modal.querySelector('.modal-panel');
  if (panel) {
    panel.focus();
  }
}

function closeModal(modal) {
  if (!modal) {
    return;
  }

  modal.classList.remove('is-open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('modal-open');

  if (lastModalTrigger) {
    lastModalTrigger.focus();
  }

  activeModal = null;
  lastModalTrigger = null;
}

window.openProjectModal = function openProjectModal(modalId, trigger) {
  openModal(document.getElementById(modalId), trigger);
};

navLinks.forEach(link => {
  link.addEventListener('click', event => {
    const target = document.querySelector(link.getAttribute('href'));

    if (!target) {
      return;
    }

    event.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    closeMenu();
  });
});

if (menuToggle && siteNav) {
  menuToggle.addEventListener('click', () => {
    const willOpen = menuToggle.getAttribute('aria-expanded') !== 'true';
    menuToggle.setAttribute('aria-expanded', String(willOpen));
    siteNav.classList.toggle('is-open', willOpen);
    document.body.classList.toggle('menu-open', willOpen);
  });
}

const activeObserver = new IntersectionObserver(
  entries => {
    const activeEntry = entries
      .filter(entry => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

    if (!activeEntry) {
      return;
    }

    const activeId = `#${activeEntry.target.id}`;
    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === activeId);
    });
  },
  {
    root: scrollRoot,
    threshold: [0.45, 0.6, 0.75],
  }
);

sections.forEach(section => activeObserver.observe(section));

const revealObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  {
    root: scrollRoot,
    rootMargin: '0px 0px -12% 0px',
    threshold: 0.16,
  }
);

revealItems.forEach(item => revealObserver.observe(item));

document.addEventListener('click', event => {
  const modalTrigger = event.target.closest('[data-modal]');
  if (modalTrigger) {
    openModal(document.getElementById(modalTrigger.dataset.modal), modalTrigger);
    return;
  }

  const closeButton = event.target.closest('.modal-close');
  if (closeButton) {
    closeModal(closeButton.closest('.modal'));
  }
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
