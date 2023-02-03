<template>
    <div class="wrapper">
        <main>
            <div
                class="nav__header container-fluid w-100 px-4 mb-4 d-flex align-items-center justify-content-between rounded bg-white">
                <div class="search__container w-100">
                    <b-icon icon="search" class="mr-3"></b-icon>
                    <input type="text" placeholder="Search" class="w-75 border-0" id="filter-input" v-model="filter">
                </div>

                <b-button class="rounded" variant="outline-primary" v-b-modal.loginModal>Login</b-button>

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
                                    <h4 class="mb-3">
                                        {{ row.item.title }}
                                    </h4>
                                    <b-icon @click="row.toggleDetails" class="h6 mt-1" icon="x-lg"></b-icon>
                                </div>

                                <div class="mb-3">
                                    <b-badge pill v-if="row.item.no_of_copies > 0" class="bg-success">AVAILABLE:
                                        <b>{{ row.item.no_of_copies }}</b></b-badge>
                                    <b-badge pill v-else-if="row.item.no_of_copies == 0"
                                        class="bg-light text-secondary">NOT
                                        AVAILABLE</b-badge>
                                </div>

                                <b-card-text>{{ row.item.description }}</b-card-text>

                                <b-list-group class="mb-3">
                                    <b-list-group-item><b>ISBN:</b> {{ row.item.isbn }}</b-list-group-item>
                                    <b-list-group-item><b>Author:</b> {{ row.item.author }} </b-list-group-item>
                                    <b-list-group-item><b>Publisher:</b> {{
                                        row.item.publisher_name
                                    }}</b-list-group-item>
                                    <b-list-group-item><b>Publication Year:</b> {{
                                        row.item.publication_year
                                    }}</b-list-group-item>
                                    <b-list-group-item><b>Categories:</b>
                                        <b-badge pill class="bg-light text-dark ms-2">{{
                                            row.item.category_name
                                        }}</b-badge>
                                    </b-list-group-item>
                                    <b-list-group-item><b>No. of Pages:</b> {{
                                        row.item.no_of_pages
                                    }}</b-list-group-item>
                                    <b-list-group-item><b>Shelf:</b> {{ row.item.shelf }}</b-list-group-item>

                                </b-list-group>

                                <b-button @click="getSelectedBook(row.item.isbn)" v-if="row.item.no_of_copies > 0"
                                    class="mx-auto rounded-pill" variant="outline-primary">
                                    Borrow
                                </b-button>
                            </b-card-body>


                        </b-card>
                    </template>

                </b-table>

                <b-pagination v-model="currentPage" :total-rows="totalRows" :per-page="perPage" aria-controls="my-table"
                    class="mt-3 mb-0 justify-content-center"></b-pagination>
            </div>

            <AppModal modalId="loginModal" modalSize="md" hideFooter :key="modalKey">
                <template #modal-header>
                    Login
                </template>
                <template #modal-body>
                    <form class="px-2" @submit.prevent="login">
                        <div class="row  mb-3 pt-0">
                            <label for="username">Username</label>
                            <b-input id="username" v-model="username"></b-input>

                        </div>
                        <div class="row mb-2">
                            <label for="password">Password</label>
                            <b-form-input type="password" id="password" v-model="password"></b-form-input>
                        </div>
                        <div class="w-100 mt-4 d-flex justify-content-center">
                            <b-button class="rounded w-25" type="submit" variant="primary">
                                Login
                            </b-button>
                        </div>
                    </form>
                </template>
            </AppModal>

            {{ request }}
        </main>


    </div>
</template>


<script>

import AppModal from '@/components/AppModal.vue'
import { mapState, mapGetters } from 'vuex'

export default {
    name: 'SearchBooksView',
    components: {
        AppModal
    },
    data() {
        return {
            fields: [
                { key: 'isbn', thStyle: { textTransform: "uppercase" } },
                { key: 'title', thStyle: { textTransform: "uppercase" }, sortable: true },
                { key: 'author', thStyle: { textTransform: "uppercase" }, sortable: true },
                { key: 'actions', thStyle: { textTransform: "uppercase" } },
            ],

            perPage: 14,
            currentPage: 1,
            totalRows: 1,
            filter: null,
            modalKey: 0,
            request: {
                b_isbn: '',
                b_title: '',
                date_requested: '',
                l_librarian_id: '',
            },
            selectedIsbn: '',
            username: '',
            password: ''

        }
    },
    created() {
        this.$store.dispatch("fetchBooks")
    },
    mounted() {
        // Set the initial number of items
        this.totalRows = this.items.length
    },
    methods: {
        onFiltered(filteredItems) {
            // Trigger pagination to update the number of buttons/pages due to filtering
            this.totalRows = filteredItems.length
            this.currentPage = 1
        },
        addRequest() {
            this.$store.dispatch('addRequest', this.request)
                .then(() => {
                    // this.request.b_isbn = ''
                    // this.request.b_title = ''
                    // this.request.date_requested = ''
                    this.$router.go(0)
                    // this.rerenderModal();
                })
                .catch((error) => {
                    console.log('there was a problem', error)
                })
        },
        getSelectedBook(isbn) {
            this.selectedIsbn = isbn
            let result = this.activeBooks.filter(book => book.isbn == isbn)
            for (let book of result) {
                console.log(book)
                this.request.b_isbn = book.isbn
                this.request.b_title = book.title
                this.request.date_requested = new Date().toLocaleDateString();
            }
            this.addRequest()
        },
        login() {
            this.$store.dispatch('login', {
                username: this.username,
                password: this.password
            })
                .then(() => {
                    this.$router.push({ name: 'publishers' })
                })

        }
    },
    computed: {
        ...mapState(['books']),
        ...mapGetters(['activeBooks']),
        items() {
            return this.activeBooks
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

form {
    // width: 30rem;
    padding: 0 35px;
    border-radius: 10px;

    input {
        height: 48px;
    }

    button {
        height: 42px;

    }
}
</style>