<template>
    <div v-if="testQuestions.length" class="p-4">
        <h1 class="text-3xl text-center">{{ testDetail.name }}</h1>

        <div class="py-6 px-10 flex flex-col text-center">
            <h1 class="text-sm">Прогресс выполенния теста</h1>
            <div class="bg-gray-200 rounded-full">
                <div class="bg-emerald-500 text-xs font-medium text-gray-900 text-center p-0.5 leading-none rounded-full"
                    :style="`width: ${progressTest}%`"> {{ progressTest }}%</div>
            </div>
        </div>


        <div class="flex flex-col p-2 shadow-2xl">
            <p class="text-xl font-bold text-wrap break-all">{{ testQuestions[currentQuestion].body }}</p>
            <div class="p-4 text-wrap break-all">
                <p v-for="option in testQuestions[currentQuestion].options" :key="option.id"
                    @click="selectOption(option.id)" :class="{ 'bg-emerald-300': selectedOptions.includes(option.id) }"
                    class="mb-3 p-2 w-fit cursor-pointer rounded-lg hover:bg-emerald-200">
                    {{ option.body }}
                </p>
            </div>
        </div>
        <button @click="nextQuestion" v-if="selectedOptions.length"
            :class="[lastQuestion ? 'bg-emerald-600 hover:bg-emerald-500' : 'bg-gray-600 hover:bg-gray-500']"
            class="mt-4 rounded-md px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm  focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600">
            {{ lastQuestion ? 'Завершить тест' : 'Следующий вопрос' }}
        </button>
    </div>
    <div v-if="!testValid" class="h-[80vh] grid min-h-full place-items-center bg-white px-6 py-24 sm:py-32 lg:px-8">
        <div class="text-center">
            <p class="text-5xl font-semibold text-gray-600">Тест не готов для прохождения</p>

            <div class="mt-10 flex items-center justify-center gap-x-6">
                <RouterLink :to="{ name: 'test' }"
                    class="rounded-md bg-gray-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600">
                    Вернуться к списку тестов
                </RouterLink>
            </div>
        </div>
    </div>

    <KsystemSpinner v-if="showSpinner" />
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
            testDetail: {},
            testQuestions: [],
            testValid: true,
            showSpinner: false,
            currentQuestion: 0,
            selectedOptions: [],
            answeredQuestions: []
        }
    },
    computed: {
        lastQuestion() {
            return this.currentQuestion === this.testQuestions.length - 1
        },
        progressTest() {
            if (!this.currentQuestion) {
                return 0
            }
            if (this.testQuestions.length) {
                return ((this.currentQuestion) / this.testQuestions.length) * 100
            }
            return 0
        }
    },
    mounted() {
        this.getTestQuestionsAndOptions()
        this.getTestDetail()
    },
    methods: {
        selectOption(id) {
            if (this.selectedOptions.includes(id)) {
                this.selectedOptions.splice(this.selectedOptions.indexOf(id), 1)
                return
            }
            if (!this.testQuestions[this.currentQuestion].many_answers) {
                this.selectedOptions = []
                this.selectedOptions.push(id)
                return
            }
            this.selectedOptions.push(id)
        },
        nextQuestion() {
            while (this.selectedOptions.length) {
                this.createAnswer(this.selectedOptions.pop())
            }

            if (this.lastQuestion) {
                return
            }

            this.currentQuestion += 1
        },
        async getTestQuestionsAndOptions() {
            this.showSpinner = true
            try {
                const response = await axios.get(`/api/test/questions/solve_list/?id=${this.$route.params.id}`)
                this.testValid = response.data.test_valid
                if (!this.testValid) {
                    this.showSpinner = false
                    return
                }
                this.testQuestions = response.data.questions
                this.testQuestions.forEach(el => el.options = [])
                this.testQuestions.forEach(question => {
                    response.data.options.forEach(option => {
                        if (option.question === question.id) {
                            question.options.push(option)
                        }
                    })
                })
                this.getCurrentAnswers()
            } catch (error) {
                if (error.code === 'ERR_NETWORK') {
                    this.toastStore.showToast(5000, 'Ошибка сервера', 'bg-red-500')
                }
                else if (error.response.status === 403) {
                    this.$router.push({ name: 'test-forbidden' })
                }
                else if (error.response.status === 404) {
                    this.$router.push({ name: 'notfound' })
                }
                else {
                    this.toastStore.showToast(5000, 'Неизвестная ошибка', 'bg-red-500')
                }
            }
            this.showSpinner = false
        },
        async getTestDetail() {
            try {
                const response = await axios.get(`/api/test/${this.$route.params.id}/`)
                this.testDetail = response.data
            } catch (error) {
                if (error.code === 'ERR_NETWORK') {
                    this.toastStore.showToast(5000, 'Ошибка сервера', 'bg-red-500')
                }
            }
        },
        async getCurrentAnswers() {
            const response = await axios.get(`/api/test/answers/?test=${this.$route.params.id}`)
            response.data.forEach(el => {
                this.answeredQuestions.push(el.question)
            })
            this.answeredQuestions = [...new Set(this.answeredQuestions)]

            this.currentQuestion = this.testQuestions.findIndex(el => {
                return !this.answeredQuestions.includes(el.id)
            })
            if (this.currentQuestion < 0) {
                this.finishTest()
            }
        },
        finishTest() {
            this.selectedOptions.forEach(el => this.createAnswer(el))
            axios.post('/api/test/results/', { 'test': this.$route.params.id })
                .then(response => {
                    this.$router.push({ name: 'test-result', params: { id: this.$route.params.id } })
                })
                .catch(error => {
                    console.log(error)
                })
        },
        createAnswer(id) {
            let isFinish = false
            if (this.lastQuestion && !this.selectedOptions.length) {
                isFinish = true
            }
            axios.post('/api/test/answers/', { option: id, test: this.$route.params.id })
                .then(response => {
                    if (isFinish) {
                        this.finishTest()
                    }
                })
                .catch(error => {
                    console.log(error)
                })
        }
    }
}
</script>