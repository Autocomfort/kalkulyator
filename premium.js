document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('premium-config-form');
  const priceDisplay = document.getElementById('premium-price');
  const designGroupSelect = document.getElementById('design-group');
  const designNumberSelect = document.getElementById('design-number');
  const designPreviewImg = document.getElementById('design-preview-img');

  if (!form) return;

  // === Select2 з пошуком ===
  $('#premium-embroidery-premium').select2({
    placeholder: 'Оберіть вишивку',
    allowClear: true,
    width: '100%'
  }).on('change', calculatePremiumPrice);

  $('#premium-badge').select2({
    placeholder: 'Оберіть лого',
    allowClear: true,
    width: '100%'
  }).on('change', calculatePremiumPrice);

  // === Функція оновлення номера дизайну ===
  function updateDesignNumbers() {
    const type = designGroupSelect.value;

    let min = 1, max = 7;
    if (type === 'double') {
      min = 8; max = 15;
    } else if (type === 'premium') {
      min = 16; max = 26;
    }

    // Очистити попередні опції
    designNumberSelect.innerHTML = '';

    for (let i = min; i <= max; i++) {
      const option = document.createElement('option');
      option.value = i;
      option.textContent = i;
      designNumberSelect.appendChild(option);
    }
  }

  // === Оновлення картинки дизайну ===
  designGroupSelect.addEventListener('change', function () {
    const value = this.value;
    let src = '';
    
    switch (value) {
      case 'single': src = 'kalkulyator/images/designs/single.jpg'; break;
      case 'double': src = 'kalkulyator/images/designs/double.jpg'; break;
      case 'premium': src = 'kalkulyator/images/designs/premium.jpg'; break;
    }

    if (src) designPreviewImg.src = src;

    updateDesignNumbers();
    calculatePremiumPrice();
  });

  // === Основний розрахунок ціни ===
  function calculatePremiumPrice() {
    const size = parseInt(form.size.value);
    const designType = designGroupSelect.value;
    const embroidery = $('#premium-embroidery-premium').val();
    const badge = $('#premium-badge').val();
    const pockets = parseInt(form.pockets.value);
    const velcro = form.velcro.value;

    let basePrice = 0;

    const designBasePrices = {
      single: 2950,
      double: 3250,
      premium: 3650
    };

    const sizeStep = (size - 50) / 10;
    if (designBasePrices[designType]) {
      basePrice = designBasePrices[designType] + sizeStep * 550;
    }

    if (embroidery && embroidery !== 'none') {
      basePrice += 650;
    }

    if (badge === 'big') {
      basePrice += 1200;
    } else if (badge && badge !== 'none') {
      basePrice += 200;
    }
    

    if (!isNaN(pockets)) {
      basePrice += pockets * 200;
    }

    if (velcro === 'yes') {
      basePrice += 150;
    }

    priceDisplay.textContent = basePrice;
  }

  // === Модалка "Купити" ===
  document.getElementById('buy-premium').addEventListener('click', function () {
    const data = new FormData(form);
    const getColorText = (field) => {
      const input = form.querySelector(`input[name="${field}"]`);
      const label = form.querySelector(`.color-group[data-name="${field}"] .color-text`);
      return label ? label.textContent : input?.value || '';
    };

    const velcroValue = data.get('velcro');
    const velcroLabel = velcroValue === 'yes' ? 'з липучками' : 'без липучок';

    const summary = `
      <strong>Обрані параметри:</strong><br>
      Розмір: ${data.get('size')} см<br>
      Вишивка: ${$('#premium-embroidery-premium').find('option:selected').text()}<br>
      Металевий лого: ${$('#premium-badge').find('option:selected').text()}<br>
      Дизайн: ${$('#design-group').find('option:selected').text()} №${data.get('design-number')}<br>
      Колір органайзеру: ${getColorText('color')}<br>
      Колір нитки: ${getColorText('thread')}<br>
      Колір канту: ${getColorText('kant')}<br>
      Колір підкладки: ${getColorText('lining')}<br>
      Кармани: ${data.get('pockets')}<br>
      Липучки: ${velcroLabel}<br>
      <br><strong>Ціна:</strong> ${priceDisplay.textContent} грн
    `;

    document.getElementById('selected-options').innerHTML = summary;
    document.getElementById('order-modal').classList.add('show');
  });

  // === Запуск початково ===
  updateDesignNumbers();
  calculatePremiumPrice();
  form.addEventListener('change', calculatePremiumPrice);
});
