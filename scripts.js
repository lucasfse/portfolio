    // Gestion du menu actif lors du clic
    const navLinks = document.querySelectorAll('nav ul li a');

    navLinks.forEach(link => {
      link.addEventListener('click', e => {
        e.preventDefault();
        navLinks.forEach(l => l.classList.remove('active'));
        e.target.classList.add('active');
        const targetId = e.target.getAttribute('href').substring(1);
        const targetSection = document.getElementById(targetId);
        targetSection.scrollIntoView({ behavior: 'smooth' });
      });
    });

    // Gestion du menu actif au scroll
    window.addEventListener('scroll', () => {
      let scrollPos = window.scrollY + 100;
      navLinks.forEach(link => {
        const section = document.querySelector(link.getAttribute('href'));
        if (section) {
          if (
            section.offsetTop <= scrollPos &&
            section.offsetTop + section.offsetHeight > scrollPos
          ) {
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
          }
        }
      });
    });

    // Gestion ouverture/fermeture modals
    const modals = document.querySelectorAll('.modal');
    const detailsButtons = document.querySelectorAll('.details-button');
    const closeButtons = document.querySelectorAll('.close');

    detailsButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const modalId = btn.getAttribute('data-modal');
        const modal = document.getElementById(modalId);
        if (modal) {
          modal.style.display = 'block';
          modal.setAttribute('aria-hidden', 'false');
          modal.querySelector('.modal-content').focus();
        }
      });
    });

    closeButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const modal = btn.closest('.modal');
        if (modal) {
          modal.style.display = 'none';
          modal.setAttribute('aria-hidden', 'true');
        }
      });
      btn.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          btn.click();
        }
      });
    });

    modals.forEach(modal => {
      modal.addEventListener('click', e => {
        if (e.target === modal) {
          modal.style.display = 'none';
          modal.setAttribute('aria-hidden', 'true');
        }
      });
    });