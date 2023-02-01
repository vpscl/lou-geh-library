import service from "@/services/service";

export default {
  state: {
    publishers: [],
  },
  mutations: {
    SET_PUBLISHERS(state, publishers) {
      state.publishers = publishers;
    },
    ADD_PUBLISHER(state, publisher) {
      state.publishers.push(publisher);
    },
  },
  actions: {
    addPublisher({ commit }, publisher) {
      return service
        .postPublisher(publisher)
        .then(() => {
          commit("ADD_PUBLISHER", publisher);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    fetchPublishers({ commit }) {
      service
        .getPublishers()
        .then((response) => {
          commit("SET_PUBLISHERS", response.data.publisherList);
        })
        .catch((error) => console.log(error));
    },
  },
};
