const BASE_URL =
  "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@2024-03-06/v1/currencies";

const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");

// Check if countryList is defined
if (typeof countryList === 'undefined') {
  console.error('countryList is not defined');
} else {
  for (let select of dropdowns) {
    for (let currCode in countryList) {
      let newOption = document.createElement("option");
      newOption.innerText = currCode;
      newOption.value = currCode;
      if (select.name === "from" && currCode === "USD") {
        newOption.selected = "selected";
      } else if (select.name === "to" && currCode === "INR") {
        newOption.selected = "selected";
      }
      select.append(newOption);
    }

    select.addEventListener("change", (evt) => {
      updateFlag(evt.target);
    });
  }
}

const updateExchangeRate = async () => {
  let amount = document.querySelector(".amount input");
  let amtVal = amount.value;
  if (amtVal === "" || amtVal < 1) {
    amtVal = 1;
    amount.value = "1";
  }

  const URL = `${BASE_URL}/${fromCurr.value.toLowerCase()}.json`;
  console.log(`Fetching data from URL: ${URL}`);

  try {
    let response = await fetch(URL);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    let data = await response.json();
    let curr = fromCurr.value.toLowerCase();
    let fCurr = toCurr.value.toLowerCase()

    // NOTE :- play around with json from the two statements below
    // console.log("data is ",data)
    // console.log(data[curr][fCurr]);
    
    
    let rate = data[curr][fCurr];
    if (!rate) {
      throw new Error(`Rate not found for currency: ${toCurr.value}`);
    }
    console.log(`Rate: ${rate}`);
    let finalAmount = amtVal * rate;
    msg.innerText = `${amtVal} ${fromCurr.value} = ${finalAmount.toFixed(2)} ${toCurr.value}`;
  } catch (error) {
    console.error(`Failed to fetch exchange rate: ${error}`);
    msg.innerText = "Error fetching exchange rate";
  }
};

const updateFlag = (element) => {
  let currCode = element.value;
  let countryCode = countryList[currCode];
  let newSrc = `https://flagsapi.com/${countryCode}/shiny/64.png`;
  let img = element.parentElement.querySelector("img");
  img.src = newSrc;
};

btn.addEventListener("click", (evt) => {
  evt.preventDefault();
  updateExchangeRate();
});

window.addEventListener("load", () => {
  updateExchangeRate();
});
