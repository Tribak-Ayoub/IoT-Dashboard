<template>
    <div class="min-h-screen bg-background dark:bg-background-dark transition-colors duration-300">
        <!-- Header -->
        <header
            class="sticky top-0 z-50 border-b border-border dark:border-border-dark bg-background/95 dark:bg-background-dark/95 backdrop-blur">
            <div class="px-6 py-4 md:px-8">
                <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div class="flex items-center gap-3">
                        <div class="p-2.5 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl">
                            <span class="text-xl">🌡️</span>
                        </div>
                        <div>
                            <h1 class="text-2xl md:text-3xl font-bold text-foreground dark:text-foreground-dark">IoT
                                Dashboard</h1>
                            <p class="text-sm text-muted dark:text-muted-dark">Real-time sensor monitoring</p>
                        </div>
                    </div>
                    <div class="flex items-center gap-3">
                        <div
                            class="px-3 py-1.5 bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 rounded-lg text-sm font-medium">
                            {{ deviceIds.length }} device{{ deviceIds.length !== 1 ? 's' : '' }}
                        </div>
                    </div>
                </div>
            </div>
        </header>

        <!-- Main Content -->
        <main class="flex-1 px-6 py-8 md:px-8">
            <!-- Charts Section -->
            <section class="bg-white dark:bg-slate-800 rounded-2xl shadow-md dark:shadow-lg overflow-hidden mb-8">
                <Chart />
            </section>

            <!-- Sensor Cards Grid -->
            <section class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <SensorCard title="Temperature" :value="temperature" unit="°C" :lastUpdated="lastUpdated"
                    :alert="isTempAlert" icon="🌡️" />
                <SensorCard title="Humidity" :value="humidity" unit="%" :lastUpdated="lastUpdated"
                    :alert="isHumidityAlert" icon="💧" />
            </section>

            <!-- Connected Devices Section -->
            <section
                class="bg-card dark:bg-card-dark shadow-md dark:shadow-lg rounded-2xl p-6 md:p-8 border border-border dark:border-border-dark">
                <div class="flex items-center justify-between mb-6">
                    <div>
                        <h2 class="text-xl md:text-2xl font-bold text-foreground dark:text-foreground-dark">Connected
                            Devices</h2>
                        <p class="text-sm text-muted dark:text-muted-dark mt-1">Active sensors and real-time data</p>
                    </div>
                </div>

                <div v-if="deviceIds.length === 0" class="text-center py-12">
                    <p class="text-muted dark:text-muted-dark">No devices connected yet</p>
                </div>

                <div v-else class="space-y-3">
                    <div v-for="id in deviceIds" :key="id"
                        class="flex items-center justify-between p-4 bg-background dark:bg-background-dark rounded-xl border border-border dark:border-border-dark hover:border-blue-300 dark:hover:border-blue-700 transition-colors">
                        <div class="flex-1">
                            <div class="flex items-center gap-2 mb-1">
                                <div class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                <div class="font-semibold text-foreground dark:text-foreground-dark">{{ id }}</div>
                            </div>
                            <div class="text-sm text-muted dark:text-muted-dark">Updated {{
                                timeAgo(deviceLastUpdated[id]) }}</div>
                        </div>
                        <div class="text-right">
                            <div class="text-lg font-bold text-foreground dark:text-foreground-dark">{{
                                deviceLatest[id]?.temperature ?? "--" }}°C</div>
                            <div class="text-sm text-muted dark:text-muted-dark">{{ deviceLatest[id]?.humidity ?? "--"
                            }}%</div>
                        </div>
                    </div>
                </div>
            </section>
        </main>

        <!-- Footer -->
        <footer class="border-t border-border dark:border-border-dark bg-background dark:bg-background-dark mt-12">
            <div class="px-6 py-6 md:px-8 text-center text-sm text-muted dark:text-muted-dark">
                © 2025 IoT Dashboard • Real-time monitoring powered by Vue 3 + TailwindCSS
            </div>
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

// Per-device data for device list
const deviceLatest = reactive({});
const deviceLastUpdated = reactive({});
const deviceIds = computed(() => Object.keys(deviceLatest));

// Handle incoming WebSocket data
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