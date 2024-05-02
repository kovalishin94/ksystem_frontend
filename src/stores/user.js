import { defineStore } from 'pinia'
import axios from 'axios'
import { useRouter } from 'vue-router'


export const useUserStore = defineStore('user', {
    state: () => ({
        router: useRouter(),
        user: {
            isAuthenticated: false,
            id: null,
            username: null,
            accessToken: null,
            refreshToken: null,
            profile: {
                permissions: []
            },
        }
    }),
    actions: {
        refreshToken() {
            axios.post('/api/token/refresh/', { refresh: this.user.refreshToken })
                .then(response => {
                    this.user.accessToken = response.data.access
                    localStorage.setItem('user.accessToken', response.data.access)
                    axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.user.accessToken
                    this.router.go()
                })
                .catch(error => {
                    this.removeUserData()
                })
        },
        initUser() {
            if (localStorage.getItem('user.accessToken')) {
                this.user.isAuthenticated = true
                this.user.id = localStorage.getItem('user.id')
                this.user.username = localStorage.getItem('user.username')
                this.user.accessToken = localStorage.getItem('user.accessToken')
                this.user.refreshToken = localStorage.getItem('user.refreshToken')
                this.user.profile = JSON.parse(localStorage.getItem('user.profile'))

                axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.user.accessToken
            }
        },
        removeUserData() {
            this.user.isAuthenticated = false
            this.user.id = null
            this.user.username = null
            this.user.accessToken = null
            this.user.refreshToken = null
            this.user.profile = {
                permissions: []
            }

            localStorage.setItem('user.id', '')
            localStorage.setItem('user.username', '')
            localStorage.setItem('user.accessToken', '')
            localStorage.setItem('user.refreshToken', '')
            localStorage.setItem('user.profile', '')

            axios.defaults.headers.common['Authorization'] = ''
            this.router.push({ name: 'auth' })
        },
        async getMe() {
            try {
                const response = await axios.get('/api/me/')
                localStorage.setItem('user.id', response.data.id)
                localStorage.setItem('user.username', response.data.username)
                localStorage.setItem('user.profile', JSON.stringify(response.data.profile))
                this.user.id = response.data.id
                this.user.username = response.data.username
                this.user.profile = response.data.profile
            } catch (error) {
                this.refreshToken()
            }
        },
        setTokens(data) {
            localStorage.setItem('user.accessToken', data.access)
            localStorage.setItem('user.refreshToken', data.refresh)
            this.user.accessToken = data.access
            this.user.refreshToken = data.refresh

            this.getMe()
        },
    }
})