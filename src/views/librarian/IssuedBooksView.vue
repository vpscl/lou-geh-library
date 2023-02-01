<template>
    <div class="wrapper">
        <main>
            <AppTable :fields="fields" :items="items">

                <template v-slot:header>
                    <div class="d-flex mt-2 mb-4">
                        <h4>Issued Books</h4>
                    </div>
                </template>

                <template v-slot:dropdown-list>
                    <li>
                        <a v-b-modal.updateIssuedBookModal class="dropdown-item d-flex align-items-center py-2"
                            href="#">
                            <b-icon icon="pencil-square" class="mr-2" font-scale=".95"></b-icon>
                            Update
                        </a>
                    </li>
                    <!-- <li><a class="dropdown-item d-flex align-items-center py-2" href="#">
                            <b-icon icon="trash" class="mr-2" font-scale=".95"></b-icon>
                            Remove
                        </a>
                    </li> -->
                </template>


            </AppTable>
        </main>

        <AppModal modalId="updateIssuedBookModal">
            <template #modal-header>
                Update Issued Book
            </template>
            <template #modal-body>
                <form class="px-2">
                    <div class="row  mb-3 pt-0">
                        <label for="status">Status</label>
                        <b-form-select id="status" v-model="selected" :options="options"></b-form-select>


                    </div>
                    <div class="row mb-2">
                        <label for="date_returned">Date Returned</label>
                        <b-form-input type="date" id="date_returned"></b-form-input>

                    </div>
                </form>
            </template>
            <template #modal-btn>
                <b-button variant="primary">
                    Update
                </b-button>
            </template>
        </AppModal>
    </div>
</template>

<script>
import AppModal from '@/components/AppModal.vue';
import AppTable from '@/components/AppTable.vue';
import { mapState } from 'vuex';

export default {
    props: [],
    components: {
        AppTable,
        AppModal
    },
    data() {
        return {
            fields: [
                { key: 'b_isbn', label: 'isbn', thStyle: { textTransform: "uppercase", width: '150px', }, },
                { key: 'title', thStyle: { textTransform: "uppercase", width: '400px' }, sortable: true },
                { key: 'r_reader_id', label: 'reader id', thStyle: { textTransform: "uppercase", width: '150px' }, sortable: true },
                { key: 'reader', thStyle: { textTransform: "uppercase", width: '190px' }, sortable: true },
                { key: 'return_date', thStyle: { textTransform: "uppercase", width: '160px' }, sortable: true },
                { key: 'status', thStyle: { textTransform: "uppercase", width: '120px' }, sortable: true },
                { key: 'date_issued', thStyle: { textTransform: "uppercase", width: '160px' }, sortable: true },
                { key: 'date_returned', thStyle: { textTransform: "uppercase", width: '180px' }, sortable: true },
                { key: 'actions', thStyle: { textTransform: "uppercase", width: '120px' }, sortable: true },
            ],
            selected: null,
            options: [
                { value: null, text: 'Select', disabled: true },
                { value: 'active', text: 'Active' },
                { value: 'overdue', text: 'Overdue' },
                { value: 'returned', text: 'Returned' }
            ]
        }
    },
    created() {
        this.$store.dispatch('fetchIssuedBooks')
    },
    computed: {
        ...mapState(['issuedBooks']),
        items() {
            return this.issuedBooks.issuedBooks;
        }
    }
}
</script>

<style>

</style>