<template>
    <span class="line-through text-xs font-thin ml-2">￥{{ value }}</span>
</template>
<script setup>
    defineProps({
        value:[String,Number]
    })
</script>