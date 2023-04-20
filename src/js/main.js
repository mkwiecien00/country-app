const continentSelect = document.querySelector('#continent')
const amountInput = document.querySelector('#amount')

const error = document.querySelector('.error-text')

const clearAllBtn = document.querySelector('.clear')
const submitBtn = document.querySelector('.submit')

const countryResults = document.querySelector('.country__results')
const countryBox = document.querySelector('.country__box')

const modalShadow = document.querySelector('.modal-shadow')
const closeModalBtn = document.querySelector('.close')

const countryName = document.querySelector('.name')
const capital = document.querySelector('.capital')
const population = document.querySelector('.population')
const currency = document.querySelector('.currency')
const subregion = document.querySelector('.subregion')
const languages = document.querySelector('.languages')

const loader = document.querySelector('.loader')

let amount
let validAmount
let continentCode
let countries
let countryCard
let countryCode
let ID = 0
let divsArr = []
let randomIndex
let randomCountry
let chosenCountry
let alphabeticalArr = []
let code

const URL = 'https://countries.trevorblades.com/graphql'

const checkForm = () => {
	amount = parseInt(amountInput.value)
	validAmount = amount >= 2 && amount <= 10
	if (validAmount) {
		if (continentSelect.value !== 'none') {
			clearInputs()
			createResults()
		} else {
			error.textContent = 'Please complete all fields correctly.'
		}
	} else {
		clearInputs()
		error.textContent = 'Please complete all fields correctly.'
	}
}

const queryFetch = (query, variables) => {
	return fetch(URL, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			query: query,
			variables: variables,
		}),
	})
		.then(res => res.json())
		.catch(() => (error.textContent = 'Something went wrong. Please try again later!'))
}

queryFetch(`
    query {
    continents {
        code
        name
    }
}
`)
	.then(data => {
		data.data.continents.forEach(continent => {
			const option = document.createElement('option')
			option.value = continent.code
			option.innerText = continent.name
			continentSelect.append(option)
		})
	})
	.catch(() => (error.textContent = 'Something went wrong. Please try again later!'))

const getContinentCountries = continentCode => {
	return queryFetch(
		`
    query getCountries($code: ID!) {
        continent(code: $code) {
            countries {
                name
                code
            }
        }
    }
    `,
		{ code: continentCode }
	)
		.then(data => {
			return data.data.continent.countries
		})
		.catch(() => (error.textContent = 'Something went wrong. Please try again later!'))
}

const createResults = () => {
	countryResults.style.display = 'block'
	countryResults.classList.add('results-animation')
	countryBox.innerHTML = ''
	countries.forEach(country => {
		countryCard = document.createElement('div')
		countryCard.classList.add('country__card')
		countryCode = country.code.toLowerCase()
		countryCard.setAttribute('data-code', countryCode)
		countryCard.setAttribute('id', ID)
		countryCard.innerHTML = `
        <img class="country__card-flag" src="https://flagcdn.com/${countryCode}.svg" loading="lazy" alt="flag of a ${country.name}">
        <div class="country__card-info">
            <h3 class="country__card-name">${country.name}</h3>
            <p class="country__card-details" onclick='showModal(${ID})'><i class="fa-solid fa-circle-info"></i></p>
        </div>`
		countryBox.append(countryCard)

		ID++

		divsArr.push(countryCard)
		divsArr.forEach(country => (country.style.display = 'none'))
	})
	showRandomCountries()
	setTimeout(removeResultsAnimation, 1000)
}

const showRandomCountries = () => {
	if (continentCode === 'AN' && amount > 5) {
		error.textContent = 'There are only 5 countries in Antarctica. Displaying 5 countries instead.'
	}

	for (let i = 0; i < amount; i++) {
		randomIndex = Math.floor(Math.random() * divsArr.length)
		randomCountry = divsArr[randomIndex]
		divsArr.splice(randomIndex, 1)
		alphabeticalArr.push(randomCountry)
	}
	alphabeticalArr.sort((a, b) => a.id - b.id)
	alphabeticalArr.forEach(country => {
		country.style.display = 'flex'
	})
}

const removeResultsAnimation = () => {
	countryResults.classList.remove('results-animation')
}

const showModal = id => {
	chosenCountry = document.getElementById(id)

	if (!(modalShadow.style.display === 'block')) {
		modalShadow.style.display = 'block'
		cleanInfo()
		displayMoreInfo(chosenCountry)
	} else {
		modalShadow.style.display = 'none'
	}

	modalShadow.classList.toggle('modal-animation')
}

const displayMoreInfo = async chosenCountry => {
	try {
		code = chosenCountry.getAttribute('data-code')

		loader.style.visibility = 'visible'
		loader.classList.add('loader-animation')

		countryName.textContent = 'your country'

		setTimeout(async () => {
			const response = await fetch(`https://restcountries.com/v3.1/alpha/${code}`)
			const data = await response.json()

			countryName.textContent = data[0].name.common || 'No information found!'

			capital.textContent = data[0].capital ? data[0].capital : 'No information found!'

			population.textContent = data[0].population ? data[0].population : 'No information found!'

			currency.textContent = data[0].currencies
				? `${Object.values(data[0].currencies)[0].name}, ${Object.values(data[0].currencies)[0].symbol}`
				: 'No information found!'

			subregion.textContent = data[0].subregion ? data[0].subregion : 'No information found!'

			languages.textContent = data[0].languages ? Object.values(data[0].languages).join(', ') : 'No information found!'

			loader.style.visibility = 'hidden'
			loader.classList.remove('loader-animation')
		}, 1000)
	} catch {
		error.textContent = 'Something went wrong. Please try again later!'
	}
}

const cleanInfo = () => {
	countryName.textContent = ''
	capital.textContent = ''
	population.textContent = ''
	currency.textContent = ''
	subregion.textContent = ''
	languages.textContent = ''
}

const clearInputs = () => {
	error.textContent = ''
	countryBox.innerHTML = ''
	countryResults.style.display = 'none'
	divsArr = []
	alphabeticalArr = []
}

const clearAllInputs = () => {
	continentSelect.selectedIndex = 0
	amountInput.value = ''
	clearInputs()
}

const enterCheck = e => {
	if (e.key === 'Enter') {
		checkForm()
	}
}

continentSelect.addEventListener('change', async e => {
	try {
		continentCode = e.target.value
		countries = await getContinentCountries(continentCode)
	} catch {
		error.textContent = 'Something went wrong. Please try again later!'
	}
})
amountInput.addEventListener('keyup', enterCheck)
closeModalBtn.addEventListener('click', showModal)
window.addEventListener('click', e => (e.target === modalShadow ? showModal() : false))
clearAllBtn.addEventListener('click', clearAllInputs)
submitBtn.addEventListener('click', checkForm)
