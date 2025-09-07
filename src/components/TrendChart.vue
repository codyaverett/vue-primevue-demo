<template>
    <div
        ref="chartContainer"
        class="trend-chart-container"
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
        // Expected shape: [{ date: Date, value: number }, ...]
    },
    height: {
        type: Number,
        default: 300,
    },
    timeRange: {
        type: String,
        default: "7d",
    },
    color: {
        type: String,
        default: "#8B5CF6",
    },
    showDots: {
        type: Boolean,
        default: true,
    },
    showArea: {
        type: Boolean,
        default: true,
    },
    margin: {
        type: Object,
        default: () => ({ top: 20, right: 30, bottom: 40, left: 50 }),
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
    const margin = props.margin;

    // Generate sample data if none provided
    let chartData = props.data;
    if (!chartData || chartData.length === 0) {
        const days =
            props.timeRange === "7d" ? 7 : props.timeRange === "30d" ? 30 : 90;
        chartData = Array.from({ length: days }, (_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - (days - i - 1));
            return {
                date: date,
                value: Math.floor(Math.random() * 10 + 5 + i * 0.5),
            };
        });
    }

    const svg = d3
        .select(chartContainer.value)
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    const g = svg
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3
        .scaleTime()
        .domain(d3.extent(chartData, (d) => d.date))
        .range([0, width - margin.left - margin.right]);

    const y = d3
        .scaleLinear()
        .domain([0, d3.max(chartData, (d) => d.value)])
        .nice()
        .range([height - margin.top - margin.bottom, 0]);

    // Create gradient for area fill
    if (props.showArea) {
        const gradient = svg
            .append("defs")
            .append("linearGradient")
            .attr("id", "trend-gradient")
            .attr("gradientUnits", "userSpaceOnUse")
            .attr("x1", 0)
            .attr("y1", y(0))
            .attr("x2", 0)
            .attr("y2", y(d3.max(chartData, (d) => d.value)));

        gradient
            .append("stop")
            .attr("offset", "0%")
            .attr("stop-color", props.color)
            .attr("stop-opacity", 0.1);

        gradient
            .append("stop")
            .attr("offset", "100%")
            .attr("stop-color", props.color)
            .attr("stop-opacity", 0.6);

        // Area
        const area = d3
            .area()
            .x((d) => x(d.date))
            .y0(y(0))
            .y1((d) => y(d.value))
            .curve(d3.curveMonotoneX);

        g.append("path")
            .datum(chartData)
            .attr("fill", "url(#trend-gradient)")
            .attr("d", area)
            .style("opacity", 0)
            .transition()
            .duration(800)
            .style("opacity", 1);
    }

    // Line
    const line = d3
        .line()
        .x((d) => x(d.date))
        .y((d) => y(d.value))
        .curve(d3.curveMonotoneX);

    const path = g
        .append("path")
        .datum(chartData)
        .attr("fill", "none")
        .attr("stroke", props.color)
        .attr("stroke-width", 2)
        .attr("d", line);

    // Animate line drawing
    const totalLength = path.node().getTotalLength();
    path.attr("stroke-dasharray", totalLength + " " + totalLength)
        .attr("stroke-dashoffset", totalLength)
        .transition()
        .duration(1000)
        .ease(d3.easeLinear)
        .attr("stroke-dashoffset", 0);

    // Dots
    if (props.showDots) {
        g.selectAll(".dot")
            .data(chartData)
            .enter()
            .append("circle")
            .attr("class", "dot")
            .attr("cx", (d) => x(d.date))
            .attr("cy", (d) => y(d.value))
            .attr("r", 0)
            .attr("fill", props.color)
            .transition()
            .delay((d, i) => i * 50)
            .duration(300)
            .attr("r", 4);
    }

    // X Axis
    const days =
        props.timeRange === "7d" ? 7 : props.timeRange === "30d" ? 30 : 90;
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

    // Add grid lines
    g.append("g")
        .attr("class", "grid")
        .attr(
            "transform",
            `translate(0,${height - margin.top - margin.bottom})`
        )
        .call(
            d3
                .axisBottom(x)
                .tickSize(-(height - margin.top - margin.bottom))
                .tickFormat("")
                .ticks(days <= 7 ? days : 6)
        )
        .style("stroke-dasharray", "2,2")
        .style("opacity", 0.3);

    g.append("g")
        .attr("class", "grid")
        .call(
            d3
                .axisLeft(y)
                .tickSize(-(width - margin.left - margin.right))
                .tickFormat("")
                .ticks(5)
        )
        .style("stroke-dasharray", "2,2")
        .style("opacity", 0.3);
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

// Redraw when props change
watch(
    () => [props.data, props.timeRange, props.color],
    () => {
        drawChart();
    }
);

defineExpose({
    redraw: drawChart,
});
</script>

<style scoped>
.trend-chart-container {
    position: relative;
    width: 100%;
}

:deep(.grid line) {
    stroke: #e5e7eb;
}

:deep(.grid path) {
    stroke-width: 0;
}

:deep(.dot) {
    cursor: pointer;
    transition: r 0.2s ease;
}

:deep(.dot:hover) {
    r: 6;
}
</style>
