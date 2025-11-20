<template>
    <div class="min-h-screen bg-gray-100 flex flex-col">
        <header class="bg-white shadow-md p-4 flex justify-between items-center">
            <h1 class="text-2xl font-bold text-blue-600">🌡️ IoT Sensor Dashboard</h1>
            <span class="text-gray-500 text-sm">Real-time Monitoring</span>
        </header>

        <main class="flex-1 p-6">
            <section class="mt-6">
                <Chart />
            </section>

            <section class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <SensorCard title="Temperature" :value="temperature" unit="°C" :lastUpdated="lastUpdated" :alert="isTempAlert"/>
                <SensorCard title="Humidity" :value="humidity" unit="%" :lastUpdated="lastUpdated" :alert="isHumidityAlert"/>
            </section>

            <section class="bg-white shadow rounded-xl p-4">
                <h2 class="text-lg font-semibold mb-4">Connected Devices</h2>
                <div v-if="deviceIds.length === 0" class="text-gray-500">No devices connected yet</div>
                <ul v-else class="space-y-3">
                    <li v-for="id in deviceIds" :key="id" class="flex items-center justify-between">
                        <div>
                            <div class="font-medium">{{ id }}</div>
                            <div class="text-sm text-gray-500">Last: {{ timeAgo(deviceLastUpdated[id]) }}
                            </div>
                        </div>
                        <div class="text-right">
                            <div class="text-lg font-bold">{{ deviceLatest[id]?.temperature ?? "--" }}°C</div>
                            <div class="text-sm text-gray-500">{{ deviceLatest[id]?.humidity ?? "--" }}%</div>
                        </div>
                    </li>
                </ul>
            </section>
        </main>

        <footer class="bg-white text-center text-gray-500 p-3 text-sm border-t">
            © 2025 IoT Dashboard | Built with Vue 3 + TailwindCSS
        </footer>
    </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onBeforeUnmount } from "vue";
import socket from "../services/socket.js";
import SensorCard from "../components/SensorCard.vue";
import { timeAgo } from "../utils/time.js";
import Chart from "../components/SensorChart.vue";

const temperature = ref("--");
const humidity = ref("--");
const lastUpdated = ref(null);

// Internal ticking clock so "last updated" refreshes every second
const now = ref(Date.now());
setInterval(() => (now.value = Date.now()), 1000);

// ---------------------------------------------
// 🟦 Per-device data for device list
// ---------------------------------------------
const deviceLatest = reactive({});
const deviceLastUpdated = reactive({});

const deviceIds = computed(() => Object.keys(deviceLatest));

// ---------------------------------------------
// 🟦 Handle incoming WebSocket data
// ---------------------------------------------
function handleSensorUpdate(data) {
    const ts = Date.now();

    // Update global
    temperature.value = data.temperature;
    humidity.value = data.humidity;
    lastUpdated.value = ts;

    // Update per-device
    deviceLatest[data.deviceId] = {
        temperature: data.temperature,
        humidity: data.humidity,
        timestamp: ts,
    };

    deviceLastUpdated[data.deviceId] = ts;
}

const isTempAlert = computed(() => {
    return typeof temperature.value === "number" && temperature.value > 30;
});

const isHumidityAlert = computed(() => {
    return typeof humidity.value === "number" && humidity.value > 70;
});

onMounted(() => {
    socket.on("sensor:update", handleSensorUpdate);
});

onBeforeUnmount(() => {
    socket.off("sensor:update", handleSensorUpdate);
});
</script>
