
const myLibrary = [];

const libraryDisplay = document.querySelector('.library');

function Book(props = {}) {
    // constructor
    if (!new.target) { throw Error("Must use 'new' operator to call constructor"); }
    this.id = crypto.randomUUID();

    this.title = props.title ?? "";
    this.author = props.author ?? "";
    this.pages = props.pages ?? 0;
    this.read = props.read ?? false;
}
Book.prototype.toggleRead = function () {
        this.read = !this.read;
}
Book.prototype.info = function () {
    let result = capitalize(this.title);
    result += " by " + capitalize(this.author) + ", ";
    result += this.pages + " pages, ";
    result += (this.read ? "has been read" : "not read yet");
    return result;
}

function capitalize(words) {
    if (words == null) return;
    return words.split(" ").map( word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(" ")
}


function addBookToLibrary(props) {
    let book = new Book(props);
    myLibrary.push(book)
    console.log(book.info())
}

function displayBook(book) {
    for (let [key, val] of Object.entries(book)) {
        console.log(key + " " + val);
    }

}

function displayLibrary() {
    for (let book of myLibrary) {
        // displayBook(book);
        // console.log(book);
        createCard(book);
    }
}

function preloadLibrary() {
    addBookToLibrary({ 'title': 'Dungeon Crawler Carl','pages': 464, 'author': 'Matt Dinniman','read' : true,});
    addBookToLibrary({'title': 'Carl\'s Doomsday Scenario','pages': 384, 'author': 'Matt Dinniman','read' : false,});
    addBookToLibrary({'title': 'Hunger Games','pages': 384,'author': 'Suzanne Collins','read' : true,});
    addBookToLibrary({'title': 'The Alchemist','pages': 197,'author': 'Paulo Coelho','read' : true,});
}

const svgNamespace = "http://www.w3.org/2000/svg";
function createCard(book) {
    let divbookspace = document.createElement("div");
    divbookspace.classList.add('bookspace');
    let divbookcard = document.createElement("div");
    divbookcard.classList.add('bookcard');
    let ul = document.createElement("ul");

    let editButton = createSVGButton("#icon-pencil");
    let deleteButton = createSVGButton("#icon-close");
  
    for (let [key, val] of Object.entries(book)) {
        if (key === "id") {
            // unsure of where to put id's to remove later
            divbookspace.setAttribute("data-bookID", val)
            editButton.setAttribute("data-bookID", val)
            deleteButton.setAttribute("data-bookID", val)
        }  else {
            let li = document.createElement("li");
            li.classList.add(key)
            let textContent = key.charAt(0).toUpperCase() + key.slice(1) + ": " + val
            if (key === "read") {
                textContent = val ? "Have Read It" : "Have Not Read it";
                let className = val  ? "read" : "unread";
                divbookcard.classList.add(className); //style for border
            }

            li.innerText = textContent;
            ul.appendChild(li); 
            // appended child to list and append a little line for the title
            if (key === "title") {
                ul.appendChild(document.createElement("hr"))
            }
           
        }
    }
    // finish appending children for card
    divbookcard.append(ul, editButton, deleteButton);
    divbookspace.appendChild(divbookcard);
    libraryDisplay.appendChild(divbookspace);
}

function createSVGButton(id) {
    let btn = document.createElement("button");
    let svg = document.createElementNS(svgNamespace, 'svg')
    svg.setAttribute("viewBox", "0 0 24 24");

    let use = document.createElementNS(svgNamespace, 'use')
    use.setAttributeNS(null,'href', id)
    svg.appendChild(use);
    btn.appendChild(svg);
    return btn;
}

// calling
preloadLibrary();
displayLibrary();