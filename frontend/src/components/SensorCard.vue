<template>
    <div :class="cardClass">
        <div class="flex justify-between items-center">
            <h3 class="text-sm" :class="titleClass">{{ title }}</h3>
            <span v-if="alert" class="text-red-600 text-lg font-bold">⚠️</span>
        </div>

        <p :class="valueClass">{{ displayValue }}</p>
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
    alert: { type: Boolean, default: false },
});

const displayValue = computed(() => {
    return props.value === null || props.value === undefined ? "--" : `${props.value}${props.unit}`;
});

const lastUpdatedText = computed(() => {
    if (!props.lastUpdated) return "No data yet";
    return timeAgo(props.lastUpdated);
});

const cardClass = computed(() =>
    props.alert
        ? "bg-red-100 border border-red-400 shadow rounded-xl p-6"
        : "bg-white shadow rounded-xl p-6"
);

const valueClass = computed(() =>
    props.alert ? "text-4xl font-bold my-2 text-red-600" : "text-4xl font-bold my-2"
);

const titleClass = computed(() =>
    props.alert ? "text-red-600" : "text-gray-500"
);
</script>
