<template>
    <div class="wrapper">
        <main>
            <div
                class="nav__header container-fluid w-100 px-4 mb-4 d-flex align-items-center justify-content-between rounded bg-white">
                <div class="search__container w-100">
                    <b-icon icon="search" class="mr-3"></b-icon>
                    <input type="text" placeholder="Search" class="w-75 border-0" id="filter-input" v-model="filter">
                </div>

                <AppDropdown>
                    <template v-slot:text>
                        Admin
                        <b-icon class="ml-2" font-scale=".75" icon="caret-down-fill"></b-icon>
                    </template>
                    <template v-slot:links>
                        <router-link class="dropdown-item" to="/">
                            Logout
                        </router-link>
                    </template>
                </AppDropdown>

            </div>



            <div class="table__container p-4 pt-3 rounded">
                <div class="d-flex justify-content-between mt-2 mb-4">
                    <h4>Books</h4>
                    <b-button v-b-modal.addBookModal variant="primary">Add Book</b-button>
                </div>
                <b-table :items="items" :per-page="perPage" :fields="fields" :current-page="currentPage"
                    label-sort-asc="" label-sort-desc="" label-sort-clear="" responsive :filter="filter"
                    @filtered="onFiltered">

                    <template #cell(actions)="row">
                        <b-button size="sm" @click="row.toggleDetails" variant="outline-secondary" class="mr-2">
                            {{ row.detailsShowing ? 'Hide' : 'Show' }} Details
                        </b-button>

                    </template>

                    <!-- <template #cell(author)="row">
                        {{ row.item.author && row.item.author.join(', ') }}
                    </template> -->

                    <template #row-details="row">
                        <b-card class="border-0">
                            <b-card-body class="d-flex flex-column pt-2">
                                <div class="d-flex justify-content-between">
                                    <h4 class="mb-3 text-dark">
                                        {{ row.item.title }}
                                    </h4>

                                    <AppDropdown>
                                        <template v-slot:text>
                                            <b-icon icon="three-dots-vertical"></b-icon>
                                        </template>
                                        <template v-slot:links>
                                            <li>
                                                <a v-b-modal.updateBookModal
                                                    class="dropdown-item d-flex align-items-center py-2" href="#">
                                                    <b-icon icon="pencil-square" class="mr-2" font-scale=".95"></b-icon>
                                                    Update
                                                </a>
                                            </li>
                                            <li><a v-b-modal.removeBookModal
                                                    class="dropdown-item d-flex align-items-center py-2" href="#">
                                                    <b-icon icon="trash" class="mr-2" font-scale=".95"></b-icon>
                                                    Remove
                                                </a>
                                            </li>
                                        </template>
                                    </AppDropdown>

                                    <!-- <b-icon @click="row.toggleDetails" class="h6 mt-1" icon="x-lg"></b-icon> -->

                                </div>

                                <b-card-text>{{ row.item.description }}</b-card-text>

                                <b-list-group class="mb-3">
                                    <b-list-group-item><b>ISBN:</b> {{ row.item.isbn }}</b-list-group-item>
                                    <b-list-group-item><b>Author:</b> {{
                                        row.item.author
                                    }}</b-list-group-item>
                                    <b-list-group-item><b>Publisher:</b> {{
                                        row.item.publisher_name
                                    }}</b-list-group-item>
                                    <b-list-group-item><b>Publication Year:</b> {{
                                        row.item.publication_year
                                    }}</b-list-group-item>
                                    <b-list-group-item><b>Category:</b>
                                        <!-- <b-badge pill variant="light" class="ml-2" :key="index"
                                            v-for="(category, index) in row.item.subcategories">{{ category }}</b-badge> -->
                                        <b-badge pill variant="light" class="ml-2">{{
                                            row.item.category_name
                                        }}</b-badge>
                                    </b-list-group-item>
                                    <b-list-group-item><b>No. of Pages:</b> {{
                                        row.item.no_of_pages
                                    }}</b-list-group-item>
                                    <b-list-group-item><b>No. of Copies:</b> {{
                                        row.item.no_of_copies
                                    }}</b-list-group-item>
                                    <b-list-group-item><b>Shelf:</b> {{ row.item.shelf }}</b-list-group-item>
                                    <b-list-group-item><b>Status:</b> {{ row.item.status }}</b-list-group-item>

                                </b-list-group>

                            </b-card-body>


                        </b-card>

                        <AppModal modalId="removeBookModal" modalSize="lg" hideFooter>
                            <template #modal-header>
                                Delete Book
                            </template>
                            <template #modal-body>
                                <div class="row mb-3 text-center">
                                    Are you sure you want to remove <b>{{ row.item.isbn }}</b>?
                                </div>
                                <b-button @click="deleteBook(row.item.isbn)">yes</b-button>
                            </template>
                            <template #modal-btn>
                                <b-button variant="primary">
                                    Update
                                </b-button>
                            </template>
                        </AppModal>
                    </template>

                </b-table>

                <b-pagination v-model="currentPage" :total-rows="totalRows" :per-page="perPage" aria-controls="my-table"
                    class="mt-3 mb-0 justify-content-center"></b-pagination>
            </div>

            <AppModal :key="modalKey" modalId="addBookModal" modalSize="lg" submitMethod="addBook" hideFooter>
                <template #modal-header>
                    Add Book
                </template>
                <template #modal-body>
                    <form @submit.prevent="addBook">
                        <div class="row mb-3">
                            <div class="col-6">
                                <label for="title">Title</label>
                                <b-form-input v-model="book.title" id="title"></b-form-input>
                            </div>
                            <div class="col-6">
                                <label for="ISBN">ISBN</label>
                                <b-form-input v-model="book.isbn" id="isbn"></b-form-input>
                            </div>
                        </div>
                        <div class="row mb-3">
                            <div class="col-12">
                                <label for="description">Description</label>
                                <!-- <b-form-input v-model="book.title" id="description"></b-form-input> -->
                                <b-form-textarea id="description" v-model="book.description" rows="3"
                                    max-rows="6"></b-form-textarea>
                            </div>
                        </div>
                        <div class="row mb-3">
                            <div class="col-6">
                                <label for="author">Author</label>
                                <b-form-input v-model="book.author" id="author"></b-form-input>
                            </div>
                            <div class="col-6">
                                <label for="publisher">Publisher</label>
                                <!-- <b-form-input v-model="book.publisher" id="publisher"></b-form-input> -->
                                <b-form-select v-model="book.p_publisher_id">
                                    <b-form-select-option value="" disabled>Select</b-form-select-option>
                                    <b-form-select-option v-for="publisher in publishers.publishers"
                                        :key="publisher.publisher_id" :value="publisher.publisher_id">{{
                                            publisher.publisher_name
                                        }}</b-form-select-option>
                                </b-form-select>
                            </div>
                        </div>
                        <div class="row mb-3">
                            <div class="col-3">
                                <label for="publication_year">Publication Year</label>
                                <b-form-input v-model="book.publication_year" id="publication_year"></b-form-input>
                            </div>
                            <div class="col-3">
                                <label for="no_of_copies">No. of Copies</label>
                                <b-form-input v-model.number="book.no_of_copies" type="number"
                                    id="no_of_copies"></b-form-input>
                            </div>
                            <div class="col-3">
                                <label for="shelf">Shelf</label>
                                <b-form-input v-model.number="book.shelf" type="number" id="shelf"></b-form-input>
                            </div>
                            <div class="col-3">
                                <label for="no_of_pages">No. of Pages</label>
                                <b-form-input v-model.number="book.no_of_pages" type="number"
                                    id="no_of_pages"></b-form-input>
                            </div>
                        </div>
                        <div class="row mb-2">
                            <div class="col-12">
                                <label for="categories">Categories</label>
                                <!-- <multiselect v-model="book.c_category_id" :options="cats" :multiple="true"
                                    group-values="subcategories" group-label="category_name"
                                    placeholder="Type to search">
                                    <span slot="noResult">Oops! No elements found. Consider changing the search
                                        query.</span>
                                </multiselect> -->
                                <b-form-select v-model="book.c_category_id">
                                    <b-form-select-option value="" disabled>Select</b-form-select-option>
                                    <b-form-select-option v-for="category in categories.categories"
                                        :key="category.category_id" :value="category.category_id">{{
                                            category.category_name
                                        }}</b-form-select-option>
                                </b-form-select>
                            </div>
                        </div>

                        <div class="w-100 mt-4 d-flex justify-content-end">
                            <b-button variant="outline-secondary" class="mr-2" @click="rerenderModal()">
                                Cancel
                            </b-button>
                            <b-button type="submit" variant="primary">
                                Add
                            </b-button>
                        </div>
                    </form>
                </template>

            </AppModal>

            <AppModal modalId="updateBookModal" modalSize="lg">
                <template #modal-header>
                    Update Book
                </template>
                <template #modal-body>
                    <div class="row mb-3">
                        <div class="col-6">
                            <label for="title">Title</label>
                            <b-form-input v-model="book.title" id="title"></b-form-input>
                        </div>
                        <div class="col-6">
                            <label for="ISBN">ISBN</label>
                            <b-form-input v-model="book.isbn" id="ISBN"></b-form-input>
                        </div>
                    </div>
                    <div class="row mb-3">
                        <div class="col-6">
                            <label for="author">Author</label>
                            <b-form-input v-model="book.author" id="author"></b-form-input>
                        </div>
                        <div class="col-6">
                            <label for="publisher">Publisher</label>
                            <!-- <b-form-input v-model="book.publisher" id="publisher"></b-form-input> -->
                            <b-form-select v-model="book.p_publisher_id">
                                <b-form-select-option v-for="publisher in publishers.publishers"
                                    :key="publisher.publisher_id" :value="publisher.publisher_id">{{
                                        publisher.publisher_name
                                    }}</b-form-select-option>
                            </b-form-select>
                        </div>
                    </div>
                    <div class="row mb-3">
                        <div class="col-3">
                            <label for="publication_year">Publication Year</label>
                            <b-form-input v-model="book.publication_year" id="publication_year"></b-form-input>
                        </div>
                        <div class="col-3">
                            <label for="no_of_copies">No. of Copies</label>
                            <b-form-input v-model.number="book.no_of_copies" type="number"
                                id="no_of_copies"></b-form-input>
                        </div>
                        <div class="col-3">
                            <label for="shelf">Shelf</label>
                            <b-form-input v-model.number="book.shelf" type="number" id="shelf"></b-form-input>
                        </div>
                        <div class="col-3">
                            <label for="no_of_pages">No. of Pages</label>
                            <b-form-input v-model.number="book.no_of_pages" type="number"
                                id="no_of_pages"></b-form-input>
                        </div>
                    </div>
                    <div class="row mb-2">
                        <div class="col-12">
                            <label for="categories">Categories</label>
                            <multiselect v-model="book.categories" :options="cats" :multiple="true"
                                group-values="subcategories" group-label="name" placeholder="Type to search">
                                <span slot="noResult">Oops! No elements found. Consider changing the search
                                    query.</span>
                            </multiselect>

                        </div>
                    </div>
                </template>
                <template #modal-btn>
                    <b-button variant="primary">
                        Update
                    </b-button>
                </template>
            </AppModal>


        </main>

    </div>
</template>


<script>

import AppDropdown from '@/components/AppDropdown.vue'
import AppModal from '@/components/AppModal.vue'
import Multiselect from 'vue-multiselect'
import { mapState } from 'vuex'

export default {
    name: 'SearchBooksView',
    components: {
        AppDropdown,
        AppModal,
        Multiselect
    },
    data() {
        return {
            fields: [
                { key: 'isbn', thStyle: { textTransform: "uppercase" } },
                { key: 'title', thStyle: { textTransform: "uppercase" }, sortable: true },
                { key: 'author', thStyle: { textTransform: "uppercase" }, sortable: true },
                { key: 'actions', thStyle: { textTransform: "uppercase" } },
            ],

            perPage: 20,
            currentPage: 1,
            totalRows: 1,
            filter: null,
            book: this.newBookObject(),
            modalKey: 0,
            selected: {}

        }
    },
    created() {
        this.$store.dispatch("fetchBooks")
        this.$store.dispatch('fetchPublishers')
        this.$store.dispatch('fetchCategories')
    },
    mounted() {
        // Set the initial number of items
        this.totalRows = this.items.length,
            this.$root.$on('addNewBook', this.addBook)
    },
    methods: {
        rerenderModal() {
            this.modalKey += 1;
        },
        onFiltered(filteredItems) {
            // Trigger pagination to update the number of buttons/pages due to filtering
            this.totalRows = filteredItems.length
            this.currentPage = 1
        },
        addBook() {
            this.$store.dispatch('addBook', this.book)
                .then(() => {
                    // this.book = this.newBookObject();
                    this.$router.go(0)
                    // this.rerenderModal();
                })
                .catch(() => {
                    console.log('There was a problem adding the book.')
                })
        },
        // removeBook() {
        //     this.$store.dispatch('removeBook', this.book)
        //         .then(() => {
        //             // this.book = this.newBookObject();
        //             // this.$router.go(0)
        //             this.rerenderModal();
        //         })
        //         .catch(() => {
        //             console.log('There was a problem adding the book.')
        //         })
        // },
        deleteBook(isbn) {
            // let selected = {}
            let result = this.books.books.filter(book => book.isbn == isbn)
            for (let book of result) { this.selected = book }

            this.$store.dispatch('removeBook', this.selected)
                .then(() => {
                    // this.book = this.newBookObject();
                    // this.$router.go(0)
                    this.rerenderModal();
                })
                .catch(() => {
                    console.log('There was a problem adding the book.')
                })
        },
        newBookObject() {
            return {
                title: '',
                isbn: '',
                description: '',
                author: '',
                p_publisher_id: '',
                publication_year: '',
                no_of_copies: '',
                shelf: '',
                no_of_pages: '',
                c_category_id: ''
            }
        },
    },
    computed: {
        ...mapState(['categories', 'books', 'publishers']),
        items() {
            return this.books.books.map(item => ({ ...item }));
        },
        cats() {
            return this.categories.categories;
        },
        sortOptions() {
            // Create an options list from our fields
            return this.fields
                .filter(f => f.sortable)
                .map(f => {
                    return { text: f.label, value: f.key }
                })
        }
    }

}
</script>

<style lang="scss" scoped>
@import "vue-multiselect/dist/vue-multiselect.min.css";

.multiselect__option--highlight {
    background: #333;
}

.table__container {
    background: white;
}

.nav__header {
    height: 70px;
}


input {
    outline: none;
}

.bi-x-lg {
    cursor: pointer;
    transition: 300ms;

    &:hover {
        color: lighten(black, 40%);
    }
}

.dropdown-toggle {
    &::after {
        display: none;
    }

    border: 0;
}

.list-group-item {
    text-transform: capitalize;
}
</style>