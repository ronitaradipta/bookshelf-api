const {
  addBookHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  editBookById,
  deleteBookById,
} = require("./handler");

const routes = [
  {
    method: "POST",
    path: "/books",
    handler: addBookHandler,
  },
  {
    method: "GET",
    path: "/books",
    handler: getAllBooksHandler,
  },
  {
    method: "GET",
    path: "/books/{id}",
    handler: getBookByIdHandler,
  },
  {
    method: "PUT",
    path: "/books/{id}",
    handler: editBookById,
  },
  {
    method: "DELETE",
    path: "/books/{id}",
    handler: deleteBookById,
  },
];

module.exports = routes;
