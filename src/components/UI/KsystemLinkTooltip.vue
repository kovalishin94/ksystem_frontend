<template>
    <RouterLink :to="to" :data-tooltip-target="id" :class="class">
        <slot></slot>
    </RouterLink>

    <div :id="id" role="tooltip"
        class="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip">
        {{ tooltip }}
        <div class="tooltip-arrow" data-popper-arrow></div>
    </div>
</template>

<script>
export default {
    name: 'KsystemLinkTooltip',
    props: {
        tooltip: {
            type: String,
            default: 'Default tooltip'
        },
        to: {
            type: Object,
            required: true
        },
        class: {
            type: String,
            default: ''
        },
        id: {
            type: String,
            required: true
        }
    }
}
</script>