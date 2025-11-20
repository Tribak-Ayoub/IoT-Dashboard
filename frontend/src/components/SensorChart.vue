<template>
    <div class="p-6">
        <div class="flex items-center gap-3 mb-6">
            <div class="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg">
                <svg class="w-5 h-5 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                    <path
                        d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                </svg>
            </div>
            <h2 class="text-lg font-semibold text-slate-900 dark:text-white">Sensor History</h2>
        </div>

        <div class="bg-slate-50 dark:bg-slate-700/30 rounded-xl p-4 h-96">
            <canvas ref="canvas"></canvas>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { Chart } from "chart.js/auto";
import socket from "../services/socket.js";
import api from "../services/api.js"; // Axios wrapper

const canvas = ref(null);
let chart = null;

// --------------------------------------------
// 1) Load historical data from REST API
// --------------------------------------------
async function loadHistory() {
    const res = await api.get("/sensors/history");
    return res.data.data;
}

// --------------------------------------------
// 2) Create the chart
// --------------------------------------------
function createChart(historyData) {
    const labels = historyData.map(r => new Date(r.timestamp).toLocaleTimeString());

    const temperatures = historyData.map(r => r.temperature);
    const humidity = historyData.map(r => r.humidity);

    chart = new Chart(canvas.value, {
        type: "line",
        data: {
            labels,
            datasets: [
                {
                    label: "Temperature (°C)",
                    data: temperatures,
                    borderWidth: 2,
                },
                {
                    label: "Humidity (%)",
                    data: humidity,
                    borderWidth: 2,
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: "top" },
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        },
    });

}

// --------------------------------------------
// 3) Add new points when WebSocket data arrives
// --------------------------------------------
function pushLiveUpdate(data) {
    if (!chart) return;

    const label = new Date().toLocaleTimeString();

    chart.data.labels.push(label);
    chart.data.datasets[0].data.push(data.temperature);
    chart.data.datasets[1].data.push(data.humidity);

    // Keep only latest 50 points
    if (chart.data.labels.length > 50) {
        chart.data.labels.shift();
        chart.data.datasets.forEach(ds => ds.data.shift());
    }

    chart.update();
}

// --------------------------------------------
// 4) Setup lifecycle
// --------------------------------------------
onMounted(async () => {
    const history = await loadHistory();
    createChart(history);

    socket.on("sensor:update", pushLiveUpdate);
});

onBeforeUnmount(() => {
    socket.off("sensor:update", pushLiveUpdate);

    if (chart) {
        chart.destroy();
    }
});
</script>
