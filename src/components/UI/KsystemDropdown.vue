<template>
    <Menu as="div" class="relative inline-block text-left">
        <div>
            <MenuButton>
                <slot name="drop-button">
                    <button class="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                        Options
                        <ChevronDownIcon class="-mr-1 h-5 w-5 text-gray-400" aria-hidden="true" />
                    </button>
                </slot>                
            </MenuButton>
        </div>

        <transition enter-active-class="transition ease-out duration-100" enter-from-class="transform opacity-0 scale-95"
            enter-to-class="transform opacity-100 scale-100" leave-active-class="transition ease-in duration-75"
            leave-from-class="transform opacity-100 scale-100" leave-to-class="transform opacity-0 scale-95">
            <MenuItems :class="position ? position : 'right-0'"
                class="absolute w-40 z-10 mt-2 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div v-if="links.length">
                    <div v-for="link in links" :key="link.name" class="py-1">
                        <MenuItem v-slot="{ active }">
                        <RouterLink :to="{name: link.name, params: link.params ? link.params : {}}"
                            :class="[active ? 'bg-gray-100 text-gray-900' : 'text-gray-700', 'block px-4 py-2 text-sm']">{{ link.title }}</RouterLink>
                        </MenuItem>
                    </div>
                </div>
                <div v-if="buttons.length">
                    <div v-for="button in buttons" :key="button.name" class="py-1">
                        <MenuItem v-slot="{ active }">
                        <li @click="button.action"
                            :class="[active ? 'bg-gray-100 text-gray-900 cursor-pointer' : 'text-gray-700', 'block px-4 py-2 text-sm']">{{ button.name }}</li>
                        </MenuItem>
                    </div>
                </div>
            </MenuItems>
        </transition>
    </Menu>
</template>
  
<script setup>
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/vue'
import { ChevronDownIcon } from '@heroicons/vue/20/solid'
import { RouterLink } from 'vue-router';
</script>

<script>
export default {
    name: 'KsystemDropdown',
    props: {
        links: {
            type: Array,
            default: []
        },
        buttons: {
            type: Array,
            default: []
        },
        position: {
            type: String,
            default: '',
        },

    }
}
</script>