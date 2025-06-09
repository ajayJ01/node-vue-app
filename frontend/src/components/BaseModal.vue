<template>
    <div class="modal fade" :id="modalId" tabindex="-1" aria-hidden="true" ref="modalRef">
        <div :class="['modal-dialog', modalSizeClass, 'modal-dialog-centered']">
            <div class="modal-content p-3 rounded-4">
                <div class="modal-header border-0">
                    <h5 class="modal-title text-primary">
                        <slot name="header">
                            <!-- Default header content can be here -->
                            Modal Title
                        </slot>
                    </h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <slot name="body">
                        <!-- Modal body content will come from parent -->
                    </slot>
                </div>
                <div class="modal-footer border-0">
                    <slot name="footer">
                        <!-- Optional footer buttons -->
                    </slot>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import * as bootstrap from "bootstrap";

const props = defineProps({
    modalId: { type: String, required: true },
    size: { type: String, default: "md" }, // e.g. 'sm', 'md', 'lg', 'xl'
});

const modalRef = ref(null);
let bsModal;

onMounted(() => {
    bsModal = new bootstrap.Modal(modalRef.value);
});

// Expose methods to open/close modal from parent
defineExpose({
    show: () => bsModal.show(),
    hide: () => bsModal.hide(),
});

const modalSizeClass = computed(() => {
    if (props.size === "sm") return "modal-sm";
    if (props.size === "lg") return "modal-lg";
    if (props.size === "xl") return "modal-xl";
    return ""; // md is default, no class needed
});
</script>

<style scoped>
.modal-content {
    /* you can add custom styling here */
}
</style>
