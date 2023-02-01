import service from "@/services/service";

export default {
  state: {
    requests: [],
  },
  mutations: {
    SET_REQUESTS(state, requests) {
      state.requests = requests;
    },
  },
  actions: {
    fetchRequests({ commit }) {
      service
        .getRequests()
        .then((response) => {
          commit("SET_REQUESTS", response.data.requestList);
        })
        .catch((error) => console.log(error));
    },
  },
};
