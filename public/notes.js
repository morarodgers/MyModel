import {
  inputEnabled,
  setDiv,
  message,
  setToken,
  token,
  enableInput,
} from "./index.js";
import { showLoginRegister } from "./loginRegister.js";
import { showAddEdit } from "./addEdit.js";
import { deleteNote } from "./addEdit.js";

let notesDiv = null;
let notesTable = null;
let notesTableHeader = null;

export const handleNotes = () => {
  notesDiv = document.getElementById("notes");
  const logoff = document.getElementById("logoff");
  const addNote = document.getElementById("add-note");
  notesTable = document.getElementById("notes-table");
  notesTableHeader = document.getElementById("notes-table-header");

  notesDiv.addEventListener("click", async (e) => {
    if (inputEnabled && e.target.nodeName === "BUTTON") {
      if (e.target === addNote) {
        showAddEdit(null);
      } else if (e.target === logoff) {
          setToken(null);
          message.textContent = "You have been logged off.";
          notesTable.replaceChildren([notesTableHeader]);

          showLoginRegister();
      } else if (e.target.classList.contains("editButton")) {
          message.textContent = "";
          showAddEdit(e.target.dataset.id);
      } else if (e.target.classList.contains("deleteButton")) {
        message.textContent = "";
        await deleteNote(e.target.dataset.id);
    }
    }
  });
};

export const showNotes = async () => {
  try {
      enableInput(false);
  
      const response = await fetch("/api/v1/notes", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
  
      const data = await response.json();
      let children = [notesTableHeader];
  
      if (response.status === 200) {
        if (data.count === 0) {
          notesTable.replaceChildren(...children); // clear this for safety
        } else {
          for (let i = 0; i < data.notes.length; i++) {
            let rowEntry = document.createElement("tr");
  
            let editButton = `<td><button type="button" class="editButton" data-id=${data.notes[i]._id}>edit</button></td>`;
            let deleteButton = `<td><button type="button" class="deleteButton" data-id=${data.notes[i]._id}>delete</button></td>`;
            let rowHTML = `
              <td>${data.notes[i].title}</td>
              <td>${data.notes[i].subject}</td>
              <td>${data.notes[i].content}</td>
              <div>${editButton}${deleteButton}</div>`;
  
            rowEntry.innerHTML = rowHTML;
            children.push(rowEntry);
          }
          notesTable.replaceChildren(...children);
        }
      } else {
        message.textContent = data.msg;
      }
    } catch (err) {
      console.log(err);
      message.textContent = "A communication error occurred.";
    } finally {
    enableInput(true);
    setDiv(notesDiv);
    }
  };