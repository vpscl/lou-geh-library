import service from "@/services/service";
// import router from "@/router";
import axios from "axios";

export default {
  state: {
    loggedIn: false,
    user: {},
  },
  getters: {
    activeusers: (state) => {
      return state.user.filter((user) => user.status == "active");
    },
    getuserByIsbn: (state) => (isbn) => {
      return state.user.find((user) => user.isbn === isbn);
    },
  },
  mutations: {
    SET_USER_DATA(state, userData) {
      state.user = userData;
      localStorage.setItem("user", JSON.stringify(userData));
      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${userData.token}`;
    },
    LOGIN_SUCCESS(state, user) {
      state.loggedIn = true;
      state.user = user;
    },
    LOGIN_FAILURE(state) {
      state.loggedIn = false;
      state.user = null;
    },
    LOGOUT(state) {
      state.loggedIn = false;
      state.user = null;
    },
  },
  actions: {
    login({ commit }, user) {
      return service
        .login(user)
        .then(({ data }) => {
          //   if (response.data.token) {
          //     localStorage.setItem("token", response.data.token);
          //     localStorage.setItem("user", JSON.stringify(response.data));
          //     router.push("/books");
          //   }

          //   commit("LOGIN_SUCCESS", localStorage.getItem("user"));
          commit("SET_USER_DATA", data);
          //   return response.data;
        })
        .catch((error) => {
          commit("LOGIN_FAILURE", { user: null });
          console.log("Invalid credentials!", error);
          return error.message;
        });
    },
    logout({ commit }) {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      commit("LOGOUT");
    },
  },
};
