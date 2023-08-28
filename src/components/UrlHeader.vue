<script setup>
import {computed, ref, nextTick} from "vue";
import {ArrowSmallDownIcon, MagnifyingGlassIcon, PlusCircleIcon, XMarkIcon} from '@heroicons/vue/24/solid'
import {useShortUrls} from "@/stores/shortUrls";

import Dropdown from "@/components/Dropdown.vue";
import DropdownLink from "@/components/DropdownLink.vue";
import CreateUrl from "@/components/CreateUrl.vue";

const store = useShortUrls();
const searchInput = ref("");
const sortBy = ref([
    {name: "ID", field: "id",},
    {name: "Destination URL", field: "destination_url",},
    {name: "Visits", field: "visits_count",}
]);

const sortName = computed(() => {
    const sortField = store.sort_by;
    const sortObject = sortBy.value.find(option => option.field === sortField);
    return sortObject ? sortObject.name : '';
});

let changeSortOrder = () => {
    store.setSortDirection(store.sort_direction === "asc" ? "desc" : "asc");
}

let handleInput = (event) => {
    if (!event.target.value) {
        store.setSearchTerm("");
    }
}

let clearSearch = () => {
    searchInput.value = "";
    store.setSearchTerm("");
}
</script>

<template>
    <div class="flex items-center justify-between py-6 px-2">
        <div class="flex gap-4 w-full">
            <MagnifyingGlassIcon class="mt-2.5 ml-2 h-5 w-auto text-gray-500"/>
            <div class="relative w-1/2">
                <label for="search" class="sr-only">Pesquisar</label>
                <input
                    class="rounded-lg border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 w-full"
                    placeholder="Digite e pressione ENTER para pesquisar..."
                    type="search"
                    @keyup.enter="store.setSearchTerm($event.target.value)"
                    @input="handleInput"
                    v-model="searchInput"/>
                <button v-if="searchInput" @click="clearSearch" class="absolute right-0 top-0 mt-2.5 mr-2">
                    <XMarkIcon class="h-5 w-auto text-gray-500"/>
                </button>
            </div>

            <CreateUrl />

        </div>
        <div class="space-x-2 flex items-center">

            <Dropdown align="right" width="48">
                <template #trigger>
                    <span class="inline-flex rounded-lg border border-gray-300 shadow-sm w-42">
                        <button
                            type="button"
                            class="inline-flex items-center justify-between px-3 py-2 border border-transparent text-sm leading-4 font-medium w-48
                             rounded-md text-gray-500 bg-white hover:text-gray-700 focus:outline-none transition ease-in-out duration-150"
                            title="Ordenado por:">
                            {{ sortName }}
                            <svg
                                class="ml-2 -mr-0.5 h-4 w-4"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="currentColor">
                                <path
                                    fill-rule="evenodd"
                                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                    clip-rule="evenodd"/>
                            </svg>
                        </button>
                    </span>
                </template>

                <template #content>
                    <DropdownLink
                        v-for="option in sortBy"
                        :key="option.field"
                        @click="store.setSortField(option.field)"
                    >
                        {{ option.name }}
                    </DropdownLink>
                </template>
            </Dropdown>

            <button
                class="p-2 text-lg font-bold text-gray-900 bg-gray-200 rounded hover:bg-gray-400 transition-all duration-200 shadow-sm"
                @click="changeSortOrder"
                :title="store.sort_direction === 'asc' ? 'Ascendente' : 'Descendente'"
            >
                <ArrowSmallDownIcon :class="{ 'transform rotate-180': store.sort_direction === 'desc' }"
                                    class="h-5 w-auto transition ease-in-out duration-150"/>
            </button>
        </div>
    </div>
</template>
