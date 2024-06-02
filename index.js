let row = 1
let square = 0
let word = ""
let correctWord = ""

function validKey(key) {
    let test = /^[a-zA-z]$/.test(key)

    if (test) {
        addKeyToSquare(key)
    } else if (key === "Enter") {
        validateRow()
    } else if (key === "Backspace") {
        deleteSquareKey()
    }
}

async function validateRow() {
    if (word.length === 5) {
        const isWord = await validateWord()
        if (isWord) {
            isCorrectWord()
        } else {
            let children = getChildren()

            Array.from(children).forEach(child => {
                child.classList.add("error")
            });

            setTimeout(() => {
                Array.from(children).forEach(child => {
                    child.classList.remove("error")
                });
            }, 1000)
        }
    }
}

async function validateWord() {
    const response = await fetch("https://words.dev-apis.com/validate-word", {
        method: "POST",
        body: JSON.stringify({ word })
    })

    if (response.status >= 200 && response.status <= 300) {
        const payload = await response.json()
        return payload.validWord
    }
}

function addKeyToSquare(key) {
    let children = getChildren()

    children[square].innerText = key.toUpperCase()

    if (square !== 4) {
        square += 1
        word += key

    } else {
        word = word.substring(0, 4) + key
    }
}

function deleteSquareKey() {
    let children = getChildren()
    children[square].innerText = ""

    if (square !== 0) {
        square -= 1
        word = word.slice(0, word.length - 1)
    }
}

function getChildren() {
    let currentRow = document.querySelector(`.row-${row}`)
    return currentRow.children
}

async function init() {
    const response = await fetch("https://words.dev-apis.com/word-of-the-day?random=1")
    if (response.status >= 200 && response.status <= 300) {
        const payload = await response.json()
        correctWord = payload.word
        document
            .querySelector("html")
            .addEventListener("keyup", (event) => {
                validKey(event.key)
            })
    } else {
        alert("The game cannot be played because a random word could not be generated.")
        console.error(response.statusText)
    }
}

init()