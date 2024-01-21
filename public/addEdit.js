import { enableInput, inputEnabled, message, setDiv, token } from "./index.js";
import { showNotes } from "./notes.js";

let addEditDiv = null;
let title = null;
let content = null;
let subject = null;
let addingNote = null;
let deletingNote = null;

export const handleAddEdit = () => {
 // let addEditDiv, title, subject, content, addingNote, deletingNote, token;

  addEditDiv = document.getElementById("edit-note");
  title = document.getElementById("title");
  subject = document.getElementById("subject");
  content = document.getElementById("content");
  addingNote = document.getElementById("adding-note");
  deletingNote = document.getElementById("deleting-note");
  const editCancel = document.getElementById("edit-cancel");

  addEditDiv.addEventListener("click", async (e) => {
    if (inputEnabled && e.target.nodeName === "BUTTON") {
      if (e.target === addingNote) {
        enableInput(false);

        let method = "POST";
        let url = "/api/v1/notes";

        // Edit a note
        if (addingNote.textContent === "update") {
          method = "PATCH";
          url = `/api/v1/notes/${addEditDiv.dataset.id}`;
        }

        try {
          const response = await fetch(url, {
            method: method,
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              title: title.value,
              subject: subject.value,
              content: content.value,
            }),
          });

          const data = await response.json();
          if (response.status === 200 || response.status === 201) {
            if (response.status === 200) {
              // a 200 is expected for a successful update
              message.textContent = "The note entry was updated.";
            } else {
              // a 201 is expected for a successful creation of a note
              message.textContent = "The note entry was created.";
            }

            title.value = "";
            subject.value = "";
            content.value = "";

            showNotes();
          } else {
            message.textContent = data.msg;
          }
        } catch (err) {
          console.log(err);
          message.textContent = "A communication error occurred.";
        }

        enableInput(true);

      } else if (e.target === editCancel) {
        message.textContent = "";
        
        showNotes();

      } /*else if (e.target.classList.contains("deleteButton")) {
        // Get the noteId from the data attribute
        const noteId = e.target.dataset.id;

        try {
          const response = await fetch(`/api/v1/notes/${noteId}`, {
            method: "DELETE",
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.status === 204) {
            console.log('Note deleted successfully');
            
            showNotes();

          } else {
            // Handle error
            const data = await response.json();
            console.error('Error deleting Note:', data.msg);
          }
        } catch (err) {
          console.error('A communication error occurred:', err);
        }

        showNotes();
      }*/
    }
  });
};

export const showAddEdit = async (noteId) => {
  if (!noteId) {
    title.value = "";
    subject.value = "";
    content.value = "";
    addingNote.textContent = "add";
    message.textContent = "";

    setDiv(addEditDiv);
  } else {
    enableInput(false);

    try {
      const response = await fetch(`/api/v1/notes/${noteId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (response.status === 200) {
        title.value = data.note.title;
        subject.value = data.note.subject;
        content.value = data.note.content;
        addingNote.textContent = "update";
        message.textContent = "";
        addEditDiv.dataset.id = noteId;

        setDiv(addEditDiv);
      } else {
        // might happen if the list has been updated since last display
        message.textContent = "The note entry was not found";
        showNotes();
      }
    } catch (err) {
      console.log(err);
      message.textContent = "A communications error has occurred.";
      showNotes();
    }

    enableInput(true);
  }
};