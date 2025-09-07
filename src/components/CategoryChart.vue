<template>
    <div
        ref="chartContainer"
        class="category-chart-container"
        :style="{ height: height + 'px' }"
    />
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from "vue";
import * as d3 from "d3";

const props = defineProps({
    data: {
        type: Array,
        default: () => [],
        // Expected shape: [{ category: string, count: number }, ...]
    },
    height: {
        type: Number,
        default: 300,
    },
    colors: {
        type: Array,
        default: () => [
            "#8B5CF6",
            "#EC4899",
            "#10B981",
            "#F59E0B",
            "#3B82F6",
            "#EF4444",
        ],
    },
    innerRadiusRatio: {
        type: Number,
        default: 0.5,
    },
    showLabels: {
        type: Boolean,
        default: true,
    },
    showCenterText: {
        type: Boolean,
        default: true,
    },
    centerText: {
        type: Object,
        default: null,
        // Expected shape: { value: '25', label: 'Total' }
    },
});

const chartContainer = ref(null);
let resizeObserver = null;

const drawChart = () => {
    if (!chartContainer.value) return;

    // Clear previous chart
    d3.select(chartContainer.value).selectAll("*").remove();

    const container = chartContainer.value;
    const width = container.clientWidth;
    const height = props.height;
    const radius = Math.min(width, height) / 2;

    if (!props.data || props.data.length === 0) {
        // Show "No Data" message
        d3.select(chartContainer.value)
            .append("div")
            .attr("class", "no-data-message")
            .style("text-align", "center")
            .style("padding-top", `${height / 2 - 20}px`)
            .style("color", "#6b7280")
            .text("No data available");
        return;
    }

    const svg = d3
        .select(chartContainer.value)
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    const g = svg
        .append("g")
        .attr("transform", `translate(${width / 2},${height / 2})`);

    const color = d3
        .scaleOrdinal()
        .domain(props.data.map((d) => d.category))
        .range(props.colors);

    const pie = d3
        .pie()
        .value((d) => d.count)
        .sort(null);

    const arc = d3
        .arc()
        .innerRadius(radius * props.innerRadiusRatio)
        .outerRadius(radius * 0.8);

    const labelArc = d3
        .arc()
        .innerRadius(radius * 0.9)
        .outerRadius(radius * 0.9);

    // Create tooltip
    const tooltip = d3
        .select(chartContainer.value)
        .append("div")
        .attr("class", "chart-tooltip")
        .style("opacity", 0)
        .style("position", "absolute")
        .style("background", "rgba(0, 0, 0, 0.8)")
        .style("color", "white")
        .style("padding", "8px 12px")
        .style("border-radius", "4px")
        .style("font-size", "12px")
        .style("pointer-events", "none")
        .style("z-index", "10");

    // Pie slices
    const arcs = g
        .selectAll(".arc")
        .data(pie(props.data))
        .enter()
        .append("g")
        .attr("class", "arc");

    // Add paths with animation
    arcs.append("path")
        .attr("d", arc)
        .attr("fill", (d) => color(d.data.category))
        .attr("stroke", "white")
        .attr("stroke-width", 2)
        .style("cursor", "pointer")
        .style("opacity", 0)
        .transition()
        .duration(800)
        .delay((d, i) => i * 100)
        .style("opacity", 1)
        .attrTween("d", function (d) {
            const interpolate = d3.interpolate(
                { startAngle: 0, endAngle: 0 },
                d
            );
            return function (t) {
                return arc(interpolate(t));
            };
        });

    // Add interactivity
    arcs.select("path")
        .on("mouseover", function (event, d) {
            d3.select(this)
                .transition()
                .duration(200)
                .attr("transform", "scale(1.05)");

            const percentage = (
                (d.data.count / d3.sum(props.data, (item) => item.count)) *
                100
            ).toFixed(1);

            tooltip.transition().duration(200).style("opacity", 1);

            tooltip
                .html(
                    `
                <div><strong>${d.data.category}</strong></div>
                <div>Count: ${d.data.count}</div>
                <div>Percentage: ${percentage}%</div>
            `
                )
                .style("left", event.layerX + 10 + "px")
                .style("top", event.layerY - 10 + "px");
        })
        .on("mouseout", function () {
            d3.select(this)
                .transition()
                .duration(200)
                .attr("transform", "scale(1)");

            tooltip.transition().duration(200).style("opacity", 0);
        });

    // Labels
    if (props.showLabels) {
        arcs.append("text")
            .attr("transform", (d) => `translate(${labelArc.centroid(d)})`)
            .attr("text-anchor", "middle")
            .style("font-size", "12px")
            .style("fill", "#374151")
            .style("opacity", 0)
            .text((d) =>
                d.data.count > 0 ? `${d.data.category} (${d.data.count})` : ""
            )
            .transition()
            .delay(800)
            .duration(300)
            .style("opacity", 1);
    }

    // Center text
    if (props.showCenterText) {
        const centerData = props.centerText || {
            value: d3.sum(props.data, (d) => d.count).toString(),
            label: "Total",
        };

        const centerGroup = g
            .append("g")
            .attr("class", "center-text")
            .style("opacity", 0);

        centerGroup
            .append("text")
            .attr("text-anchor", "middle")
            .attr("dy", "-0.5em")
            .style("font-size", "24px")
            .style("font-weight", "bold")
            .style("fill", "#1f2937")
            .text(centerData.value);

        centerGroup
            .append("text")
            .attr("text-anchor", "middle")
            .attr("dy", "1em")
            .style("font-size", "14px")
            .style("fill", "#6b7280")
            .text(centerData.label);

        centerGroup.transition().delay(1000).duration(300).style("opacity", 1);
    }
};

onMounted(() => {
    drawChart();

    // Set up resize observer
    resizeObserver = new ResizeObserver(() => {
        drawChart();
    });

    if (chartContainer.value) {
        resizeObserver.observe(chartContainer.value);
    }
});

onUnmounted(() => {
    if (resizeObserver && chartContainer.value) {
        resizeObserver.unobserve(chartContainer.value);
        resizeObserver.disconnect();
    }
});

// Redraw when data changes
watch(
    () => props.data,
    () => {
        drawChart();
    },
    { deep: true }
);

defineExpose({
    redraw: drawChart,
});
</script>

<style scoped>
.category-chart-container {
    position: relative;
    width: 100%;
}

.no-data-message {
    font-size: 14px;
    color: #6b7280;
}

:deep(.arc path) {
    transition: transform 0.2s ease;
}

:deep(.chart-tooltip) {
    transition: opacity 0.2s ease;
}
</style>
