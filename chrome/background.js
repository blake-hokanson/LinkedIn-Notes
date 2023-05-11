console.log("background.js loaded");
chrome.storage.local.get("notes", (result) => {
  if (result.notes === undefined) {
    const notes = { "casey-hokanson": { r: "brother", o: "Hes cool" } };
    chrome.storage.local.set({ notes: JSON.stringify(notes) }, () => {
      console.log("Data saved to local storage");
    });
  }
});
