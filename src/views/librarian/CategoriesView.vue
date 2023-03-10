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
            <a class="dropdown-item" @click="logout">Logout </a>
          </template>
        </AppDropdown>
      </div>

      <div class="table__container p-4 pt-3 rounded">
        <div class="d-flex justify-content-between mt-2 mb-4">
          <h4>Categories</h4>
          <div>
            <b-button class="mr-2 warning-btn" v-if="selectedRow[0] && selectedCategory.c_status == 'active'"
              v-b-modal.removeCategoryModal>
              <b-icon icon="slash-circle" scale=".85"></b-icon>
              Mark as Inactive</b-button>

            <b-button class="mr-2 success-btn" @click="
              editCategory(selectedCategory.category_id, selectedCategory)
            " v-if="selectedRow[0] && selectedCategory.c_status == 'inactive'">
              <b-icon icon="check2-circle" scale=".85"></b-icon>
              Mark as Active</b-button>
            <b-button class="mr-2 info-btn" v-if="selectedRow[0]" v-b-modal.updateCategoryModal>
              Update</b-button>

            <b-button v-b-modal.addCategoryModal class="primary-btn">Add Category</b-button>
          </div>
        </div>

        <b-table :items="items" :per-page="perPage" :fields="fields" :current-page="currentPage" label-sort-asc=""
          label-sort-desc="" label-sort-clear="" fixed responsive :filter="filter" select-mode="single"
          ref="selectableTable" selectable @row-selected="onRowSelected" @filtered="onFiltered">
          <template #cell(category_name)="row">
            <div v-if="row.item.c_status == 'inactive'" class="inactive">
              <span>{{ row.item.category_name }}</span>
              <b-badge pill variant="light" class="ml-2">{{
                row.item.c_status
              }}</b-badge>
            </div>
            <template v-else>
              {{ row.item.category_name }}
            </template>
          </template>
        </b-table>

        <b-pagination v-model="currentPage" :total-rows="totalRows" :per-page="perPage" aria-controls="my-table"
          class="mt-3 mb-0 justify-content-center"></b-pagination>

        <AppModal modalId="addCategoryModal" :key="modalKey" hideFooter>
          <template #modal-header> Add Category </template>
          <template #modal-body>
            <form class="px-2" @submit.prevent="addCategory">
              <div class="mb-3 pt-0" :class="{
                'input-group--error': $v.category.category_name.$error,
              }">
                <label for="category">Category Name</label>
                <b-form-input id="category" v-model="category.category_name"></b-form-input>
                <p class="error-message" v-if="
                  submitStatus === 'error' &&
                  !$v.category.category_name.required
                ">
                  Category name is required.
                </p>
              </div>
              <div class="w-100 mt-4 d-flex justify-content-end">
                <b-button class="mr-2 secondary-btn" @click="rerenderModal">
                  Cancel
                </b-button>
                <b-button type="submit" class="primary-btn"> Add </b-button>
              </div>
            </form>
          </template>
        </AppModal>
      </div>

      <AppModal modalId="updateCategoryModal" hideFooter :key="modalKey">
        <template #modal-header> Update Category </template>
        <template #modal-body>
          <form class="px-2" @submit.prevent="
            editCategory(selectedCategory.category_id, selectedCategory)
          ">
            <div class="mb-3 pt-0">
              <label for="category">Category</label>
              <b-form-input id="category" v-model="selectedCategory.category_name"></b-form-input>
            </div>

            <div class="w-100 mt-4 d-flex justify-content-end">
              <b-button class="mr-2 secondary-btn" @click="rerenderModal()">
                Cancel
              </b-button>
              <b-button type="submit" class="primary-btn"> Update </b-button>
            </div>
          </form>
        </template>
      </AppModal>
    </main>

    <AppModal modalId="removeCategoryModal" hideFooter :key="modalKey">
      <template #modal-header> Mark Selected Category as Inactive </template>
      <template #modal-body>
        <div class="pb-2 pt-1">
          Are you sure you want to mark
          <b>{{ selectedCategory.category_name }}</b> as inactive?
        </div>

        <div class="w-100 mt-4 d-flex justify-content-end">
          <b-button class="mr-2 secondary-btn text-muted" @click="rerenderModal()">
            Cancel
          </b-button>
          <b-button class="warning-btn text-warning" @click="deleteCategory(selectedCategory.category_id)">
            Yes
          </b-button>
        </div>
      </template>
    </AppModal>
  </div>
</template>

<script>
import AppModal from "@/components/AppModal.vue";
import AppDropdown from "@/components/AppDropdown.vue";
import { required } from "vuelidate/lib/validators";
import { mapState } from "vuex";

export default {
  props: [],
  components: {
    AppModal,
    AppDropdown,
  },
  validations: {
    category: {
      category_name: {
        required,
      },
    },
  },
  data() {
    return {
      fields: [
        {
          key: "category_name",
          label: "category",
          thStyle: { textTransform: "uppercase" },
          sortable: true,
        },
      ],
      perPage: 12,
      currentPage: 1,
      totalRows: 1,
      filter: null,
      category: this.newCategoryObject(),
      modalKey: 0,
      selectedRow: [],
      selectedCategory: {},
      submitStatus: null,
    };
  },
  created() {
    this.$store.dispatch("fetchCategories");
  },
  computed: {
    ...mapState(["categories"]),
    items() {
      return this.categories.categories;
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
      this.selectedRow = items;
      for (let category of this.selectedRow) {
        this.selectedCategory = category;
      }
    },
    onFiltered(filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length;
      this.currentPage = 1;
    },
    newCategoryObject() {
      return {
        category_name: "",
      };
    },
    rerenderModal() {
      this.modalKey += 1;
    },
    addCategory() {
      this.$v.$touch();
      if (this.$v.$invalid) {
        this.submitStatus = "error";
      } else {
        this.$store
          .dispatch("addCategory", this.category)
      }
    },
    editCategory(id, category) {
      this.$store
        .dispatch("editCategory", { id, category })
    },
    deleteCategory(id) {
      this.$store
        .dispatch("removeCategory", id)
    },
    logout() {
      this.$store.dispatch("logout")
    },
  },
};
</script>

<style lang="scss" scoped>

</style>
