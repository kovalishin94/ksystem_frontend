<template>
    <header>
        <Navbar />
    </header>
    <RouterView />
    <KsystemToast />
</template>

<script>
import axios from 'axios'

import { useUserStore } from '@/stores/user'

import Navbar from '@/components/Navbar.vue'
import KsystemToast from '@/components/KsystemToast.vue'

export default {
    setup() {
        const userStore = useUserStore()


        return {
            userStore
        }
    },

    components: { Navbar, KsystemToast },

    beforeCreate() {
        this.userStore.initUser()
    },
}
</script>