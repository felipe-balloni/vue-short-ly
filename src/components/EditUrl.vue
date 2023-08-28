<script setup>
import {nextTick, ref} from 'vue';
import {useShortUrls} from "@/stores/shortUrls";
import {PencilSquareIcon} from "@heroicons/vue/24/solid";

import Modal from "@/components/Modal.vue";
import PrimaryButton from "@/components/PrimaryButton.vue";
import SecondaryButton from '@/components/SecondaryButton.vue';
import TextInput from "@/components/TextInput.vue";
import InputLabel from '@/components/InputLabel.vue';
import InputError from "@/components/InputError.vue";

const editShortUrlModal = ref(false);
const destinationUrlInput = ref(null);

const props = defineProps({
    shortUrl: {
        type: Object,
        default: () => ({})
    }
});

const form = ref({
    id: props.shortUrl.id,
    destination_url: props.shortUrl.destination_url,
    url_key: props.shortUrl.url_key
});
const editShortUrl = () => {
    form.value = {
        id: props.shortUrl.id,
        destination_url: props.shortUrl.destination_url,
        url_key: props.shortUrl.url_key,
    }

    editShortUrlModal.value = true;

    nextTick(() => {
        if (destinationUrlInput.value) {
            destinationUrlInput.value.$el.focus();
        }
    });
};

const closeModal = () => {
    editShortUrlModal.value = false;
};

const store = useShortUrls();

const submitForm = async (event) => {
    event.preventDefault();
    await store.editShortUrl(form);

    store.success && closeModal();
};

</script>

<template>
    <button
        class="hover:scale-110 transition-all duration-200 group cursor-pointer"
        title="Editar"
        @click="editShortUrl">
        <PencilSquareIcon class="h-6 w-auto group-hover:scale-110"/>
    </button>

    <Modal :show="editShortUrlModal" container-class="md:mt-36" @close="closeModal">
        <div class="p-6">
            <h2 class="text-lg font-medium text-gray-900">
                Alterar esse registro
            </h2>

            <p class="mt-1 text-sm text-gray-600">
                Modifique os campos abaixo para a Url destino Url Key.
                O campo URL Key é opcional, se não for alterado ou em branco, iremo manter atual.
            </p>

            <form @submit.prevent="submitForm">
                <div class="mt-6">
                    <InputLabel for="id" value="Url ID" class="sr-only"/>

                    <TextInput
                        id="id"
                        v-model="form.id"
                        type="hidden"
                    />

                    <InputLabel for="destination_url" value="Url Destino" class="after:content-['*'] after:text-red-700 after:ml-1"/>

                    <TextInput
                        id="destination_url"
                        ref="destinationUrlInput"
                        v-model="form.destination_url"
                        type="text"
                        class="mt-1 block w-full"
                        placeholder="http://example.com ou https://example.com"
                    />

                    <InputError :message="store.errors?.destination_url" class="mt-2"/>
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

                    <InputError :message="store.errors?.url_key" class="mt-2"/>
                </div>

                <div class="mt-6 flex justify-end">
                    <SecondaryButton type="button" @click="closeModal">Cancelar</SecondaryButton>

                    <PrimaryButton
                        class="ml-3"
                        :class="{'opacity-50 cursor-not-allowed': store.processing}"
                        :disabled="store.processing"
                        type="submit"
                    >
                        Alterar registro
                    </PrimaryButton>
                </div>
            </form>
        </div>
    </Modal>
</template>

