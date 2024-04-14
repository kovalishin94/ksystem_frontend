<template>
    <div class="flex flex-col p-4 shadow-lg">
        <div class="flex">
            <div class="grow mb-2" :class="[editableMode ? 'hidden' : 'block']">
                <div v-if="question.body.length" class="text-lg font-bold text-wrap break-all">
                    <div v-for="line in question.body_array" class="inline">
                        <br v-if="question.body_array.indexOf(line) !== 0">                    
                        {{ line }}
                    </div>
                    <button class="inline-block py-1 px-1 hover:scale-105" @click="patchQuestion">
                        <svg class="h-6 w-6" data-slot="icon" aria-hidden="true" fill="none" stroke-width="1.5"
                            stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
                                stroke-linecap="round" stroke-linejoin="round"></path>
                        </svg>
                    </button>
                    <button class="inline-block py-1 px-1 hover:scale-105" @click="deleteQuestion">
                        <svg class="h-7 w-7 text-red-600" data-slot="icon" aria-hidden="true" fill="none"
                            stroke-width="1.5" stroke="currentColor" viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg">
                            <path d="M6 18 18 6M6 6l12 12" stroke-linecap="round" stroke-linejoin="round"></path>
                        </svg>
                    </button>
                </div>
                <p class="text-xs" v-if="question.many_answers">(Несколько ответов)</p>
                <div v-if="question.image" class="max-w-lg">
                    <img :src="question.image">
                </div>
            </div>
            <div :class="{ 'hidden': !editableMode }" class="flex flex-col w-full gap-y-2">
                <div>
                    <div class="w-full">
                        <textarea :value="question.body" @input="updateQuestionBody" rows="1"
                            :class="[validationQuestionErrors.length ? 'border-red-600 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-gray-500 focus:border-gray-500']"
                            class="block p-2.5 w-full text-lg text-gray-900 bg-gray-50 rounded-lg border"
                            placeholder="">
                        </textarea>
                        <div v-if="validationQuestionErrors.length">
                            <p class="text-red-600 text-xs" v-for="error in validationQuestionErrors" :key="error">
                                {{ error }}
                            </p>
                        </div>
                    </div>
                    <div class="flex items-center mt-3 border-2 max-w-fit p-2 rounded-lg border-gray-300">
                        <label class="mx-2 text-sm font-medium text-gray-900 dark:text-gray-300">Несколько
                            ответов</label>
                        <input type="checkbox" :checked="question.many_answers" @input="updateManyAnswers"
                            class="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500">
                        <label
                            class="mx-3 text-center rounded-md bg-gray-500 px-3 py-2 text-xs font-semibold text-white shadow-sm hover:bg-gray-600 cursor-pointer inline-block">
                            Загрузить изображение...
                            <input ref="photo" @change="imageUpload" type="file" class="hidden" accept="image/png, image/jpeg">
                        </label>
                        <div class="flex mr-3" v-if="question.image">
                            <button @click="deleteImage" class="text-center rounded-md bg-red-500 px-3 py-2 text-xs font-semibold text-white shadow-sm hover:bg-red-600 cursor-pointer inline-block">
                                Удалить текущее
                            </button>
                        </div>
                        <div class="flex gap-x-2 items-center" v-if="imageInfo">
                            <button class="text-center rounded-md bg-gray-500 px-3 py-2 text-xs font-semibold text-white shadow-sm hover:bg-gray-600 cursor-pointer inline-block" @click="imageClear">Очистить</button>
                            <div>Выбран файл: {{ imageInfo }}</div>
                        </div>
                    </div>
                </div>
                <div class="flex gap-x-2">
                    <button @click="patchQuestion"
                        class="bg-emerald-600 hover:bg-emerald-500' max-w-sm rounded-md px-12 py-1.5 text-lg font-semibold text-white shadow-sm">
                        Сохранить
                    </button>
                    <button v-if="editableMode" @click="cancelEditMode"
                        class="bg-gray-500 hover:bg-gray-400' max-w-sm rounded-md px-12 py-1.5 text-lg font-semibold text-white shadow-sm">
                        Отмена
                    </button>
                </div>
            </div>
        </div>
        <TestOptionEdit v-for="option in question.options" :key="option.id" :option="option"
            @updateOption="updateOption" @updateInfo="$emit('updateInfo')" />
        <div class="flex flex-col gap-y-2 mb-2 ml-5">
            <div v-if="showNewOptionForm" class="flex gap-x-2">
                <div class="w-full">
                    <textarea v-model="newOptionBody" rows="1"
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
                <input type="checkbox" v-model="newOptionIsTrue"
                    class="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500">
            </div>
            <div class="flex gap-x-1">
                <button @click="createNewOption"
                    :class="[showNewOptionForm ? 'bg-emerald-600 hover:bg-emerald-500' : 'bg-gray-600 hover:bg-gray-500']"
                    class="max-w-24 rounded-md px-4 py-1.5 text-xs font-semibold text-white shadow-sm mt-1">
                    {{ showNewOptionForm ? 'Сохранить' : 'Добавить' }}
                </button>
                <button v-if="showNewOptionForm" @click="showNewOptionForm = false"
                    class="max-w-24 rounded-md px-4 py-1.5 text-xs font-semibold text-white shadow-sm mt-1 bg-gray-500 hover:bg-gray-400">
                    Отмена
                </button>
            </div>

        </div>
    </div>
</template>

<script>
import axios from 'axios'
import { useToastStore } from '@/stores/toast'
import TestOptionEdit from '@/components/test/TestOptionEdit.vue'
import { compile } from 'vue'

export default {
    name: 'TestQuestionEdit',
    setup() {
        const toastStore = useToastStore()

        return {
            toastStore
        }
    },
    components: { TestOptionEdit },
    props: {
        question: Object,
    },
    data() {
        return {
            editableMode: false,
            showNewOptionForm: false,
            newOptionBody: '',
            newOptionIsTrue: false,
            validationQuestionErrors: [],
            validationOptionErrors: [],
            imageInfo: ''
        }
    },
    methods: {
        imageClear(){
            this.$refs.photo.value = ''
            this.imageInfo = ''
        },
        imageUpload(){
            if(this.$refs.photo.files.length){
                this.imageInfo = this.$refs.photo.files[0].name
            }
        },
        updateQuestionBody(event) {
            this.$emit('update:modelValue', event.target.value)
        },
        updateManyAnswers(event) {
            this.$emit('updateManyAnswers', event.target.checked)
        },
        updateOption(data, id, type) {
            this.$emit('updateOption', data, id, type)
        },
        cancelEditMode() {
            this.$emit('updateInfo')
            this.editableMode = false
            this.validationQuestionErrors = []
        },
        async deleteImage(){
            const formData = new FormData()
            formData.append('image', '')
            try {
                const response = await axios.patch(`/api/test/questions/${this.question.id}/`, formData)
                this.editableMode = false
                this.$emit('updateInfo')
            } catch (error) {
                if (error.code === 'ERR_BAD_REQUEST') {
                    this.validationQuestionErrors = error.response.data.body
                    return
                }
                this.toastStore.showToast(5000, 'Ошибка сервера', 'bg-red-500')
            }
        },
        async patchQuestion() {
            if (!this.editableMode) {
                this.editableMode = true
                return
            }
            this.validationQuestionErrors = []
            try {
                const formData = new FormData()
                formData.append('body', this.question.body)
                formData.append('many_answers', this.question.many_answers)
                if (this.$refs.photo.files[0]) {
                    formData.append('image', this.$refs.photo.files[0])
                }
                const response = await axios.patch(`/api/test/questions/${this.question.id}/`, formData)
                this.editableMode = false
                this.$emit('updateInfo')
            } catch (error) {
                if (error.code === 'ERR_BAD_REQUEST') {
                    console.log(error)
                    if (error.response.data.body){
                        this.validationQuestionErrors = error.response.data.body
                    }
                    if(error.response.data.image){
                        this.validationQuestionErrors = [...this.validationQuestionErrors, ...error.response.data.image]
                    }
                    return
                }
                this.toastStore.showToast(5000, 'Ошибка сервера', 'bg-red-500')
            }
        },
        async deleteQuestion() {
            try {
                const response = await axios.delete(`/api/test/questions/${this.question.id}/`)
                this.$emit('updateInfo')
            } catch (error) {
                console.log(error)
            }

        },
        async createNewOption() {
            if (!this.showNewOptionForm) {
                this.showNewOptionForm = true
                return
            }
            this.validationOptionErrors = []
            try {
                const response = await axios.post('/api/test/options/', {
                    question: this.question.id,
                    body: this.newOptionBody,
                    is_true: this.newOptionIsTrue
                })
                this.$emit('updateInfo')
                this.showNewOptionForm = false
                this.newOptionBody = ''
                this.newOptionIsTrue = false
            } catch (error) {
                if (error.code === 'ERR_BAD_REQUEST') {
                    this.validationOptionErrors = error.response.data.body
                    return
                }
                this.toastStore.showToast(5000, 'Ошибка сервера', 'bg-red-500')
            }
        }
    }
}
</script>