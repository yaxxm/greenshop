<template>
    <el-drawer
        v-model="showDrawer"
        :title="title"
        direction="rtl"
        :close-on-click-modal="false"
        :size="size"
        :destroy-on-close="destroyOnClose"
    >
        <div class="formDrawer">
            <div class="body" :style="{ bottom:(showActions ? '50px' : 0) }">
                <slot></slot>
            </div>
            <div class="actions" v-if="showActions">
                <el-button type="primary" @click="submit" :loading="loading">{{ confirmText }}</el-button>
                <el-button type="default" @click="close">取消</el-button>
            </div>
        </div>
    </el-drawer>
</template>
<script setup>
import { ref } from 'vue'

const props = defineProps({
    title:String,
    size:{
        type:String,
        default:"45%"
    },
    destroyOnClose:{
        type:Boolean,
        default:false
    },
    confirmText:{
        type:String,
        default:"提交"
    },
    showActions:{
        type:Boolean,
        default:true
    }
})
const emit = defineEmits(["submit"])
const showDrawer = ref(false)
// 打开表单抽屉
const open = ()=> showDrawer.value = true
// 关闭表单抽屉
const close = ()=> showDrawer.value = false


const loading = ref(false)
const showLoading = ()=> loading.value = true
const hideLoading = ()=> loading.value = false

// 提交
const submit = ()=> emit("submit")

defineExpose({ open,close,showLoading,hideLoading })

</script>
<style>
.formDrawer{
    height:100%;width:100%;position: relative;
    @apply flex flex-col;
}
.formDrawer .body{
    overflow-y:auto;position: absolute;top: 0;left: 0;right: 0;
    flex: 1;
}
.formDrawer .actions{
    height:50px;
    @apply mt-auto flex items-center;
}
</style>