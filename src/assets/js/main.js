import * as $ from 'jquery';
import {Note} from './class/Note.js';

const currentYear = new Date;
$('.current-year').text(currentYear.getFullYear());

$(function() {
    for (const key in localStorage) {
        // Check if item in localstorage is a note
        if (key.match(/note-\d+/gm)) {
            const noteData = JSON.parse(localStorage.getItem(key));
            new Note().show(
                noteData.id, 
                noteData.title, 
                noteData.date, 
                noteData.content, 
                noteData.marked
            );
        }
    }
    $('#addNote').on('click', function() {
        const note = new Note();
        note.add();
    });
    $('#createNote').on('click', function() {
        const title = $('#noteTitle').eq(0).val();
        const content = $('#noteContent').eq(0).val();
        new Note().create(title, content);
    });
    $('.sort .sort-icon').on('click', function() {
        new Note().sort($(this));
    });
});