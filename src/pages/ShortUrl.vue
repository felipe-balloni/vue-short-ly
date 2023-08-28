<script setup>
import {onMounted, ref} from "vue";
import {useRoute} from 'vue-router';
import {useShortUrls} from "@/stores/shortUrls";
import {useShortUlrVisits} from "@/stores/shortUrlVisitis";

import {Datatable, initTE, Input} from "tw-elements";
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout.vue';
import {CursorArrowRaysIcon, EyeIcon} from "@heroicons/vue/24/solid";

const route = useRoute();
const store = useShortUrls();
const visitsStore = useShortUlrVisits();

let short_url = ref({});
let short_url_visits = ref({});
const datatableElement = ref(null);

const fetchShortUrl = async (id) => {
    await store.showShortUrl(id);
    short_url.value = store.showUrlData.data;
};

const fetchShortUrlVisits = async (id) => {
    await visitsStore.getShortUrlVisits(id);
    short_url_visits.value = visitsStore.shortUrlVisitsData;
};

onMounted(async () => {
    await fetchShortUrl(route.params.id);
    await fetchShortUrlVisits(route.params.id);

    // Assegurando que os dados existem antes de tentar criar as linhas
    if (short_url_visits.value && short_url_visits.value.data) {
        const rows = short_url_visits.value.data.map(visit => [
            visit.id,
            visit.ip_address,
            visit.operating_system,
            visit.browser,
            visit.referer_url,
            visit.device_type,
            new Date(visit.visited_at).toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            })
        ]);

        const basicData = {
            columns: ['#', 'Endereço IP', 'Sistema Operacional', 'Navegador', 'Indicação', 'Dispositivo', 'Data e Hora da Visita'],
            rows,
        };

        new Datatable(datatableElement.value, basicData);
    }
});
</script>

<template>
    <AuthenticatedLayout>
        <template #header>
            <div class="flex items-center justify-between pb-4 mt-2">
                <h2 class="font-semibold text-xl text-gray-800 leading-tight">
                    Detalhe do Url curta
                </h2>
                <router-link to="/dashboard" class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                    Voltar
                </router-link>
            </div>
        </template>

        <div class="py-4">
            <section class="max-w-7xl mx-auto sm:px-6 lg:px-8">
                <div class="grid grid-cols-2 gap-4">
                    <div class="text-gray-700  text-normal font-semibold flex flex-col gap-2">
                        <h3 class="text-gray-900 text-2xl uppercase">Dados da Url ID: {{ short_url.id }}</h3>
                        <div>
                            <span class="uppercase">Url curta: </span>
                            <a :href="short_url.short_url" target="_blank"
                               class="text-gray-900 text-xl font-bold hover:underline hover:underline-offset-2 transition-all duration-200">{{
                                    short_url.short_url
                                }}</a>
                        </div>
                        <div>
                            <span class="uppercase">Url destino: </span>
                            <a :href="short_url.destination_url" target="_blank"
                               class="text-gray-900 text-xl font-bold hover:underline hover:underline-offset-2 transition-all duration-200">{{
                                    short_url.destination_url
                                }}</a>
                        </div>
                    </div>

                    <div class="flex items-center justify-end gap-x-8 pb-4 mt-6">
                        <div class="max-w-md flex justify-items-start gap-4">
                            <EyeIcon class="h-10 w-auto text-gray-500 mt-1"/>
                            <div class="flex flex-col items-center justify-end text-gray-600 text-3xl font-bold">
                                {{ short_url.visits_count }}
                                <span class="text-gray-500 text-sm font-semibold">
                        visitas
                    </span>
                            </div>
                        </div>

                        <div class="max-w-md flex justify-items-start gap-4">
                            <CursorArrowRaysIcon class="h-10 w-auto text-gray-500 mt-1"/>
                            <div class="flex flex-col items-center justify-center text-gray-600 text-3xl font-bold">
                                {{ short_url.referer_url_count }}
                                <span class="text-gray-500 text-sm font-semibold">
                        Indicações
                    </span>
                            </div>
                        </div>
                    </div>
                </div>

                <hr class="my-8 border-gray-300"/>

                <div ref="datatableElement" id="datatable" class="pb-8"/>


            </section>
        </div>
    </AuthenticatedLayout>
</template>
