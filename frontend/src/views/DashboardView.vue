<template>
    <div class="min-h-screen bg-gray-100 flex flex-col">
        <!-- Header -->
        <header class="bg-white shadow-md p-4 flex justify-between items-center">
            <h1 class="text-2xl font-bold text-blue-600">🌡️ IoT Sensor Dashboard</h1>
            <span class="text-gray-500 text-sm">Real-time Monitoring</span>
        </header>

        <!-- Main Content -->
        <main class="flex-1 p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Temperature Card -->
            <div class="bg-white shadow rounded-xl p-6">
                <h2 class="text-xl font-semibold mb-2">Temperature</h2>
                <p class="text-5xl font-bold text-red-500">33°C</p>
            </div>

            <!-- Humidity Card -->
            <div class="bg-white shadow rounded-xl p-6">
                <h2 class="text-xl font-semibold mb-2">Humidity</h2>
                <p class="text-5xl font-bold text-blue-500">40%</p>
            </div>
        </main>

        <!-- Footer -->
        <footer class="bg-white text-center text-gray-500 p-3 text-sm border-t">
            © 2025 IoT Dashboard | Built with Vue 3 + TailwindCSS
        </footer>
    </div>
</template>

<script setup>
// import { ref, onMounted } from "vue";
// import socket from "../services/socket.js";

// // Reactive variables
// const temperature = ref("--");
// const humidity = ref("--");

// onMounted(() => {
//     // Listen for sensor data broadcasted by backend
//     socket.on("sensor:update", (data) => {
//         console.log("📡 Live update:", data);
//         temperature.value = data.temperature;
//         humidity.value = data.humidity;
//     });
// });
</script>
