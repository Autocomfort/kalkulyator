$(document).ready(function () {
  $('#standard-embroidery').select2({ placeholder: 'Оберіть вишивку', allowClear: true })
    .on('change', calculatePrice);
  $('#badge-select').select2({ placeholder: 'Оберіть шильд', allowClear: true })
    .on('change', calculatePrice);
});

const form = document.getElementById('config-form');
const totalPrice = document.getElementById('total-price');

const previewImages = {
  size: document.getElementById('size-img'),
  color: document.getElementById('color-img'),
  thread: document.getElementById('thread-img'),
  kant: document.getElementById('kant-img'),
  lining: document.getElementById('lining-img'),
  embroidery: document.getElementById('embroidery-img'),
  badge: document.getElementById('badge-img')
};

document.querySelectorAll('.color-group').forEach(group => {
  const name = group.dataset.name;
  const hiddenInput = group.querySelector(`input[name="${name}"]`);
  const displayText = group.querySelector('.color-text');

  group.querySelectorAll('.color-option').forEach(btn => {
    btn.addEventListener('click', () => {
      const value = btn.dataset.value;
      hiddenInput.value = value;
      displayText.textContent = getColorName(value);
      group.querySelectorAll('.color-option').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      calculatePrice();
    });
  });
});

function getColorName(value) {
  const map = {
    black: 'чорний',
    gray: 'сірий',
    brown: 'коричневий',
    beige: 'бежевий',
    red: 'червоний',
    white: 'білий',
    blue: 'синій',
    yellow: 'жовтий',
    orange: 'помаранчевий',
    leather: 'шкіряний',
    aqua: 'бірюзовий',
    khaky: 'хакі',
    Cognac: 'коньячний'
  };
  return map[value] || value;
}

function getSelectValue(id) {
  const select = document.getElementById(id);
  const selected = select.options[select.selectedIndex];
  return selected ? selected.text : '';
}

function updateImage(field, filename, sizeFolder = '') {
  const image = previewImages[field];
  if (!filename || filename === 'none') {
    image.style.display = 'none';
    image.src = '';
    return;
  }

  const lid = document.getElementById('lid')?.value || 'tape';
  const pathPrefix = `/kalkulyator/images/${lid}/${field}`;

  const path = sizeFolder
    ? `${pathPrefix}/${sizeFolder}/${filename}`
    : `${pathPrefix}/${filename}`;

  image.onload = () => {
    image.style.display = 'block';
  };
  image.onerror = () => {
    image.style.display = 'none';
  };
  image.src = path;
}

function calculatePrice() {
  const data = new FormData(form);
  const sizeVal = data.get('size');
  const lid = data.get('lid');
  const kant = data.get('kant');
  const lining = data.get('lining');
  const embroideryVal = document.getElementById('standard-embroidery').value;
  const badgeVal = document.getElementById('badge-select').value;

  const basePrices = {
    '35': 1390,
    '50': 1620,
    '65': 1855,
    '80': 2555,
    '100': 2650
  };

  let price = basePrices[sizeVal] || 0;

  if (kant) {
    if (kant === 'leather') {
      price += 100;
    } else if (kant !== 'black') {
      price += 50;
    }
  }

  if (lining && lining !== 'black') {
    price += 150;
  }

  if (embroideryVal && embroideryVal !== 'none') {
    price += 550;
  }

  if (badgeVal && badgeVal !== 'none') {
    price += 250;
  }

  if (lid === 'magnet') {
    switch (sizeVal) {
      case '35': price += 250; break;
      case '50': price += 300; break;
      case '65': price += 350; break;
      case '80':
      case '100': price += 400; break;
    }
  }

  totalPrice.textContent = price;

  updateImage('size', `size_${sizeVal}.png`, sizeVal);
  updateImage('color', `color_${data.get('color')}.png`, sizeVal);
  updateImage('thread', `${data.get('thread')}.png`, sizeVal);
  updateImage('kant', `${kant}.png`, sizeVal);
  updateImage('lining', `${lining}.png`, sizeVal);
  updateImage('embroidery', `${embroideryVal}.png`);
  updateImage('badge', `${badgeVal}.png`);
}

// === EVENTS ===
form.addEventListener('change', calculatePrice);
window.addEventListener('load', calculatePrice);

document.getElementById('buy-button').addEventListener('click', function () {
  const data = new FormData(form);

  const summary = `
    <strong>Обрані параметри:</strong><br>
    Розмір: ${data.get('size')} см<br>
    Фіксація кришки: ${data.get('lid') === 'magnet' ? 'На магнітах' : 'На липучці'}<br>
    Колір матеріалу: ${getColorName(data.get('color'))}<br>
    Колір нитки: ${getColorName(data.get('thread'))}<br>
    Колір окантовки: ${getColorName(data.get('kant'))}<br>
    Колір підкладки: ${getColorName(data.get('lining'))}<br>
    Вишивка: ${getSelectValue('standard-embroidery')}<br>
    Металевий лого: ${getSelectValue('badge-select')}<br>
    <br><strong>Ціна:</strong> ${document.getElementById('total-price').textContent} грн
  `;

  document.getElementById('selected-options').innerHTML = summary;
  document.getElementById('order-modal').classList.add('show');
});

document.getElementById('close-modal').addEventListener('click', function () {
  document.getElementById('order-modal').classList.remove('show');
});

function submitOrder() {
  const name = document.getElementById('customer-name').value.trim();
  const phone = document.getElementById('customer-phone').value.trim();

  if (!name || !phone) {
    alert('Будь ласка, заповніть всі поля');
    return;
  }

  document.getElementById('order-modal').classList.remove('show');
  form.reset();
  calculatePrice();

  const thankYouModal = document.getElementById('thank-you-modal');
  thankYouModal.classList.add('show');
  setTimeout(() => {
    thankYouModal.classList.remove('show');
  }, 2000);
}

function getUTMParams() {
  const params = new URLSearchParams(window.location.search);
  return {
    utm_source: params.get('utm_source') || '',
    utm_medium: params.get('utm_medium') || '',
    utm_campaign: params.get('utm_campaign') || '',
    utm_term: params.get('utm_term') || '',
    utm_content: params.get('utm_content') || ''
  };
}

window.addEventListener('load', () => {
  calculatePrice();

  const utm = getUTMParams();
  document.getElementById('utm_source').value = utm.utm_source;
  document.getElementById('utm_medium').value = utm.utm_medium;
  document.getElementById('utm_campaign').value = utm.utm_campaign;
  document.getElementById('utm_term').value = utm.utm_term;
  document.getElementById('utm_content').value = utm.utm_content;
});

document.querySelectorAll('.tab-button').forEach(button => {
  button.addEventListener('click', () => {
    document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));

    button.classList.add('active');
    const targetId = button.getAttribute('data-target');
    const targetContent = document.getElementById(targetId);
    if (targetContent) {
      targetContent.classList.add('active');
    }
  });
});
