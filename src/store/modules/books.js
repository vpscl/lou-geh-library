import service from "@/services/service";

export default {
  state: {
    books: [],
  },
  getters: {
    activeBooks: (state) => {
      return state.books.filter((book) => book.status == "active");
    },
    getBookByIsbn: (state) => (isbn) => {
      return state.books.find((book) => book.isbn === isbn);
    },
  },
  mutations: {
    SET_BOOKS(state, books) {
      state.books = books;
    },
    ADD_BOOK(state, book) {
      state.books.push(book);
    },
    REMOVE_BOOK(state, isbn) {
      let index = state.books.findIndex((b) => b.isbn == isbn);
      state.books.splice(index, 0);
    },
    UPDATE_BOOK(state, isbn) {
      let index = state.books.findIndex((b) => b.isbn == isbn);
      state.books.splice(index, 0);
    },
  },
  actions: {
    addBook({ commit }, book) {
      return service
        .postBook(book)
        .then(() => {
          commit("ADD_BOOK", book);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    fetchBooks({ commit }) {
      service
        .getBooks()
        .then((response) => {
          commit("SET_BOOKS", response.data.bookList);
        })
        .catch((error) => console.log(error));
    },
    removeBook({ commit }, isbn) {
      service
        .removeBook(isbn)
        .then(() => {
          commit("REMOVE_BOOK", isbn);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    editBook({ commit }, { isbn, book }) {
      service
        .updateBook(isbn, book)
        .then(() => {
          commit("UPDATE_BOOK", isbn);
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
};
