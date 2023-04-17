const continentSelect = document.getElementById('continent')
const amountInput = document.querySelector('#amount')

const error = document.querySelector('.error-text')

const clearAllBtn = document.querySelector('.clear')
const submitBtn = document.querySelector('.submit')

const countryResults = document.querySelector('.country__results')
const countryBox = document.getElementById('country__box')

const modalShadow = document.querySelector('.modal-shadow')
const closeModalBtn = document.querySelector('.close')

const countryName = document.getElementsByClassName('name')
const capital = document.getElementsByClassName('capital')
const population = document.getElementsByClassName('population')
const currency = document.getElementsByClassName('cureency')
const subregion = document.getElementsByClassName('subregion')
const languages = document.getElementsByClassName('languages')

let ID = 0
let validAmount
let usersValue
let countryList = []
let countryCard

const URL = 'https://countries.trevorblades.com/graphql'

const checkForm = () => {
	validAmount = amountInput.value >= 2 && amountInput.value <= 10
	if (validAmount) {
		if (continentSelect.value !== 'none') {
			clearInputs()
			countrySelection()
		} else {
			error.textContent = 'Please complete all fields correctly.'
		}
	} else {
		error.textContent = 'Please complete all fields correctly.'
	}
}

function queryFetch(query, variables) {
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

function getContinentCountries(continentCode) {
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

const showModal = () => {
	if (!(modalShadow.style.display === 'block')) {
		modalShadow.style.display = 'block'
	} else {
		modalShadow.style.display = 'none'
	}

	modalShadow.classList.toggle('modal-animation')
}

function selectValue() {
	usersValue = document.getElementById('amount').value
	console.log(usersValue)
}

const clearInputs = () => {
	continentSelect.selectedIndex = 0
	amountInput.value = ''
	error.textContent = ''
	countryBox.innerHTML = ''
	countryResults.style.display = 'none'
}

continentSelect.addEventListener('change', async e => {
	const continentCode = e.target.value
	const countries = await getContinentCountries(continentCode)
	countryResults.style.display = 'block'
	countryBox.innerHTML = ''
	countries.forEach(country => {
		// const element = document.createElement('div')
		// element.innerText = country.name
		// countryBox.append(element)
		countryCard = document.createElement('div')
		countryCard.classList.add('country__card')
		countryCard.setAttribute('id', ID)
		countryCard.innerHTML = `
        <img class="country__card-flag" src="https://flagcdn.com/${country.code.toLowerCase()}.svg" loading="lazy" alt="flag of a ${
			country.name
		}">

        <div class="country__card-info">
            <h3 class="country__card-name">${country.name}</h3>
            <p class="country__card-details" onclick='showModal()'><i class="fa-solid fa-circle-info"></i></p>
        </div>`
		countryBox.append(countryCard)

		ID++
	})
})

closeModalBtn.addEventListener('click', showModal)
submitBtn.addEventListener('click', checkForm)
clearAllBtn.addEventListener('click', clearInputs)

// TO DO
// MODAL - displaying info of each country (each has its own unique id)
// NUMBER OF DIVS - displaying the number of countries according to the number entered by the user
// LINKING - connecting to the function with validation, when selecting a select and entering a number, only then the proper function will be called
// ADD LOADING INFO
// update readme with instructions
