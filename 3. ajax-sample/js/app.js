
const model = {
    apiUrl : 'https://www.googleapis.com/books/v1/volumes', 
    keywork : 'javascript',
    currentBook: {},
    books: []
}

const controller = {
    init: function () {
        this.retrieveBookFromAPI();
        bookView.init();
    },
    retrieveBookFromAPI: function (startIndex = 0) {
        fetch(`${model.apiUrl}?q=${model.keywork}&startIndex=${startIndex}`)
            .then(function (response) {
                return response.json();
            })
            .then(function (books) {
                model.books = books.items;
                model.currentBook = books.items[0];
                bookListView.render();
                bookView.render();
            });
    },
    getBooks: function () {
        return model.books;
    },

    getCurrentBook: function () {
        return model.currentBook;
    }
}

const bookListView = {
    init: function () {
        this.render();
    },
    render: function () {
        this.books = controller.getBooks();
        let bookListContent = '';
        this.books.forEach(function(book,index){
            const bookHolder = `<div class="book" data-id=${book.id} onClick="bookListView.build('${book.id}')">
                <h3>${book.volumeInfo.title}</h3>
                <img src=${book.volumeInfo.imageLinks.smallThumbnail} alt="${book.volumeInfo.title}">
                </div>`;
            bookListContent += bookHolder;
        });
        document.querySelector('#booklist').innerHTML = bookListContent;
        
        // console.log(this.books);

        // console.log(model.currentBook);
    },
    setCurrentBook: function () {

    },
    build: function(bookid){
        this.books.forEach(function(book){
            if(book.id === bookid) {
                model.currentBook = book;
            }
        });
        bookView.render();
    }

}

const bookView = {
    init: function(){
        this.viewport = document.getElementById('viewerCanvas');
        this.render();
    },
    render: function () {
        console.log(controller.getCurrentBook());
        google.books.load();
        google.books.setOnLoadCallback(function(){
            const viewer = new google.books.DefaultViewer(bookView.viewport);
            const currentBook = controller.getCurrentBook();
            viewer.load(currentBook.id);
        });
    },

}

controller.init();
