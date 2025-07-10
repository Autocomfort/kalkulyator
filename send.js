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
  fetch("https://crm.sitniks.com/open-api/orders", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer X2AZUwxc7GDmlWuEAUCNHGHFTdlVdtlKWwLLkEKyiIa" 
    },
    body: JSON.stringify(data)
  })
  .then(response => {
    if (response.ok) {
      alert("✅ Дякуємо! Заявку надіслано.");
      document.getElementById("order-modal").style.display = "none";
    } else {
      alert("❌ Помилка при надсиланні заявки.");
    }
  })
  .catch(error => {
    console.error("❌ Помилка:", error);
    alert("⚠️ Не вдалося надіслати замовлення.");
  })
  .finally(() => {
    submitButton.disabled = false;
    submitButton.textContent = "Надіслати";
  });
}
