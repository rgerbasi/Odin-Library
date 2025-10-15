
const myLibrary = [];

const libraryDisplay = document.querySelector('.library');
const newBookButton = document.querySelector('.header > button');
console.log(newBookButton);

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
        libraryDisplay.appendChild(createCard(book));
    }
}

function preloadLibrary() {
    addBookToLibrary({ 'title': 'Dungeon Crawler Carl','pages': 464, 'author': 'Matt Dinniman','read' : true,});
    addBookToLibrary({'title': 'Carl\'s Doomsday Scenario','pages': 384, 'author': 'Matt Dinniman','read' : false,});
    addBookToLibrary({'title': 'Hunger Games','pages': 384,'author': 'Suzanne Collins','read' : true,});
    addBookToLibrary({'title': 'The Alchemist','pages': 197,'author': 'Paulo Coelho','read' : true,});
}

const svgNamespace = "http://www.w3.org/2000/svg";

// trying to separate concerns
function createCard(book) {
    let nodes = createCardNodes();
    nodes = setAttributes(book, nodes);
    return assembleNodes(nodes);
}
function createCardNodes() {
    let nodes = {};
    nodes['bookcard'] = document.createElement('div');
    nodes['info-wrapper'] = document.createElement('div');
    nodes['title'] = document.createElement('div');
    nodes['hr'] = document.createElement('hr');
    nodes['info'] = document.createElement('div');
    nodes['button-wrapper'] = document.createElement('div');
    let buttons = [];
    buttons.push(
        {btnNode: createSVGButton('#icon-close'), type: 'delete'},
        {btnNode: createSVGButton('#icon-pencil'), type: 'edit'}
    );
    nodes['buttons'] = buttons;
    return nodes;
}
function setAttributes(book, nodes) {
    nodes['bookcard'].classList.add('bookcard');
    nodes['bookcard'].setAttribute('data-book-id', book.id);
    nodes['info-wrapper'].classList.add('info-wrapper');
    nodes['title'].classList.add('title');
    nodes['title'].innerText = capitalize(book.title);
    nodes['info'].classList.add('info');
    nodes['info'].innerText = book.info();
    nodes['button-wrapper'].classList.add('button-wrapper');
    addButtonListeners(nodes['buttons']);
    return nodes;
}
function assembleNodes(nodes) {
    for ( button of nodes['buttons']) {
        nodes['button-wrapper'].appendChild(button.btnNode);
    }
    nodes['info-wrapper'].appendChild(nodes['title']);
    nodes['info-wrapper'].appendChild(nodes['hr']);
    nodes['info-wrapper'].appendChild(nodes['info']);
    nodes['bookcard'].appendChild(nodes['info-wrapper']);
    nodes['bookcard'].appendChild(nodes['button-wrapper']);
    return nodes['bookcard'];
}

function addButtonListeners(buttons) {
    console.log(buttons);
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