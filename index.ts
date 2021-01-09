import words from 'an-array-of-french-words'

window.onload = () => {
    const dict: any = words
    const charsDOM = document.querySelector('.chars')
    const resultatDOM = document.querySelector('.resultat')
    let chars = ''
    let found = false
    let tries = 0

    charsDOM.classList.remove('loading')
    charsDOM.innerHTML = 'prêt !'

    document.addEventListener('keydown', (e) => {
        if (e.key === ' ') {
            chars = '&nbsp;'
        } else if (
            e.key === 'Backspace' ||
            (e.key.match(/[a-zA-Z]/g) !== null && e.key.length < 2)
        ) {
            // Ajoute ou Enleve un charactère
            chars =
                e.key === 'Backspace'
                    ? chars.slice(0, -1)
                    : chars + e.key.toLocaleLowerCase()

            if (chars.length > 1) {
                while (!found && tries < dict.length) {
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

                    if (tries === dict.length) resultatDOM.innerHTML = '...'
                }

                found = false
                tries = 0
            }
        }

        charsDOM.innerHTML = chars.length > 0 ? chars : '&nbsp;'
    })
}
