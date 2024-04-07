<template>
    <form class="m-5" @submit.prevent="submitProfileUpdateForm">
        <div class="space-y-12">
            <div class="border-b border-gray-900/10 pb-12">
                <h2 class="text-base font-semibold leading-7 text-gray-900">Редактирование профиля <strong>{{
                    profileFormData.username }}</strong></h2>
                <p class="mt-1 text-sm leading-6 text-gray-600">Форма редактирование профиля
                </p>
                <div class="mt-10 grid grid-cols-1 gap-x-6 md:grid-cols-12 shadow-2xl p-5">
                    <div class="sm:col-span-3 flex flex-col justify-center gap-y-3 mb-3">
                        <img v-if="photoPreview" :src="photoPreview" class="rounded-3xl object-scale-down h-full">
                        <img v-else-if="profileFormData.photo" :src="profileFormData.photo"
                            class="rounded-3xl object-scale-down h-full">
                        <svg v-else class="flex-none rounded-full bg-gray-50 object-cover opacity-30" data-slot="icon"
                            aria-hidden="true" fill="none" stroke-width="1.5" stroke="currentColor" viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                                stroke-linecap="round" stroke-linejoin="round"></path>
                        </svg>
                        <div class="self-center flex gap-x-3">
                            <button @click="clearPhotoUpload" type="button"
                                class="text-sm font-semibold leading-6 text-gray-900 rounded-md">Очистить</button>
                            <label
                                class="max-w-40 text-center rounded-md bg-gray-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-500 cursor-pointer inline-block">
                                Загрузить фото...
                                <input @change="handlePhotoUpload" ref="photo" type="file" class="hidden"
                                    accept="image/png, image/jpeg">
                            </label>

                        </div>
                        <p v-if="photoPreview" class="text-center text-xs">Текущий файл: {{
                            $refs.photo.files[0].name }}</p>
                    </div>
                    <div class="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6 sm:col-span-9 content-start">
                        <div class="sm:col-span-4 md:col-span-3 lg:col-span-2 col-span-6">
                            <ksystem-input id="last_name" v-model="profileFormData.last_name" :errors="'last_name' in validationErrors
                                ? validationErrors.last_name
                                : []">Фамилия</ksystem-input>
                        </div>
                        <div class="sm:col-span-4 md:col-span-3 lg:col-span-2 col-span-6">
                            <ksystem-input id="first_name" v-model="profileFormData.first_name" :errors="'first_name' in validationErrors
                                ? validationErrors.first_name
                                : []">Имя</ksystem-input>
                        </div>
                        <div class="sm:col-span-4 md:col-span-3 lg:col-span-2 col-span-6">
                            <ksystem-input id="surname" v-model="profileFormData.surname" :errors="'surname' in validationErrors
                                ? validationErrors.surname
                                : []">Отчество</ksystem-input>
                        </div>
                        <div class="sm:col-span-4 md:col-span-3 lg:col-span-2 col-span-6">
                            <ksystem-input id="email" v-model="profileFormData.email" :errors="'email' in validationErrors
                                ? validationErrors.email
                                : []" type="email">
                                Email
                            </ksystem-input>
                        </div>
                        <div class="sm:col-span-4 md:col-span-3 lg:col-span-2 col-span-6">
                            <ksystem-input id="date_of_birth" v-model="profileFormData.date_of_birth" :errors="'date_of_birth' in validationErrors
                                ? validationErrors.date_of_birth
                                : []" type="date">Дата
                                рождения</ksystem-input>
                        </div>
                        <div v-if="permissionList.length" class="flex flex-col col-span-6 border rounded-lg p-4 relative">
                            <label
                                class="bg-white block text-sm font-medium leading-6 text-gray-600 scale-75 top-[-15px] left-[-4px] z-10 absolute p-1">Разрешения</label>
                            <label class="relative inline-flex items-center cursor-pointer mt-3"
                                v-for="permission in permissionList" :key="permission.id">
                                <input type="checkbox" :value="permission.id" class="sr-only peer"
                                    v-model="profileFormData.permissions">
                                <div
                                    class="w-9 h-5 bg-gray-300 rounded-full peer peer-focus:ring-4 peer-focus:ring-gray-300 dark:peer-focus:ring-gray-800 dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-gray-600">
                                </div>
                                <span class="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">{{
                                    permission.description
                                }}</span>
                            </label>
                        </div>
                        <div class="sm:col-span-4" v-if="validationErrors.length">
                            <ul class="sm:max-w-md">
                                <li v-for="error in validationErrors" :key="error"
                                    class="mb-2 p-2 bg-red-300 rounded-md text-gray-800 sm:text-sm sm:leading-6">
                                    {{ error }}
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="mt-6 flex items-center justify-end gap-x-3">
            <button type="button" class="text-sm font-semibold leading-6 text-gray-900"
                @click="$router.back">Отмена</button>
            <button @click="showDeleteModal=true" type="button"
                class="rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600">Удалить</button>
            <button type="submit"
                class="rounded-md bg-gray-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600">Сохранить</button>
        </div>
    </form>
    <KsystemDeleteDialog v-model:show="showDeleteModal" @accept="deleteProfile">
        <template v-slot:modal-title>
            Удаление профиля
        </template>
        <template v-slot:modal-body>
            Вы действительно хотите удалить профиль <strong>{{ profileFormData.username }}</strong> ?
        </template>
    </KsystemDeleteDialog>
</template>

<script>
import axios from 'axios'
import { useToastStore } from '@/stores/toast'

export default {
    setup() {
        const toastStore = useToastStore()

        return {
            toastStore
        }
    },
    data() {
        return {
            profileFormData: {
                username: '',
                email: '',
                first_name: '',
                last_name: '',
                surname: '',
                date_of_birth: '',
                permissions: [],
                photo: null,
            },
            photoPreview: null,
            permissionList: [],
            validationErrors: {},
            showDeleteModal: false,
        }
    },
    watch: {
        '$route.params.id': {
            handler: function () {
                if (this.$route.name === 'profile-detail') {
                    this.getProfileData()
                }
            },
            deep: true,
            immediate: true,
        },
    },
    mounted() {
        this.getProfileData()
        this.getPermissionList()
    },
    methods: {
        clearPhotoUpload() {
            this.$refs.photo.value = ''
            this.photoPreview = null
            this.profileFormData.photo = null
        },

        handlePhotoUpload() {
            let reader = new FileReader()

            reader.addEventListener('load', function () {
                this.photoPreview = reader.result
            }.bind(this), false)

            reader.readAsDataURL(this.$refs.photo.files[0])
        },

        async getProfileData() {
            try {
                const response = await axios.get(`/api/profiles/${this.$route.params.id}/`)
                this.profileFormData = response.data
            } catch (error) {       
                if (error.response.status === 403) {
                    this.$router.push({ name: 'forbidden' })
                } else {
                    this.$router.push({ name: 'notfound' })
                }
            }
        },
        async getPermissionList() {
            try {
                const response = await axios.get('/api/permissions/')
                this.permissionList = response.data
            } catch (error) {
            }
        },
        async submitProfileUpdateForm() {
            const photoFormData = new FormData()
            if (this.$refs.photo.files[0]) {
                photoFormData.append('photo', this.$refs.photo.files[0])
            }

            if (!this.$refs.photo.files[0] && !this.profileFormData.photo) {
                photoFormData.append('photo', '')
            }

            if (photoFormData.has('photo')) {
                try {
                    const response = await axios.patch(`/api/profiles/${this.$route.params.id}/`, photoFormData)
                } catch (error) {
                    console.log(error)
                }
            }

            try {
                const response = await axios.patch(`/api/profiles/${this.$route.params.id}/`, {
                    'email': this.profileFormData.email,
                    'first_name': this.profileFormData.first_name,
                    'last_name': this.profileFormData.last_name,
                    'surname': this.profileFormData.surname,
                    'date_of_birth': this.profileFormData.date_of_birth,
                    'permissions': this.profileFormData.permissions,
                })
                this.$router.push({ name: 'profile-list' })
            } catch (error) {
                if(error.response.data) {
                    error.response.data.message ? this.toastStore.showToast(5000, error.response.data.message, 'bg-red-500') : console.log(error.response.data)
                }
                if (error.response.status === 403) {
                    this.$router.push({ name: 'forbidden' })
                } else {
                    this.validationErrors = error.response.data
                    console.log(error.response.data)
                }                
            }
        },
        async deleteProfile() {
            try {
                const response = await axios.delete(`/api/profiles/${this.$route.params.id}/`)
                console.log(response)
                this.$router.push({ name: 'profile-list' })
            } catch (error) {
                if(error.response.data) {
                    error.response.data.message ? this.toastStore.showToast(5000, error.response.data.message, 'bg-red-500') : console.log(error.response.data)
                }
                if (error.response.status === 403) {
                    this.$router.push({ name: 'forbidden' })
                }
            }
        }
    },

}
</script>