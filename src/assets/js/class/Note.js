import * as $ from 'jquery';
import { Popup } from './Popup';

export class Note {
    /**
     * Get all available notes from localstorage.
     * 
     * @returns {array}
     */
    getAll() {
        const notes = {...localStorage};
        const keys = Object.keys(notes);
        let notesArray = [];

        keys.forEach((key, index) => {
            notesArray.push(JSON.parse(notes[key]));
        });
        
        return notesArray;
    }

    /**
     * Get HTML for note.
     * 
     * @param {object} note 
     * @returns {html}
     */
    get(note) {
        return $(`
            <form>
                <div class="mb-3">
                    <label class="form-label w-100">
                        Title
                        <input type="text" 
                            class="note-title form-control"
                            value="${note && note.title ? note.title : ''}"
                            ${note ? 'readonly' : ''}>
                    </label>
                </div>
                <div class="mb-3">
                    <label class="form-label w-100">
                        Note
                        <textarea class="note-content form-control" 
                                  id="addNoteContent" 
                                  cols="30" 
                                  rows="10"
                                  ${note ? 'readonly' : ''}
                                  >${note && note.content ? note.content : ''}</textarea>
                    </label>
                </div>
            </form>
        `);
    }

    /**
     * Open the form to add a new note.
     */
    add() {
        const popup = new Popup();
        const form = this.get();
        const addButton = $(`
            <button type="button" 
                class="btn btn-primary float-end px-4">
                Save
            </button>
        `).on('click', function() {
            const title = $('.note-title', $(this).parent()).eq(0).val();
            const content = $('.note-content', $(this).parent()).eq(0).val();
            new Note().create(title, content);
            new Popup().close($('.popup'));
        });

        form.append(addButton);
        popup.show(form, 'Add New');
    }

    /**
     * Save a note to localstorage.
     * 
     * @param {string} title 
     * @param {string} content 
     */
    create(title, content) {
        const date = Date.now();
        const note = {
            id: date,
            date: date,
            title: title,
            content: content,
            marked: false,
        }

        try {
            localStorage.setItem('note-' + note.id, JSON.stringify(note));
            this.show(note.id, note.title, note.date, note.content, note.marked);
        } catch(e) {
            alert(e);
        }
    }

    /**
     * Show a note in the table.
     * 
     * @param {number} id 
     * @param {string} title 
     * @param {number} created 
     * @param {string} content 
     * @param {boolean} marked 
     */
    show(id, title, created, content, marked) {
        const date = new Date(created);
        created = date.toLocaleDateString("lt-LT") + 
                  ' ' + 
                  date.toLocaleTimeString("lt-LT");
        const notesContainer = $('#notesContainer tbody');
        const noteRow = $(`
            <tr id="review-${id}" 
                class="review-note ${marked ? 'table-info' : ''}">
                <td>${title}</td>
            </tr>
        `);
        const viewButton = $(`
            <td class="align-middle">
                <button type="button" 
                    class="btn btn-sm btn-outline-success w-100 view-note">
                    View
                </button>
            </td>
        `).on('click', function() {
            new Note().view(id);
        });
        const markInput = $(`
            <td class="mark-column text-center">
                <input class="form-check-input" 
                       type="checkbox" 
                       ${marked ? 'checked' : ''}> 
            </td>
        `).on('change', function() {
            Note.mark(id);
        });

        noteRow.append(`
            <td>${content}</td>
            <td class="created-column">${created}</td>
        `);
        noteRow.prepend(markInput);
        noteRow.append(viewButton);
        notesContainer.append(noteRow);
    }

    /**
     * Set a note ask marked.
     * 
     * @param {number} id 
     */
    static mark(id) {
        const note = JSON.parse(localStorage.getItem('note-' + id));
        note.marked = !note.marked;

        if (note.marked) {
            $(`#review-${id}`).addClass('table-info');
        } else {
            $(`#review-${id}`).removeClass('table-info');
        }

        localStorage.setItem('note-' + id, JSON.stringify(note));
    }

    /**
     * View a single note.
     * 
     * @param {number} id 
     */
    view(id) {
        const note = JSON.parse(localStorage.getItem('note-' + id));
        const form = this.get(note);
        new Popup().show(form, 'View Note');
    }

    /**
     * Sort notes.
     * 
     * @param {jQuery} element - element that initiates the sorting
     */
    sort(element) {
        // Remove 'selected' class for all sort arrows
        $('.sort .asc').removeClass('selected');
        $('.sort .desc').removeClass('selected');

        // Add 'selected' class for clicked arrow
        element.addClass('selected');

        const allNotes = this.getAll();
        const sortCriteria = element.data('sort-criteria');
        let sortedNotes = allNotes;

        if (element.hasClass('asc')) {
            sortedNotes = allNotes.sort((a, b) => a[sortCriteria] - b[sortCriteria]);
        } else {
            sortedNotes = allNotes.sort((a, b) => b[sortCriteria] - a[sortCriteria]);
        }

        // Render the table with sorted elements
        const notesContainer = $('#notesContainer tbody');
        notesContainer.empty();
        
        sortedNotes.forEach(function(noteData) {
            new Note().show(
                noteData.id, 
                noteData.title, 
                noteData.date, 
                noteData.content, 
                noteData.marked
            );
        });
    }
}