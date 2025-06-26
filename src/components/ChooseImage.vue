<template>
    <template v-if="preview">
        <div v-if="modelValue">
            <el-image
                v-if="typeof modelValue == 'string'"
                class="border rounded"
                style="width: 100px; height: 100px"
                :src="modelValue"
                fit="cover"
            ></el-image>
            <div v-else class="flex flex-wrap">
                <div v-for="(url,index) in modelValue" :key="index" class="relative mx-1 mb-2" style="width:100px;height:100px;">
                    <el-icon @click="removeImage(url)" size="18" class="absolute text-shadow-lg pointer bg-white rounded-full opacity-80 z-10" style="right:5px;top:5px;"><circle-close /></el-icon>
                    <el-image
                        class="border rounded"
                        style="min-width: 100px; height: 100px;max-width:100%;"
                        :src="url"
                        fit="cover"
                        :initial-index="index"
                        :preview-src-list="modelValue"
                    ></el-image>
                </div>
            </div>
        </div>
        
        <div style="width: 100px;height: 100px;transition: all 0.3s;" class="rounded flex items-center justify-center border cursor-pointer mx-1 mb-2 border-dashed hover:bg-gray-100" @click="open()">
            <el-icon class="text-gray-400" :size="25"><plus /></el-icon>
        </div>
    </template>
    
    <el-dialog
        top="5vh"
        v-model="dialogVisible"
        title="图片选择"
        width="80%"
    >
    <el-container class="bg-white rounded border" style="height:65vh;">
      <el-container>
        <el-aside width="220px" class="relative ">
            <image-aside ref="imageAsideRef" @change="handleAsideChange"></image-aside>
        </el-aside>
        <el-main class="relative ">
            <div class="c-scroll">
                <image-main ref="imageMainRef" open-choose :limit="limit" @choose="handleChoose"></image-main>
            </div>
        </el-main>
      </el-container>
    </el-container>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="close">取消</el-button>
        <el-button type="primary" @click="submit">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script setup>
    import { ref } from 'vue'
    import ImageAside from '~/components/ImageAside.vue'
    import ImageMain from '~/components/ImageMain.vue'
    import { toast } from '~/composables/util'

    const imageMainRef = ref(null)

    // 选中图库
    const handleAsideChange = (image_class_id)=>imageMainRef.value.loadData(image_class_id)

    const dialogVisible = ref(false)
    const callbackFunction = ref(false)
    const open = (callback = false)=>{
        callbackFunction.value = callback
        dialogVisible.value = true
    }
    const close = ()=>{
        dialogVisible.value = false
        callbackFunction.value = false
    }

    const props = defineProps({
        modelValue:[String,Array],
        limit:{
            type:Number,
            default:1
        },
        preview:{
            type:Boolean,
            default:true
        }
    })

    let urls = []
    const handleChoose = (e)=> urls = e.map(o=>o.url)
    const emit = defineEmits(["update:modelValue"])
    const submit = ()=>{
        if(urls.length < 1){
            return toast(`至少需要选择 1 张`,"error")
        }
        const value = props.limit == 1 ? urls[0] : [...urls]
        emit("update:modelValue",value)

        if(!props.preview && typeof callbackFunction.value == "function"){
            callbackFunction.value(value)
        }

        close()
    }

    const removeImage = (url)=> emit("update:modelValue",props.modelValue.filter(u => u != url))

    defineExpose({ open })
</script>
<style>
.c-header{
    border-bottom:1px solid #eeeeee;
    @apply flex items-center;
}
</style>