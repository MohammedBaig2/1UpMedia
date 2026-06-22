const header = document.querySelector('.site-header');
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
const glow = document.querySelector('.cursor-glow');

window.addEventListener('mousemove', (e) => {
  if (!glow) return;
  glow.style.left = `${e.clientX}px`;
  glow.style.top = `${e.clientY}px`;
});

menuToggle?.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
});

navLinks?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  navLinks.classList.remove('open');
  menuToggle?.setAttribute('aria-expanded', 'false');
}));

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.14 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

document.querySelectorAll('.service-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    card.style.setProperty('--mx', `${e.clientX - rect.left}px`);
    card.style.setProperty('--my', `${e.clientY - rect.top}px`);
  });
});

const filterButtons = document.querySelectorAll('.filter-btn');
const serviceCards = document.querySelectorAll('.service-card');
filterButtons.forEach(button => {
  button.addEventListener('click', () => {
    filterButtons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');
    const filter = button.dataset.filter;
    serviceCards.forEach(card => {
      const show = filter === 'all' || card.dataset.category === filter;
      card.style.display = show ? '' : 'none';
      if (show) requestAnimationFrame(() => card.classList.add('visible'));
    });
  });
});

const aiOutput = document.getElementById('ai-output');
document.querySelectorAll('.ai-pill').forEach(button => {
  button.addEventListener('click', () => {
    document.querySelectorAll('.ai-pill').forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');
    aiOutput.textContent = button.dataset.ai;
  });
});

const recommendations = {
  leads: {
    title: 'Lead Generation Sprint',
    copy: 'A campaign-ready landing page, ad strategy, tracking setup and follow-up flow to turn traffic into enquiries.'
  },
  brand: {
    title: 'Brand Presence System',
    copy: 'A premium social media direction with content pillars, posting plan, visual style and messaging that makes the brand look active and trustworthy.'
  },
  sales: {
    title: 'Sales Conversion Funnel',
    copy: 'A focused sales page, retargeting ads, product/service messaging and conversion tracking built to increase purchase intent.'
  },
  automation: {
    title: 'AI Automation Setup',
    copy: 'Smart enquiry forms, follow-up templates, internal workflows and lead organisation so the business replies faster and wastes less time.'
  }
};

const selectorForm = document.getElementById('selector-form');
selectorForm?.addEventListener('submit', (e) => {
  e.preventDefault();
  const goal = document.getElementById('goal').value;
  const stage = document.getElementById('stage').value;
  const priority = document.getElementById('priority').value;
  const result = recommendations[goal] || recommendations.leads;
  document.getElementById('recommend-title').textContent = result.title;
  document.getElementById('recommend-copy').textContent = `${result.copy} Best fit for a ${stage.replace('-', ' ')} business prioritising ${priority}.`;
  document.querySelector('.recommendation-card')?.animate([
    { transform: 'scale(.98)', opacity: .78 },
    { transform: 'scale(1)', opacity: 1 }
  ], { duration: 260, easing: 'ease-out' });
});

const modal = document.getElementById('audit-modal');
const modalText = document.getElementById('modal-text');
const statusText = document.getElementById('form-status');
const contactForm = document.getElementById('contact-form');

contactForm?.addEventListener('submit', (e) => {
  e.preventDefault();
  const name = document.getElementById('name').value.trim();
  const business = document.getElementById('business').value.trim();
  const goal = document.getElementById('contact-goal').value;
  const message = document.getElementById('message').value.trim();
  const brief = `Hi 1Up Media, my name is ${name}.\n\nBusiness type: ${business}\nMain goal: ${goal}\nMessage: ${message || 'I would like a free growth audit and recommendation.'}\n\nPlease let me know what should be improved first.`;
  modalText.value = brief;
  modal.classList.add('show');
  modal.setAttribute('aria-hidden', 'false');
  statusText.textContent = 'Your audit request is ready. Copy it and send it through WhatsApp, Instagram or email.';
});

document.querySelector('.modal-close')?.addEventListener('click', () => {
  modal.classList.remove('show');
  modal.setAttribute('aria-hidden', 'true');
});
modal?.addEventListener('click', (e) => {
  if (e.target === modal) {
    modal.classList.remove('show');
    modal.setAttribute('aria-hidden', 'true');
  }
});

document.getElementById('submit-inquiry')?.addEventListener('click', async () => {
  const submitBtn = document.getElementById('submit-inquiry');
  const statusEl = document.getElementById('copy-status');

  submitBtn.disabled = true;
  submitBtn.textContent = 'Submitting...';

  try {
    await db.collection('inquiries').add({
      name: document.getElementById('name').value.trim(),
      business: document.getElementById('business').value.trim(),
      goal: document.getElementById('contact-goal').value,
      message: document.getElementById('message').value.trim(),
      brief: modalText.value,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });

    statusEl.textContent = 'Thank you! Your enquiry has been submitted. We will be in touch soon.';
    submitBtn.textContent = 'Submitted';
    contactForm?.reset();
  } catch (error) {
    console.error('Firebase submission error:', error);
    statusEl.textContent = 'Something went wrong. Please try again or contact us directly.';
    submitBtn.disabled = false;
    submitBtn.textContent = 'Submit';
  }
});

document.querySelectorAll('.magnetic').forEach(btn => {
  btn.addEventListener('mousemove', e => {
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    btn.style.transform = `translate(${x * .08}px, ${y * .14}px)`;
  });
  btn.addEventListener('mouseleave', () => btn.style.transform = 'translate(0,0)');
});
