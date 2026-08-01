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

  // Phone mockup videos — only start on explicit play-button click
  document.querySelectorAll('.phone-video').forEach(function (video) {
    var screen = video.closest('.phone-screen');
    var playBtn = screen ? screen.querySelector('.play-dot') : null;
    if (!playBtn) return;
    playBtn.addEventListener('click', function (e) {
      e.stopPropagation();
      video.controls = true;
      video.play();
      playBtn.style.display = 'none';
    });
    // iOS Safari ignores controlsList and can still open its native fullscreen
    // player — bounce straight back out so playback stays inside the mockup.
    video.addEventListener('webkitbeginfullscreen', function () {
      video.webkitExitFullscreen();
    });
  });

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

      var name = form.name.value.trim();
      var email = form.email.value.trim();
      var brand = form.brand.value.trim();
      var website = form.website.value.trim();
      var projectType = form.project_type.value;
      var budget = form.budget.value;
      var message = form.message.value.trim();

      var bodyLines = [
        'Name: ' + name,
        'Email: ' + email,
        'Brand/company: ' + brand,
        'Website/social: ' + (website || 'N/A'),
        'Project type: ' + projectType,
        'Budget: ' + (budget || 'N/A'),
        '',
        'Message:',
        message
      ];

      var subject = 'New enquiry from ' + name + (brand ? ' (' + brand + ')' : '');
      var mailtoLink = 'mailto:lucyrose224@icloud.com?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(bodyLines.join('\n'));

      if (statusEl) {
        statusEl.textContent = "Thanks! Opening your email app so you can send this enquiry through — I'll reply within 1–2 business days.";
        statusEl.className = 'form-status success';
      }

      window.location.href = mailtoLink;
      form.reset();
    });
  }
});
