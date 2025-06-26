<template>
    {{ d.tweenedNumber.toFixed(0) }}
</template>
<script setup>
import { reactive,watch } from "vue"
import gsap from "gsap"

const props = defineProps({
    value:{
        type:Number,
        default:0
    }
})

const d = reactive({
    tweenedNumber:0
})
gsap.to(d, { duration: 0.5, tweenedNumber: props.value })
watch(()=>props.value,(newValue)=> {
    gsap.to(d, { duration: 0.5, tweenedNumber: newValue })
})
</script>