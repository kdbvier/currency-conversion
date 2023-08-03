const apiKey = "SnFT1L3TPLRqno2VK0DqzFLlb0cby5AH"
const dropList = document.querySelectorAll("form select"),
    fromCurrency = document.querySelector(".from select"),
    toCurrency = document.querySelector(".to select"),
    getButton = document.querySelector("form button"),
    fromCurrencyTxt = document.querySelector("form .from-currency"),
    toCurrencyTxt = document.querySelector("form .to-currency"),
    amount = document.querySelector("form input");

const exchangeRateTxt = document.querySelector("form .exchange-rate");
const rateTxt = document.querySelector("form .currency-rate");
const exchangeIcon = document.querySelector("form .icon");

let SymbolList;


for (let i = 0; i < dropList.length; i++) {
    for(let currency_code in country_list){
        let selected = i == 0 ? currency_code == "USD" ? "selected" : "" : currency_code == "EUR" ? "selected" : "";
        let optionTag = `<option value="${currency_code}" ${selected}>${currency_code}</option>`;
        dropList[i].insertAdjacentHTML("beforeend", optionTag);
    }
    dropList[i].addEventListener("change", e =>{
        loadFlag(e.target);
    });
}

function loadFlag(element) {
    for (let code in country_list) {
        if (code == element.value) {
            let imgTag = element.parentElement.querySelector("img");
            imgTag.src = `https://flagcdn.com/48x36/${country_list[code].toLowerCase()}.png`;
        }
    }
}

async function getCurrencySymbolList() {
    return new Promise((resolve, reject) => {
        var myHeaders = new Headers();
        myHeaders.append("apikey", apiKey);

        var requestOptions = {
            method: 'GET',
            headers: myHeaders
        };
        fetch("https://api.apilayer.com/fixer/symbols", requestOptions)
            .then(response => response.json())
            .then(result => {
                SymbolList = result.symbols;
                resolve("success");
            })
            .catch(error => {
                reject(error);
            })
            .catch(err => {
                reject(err);
            });
    })
}
async function getExchangeValue() {
    let amountVal = amount.value;
    if (amountVal == "" || amountVal == "0" || amountVal < 0) {
        amount.value = "1";
        amountVal = 1;
    }
    exchangeRateTxt.innerText = "Getting exchange rate...";

    return new Promise((resolve, reject) => {
        var myHeaders = new Headers();
        myHeaders.append("apikey", "SnFT1L3TPLRqno2VK0DqzFLlb0cby5AH");

        var requestOptions = {
            method: 'GET',
            headers: myHeaders
        };

        fetch(`https://api.apilayer.com/fixer/convert?to=${fromCurrency.value}&from=${toCurrency.value}&amount=${amountVal}`, requestOptions)
            .then(response => response.json())
            .then(result => {
                console.log(result);
                exchangeRate = result.info.rate
                exchangeRateTxt.innerText = `${amountVal} ${fromCurrency.value} = ${(amountVal / result.info.rate).toFixed(3)} ${toCurrency.value}`;
                rateTxt.innerText = (1 / result.info.rate).toFixed(3)
                resolve("success")
            })
            .catch(error => {
                reject(error);
            })
            .catch(err => {
                reject(err)
            });
    })
}


window.addEventListener("load", async () => {
    try {
        await getCurrencySymbolList();
        getExchangeValue();
        fromCurrencyTxt.innerText = SymbolList[`${fromCurrency.value}`]
        console.log(SymbolList[`"${fromCurrency.value}"`]);
        toCurrencyTxt.innerText = SymbolList[`${toCurrency.value}`]
    } catch (err) {
        if (err.status == 401)
            alert("API KEY Error");
        else
            alert("Network Error")
    }
});

getButton.addEventListener("click", (e) => {
    e.preventDefault();
    getExchangeValue();
    fromCurrencyTxt.innerText = SymbolList[`${fromCurrency.value}`]
    toCurrencyTxt.innerText = SymbolList[`${toCurrency.value}`]
});

exchangeIcon.addEventListener("click", () => {
    let tempCode = fromCurrency.value;
    fromCurrency.value = toCurrency.value;
    toCurrency.value = tempCode;
    fromCurrencyTxt.innerText = SymbolList[`${fromCurrency.value}`]
    toCurrencyTxt.innerText = SymbolList[`${toCurrency.value}`]
    loadFlag(fromCurrency);
    loadFlag(toCurrency);
    getExchangeValue();
})


