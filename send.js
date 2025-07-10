function submitOrder() {
  const name = document.getElementById('customer-name').value.trim();
  const phone = document.getElementById('customer-phone').value.trim();
  const optionsBlock = document.getElementById('selected-options');
  const submitButton = document.querySelector('.submit-button');

  if (!name || !phone) {
    alert('Будь ласка, введіть ім’я та телефон.');
    return;
  }

  // Заблокувати кнопку на час відправки
  submitButton.disabled = true;
  submitButton.textContent = 'Надсилається...';

  const optionsText = optionsBlock ? optionsBlock.innerText.trim() : '';

  const utm_source = localStorage.getItem('utm_source') || '';
  const utm_medium = localStorage.getItem('utm_medium') || '';
  const utm_campaign = localStorage.getItem('utm_campaign') || '';
  const utm = `\nUTM Source: ${utm_source}\nUTM Medium: ${utm_medium}\nUTM Campaign: ${utm_campaign}`;

  const comment = `${optionsText}\n\nІм’я: ${name}\nТелефон: ${phone}${utm}`;

  fetch('https://crm.sitniks.com/open-api', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'X2AZUwxc7GDmlWuEAUCNHGHFTdlVdtlKWwLLkEKyiIa'
    },
    body: JSON.stringify({
      name: name,
      phone: phone,
      comment: comment
    })
  })
  .then(response => {
    if (response.ok) {
      alert('Дякуємо! Заявку надіслано.');
      document.getElementById('order-modal').style.display = 'none';
    } else {
      alert('Помилка при надсиланні. Спробуйте пізніше.');
    }
  })
  .catch(error => {
    console.error('Помилка:', error);
    alert('Не вдалося надіслати замовлення.');
  })
  .finally(() => {
    submitButton.disabled = false;
    submitButton.textContent = 'Надіслати';
  });
}

