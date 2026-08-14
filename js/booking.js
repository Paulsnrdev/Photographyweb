/* ============================================
   BOOKING.JS — Form Validation + Formspree Submit
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  initForm('#booking-form',  '.success-message');
  initForm('#contact-form',  '.contact-success');
});

function initForm(formSel, successSel) {
  const form    = document.querySelector(formSel);
  const success = document.querySelector(successSel);
  if (!form) return;

  // Real-time validation feedback
  form.querySelectorAll('[required]').forEach(field => {
    field.addEventListener('blur', () => validateField(field));
    field.addEventListener('input', () => {
      if (field.classList.contains('error')) validateField(field);
    });
  });

  form.addEventListener('submit', async e => {
    e.preventDefault();
    if (!validateForm(form)) return;

    const btn = form.querySelector('[type="submit"]');
    const origHTML = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i>&nbsp; Sending...';
    btn.disabled = true;

    // Remove old error banner
    form.querySelector('.form-error-banner')?.remove();

    try {
      const res = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
      });

      if (res.ok) {
        form.style.display    = 'none';
        if (success) success.classList.add('active');
      } else {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.errors?.[0]?.message || 'Submission failed');
      }
    } catch (err) {
      btn.innerHTML = origHTML;
      btn.disabled  = false;
      showBanner(form, err.message || 'Something went wrong. Please try again or contact us directly.');
    }
  });
}

function validateForm(form) {
  let valid = true;
  form.querySelectorAll('[required]').forEach(field => {
    if (!validateField(field)) valid = false;
  });
  return valid;
}

function validateField(field) {
  const group = field.closest('.form-group');
  clearError(field, group);

  if (!field.value.trim()) {
    setError(field, group, 'This field is required.');
    return false;
  }
  if (field.type === 'email' && !isEmail(field.value)) {
    setError(field, group, 'Enter a valid email address.');
    return false;
  }
  if (field.type === 'tel' && field.value.trim() && !isPhone(field.value)) {
    setError(field, group, 'Enter a valid phone number.');
    return false;
  }
  return true;
}

function setError(field, group, msg) {
  field.classList.add('error');
  if (!group) return;
  group.classList.add('has-error');
  const span = group.querySelector('.error-msg');
  if (span) span.textContent = msg;
}

function clearError(field, group) {
  field.classList.remove('error');
  group?.classList.remove('has-error');
}

function isEmail(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }
function isPhone(v) { return /^[\+]?[\d\s\-\(\)]{7,15}$/.test(v.trim()); }

function showBanner(form, msg) {
  const div = document.createElement('div');
  div.className = 'form-error-banner';
  div.textContent = msg;
  form.prepend(div);
  div.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}
