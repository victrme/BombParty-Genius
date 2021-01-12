import words from 'an-array-of-french-words'

window.onload = () => {
    const dict: any = words
    const charsDOM = document.querySelector('.chars')
    const resultatDOM = document.querySelector('.resultat')
    let chars = ''
    let tries = 0
    let keypressTime = 0

    charsDOM.classList.remove('loading')
    charsDOM.innerHTML = 'prêt !'

    document.addEventListener('keydown', (e) => {
        //
        // Efface les anciens chars après 2s
        chars = keypressTime > 0 && Date.now() - keypressTime > 2000 ? '' : chars
        keypressTime = Date.now()

        const goodKey =
            e.key === 'Backspace' ||
            (e.key.match(/[a-zA-Z]/g) !== null && e.key.length < 2)

        if (goodKey) {
            // Ajoute ou Enleve un charactère
            chars =
                e.key === 'Backspace'
                    ? chars.slice(0, -1)
                    : chars + e.key.toLocaleLowerCase()

            if (chars.length > 1) {
                let arrayDeReponses: string[] = []

                // Trouve une liste de mots aléatoire dans le dictionnaire
                // Comprenant les chars choisis
                while (tries < dict.length) {
                    const rand = (m: number) => Math.floor(Math.random() * Math.floor(m))
                    const reponse = dict[rand(dict.length)]

                    if (reponse.includes(chars)) arrayDeReponses.push(reponse)
                    tries++
                }

                tries = 0
                resultatDOM.innerHTML = ''

                if (arrayDeReponses.length === 0) {
                    resultatDOM.innerHTML = '...'
                } else {
                    console.log(arrayDeReponses.length)

                    // Cherche le mot le plus petit
                    const filtered = arrayDeReponses.reduce((prev, curr) =>
                        prev.length <= curr.length ? prev : curr
                    )

                    // Coupe le résultat en 3 pour highlight l'input
                    const arrStr = [
                        filtered.slice(0, filtered.indexOf(chars)),
                        chars,
                        filtered.slice(
                            filtered.indexOf(chars) + chars.length,
                            filtered.length
                        ),
                    ]

                    // Affiche les 3
                    arrStr.forEach((str) => {
                        const span = document.createElement('span')
                        span.innerText = str
                        resultatDOM.appendChild(span)
                    })
                }
            }
        } else if (e.key === ' ') {
            chars = ''
        }

        charsDOM.innerHTML = chars.length > 0 ? chars : '&nbsp;'
    })
}
