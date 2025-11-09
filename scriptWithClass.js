// classes

class Book {
    // fields
    #id;
    title;
    author;
    pages;
    read;

    constructor(properties = {}) {
        this.#id = crypto.randomUUID();
        this.title = properties.title ?? "";
        this.author = properties.author ?? "";
        this.pages = properties.pages ?? 0;
        this.read = properties.read ?? false;

    }

    toggleRead() {
        this.read = !this.read;
    }
    getInfoString() {
        let result = Utils.capitalize(this.title);
        if (this.author){ result += " by " + Utils.capitalize(this.author) + ", ";}
        if (this.pages) {result += this.pages + " pages";}
        result += (this.read ? ", has been read" : ", not read yet");
        return result;
    }
    getProperties() {
        const {  title, author, pages, read } = this;
        return { id: this.#id, title, author, pages, read };
    }
    update(properties = {}) {
        this.title = properties.title ?? this.title;
        this.author = properties.author ?? this.author;
        this.pages = properties.pages ?? this.pages;
        this.read = properties.read ?? this.read;
    }
}

class Library {
    //fields
    #myLibrary = [];

    constructor() {
        this.preloadLibrary();
    }
    //methods
    preloadLibrary() {
        this.addBookToLibrary({ 'title': 'Dungeon Crawler Carl','pages': 464, 'author': 'Matt Dinniman','read' : true,});
        this.addBookToLibrary({'title': 'Carl\'s Doomsday Scenario','pages': 384, 'author': 'Matt Dinniman','read' : false,});
        this.addBookToLibrary({'title': 'Hunger Games','pages': 384,'author': 'Suzanne Collins','read' : true,});
        this.addBookToLibrary({'title': 'The Alchemist','pages': 197,'author': 'Paulo Coelho','read' : true,});
    }   
    addBookToLibrary(properties) {
        let book = new Book(properties)
        this.#myLibrary.push(book);
        return book;
    }
    removeBookFromLibraryById(idToRemove) {
        let indexToRemove = this.#myLibrary.findIndex(book => book.getProperties().id === idToRemove);
        this.#myLibrary.splice(indexToRemove,1);
    }
    getBooks() {
        return [...this.#myLibrary];
    }
    logBooks() {
        for (let book of this.#myLibrary){ 
            console.log(book.getInfoString());
            console.log(book.getProperties())
        }
    }

}

class LibraryInterface {
    //fields
    #Library;
    #DOM;
    state = {deletingBookCard: null, editingBookCard: null, editMode: false,}

    constructor(Library){
        this.#Library = Library;
        this.cacheDOM();
        this.connectEventHandlers();
        this.renderLibraryCards();
    }
    //methods
    connectEventHandlers() {
        this.#DOM.newBookButton.addEventListener('click', this.handleNewBook);
        // this.#DOM.libraryDisplay.addEventListener('click', handleCardButtonsClicked);
    }
    cacheDOM() {
        this.#DOM = {
            libraryDisplay: document.querySelector('.library'),
            newBookButton: document.querySelector('.header > button'),
            dialogNode: document.querySelector('#form-dialog'),
            confirmDialogNode: document.querySelector('#confirm-dialog'),
            formNode: document.querySelector('form'),
            closeButton: document.querySelector('#close'),
            submitButton: document.querySelector('#submit'),
            noButton: document.querySelector('#no'),
            yesButton: document.querySelector('#yes'),
        }
    }
    renderLibraryCards() {
        for (let book of this.#Library.getBooks()) {
            let bookCard = new Card(book);
            this.#DOM.libraryDisplay.appendChild(bookCard.getCard());
        }
    }
    
    //event listeners
    handleNewBook = (event) => {
        this.#DOM.submitButton.textContent = "Add Book";
        this.#DOM.formNode.querySelector('h1').textContent = "Add a New Book";
        this.state.editMode = false;
        this.#DOM.dialogNode.showModal();
    }

    //callbacks
    
}

class Card {
    #nodes = {};
    book;
  
    constructor(book){
        this.book = book;
        this.#createCardNodes();
        this.#setNodeAttributes(book);
        this.#assembleCardNodes();
    }
      //methods
    getCard() {
        return this.#nodes['bookcard'];
    }
    //private methods
    #createCardNodes() {
        this.#nodes['bookcard'] = document.createElement('div');
        this.#nodes['info-wrapper'] = document.createElement('div');
        this.#nodes['title'] = document.createElement('div');
        this.#nodes['hr'] = document.createElement('hr');
        this.#nodes['info'] = document.createElement('div');
        this.#nodes['button-wrapper'] = document.createElement('div');
        let buttons = [
            {btnNode: Card.#createSVGButton('#icon-close-outline'), type: 'delete'},
            {btnNode: Card.#createSVGButton('#icon-pencil-outline'), type: 'edit'},
            {btnNode: Card.#createSVGButton('#icon-eye-outline'), type: 'read'}
        ];
        this.#nodes['buttons'] = buttons;
        this.#nodes['bookcard'].classList.add('bookcard');
    }
    #setNodeAttributes(book) {
        //setting attributes
        this.#nodes['bookcard'].setAttribute('data-book-id', book.getProperties().id);
        this.#nodes['info-wrapper'].classList.add('info-wrapper');
        this.#nodes['title'].classList.add('title');
        this.#nodes['title'].innerText = Utils.capitalize(book.title);
        this.#nodes['info'].classList.add('info');
        this.#nodes['info'].innerText = book.getInfoString();
        this.#nodes['button-wrapper'].classList.add('button-wrapper');
        for ( let button of this.#nodes['buttons']) {
            button.btnNode.setAttribute('data-type', button.type);
            if (button.type === 'read' ) {
                //read status
                button.btnNode.setAttribute('data-read-state', book.read);
                if (book.read) { button.btnNode.querySelector('use').setAttribute( 'href', '#icon-eye'); }
            }
        }
    }
    #assembleCardNodes() {
        //assemble nodes
        for ( let button of this.#nodes['buttons']) {
            this.#nodes['button-wrapper'].appendChild(button.btnNode);
        }
        this.#nodes['info-wrapper'].appendChild(this.#nodes['title']);
        this.#nodes['info-wrapper'].appendChild(this.#nodes['hr']);
        this.#nodes['info-wrapper'].appendChild(this.#nodes['info']);
        this.#nodes['bookcard'].appendChild(this.#nodes['info-wrapper']);
        this.#nodes['bookcard'].appendChild(this.#nodes['button-wrapper']);
    }
    static #createSVGButton(id) {
        let btn = document.createElement("button");
        let svg = document.createElementNS("http://www.w3.org/2000/svg", 'svg')
        svg.setAttribute("viewBox", "0 0 24 24");

        let use = document.createElementNS("http://www.w3.org/2000/svg", 'use')
        use.setAttribute('href', id)
        svg.appendChild(use);
        btn.appendChild(svg);
        return btn;
    }

}

class Utils {
    static capitalize(words) {
        if (words == null) return;
        return words.split(" ").map( word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(" ");
    }

}

const library = new Library();
const UI = new LibraryInterface(library);
console.log(library.getBooks())
