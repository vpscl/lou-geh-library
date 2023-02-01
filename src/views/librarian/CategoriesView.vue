<template>
    <div class="wrapper">
        <main>
            <AppTable :fields="fields" :items="items">
                <template v-slot:header>
                    <div class="d-flex justify-content-between mt-2 mb-4">
                        <h4>Categories</h4>
                        <b-button v-b-modal.addCategoryModal variant="primary">Add Category</b-button>
                    </div>
                </template>

                <template #dropdown-list>
                    <li>
                        <a v-b-modal.updateCategoryModal class="dropdown-item d-flex align-items-center py-2" href="#">
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
        </main>

        <AppModal modalId="addCategoryModal" :key="modalKey" hideFooter>
            <template #modal-header>
                Add Category
            </template>
            <template #modal-body>
                <form class="px-2" @submit.prevent="addCategory">
                    <div class="row  mb-3 pt-0">
                        <label for="category">Category</label>
                        <b-form-input id="category" v-model="category.category_name"></b-form-input>
                    </div>
                    <!-- <div class="row mb-2">
                        <label for="subcategories">Subcategories</label>
                        <b-form-input id="subcategories"></b-form-input>
                    </div> -->
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

        <AppModal modalId="updateCategoryModal">
            <template #modal-header>
                Update Category
            </template>
            <template #modal-body>
                <form class="px-2">
                    <div class="row  mb-3 pt-0">
                        <label for="category">Category</label>
                        <b-form-input id="category"></b-form-input>
                    </div>
                    <!-- <div class="row mb-2">
                        <label for="subcategories">Subcategories</label>
                        <b-form-input id="subcategories"></b-form-input>
                    </div> -->
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
import AppTable from '@/components/AppTable.vue';
import AppModal from '@/components/AppModal.vue';
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
                { key: 'category_name', label: 'category', thStyle: { textTransform: "uppercase", width: "1370px" }, sortable: true },
                { key: 'actions', thStyle: { textTransform: "uppercase" } },
            ],
            category: this.newCategoryObject(),
            modalKey: 0
        }
    },
    created() {
        this.$store.dispatch('fetchCategories')
    },
    computed: {
        ...mapState(['categories']),
        items() {
            return this.categories.categories
        }
    },
    methods: {
        newCategoryObject() {
            return {
                category_name: ''
            }
        },
        rerenderModal() {
            this.modalKey += 1;
        },
        addCategory() {
            this.$store.dispatch('addCategory', this.category)
                .then(() => {
                    this.category = this.newCategoryObject()
                    this.rerenderModal()

                })
                .catch(() => {
                    console.log('There was a problem adding the category.')
                })
        },
    }
}
</script>

<style lang="scss">

</style>