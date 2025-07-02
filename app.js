const BASE_URL = "https://open.er-api.com/v6/latest";

const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");

// Populate currency dropdowns
for (let select of dropdowns) {
  for (let currCode in countryList) {
    let newOption = document.createElement("option");
    newOption.innerText = currCode;
    newOption.value = currCode;

    if (select.name === "from" && currCode === "USD") {
      newOption.selected = true;
    } else if (select.name === "to" && currCode === "INR") {
      newOption.selected = true;
    }

    select.append(newOption);
  }

  select.addEventListener("change", (e) => {
    updateFlag(e.target);
  });
}

// Set correct flag image
const updateFlag = (element) => {
  let currCode = element.value;
  let countryCode = countryList[currCode];
  let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
  let img = element.parentElement.querySelector("img");
  img.src = newSrc;
};

// Fetch and display exchange rate
const updateExchangeRate = async () => {
  let amount = document.querySelector(".amount input");
  let amtVal = amount.value;

  if (amtVal === "" || isNaN(amtVal) || amtVal <= 0) {
    amtVal = 1;
    amount.value = "1";
  }

  const URL = `${BASE_URL}/${fromCurr.value}`;
  try {
    const response = await fetch(URL);
    const data = await response.json();

    if (!data.rates || !data.rates[toCurr.value]) {
      msg.innerText = "Exchange rate not found.";
      return;
    }

    const rate = data.rates[toCurr.value];
    const finalAmount = (amtVal * rate).toFixed(2);

    msg.innerText = `${amtVal} ${fromCurr.value} = ${finalAmount} ${toCurr.value}`;
  } catch (error) {
    console.error("Fetch error:", error);
    msg.innerText = "Error fetching exchange rate.";
  }
};

// Button click
btn.addEventListener("click", (e) => {
  e.preventDefault();
  updateExchangeRate();
});

// Auto update on load
window.addEventListener("load", () => {
  updateExchangeRate();
});
