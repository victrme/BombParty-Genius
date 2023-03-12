import words from 'an-array-of-french-words'

window.onload = () => {
	const dict: any = words
	const resultatDOM = document.querySelector('.resultat') as HTMLParagraphElement
	const tutorialDOM = document.querySelector('.tutorial') as HTMLDivElement
	const tutoinputDOM = tutorialDOM.querySelector('.tuto_input') as HTMLParagraphElement
	const input = <HTMLInputElement>document.querySelector('.chars_input')
	const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)

	let count = 0
	let repCount = 0
	let keypressTime = 0
	let lastLength = 0
	let arrayDeReponses: string[] = []

	// Fini chargement
	input.classList.remove('loading')
	input.value = ''

	if (isMobile) {
		tutoinputDOM.innerText = 'écris en haut, le plus petit mot est trouvé'
		input.classList.add('onMobile')
	}

	// Charge le tuto si pas déjà supprimé
	if (!localStorage.closeTutorial) {
		tutorialDOM.className = 'tutorial open'

		document.querySelector('.tutorial button')?.addEventListener('click', () => {
			localStorage.closeTutorial = true
			tutorialDOM.className = 'tutorial'
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
			resultatDOM.innerText = ''
			arrayDeReponses = tempReponses.sort((a, b) => a.length - b.length)
			displayFoundWord(arrayDeReponses[0], chars)
		}
	}

	// Coupe le résultat en 3 pour highlight l'input
	function displayFoundWord(result: string, chars?: string) {
		resultatDOM.innerText = ''

		if (result !== undefined) {
			const searchChar = chars !== undefined ? chars : input.value
			const splitWord = [
				result.slice(0, result.indexOf(searchChar)),
				searchChar,
				result.slice(result.indexOf(searchChar) + searchChar.length, result.length),
			]

			splitWord.forEach((str) => {
				const span = document.createElement('span')
				span.innerText = str
				resultatDOM.appendChild(span)
			})
		} else {
			resultatDOM.innerText = ' ... '
		}
	}

	function findMoreWords() {
		repCount++
		const repsLen = arrayDeReponses.length
		const addDots = () =>
			Array((repCount - repsLen) % 4)
				.fill('.')
				.join('')

		if (repsLen > 0)
			repCount >= repsLen
				? (resultatDOM.innerText = 'plus de mots' + addDots())
				: displayFoundWord(arrayDeReponses[repCount])
	}

	// Efface les anciens chars après 2s
	// keydown pour éviter un effacement saccadé
	input.onkeydown = (e) => {
		const retourApresDeuxSec = keypressTime > 0 && Date.now() - keypressTime > 2000 && e.keyCode === 8

		if (retourApresDeuxSec) {
			arrayDeReponses = []
			resultatDOM.innerText = 'encore une fois !'
			input.value = ''
		}
	}

	input.onkeypress = (e) => {
		const key = e.keyCode
		const espace = key === 32
		const lettre = (key > 96 && key < 122) || (key > 223 && key < 246)

		if (espace) {
			findMoreWords()
			return false
		} else if (lettre) {
			searchForWords(input.value + e.key)
		} else {
			return false
		}
	}

	document.addEventListener('keypress', () => input.focus())
}
