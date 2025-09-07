<template>
    <div class="dashboard-container">
        <!-- Quick Actions Bar -->
        <div class="quick-actions mb-4">
            <div class="flex flex-wrap gap-2">
                <Button
                    label="Submit New Idea"
                    icon="pi pi-plus"
                    class="p-button-primary"
                    @click="router.push('/submit')"
                />
                <Button
                    label="View All Ideas"
                    icon="pi pi-list"
                    class="p-button-secondary"
                    @click="router.push('/ideas')"
                />
                <Button
                    label="Export Data"
                    icon="pi pi-download"
                    class="p-button-info"
                    @click="exportData"
                />
                <Button
                    label="Refresh"
                    icon="pi pi-refresh"
                    class="p-button-outlined"
                    :loading="store.loading"
                    @click="refreshData"
                />
                <Button
                    label="Reset Data"
                    icon="pi pi-replay"
                    class="p-button-warning p-button-outlined"
                    @click="resetData"
                />
            </div>
        </div>

        <!-- KPI Metrics Cards -->
        <div class="grid mb-4">
            <div class="col-12 md:col-6 lg:col-3">
                <MetricCard
                    title="Total Ideas"
                    :value="totalIdeas"
                    icon="pi pi-lightbulb"
                    color="primary"
                    :trend="{
                        value: `+${weeklyGrowth}%`,
                        severity: 'success',
                        label: 'vs last week',
                    }"
                />
            </div>

            <div class="col-12 md:col-6 lg:col-3">
                <MetricCard
                    title="Active Ideas"
                    :value="activeIdeas"
                    icon="pi pi-check-circle"
                    color="green"
                    :subtitle="{
                        bold: `${activePercentage}%`,
                        text: ' of total',
                    }"
                />
            </div>

            <div class="col-12 md:col-6 lg:col-3">
                <MetricCard
                    title="Total Votes"
                    :value="totalVotes"
                    icon="pi pi-thumbs-up"
                    color="orange"
                    :subtitle="{ text: `Avg ${avgVotes} per idea` }"
                />
            </div>

            <div class="col-12 md:col-6 lg:col-3">
                <MetricCard
                    title="Top Voted"
                    :value="topVotedTitle"
                    icon="pi pi-star"
                    color="purple"
                    :subtitle="{
                        bold: topVotedVotes.toString(),
                        text: ' votes',
                    }"
                    :format-value="
                        (v) => (v.length > 20 ? v.substring(0, 20) + '...' : v)
                    "
                />
            </div>
        </div>

        <!-- Status Distribution Cards -->
        <div class="grid mb-4">
            <div
                v-for="(count, status) in statusDistribution"
                :key="status"
                class="col-12 md:col-6 lg:col-3"
            >
                <StatusCard :status="status" :count="count" />
            </div>
        </div>

        <!-- Data Visualizations -->
        <div class="grid mb-4">
            <!-- Trend Chart -->
            <div class="col-12 lg:col-8">
                <Card>
                    <template #title>
                        <div
                            class="flex align-items-center justify-content-between"
                        >
                            <span>Ideas Trend</span>
                            <SelectButton
                                v-model="chartTimeRange"
                                :options="timeRangeOptions"
                                option-label="label"
                                option-value="value"
                                class="text-sm"
                            />
                        </div>
                    </template>
                    <template #content>
                        <TrendChart
                            :time-range="chartTimeRange"
                            :height="300"
                        />
                    </template>
                </Card>
            </div>

            <!-- Category Distribution -->
            <div class="col-12 lg:col-4">
                <Card>
                    <template #title> Category Distribution </template>
                    <template #content>
                        <CategoryChart
                            :data="categoryData"
                            :height="300"
                            @category-click="handleCategoryClick"
                        />
                    </template>
                </Card>
            </div>
        </div>

        <!-- Tag Cloud -->
        <div class="grid mb-4">
            <div class="col-12">
                <Card>
                    <template #title>
                        <div
                            class="flex align-items-center justify-content-between"
                        >
                            <span>Popular Tags</span>
                            <span class="text-sm text-500"
                                >Click a tag to filter ideas</span
                            >
                        </div>
                    </template>
                    <template #content>
                        <TagCloud
                            :tags="tagCloudData"
                            :height="350"
                            @tag-click="handleTagClick"
                        />
                    </template>
                </Card>
            </div>
        </div>

        <!-- Recent Ideas Table -->
        <div class="col-12">
            <Card>
                <template #title>
                    <div
                        class="flex align-items-center justify-content-between"
                    >
                        <span>Recent Ideas</span>
                        <Button
                            label="View All"
                            icon="pi pi-arrow-right"
                            class="p-button-text p-button-sm"
                            @click="router.push('/ideas')"
                        />
                    </div>
                </template>
                <template #content>
                    <IdeaTable :limit="5" />
                </template>
            </Card>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useIdeasStore } from "../stores/ideas";
import { resetToSeed } from "../services/api";

// Components
import MetricCard from "../components/MetricCard.vue";
import StatusCard from "../components/StatusCard.vue";
import TrendChart from "../components/TrendChart.vue";
import CategoryChart from "../components/CategoryChart.vue";
import TagCloud from "../components/TagCloud.vue";
import IdeaTable from "../components/IdeaTable.vue";

// PrimeVue Components
import Button from "primevue/button";
import Card from "primevue/card";
import SelectButton from "primevue/selectbutton";

const router = useRouter();
const store = useIdeasStore();

// Chart controls
const chartTimeRange = ref("7d");

const timeRangeOptions = [
    { label: "7 Days", value: "7d" },
    { label: "30 Days", value: "30d" },
    { label: "90 Days", value: "90d" },
];

// Computed KPI metrics
const totalIdeas = computed(() => store.items.length);

const activeIdeas = computed(() => {
    return store.items.filter((item) => item.status === "Active").length;
});

const totalVotes = computed(() => {
    return store.items.reduce((sum, idea) => sum + (idea.votes || 0), 0);
});

const avgVotes = computed(() => {
    if (totalIdeas.value === 0) return 0;
    return (totalVotes.value / totalIdeas.value).toFixed(1);
});

const activePercentage = computed(() => {
    if (totalIdeas.value === 0) return 0;
    return Math.round((activeIdeas.value / totalIdeas.value) * 100);
});

const topVotedIdea = computed(() => {
    if (store.items.length === 0) return null;
    return store.items.reduce(
        (max, idea) => ((idea.votes || 0) > (max?.votes || 0) ? idea : max),
        store.items[0]
    );
});

const topVotedTitle = computed(() => topVotedIdea.value?.title || "N/A");
const topVotedVotes = computed(() => topVotedIdea.value?.votes || 0);

const statusDistribution = computed(() => {
    const distribution = {};
    store.items.forEach((item) => {
        distribution[item.status] = (distribution[item.status] || 0) + 1;
    });
    return distribution;
});

const categoryData = computed(() => {
    const categoryMap = store.items.reduce((acc, idea) => {
        const category = idea.category || "Other";
        acc[category] = (acc[category] || 0) + 1;
        return acc;
    }, {});

    return Object.entries(categoryMap).map(([key, value]) => ({
        category: key,
        count: value,
    }));
});

const tagCloudData = computed(() => {
    const tagMap = {};

    // Process all tags from all ideas
    store.items.forEach((idea) => {
        if (idea.tags && Array.isArray(idea.tags)) {
            idea.tags.forEach((tag) => {
                tagMap[tag] = (tagMap[tag] || 0) + 1;
            });
        }
    });

    // Convert to array format expected by TagCloud component
    return Object.entries(tagMap)
        .map(([text, count]) => ({ text, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 30); // Limit to top 30 tags
});

const weeklyGrowth = computed(() => {
    // Simulate weekly growth for demo
    return Math.floor(Math.random() * 20 + 5);
});

// Methods
const exportData = () => {
    const dataStr = JSON.stringify(store.items, null, 2);
    const dataUri =
        "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);
    const exportFileDefaultName = `ideas-export-${new Date().toISOString().split("T")[0]}.json`;

    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
};

const refreshData = async () => {
    await store.refresh();
};

const resetData = async () => {
    console.log("Resetting data to seed...");
    resetToSeed();
    await store.refresh();
    console.log("Data reset complete. Items:", store.items.length, "items");
};

const handleTagClick = (tag) => {
    // Navigate to ideas page with tag filter
    router.push({
        path: "/ideas",
        query: { tag: tag.text },
    });
};

const handleCategoryClick = (categoryData) => {
    // Navigate to ideas page with category filter
    router.push({
        path: "/ideas",
        query: { category: categoryData.category },
    });
};

// Lifecycle
onMounted(async () => {
    console.log("Dashboard mounted, loading data...");
    await store.refresh();
    console.log("Loaded", store.items.length, "ideas");
});
</script>

<style scoped>
.dashboard-container {
    padding: 1rem;
}

.quick-actions {
    background: linear-gradient(
        135deg,
        var(--surface-50) 0%,
        var(--surface-0) 100%
    );
    padding: 1rem;
    border-radius: 8px;
}

:deep(.p-card) {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    transition: all 0.3s ease;
}

:deep(.p-card:hover) {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

:deep(.p-selectbutton .p-button) {
    padding: 0.25rem 0.5rem;
    font-size: 0.875rem;
}

@media (max-width: 768px) {
    .dashboard-container {
        padding: 0.5rem;
    }
}
</style>
