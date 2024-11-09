// Elementos

const notesContainer = document.querySelector("#notes-container")
const addNoteBtn = document.querySelector(".add-note")
const noteContent = document.querySelector("#note-content")
const searchInput = document.querySelector("#search-input")
const exportBtn = document.querySelector("#export-notes")


// Funções

function showNotes () {
    cleanNotes()
    getNotes().forEach ((note) => {
        const noteElement = createNote(note.id, note.content, note.fixed)
        notesContainer.appendChild(noteElement)
    })
}

function cleanNotes () {
    notesContainer.replaceChildren([])
}

function addNote() {
    const notes = getNotes()

    const noteObject = {
        id: generateId(),
        content: noteContent.value,
        fixed: false,
    }

    const noteElement = createNote(noteObject.id, noteObject.content)
    notesContainer.appendChild(noteElement)
    notes.push(noteObject)

    saveNotes(notes)

    noteContent.value = ""

}

function generateId() {
    return Math.floor(Math.random()*5000)
}


function createNote(id, content, fixed) {
    const element = document.createElement("div")
    element.classList.add("note")

    const textarea = document.createElement("textarea")
    textarea.value = content
    textarea.placeholder = "Adicione algum texto..."
    element.appendChild(textarea)

    const pinIcon = document.createElement("i")
    pinIcon.classList.add(...["bi", "bi-pin"])
    element.appendChild(pinIcon)

    const deleteIcon = document.createElement("i")
    deleteIcon.classList.add(...["bi", "bi-x-lg"])
    element.appendChild(deleteIcon)

    const duplicateIcon = document.createElement("i")
    duplicateIcon.classList.add(...["bi", "bi-file-earmark-plus"])
    element.appendChild(duplicateIcon)
    
    
    if (fixed) {
        element.classList.add("fixed")
        pinIcon.style.color = "#fff"
        pinIcon.style.opacity = "1"
    }

    // Eventos do elemento
    element.querySelector(".bi-pin").addEventListener("click", () => {
        toggleFixNote(id)
    })

    element.querySelector(".bi-x-lg").addEventListener("click", () => {
        deleteNote(id, element)
    })

    element.querySelector(".bi-file-earmark-plus").addEventListener("click", () => {
        copyNote(id)
    })

    element.querySelector("textarea").addEventListener("keyup", (e) => {

        const noteContent = e.target.value

        udpadeNote(id, noteContent)
    })

    // Retorno da criação da nota
    return element
}


function toggleFixNote(id) {
    const notes = getNotes()
    const targetNote = notes.filter((note) => note.id === id)[0]

    targetNote.fixed = !targetNote.fixed
    saveNotes(notes)
    showNotes()
}

function deleteNote(id, element) {
    const notes = getNotes().filter((note) => note.id !== id)
    saveNotes(notes)

    notesContainer.removeChild(element)
    
}

function copyNote(id) {
    const notes = getNotes()
    const targetNote = notes.filter((note) => note.id == id)[0]

    const noteObject = {
        id: generateId(),
        content: targetNote.content,
        fixed: false,
    }

    const noteElement = createNote(noteObject.id, noteObject.content, noteObject.fixed)
    notesContainer.appendChild(noteElement)

    notes.push(noteObject)
    saveNotes(notes)
}


// Local Storage

function getNotes () {
    const notes = JSON.parse(localStorage.getItem("notes") || "[]")
    const orderedNotes = notes.sort((a,b) => a.fixed >b.fixed ? -1:1)

    return orderedNotes
}

function saveNotes(notes) {
    localStorage.setItem("notes", JSON.stringify(notes))
}

function udpadeNote(id, newContent) {
    const notes = getNotes()
    const targetNote = notes.filter((note) => note.id === id)[0]

    targetNote.content = newContent

    saveNotes(notes)
}


function searchNotes(search) {
    const searchResults = getNotes().filter((note) => {
        return note.content.includes(search)
    })

    if (search !== "") {
        cleanNotes()
        searchResults.forEach((note) =>{
            const noteElement = createNote(note.id, note.content)
            notesContainer.appendChild(noteElement)
        })

        return
    }

    cleanNotes()
    showNotes()
}


function exportData() {
    const notes = getNotes()

    const csvString = [
        ["ID", "Conteúdo", "Fixado"],
        ...notes.map((note) => [note.id,note.content,note.fixed]),
    ].map((e) => e.join(",")).join("\n")

    console.log(csvString)
    const element = document.createElement("a")
    element.href = "data:text/csv;charset=utf-8,"+ encodeURI(csvString)
    element.target = "_blank"
    element.download = "notes.csv"
    element.click()
}

// Eventos

addNoteBtn.addEventListener("click", () => addNote())

searchInput.addEventListener("keyup", (e) => {
    
    const search = e.target.value

    searchNotes(search)

})

noteContent.addEventListener("keydown", (e) => {
    if (e.key == "Enter" && noteContent.value) {
        addNote()
    }
})

exportBtn.addEventListener("click", () =>{
    exportData()
})

// Inicialização
showNotes()