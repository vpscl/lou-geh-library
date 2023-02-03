<template>
    <div class="wrapper">
        <main>

            <div
                class="nav__header container-fluid w-100 px-4 mb-4 d-flex align-items-center justify-content-between rounded bg-white">
                <div class="search__container w-100">
                    <b-icon icon="search" class="mr-3"></b-icon>
                    <input type="text" placeholder="Search" class="w-75 border-0" id="filter-input" v-model="filter" />
                </div>

                <AppDropdown>
                    <template v-slot:text>
                        Admin
                        <b-icon class="ml-2" font-scale=".75" icon="caret-down-fill"></b-icon>
                    </template>
                    <template v-slot:links>
                        <router-link class="dropdown-item" to="/">Logout </router-link>
                    </template>
                </AppDropdown>
            </div>

            <div class="table__container p-4 pt-3 rounded">
                <div class="d-flex justify-content-between mt-2 mb-4">
                    <h4>Requests</h4>
                    <div>
                        <b-button v-if="selectedRow[0] && selectedBookData.no_of_copies > 0" v-b-modal.addReaderModal
                            class="mr-2" variant="primary">Approve</b-button>
                        <b-button @click="removeRequest(selectedRequest.request_id)" v-if="selectedRow[0]" class="mr-2"
                            v-b-modal.rejectRequestModal variant="primary">Reject</b-button>
                    </div>
                </div>

                <b-table :items="items" :per-page="perPage" :fields="fields" :current-page="currentPage"
                    label-sort-asc="" label-sort-desc="" label-sort-clear="" fixed responsive :filter="filter"
                    select-mode="single" ref="selectableTable" selectable @row-selected="onRowSelected"
                    @filtered="onFiltered">

                    <template #cell(request_id)="row">
                        <template v-if="row.item.request_id.length == 1">
                            <span>00</span></template>
                        <template v-else-if="row.item.request_id.length > 1">
                            <span>0</span>
                        </template>
                        <template v-else></template>
                        <span>{{ row.item.request_id }}</span>
                    </template>
                </b-table>

                <b-pagination v-model="currentPage" :total-rows="totalRows" :per-page="perPage" aria-controls="my-table"
                    class="mt-3 mb-0 justify-content-center"></b-pagination>
            </div>

            <!-- {{ selectedRow }} -->
            <!-- {{ selectedRequest }} -->
            {{ issuedBook }}
            <br>
            {{ selectedBookData }}
        </main>

        <AppModal modalId="addReaderModal" hideFooter :key="modalKey">
            <template #modal-header>
                Approve Request
            </template>

            <template #modal-body>
                <form class="px-2" @submit.prevent="addIssuedBook">

                    <div class="row mb-4 pt-0">
                        <b>Book:</b>
                        <i>{{ selectedRequest.title }}</i>
                    </div>
                    <div class="row pt-0">
                        <b-input v-model="issuedBook.reader_name" id="request_name"
                            placeholder="Reader's Full Name"></b-input>
                    </div>


                    <div class="w-100 mt-4 d-flex justify-content-end">
                        <b-button variant="outline-secondary" class="mr-2" @click="rerenderModal()">
                            Cancel
                        </b-button>
                        <b-button type="submit" variant="primary">
                            Confirm
                        </b-button>
                    </div>
                </form>
            </template>
        </AppModal>
    </div>
</template>

<script>
import AppDropdown from '@/components/AppDropdown.vue';
import AppModal from '@/components/AppModal.vue';
import { mapGetters, mapState } from 'vuex';

export default {
    props: [],
    components: {
        AppDropdown,
        AppModal
    },
    data() {
        return {
            fields: [
                { key: 'request_id', thStyle: { textTransform: "uppercase", width: '170px' }, sortable: true },
                { key: 'title', label: 'book', thStyle: { textTransform: "uppercase" }, sortable: true },
                { key: 'date_requested', thStyle: { textTransform: "uppercase" }, sortable: true },
                // { key: 'actions', thStyle: { textTransform: "uppercase" } },
            ],
            perPage: 12,
            currentPage: 1,
            totalRows: 1,
            filter: null,
            // request: this.newRequestObject(),
            modalKey: 0,
            selectedRow: [],
            selectedRequest: {},
            issuedBook: {
                return_date: this.sevenDaysFromNow(),
                date_returned: '',
                date_issued: this.dateToday(),
                ib_status: 'active',
                b_isbn: '',
                title: '',
                reader_name: ''
            },
            selectedBookData: {}
        }
    },
    created() {
        this.$store.dispatch('fetchBooks')
        this.$store.dispatch('fetchRequests')
    },
    computed: {
        ...mapState(['books']),
        ...mapGetters(['activeRequests']),
        items() {
            return this.activeRequests
        },
        sortOptions() {
            return this.fields
                .filter((f) => f.sortable)
                .map((f) => {
                    return { text: f.label, value: f.key };
                });
        },

    },
    mounted() {
        this.totalRows = this.items.length;
    },
    methods: {
        onRowSelected(items) {
            this.selectedRow = items
            for (let request of this.selectedRow) {
                this.selectedRequest = request
                this.issuedBook.b_isbn = this.selectedRequest.b_isbn
                this.issuedBook.title = this.selectedRequest.title
                this.getSelectedBookData()
            }
        },
        onFiltered(filteredItems) {
            // Trigger pagination to update the number of buttons/pages due to filtering
            this.totalRows = filteredItems.length;
            this.currentPage = 1;
        },
        rerenderModal() {
            this.modalKey += 1;
        },
        getSelectedBookData() {
            this.selectedBookData = this.books.books.find(b => b.isbn == this.issuedBook.b_isbn)
        },
        addIssuedBook() {
            this.$store.dispatch('addIssuedBook', this.issuedBook)
                .then(() => {
                    this.rerenderModal();
                })
                .catch((error) => {
                    console.log(error)
                })
            this.selectedBookData.no_of_copies--
            this.editBook(this.selectedBookData.isbn, this.selectedBookData)
            this.removeRequest(this.selectedRequest.request_id)
        },
        editBook(isbn, book) {
            this.$store.dispatch('editBook', { isbn, book })
                .then(() => {
                    this.rerenderModal();
                    this.$router.go(0)
                })
                .catch((error) => {
                    console.log(error)
                })
        },
        removeRequest(id) {
            this.$store.dispatch('removeRequest', id)
                .then(() => {
                    // this.book = this.newRequestObject();
                    this.rerenderModal();
                    this.$router.go(0)
                })
                .catch(() => {
                    console.log('There was a problem marking the request as inactive.')
                })
        },
        sevenDaysFromNow() {
            return new Date(new Date().setDate(new Date().getDate() + 7)).toLocaleDateString();

        },
        dateToday() {
            return new Date(new Date().setDate(new Date().getDate())).toLocaleDateString()
        }
    }
}
</script>

<style>

</style>