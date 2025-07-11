function submitOrder() {
  const name = document.getElementById("customer-name").value.trim();
  const phone = document.getElementById("customer-phone").value.trim();
  const optionsBlock = document.getElementById("selected-options");

  if (!name || !phone) {
    alert("Будь ласка, введіть ім’я та телефон.");
    return;
  }

  const optionsText = optionsBlock ? optionsBlock.innerText.trim() : "";

  const utm_source = localStorage.getItem("utm_source") || '';
  const utm_medium = localStorage.getItem("utm_medium") || '';
  const utm_campaign = localStorage.getItem("utm_campaign") || '';

  const comment = `${optionsText}\n\nІм’я: ${name}\nТелефон: ${phone}`;

  const data = {
    client: {
      fullname: name,
      phone: phone
    },
    clientComment: comment,
    utm: {
      source: utm_source,
      medium: utm_medium,
      campaign: utm_campaign
    }
  };

  const submitButton = document.querySelector(".submit-button");
  submitButton.disabled = true;
  submitButton.textContent = "Надсилається...";
  console.log("Дані до CRM:", data);
  fetch('https://kalkulyator.great-site.net/send.php', {
    method: 'POST',
    body: new URLSearchParams({
      name: name,
      phone: phone,
      comment: comment
    })
  })
  .then(response => response.json())
  .then(data => {
    alert('Заявку надіслано!');
  })
  .catch(error => {
    alert('Помилка надсилання: ' + error.message);
  })
  .finally(() => {
    submitButton.disabled = false;
    submitButton.textContent = "Надіслати";
  });
}
