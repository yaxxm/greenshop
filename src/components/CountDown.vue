<template>
    <span>
        {{ d.days }} 天 {{ d.hours }}:{{ d.minutes }}:{{d.seconds}}
    </span>
</template>
<script setup>
import { ref,computed,onMounted } from 'vue'
function formatDiffDate(seconds) {
    let time = {
        days:0,
        hours:0,
        minutes:0,
        seconds:0
    };

    if(seconds > 0){
        time.days = Math.floor(seconds / (60 * 60 * 24));
        time.hours = Math.floor(seconds / (60 * 60)) - time.days * 24;
        time.minutes = Math.floor(seconds / 60) - time.days * 24 * 60 - time.hours * 60;
        time.seconds = Math.floor(seconds) - time.days * 24 * 60 * 60 - time.hours * 60 * 60 - time.minutes * 60;
    }

    //手动三元补零
    time.days = time.days < 10 ? "0" + time.days : time.days;
    time.hours = time.hours < 10 ? "0" + time.hours : time.hours;
    time.minutes = time.minutes < 10 ? "0" + time.minutes : time.minutes;
    time.seconds = time.seconds < 10 ? "0" + time.seconds : time.seconds;

    return time
}

const props = defineProps({
    time:{
        type:[String,Number],
        default:""
    }
})
const emit = defineEmits(['end','start'])

const timeout = ref(0)
const T = ref(null)
const d = computed(()=>formatDiffDate(timeout.value))

function init(){
    let end_time = typeof props.time == 'string' ? (new Date(props.time)).getTime() : props.time
    timeout.value = (end_time -  Date.now())/1000
    start()
}

function close(){
    if(T.value){
        clearInterval(T.value)
    }
}

function start(){ 
    close()
    if(timeout.value <= 0){
        return emit('end')
    }
    emit('start')
    T.value = setInterval(() => {
        timeout.value --
        if(timeout.value <= 0){
            close()
            emit('end')
        }
    }, 1000);
}

onMounted(()=>{
    init()
})

</script>