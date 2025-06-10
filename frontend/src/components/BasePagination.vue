<template>
    <nav v-if="totalPages > 1">
        <ul class="pagination justify-content-center custom-pagination mb-0">
            <li class="page-item" :class="{ disabled: currentPage === 1 }">
                <button class="page-link" @click="$emit('page-change', currentPage - 1)">Prev</button>
            </li>
            <li class="page-item" v-if="currentPage > 2">
                <button class="page-link" @click="$emit('page-change', 1)">1</button>
            </li>
            <li class="page-item disabled" v-if="currentPage > 3"><span class="page-link">...</span></li>

            <li v-for="page in pageRange" :key="page" class="page-item" :class="{ active: currentPage === page }">
                <button class="page-link" @click="$emit('page-change', page)">
                    {{ page }}
                </button>
            </li>

            <li class="page-item disabled" v-if="currentPage < totalPages - 2"><span class="page-link">...</span></li>
            <li class="page-item" v-if="currentPage < totalPages - 1">
                <button class="page-link" @click="$emit('page-change', totalPages)">
                    {{ totalPages }}
                </button>
            </li>
            <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                <button class="page-link" @click="$emit('page-change', currentPage + 1)">Next</button>
            </li>
        </ul>
    </nav>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
    currentPage: Number,
    totalPages: Number,
});

const pageRange = computed(() => {
    const range = [];
    const start = Math.max(1, props.currentPage - 1);
    const end = Math.min(props.totalPages, props.currentPage + 1);
    for (let i = start; i <= end; i++) {
        range.push(i);
    }
    return range;
});
</script>


<style scoped>
.custom-pagination .page-item {
    margin: 0 4px;
}

.custom-pagination .page-link {
    border-radius: 0.5rem;
    border: 1px solid #dee2e6;
    color: #0d6efd;
    padding: 0.375rem 0.75rem;
    transition: all 0.2s ease;
}

.custom-pagination .page-item.active .page-link {
    background-color: #0d6efd;
    color: white;
    border-color: #0d6efd;
}

.custom-pagination .page-item.disabled .page-link {
    color: #adb5bd;
    background-color: #f8f9fa;
    border-color: #dee2e6;
}
</style>