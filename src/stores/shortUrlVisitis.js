import axios from "@/lib/axios"
import {useStorage} from "@vueuse/core"
import {defineStore} from 'pinia'

export const useShortUlrVisits = defineStore('shortUrlVisitsData', {
    state: () => ({
        shortUrlVisitsData: useStorage('shortUrlVisitsData', {data: []}),
        success: false,
    }),

    actions: {
        async getShortUrlVisits(shortUrlId) {
            await axios.get(`/api/short-url/${shortUrlId}/visits`)
                .then(response => {
                    this.shortUrlVisitsData = {...response.data}
                }).catch(error => {
                    throw error
                })
        },

        // async getShortUrlVisits(shortUrlId) {
        //     await axios.get(`/api/short-url/${shortUrlId}/visits`)
        //         .then(response => {
        //             this.shortUrlVisitsData = {...response.data}
        //         }).catch(error => {
        //             throw error
        //         })
        // },
    }
})
