window.onload = function () {
	fetch('index.json').then((resp) => resp.json().then((e) => findTheWord(e)))

	function findTheWord(dict) {
		/**
		 *
		 */
		const resultatDOM = document.querySelector('.resultat')
		let chars = ''
		let found = false
		let tries = 0

		document.addEventListener('keydown', (e) => {
			const goodKeys =
				e.key === 'Backspace' ||
				(e.key.match(/[a-zA-Z]/g) !== null && e.key.length === 1)

			if (e.key === ' ') {
				chars = ''
			} else if (goodKeys) {
				//
				// Ajoute ou Enleve un charactère
				chars = e.key === 'Backspace' ? chars.slice(0, -1) : chars + e.key

				console.log(dict)

				if (chars.length > 1) {
					while (!found && tries < dict.length) {
						//
						// Trouve un mot aléatoire dans le dictionnaire
						const reponse =
							dict[Math.floor(Math.random() * Math.floor(dict.length))]

						if (reponse.includes(chars)) {
							found = true
							resultatDOM.innerHTML = ''

							// Coupe le résultat en 3 pour highlight l'input
							const arrStr = [
								reponse.slice(0, reponse.indexOf(chars)),
								chars,
								reponse.slice(
									reponse.indexOf(chars) + chars.length,
									reponse.length
								),
							]

							// Affiche les 3
							arrStr.forEach((str) => {
								const span = document.createElement('span')
								span.innerText = str
								resultatDOM.appendChild(span)
							})
						}

						tries++

						if (tries === dict.length) {
							resultatDOM.innerText = '...'
						}
					}

					found = false
					tries = 0
				}
			}

			document.querySelector('.chars').innerHTML = chars.length > 0 ? chars : ''
		})
	}
}
