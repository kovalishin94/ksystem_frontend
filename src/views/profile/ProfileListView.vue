<template>
    <div v-if="checkAdminPrivileges" class="m-5 flex gap-x-3">
        <RouterLink :to="{ name: 'profile-create' }" class="flex gap-x-2 rounded-lg py-1 px-2 hover:scale-105">
            <svg class="w-8" data-slot="icon" aria-hidden="true" fill="none" stroke-width="1.5" stroke="currentColor"
                viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM3 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 9.374 21c-2.331 0-4.512-.645-6.374-1.766Z"
                    stroke-linecap="round" stroke-linejoin="round"></path>
            </svg>
        </RouterLink>
    </div>
    <hr>
    <div class="flex mx-6 my-4">
        <div class="relative left-7 top-5 ml-[-1rem]">
            <svg class="w-4 h-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
            </svg>
        </div>
        <input v-model="searchProfile" type="search"
            class="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg focus:ring-gray-500 focus:border-gray-500"
            placeholder="Поиск...">
    </div>
    <div v-if="profileList.length" class="m-5 p-5 shadow-2xl">
        <ul v-for="profile in profileList" :key="profile.id" role="list">
            <li class="flex justify-between gap-x-6 py-5">
                <div class="flex min-w-0 gap-x-4">
                    <img v-if="profile.photo_url" class="h-12 w-12 flex-none rounded-full bg-gray-50 object-cover"
                        :src="profile.photo_url" alt="">
                    <svg v-else class="h-12 w-12 flex-none rounded-full bg-gray-50 object-cover" data-slot="icon"
                        aria-hidden="true" fill="none" stroke-width="1.5" stroke="currentColor" viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                            stroke-linecap="round" stroke-linejoin="round"></path>
                    </svg>
                    <div class="min-w-0 flex-auto">
                        <p class="text-sm font-semibold leading-6 text-gray-900">
                            {{ profile.last_name }}
                            {{ profile.first_name }}
                            {{ profile.surname }}
                        </p>
                        <p class="mt-1 truncate text-xs leading-5 text-gray-500">{{ profile.email }}</p>
                    </div>
                </div>
                <div class="shrink-0 flex items-end">
                    <div class="mr-2">
                        <svg @click="getOrCreateChat(profile.id)" data-slot="icon" aria-hidden="true" stroke-width="1.5"
                            stroke="currentColor"
                            class="w-6 h-6 fill-none hover:cursor-pointer hover:fill-gray-400 hover:scale-110"
                            viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.068.157 2.148.279 3.238.364.466.037.893.281 1.153.671L12 21l2.652-3.978c.26-.39.687-.634 1.153-.67 1.09-.086 2.17-.208 3.238-.365 1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z"
                                stroke-linecap="round" stroke-linejoin="round"></path>
                        </svg>
                    </div>

                    <div>
                        <p class="text-end text-sm leading-6 text-gray-900">{{ profile.username }}</p>
                        <div v-if="profile.is_online" class="mt-1 flex items-center gap-x-1.5">
                            <div class="flex-none rounded-full bg-emerald-500/20 p-1">
                                <div class="h-1.5 w-1.5 rounded-full bg-emerald-500"></div>
                            </div>
                            <p class="text-xs leading-5 text-gray-500">Online</p>
                        </div>
                        <div v-else>
                            <div class="mt-1 flex items-center justify-end gap-x-1.5">
                                <div class="h-1.5 w-1.5 rounded-full bg-gray-500"></div>
                                <p class="text-xs leading-5 text-gray-500">Offline</p>
                            </div>
                            <p v-if="profile.human_last_seen" class="mt-1 text-xs leading-5 text-gray-500">Заходил {{
                                profile.human_last_seen }} назад</p>
                        </div>
                    </div>
                    <div v-if="checkAdminPrivileges" class="ml-3">
                        <ksystem-dropdown
                            :links="[{ name: 'profile-detail', params: { id: profile.id }, title: 'Редактировать' }]">
                            <template v-slot:drop-button>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                                    stroke="currentColor" class="w-6 h-6">
                                    <path stroke-linecap="round" stroke-linejoin="round"
                                        d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z" />
                                </svg>
                            </template>
                        </ksystem-dropdown>
                    </div>
                </div>
            </li>
        </ul>
    </div>
    <KsystemPaginator v-if="paginator.totalPages > 1" :total="paginator.totalPages" :current="paginator.current"
        :isNext="!!paginator.next" :isPrevious="!!paginator.previous" @page="selectPage" @previous="previousPage"
        @next="nextPage" />
</template>

<script>
import axios from 'axios'
import { RouterLink } from 'vue-router'
import { useUserStore } from '@/stores/user'
import KsystemPaginator from '@/components/KsystemPaginator.vue'

export default {
    components: { RouterLink, KsystemPaginator },
    setup() {
        const userStore = useUserStore()

        return {
            userStore
        }
    },
    data() {
        return {
            profileList: [],
            paginator: {
                next: null,
                previous: null,
                current: 1,
                totalEntries: null,
                totalPages: null,
            },
            searchProfile: ''
        }
    },
    computed: {
        checkAdminPrivileges() {
            if (this.userStore.user.profile.permissions.filter(el => el.name === 'adm').length) {
                return true
            }
        }
    },
    watch: {
        searchProfile() {
            this.getProfileList()
            this.paginator.current = 1
        }
    },
    mounted() {
        this.getProfileList()
    },
    methods: {
        async getOrCreateChat(id) {
            try {
                const response = await axios.post('/api/chat/create/', { id: id })
                this.$router.push({ name: 'chat' })
            } catch (error) {
                console.log(error)
            }
        },
        async getProfileList(url = '/api/profiles/') {
            if (this.searchProfile) {
                url = url + '?search=' + this.searchProfile
            }
            try {
                const response = await axios.get(url)
                this.profileList = response.data.results
                this.paginator.next = response.data.next
                this.paginator.previous = response.data.previous
                this.paginator.totalEntries = response.data.count
                this.paginator.totalPages = Math.ceil(response.data.count / 10)
            } catch (error) {
                console.log(error)
            }
        },
        selectPage(page) {
            let url = '/api/profiles/'
            if (page == 1) {
                this.getProfileList(url)
            } else {
                url = url + '?page=' + String(page)
                this.getProfileList(url)
            }
            this.paginator.current = page
        },
        nextPage() {
            this.getProfileList(this.paginator.next)
            this.paginator.current += 1
        },
        previousPage() {
            this.getProfileList(this.paginator.previous)
            this.paginator.current -= 1
        }
    },
}
</script>