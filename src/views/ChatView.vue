<template>
    <div v-if="chatList.length">
        <div class="md:hidden w-8 h-8 mt-5 ml-5 cursor-pointer hover:scale-105" :class="[chatListToggle ? 'hidden' : '']"
            @click="chatListToggle = true">
            <svg data-slot="icon" aria-hidden="true" fill="none" stroke-width="1.5" stroke="currentColor"
                viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" stroke-linecap="round" stroke-linejoin="round"></path>
            </svg>
        </div>
        <div class="grid grid-cols-12">
            <div class="md:block mt-10 mx-2 p-5 md:col-span-3 border-r-2 min-w-60"
                :class="[chatListToggle ? 'block col-span-full' : 'hidden']">
                <ul class="flex flex-col gap-y-1" role="list" v-if="chatList.length">
                    <li class="flex flex-col justify-center rounded-lg"
                        :class="[chat.id === activeChatId ? 'bg-emerald-300' : 'bg-gray-300 cursor-pointer']"
                        v-for="chat in chatList" :key="chat.id" @click="chatClick(chat.id)">
                        <ChatListItem v-if="chat.first_user_id !== userStore.user.profile.id"
                            :userPhoto="chat.first_user_photo" :firstName="chat.first_user_first_name"
                            :lastName="chat.first_user_last_name"
                            @deleteChat="showChatDeleteModal(chat.id, chat.first_user_first_name, chat.first_user_last_name)" />
                        <ChatListItem v-else-if="chat.first_user_id === chat.second_user_id"
                            :userPhoto="chat.first_user_photo" firstName="Избранное" lastName=""
                            @deleteChat="showChatDeleteModal(chat.id, 'самим', 'собой')" />
                        <ChatListItem v-else :userPhoto="chat.second_user_photo" :firstName="chat.second_user_first_name"
                            :lastName="chat.second_user_last_name"
                            @deleteChat="showChatDeleteModal(chat.id, chat.second_user_first_name, chat.second_user_last_name)" />
                    </li>
                </ul>
            </div>

            <div class="md:flex md:flex-col mt-10 mx-2 p-5 h-[calc(100vh-64px-5rem)] rounded-3xl gap-y-3 md:col-span-9"
                :class="[chatListToggle ? 'hidden' : 'flex flex-col col-span-full']">
                <div class="flex flex-col-reverse h-full overflow-y-scroll scroll-smooth snap-end rounded-xl shadow-xl">
                    <div v-if="chatMessages.length">
                        <div class="flex flex-col" v-for="message in chatMessages" :key="message.id">
                            <div v-if="userStore.user.profile.id === message.created_by"
                                class="self-end bg-emerald-500 text-white m-3 p-3 text-balance break-words max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl rounded-l-lg rounded-br-lg">
                                {{ message.body }}
                                <div class="mt-3 text-end text-xs">
                                    {{ message.human_updated_at }}
                                </div>
                            </div>
                            <div v-else
                                class="bg-gray-500 text-white m-3 p-3 text-balance break-words max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl rounded-r-lg rounded-bl-lg">
                                {{ message.body }}
                                <div class="mt-3 text-end text-xs">
                                    {{ message.human_updated_at }}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <form class="flex flex-col gap-y-2" @submit.prevent="sendMessage">
                    <textarea rows="4" v-model="messageBody" @keydown.enter.prevent.exact="$refs.button.click"
                        @keyup.ctrl.enter.prevent="newLine"
                        class="block p-2.5 w-full text-sm text-gray-900 rounded-lg border resize-none border-gray-300 focus:ring-gray-500 focus:border-gray-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-gray-500 dark:focus:border-gray-500"
                        placeholder="Напишите..." required></textarea>
                    <button type="submit" ref="button"
                        class="self-end rounded-md bg-gray-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600">Отправить</button>
                </form>
            </div>
        </div>
        <KsystemDeleteDialog v-model:show="showDeleteModal" @accept="deleteChat">
            <template v-slot:modal-title>
                Удаление чата
            </template>
            <template v-slot:modal-body>
                Вы действительно хотите удалить чат с <strong>{{ chatDeleteInfo.firstName + ' ' + chatDeleteInfo.lastName
                }}</strong> ?
                <p>Все сообщения будут удалены у Вас и собеседника</p>
            </template>
        </KsystemDeleteDialog>
    </div>
    <div v-else class="flex h-[80vh] flex-col justify-center text-center text-3xl">
        У вас нет чатов
    </div>
</template>
<script>
import axios from 'axios'
import { useUserStore } from '@/stores/user'
import { useToastStore } from '@/stores/toast'
import ChatListItem from '@/components/ChatListItem.vue'

export default {
    setup() {
        const userStore = useUserStore()
        const toastStore = useToastStore()

        return {
            userStore, toastStore
        }
    },
    components: { ChatListItem },
    data() {
        return {
            chatList: [],
            chatMessages: [],
            activeChatId: '',
            messageBody: '',
            chatListToggle: false,
            showDeleteModal: false,
            chatDeleteInfo: {
                id: '',
                firstName: '',
                lastName: '',
            },
            chatSocket: null,
            closeWs: null,
        }
    },
    watch: {
        activeChatId(newVal) {
            if (this.chatSocket) {
                this.chatSocket.send(
                    JSON.stringify({
                        close: 'close'
                    })
                )
            }
            this.connectWS()
        }
    },
    mounted() {
        this.getChatList()
    },
    methods: {
        connectWS() {
            const url = 'ws://'
                + import.meta.env.VITE_API_HOST
                + '/ws/chat/'
                + this.activeChatId
                + '/'
                + '?token='
                + this.userStore.user.accessToken

            this.chatSocket = new WebSocket(url)

            this.chatSocket.onmessage = (e) => {
                const data = JSON.parse(e.data)
                if (data instanceof Array) {
                    this.chatMessages = data
                    return
                }
                this.chatMessages.push(data)
            }
            const interval = setInterval(() => {
                this.chatSocket.send(JSON.stringify({
                    ping: 'ping'
                }))
            }, 7000)
            this.chatSocket.onclose = function (e) {
                console.error('Chat socket closed unexpectedly')
                clearInterval(interval)
            }
        },
        chatClick(id) {
            this.activeChatId = id
            this.chatListToggle = false
        },
        showChatDeleteModal(id, firstName, lastName) {
            this.chatDeleteInfo.id = id
            this.chatDeleteInfo.firstName = firstName
            this.chatDeleteInfo.lastName = lastName
            this.showDeleteModal = true
        },
        async getChatList() {
            try {
                const response = await axios.get('/api/chat/')
                this.chatList = response.data
                if (response.data.length) {
                    this.activeChatId = response.data[0].id
                }
            } catch (error) {
                if (error.message = 'Network Error') {
                    this.toastStore.showToast(5000, 'Ошибка сервера', 'bg-red-500')
                } else {
                    console.log(error)
                }
            }
        },
        // async getMessages(id) {
        //     try {
        //         const response = await axios.get(`/api/chat/${id}/`)
        //         this.chatMessages = response.data
        //     } catch (error) {
        //         console.log(error)
        //     }
        // },
        async deleteChat() {
            try {
                const response = await axios.delete(`/api/chat/${this.chatDeleteInfo.id}/delete/`)
                this.getChatList()
            } catch (error) {
                console.log(error)
            }
        },
        // async sendMessage() {
        //     try {
        //         const response = await axios.post(`/api/chat/${this.activeChatId}/send/`, { body: this.messageBody })
        //         this.chatMessages.push(response.data)
        //         this.messageBody = ''
        //         this.getChatList()
        //     } catch (error) {
        //         console.log(error)
        //     }
        // },
        sendMessage() {
            this.chatSocket.send(JSON.stringify({
                body: this.messageBody
            }))
            this.messageBody = ''
        },
        newLine(e) {
            let caret = e.target.selectionStart;
            e.target.setRangeText("\n", caret, caret, "end");
            this.messageBody = e.target.value;
        }
    }
}
</script>