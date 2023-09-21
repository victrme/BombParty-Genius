import '@fontsource-variable/source-code-pro'

window.onload = async () => {
	const resultatDOM = document.querySelector('.resultat') as HTMLParagraphElement
	const tutorialDOM = document.querySelector('.tutorial') as HTMLDivElement
	const tutoinputDOM = document.querySelector('.tuto_input') as HTMLParagraphElement
	const inputDOM = document.querySelector('.chars_input') as HTMLInputElement

	const loadtimeout = setTimeout(() => {
		if (inputDOM) {
			inputDOM.classList.add('loading')
			inputDOM.value = 'le dico charge'
		}
	}, 1000)

	const dict: any = await import('an-array-of-french-words')
	const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)

	let count = 0
	let repCount = 0
	let keypressTime = 0
	let lastLength = 0
	let arrayDeReponses: string[] = []

	// Fini chargement
	clearTimeout(loadtimeout)
	inputDOM?.classList.remove('loading')
	inputDOM.style.opacity = '1'
	inputDOM.value = ''

	if (isMobile) {
		tutoinputDOM.innerText = 'écris en haut, le plus petit mot est trouvé'
		inputDOM?.classList.add('onMobile')
	}

	// Charge le tuto si pas déjà supprimé
	if (!localStorage.closeTutorial) {
		tutorialDOM?.classList.add('open')

		document.querySelector('.tutorial button')?.addEventListener('click', () => {
			localStorage.closeTutorial = true
			tutorialDOM?.classList.remove('open')
		})
	}

	function searchForWords(chars: string) {
		keypressTime = Date.now()

		if (chars.length > 1) {
			const tempDict = arrayDeReponses.length > 0 && chars.length > lastLength ? arrayDeReponses : dict
			let tempReponses: string[] = []

			if (tempDict.length > 0) {
				while (count < tempDict.length) {
					if (tempDict[count].includes(chars)) tempReponses.push(tempDict[count])
					count++
				}
			}

			count = 0
			repCount = 0
			lastLength = chars.length
			resultatDOM.textContent = ''
			arrayDeReponses = tempReponses.sort((a, b) => a.length - b.length)
			displayFoundWord(arrayDeReponses[0])
		}
	}

	// Coupe le résultat en 3 pour highlight l'input
	function displayFoundWord(result: string) {
		const keyChars = inputDOM.value

		resultatDOM.textContent = ''

		if (result && keyChars.length > 1) {
			const wordStart = result.slice(0, result.indexOf(keyChars))
			const wordEnd = result.slice(result.indexOf(keyChars) + keyChars.length, result.length)

			;[wordStart, keyChars, wordEnd].forEach((str) => {
				const span = document.createElement('span')
				span.textContent = str
				resultatDOM?.appendChild(span)
			})

			return
		}

		resultatDOM.textContent = ' ... '
	}

	function findMoreWords() {
		repCount++

		const addDots = () =>
			Array((repCount - arrayDeReponses.length) % 4)
				.fill('.')
				.join('')

		if (arrayDeReponses.length === 0) {
			resultatDOM.textContent = 'pas de mots' + addDots()
			return
		}

		if (arrayDeReponses.length <= repCount) {
			resultatDOM.textContent = 'plus de mots' + addDots()
			return
		}

		displayFoundWord(arrayDeReponses[repCount])
	}

	inputDOM?.addEventListener('input', (e) => {
		// Efface les anciens chars après 2s
		const inputType = (e as InputEvent).inputType
		const lastPressTime = Date.now() - keypressTime > 2000
		const retourApresDeuxSec = keypressTime > 0 && lastPressTime && inputType === 'deleteContentBackward'

		if (retourApresDeuxSec) {
			arrayDeReponses = []
			inputDOM.value = ''
			resultatDOM.textContent = 'encore une fois !'
		}

		if (inputType.match(/insertText|deleteContentBackward/g)) {
			searchForWords(inputDOM.value)
			return
		}
	})

	inputDOM.addEventListener('keydown', (e) => {
		if (e.code === 'Space') {
			findMoreWords()
			e.preventDefault()
		}
	})

	document.addEventListener('keydown', () => {
		inputDOM?.focus()
	})
}
