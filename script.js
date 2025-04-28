document.addEventListener('DOMContentLoaded', function () {
  loadSavedData();
});

function updateRates() {
  const dieselRate = parseFloat(document.getElementById('diesel-rate').value);
  const petrolRate = parseFloat(document.getElementById('petrol-rate').value);

  if (isNaN(dieselRate) || isNaN(petrolRate) || dieselRate <= 0 || petrolRate <= 0) {
    alert("Please enter valid positive rates for Diesel and Petrol.");
    return;
  }

  localStorage.setItem('diesel-rate', dieselRate);
  localStorage.setItem('petrol-rate', petrolRate);

  document.getElementById('updated-rate-display').innerHTML = 
    `Updated Rates: Diesel ₹${dieselRate}/L | Petrol ₹${petrolRate}/L`;
}

function calculateSales() {
  const dieselAOld = saveOldReading('diesel-a-old');
  const dieselANew = parseFloat(document.getElementById('diesel-a-new').value);
  const dieselBOld = saveOldReading('diesel-b-old');
  const dieselBNew = parseFloat(document.getElementById('diesel-b-new').value);
  const petrolAOld = saveOldReading('petrol-a-old');
  const petrolANew = parseFloat(document.getElementById('petrol-a-new').value);
  const petrolBOld = saveOldReading('petrol-b-old');
  const petrolBNew = parseFloat(document.getElementById('petrol-b-new').value);
  
  const dieselRate = parseFloat(localStorage.getItem('diesel-rate'));
  const petrolRate = parseFloat(localStorage.getItem('petrol-rate'));

  if (isNaN(dieselRate) || isNaN(petrolRate) || dieselRate <= 0 || petrolRate <= 0) {
    alert("Please update the fuel rates first.");
    return;
  }

  let totalAmount = 0;
  let output = "";

  function processMachine(label, oldVal, newVal, rate) {
    if (!isNaN(oldVal) && !isNaN(newVal) && newVal > oldVal) {
      const litersSold = newVal - oldVal;
      const amount = litersSold * rate;
      totalAmount += amount;
      output += `<p>${label}: ${litersSold.toFixed(2)} Liters, Amount: ₹${amount.toFixed(2)}</p>`;
    }
  }

  processMachine("Diesel Machine A", dieselAOld, dieselANew, dieselRate);
  processMachine("Diesel Machine B", dieselBOld, dieselBNew, dieselRate);
  processMachine("Petrol Machine A", petrolAOld, petrolANew, petrolRate);
  processMachine("Petrol Machine B", petrolBOld, petrolBNew, petrolRate);

  if (output === "") {
    alert("Please enter valid readings (ensure new reading is greater than old reading) for at least one machine.");
    return;
  }

  document.getElementById('machine-results').innerHTML = output;
  document.getElementById('total-sales').textContent = `Total Sales Amount: ₹${totalAmount.toFixed(2)}`;
  document.getElementById('sales-result').style.display = 'block';

  const salesData = { totalAmount, details: output };
  localStorage.setItem('salesData', JSON.stringify(salesData));
}

function saveOldReading(id) {
  const oldValue = parseFloat(document.getElementById(id).value);
  if (!isNaN(oldValue)) {
    localStorage.setItem(id, oldValue);
    return oldValue;
  }
  return parseFloat(localStorage.getItem(id)) || 0;
}

function loadSavedData() {
  if (localStorage.getItem('diesel-rate')) {
    document.getElementById('diesel-rate').value = localStorage.getItem('diesel-rate');
  }
  if (localStorage.getItem('petrol-rate')) {
    document.getElementById('petrol-rate').value = localStorage.getItem('petrol-rate');
  }

  document.getElementById('updated-rate-display').innerHTML = 
    `Updated Rates: Diesel ₹${localStorage.getItem('diesel-rate') || 'Not Set'}/L | Petrol ₹${localStorage.getItem('petrol-rate') || 'Not Set'}/L`;

  const oldReadings = ['diesel-a-old', 'diesel-b-old', 'petrol-a-old', 'petrol-b-old'];
  oldReadings.forEach(id => {
    if (localStorage.getItem(id)) {
      document.getElementById(id).value = localStorage.getItem(id);
    }
  });
}