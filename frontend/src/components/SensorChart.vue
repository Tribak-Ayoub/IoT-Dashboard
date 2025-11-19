<template>
    <div class="bg-white shadow rounded-xl p-4">
        <h2 class="text-lg font-semibold mb-4">Sensor History</h2>
        <canvas ref="canvas"></canvas>
    </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { Chart } from "chart.js/auto";
import socket from "../services/socket.js";
import api from "../services/api.js"; // Axios wrapper
console.log("📌 Chart component mounted");

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
    });
    console.log("📌 Raw history from API:", historyData);
    console.log("📌 Labels:", labels);
    console.log("📌 Temperatures:", temperatures);
    console.log("📌 Humidity:", humidity);

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
