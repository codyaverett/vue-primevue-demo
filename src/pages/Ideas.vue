<template>
    <div class="ideas-page">
        <IdeaTable
            :initial-tag-filter="tagFilter"
            :initial-category-filter="categoryFilter"
            :initial-date-filter="dateFilter"
            :initial-status-filter="statusFilter"
        />
    </div>
</template>
<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";
import IdeaTable from "../components/IdeaTable.vue";

const route = useRoute();

// Get tag filter from query param
const tagFilter = computed(() => route.query.tag || null);

// Get category filter from query param
const categoryFilter = computed(() => route.query.category || null);

// Get date filter from query param
const dateFilter = computed(() => route.query.date || null);

// Get status filter from query param
const statusFilter = computed(() => route.query.status || null);
</script>

<style scoped>
.ideas-page {
    height: 100%;
    display: flex;
    flex-direction: column;
}
</style>
