<template>
    <el-col :span="span" :offset="0">
        <el-form-item :label="label" :prop="prop">
            <slot></slot>
        </el-form-item>
    </el-col>
</template>
<script setup>
defineProps({
    label:String,
    prop:String,
    span:{
        type:Number,
        default:8
    }
})
</script>