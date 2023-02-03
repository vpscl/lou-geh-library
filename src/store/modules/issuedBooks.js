import service from "@/services/service";

export default {
  state: {
    issuedBooks: [],
  },
  mutations: {
    SET_ISSUED_BOOKS(state, issuedBooks) {
      state.issuedBooks = issuedBooks;
    },
    ADD_ISSUED_BOOK(state, issuedBook) {
      state.issuedBooks.push(issuedBook);
    },
    UPDATE_ISSUED_BOOK(state, id) {
      let index = state.issuedBooks.findIndex((ib) => ib.issuedBook_id == id);
      state.issuedBooks.splice(index, 0);
    },
  },
  actions: {
    fetchIssuedBooks({ commit }) {
      service
        .getIssuedBooks()
        .then((response) => {
          commit("SET_ISSUED_BOOKS", response.data.issued_BookList);
        })
        .catch((error) => console.log(error));
    },
    addIssuedBook({ commit }, issuedBook) {
      return service
        .postIssuedBook(issuedBook)
        .then(() => {
          commit("ADD_ISSUED_BOOK", issuedBook);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    editIssuedBook({ commit }, { id, issuedBook }) {
      service
        .updateIssuedBook(id, issuedBook)
        .then(() => {
          commit("UPDATE_ISSUED_BOOK", id);
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
};
