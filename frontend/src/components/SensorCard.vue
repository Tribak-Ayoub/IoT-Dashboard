<!-- src/components/SensorCard.vue -->
<template>
    <div class="bg-white shadow rounded-xl p-6">
        <h3 class="text-sm text-gray-500">{{ title }}</h3>
        <p class="text-4xl font-bold my-2">{{ displayValue }}</p>
        <p class="text-xs text-gray-400">Last: {{ lastUpdatedText }}</p>
    </div>
</template>

<script setup>
import { computed } from "vue";
import { timeAgo } from "../utils/time.js";

const props = defineProps({
    title: { type: String, required: true },
    value: { type: [Number, String], default: "--" },
    lastUpdated: { type: [Number, String, Date, null], default: null },
    unit: { type: String, default: "" },
});

const displayValue = computed(() => {
    return props.value === null || props.value === undefined ? "--" : `${props.value}${props.unit}`;
});

const lastUpdatedText = computed(() => {
    if (!props.lastUpdated) return "No data yet";
    return timeAgo(props.lastUpdated);
});
</script>
