document.addEventListener('DOMContentLoaded', () => {
    const fromSelect = document.getElementById('from');
    const toSelect = document.getElementById('to');
    const amountInput = document.getElementById('amount');
    const convertBtn = document.getElementById('convert-btn');
    const swapBtn = document.getElementById('swap-btn');
    const resultDiv = document.getElementById('result');
    const fromSearch = document.getElementById('from-search');
    const toSearch = document.getElementById('to-search');

    // Common currencies
    const currencies = {
        USD: "United States Dollar",
        EUR: "Euro",
        GBP: "British Pound",
        JPY: "Japanese Yen",
        AUD: "Australian Dollar",
        CAD: "Canadian Dollar",
        CHF: "Swiss Franc",
        CNY: "Chinese Yuan",
        INR: "Indian Rupee",
        NZD: "New Zealand Dollar",
        AED: "UAE Dirham",
        AFN: "Afghan Afghani",
        ALL: "Albanian Lek",
        AMD: "Armenian Dram",
        ANG: "Netherlands Antillean Guilder",
        AOA: "Angolan Kwanza",
        ARS: "Argentine Peso",
        AWG: "Aruban Florin",
        AZN: "Azerbaijani Manat",
        BAM: "Bosnia-Herzegovina Mark",
        BBD: "Barbadian Dollar",
        BDT: "Bangladeshi Taka",
        BGN: "Bulgarian Lev",
        BHD: "Bahraini Dinar",
        BIF: "Burundian Franc",
        BMD: "Bermudan Dollar",
        BND: "Brunei Dollar",
        BOB: "Bolivian Boliviano",
        BRL: "Brazilian Real",
        BSD: "Bahamian Dollar",
        BTN: "Bhutanese Ngultrum",
        BWP: "Botswanan Pula",
        BYN: "Belarusian Ruble",
        BZD: "Belize Dollar",
        CLP: "Chilean Peso",
        COP: "Colombian Peso",
        CRC: "Costa Rican Colón",
        CUP: "Cuban Peso",
        CVE: "Cape Verdean Escudo",
        CZK: "Czech Koruna",
        DJF: "Djiboutian Franc",
        DKK: "Danish Krone",
        DOP: "Dominican Peso",
        DZD: "Algerian Dinar",
        EGP: "Egyptian Pound",
        ETB: "Ethiopian Birr",
        FJD: "Fijian Dollar",
        GEL: "Georgian Lari",
        GHS: "Ghanaian Cedi",
        GMD: "Gambian Dalasi",
        GTQ: "Guatemalan Quetzal",
        HKD: "Hong Kong Dollar",
        HNL: "Honduran Lempira",
        HRK: "Croatian Kuna",
        HTG: "Haitian Gourde",
        HUF: "Hungarian Forint",
        IDR: "Indonesian Rupiah",
        ILS: "Israeli New Shekel",
        ISK: "Icelandic Króna",
        JMD: "Jamaican Dollar",
        JOD: "Jordanian Dinar",
        KES: "Kenyan Shilling",
        KHR: "Cambodian Riel",
        KRW: "South Korean Won",
        KWD: "Kuwaiti Dinar",
        KZT: "Kazakhstani Tenge",
        LAK: "Laotian Kip",
        LBP: "Lebanese Pound",
        LKR: "Sri Lankan Rupee"
    };

    // Populate currency dropdowns
    for (let code in currencies) {
        fromSelect.add(new Option(`${code} - ${currencies[code]}`, code));
        toSelect.add(new Option(`${code} - ${currencies[code]}`, code));
    }

    // Set default values
    fromSelect.value = 'USD';
    toSelect.value = 'EUR';

    // Function to filter currencies
    function filterCurrencies(searchInput, selectElement) {
        const searchTerm = searchInput.value.toLowerCase();
        const options = selectElement.options;
        const selectedValue = selectElement.value;
        
        // Clear existing options
        selectElement.innerHTML = '';
        
        // Filter and add matching options
        for (let code in currencies) {
            const currencyName = currencies[code].toLowerCase();
            const currencyCode = code.toLowerCase();
            
            if (currencyName.includes(searchTerm) || currencyCode.includes(searchTerm)) {
                const option = new Option(`${code} - ${currencies[code]}`, code);
                selectElement.add(option);
                
                // Maintain selected value
                if (code === selectedValue) {
                    option.selected = true;
                }
            }
        }
    }

    // Add event listeners for search inputs
    fromSearch.addEventListener('input', () => filterCurrencies(fromSearch, fromSelect));
    toSearch.addEventListener('input', () => filterCurrencies(toSearch, toSelect));

    // Modify the swap function to also swap search values
    swapBtn.addEventListener('click', () => {
        const tempValue = fromSelect.value;
        const tempSearch = fromSearch.value;
        
        fromSelect.value = toSelect.value;
        fromSearch.value = toSearch.value;
        toSelect.value = tempValue;
        toSearch.value = tempSearch;
        
        if (amountInput.value !== '') {
            convertCurrency();
        }
    });

    // Function to reset search when a selection is made
    function resetSearch(searchInput, selectElement) {
        searchInput.value = '';
        filterCurrencies(searchInput, selectElement);
    }

    // Add event listeners for selection changes
    fromSelect.addEventListener('change', () => resetSearch(fromSearch, fromSelect));
    toSelect.addEventListener('change', () => resetSearch(toSearch, toSelect));

    // Convert currency
    async function convertCurrency() {
        const amount = amountInput.value;
        const fromCurrency = fromSelect.value;
        const toCurrency = toSelect.value;

        if (amount <= 0 || isNaN(amount)) {
            alert('Please enter a valid amount');
            return;
        }

        try {
            // Using Exchange Rate API (you'll need to sign up for an API key)
            const response = await fetch(`https://api.exchangerate-api.com/v4/latest/${fromCurrency}`);
            const data = await response.json();
            
            const rate = data.rates[toCurrency];
            const convertedAmount = (amount * rate).toFixed(2);
            
            resultDiv.innerHTML = `
                <p>${amount} ${fromCurrency} =</p>
                <h2>${convertedAmount} ${toCurrency}</h2>
            `;
        } catch (error) {
            resultDiv.innerHTML = '<p>Error: Could not convert currency</p>';
            console.error('Error:', error);
        }
    }

    // Add event listener to convert button
    convertBtn.addEventListener('click', convertCurrency);

    // Add event listener for Enter key
    amountInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            convertCurrency();
        }
    });
}); 