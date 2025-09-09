<template>
    <div class="dashboard-container">
        <div class="dashboard-content">
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
            <div class="grid mb-3 justify-content-center">
                <!-- Total Ideas with integrated status badges -->
                <div class="col-12 md:col-6 lg:col-5">
                    <TotalIdeasCard
                        :total-ideas="totalIdeas"
                        :status-distribution="statusDistribution"
                        :weekly-growth="weeklyGrowth"
                        @status-click="handleStatusClick"
                    />
                </div>

                <!-- Combined Metrics Card -->
                <div class="col-12 md:col-6 lg:col-7">
                    <CombinedMetricsCard
                        :total-votes="totalVotes"
                        :avg-votes="avgVotes"
                        :top-voted-votes="topVotedVotes"
                        :top-voted-title="topVotedTitle"
                        :active-percentage="activePercentage"
                        :active-ideas="activeIdeas"
                    />
                </div>
            </div>

            <div class="grid mb-3 justify-content-center">
                <!-- Category Distribution -->
                <div class="col-12 md:col-6 lg:col-5">
                    <Card class="h-full flex-1">
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

                <!-- Daily Idea Activity - Full Width Below Metrics -->
                <div class="col-12 md:col-6 lg:col-7">
                    <div class="col-6">
                        <Card class="compact-card">
                            <template #title>
                                <div
                                    class="flex align-items-center justify-content-between"
                                >
                                    <span class="text-base"
                                        >Daily Idea Activity</span
                                    >
                                    <span class="text-xs text-500">{{
                                        currentYear
                                    }}</span>
                                </div>
                            </template>
                            <template #content>
                                <div class="calendar-wrapper-compact">
                                    <CalendarHeatmap
                                        :data="activityData"
                                        :year="currentYear"
                                        color-scheme="greens"
                                        :cell-size="10"
                                        :show-day-labels="false"
                                        @date-click="handleDateClick"
                                    />
                                </div>
                            </template>
                        </Card>
                    </div>
                </div>
            </div>

            <!-- Data Visualizations -->
            <div class="grid mb-4">
                <!-- Trend Chart -->
                <div class="col-12 lg:col-8 flex">
                    <Card class="h-full flex-1">
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
            </div>

            <!-- Popular Tags -->
            <div class="grid mb-4">
                <div class="col-12">
                    <Card>
                        <template #title>
                            <div
                                class="flex flex-column sm:flex-row align-items-start sm:align-items-center justify-content-between gap-2"
                            >
                                <span>Popular Tags</span>
                                <span class="text-sm text-500"
                                    >Click a tag to filter ideas</span
                                >
                            </div>
                        </template>
                        <template #content>
                            <div class="tag-cloud-wrapper">
                                <TagCloud
                                    :tags="tagCloudData"
                                    :height="300"
                                    @tag-click="handleTagClick"
                                />
                            </div>
                        </template>
                    </Card>
                </div>
            </div>

            <!-- Recent Ideas Table -->
            <div class="grid">
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
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useIdeasStore } from "../stores/ideas";
import { resetToSeed } from "../services/api";

// Components
import TotalIdeasCard from "../components/TotalIdeasCard.vue";
import CombinedMetricsCard from "../components/CombinedMetricsCard.vue";
import TrendChart from "../components/TrendChart.vue";
import CategoryChart from "../components/CategoryChart.vue";
import TagCloud from "../components/TagCloud.vue";
import CalendarHeatmap from "../components/CalendarHeatmap.vue";
import IdeaTable from "../components/IdeaTable.vue";

// PrimeVue Components
import Button from "primevue/button";
import Card from "primevue/card";
import SelectButton from "primevue/selectbutton";

const router = useRouter();
const store = useIdeasStore();

// Chart controls
const chartTimeRange = ref("7d");
const currentYear = ref(new Date().getFullYear());

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

// Generate activity data for calendar heatmap from actual idea data
const activityData = computed(() => {
    const activityMap = new Map();
    const today = new Date();
    const yearStart = new Date(currentYear.value, 0, 1);
    const yearEnd = new Date(currentYear.value, 11, 31);

    // Count ideas per day based on createdAt dates
    store.items.forEach((idea) => {
        if (idea.createdAt) {
            const ideaDate = new Date(idea.createdAt);

            // Only include ideas from the selected year
            if (
                ideaDate >= yearStart &&
                ideaDate <= yearEnd &&
                ideaDate <= today
            ) {
                // Use UTC date parts to create consistent date string
                const year = ideaDate.getUTCFullYear();
                const month = String(ideaDate.getUTCMonth() + 1).padStart(
                    2,
                    "0"
                );
                const day = String(ideaDate.getUTCDate()).padStart(2, "0");
                const dateStr = `${year}-${month}-${day}`;
                const currentCount = activityMap.get(dateStr) || 0;
                activityMap.set(dateStr, currentCount + 1);
            }
        }
    });

    // Convert map to array format expected by CalendarHeatmap
    return Array.from(activityMap, ([date, count]) => ({
        date,
        count,
    }));
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

const handleDateClick = (dateData) => {
    // Navigate to ideas page with date filter
    router.push({
        path: "/ideas",
        query: { date: dateData.dateStr },
    });
};

const handleStatusClick = (status) => {
    // Navigate to ideas page with status filter
    router.push({
        path: "/ideas",
        query: { status: status },
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
    width: 100%;
    overflow-x: hidden;
    display: flex;
    justify-content: center;
}

.dashboard-content {
    width: 100%;
    max-width: 1400px;
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

/* Compact card for calendar heatmap */
.compact-card :deep(.p-card-content) {
    padding: 0.75rem;
}

.calendar-wrapper-compact {
    max-height: 180px;
    overflow: hidden;
}

:deep(.p-selectbutton .p-button) {
    padding: 0.25rem 0.5rem;
    font-size: 0.875rem;
}

/* Status badges container */
.status-badges-container {
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

/* Prevent overflow in tag cloud and calendar containers */
.tag-cloud-wrapper,
.calendar-wrapper {
    width: 100%;
    max-width: 100%;
    overflow-x: hidden;
    overflow-y: hidden;
}

/* Ensure proper spacing on smaller screens */
@media (max-width: 1200px) {
    .tag-cloud-wrapper,
    .calendar-wrapper {
        min-height: 300px;
    }
}

@media (max-width: 768px) {
    .dashboard-container {
        padding: 0.5rem;
    }

    .tag-cloud-wrapper {
        overflow-x: hidden;
        min-height: 250px;
    }

    .calendar-wrapper {
        overflow-x: auto;
        overflow-y: hidden;
        -webkit-overflow-scrolling: touch;
        max-width: 100%;
    }

    /* Make buttons smaller on mobile */
    :deep(.p-button) {
        padding: 0.5rem 0.75rem;
        font-size: 0.875rem;
    }

    /* Reduce card padding on mobile */
    :deep(.p-card .p-card-content) {
        padding: 0.75rem;
    }
}
</style>
