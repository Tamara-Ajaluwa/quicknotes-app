// DOM Elements
const noteForm = document.getElementById('note-form');
const noteInput = document.getElementById('note-input');
const categoryInput = document.getElementById('note-category');
const errorMessage = document.getElementById('error-message');
const notesList = document.getElementById('notes-list');
const noteCount = document.getElementById('note-count');
const searchInput = document.getElementById('search-input');

// Load notes from local storage or initialize an empty array
let notes = JSON.parse(localStorage.getItem('quicknotes')) || [];

// Initial render
renderNotes(notes);

// Event Listeners
noteForm.addEventListener('submit', addNote);
searchInput.addEventListener('input', searchNotes);

function addNote(e) {
    e.preventDefault();
    const text = noteInput.value.trim();
    const category = categoryInput.value;

    // Validation
    if (text === '') {
        errorMessage.textContent = "Please type a note first.";
        return;
    }
    if (text.length > 200) {
        errorMessage.textContent = "Notes must be 200 characters or fewer.";
        return;
    }

    // Clear error message if valid
    errorMessage.textContent = "";

    // Create note object
    const newNote = {
        id: Date.now().toString(),
        text: text,
        category: category,
        createdAt: new Date().toLocaleString()
    };

    notes.push(newNote);
    saveNotes();
    renderNotes(notes);
    noteForm.reset();
}

function deleteNote(id) {
    notes = notes.filter(note => note.id !== id);
    saveNotes();
    
    // Maintain search filter if a search is active while deleting
    searchNotes(); 
}

function saveNotes() {
    localStorage.setItem('quicknotes', JSON.stringify(notes));
}

function renderNotes(notesToRender) {
    notesList.innerHTML = '';

    // Handle search empty state vs overall empty state
    if (notesToRender.length === 0) {
        if (searchInput.value.trim() !== '') {
            notesList.innerHTML = '<li>No notes match your search.</li>';
        }
    } else {
        notesToRender.forEach(note => {
            const li = document.createElement('li');
            li.className = `note-card category-${note.category.toLowerCase()}`;
            
            li.innerHTML = `
                <p>${note.text}</p>
                <span class="note-category-label">${note.category}</span>
                <span class="note-date">${note.createdAt}</span>
                <button class="delete-btn" onclick="deleteNote('${note.id}')">Delete</button>
            `;
            
            notesList.appendChild(li);
        });
    }

    updateNoteCount();
}

function updateNoteCount() {
    const count = notes.length;
    if (count === 0) {
        noteCount.textContent = "You have no notes yet.";
    } else if (count === 1) {
        noteCount.textContent = "You have 1 note.";
    } else {
        noteCount.textContent = `You have ${count} notes.`;
    }
}

function searchNotes() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    const filteredNotes = notes.filter(note => 
        note.text.toLowerCase().includes(searchTerm)
    );
    renderNotes(filteredNotes);
}