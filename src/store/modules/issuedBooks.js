import service from "@/services/service";

export default {
  state: {
    issuedBooks: [],
  },
  mutations: {
    SET_ISSUED_BOOKS(state, issuedBooks) {
      state.issuedBooks = issuedBooks;
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
  },
};
