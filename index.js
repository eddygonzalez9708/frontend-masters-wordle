let row = 1
let square = 0
let word = ""
let correctWord = ""
let loading = false
let spiral = document.querySelector(".spiral")

function validKey(e) {
    console.log('loading ', loading)
    if (!loading)
        if (/^[a-zA-z]$/.test(e.key)) {
            addKeyToSquare(e.key)
        } else if (e.key === "Enter") {
            loading = true
            spiral.style.visibility = "unset"
            validateRow()
        } else if (e.key === "Backspace") {
            deleteSquareKey()
        }
}

async function validateRow() {
    if (word.length === 5) {
        const isWord = await validateWord()
        if (isWord) {
            if (word === correctWord) {
                win()
            } else {
                submitRow()
            }
        } else if (isWord === false) {
            let children = getChildren()

            Array.from(children).forEach(child => {
                child.classList.add("invalid-word")
            });

            setTimeout(() => {
                Array.from(children).forEach(child => {
                    child.classList.remove("invalid-word")
                });
            }, 1000)
        }
    }

    loading = false
    spiral.style.visibility = "hidden"
}

async function validateWord() {
    const response = await fetch("https://words.dev-apis.com/validate-word", {
        method: "POST",
        body: JSON.stringify({ word })
    })

    if (response.status >= 200 && response.status <= 300) {
        const payload = await response.json()
        return payload.validWord
    } else {
        alert("The game cannot be played because the word submitted could not be validated.")
        console.error(response.statusText)
    }
}

function addKeyToSquare(key) {
    let children = getChildren()
    children[square].innerText = key.toUpperCase()

    if (square === 4) {
        word = word.substring(0, 4) + key
    } else {
        square += 1
        word += key
    }
}

function deleteSquareKey() {
    let children = getChildren()

    if (square !== 0 && !children[square].innerText) {
        square -= 1
    } 

    children[square].innerText = ""
    word = word.slice(0, word.length - 1)
}

function win() {
    let children = getChildren()
    let title = document.querySelector(".title")
    document.querySelector("html").removeEventListener("keyup", validKey)

    alert("You win!")

    Array.from(children).forEach(child => {
        child.style.backgroundColor = "green"
        child.style.color = "white"
    })

    title.classList.add("rainbow")
}

function lose() {
    alert(`You lose, the word was ${correctWord}`)
    document.querySelector("html").removeEventListener("keyup", validKey)
}

function submitRow() {
    let children = getChildren()
    let cache = {}

    Array.from(children).forEach((child, index) => {
        let char = child.innerText.toLowerCase()
        child.style.color = "white"

        if (char === correctWord[index]) {
            child.style.backgroundColor = "green"
        } else {
            const search = correctWord.indexOf(char, cache[char])

            if (search > -1) {
                child.style.backgroundColor = "yellow"
                cache[char] + search + 1
            } else {
                child.style.backgroundColor = "grey"
            }
        }
    })

    if (row === 6) {
        lose()
    } else {
        row += 1
        square = 0
        word = ""
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
            .addEventListener("keyup", validKey)
    } else {
        alert("The game cannot be played because a random word could not be generated.")
        console.error(response.statusText)
    }
}

init()