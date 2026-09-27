function escapeHtml(value) {
  const div = document.createElement('div');
  div.textContent = value == null ? '' : String(value);
  return div.innerHTML;
}

function formatDiscount(percent) {
  const safePercent = Number.isFinite(percent) ? percent : 0;
  return `${safePercent}%`;
}

function buildPartnerCard(partner) {
  const partnerType = partner.partnerType || 'Партнер';
  const name = partner.name || 'Без названия';
  const director = partner.director || 'Не указан';
  const phone = partner.phone || 'Не указан';
  const rating = partner.rating != null ? partner.rating : '—';

  return `
    <article class="partner-card">
      <div class="partner-card__row">
        <span class="partner-card__name">${escapeHtml(partnerType)} | ${escapeHtml(name)}</span>
        <span class="partner-card__discount">${formatDiscount(partner.discountPercent)}</span>
      </div>
      <div class="partner-card__meta">${escapeHtml(director)}</div>
      <div class="partner-card__meta">${escapeHtml(phone)}</div>
      <div class="partner-card__meta">Рейтинг: ${escapeHtml(rating)}</div>
    </article>
  `;
}

function renderStatus(container, message, isError) {
  const modifier = isError ? ' status-message--error' : '';
  container.innerHTML = `<div class="status-message${modifier}">${escapeHtml(message)}</div>`;
}

async function loadPartners() {
  const container = document.getElementById('partnerList');
  renderStatus(container, 'Загрузка данных...', false);

  let response;
  try {
    response = await fetch('/api/partners');
  } catch (networkError) {
    renderStatus(container, 'Нет соединения с сервером', true);
    return;
  }

  if (!response.ok) {
    renderStatus(container, 'Сервер вернул ошибку при загрузке партнеров', true);
    return;
  }

  const partners = await response.json();
  if (!Array.isArray(partners) || partners.length === 0) {
    renderStatus(container, 'Партнеры пока не добавлены', false);
    return;
  }

  container.innerHTML = partners.map(buildPartnerCard).join('');
}

loadPartners();
