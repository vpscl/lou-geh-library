// import router from "@/router";
// import axios from "axios";
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
      // router.push("/librarian/books");
    },
    DELETE_BOOK(state, book) {
      let index = state.books.findIndex((b) => b.isbn == book.isbn);
      state.books.splice(index, 1);
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
    removeBook({ commit }, book) {
      service
        .deleteBook(book)
        .then(() => {
          commit("DELETE_BOOK", book);
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
};
