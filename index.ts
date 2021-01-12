import words from 'an-array-of-french-words'

window.onload = () => {
    const dict: any = words
    const charsDOM = document.querySelector('.chars')
    const resultatDOM = document.querySelector('.resultat')
    const tutorialDOM = document.querySelector('.tutorial')
    let chars = ''
    let count = 0
    let keypressTime = 0

    // Fini chargement
    charsDOM.classList.remove('loading')
    charsDOM.innerHTML = 'prêt !'

    // Charge le tuto si pas déjà supprimé
    if (!localStorage.closeTutorial) {
        tutorialDOM.className = 'tutorial open'

        document.querySelector('.tutorial button').addEventListener('click', () => {
            localStorage.closeTutorial = true
            tutorialDOM.className = 'tutorial'
        })
    }

    document.addEventListener('keydown', (e) => {
        //
        // Efface les anciens chars après 2s
        chars = keypressTime > 0 && Date.now() - keypressTime > 2000 ? '' : chars
        keypressTime = Date.now()

        // Bonnes keys a press
        if (
            e.key === 'Backspace' ||
            (e.key.match(/[a-zA-Z]/g) !== null && e.key.length < 2)
        ) {
            //
            //
            // Ajoute ou Enleve un charactère
            chars =
                e.key === 'Backspace'
                    ? chars.slice(0, -1)
                    : chars + e.key.toLocaleLowerCase()

            if (chars.length > 1) {
                let arrayDeReponses: string[] = []

                // Trouve une liste de mots aléatoire dans le dictionnaire
                // Comprenant les chars choisis
                while (count < dict.length) {
                    if (dict[count].includes(chars)) arrayDeReponses.push(dict[count])
                    count++
                }

                count = 0
                resultatDOM.innerHTML = ''

                if (arrayDeReponses.length === 0) {
                    resultatDOM.innerHTML = '...'
                } else {
                    // Cherche le mot le plus petit
                    const filtered = arrayDeReponses.reduce((prev, curr) =>
                        prev.length <= curr.length ? prev : curr
                    )

                    // Coupe le résultat en 3 pour highlight l'input
                    // Puis l'affiche en span
                    const array = [
                        filtered.slice(0, filtered.indexOf(chars)),
                        chars,
                        filtered.slice(
                            filtered.indexOf(chars) + chars.length,
                            filtered.length
                        ),
                    ].forEach((str) => {
                        const span = document.createElement('span')
                        span.innerText = str
                        resultatDOM.appendChild(span)
                    })
                }
            }
        }

        charsDOM.innerHTML = chars.length > 0 ? chars : '&nbsp;'
    })
}
