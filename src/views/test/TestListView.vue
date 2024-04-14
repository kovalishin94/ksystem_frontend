<template>
    <div class="m-4">
        <div class="relative overflow-x-scroll shadow-md sm:rounded-lg">
            <table class="table-auto w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th scope="col" class="px-6 py-3">
                            Наименование теста
                        </th>
                        <th scope="col" class="px-6 py-3">
                            Количество попыток
                        </th>
                        <th scope="col" class="px-6 py-3">
                            Количество использованных попыток
                        </th>
                        <th scope="col" class="px-6 py-3">
                            Автор
                        </th>
                        <th scope="col" class="px-6 py-3">
                            Действия
                        </th>
                    </tr>
                </thead>
                <tbody v-if="testList.length" class="dark:text-white">
                    <tr v-for=" test  in  testList " :key="test.id" class="bg-white border-b hover:bg-gray-50 dark:hover:bg-gray-700 dark:bg-gray-800 dark:border-gray-700">
                        <td scope="row" class="max-w-md px-6 py-4 font-medium text-gray-900 text-wrap break-all dark:text-white">
                            {{ test.name }}
                        </td>
                        <td class="px-6 py-4 w-10">
                            {{ test.possible_attempts }}
                        </td>
                        <td class="px-6 py-4 w-10">
                            {{ countResults[test.id] }}
                        </td>
                        <td class="px-6 py-4">
                            {{ `${test.created_by.first_name} ${test.created_by.last_name} ` }}
                        </td>
                        <td class="px-6 py-4">
                            <div class="inline-flex items-center">
                                <div class="flex" v-if="checkPermisssions">
                                    <RouterLink :to="{ name: 'test-edit', params: { id: test.id } }"
                                        class="font-medium text-gray-600">
                                        <div class="tooltip" data-tip="Редактировать">
                                            <svg class="h-6 w-6 hover:scale-125" data-slot="icon" aria-hidden="true"
                                                fill="none" stroke-width="1.5" stroke="currentColor" viewBox="0 0 24 24"
                                                xmlns="http://www.w3.org/2000/svg">
                                                <path
                                                    d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
                                                    stroke-linecap="round" stroke-linejoin="round"></path>
                                            </svg>
                                        </div>
                                    </RouterLink>

                                    <button @click="showModal(test)" class="font-medium text-red-600 ms-3">
                                        <div class="tooltip" data-tip="Удалить">
                                            <svg class="h-6 w-6 text-red-600 hover:scale-125" data-slot="icon"
                                                aria-hidden="true" fill="none" stroke-width="1.5" stroke="currentColor"
                                                viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M6 18 18 6M6 6l12 12" stroke-linecap="round"
                                                    stroke-linejoin="round">
                                                </path>
                                            </svg>
                                        </div>
                                    </button>

                                    <RouterLink :to="{ name: 'test-result-all', params: { id: test.id } }"
                                        class="font-medium text-gray-600 ms-3">
                                        <div class="tooltip" data-tip="Посмотреть результаты всех">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                                stroke-width="1.5" stroke="currentColor" class="w-6 h-6 hover:scale-125">
                                                <path stroke-linecap="round" stroke-linejoin="round"
                                                    d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 0 1-1.125-1.125M3.375 19.5h7.5c.621 0 1.125-.504 1.125-1.125m-9.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-7.5A1.125 1.125 0 0 1 12 18.375m9.75-12.75c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125m19.5 0v1.5c0 .621-.504 1.125-1.125 1.125M2.25 5.625v1.5c0 .621.504 1.125 1.125 1.125m0 0h17.25m-17.25 0h7.5c.621 0 1.125.504 1.125 1.125M3.375 8.25c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125m17.25-3.75h-7.5c-.621 0-1.125.504-1.125 1.125m8.625-1.125c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125M12 10.875v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 10.875c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125M13.125 12h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125M20.625 12c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5M12 14.625v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 14.625c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125m0 1.5v-1.5m0 0c0-.621.504-1.125 1.125-1.125m0 0h7.5" />
                                            </svg>
                                        </div>
                                    </RouterLink>
                                </div>
                                <div v-if="!validList.includes(test.id)" class="flex tooltip text-gray-700 ms-3 mb-2"
                                    data-tip="Тест не готов к прохождению">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                        stroke-width="1.5" stroke="currentColor" class="w-6 h-6 cursor-not-allowed">
                                        <path stroke-linecap="round" stroke-linejoin="round"
                                            d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                                    </svg>
                                </div>
                                <div v-else-if="test.possible_attempts === countResults[test.id]"
                                    class="tooltip text-gray-700 inline-block ms-3" data-tip="Исчерпаны все попытки">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                        stroke-width="1.5" stroke="currentColor" class="w-6 h-6 cursor-not-allowed">
                                        <path stroke-linecap="round" stroke-linejoin="round"
                                            d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                                    </svg>
                                </div>
                                <div class="flex" v-else>
                                    <RouterLink :to="{ name: 'test-solve', params: { id: test.id } }"
                                        class="text-gray-700 ms-3">
                                        <div class="tooltip" data-tip="Пройти тест">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                                stroke-width="1.5" stroke="currentColor"
                                                class="w-6 h-6 hover:text-emerald-500 hover:scale-125">
                                                <path stroke-linecap="round" stroke-linejoin="round"
                                                    d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                                            </svg>
                                        </div>
                                    </RouterLink>
                                </div>
                                <div class="flex" v-if="countResults[test.id]">
                                    <RouterLink :to="{ name: 'test-result', params: { id: test.id } }"
                                        class="text-gray-700 ms-3">
                                        <div class="tooltip" data-tip="Посмотреть результаты">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                                stroke-width="1.5" stroke="currentColor"
                                                class="w-6 h-6 hover:text-emerald-500 hover:scale-105">
                                                <path stroke-linecap="round" stroke-linejoin="round"
                                                    d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z" />
                                            </svg>
                                        </div>
                                    </RouterLink>
                                </div>
                            </div>
                        </td>
                    </tr>
                </tbody>
                <tbody v-if="!testList.length && !newTestMode">
                    <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                        Нет данных для отображения
                    </th>
                </tbody>
                <tfoot v-if="newTestMode">
                    <tr>
                        <td colspan="2" class="px-5 py-3">
                            <input type="text" v-model="newTestName"
                                :class="[validationErrors.name.length ? 'border-red-600 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-gray-500 focus:border-gray-500']"
                                class="bg-gray-50 border text-gray-900 text-sm rounded-lg block w-full p-2.5"
                                placeholder="Введите наиманование теста" />
                            <div v-if="validationErrors.name.length">
                                <p class="text-red-600 text-xs" v-for="error in validationErrors.name" :key="error">{{
                                    error }}</p>
                            </div>
                        </td>
                        <td class="px-5 py-3">
                            <input type="number" v-model="newTestPossibleAttempts"
                                :class="[validationErrors.possible_attempts.length ? 'border-red-600 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-gray-500 focus:border-gray-500']"
                                class="bg-gray-50 border text-gray-900 text-sm rounded-lg block w-full p-2.5"
                                placeholder="Введите количество попыток" />
                            <div v-if="validationErrors.possible_attempts.length">
                                <p class="text-red-600 text-xs" v-for="error in validationErrors.possible_attempts"
                                    :key="error">
                                    {{ error }}
                                </p>
                            </div>
                        </td>
                        <td class="px-5 py-3 flex">
                            <button @click="createNewTest"
                                class="mx-2 rounded-md px-12 py-1.5 font-semibold text-white shadow-sm text-sm bg-emerald-600 hover:bg-emerald-500">
                                Сохранить
                            </button>
                            <button @click="newTestMode = false"
                                class="rounded-md px-12 py-1.5 font-semibold text-white shadow-sm text-sm bg-gray-500 hover:bg-gray-400">
                                Отмена
                            </button>
                        </td>
                    </tr>
                </tfoot>
            </table>
        </div>
        <button v-if="!newTestMode && checkPermisssions" @click="newTestMode = true"
            class="my-3 rounded-md px-12 py-1.5 font-semibold text-white shadow-sm text-sm bg-gray-600 hover:bg-gray-500">
            Добавить новый тест
        </button>
    </div>
    <KsystemDeleteDialog v-if="checkPermisssions" v-model:show="showDeleteModal" @accept="deleteTest(deleteCurTest)">
        <template v-slot:modal-title>
            Удаление теста
        </template>
        <template v-slot:modal-body>
            Вы действительно хотите удалить тест <strong>{{ deleteCurTest.name }}</strong> ?
        </template>
    </KsystemDeleteDialog>
</template>

<script>
import axios from 'axios'
import { initFlowbite } from 'flowbite'
import { RouterLink } from 'vue-router'
import { useToastStore } from '@/stores/toast'
import { onMounted } from 'vue'
import { useUserStore } from '@/stores/user'

export default {
    setup() {
        const toastStore = useToastStore()
        const userStore = useUserStore()

        onMounted(() => {
            initFlowbite()
        })

        return {
            toastStore, userStore
        }
    },
    computed: {
        checkPermisssions() {
            let allow = false
            this.userStore.user.profile.permissions.forEach(el => {
                if (el.name === 'adm' || el.name === 'tst') { allow = true }
            })
            return allow
        }
    },
    data() {
        return {
            testList: [],
            validList: [],
            countResults: {},
            newTestMode: false,
            newTestName: '',
            newTestPossibleAttempts: null,
            showDeleteModal: false,
            deleteCurTest: {},
            validationErrors: {
                name: [],
                possible_attempts: []
            }
        }
    },
    mounted() {
        this.getTestList()
    },
    methods: {
        showModal(name) {
            this.showDeleteModal = true
            this.deleteCurTest = name
        },
        async getTestList() {
            try {
                const response = await axios.get('/api/test/')
                if (response.data.tests.length === Object.keys(response.data.count_results).length) {
                    this.countResults = response.data.count_results
                    this.testList = response.data.tests
                    this.validList = response.data.valid_list
                }
            } catch (error) {
                console.log(error)
            }
        },
        async createNewTest() {
            this.validationErrors.name = []
            this.validationErrors.possible_attempts = []
            try {
                const response = await axios.post('/api/test/', { name: this.newTestName, possible_attempts: this.newTestPossibleAttempts })
                this.testList.push(response.data)
                this.newTestName = ''
                this.newTestPossibleAttempts = null
                this.newTestMode = false
            } catch (error) {
                if (error.response.status === 400) {
                    Object.keys(error.response.data).forEach(el => {
                        this.validationErrors[el] = error.response.data[el]
                    })
                    return
                }
                this.toastStore.showToast(5000, 'Неизвестная ошибка', 'bg-red-500')
            }
        },
        async deleteTest(test) {
            try {
                const response = await axios.delete(`/api/test/${test.id}/`)
                this.testList.splice(this.testList.indexOf(test), 1)
            } catch (error) {
                this.toastStore.showToast(5000, 'Ошибка сервера', 'bg-red-500')
            }
        }
    }
}
</script>