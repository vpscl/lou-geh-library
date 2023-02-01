<template>
    <div class="wrapper">
        <main>
            <AppTable :fields="fields" :items="items">
                <template v-slot:header>
                    <div class="d-flex mt-2 mb-4">
                        <h4>Requests</h4>
                    </div>
                </template>
                <template v-slot:dropdown-list>
                    <li>
                        <a class="dropdown-item d-flex align-items-center py-2" href="#">
                            <b-icon icon="check-circle" class="mr-2" font-scale=".95"></b-icon>
                            Approve
                        </a>
                    </li>
                    <li><a class="dropdown-item d-flex align-items-center py-2" href="#">
                            <b-icon icon="x-circle" class="mr-2" font-scale=".95"></b-icon>
                            Reject
                        </a>
                    </li>
                </template>
            </AppTable>
        </main>
    </div>
</template>

<script>
import AppTable from '@/components/AppTable.vue';
import { mapState } from 'vuex';

export default {
    props: [],
    components: {
        AppTable
    },
    data() {
        return {
            fields: [
                { key: 'reader', thStyle: { textTransform: "uppercase" }, sortable: true },
                { key: 'title', label: 'book', thStyle: { textTransform: "uppercase" }, sortable: true },
                { key: 'date_requested', thStyle: { textTransform: "uppercase" }, sortable: true },
                { key: 'actions', thStyle: { textTransform: "uppercase" } },
            ],

        }
    },
    created() {
        this.$store.dispatch('fetchRequests')
    },
    computed: {
        ...mapState(['requests']),
        items() {
            return this.requests.requests
        }
    }
}
</script>

<style>

</style>