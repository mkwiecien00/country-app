const continentSelect = document.querySelector('#continent')
const amountInput = document.querySelector('#amount')

const error = document.querySelector('.error-text')

const clearAllBtn = document.querySelector('.clear')
const submitBtn = document.querySelector('.submit')

const countryResults = document.querySelector('.country__results')
const countryBox = document.querySelector('country__box')

const modalShadow = document.querySelector('.modal-shadow')
const closeModalBtn = document.querySelector('.close')

const countryName = document.querySelector('.name')
const capital = document.querySelector('.capital')
const population = document.querySelector('.population')
const currency = document.querySelector('.cureency')
const subregion = document.querySelector('.subregion')
const languages = document.querySelector('.languages')

let ID = 0
let validAmount
let usersValue
let selectedContinent
let chosenContinent
let allCountries
let newArr = []
let arr2 = []

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

async function countrySelection() {
	fetch(URL, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			query: `
          query {
            continents {
              code
              name
              countries {
                name
              }
            }
          }
        `,
		}),
	})
		.then(res => res.json())
		.then(data => {
			data.data.continents.forEach(continent => {
				if (selectedContinent === continent.code) {
					chosenContinent = continent
				}
			})

			allCountries = chosenContinent.countries
			allCountries.forEach(country => {
				// console.log(country.name)
				arr2.push(country.name)
			})
			console.log(arr2)
			newArr = arr2.map(el => el.replace('""', ''))
			console.log(newArr)
		})
}

function selectValue() {
	usersValue = document.getElementById('amount').value
	console.log(usersValue)
}

const selectContinent = () => {
	selectedContinent = continent.options[continent.selectedIndex].value
}

const clearInputs = () => {
	continentSelect.selectedIndex = 0
	amountInput.value = ''
	error.textContent = ''
}

submitBtn.addEventListener('click', checkForm)
clearAllBtn.addEventListener('click', clearInputs)
