import service from "@/services/service";

export default {
  state: {
    users: [],
  },
  getters: {
    activeUsers: (state) => {
      return state.users.filter((user) => user.r_status == "active");
    },
  },
  mutations: {
    SET_USERS(state, users) {
      state.users = users;
    },
    ADD_USER(state, user) {
      state.users.push(user);
    },
  },
  actions: {
    fetchUsers({ commit }) {
      service
        .getUsers()
        .then((response) => {
          commit("SET_USERS", response.data.userList);
          console.log(response.data.userList);
        })
        .catch((error) => console.log(error));
    },
    addUser({ commit }, user) {
      return service
        .postUser(user)
        .then(() => {
          commit("ADD_USER", user);
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },
};
