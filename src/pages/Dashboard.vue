<script setup>
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout.vue'
import UrlDataTable from "@/components/UrlDataTable.vue";
</script>

<template>
    <AuthenticatedLayout>
        <template #header>
            <h2 class="font-semibold text-xl text-gray-800 leading-tight">
                Dashboard
            </h2>
        </template>

        <div class="py-4">
            <UrlDataTable/>
        </div>
    </AuthenticatedLayout>
</template>
