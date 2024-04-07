<template>
  <!-- <div class="h-screen flex flex-col justify-center text-center text-9xl">
    MAIN
  </div> -->
</template>

<script>
import { useUserStore } from '@/stores/user'

export default {
  beforeCreate() {
    this.$router.push({ name: 'chatgpt' })
  }
}

</script>