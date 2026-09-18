/* =====================================================
   DARK MODE
===================================================== */

const themeButton =
    document.getElementById("themeButton");


const savedTheme =
    localStorage.getItem("theme");


if (savedTheme === "dark") {

    document.body.classList.add("dark-mode");

    if (themeButton) {

        themeButton.textContent = "☀";

    }

}


if (themeButton) {

    themeButton.addEventListener(
        "click",
        function () {

            document.body.classList.toggle(
                "dark-mode"
            );


            if (
                document.body.classList.contains(
                    "dark-mode"
                )
            ) {

                localStorage.setItem(
                    "theme",
                    "dark"
                );

                themeButton.textContent = "☀";

            } else {

                localStorage.setItem(
                    "theme",
                    "light"
                );

                themeButton.textContent = "☾";

            }

        }
    );

}


/* =====================================================
   JOURNAL ELEMENTS
===================================================== */

const entryTitle =
    document.getElementById("entryTitle");


const entryText =
    document.getElementById("entryText");


const saveEntry =
    document.getElementById("saveEntry");


const cancelEdit =
    document.getElementById("cancelEdit");


const entriesContainer =
    document.getElementById("entriesContainer");


const formTitle =
    document.getElementById("formTitle");


const favoritesFilter =
    document.getElementById("favoritesFilter");


/* =====================================================
   JOURNAL DATA
===================================================== */

let editingEntryId = null;

let showOnlyFavorites = false;


let journalEntries =
    JSON.parse(
        localStorage.getItem("liaJournal")
    ) || [];


/* =====================================================
   INITIAL DISPLAY
===================================================== */

if (entriesContainer) {

    displayEntries();

}


/* =====================================================
   SAVE ENTRY
===================================================== */

if (saveEntry) {

    saveEntry.addEventListener(
        "click",
        function () {

            const title =
                entryTitle.value.trim();


            const text =
                entryText.value.trim();


            if (
                title === "" ||
                text === ""
            ) {

                alert(
                    "Write something first ♡"
                );

                return;

            }


            /* EDIT */

            if (
                editingEntryId !== null
            ) {

                const entry =
                    journalEntries.find(
                        item =>
                            item.id ===
                            editingEntryId
                    );


                if (entry) {

                    entry.title = title;

                    entry.text = text;

                }


                editingEntryId = null;


                formTitle.textContent =
                    "write something ♡";


                saveEntry.textContent =
                    "save entry ♡";


                cancelEdit.classList.add(
                    "hidden"
                );

            }


            /* NEW ENTRY */

            else {

                const newEntry = {

                    id: Date.now(),

                    title: title,

                    text: text,

                    date:
                        new Date().toLocaleDateString(
                            "en-GB",
                            {
                                day: "numeric",
                                month: "long",
                                year: "numeric"
                            }
                        ),

                    favorite: false

                };


                journalEntries.unshift(
                    newEntry
                );

            }


            saveJournal();


            entryTitle.value = "";

            entryText.value = "";


            displayEntries();

        }
    );

}


/* =====================================================
   SAVE JOURNAL TO LOCAL STORAGE
===================================================== */

function saveJournal() {

    localStorage.setItem(
        "liaJournal",
        JSON.stringify(
            journalEntries
        )
    );

}


/* =====================================================
   DISPLAY ENTRIES
===================================================== */

function displayEntries() {

    if (!entriesContainer) {
        return;
    }


    entriesContainer.innerHTML = "";


    let entriesToShow =
        journalEntries;


    if (showOnlyFavorites) {

        entriesToShow =
            journalEntries.filter(
                entry =>
                    entry.favorite === true
            );

    }


    if (
        entriesToShow.length === 0
    ) {

        entriesContainer.innerHTML = `

            <div class="empty-journal">

                <p>
                    ${
                        showOnlyFavorites
                            ? "you don't have any favorite pages yet ♡"
                            : "your pages are still waiting for you... ♡"
                    }
                </p>

            </div>

        `;

        return;

    }


    entriesToShow.forEach(
        function (entry) {

            const entryElement =
                document.createElement(
                    "article"
                );


            entryElement.classList.add(
                "entry-card"
            );


            if (entry.favorite) {

                entryElement.classList.add(
                    "favorite"
                );

            }


            entryElement.innerHTML = `

                <button
                    class="favorite-entry-button"
                    onclick="toggleFavorite(${entry.id})"
                    title="add to favorites"
                >
                    ${
                        entry.favorite
                            ? "♥"
                            : "♡"
                    }
                </button>


                <p class="entry-date">
                    ${entry.date}
                </p>


                <h3>
                    ${escapeHTML(
                        entry.title
                    )}
                </h3>


                <p class="entry-content">
                    ${escapeHTML(
                        entry.text
                    )}
                </p>


                <div class="entry-actions">

                    <button
                        onclick="editEntry(${entry.id})"
                    >
                        edit
                    </button>


                    <button
                        onclick="deleteEntry(${entry.id})"
                    >
                        delete
                    </button>

                </div>

            `;


            entriesContainer.appendChild(
                entryElement
            );

        }
    );

}


/* =====================================================
   TOGGLE FAVORITE
===================================================== */

function toggleFavorite(id) {

    const entry =
        journalEntries.find(
            item =>
                item.id === id
        );


    if (!entry) {
        return;
    }


    entry.favorite =
        !entry.favorite;


    saveJournal();


    displayEntries();

}


/* =====================================================
   FAVORITES FILTER
===================================================== */

if (favoritesFilter) {

    favoritesFilter.addEventListener(
        "click",
        function () {

            showOnlyFavorites =
                !showOnlyFavorites;


            if (showOnlyFavorites) {

                favoritesFilter.classList.add(
                    "active"
                );

                favoritesFilter.textContent =
                    "♥ show all pages";

            } else {

                favoritesFilter.classList.remove(
                    "active"
                );

                favoritesFilter.textContent =
                    "♡ show favorites";

            }


            displayEntries();

        }
    );

}


/* =====================================================
   EDIT ENTRY
===================================================== */

function editEntry(id) {

    const entry =
        journalEntries.find(
            item =>
                item.id === id
        );


    if (!entry) {
        return;
    }


    entryTitle.value =
        entry.title;


    entryText.value =
        entry.text;


    editingEntryId = id;


    formTitle.textContent =
        "editing a little thought ♡";


    saveEntry.textContent =
        "save changes ♡";


    cancelEdit.classList.remove(
        "hidden"
    );


    window.scrollTo({

        top: 300,

        behavior: "smooth"

    });

}


/* =====================================================
   CANCEL EDIT
===================================================== */

if (cancelEdit) {

    cancelEdit.addEventListener(
        "click",
        function () {

            editingEntryId = null;


            entryTitle.value = "";

            entryText.value = "";


            formTitle.textContent =
                "write something ♡";


            saveEntry.textContent =
                "save entry ♡";


            cancelEdit.classList.add(
                "hidden"
            );

        }
    );

}


/* =====================================================
   DELETE ENTRY
===================================================== */

function deleteEntry(id) {

    const confirmation =
        confirm(
            "Are you sure you want to delete this page? ♡"
        );


    if (!confirmation) {
        return;
    }


    journalEntries =
        journalEntries.filter(
            item =>
                item.id !== id
        );


    saveJournal();


    displayEntries();

}


/* =====================================================
   SECURITY
===================================================== */

function escapeHTML(text) {

    const div =
        document.createElement(
            "div"
        );


    div.textContent = text;


    return div.innerHTML;

}