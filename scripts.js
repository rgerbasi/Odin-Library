
const myLibrary = [];

// DOM Objects
const libraryDisplay = document.querySelector('.library');
const newBookButton = document.querySelector('.header > button');
const dialogNode = document.querySelector('#form-dialog');
const confirmDialogNode = document.querySelector('#confirm-dialog');
const formNode = document.querySelector('form');
const closeButton = document.querySelector('#close');
const submitButton = document.querySelector('#submit');
const noButton = document.querySelector('#no');
const yesButton = document.querySelector('#yes');

let state = {
    deletingBookCard: null,
    editingBookCard: null,
    editMode: false,
}
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
    if (this.author){ result += " by " + capitalize(this.author) + ", ";}
    if (this.pages) {result += this.pages + " pages";}
    
    result += (this.read ? ", has been read" : ", not read yet");
    return result;
}
Book.prototype.update = function (props = {}) {
   
    this.title = props.title ?? "";
    this.author = props.author ?? "";
    this.pages = props.pages ?? 0;
    this.read = props.read ?? false;
}

function addBookToLibrary(props) {
    let book = new Book(props);
    myLibrary.push(book)
    return book;
}

function displayBook(book) {
    for (let [key, val] of Object.entries(book)) {
        console.log(key + " " + val);
    }

}
function displayLibrary() {
    for (let book of myLibrary) {
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
        {btnNode: createSVGButton('#icon-close-outline'), type: 'delete'},
        {btnNode: createSVGButton('#icon-pencil-outline'), type: 'edit'},
        {btnNode: createSVGButton('#icon-eye-outline'), type: 'read'}
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
    for ( let button of nodes['buttons']) {
        button.btnNode.setAttribute('data-type', button.type);
        if (button.type === 'read' ) {
            //read status
            button.btnNode.setAttribute('data-read-state', book.read);
            if (book.read) { button.btnNode.querySelector('use').setAttribute( 'href', '#icon-eye'); }
        }
    }
    return nodes;
}
function assembleNodes(nodes) {
    for ( let button of nodes['buttons']) {
        nodes['button-wrapper'].appendChild(button.btnNode);
    }
    nodes['info-wrapper'].appendChild(nodes['title']);
    nodes['info-wrapper'].appendChild(nodes['hr']);
    nodes['info-wrapper'].appendChild(nodes['info']);
    nodes['bookcard'].appendChild(nodes['info-wrapper']);
    nodes['bookcard'].appendChild(nodes['button-wrapper']);
    return nodes['bookcard'];
}
function createSVGButton(id) {
    let btn = document.createElement("button");
    let svg = document.createElementNS(svgNamespace, 'svg')
    svg.setAttribute("viewBox", "0 0 24 24");

    let use = document.createElementNS(svgNamespace, 'use')
    use.setAttribute('href', id)
    svg.appendChild(use);
    btn.appendChild(svg);
    return btn;
}
function addBookToDisplay(book) {
    libraryDisplay.appendChild(createCard(book));
}

function removeBookFromDisplay(bookCard){
    bookCard.remove();
}
function deleteButtonClicked(bookCard){
    state.deletingBookCard = bookCard;
    confirmDialogNode.showModal();
}
function handleDelete(event) {
    if (!state.deletingBookCard) return;
    let deleteId = state.deletingBookCard.dataset.bookId;
    let indexToRemove = myLibrary.findIndex(book => book.id === deleteId);
    myLibrary.splice(indexToRemove,1);
    removeBookFromDisplay(state.deletingBookCard);
    state.deletingBookCard = null;
    handleClose(event);
}
function editButtonClicked(bookCard){
    let bookId = bookCard.dataset.bookId;
    let book = myLibrary.find( book => bookId == book.id);
    state.editingBookCard = bookCard;
    //prepopulate form for editing
    formNode.querySelector('input#title').value = book.title;
    formNode.querySelector('input#author').value = book.author;
    formNode.querySelector('input#pages').value = book.pages;

    if (book.read) {
        formNode.querySelector('input#read').checked = true;
    } else {
        formNode.querySelector('input#not-read').checked = true;
    }
    state.editMode = true;
    submitButton.textContent = "Update";
    formNode.querySelector('h1').textContent = "Update a Book";
    dialogNode.showModal();
}
function readButtonClicked(bookCard, btn){
    let bookId = bookCard.dataset.bookId;
    let book = myLibrary.find( book => bookId == book.id);
    book.toggleRead();
    updateCard(book, bookCard);
}
function updateCard(book, oldCard) {
    oldCard.replaceWith(createCard(book));
}
function handleNewBook(event) {
    submitButton.textContent = "Add Book";
    formNode.querySelector('h1').textContent = "Add a New Book";
    state.editMode = false;
    dialogNode.showModal();
}

formNode.noValidate = true;
function handleSubmit(event) {
    event.preventDefault();
    
    if (!formNode.checkValidity()) {
        formNode.reportValidity();
        return;
    }
    
    const formData = new FormData(formNode);
    const data = Object.fromEntries(formData.entries());
    data.read = data.read === "true";

    //NEED TO DO SOMETHING FOR SUBMITTING EDIT OR ADDDING NEW
    if (state.editMode) {
        let book = myLibrary.find( book => state.editingBookCard.dataset.bookId == book.id);
        book.update(data);
        updateCard(book, state.editingBookCard);
        state.editMode = false;
        state.editingBookCard = null;
    } else {
        addBookToDisplay(addBookToLibrary(data));
    
    }
    formNode.reset();
    dialogNode.close();
}

function handleClose(event) {
    let dialogToClose = event.target.closest('dialog');
     formNode.reset();
    dialogToClose.close();
}
function handleCardButtonsClicked(event) {
    const btn = event.target.closest('button');
    if (!btn) return;

    let type = btn.dataset.type;
    const bookCard = event.target.closest('.bookcard');
    switch (type) {
        case 'delete':
            deleteButtonClicked(bookCard);
            break;
        case 'edit':
            editButtonClicked(bookCard);
            break;
        case 'read':
            readButtonClicked(bookCard, btn);
            break;
    }
}

// change svg's display other state
function handleHover(event) {
    const btn = event.target.closest('button')
    if (!btn) return;
    if (event.relatedTarget && btn.contains(event.relatedTarget)) return; //dont switch states if inside button

    const use = btn.querySelector('use');
    let currentState = use.getAttribute('href');

    if (event.type === 'mouseover') {
        // btn.dataset.type
        use.setAttribute('href', toggleState(currentState))
    } else if (event.type === 'mouseout'){
        if (btn.dataset.type === 'read') {
            use.setAttribute('href', mapReadStateToIcon(btn.dataset.readState));
        } else {
            use.setAttribute('href', toggleState(currentState))
        }
    }
    
}

function mapReadStateToIcon(state) {
    let map = {
        'true': '#icon-eye', 'false': '#icon-eye-outline'
    }
    return map[state];
}
function toggleState(id) {
    let oppositeState = {
        '#icon-pencil-outline' : '#icon-pencil',
        '#icon-close-outline' : '#icon-close',
        '#icon-eye-outline': '#icon-eye',
        '#icon-eye' : '#icon-eye-outline',
        '#icon-close' : '#icon-close-outline',
        '#icon-pencil': '#icon-pencil-outline'
    }
    return oppositeState[id];
}
//event handlers
newBookButton.addEventListener('click', handleNewBook);
libraryDisplay.addEventListener('click', handleCardButtonsClicked);
libraryDisplay.addEventListener('mouseover', handleHover);
libraryDisplay.addEventListener('mouseout', handleHover);
closeButton.addEventListener('click', handleClose);
formNode.addEventListener('submit', handleSubmit);
noButton.addEventListener('click', handleClose);
yesButton.addEventListener('click', handleDelete);
// close when clicking outside dialogue
dialogNode.addEventListener('click', (e) => {
    if (e.target === dialogNode) {
        handleClose(e);
    }
})
confirmDialogNode.addEventListener('click', (e) => {
    if (e.target === confirmDialogNode) {
        handleClose(e);
    }
})

//helpers
function capitalize(words) {
    if (words == null) return;
    return words.split(" ").map( word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(" ");
}
// calling
preloadLibrary();
displayLibrary();