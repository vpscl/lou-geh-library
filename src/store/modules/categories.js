// import router from "@/router";
import service from "@/services/service";

export default {
  state: {
    categories: [],
  },
  mutations: {
    SET_CATEGORIES(state, categories) {
      state.categories = categories;
    },
    ADD_CATEGORY(state, category) {
      state.categories.push(category);
    },
  },
  actions: {
    addCategory({ commit }, category) {
      return service
        .postCategory(category)
        .then(() => {
          commit("ADD_CATEGORY", category);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    fetchCategories({ commit }) {
      service
        .getCategories()
        .then((response) => {
          commit("SET_CATEGORIES", response.data.categoryList);
        })
        .catch((error) => console.log(error));
    },
  },
};
