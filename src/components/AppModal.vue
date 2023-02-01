<template>
    <b-modal :id="modalId" :size="modalSize" ref="modal" centered no-stacking :hide-footer="hideFooter">
        <template #modal-title>
            <slot name="modal-header"></slot>
        </template>
        <div class="px-3 py-2">
            <slot name="modal-body"></slot>
        </div>
    </b-modal>
</template>

<script>
export default {
    name: 'AppModal',
    props: ['modalId', 'hideFooter', 'modalSize', 'submitMethod'],
    methods: {
        showModal() {
            this.$refs['modal'].show()
        },
        hideModal() {
            this.$refs['modal'].hide()
        }
    }
}
</script>