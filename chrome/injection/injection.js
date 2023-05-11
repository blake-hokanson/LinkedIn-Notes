console.log("injection.js loaded");

const htmlToElement = (html) => {
  const template = document.createElement("template");
  html = html.trim();
  template.innerHTML = html;
  return template.content.firstChild;
};

const ButtonOnClick = () => {
  const img = document.getElementsByClassName("pv-top-card--photo text-align-left");
  if (img) {
    img[0].style.zIndex = 0;
  }

  const path = window.location.pathname; // should be /in/name/
  const pathArray = path.split("/");
  const userName = pathArray[2];

  document.getElementById("NotesDropdown").classList.add("show");

  chrome.storage.local.get("notes", (result) => {
    notes = JSON.parse(result.notes);
    if (notes[userName]) {
      document.getElementById("NotesRelationship").value = notes[userName]["r"];
      document.getElementById("NotesOther").value = notes[userName]["o"];
    }
  });
};

const CloseNotes = () => {
  const path = window.location.pathname; // should be /in/name/
  const pathArray = path.split("/");
  const userName = pathArray[2];
  chrome.storage.local.get("notes", (result) => {
    notes = JSON.parse(result.notes);
    notes[userName] = {};
    notes[userName]["r"] = document.getElementById("NotesRelationship").value;
    notes[userName]["o"] = document.getElementById("NotesOther").value;

    chrome.storage.local.set({ notes: JSON.stringify(notes) });

    document.getElementById("NotesDropdown").classList.remove("show");
    console.log("Closed Notes");
  });
};

const CreateButtonObject = (wrapper) => {
  const html = `
    <div>
      <button class="artdeco-button artdeco-button--2 artdeco-button--primary ember-view NotesPart" id=NotesBtn>
        <span class="artdeco-button__text NotesPart">Notes</span>
      </button>

      <div id="NotesDropdown" class="dropdown-content NotesPart">
        <div margin="15px" padding="15px" class="NotesPart">
          <h1 class="text-heading-xlarge t-24 v-align-middle break-words m NotesPart" display="block">Notes:</h1>
          <h2 class="text-heading-xlarge t-24 v-align-middle break-word m NotesPart" display="block">Relationship:</h2>
          <textarea id="NotesRelationship" class="NotesPart"></textarea>
          <h2 class="text-heading-xlarge t-24 v-align-middle break-words m NotesPart" >Other Notes:</h2>
          <textarea id="NotesOther" class="NotesPart"></textarea>
        </div>
      </div>
    </div>
  `;
  const element = htmlToElement(html);
  wrapper.appendChild(element);

  document.getElementById("NotesBtn").addEventListener("click", ButtonOnClick);

  window.onclick = (event) => {
    if (!event.target.matches(".NotesPart")) {
      CloseNotes();
    }
  };
};

const AwaitButton = (n) => {
  const wrapper = document.getElementsByClassName("pvs-profile-actions");
  if (wrapper && wrapper[0] && wrapper[0].appendChild) {
    const button = CreateButtonObject(wrapper[0]);

    console.log("Button Found");
  } else {
    if (n > 0) {
      setTimeout(() => AwaitButton(n - 1), 25);
    } else {
      console.log("Not Loaded!!!");
    }
  }
};

const observer = new MutationObserver((mutations) => {
  if (document.querySelector(".pvs-profile-actions") && !document.getElementById("NotesBtn")) {
    const path = window.location.pathname; // should be /in/name/
    const pathArray = path.split("/");
    const pathName = pathArray[1];

    if (pathName === "in") {
      AwaitButton(200);
      //waitForElm("ember132"); //waits for last button
    }
  }
});

observer.observe(document.body, {
  childList: true,
  subtree: true,
});
