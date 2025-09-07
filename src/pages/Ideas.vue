<template>
    <IdeaTable
        :initial-tag-filter="tagFilter"
        :initial-category-filter="categoryFilter"
        :initial-date-filter="dateFilter"
    />
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
</script>
