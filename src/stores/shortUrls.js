import axios from "@/lib/axios"
import {useStorage} from '@vueuse/core'
import {defineStore} from 'pinia'

const csrf = () => axios.get('/sanctum/csrf-cookie')

export const useShortUrls = defineStore('shortUrlsData', {
    state: () => ({
        shortUrlsData: useStorage('shortUrlsData', {data: [], meta: {current_page: 1, last_page: 1}}),
        statisticsData: useStorage('statisticsData', {}),
        showUrlData: useStorage('showUrlData', {}),
        per_page: 5,
        sort_by: 'id',
        sort_direction: 'desc',
        search: null,
        processing: false,
        success: false,
        errors: [],
    }),

    getters: {
        hasShortUrlsData: state => state?.shortUrlsData?.data && state.shortUrlsData.data.length > 0,
    },

    actions: {
        async getShortUrls() {
            await axios.get('/api/short-url', {
                params: {
                    per_page: this.per_page,
                    page: this.shortUrlsData.meta.current_page,
                    sort_by: this.sort_by,
                    sort_direction: this.sort_direction,
                    search: this.search
                }
            }).then(response => {
                this.shortUrlsData = {...response.data}
            }).catch(error => {
                throw error
            })
        },

        async getStatistics() {
            await axios.get('api/statistic')
                .then(response => {
                    this.statisticsData = {...response.data}
                }).catch(error => {
                    throw error
                })
        },

        async createShortUrl(form) {
            this.processing = true

            await axios
                .post('/api/short-url', form.value)
                .then(response => {
                    this.success = (response.status === 201)
                    this.processing = false
                    this.getShortUrls()
                    this.getStatistics();
                })
                .catch(error => {
                    if (error.response.status !== 422) throw error

                    if (error.response && error.response.data) {
                        for (let field in error.response.data.errors) {
                            this.errors[field] = error.response.data.errors[field][0];
                        }
                    }

                    this.processing = false
                })
        },

        async showShortUrl(id) {
            await axios.get('/api/short-url/' + id)
                .then(response => {
                    this.showUrlData = {...response.data}
                }).catch(error => {
                    throw error
                })
        },

        async editShortUrl(form) {
            this.processing = true

            await axios
                .put('/api/short-url/' + form.value.id, form.value)
                .then(response => {
                    this.success = (response.status === 200)
                    this.processing = false
                    this.getShortUrls()
                    this.getStatistics();
                })
                .catch(error => {
                    if (error.response.status !== 422) throw error

                    if (error.response && error.response.data) {
                        for (let field in error.response.data.errors) {
                            this.errors[field] = error.response.data.errors[field][0];
                        }
                    }

                    this.processing = false
                })
        },

        async deleteShortUrl(id) {
            this.processing = true

            await axios
                .delete('/api/short-url/' + id)
                .then(response => {
                    this.success = (response.status === 204)
                    this.processing = false
                    this.getShortUrls()
                    this.getStatistics();
                })
                .catch(error => {
                    throw error
                })
        },

        setSortField(field) {
            this.sort_by = field;
            this.getShortUrls();
        },

        setSortDirection(direction) {
            this.sort_direction = direction;
            this.getShortUrls();
        },

        setSearchTerm(term) {
            this.search = term;
            this.getShortUrls();
        },

        nextPage() {
            if (this.shortUrlsData.meta.current_page < this.shortUrlsData.meta.total) {
                this.shortUrlsData.meta.current_page++;
                this.getShortUrls();
            }
        },

        previousPage() {
            if (this.shortUrlsData.meta.current_page > 1) {
                this.shortUrlsData.meta.current_page--;
                this.getShortUrls();
            }
        }
    },
})

