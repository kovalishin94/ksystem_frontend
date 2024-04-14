<template>
    <div class="m-4" v-if="testDetail">
        <h1 class="text-3xl text-center">Режим редактирования теста
            <div class="inline-flex" v-if="!editMode">
                <span class="italic text-wrap break-all">{{ testDetail.name }}</span>
                <button class="inline-block py-1 px-1 hover:scale-105" @click="editMode = true">
                    <svg class="h-6 w-6" data-slot="icon" aria-hidden="true" fill="none" stroke-width="1.5"
                        stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
                            stroke-linecap="round" stroke-linejoin="round"></path>
                    </svg>
                </button>
            </div>
        </h1>
        <div v-if="editMode" class="mt-2 flex flex-col gap-y-2 w-full border-2 p-4 border-gray-300">
            <div>
                <label class="block mb-2 text-sm font-medium text-gray-900">Наименование теста</label>
                <input type="text" v-model="testDetail.name"
                    :class="[validationTestErrors.name.length ? 'border-red-600 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-gray-500 focus:border-gray-500']"
                    class="bg-gray-50 border text-gray-900 text-sm rounded-lg block w-full p-2.5"
                    placeholder="Введите наиманование теста" />
                <div v-if="validationTestErrors.name.length">
                    <p class="text-red-600 text-xs" v-for="error in validationTestErrors.name" :key="error">
                        {{ error }}
                    </p>
                </div>
            </div>
            <div>
                <label class="block mb-2 text-sm font-medium text-gray-900">Количество попыток</label>
                <input type="number" v-model="testDetail.possible_attempts"
                    :class="[validationTestErrors.possible_attempts.length ? 'border-red-600 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-gray-500 focus:border-gray-500']"
                    class="bg-gray-50 border text-gray-900 text-sm rounded-lg block w-full p-2.5"
                    placeholder="Введите количество попыток" />
                <div v-if="validationTestErrors.possible_attempts.length">
                    <p class="text-red-600 text-xs" v-for="error in validationTestErrors.possible_attempts"
                        :key="error">
                        {{ error }}
                    </p>
                </div>
            </div>
            <div class="flex gap-x-2">
                <button @click="patchTest"
                    class="max-w-sm rounded-md px-12 py-1.5 text-lg font-semibold text-white shadow-sm bg-emerald-600 hover:bg-emerald-500">
                    Сохранить
                </button>
                <button @click="cancelEditMode"
                    class="max-w-sm rounded-md px-12 py-1.5 text-lg font-semibold text-white shadow-sm bg-gray-500 hover:bg-gray-400">
                    Отмена
                </button>
            </div>
        </div>
        <div v-if="testQuestions.length" class="flex flex-col gap-y-2">
            <TestQuestionEdit v-for="question in testQuestions" :key="question.id" :question="question"
                v-model="question.body" @updateManyAnswers="question.many_answers = $event" @updateOption="updateOption"
                @updateInfo="getTestQuestionsAndOptions" />
        </div>
        <div class="mt-3 flex flex-col items-center gap-y-3">
            <div v-if="showNewQuestionForm" class="w-full">
                <div class="w-full">
                    <textarea rows="1" v-model="newQuestionBody"
                        :class="[validationQuestionErrors.length ? 'border-red-600 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-gray-500 focus:border-gray-500']"
                        class="block p-2.5 w-full text-lg text-gray-900 bg-gray-50 rounded-lg border"
                        placeholder="Напишите новый вопрос"></textarea>
                    <div v-if="validationQuestionErrors.length">
                        <p class="text-red-600 text-xs" v-for="error in validationQuestionErrors" :key="error">
                            {{ error }}
                        </p>
                    </div>
                </div>
                <div class="flex mt-2 items-center border-2 max-w-fit p-2 rounded-lg border-gray-300">
                    <label class="mx-2 text-sm font-medium text-gray-900 dark:text-gray-300">Несколько ответов</label>
                    <input type="checkbox" v-model="newQuestionManyAnswers"
                        class="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500">
                    <label
                        class="mx-3 text-center rounded-md bg-gray-500 px-3 py-2 text-xs font-semibold text-white shadow-sm hover:bg-gray-600 cursor-pointer inline-block">
                        Загрузить изображение...
                        <input @change="imageUpload" ref="photo" type="file" class="hidden" accept="image/png, image/jpeg">
                    </label>
                    <div class="flex gap-x-2 items-center" v-if="imageInfo">
                        <button
                            class="text-center rounded-md bg-gray-500 px-3 py-2 text-xs font-semibold text-white shadow-sm hover:bg-gray-600 cursor-pointer inline-block"
                            @click="imageClear">Очистить</button>
                        <div>Выбран файл: {{ imageInfo }}</div>
                    </div>
                </div>
            </div>
            <div class="flex gap-x-2">
                <button @click="createNewQestion"
                    :class="[showNewQuestionForm ? 'bg-emerald-600 hover:bg-emerald-500' : 'bg-gray-600 hover:bg-gray-500']"
                    class="max-w-sm rounded-md px-12 py-1.5 text-lg font-semibold text-white shadow-sm">
                    {{ showNewQuestionForm ? 'Сохранить' : 'Новый вопрос' }}
                </button>
                <button v-if="showNewQuestionForm" @click="showNewQuestionForm = false"
                    class="max-w-sm rounded-md px-12 py-1.5 text-lg font-semibold text-white shadow-sm bg-gray-500 hover:bg-gray-400">
                    Отмена
                </button>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
import { useToastStore } from '@/stores/toast'
import TestQuestionEdit from '@/components/test/TestQuestionEdit.vue'

export default {
    components: { TestQuestionEdit },
    setup() {
        const toastStore = useToastStore()

        return {
            toastStore
        }
    },
    data() {
        return {
            editMode: false,
            testDetail: {},
            testQuestions: [],
            showNewQuestionForm: false,
            newQuestionBody: '',
            newQuestionManyAnswers: false,
            validationTestErrors: {
                name: [],
                possible_attempts: []
            },
            validationQuestionErrors: [],
            imageInfo: '',
        }
    },
    mounted() {
        this.getTestDetail()
        this.getTestQuestionsAndOptions()
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
        updateOption(data, id, type) {
            this.testQuestions.forEach(question => {
                question.options.forEach(el => {
                    if (el.id === id) {
                        type === 'body' ? el.body = data : el.is_true = data
                    }
                })
            })
        },
        cancelEditMode() {
            this.editMode = false
            this.validationTestErrors.name = []
            this.validationTestErrors.possible_attempts = []
            this.getTestDetail()
        },
        async createNewQestion() {
            if (!this.showNewQuestionForm) {
                this.showNewQuestionForm = true
                return
            }
            this.validationQuestionErrors = []
            try {
                const formData = new FormData()
                formData.append('body', this.newQuestionBody)
                formData.append('many_answers', this.newQuestionManyAnswers)
                formData.append('test', this.$route.params.id)
                if (this.imageInfo){
                    formData.append('image', this.$refs.photo.files[0])
                }
                const response = await axios.post('/api/test/questions/', formData)
                response.data.options = []
                const question = response.data
                question.body_array = question.body.split('\n')
                this.testQuestions.push(question)
                this.newQuestionBody = ''
                this.newQuestionManyAnswers = false
                this.showNewQuestionForm = false
            } catch (error) {
                if (error.code === 'ERR_BAD_REQUEST') {
                    this.validationQuestionErrors = error.response.data.body
                    return
                }
                this.toastStore.showToast(5000, 'Ошибка сервера', 'bg-red-500')
            }
        },
        async getTestQuestionsAndOptions() {
            try {
                const response = await axios.get(`/api/test/questions/?id=${this.$route.params.id}`)
                this.testQuestions = response.data.questions
                this.testQuestions.forEach(el => el.options = [])
                this.testQuestions.forEach(question => {
                    response.data.options.forEach(option => {
                        if (option.question === question.id) {
                            option.body_array = option.body.split('\n')
                            question.options.push(option)
                        }
                    })
                    question.body_array = question.body.split('\n')
                })
            } catch (error) {
                this.toastStore.showToast(5000, 'Неизвестная ошибка', 'bg-red-500')
            }
        },
        async getTestDetail() {
            try {
                const response = await axios.get(`/api/test/${this.$route.params.id}/`)
                this.testDetail = response.data
            } catch (error) {
                this.toastStore.showToast(5000, 'Неизвестная ошибка', 'bg-red-500')
            }
        },
        async patchTest() {
            this.validationTestErrors.name = []
            this.validationTestErrors.possible_attempts = []
            try {
                const response = await axios.patch(`/api/test/${this.$route.params.id}/`, { name: this.testDetail.name, possible_attempts: this.testDetail.possible_attempts })
                this.testDetail = response.data
                this.editMode = false
            } catch (error) {
                if (error.code === 'ERR_BAD_REQUEST') {
                    Object.keys(error.response.data).forEach(el => {
                        this.validationTestErrors[el] = error.response.data[el]
                    })
                    return
                }
                this.toastStore.showToast(5000, 'Неизвестная ошибка', 'bg-red-500')
            }
        }
    }
}
</script>