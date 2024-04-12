<template>
    <div class="m-4">
        <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
            <table class="table-fixed w-full text-sm text-left text-gray-500">
                <thead class="text-xs text-gray-700 uppercase bg-gray-50">
                    <tr>
                        <th scope="col" class="px-6 py-3">
                            Пользователь
                        </th>
                        <th scope="col" class="px-6 py-3">
                            Номер попытки
                        </th>
                        <th scope="col" class="px-6 py-3">
                            Результат
                        </th>
                        <th scope="col" class="px-6 py-3">
                            Дата прохождения
                        </th>
                    </tr>
                </thead>
                <tbody v-if="resultList.length">
                    <tr v-for=" result  in resultList " :key="result.id" class="bg-white border-b hover:bg-gray-50">
                        <td scope="row" class="px-6 py-4 font-medium text-gray-900 text-wrap break-all">
                            <div class="inline-flex items-center gap-x-4">
                                <div>
                                    <img v-if="result.user.profile.photo"
                                        class="h-8 w-8 flex-none rounded-full bg-gray-50 object-cover"
                                        :src="result.user.profile.photo" alt="">
                                    <svg v-else class="h-8 w-8 flex-none rounded-full bg-gray-50 object-cover"
                                        data-slot="icon" aria-hidden="true" fill="none" stroke-width="1.5"
                                        stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                                            stroke-linecap="round" stroke-linejoin="round"></path>
                                    </svg>
                                </div>
                                <div>
                                    {{ result.user.profile.first_name + ' ' + result.user.profile.last_name }}
                                </div>
                            </div>
                        </td>
                        <td class="px-6 py-4 text-wrap break-all">
                            {{ result.attempt }}
                        </td>
                        <td class="px-6 py-4 text-wrap break-all">
                            {{ result.mark * 100 }} %
                        </td>
                        <td class="px-6 py-4 text-wrap break-all">
                            {{ result.created_at }}
                        </td>
                    </tr>
                </tbody>
                <tbody v-else>
                    <tr>
                        <td colspan="4" class="text-center h-10">
                            Данный тест пока ещё никто не решил
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
import { useToastStore } from '@/stores/toast'
import { useUserStore } from '@/stores/user'

export default {
    setup() {
        const toastStore = useToastStore()
        const userStore = useUserStore()

        return {
            toastStore, userStore
        }
    },
    data() {
        return {
            resultList: [],
        }
    },
    mounted() {
        this.getResultList()
    },
    methods: {
        async getResultList() {
            try {
                const response = await axios.get(`/api/test/results/?id=${this.$route.params.id}`)
                this.resultList = response.data
                console.log(response.data)
            } catch (error) {
                console.log(error)
                if (error.code === 'ERR_NETWORK') {
                    this.toastStore.showToast(5000, 'Ошибка сети', 'bg-red-500')
                    return
                }
                if (error.response.status === 403) {
                    this.$router.push({ name: 'forbidden' })
                    return
                }
                if (error.response.status === 404) {
                    this.$router.push({ name: 'notfound' })
                    return
                }
            }
        }
    }

}
</script>