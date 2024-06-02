const books = [];
const RENDER_EVENT = "render-book";
const STORAGE_KEY = "Bookshelf";
const form = document.getElementById("inputBook");
const inputSearchBook = document.getElementById("searchBookTitle");
const formSearchBook = document.getElementById("searchBook");

inputSearchBook.addEventListener("keyup", (events) => {
    events.preventDefault();
    searchBooks();
});

formSearchBook.addEventListener("submit", (events) => {
    events.preventDefault();
    searchBooks();
});

function isStorageExist() {
    if (typeof Storage === "undefined") {
        swal(
            "Oh Tidak 😮", "Browser yang anda gunakan tidak mendukung web storage😢. Coba gunakan browser lainya🤗", "info"
        );
        return false;
    }
    return true;
}

const generateId = () => +new Date();

const generateBookItem = (id, title, author, year, isComplete) => {
    return {
        id,
        title,
        author,
        year: parseInt(year), //perubahan
        isComplete, //perubahan
    };
};

function checkStatusBook() {
    const isCheckComplete = document.getElementById("inputBookIsComplete");
    if (isCheckComplete.checked) {
        return true;
    }
    return false;
}

function addBook() {
    const bookTitle = document.getElementById("inputBookTitle").value;
    const bookAuthor = document.getElementById("inputBookAuthor").value;
    const bookYear = document.getElementById("inputBookYear").value;
    const isComplete = checkStatusBook();

    const id = generateId();
    const newBook = generateBookItem(id, bookTitle, bookAuthor, bookYear, isComplete);

    books.unshift(newBook);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();

    swal("Berhasil👏", "Selamat buku sudah masuk kedalam rak", "success");
}

function findBookIndex(bookId) {
    for (const index in books) {
        if (books[index].id == bookId) {
        return index;
        }
    }
    return null;
}

function removeBook(bookId) {
    const bookTarget = findBookIndex(bookId);
    swal({
        title: "Sudah yakin belum💁‍♂️?",
        text: "Buku akan dihapus permanent dan tidak bisa di pulihkan kembali",
        icon: "warning",
        buttons: true,
        dangerMode: true,
    }).then((willDelete) => {
        if (willDelete) {
        books.splice(bookTarget, 1);
        document.dispatchEvent(new Event(RENDER_EVENT));
        saveData();

        swal("Berhasil", "Buku sudah dihapus dari rak", "success");
        } else {
        swal("buku batal di hapus dari rak");
        }
    });
}

function resetBuku() {
    swal({
        title: "Sudah yakin belum💁‍♂️?",
        text: "Semua Buku akan dihapus permanent dan tidak bisa di pulihkan kembali",
        icon: "warning",
        buttons: true,
        dangerMode: true,
    }).then((willDelete) => {
        if (willDelete) {
        books.splice(0, books.length);
        document.dispatchEvent(new Event(RENDER_EVENT));
        saveData();

        swal("Berhasil", "Semua buku sudah dihapus dari rak", "success");
        } else {
        swal("Rak batal dikosongkan");
        }
    });
}

function changeBookStatus(bookId) {
    const bookIndex = findBookIndex(bookId);
    for (const index in books) {
        if (index === bookIndex) {
        if (books[index].isComplete === true) {
            books[index].isComplete = false;
            swal("Berhasil", "Buku beralih ke rak belum selesai dibaca", "success");
        } else {
            books[index].isComplete = true;
            swal("Berhasil", "Buku beralih ke rak selesai dibaca", "success");
        }
        }
    }

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function searchBooks() {
    const inputSearchValue = document.getElementById("searchBookTitle").value.toLowerCase();
    const incompleteBookShelf = document.getElementById("incompleteBookshelfList");
    const completeBookShelf = document.getElementById("completeBookshelfList");
    incompleteBookShelf.innerHTML = "";
    completeBookShelf.innerHTML = "";

    if (inputSearchValue == "") {
        document.dispatchEvent(new Event(RENDER_EVENT));
        return;
    }

    for (const book of books) {
        if (book.title.toLowerCase().includes(inputSearchValue)) {
        if (book.isComplete == false) {
            let elem = `
                <article class="book_item">
                <h3>${book.title}</h3>
                <p>Penulis : ${book.author}</p>
                <p>Tahun Terbit : ${book.year}</p>

                <div class="action">
                    <button class="btn-blue" onclick="changeBookStatus(${book.id})">Selesai di Baca</button>
                    <button class="btn-red" onclick="removeBook(${book.id})">Hapus Buku</button>
                </div>
                </article>
                `;

            incompleteBookShelf.innerHTML += elem;
        } else {
            let elem = `
                <article class="book_item">
                <h3>${book.title}</h3>
                <p>Penulis : ${book.author}</p>
                <p>Tahun Terbit : ${book.year}</p>

                <div class="action">
                    <button class="btn-blue" onclick="changeBookStatus(${book.id})">Belum selesai di Baca</button>
                    <button class="btn-red" onclick="removeBook(${book.id})">Hapus Buku</button>
                </div>
                </article>
                `;

            completeBookShelf.innerHTML += elem;
        }
        }
    }
}

function saveData() {
    if (isStorageExist()) {
        const parsed = JSON.stringify(books);
        localStorage.setItem(STORAGE_KEY, parsed);

        document.dispatchEvent(new Event(RENDER_EVENT));
    }
}

function loadDataFromStorage() {
    const serializedData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializedData);

    if (data !== null) {
        data.forEach((book) => {
        books.unshift(book);
        });
    }
    document.dispatchEvent(new Event(RENDER_EVENT));
    return books;
}

function showBook(books = []) {
    const incompleteBookShelf = document.getElementById("incompleteBookshelfList");
    const completeBookShelf = document.getElementById("completeBookshelfList");

    incompleteBookShelf.innerHTML = "";
    completeBookShelf.innerHTML = "";

    books.forEach((book) => {
        if (book.isComplete == false) {
        let elem = `
                <article class="book_item">
                <h3>${book.title}</h3>
                <p>Penulis : ${book.author}</p>
                <p>Tahun Terbit : ${book.year}</p>

                <div class="action">
                    <button class="btn-blue" onclick="changeBookStatus(${book.id})"><i class="fa-solid fa-circle-check"></i></button>
                    <button class="btn-red" onclick="removeBook(${book.id})"><i class="fa-solid fa-trash"></i></button>
                </div>
                </article>
                `;

        incompleteBookShelf.innerHTML += elem;
        } else {
        let elem = `
                <article class="book_item">
                <h3>${book.title}</h3>
                <p>Penulis : ${book.author}</p>
                <p>Tahun Terbit : ${book.year}</p>

                <div class="action">
                    <button class="btn-blue" onclick="changeBookStatus(${book.id})"><i class="fa-solid fa-rotate-left"></i></button>
                    <button class="btn-red" onclick="removeBook(${book.id})"><i class="fa-solid fa-trash"></i></button>
                </div>
                </article>
                `;

        completeBookShelf.innerHTML += elem;
        }
    });
}

document.addEventListener("DOMContentLoaded", function () {
    form.addEventListener("submit", function (events) {
        events.preventDefault();
        addBook();

        form.reset();
    });

    if (isStorageExist()) {
        loadDataFromStorage();
    }
});

document.addEventListener(RENDER_EVENT, () => {
    const btnResetBuku = document.getElementById("resetBuku");
    if (books.length <= 0) {
        btnResetBuku.style.display = "none";
    } else {
        btnResetBuku.style.display = "block";
    }

    showBook(books);
});
