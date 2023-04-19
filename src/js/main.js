const continentSelect = document.getElementById('continent')
const amountInput = document.querySelector('#amount')

const error = document.querySelector('.error-text')

const clearAllBtn = document.querySelector('.clear')
const submitBtn = document.querySelector('.submit')

const countryResults = document.querySelector('.country__results')
const countryBox = document.getElementById('country__box')

const modalShadow = document.querySelector('.modal-shadow')
const closeModalBtn = document.querySelector('.close')

const countryName = document.querySelector('.name')
const capital = document.querySelector('.capital')
const population = document.querySelector('.population')
const currency = document.querySelector('.currency')
const subregion = document.querySelector('.subregion')
const languages = document.querySelector('.languages')

let ID = 0
let countryCode
let chosenCountry
let amount
let validAmount
let usersValue
let countryCard
let continentCode
let countries
let divsArr = []
let randomIndex
let randomCountry

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
	}).then(res => res.json())
}

queryFetch(`
    query {
    continents {
        code
        name
    }
}
`).then(data => {
	data.data.continents.forEach(continent => {
		const option = document.createElement('option')
		option.value = continent.code
		option.innerText = continent.name
		continentSelect.append(option)
	})
})

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
	).then(data => {
		return data.data.continent.countries
	})
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
	for (let i = 0; i < amount; i++) {
		randomIndex = Math.floor(Math.random() * divsArr.length)
		randomCountry = divsArr[randomIndex]
		divsArr.splice(randomIndex, 1)
		randomCountry.style.display = 'flex'
	}
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
	const code = chosenCountry.getAttribute('data-code')

	const response = await fetch(`https://restcountries.com/v3.1/alpha/${code}`)
	const data = await response.json()

	countryName.textContent = data[0].name.common
	capital.textContent = data[0].capital
	population.textContent = data[0].population
	currency.textContent = `${Object.values(data[0].currencies)[0].name} , ${Object.values(data[0].currencies)[0].symbol}`
	subregion.textContent = data[0].subregion
	languages.textContent = Object.values(data[0].languages).join(', ')
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
	continentSelect.selectedIndex = 0
	amountInput.value = ''
	error.textContent = ''
	countryBox.innerHTML = ''
	countryResults.style.display = 'none'
	divsArr = []
}

continentSelect.addEventListener('change', async e => {
	continentCode = e.target.value
	countries = await getContinentCountries(continentCode)
})

closeModalBtn.addEventListener('click', showModal)
window.addEventListener('click', e => (e.target === modalShadow ? showModal() : false))
submitBtn.addEventListener('click', checkForm)
clearAllBtn.addEventListener('click', clearInputs)
