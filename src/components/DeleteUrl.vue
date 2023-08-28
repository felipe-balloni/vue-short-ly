<script setup>
import {ref} from 'vue';
import {useShortUrls} from "@/stores/shortUrls";
import {TrashIcon} from "@heroicons/vue/24/solid";

import Modal from "@/components/Modal.vue";
import DangerButton from "@/components/DangerButton.vue";
import SecondaryButton from '@/components/SecondaryButton.vue';
import TextInput from "@/components/TextInput.vue";
import InputLabel from '@/components/InputLabel.vue';

const props = defineProps({
    id: {
        type: Number,
        required: true
    }
});

const form = ref({id: props.id,});

const deleteShortUrlModal = ref(false);

const deleteShortUrl = () => {
    deleteShortUrlModal.value = true;
};

const closeModal = () => {
    deleteShortUrlModal.value = false;
};

const store = useShortUrls();

const submitForm = async (event) => {
    event.preventDefault();
    await store.deleteShortUrl(form.value.id);

    store.success && closeModal();
};

</script>

<template>
    <button
        class="hover:scale-110 transition-all duration-200 group cursor-pointer"
        title="Excluir"
        @click="deleteShortUrl">
        <TrashIcon class="h-6 w-auto group-hover:scale-110"/>
    </button>

    <Modal :show="deleteShortUrlModal" max-width="md" container-class="flex items-center" @close="closeModal">
        <div class="p-6">
            <h2 class="text-lg font-medium text-gray-900">
                Excluir esse registro
            </h2>

            <p class="mt-1 text-sm text-gray-600">
                Uma vez excluído, todos os dados serão perdidos <span class="strong">permanentemente</span>.
            </p>

            <form @submit.prevent="submitForm">
                <div class="mt-6">
                    <InputLabel for="id" value="Url ID" class="sr-only"/>

                    <TextInput
                        id="id"
                        v-model="form.id"
                        type="hidden"
                    />

                </div>

                <div class="mt-6 flex justify-end">
                    <SecondaryButton type="button" @click="closeModal">Cancelar</SecondaryButton>

                    <DangerButton
                        class="ml-3"
                        :class="{'opacity-50 cursor-not-allowed': store.processing}"
                        :disabled="store.processing"
                        type="submit"
                    >
                        Excluir
                    </DangerButton>
                </div>
            </form>
        </div>
    </Modal>
</template>

