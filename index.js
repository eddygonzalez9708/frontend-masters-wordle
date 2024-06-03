let row = 1
let square = 0
let word = ""
let correctWord = ""
let loading = false
let title = document.querySelector(".title")
let spiral = document.querySelector(".spiral")

async function init() {
    const response = await fetch("https://words.dev-apis.com/word-of-the-day?random=1")
    if (response.status >= 200 && response.status <= 300) {
        const payload = await response.json()
        correctWord = payload.word.toUpperCase()
        document
            .querySelector("html")
            .addEventListener("keyup", validKey)
    } else {
        alert("The game cannot be played because a random word could not be generated.")
        console.error(response.statusText)
    }

    async function validKey(event) {
        if (!spiral.classList.contains("show")) {
            if (/^[a-zA-z]$/.test(event.key)) {
                addKeyToSquare(event.key.toUpperCase())
            } else if (event.key === "Enter" && word.length === 5) {
                await validateRow()
                
                if (word === correctWord) {
                    win()
                } else if (row > 6) {
                    lose()
                }
            } else if (event.key === "Backspace") {
                deleteSquareKey()
            }
        }
    }

    async function validateRow() {
        setLoading(true)
        const isWord = await validateWord()        
        
        if (isWord) {
            submitRow()
        } else {
            let children = getChildren()
    
            Array.from(children).forEach(child => {
                child.classList.add("invalid")
            });
    
            setTimeout(() => {
                Array.from(children).forEach(child => {
                    child.classList.remove("invalid")
                });
            }, 1000)
        }

        setLoading(false)
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
        children[square].innerText = key
    
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
        document.querySelector("html").removeEventListener("keyup", validKey)
        alert("You win!")
        title.classList.add("rainbow")
    }
    
    function lose() {
        alert(`You lose, the word was ${correctWord}`)
        document.querySelector("html").removeEventListener("keyup", validKey)
    }
    
    function submitRow() {
        let children = getChildren()
        let cacheWord = correctWord

        Array.from(children).forEach((child, index) => {
            if (child.innerText === correctWord[index]) {
                child.classList.add("correct")
                cacheWord = cacheWord.substring(0, index) + " " + cacheWord.substring(index + 1)
            }
        })

        Array.from(children).forEach((child, index) => {
            if (!child.classList.contains("correct")) {
                if (cacheWord.indexOf(child.innerText) > -1) {
                    child.classList.add("close")
                    cacheWord = cacheWord.substring(0, index) + " " + cacheWord.substring(index + 1)
                } else {
                    child.classList.add("wrong")
                }
            }
        })
    
        row += 1
        square = 0
        word = ""
    }
    
    function getChildren() {
        let currentRow = document.querySelector(`.row-${row}`)
        return currentRow.children
    }
    
    function setLoading(isLoading) {
       spiral.classList.toggle("show", isLoading)
    }
}

init()