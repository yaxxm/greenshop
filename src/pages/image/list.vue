<template>
    <el-container class="bg-white rounded" :style="{ height:h + 'px' }">
      <el-header v-permission="['createImageClass,POST','uploadImage,POST']" class="c-header" >
          <el-button v-permission="['createImageClass,POST']" type="primary" size="small" @click="handleOpenCreate">新增图片分类</el-button>
          <el-button v-permission="['uploadImage,POST']" type="warning" size="small" @click="handleOpenUpload">上传图片</el-button>
      </el-header>
      <el-container>
        <el-aside width="220px" class="relative ">
            <image-aside ref="imageAsideRef" @change="handleAsideChange"></image-aside>
        </el-aside>
        <el-main class="relative ">
            <div class="c-scroll">
                <image-main ref="imageMainRef"></image-main>
            </div>
        </el-main>
      </el-container>
    </el-container>
</template>
<script setup>
    import { ref } from 'vue'
    import ImageAside from '~/components/ImageAside.vue'
    import ImageMain from '~/components/ImageMain.vue'
    // 容器高度
    const windowHeight = window.innerHeight || document.body.clientHeight
    const h = ref(windowHeight - 64 - 44 - 40)

    const imageMainRef = ref(null)

    // 选中图库
    const handleAsideChange = (image_class_id)=>{
        imageMainRef.value.loadData(image_class_id)
    }
    const handleOpenUpload = ()=>imageMainRef.value.openUpload()

    const imageAsideRef = ref(null)
    const handleOpenCreate = ()=>imageAsideRef.value.openCreate()
</script>
<style>
.c-header{
    border-bottom:1px solid #eeeeee;
    @apply flex items-center;
}
</style>