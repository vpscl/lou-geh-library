<template>
    <div class="wrapper">
        <main>
            <AppTable :fields="fields" :items="items">
                <template #header>
                    <div class="d-flex justify-content-between mt-2 mb-4">
                        <h4>Publishers</h4>
                        <b-button v-b-modal.addPublisherModal variant="primary">Add Publisher</b-button>
                    </div>
                </template>

                <template #dropdown-list>
                    <li>
                        <a v-b-modal.updatePublisherModal class="dropdown-item d-flex align-items-center py-2" href="#">
                            <b-icon icon="pencil-square" class="mr-2" font-scale=".95"></b-icon>
                            Update
                        </a>
                    </li>
                    <li><a class="dropdown-item d-flex align-items-center py-2" href="#">
                            <b-icon icon="trash" class="mr-2" font-scale=".95"></b-icon>
                            Remove
                        </a>
                    </li>
                </template>
            </AppTable>

            <AppModal modalId="addPublisherModal" :key="modalKey" hideFooter>
                <template #modal-header>
                    Add Publisher
                </template>

                <template #modal-body>
                    <form class="px-2" @submit.prevent="addPublisher">
                        <div class="row  mb-3 pt-0">
                            <label for="publisher_name">Name</label>
                            <b-input id="publisher_name" v-model="publisher.publisher_name"></b-input>
                            {{ publisher.publisher_name }}
                        </div>
                        <div class="row mb-2">
                            <label for="publisher_location">Location</label>
                            <b-form-input id="publisher_location" v-model="publisher.location"></b-form-input>
                        </div>
                        <div class="w-100 mt-4 d-flex justify-content-end">
                            <b-button variant="outline-secondary" class="mr-2" @click="rerenderModal">
                                Cancel
                            </b-button>
                            <b-button type="submit" variant="primary">
                                Add
                            </b-button>
                        </div>
                    </form>
                </template>

            </AppModal>

            <AppModal modalId="updatePublisherModal">
                <template #modal-header>
                    Update Publisher
                </template>

                <template #modal-body>
                    <form class="px-2">
                        <div class="row  mb-3 pt-0">
                            <label for="publisher_name">Name</label>
                            <b-input id="publisher_name"></b-input>
                        </div>
                        <div class="row mb-2">
                            <label for="publisher_location">Location</label>
                            <b-form-input id="publisher_location"></b-form-input>
                        </div>
                    </form>
                </template>

                <template #modal-btn>
                    <b-button variant="primary">Add</b-button>
                </template>
            </AppModal>
        </main>
    </div>
</template>

<script>
import AppTable from '@/components/AppTable.vue';
import AppModal from '@/components/AppModal.vue';
import { mapState } from 'vuex';

export default {
    name: 'PublishersView',
    props: [],
    components: {
        AppTable,
        AppModal
    },
    data() {
        return {
            fields: [
                { key: 'publisher_name', label: 'publisher', thStyle: { textTransform: "uppercase" }, sortable: true },
                { key: 'location', thStyle: { textTransform: "uppercase" }, sortable: true },
                { key: 'actions', thStyle: { textTransform: "uppercase" } },
            ],
            publisher: this.newPublisherObject(),
            modalKey: 0

        }
    },
    created() {
        this.$store.dispatch('fetchPublishers')
    },
    computed: {
        ...mapState(['publishers']),
        items() {
            return this.publishers.publishers
        }
    },
    methods: {
        rerenderModal() {
            this.modalKey += 1;
        },
        addPublisher() {
            this.$store.dispatch('addPublisher', this.publisher)
                .then(() => {
                    this.publisher = this.newPublisherObject();
                    this.rerenderModal();
                })
                .catch(() => {
                    console.log('There was a problem adding the publisher.')
                })
        },
        newPublisherObject() {
            return {
                publisher_name: '',
                location: ''
            }
        }
    }
}
</script>

<style>

</style>