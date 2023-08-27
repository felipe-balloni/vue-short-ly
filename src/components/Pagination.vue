<script setup>
import {computed} from 'vue';

const props = defineProps({
    currentPage: {type: Number, default: 1},
    lastPage: {type: Number, default: 1},
    onPrev: {
        type: Function, default: () => {
        }
    },
    onNext: {
        type: Function, default: () => {
        }
    },
});

const isPrevDisabled = computed(() => props.currentPage <= 1);
const isNextDisabled = computed(() => props.currentPage >= props.lastPage);
</script>

<template>
    <div class="flex justify-center items-center gap-6 mt-2">
        <button :disabled="isPrevDisabled"
                class="px-4 py-2 mx-1 text-sm text-gray-600 font-semibold bg-gray-200 rounded hover:bg-gray-400 shadow-sm transition-colors disabled:cursor-not-allowed disabled:opacity-60"
                @click="onPrev">
            Prev
        </button>

        <div>
            Page {{ currentPage }} of {{ lastPage }}
        </div>

        <button :disabled="isNextDisabled"
                class="px-4 py-2 mx-1 text-sm text-gray-600 font-semibold bg-gray-200 rounded hover:bg-gray-400 shadow-sm transition-color disabled:cursor-not-allowed disabled:opacity-60"
                @click="onNext">
            Next
        </button>
    </div>
</template>
