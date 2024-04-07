<template>
    <div class="flex min-w-0 py-3 px-6 rounded-lg justify-between">
        <div class="flex">
            <img v-if="userPhoto" class="h-12 w-12 flex-none rounded-full bg-gray-50 object-cover" alt="" :src="userPhoto">
            <svg class="h-12 w-12 flex-none rounded-full bg-gray-50 object-cover" data-slot="icon" aria-hidden="true"
                fill="none" stroke-width="1.5" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"
                v-else>
                <path
                    d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                    stroke-linecap="round" stroke-linejoin="round"></path>
            </svg>
            <p class="ml-2 text-sm font-semibold leading-6 text-gray-900 self-center">
                {{ firstName }} {{ lastName }}
            </p>
        </div>
        <ksystem-dropdown @click.stop :buttons="[{ name: 'Удалить', action: deleteChat }]" class="self-center">
            <template v-slot:drop-button>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                    stroke="currentColor" class="w-6 h-6">
                    <path stroke-linecap="round" stroke-linejoin="round"
                        d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z" />
                </svg>
            </template>
        </ksystem-dropdown>
    </div>
</template>

<script>
export default {
    name: 'ChatListItem',
    props: {
        firstName: {
            type: String
        },
        lastName: {
            type: String
        },
        userPhoto: {
            type: String,
            default: ''
        },
    },
    methods: {
        deleteChat() {
            this.$emit('deleteChat')
        }
    }
}
</script>