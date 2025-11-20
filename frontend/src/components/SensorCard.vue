<template>
    <div :class="cardClass">
        <!-- Card Header -->
        <div class="flex items-start justify-between mb-4">
            <div class="flex items-center gap-3">
                <div class="p-3 rounded-lg" :class="iconBgClass">
                    <span class="text-2xl">{{ icon }}</span>
                </div>
                <div>
                    <p class="text-sm font-medium text-muted dark:text-muted-dark">{{ title }}</p>
                    <p class="text-xs text-muted dark:text-muted-dark/70">{{ lastUpdatedText }}</p>
                </div>
            </div>
            <div v-if="alert" class="flex items-center gap-1 px-2.5 py-1.5 bg-red-100 dark:bg-red-950/40 rounded-lg">
                <span class="text-lg">⚠️</span>
            </div>
        </div>

        <!-- Card Value -->
        <div class="mb-1">
            <p :class="valueClass">{{ displayValue }}</p>
        </div>

        <!-- Card Footer -->
        <div class="flex items-center gap-2 pt-3 border-t border-border dark:border-border-dark">
            <div class="w-2 h-2 rounded-full" :class="statusIndicatorClass"></div>
            <span class="text-xs text-muted dark:text-muted-dark">{{ alert ? 'Alert Status' : 'Normal' }}</span>
        </div>
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
    icon: { type: String, default: "📊" },
});

const displayValue = computed(() => {
    return props.value === null || props.value === undefined ? "--" : `${props.value}${props.unit}`;
});

const lastUpdatedText = computed(() => {
    if (!props.lastUpdated) return "No data yet";
    return timeAgo(props.lastUpdated);
});

const cardClass = computed(() => {
    const baseClass = "bg-card dark:bg-card-dark border rounded-2xl p-6 shadow-md dark:shadow-lg transition-all duration-300";
    if (props.alert) {
        return `${baseClass} border-red-300 dark:border-red-800/50 bg-red-50/50 dark:bg-red-950/20`;
    }
    return `${baseClass} border-border dark:border-border-dark hover:border-blue-200 dark:hover:border-blue-800`;
});

const valueClass = computed(() => {
    const baseClass = "text-5xl md:text-6xl font-bold font-mono tracking-tight";
    if (props.alert) {
        return `${baseClass} text-red-600 dark:text-red-400`;
    }
    return `${baseClass} text-foreground dark:text-foreground-dark`;
});

const iconBgClass = computed(() => {
    if (props.alert) {
        return "bg-red-100 dark:bg-red-950/50";
    }
    return "bg-blue-100 dark:bg-blue-950/50";
});

const statusIndicatorClass = computed(() => {
    return props.alert
        ? "bg-red-500 dark:bg-red-400"
        : "bg-green-500 dark:bg-green-400";
});
</script>