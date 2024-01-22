import { enableInput, inputEnabled, message, setDiv, token } from "./index.js";
import { showNotes } from "./notes.js";

let addEditDiv = null;
let title = null;
let content = null;
let subject = null;
let addingNote = null;

export const handleAddEdit = () => {

  addEditDiv = document.getElementById("edit-note");
  title = document.getElementById("title");
  subject = document.getElementById("subject");
  content = document.getElementById("content");
  addingNote = document.getElementById("adding-note");
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

      }
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

// Deleting a note
export const deleteNote = async (noteId) => {
  try {
    const response = await fetch(`/api/v1/notes/${noteId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (response.status === 200) {
      message.textContent = "Note deleted successfully.";
      // Refresh the notes display after deleting a note.
      await showNotes();
    } else {
      message.textContent = data.msg;
    }
  } catch (err) {
    console.log(err);
    message.textContent = "An error occurred while deleting the note.";
  }
};