// Reelwork — shared site behavior

document.addEventListener('DOMContentLoaded', function () {
  // Mobile nav toggle
  var toggle = document.querySelector('.nav-toggle');
  var links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', function () {
      links.classList.toggle('open');
    });
  }

  // FAQ accordion
  function setFaqState(item, open) {
    var answer = item.querySelector('.faq-answer');
    item.classList.toggle('open', open);
    if (answer) {
      answer.style.maxHeight = open ? answer.scrollHeight + 'px' : '0px';
    }
  }

  var faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(function (item) {
    var question = item.querySelector('.faq-question');
    if (!question) return;
    setFaqState(item, item.classList.contains('open'));
    question.addEventListener('click', function () {
      var wasOpen = item.classList.contains('open');
      faqItems.forEach(function (other) {
        if (other !== item) setFaqState(other, false);
      });
      setFaqState(item, !wasOpen);
    });
  });

  window.addEventListener('resize', function () {
    document.querySelectorAll('.faq-item.open .faq-answer').forEach(function (answer) {
      answer.style.maxHeight = answer.scrollHeight + 'px';
    });
  });

  // Contact form validation + fake submit
  var form = document.getElementById('booking-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var valid = true;
      var requiredFields = form.querySelectorAll('[required]');

      requiredFields.forEach(function (field) {
        var errorEl = document.getElementById(field.id + '-error');
        var value = field.value.trim();
        var fieldValid = true;

        if (!value) {
          fieldValid = false;
        } else if (field.type === 'email') {
          fieldValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        }

        if (!fieldValid) {
          valid = false;
          field.style.borderColor = '#c0392b';
          if (errorEl) errorEl.textContent = field.type === 'email' ? 'Enter a valid email address.' : 'This field is required.';
        } else {
          field.style.borderColor = '';
          if (errorEl) errorEl.textContent = '';
        }
      });

      var statusEl = document.getElementById('form-status');
      if (!valid) {
        if (statusEl) {
          statusEl.textContent = 'Please fix the highlighted fields and try again.';
          statusEl.className = 'form-status error';
        }
        return;
      }

      var action = form.getAttribute('action') || '';
      var isLiveEndpoint = /^https:\/\//.test(action);

      if (!isLiveEndpoint) {
        // No real form backend wired up yet — show a local confirmation only.
        if (statusEl) {
          statusEl.textContent = "Thanks! (Demo mode: this form isn't connected to an email service yet — see the note below.)";
          statusEl.className = 'form-status success';
        }
        form.reset();
        return;
      }

      var submitBtn = form.querySelector('button[type="submit"]');
      if (submitBtn) submitBtn.disabled = true;

      fetch(action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' }
      })
        .then(function (response) {
          if (response.ok) {
            if (statusEl) {
              statusEl.textContent = "Thanks! Your request has been sent. We'll reply within 1–2 business days.";
              statusEl.className = 'form-status success';
            }
            form.reset();
          } else {
            throw new Error('Submission failed');
          }
        })
        .catch(function () {
          if (statusEl) {
            statusEl.textContent = 'Something went wrong sending your request. Please email us directly instead.';
            statusEl.className = 'form-status error';
          }
        })
        .finally(function () {
          if (submitBtn) submitBtn.disabled = false;
        });
    });
  }
});
