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
    getID() {
        return this.#id;
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
        this.#DOM.newBookButton.addEventListener('click', this.#handleNewBook);
        this.#DOM.libraryDisplay.addEventListener('click', this.#handleClickDelegation);
        this.#DOM.libraryDisplay.addEventListener('mouseover', this.#handleHover);
        this.#DOM.libraryDisplay.addEventListener('mouseout', this.#handleHover);
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
            this.#DOM.libraryDisplay.appendChild(LibraryInterface.#createCard(book));
        }
    }
    static #createCard(book) {
        let nodes = {}
        nodes['bookcard'] = document.createElement('div');
        nodes['info-wrapper'] = document.createElement('div');
        nodes['title'] = document.createElement('div');
        nodes['hr'] = document.createElement('hr');
        nodes['info'] = document.createElement('div');
        nodes['button-wrapper'] = document.createElement('div');
        nodes['buttons'] = {
            'delete': LibraryInterface.#createSVGButton('#icon-close-outline'),
            'edit': LibraryInterface.#createSVGButton('#icon-pencil-outline'),
            'read': LibraryInterface.#createSVGButton('#icon-eye-outline')
        };
        //setting attributes
        nodes['bookcard'].classList.add('bookcard');
        nodes['bookcard'].setAttribute('data-book-id', book.getID());
        nodes['info-wrapper'].classList.add('info-wrapper');
        nodes['title'].classList.add('title');
        nodes['title'].innerText = Utils.capitalize(book.title);
        nodes['info'].classList.add('info');
        nodes['info'].innerText = book.getInfoString();
        nodes['button-wrapper'].classList.add('button-wrapper');
        nodes['buttons']['read'].setAttribute('data-read-state', book.read)
        for (let type in nodes['buttons']) {
            nodes['buttons'][type].setAttribute('data-type', type )
        }
        if (book.read) { 
            nodes['buttons']['read'].querySelector('use').setAttribute( 'href', '#icon-eye'); 
        }
        //assemble nodes
        for ( let type in nodes['buttons']) {
            nodes['button-wrapper'].appendChild(nodes['buttons'][type]);
        }
        nodes['info-wrapper'].appendChild(nodes['title']);
        nodes['info-wrapper'].appendChild(nodes['hr']);
        nodes['info-wrapper'].appendChild(nodes['info']);
        nodes['bookcard'].appendChild(nodes['info-wrapper']);
        nodes['bookcard'].appendChild(nodes['button-wrapper']);
        return nodes['bookcard'];
    }


    
    //event listeners
    #handleNewBook = (event) => {
        this.#DOM.submitButton.textContent = "Add Book";
        this.#DOM.formNode.querySelector('h1').textContent = "Add a New Book";
        this.state.editMode = false;
        this.#DOM.dialogNode.showModal();
    }
    #handleClickDelegation = (event) => {
        const button = event.target.closest('button');
        if (!button) return;
        
        const bookCard = event.target.closest('.bookcard');
    }
    #handleHover = (event) => {
        const button = event.target.closest('button');
        if (!button) return;
        if (event.relatedTarget && button.contains(event.relatedTarget)) return; //dont switch states if inside button
        const use = button.querySelector('use');
        use.setAttribute('href', Utils.getIconID(button.dataset.type, event.type === 'mouseover', button.dataset.readState));
    }

    //static methods
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

    static getIconID(buttonType, isHovering, readState) {
        //ishovering is true when mouse over fired, 
        const icons = {
            delete: { normal: '#icon-close-outline', hover: '#icon-close'},
            edit: { normal: '#icon-pencil-outline', hover: '#icon-pencil'},
            read: {
                normal: readState === 'true' ? '#icon-eye' : '#icon-eye-outline',
                hover: readState === 'true' ? '#icon-eye-outline' : '#icon-eye'
            }
        }
        return isHovering ? icons[buttonType].hover : icons[buttonType].normal;
    }

}

const library = new Library();
const UI = new LibraryInterface(library);
console.log(library.getBooks())
