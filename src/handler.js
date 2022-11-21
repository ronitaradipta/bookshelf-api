const { nanoid } = require("nanoid");
const books = require("./books");

const createDate = () => {
  const nowDate = new Date().toISOString();
  return nowDate;
};

const addBookHandler = (request, h) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  const id = nanoid(16);
  const finished = readPage === pageCount;
  const insertedAt = createDate();
  const updatedAt = insertedAt;

  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt,
  };

  if (!name) {
    return h
      .response({
        status: "fail",
        message: "Gagal menambahkan buku. Mohon isi nama buku",
      })
      .code(400);
  }
  if (readPage > pageCount) {
    return h
      .response({
        status: "fail",
        message:
          "Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount",
      })
      .code(400);
  }

  books.push(newBook);

  const isSuccess = books.filter((note) => note.id === id).length > 0;

  if (isSuccess) {
    return h
      .response({
        status: "success",
        message: "Buku berhasil ditambahkan",
        data: {
          bookId: id,
        },
      })
      .code(201);
  }

  return h
    .response({
      status: "error",
      message: "Buku gagal ditambahkan",
    })
    .code(500);
};

const getAllBooksHandler = (request, h) => {
  const { name, reading, finished } = request.query;

  const bookMapping = (theBooks) => {
    const theBook = theBooks.map((book) => ({
      id: book.id,
      name: book.name,
      publisher: book.publisher,
    }));
    return theBook;
  };

  let response;
  if (!name && !reading && !finished) {
    const theBooks = bookMapping(books);
    response = h
      .response({
        status: "success",
        data: {
          books: theBooks,
        },
      })
      .code(200);
  }

  if (name) {
    const booksFilter = books.filter((book) => {
      const lowerCase = book.name.toLowerCase().includes(name.toLowerCase());
      return lowerCase;
    });

    const bookName = bookMapping(booksFilter);
    response = h
      .response({
        status: "success",
        data: {
          books: bookName,
        },
      })
      .code(200);
  }

  if (reading === "1") {
    const booksFilter = books.filter((book) => book.reading);
    const bookReading = bookMapping(booksFilter);
    response = h
      .response({
        status: "success",
        data: {
          books: bookReading,
        },
      })
      .code(200);
  } else if (reading === "0") {
    const booksFilter = books.filter((book) => !book.reading);
    const bookUnReading = bookMapping(booksFilter);
    response = h
      .response({
        status: "success",
        data: {
          books: bookUnReading,
        },
      })
      .code(200);
  }

  if (finished === "1") {
    const booksFilter = books.filter((book) => book.finished);
    const bookFinished = bookMapping(booksFilter);
    response = h
      .response({
        status: "success",
        data: {
          books: bookFinished,
        },
      })
      .code(200);
  } else if (finished === "0") {
    const booksFilter = books.filter((book) => !book.finished);
    const bookUnFinished = bookMapping(booksFilter);
    response = h
      .response({
        status: "success",
        data: {
          books: bookUnFinished,
        },
      })
      .code(200);
  }

  return response;
};

const getBookByIdHandler = (request, h) => {
  const { id } = request.params;

  const book = books.filter((x) => x.id === id)[0];

  if (book !== undefined) {
    return h
      .response({
        status: "success",
        data: { book },
      })
      .code(200);
  }

  return h
    .response({
      status: "fail",
      message: "Buku tidak ditemukan",
    })
    .code(404);
};

const editBookById = (request, h) => {
  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;

  const { id } = request.params;

  const updatedAt = createDate();

  const bookIndex = books.findIndex((book) => book.id === id);

  if (!name) {
    return h
      .response({
        status: "fail",
        message: "Gagal memperbarui buku. Mohon isi nama buku",
      })
      .code(400);
  }

  if (readPage > pageCount) {
    return h
      .response({
        status: "fail",
        message:
          "Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount",
      })
      .code(400);
  }

  if (bookIndex !== -1) {
    books[bookIndex] = {
      ...books[bookIndex],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      updatedAt,
    };

    return h
      .response({
        status: "success",
        message: "Buku berhasil diperbarui",
      })
      .code(200);
  }

  return h
    .response({
      status: "fail",
      message: "Gagal memperbarui buku. Id tidak ditemukan",
    })
    .code(404);
};

const deleteBookById = (request, h) => {
  const { id } = request.params;

  const bookIndex = books.findIndex((book) => book.id === id);

  if (bookIndex !== -1) {
    books.splice(bookIndex, 1);
    return h
      .response({
        status: "success",
        message: "Buku berhasil dihapus",
      })
      .code(200);
  }

  return h
    .response({
      status: "fail",
      message: "Buku gagal dihapus. Id tidak ditemukan",
    })
    .code(404);
};

module.exports = {
  addBookHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  editBookById,
  deleteBookById,
};
