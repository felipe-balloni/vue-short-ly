<script setup>
import {nextTick, ref} from 'vue';
import {useShortUrls} from "@/stores/shortUrls";
import {PlusCircleIcon} from "@heroicons/vue/24/solid";

import Modal from "@/components/Modal.vue";
import PrimaryButton from "@/components/PrimaryButton.vue";
import SecondaryButton from '@/components/SecondaryButton.vue';
import TextInput from "@/components/TextInput.vue";
import InputLabel from '@/components/InputLabel.vue';
import InputError from "@/components/InputError.vue";

const createShortUrlModal = ref(false);
const destinationUrlInput = ref(null);

const createShortUrl = () => {
    createShortUrlModal.value = true;

    nextTick(() => {
        if (destinationUrlInput.value) {
            destinationUrlInput.value.$el.focus();
        }
    });
};

const closeModal = () => {
    createShortUrlModal.value = false;
};

const store = useShortUrls();

const form = ref({
    destination_url: '',
    url_key: '',
});

const submitForm = async (event) => {
    event.preventDefault();
    await store.createShortUrl(form);

    store.success && closeModal();
};

</script>

<template>
    <a
        class="text-lg font-bold text-gray-900 p-0.5 group cursor-pointer"
        title="Create new short URL"
        @click="createShortUrl">
        <PlusCircleIcon class="h-10 w-auto group-hover:text-blue-700 transition-colors duration-200"/>
    </a>

    <Modal :show="createShortUrlModal" container-class="md:mt-36" @close="closeModal">
        <div class="p-6">
            <h2 class="text-lg font-medium text-gray-900">
                Criar uma novo registro
            </h2>

            <p class="mt-1 text-sm text-gray-600">
                Preencha os campos abaixo para criar um novo short URL.
                O campo URL Key é opcional, se não for preenchido, será gerado automaticamente.
            </p>

            <form @submit.prevent="submitForm">
                <div class="mt-6">
                    <InputLabel for="destination_url" value="Url Destino" class="after:content-['*'] after:text-red-700 after:ml-1"/>

                    <TextInput
                        id="destination_url"
                        ref="destinationUrlInput"
                        v-model="form.destination_url"
                        type="text"
                        class="mt-1 block w-full"
                        placeholder="http://example.com ou https://example.com"
                    />

                    <InputError :message="store?.errors?.destination_url" class="mt-2"/>
                </div>

                <div class="mt-6">
                    <InputLabel for="url_key" value="Url Key"/>

                    <TextInput
                        id="url_key"
                        v-model="form.url_key"
                        type="text"
                        class="mt-1 block w-full"
                        placeholder=""
                    />

                    <InputError :message="form.errors?.url_key" class="mt-2"/>
                </div>

                <div class="mt-6 flex justify-end">
                    <SecondaryButton type="button" @click="closeModal">Cancelar</SecondaryButton>

                    <PrimaryButton
                        class="ml-3"
                        :class="{'opacity-50 cursor-not-allowed': store.processing}"
                        :disabled="store.processing"
                        type="submit"
                    >
                        Cadastrar
                    </PrimaryButton>
                </div>
            </form>
        </div>
    </Modal>
</template>

