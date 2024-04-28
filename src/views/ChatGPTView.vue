<template>
    <div class="flex flex-col mt-10 sm:mx-10 p-5 h-[calc(100vh-64px-5rem)] rounded-3xl gap-y-3">
        <div v-if="chatMessages.length"
            class="flex flex-col-reverse h-full overflow-y-scroll scroll-smooth snap-end rounded-xl shadow-xl">
            <div v-show="showSpinner" class="m-3 self-center">
                <svg aria-hidden="true" class="w-12 h-12 text-gray-200 animate-spin dark:text-gray-600 fill-gray-600"
                    viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                        fill="currentColor" />
                    <path
                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                        fill="currentFill" />
                </svg>
                <span class="sr-only">Loading...</span>
            </div>
            <div v-for="message in chatMessages" :key="message.id" class="flex flex-col">
                <div
                    class="self-end bg-emerald-500 text-white m-3 p-3 text-balance break-words max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl rounded-l-lg rounded-br-lg">
                    <pre class="break-words whitespace-pre-wrap">{{ message.question.body }}</pre>
                    <div class="mt-3 text-end text-xs">
                        {{ message.human_created_at }}
                    </div>
                </div>
                <div
                    class="bg-gray-500 text-white m-3 p-3 text-balance break-words max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl rounded-r-lg rounded-bl-lg">
                    <img v-if="message.answer[0] === 'Фото'" :src="message.image_url">
                    <figure v-else-if="message.answer[0] === 'Аудио'">
                        <figcaption class="mb-2">Текст конвертирован в речь</figcaption>
                        <audio controls :src="message.speech_url"></audio>
                    </figure>
                    <pre v-else class="break-words whitespace-pre-wrap">{{ message.answer }}</pre>
                    <div class="mt-3 text-end text-xs">
                        {{ message.human_created_at }}
                    </div>
                </div>
            </div>
        </div>
        <div v-else
            class="flex flex-col h-full overflow-y-scroll scroll-smooth snap-end rounded-xl shadow-xl text-gray-400 justify-center items-center">
            <div>
                Диалог пуст
            </div>
        </div>
        <div class="flex gap-x-1">
            <button @click="chatModel = 'gpt'" class="px-5 py-2 border rounded-lg text-sm"
                :class="[chatModel === 'gpt' ? 'bg-gray-700 text-white' : 'hover:bg-gray-300']">Текст</button>
            <button @click="chatModel = 'dalle'" class="px-5 py-2 border rounded-lg text-sm"
                :class="[chatModel === 'dalle' ? 'bg-gray-700 text-white' : 'hover:bg-gray-300']">Картинка</button>
            <button @click="chatModel = 'tts'" class="px-5 py-2 border rounded-lg text-sm"
                :class="[chatModel === 'tts' ? 'bg-gray-700 text-white' : 'hover:bg-gray-300']">Речь</button>
        </div>
        <form class="flex flex-col gap-y-2" @submit.prevent="submitQuetionForm">
            <textarea v-model="formData.chatquestion" rows="4" @keydown.enter.prevent.exact="$refs.button.click"
                @keyup.ctrl.enter.prevent="newLine"
                class="block p-2.5 w-full text-sm text-gray-900 rounded-lg border resize-none border-gray-300 focus:ring-gray-500 focus:border-gray-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-gray-500 dark:focus:border-gray-500"
                placeholder="Напишите..." required></textarea>
            <button type="submit" ref="button"
                class="self-end rounded-md bg-gray-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600">Отправить</button>
        </form>
    </div>
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
            chatMessages: [],
            formData: {
                chatquestion: ''
            },
            showSpinner: false,
            chatModel: 'gpt',
        }
    },
    mounted() {
        this.getChatMessages()
    },
    methods: {
        async getChatMessages() {
            try {
                const response = await axios.get('/api/chatgpt/')
                this.chatMessages = response.data
            } catch (error) {
                console.log(error)
            }
        },
        async submitQuetionForm() {
            this.showSpinner = true
            try {
                const response = await axios.post(`/api/chatgpt/${this.chatModel}/`, this.formData)
                this.formData.chatquestion = ''
                this.showSpinner = false
                this.chatMessages.unshift(response.data)
            } catch (error) {
                this.showSpinner = false
                this.toastStore.showToast(5000, error.response.data.message, 'bg-red-500')
                this.formData.chatquestion = ''
            }
        },
        newLine(e) {
            let caret = e.target.selectionStart;
            e.target.setRangeText("\n", caret, caret, "end");
            this.formData.chatquestion = e.target.value;
        }
    },

}

</script>