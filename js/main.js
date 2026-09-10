// Instituto Jorge da Silva — script principal (vanilla JS, sem dependências)
document.addEventListener('DOMContentLoaded', function () {

  /* ---------- Menu mobile ---------- */
  var toggle = document.querySelector('.menu-toggle');
  var nav = document.querySelector('.main-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var isOpen = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      toggle.textContent = isOpen ? '✕' : '☰';
    });
    nav.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        nav.classList.remove('open');
        toggle.textContent = '☰';
      });
    });
  }

  /* ---------- Ano no rodapé ---------- */
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  /* ---------- Doação: seleção de valor ---------- */
  var amountBtns = document.querySelectorAll('.amount-btn');
  var customInput = document.getElementById('custom-amount');
  var donateSummary = document.getElementById('donate-summary-value');

  function setSelectedAmount(value, sourceBtn) {
    amountBtns.forEach(function (b) { b.setAttribute('aria-pressed', 'false'); });
    if (sourceBtn) sourceBtn.setAttribute('aria-pressed', 'true');
    if (customInput) customInput.value = value;
    if (donateSummary) donateSummary.textContent = 'R$ ' + Number(value).toLocaleString('pt-BR');
  }

  amountBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var value = btn.getAttribute('data-amount');
      setSelectedAmount(value, btn);
    });
  });

  if (customInput) {
    customInput.addEventListener('input', function () {
      amountBtns.forEach(function (b) { b.setAttribute('aria-pressed', 'false'); });
      var v = Number(customInput.value.replace(/[^\d]/g, '')) || 0;
      if (donateSummary) donateSummary.textContent = v > 0 ? 'R$ ' + v.toLocaleString('pt-BR') : 'R$ 0';
    });
  }

  var donateBtn = document.getElementById('donate-submit');
  if (donateBtn) {
    donateBtn.addEventListener('click', function (e) {
      e.preventDefault();
      var v = Number((customInput && customInput.value || '0').toString().replace(/[^\d]/g, ''));
      if (!v || v < 5) {
        alert('Escolha ou digite um valor de doação válido (mínimo R$ 5).');
        if (customInput) customInput.focus();
        return;
      }
      // PONTO DE INTEGRAÇÃO: substituir pela URL real de checkout do Mercado Pago
      // Ex.: window.location.href = 'https://www.mercadopago.com.br/checkout/...?amount=' + v;
      alert('Valor selecionado: R$ ' + v.toLocaleString('pt-BR') + '.\n\nEste botão deve ser conectado ao checkout do Mercado Pago (cartão/boleto) da instituição.');
    });
  }

  /* ---------- Copiar chave Pix ---------- */
  document.querySelectorAll('[data-copy]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var text = btn.getAttribute('data-copy');
      var restore = btn.innerHTML;
      var done = function () {
        btn.innerHTML = 'Chave copiada ✓';
        setTimeout(function () { btn.innerHTML = restore; }, 2200);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done).catch(function () { fallbackCopy(text, done); });
      } else {
        fallbackCopy(text, done);
      }
    });
  });

  function fallbackCopy(text, done) {
    var ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); done(); } catch (e) { /* noop */ }
    document.body.removeChild(ta);
  }

  /* ---------- Validação de formulários (Voluntariado / Contato) ---------- */
  document.querySelectorAll('form[data-validate]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var valid = true;
      form.querySelectorAll('[required]').forEach(function (field) {
        var wrap = field.closest('.field');
        var ok = field.value && field.value.trim().length > 0;
        if (field.type === 'email' && ok) {
          ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value.trim());
        }
        if (wrap) wrap.classList.toggle('invalid', !ok);
        if (!ok) valid = false;
      });
      if (!valid) return;

      var successBox = form.querySelector('.form-success');
      // PONTO DE INTEGRAÇÃO: enviar os dados para um backend/e-mail real
      // (ex.: Formspree, endpoint próprio, ou serviço de e-mail transacional).
      if (successBox) {
        successBox.classList.add('show');
        successBox.setAttribute('tabindex', '-1');
        successBox.focus();
      }
      form.reset();
      form.querySelectorAll('.field').forEach(function (f) { f.classList.remove('invalid'); });
    });
  });

  /* ---------- Newsletter (placeholder funcional) ---------- */
  document.querySelectorAll('form[data-newsletter]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var input = form.querySelector('input[type="email"]');
      if (!input || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim())) {
        input && input.focus();
        return;
      }
      var msg = form.querySelector('.newsletter-msg');
      if (msg) { msg.textContent = 'Inscrição confirmada! Obrigado por acompanhar o Instituto.'; msg.style.display = 'block'; }
      form.reset();
    });
  });
});
