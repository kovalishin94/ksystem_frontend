<template>
    <form @submit.prevent="submitUserCreateForm" class="m-5">
        <div class="space-y-12">
            <div class="border-b border-gray-900/10 pb-12">
                <h2 class="text-base font-semibold leading-7 text-gray-900">Новый пользователь</h2>
                <p class="mt-1 text-sm leading-6 text-gray-600">Создание нового пользователя начинается с логина и пароля
                </p>

                <div class="mt-10 grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-6">
                    <div class="sm:col-span-4 max-w-md">
                        <ksystem-input id="username" :errors="'username' in validationErrors ? validationErrors.username : []" v-model="userFormData.username">Имя пользователя</ksystem-input>
                    </div>
                    <div class="sm:col-span-4 max-w-md">
                        <ksystem-input id="password1" :errors="'password1' in validationErrors ? validationErrors.password1 : []" v-model="userFormData.password1"
                            type="password">Пароль</ksystem-input>
                    </div>
                    <div class="sm:col-span-4 max-w-md">
                        <ksystem-input id="password2" :errors="'password2' in validationErrors ? validationErrors.password2 : []" v-model="userFormData.password2" type="password">Повторите
                            пароль</ksystem-input>
                    </div>
                </div>
            </div>
        </div>
        <div class="mt-6 flex items-center justify-end gap-x-6">
            <button @click="$router.back" type="button"
                class="text-sm font-semibold leading-6 text-gray-900">Отмена</button>
            <button type="submit"
                class="rounded-md bg-gray-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600">Создать</button>
        </div>
    </form>
</template>

<script>
import axios from 'axios'

export default {
    data() {
        return {
            userFormData: {
                username: '',
                password1: '',
                password2: ''
            },
            validationErrors: {},
        }
    },
    methods: {
        async submitUserCreateForm() {
            try {
                const response = await axios.post('/api/profiles/create/', this.userFormData)
                this.$router.push({ name: 'profile-detail', params: { id: response.data.id } })
            } catch (error) {
                this.validationErrors = error.response.data
                console.log(error.response.data)
            }
        }
    }
}

</script>