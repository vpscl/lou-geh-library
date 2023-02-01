import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://172.16.4.182:5002/api/",
  withCredentials: false,
  headers: {
    "Content-Type": "application/json",

    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwiaWF0IjoxNjc1MjE4MTg2LCJleHAiOjE2NzUzMDQ1ODZ9.OG9l-qZIqzLeT4ARVShpnU9vJsruKLuTXVvltrivZJI",
  },
});

export default {
  getBooks() {
    return apiClient.get("/books");
  },
  getCategories() {
    return apiClient.get("/category");
  },
  getIssuedBooks() {
    return apiClient.get("/issued_books");
  },
  getPublishers() {
    return apiClient.get("/publishers");
  },
  getReaders() {
    return apiClient.get("/reader");
  },
  getRequests() {
    return apiClient.get("/request");
  },
  postBook(book) {
    return apiClient.post("/books", book);
  },
  postPublisher(publisher) {
    return apiClient.post("/publishers", publisher);
  },
  postCategory(category) {
    return apiClient.post("/category", category);
  },
  postReader(reader) {
    return apiClient.post("/reader", reader);
  },
  deleteBook(book) {
    return apiClient.patch("/books", book);
  },
};
