<template>
    <div class="ml-5">
        <div class="flex">
            <div :class="[editableMode ? 'hidden' : 'flex items-center grow']">
                <p class="text-sm text-wrap break-all">
                    <svg class="inline-block w-3 h-3" :class="{ 'text-green-500': option.is_true }"
                        xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                        <path fill="currentColor"
                            d="M10 2c4.42 0 8 3.58 8 8s-3.58 8-8 8s-8-3.58-8-8s3.58-8 8-8m0 13c2.76 0 5-2.24 5-5s-2.24-5-5-5s-5 2.24-5 5s2.24 5 5 5" />
                    </svg>
                    {{ option.body }}
                    <button class="inline-block py-2 px-2 rounded-lg hover:scale-110" @click="patchOption">
                        <svg class="h-4 w-4" data-slot="icon" aria-hidden="true" fill="none" stroke-width="1.5"
                            stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
                                stroke-linecap="round" stroke-linejoin="round"></path>
                        </svg>
                    </button>
                    <button class="inline-block py-2 px-2 rounded-lg hover:scale-110" @click="deleteOption">
                        <svg class="h-4 w-4 text-red-600" data-slot="icon" aria-hidden="true" fill="none" stroke-width="1.5"
                            stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M6 18 18 6M6 6l12 12" stroke-linecap="round" stroke-linejoin="round"></path>
                        </svg>
                    </button>
                </p>
            </div>
            <div :class="{ 'hidden': !editableMode }" class="flex flex-col w-full gap-y-2 mb-2">
                <div class="flex gap-x-2">
                    <div class="w-full">
                        <textarea :value="option.body" @input="updateOption($event.target.value, 'body')" rows="1"
                            :class="[validationOptionErrors.length ? 'border-red-600 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-gray-500 focus:border-gray-500']"
                            class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border"
                            placeholder=""></textarea>
                        <div v-if="validationOptionErrors.length">
                            <p class="text-red-600 text-xs" v-for="error in validationOptionErrors" :key="error">
                                {{ error }}
                            </p>
                        </div>
                    </div>
                    <label class="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Верный</label>
                    <input type="checkbox" :checked="option.is_true" @input="updateOption($event.target.checked, 'is_true')"
                        class="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500">
                </div>
                <div class="flex gap-x-1">
                    <button @click="patchOption"
                        class="max-w-24 rounded-md bg-emerald-600 px-4 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-emerald-500">Сохранить</button>
                    <button @click="cancelEditMode"
                        class="max-w-24 rounded-md bg-gray-500 px-4 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-gray-400">Отмена</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
import { useToastStore } from '@/stores/toast'

export default {
    name: 'TestOptionEdit',
    setup() {
        const toastStore = useToastStore()

        return {
            toastStore
        }
    },
    props: {
        option: Object,
    },
    data() {
        return {
            editableMode: false,
            validationOptionErrors: []
        }
    },
    methods: {
        cancelEditMode() {
            this.editableMode = false
            this.validationOptionErrors = []
            this.$emit('updateInfo')
        },
        updateOption(data, type) {
            this.$emit('updateOption', data, this.option.id, type)
        },
        async patchOption() {
            if (!this.editableMode) {
                this.editableMode = true
                return
            }
            this.validationOptionErrors = []
            try {
                const response = await axios.patch(`/api/test/options/${this.option.id}/`, {
                    body: this.option.body,
                    is_true: this.option.is_true
                })
                this.editableMode = false
                this.$emit('updateInfo')
            } catch (error) {
                if (error.code === 'ERR_BAD_REQUEST') {
                    this.validationOptionErrors = error.response.data.body
                    return
                }
                this.toastStore.showToast(5000, 'Ошибка сервера', 'bg-red-500')
            }
        },
        async deleteOption() {
            try {
                const response = await axios.delete(`/api/test/options/${this.option.id}/`)
            } catch (error) {
                console.log(error)
            }
            this.$emit('updateInfo')
        }
    }
}
</script>