<script setup>
import {computed, onBeforeMount, ref} from "vue";
import {
  ChartBarIcon,
  CursorArrowRaysIcon,
  EllipsisVerticalIcon,
  EyeIcon,
  LinkIcon,
  TableCellsIcon
} from '@heroicons/vue/24/solid'
import {ClipboardDocumentIcon} from '@heroicons/vue/24/outline'
import {useShortUrls} from "@/stores/shortUrls";

import Pagination from './Pagination.vue';
import UrlHeader from "@/components/UrlHeader.vue";
import EditUrl from "@/components/EditUrl.vue";
import DeleteUrl from "@/components/DeleteUrl.vue";

const store = useShortUrls();

const totalVisits = computed(() => store.shortUrlsData.data.reduce(
    (total, shortUrl) => total + shortUrl.visits_count, 0));

const totalReferer = computed(() => store.shortUrlsData.data.reduce(
    (total, shortUrl) => total + shortUrl.referer_url_count, 0));

onBeforeMount(() => {
  if (!store.hasShortUrlsData) {
    store.getShortUrls();
  }

  store.getStatistics();
});

let copied = ref({});
let copyToClipboard = (shortUrl) => {
  navigator.clipboard.writeText(shortUrl.short_url);
  copied.value[shortUrl.id] = true;
  setTimeout(() => delete copied.value[shortUrl.id], 2000);
}

</script>

<template>

  <section class="max-w-7xl mx-auto sm:px-6 lg:px-8">
    <h3 class="text-gray-700 text-2xl font-bold uppercase">Estatísticas</h3>
    <div class="flex items-center justify-between pb-4 mt-2">
      <div class="max-w-md flex justify-items-start gap-4">
        <LinkIcon class="h-10 w-auto text-gray-500 mt-1"/>
        <div class="flex flex-col items-center justify-center text-gray-600 text-3xl font-bold">
          {{ store.statisticsData.data.total }}
          <span class="text-gray-500 text-sm font-semibold">
                        Links
                    </span>
        </div>
      </div>

      <div class="max-w-md flex justify-items-start gap-4">
        <EyeIcon class="h-10 w-auto text-gray-500 mt-1"/>
        <div class="flex flex-col items-center justify-center text-gray-600 text-3xl font-bold">
          {{ store.statisticsData.data.total_visits }}
          <span class="text-gray-500 text-sm font-semibold">
                        visitas
                    </span>
        </div>
      </div>

      <div class="max-w-md flex justify-items-start gap-4">
        <CursorArrowRaysIcon class="h-10 w-auto text-gray-500 mt-1"/>
        <div class="flex flex-col items-center justify-center text-gray-600 text-3xl font-bold">
          {{ store.statisticsData.data.total_referer_url }}
          <span class="text-gray-500 text-sm font-semibold">
                        Indicações
                    </span>
        </div>
      </div>
    </div>

    <hr class="my-2 border-gray-300"/>

    <UrlHeader/>

    <div v-if="store.shortUrlsData.data.length"
         class="flex flex-col gap-4">
      <div v-for="shortUrl in store.shortUrlsData.data"
           :key="shortUrl.id"
           class="px-4 py-6 whitespace-nowrap bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200">
        <span class="text-xs text-gray-400 font-light -mt-5 text-right block"> ({{ shortUrl.id }})</span>
        <div class="flex items-center space-x-2">
          <EllipsisVerticalIcon class="h-8 w-auto text-gray-500"/>
          <div class="text-lg font-bold text-gray-900 flex flex-col w-3/4">
            <p class="text-ellipsis overflow-hidden">
                        <span class="text-xs font-semibold">
                        Url Destino:
                        </span>
              {{ shortUrl.destination_url }}
            </p>
            <p class="text-xs font-semibold flex items-center">
              Url curta:
              <a
                  :href="shortUrl.short_url"
                  target="_blank"
                  class="text-sm text-blue-600 hover:underline hover:underline-offset-2 transition-all duration-200">
                {{ shortUrl.short_url }}
              </a>
              <button
                  class="hover:scale-110 transition-all duration-200 hover:cursor-pointer ml-1"
                  title="Copiar link"
                  @click="copyToClipboard(shortUrl)">
                <ClipboardDocumentIcon class="h-5 w-auto"/>
              </button>
              <span
                  v-if="copied[shortUrl.id]"
                  class="ml-2 text-sm font-normal text-green-500">Copiado</span>
            </p>
          </div>
          <div class="flex items-center justify-between flex-1 text-gray-500">
            <div class="text-sm flex items-center justify-end mt-1 w-14 text-right">
              {{ shortUrl.visits_count }}
              <ChartBarIcon class="h-5 w-auto px-1 mb-1"/>
            </div>
            <div class="space-x-3 mt-1 inline-flex">
              <router-link :to="{ name: 'short-url', params: { id: shortUrl.id }}"
                           class="hover:scale-110 transition-all duration-200">
                <TableCellsIcon class="h-6 w-auto"/>
              </router-link>

              <EditUrl :short-url="shortUrl"/>

              <DeleteUrl :id="shortUrl.id"/>
            </div>
          </div>
        </div>
      </div>

      <Pagination
          :current-page="store.shortUrlsData.meta.current_page"
          :last-page="store.shortUrlsData.meta.last_page"
          :on-prev="store.previousPage"
          :on-next="store.nextPage"
      />
    </div>

    <div v-else>
      <div class="p-4 mx-auto text-center text-gray-500">
        Nenhuma URL curta foi encontrada atualmente. Vamos criar uma? Utilize o botão com o "mais" acima.
      </div>
    </div>
  </section>

</template>

