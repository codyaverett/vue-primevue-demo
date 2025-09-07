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
            <!-- Total Ideas Card -->
            <div class="col-12 md:col-6 lg:col-3">
                <div class="metric-card surface-card p-4 border-round shadow-2">
                    <div
                        class="flex align-items-center justify-content-between mb-3"
                    >
                        <div>
                            <span class="text-500 text-sm block mb-2"
                                >Total Ideas</span
                            >
                            <div class="text-3xl font-bold text-primary">
                                {{ totalIdeas }}
                            </div>
                        </div>
                        <div
                            class="metric-icon bg-primary-100 border-round p-3"
                        >
                            <i class="pi pi-lightbulb text-primary text-2xl" />
                        </div>
                    </div>
                    <div class="flex align-items-center">
                        <Tag
                            :value="`+${weeklyGrowth}%`"
                            severity="success"
                            class="text-xs"
                        />
                        <span class="text-500 text-sm ml-2">vs last week</span>
                    </div>
                </div>
            </div>

            <!-- Active Ideas Card -->
            <div class="col-12 md:col-6 lg:col-3">
                <div class="metric-card surface-card p-4 border-round shadow-2">
                    <div
                        class="flex align-items-center justify-content-between mb-3"
                    >
                        <div>
                            <span class="text-500 text-sm block mb-2"
                                >Active Ideas</span
                            >
                            <div class="text-3xl font-bold text-green-600">
                                {{ activeIdeas }}
                            </div>
                        </div>
                        <div class="metric-icon bg-green-100 border-round p-3">
                            <i
                                class="pi pi-check-circle text-green-600 text-2xl"
                            />
                        </div>
                    </div>
                    <div class="text-500 text-sm">
                        <span class="font-semibold"
                            >{{ activePercentage }}%</span
                        >
                        of total
                    </div>
                </div>
            </div>

            <!-- Total Votes Card -->
            <div class="col-12 md:col-6 lg:col-3">
                <div class="metric-card surface-card p-4 border-round shadow-2">
                    <div
                        class="flex align-items-center justify-content-between mb-3"
                    >
                        <div>
                            <span class="text-500 text-sm block mb-2"
                                >Total Votes</span
                            >
                            <div class="text-3xl font-bold text-orange-600">
                                {{ totalVotes }}
                            </div>
                        </div>
                        <div class="metric-icon bg-orange-100 border-round p-3">
                            <i
                                class="pi pi-thumbs-up text-orange-600 text-2xl"
                            />
                        </div>
                    </div>
                    <div class="text-500 text-sm">
                        Avg
                        <span class="font-semibold">{{ avgVotes }}</span> per
                        idea
                    </div>
                </div>
            </div>

            <!-- Top Voted Card -->
            <div class="col-12 md:col-6 lg:col-3">
                <div class="metric-card surface-card p-4 border-round shadow-2">
                    <div
                        class="flex align-items-center justify-content-between mb-3"
                    >
                        <div>
                            <span class="text-500 text-sm block mb-2"
                                >Top Voted</span
                            >
                            <div
                                class="text-xl font-bold text-purple-600 text-overflow-ellipsis overflow-hidden white-space-nowrap"
                            >
                                {{ topVotedTitle }}
                            </div>
                        </div>
                        <div class="metric-icon bg-purple-100 border-round p-3">
                            <i class="pi pi-star text-purple-600 text-2xl" />
                        </div>
                    </div>
                    <div class="text-500 text-sm">
                        <span class="font-semibold">{{ topVotedVotes }}</span>
                        votes
                    </div>
                </div>
            </div>
        </div>

        <!-- Status Distribution Cards -->
        <div class="grid mb-4">
            <div
                v-for="(count, status) in statusDistribution"
                :key="status"
                class="col-12 md:col-6 lg:col-3"
            >
                <div
                    class="status-card surface-card p-3 border-round shadow-1 hover:shadow-3 transition-all transition-duration-300"
                >
                    <div
                        class="flex align-items-center justify-content-between"
                    >
                        <div>
                            <div class="text-500 text-sm mb-1">
                                {{ status }}
                            </div>
                            <div class="text-2xl font-bold">
                                {{ count }}
                            </div>
                        </div>
                        <Tag
                            :value="status"
                            :severity="getStatusSeverity(status)"
                        />
                    </div>
                </div>
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
                        <div
                            ref="trendChartRef"
                            class="chart-container"
                            style="height: 300px"
                        />
                    </template>
                </Card>
            </div>

            <!-- Category Distribution -->
            <div class="col-12 lg:col-4">
                <Card>
                    <template #title> Category Distribution </template>
                    <template #content>
                        <div
                            ref="categoryChartRef"
                            class="chart-container"
                            style="height: 300px"
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
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from "vue";
import { useRouter } from "vue-router";
import * as d3 from "d3";
import IdeaTable from "../components/IdeaTable.vue";
import { useIdeasStore } from "../stores/ideas";
import { resetToSeed } from "../services/api";
import Button from "primevue/button";
import Card from "primevue/card";
import Tag from "primevue/tag";
import SelectButton from "primevue/selectbutton";

const router = useRouter();
const store = useIdeasStore();

// Chart refs
const trendChartRef = ref(null);
const categoryChartRef = ref(null);
const chartTimeRange = ref("7d");

const timeRangeOptions = [
    { label: "7 Days", value: "7d" },
    { label: "30 Days", value: "30d" },
    { label: "90 Days", value: "90d" },
];

// Computed KPI metrics - directly computed from store.items
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

const weeklyGrowth = computed(() => {
    // Simulate weekly growth for demo
    return Math.floor(Math.random() * 20 + 5);
});

// Helper functions
const getStatusSeverity = (status) => {
    const severityMap = {
        Active: "success",
        "Under Review": "warning",
        Implemented: "info",
        Archived: "secondary",
    };
    return severityMap[status] || "secondary";
};

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
    await nextTick();
    drawCharts();
};

const resetData = async () => {
    console.log("Resetting data to seed...");
    resetToSeed();
    await store.refresh();
    console.log("Data reset complete. Items:", store.items.length, "items");
    await nextTick();
    drawCharts();
};

const drawCharts = () => {
    if (trendChartRef.value) drawTrendChart();
    if (categoryChartRef.value) drawCategoryChart();
};

// D3.js Chart Functions
const drawTrendChart = () => {
    if (!trendChartRef.value) return;

    // Clear previous chart
    d3.select(trendChartRef.value).selectAll("*").remove();

    const container = trendChartRef.value;
    const width = container.clientWidth;
    const height = container.clientHeight;
    const margin = { top: 20, right: 30, bottom: 40, left: 50 };

    // Generate sample data based on time range
    const days =
        chartTimeRange.value === "7d"
            ? 7
            : chartTimeRange.value === "30d"
              ? 30
              : 90;
    const data = Array.from({ length: days }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (days - i - 1));
        return {
            date: date,
            count: Math.floor(Math.random() * 10 + 5 + i * 0.5),
        };
    });

    const svg = d3
        .select(trendChartRef.value)
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    const g = svg
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3
        .scaleTime()
        .domain(d3.extent(data, (d) => d.date))
        .range([0, width - margin.left - margin.right]);

    const y = d3
        .scaleLinear()
        .domain([0, d3.max(data, (d) => d.count)])
        .nice()
        .range([height - margin.top - margin.bottom, 0]);

    // Create gradient
    const gradient = svg
        .append("defs")
        .append("linearGradient")
        .attr("id", "area-gradient")
        .attr("gradientUnits", "userSpaceOnUse")
        .attr("x1", 0)
        .attr("y1", y(0))
        .attr("x2", 0)
        .attr("y2", y(d3.max(data, (d) => d.count)));

    gradient
        .append("stop")
        .attr("offset", "0%")
        .attr("stop-color", "#8B5CF6")
        .attr("stop-opacity", 0.1);

    gradient
        .append("stop")
        .attr("offset", "100%")
        .attr("stop-color", "#8B5CF6")
        .attr("stop-opacity", 0.6);

    // Area
    const area = d3
        .area()
        .x((d) => x(d.date))
        .y0(y(0))
        .y1((d) => y(d.count))
        .curve(d3.curveMonotoneX);

    g.append("path")
        .datum(data)
        .attr("fill", "url(#area-gradient)")
        .attr("d", area);

    // Line
    const line = d3
        .line()
        .x((d) => x(d.date))
        .y((d) => y(d.count))
        .curve(d3.curveMonotoneX);

    g.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "#8B5CF6")
        .attr("stroke-width", 2)
        .attr("d", line);

    // Dots
    g.selectAll(".dot")
        .data(data)
        .enter()
        .append("circle")
        .attr("class", "dot")
        .attr("cx", (d) => x(d.date))
        .attr("cy", (d) => y(d.count))
        .attr("r", 4)
        .attr("fill", "#8B5CF6");

    // X Axis
    g.append("g")
        .attr(
            "transform",
            `translate(0,${height - margin.top - margin.bottom})`
        )
        .call(
            d3
                .axisBottom(x)
                .tickFormat(d3.timeFormat(days <= 7 ? "%a" : "%b %d"))
                .ticks(days <= 7 ? days : 6)
        )
        .style("color", "#6b7280");

    // Y Axis
    g.append("g").call(d3.axisLeft(y).ticks(5)).style("color", "#6b7280");
};

const drawCategoryChart = () => {
    if (!categoryChartRef.value) return;

    // Clear previous chart
    d3.select(categoryChartRef.value).selectAll("*").remove();

    const container = categoryChartRef.value;
    const width = container.clientWidth;
    const height = container.clientHeight;
    const radius = Math.min(width, height) / 2;

    // Group ideas by category
    const categoryData = store.items.reduce((acc, idea) => {
        const category = idea.category || "Other";
        acc[category] = (acc[category] || 0) + 1;
        return acc;
    }, {});

    const data = Object.entries(categoryData).map(([key, value]) => ({
        category: key,
        count: value,
    }));

    if (data.length === 0) {
        // Show "No Data" message
        d3.select(categoryChartRef.value)
            .append("div")
            .style("text-align", "center")
            .style("padding-top", "100px")
            .style("color", "#6b7280")
            .text("No category data available");
        return;
    }

    const svg = d3
        .select(categoryChartRef.value)
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    const g = svg
        .append("g")
        .attr("transform", `translate(${width / 2},${height / 2})`);

    const color = d3
        .scaleOrdinal()
        .domain(data.map((d) => d.category))
        .range([
            "#8B5CF6",
            "#EC4899",
            "#10B981",
            "#F59E0B",
            "#3B82F6",
            "#EF4444",
        ]);

    const pie = d3
        .pie()
        .value((d) => d.count)
        .sort(null);

    const arc = d3
        .arc()
        .innerRadius(radius * 0.5)
        .outerRadius(radius * 0.8);

    const labelArc = d3
        .arc()
        .innerRadius(radius * 0.9)
        .outerRadius(radius * 0.9);

    // Pie slices
    const arcs = g
        .selectAll(".arc")
        .data(pie(data))
        .enter()
        .append("g")
        .attr("class", "arc");

    arcs.append("path")
        .attr("d", arc)
        .attr("fill", (d) => color(d.data.category))
        .attr("stroke", "white")
        .attr("stroke-width", 2)
        .style("cursor", "pointer")
        .on("mouseover", function () {
            d3.select(this)
                .transition()
                .duration(200)
                .attr("transform", "scale(1.05)");
        })
        .on("mouseout", function () {
            d3.select(this)
                .transition()
                .duration(200)
                .attr("transform", "scale(1)");
        });

    // Labels
    arcs.append("text")
        .attr("transform", (d) => `translate(${labelArc.centroid(d)})`)
        .attr("text-anchor", "middle")
        .style("font-size", "12px")
        .style("fill", "#374151")
        .text((d) =>
            d.data.count > 0 ? `${d.data.category} (${d.data.count})` : ""
        );

    // Center text
    g.append("text")
        .attr("text-anchor", "middle")
        .attr("dy", "-0.5em")
        .style("font-size", "24px")
        .style("font-weight", "bold")
        .style("fill", "#1f2937")
        .text(store.items.length);

    g.append("text")
        .attr("text-anchor", "middle")
        .attr("dy", "1em")
        .style("font-size", "14px")
        .style("fill", "#6b7280")
        .text("Total Ideas");
};

// Lifecycle hooks
onMounted(async () => {
    console.log("Dashboard mounted, loading data...");
    await store.refresh();
    console.log("Loaded", store.items.length, "ideas");
    await nextTick();
    drawCharts();

    // Add resize listener
    window.addEventListener("resize", handleResize);
});

// Cleanup on unmount
onUnmounted(() => {
    window.removeEventListener("resize", handleResize);
});

// Watch for data changes
watch(
    () => store.items,
    () => {
        nextTick(() => {
            drawCategoryChart();
        });
    },
    { deep: true }
);

// Watch for time range changes
watch(chartTimeRange, () => {
    drawTrendChart();
});

// Redraw charts on window resize
const handleResize = () => {
    drawCharts();
};
</script>

<style scoped>
.dashboard-container {
    padding: 1rem;
}

.metric-card {
    position: relative;
    overflow: hidden;
    transition: all 0.3s ease;
}

.metric-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
}

.metric-icon {
    background: linear-gradient(
        135deg,
        rgba(139, 92, 246, 0.1) 0%,
        rgba(139, 92, 246, 0.05) 100%
    );
}

.status-card {
    cursor: pointer;
}

.chart-container {
    position: relative;
    width: 100%;
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
    .metric-card {
        margin-bottom: 1rem;
    }

    .chart-container {
        height: 250px !important;
    }
}
</style>
