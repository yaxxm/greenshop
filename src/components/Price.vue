<template>
    <span class="font-bold text-rose-500">{{ priceValue }}</span>
</template>
<script setup>
    import { ref } from 'vue'
    const p = defineProps({
        value:[String,Number]
    })
    const priceValue = ref(parseFloat(p.value) == 0 ? "免费" : "￥"+p.value)
</script>