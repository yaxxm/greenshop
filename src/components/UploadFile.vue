<template>
    <el-upload
        class="w-100"
        drag
        :action="action"
        :multiple="multiple"
        :headers="{ token }"
        :data="data"
        :name="name"
        :on-success="uploadSuccess"
        :on-error="uploadError">
            <el-icon class="el-icon--upload"><upload-filled /></el-icon>
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                <template #tip>
                <div class="el-upload__tip"><slot></slot></div>
                </template>
    </el-upload>
</template>
<script setup>
    import { ref } from 'vue'
    import { getToken } from '~/composables/auth'
    import { toast } from '~/composables/util'
    const token = ref(getToken())
    // 上传地址
    const action = "/api/admin/image/upload"
    defineProps({
        data:Object,
        name:{
            type:String,
            default:"img"
        },
        multiple:{
            type:Boolean,
            default:true
        },
    })

    const emit = defineEmits(["success"])
    
    const uploadSuccess = (response, file, fileList)=>{
        emit("success",{
            response, file, fileList
        })
    }
    const uploadError = (response, file, fileList)=>{
        let msg = response.message ? (JSON.parse(response.message)).msg : "上传失败"
        toast(msg,"error")
    }
</script>