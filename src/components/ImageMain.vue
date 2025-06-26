<template>
    <div class="image-main flex flex-col" v-loading="loading">
        <div class="flex-1 p-3" style="overflow-y:auto;">
            <el-empty v-if="tableData.length == 0 && !loading" description="暂无图片"></el-empty>
            <el-row :gutter="20">
                <el-col class="mb-3" :md="6" :sm="12" :span="24" :offset="0" v-for="item in tableData" :key="item.id">

                    <el-card shadow="hover" :body-style="{ padding: '0px' }" style="position:relative;" :class="{ 'border-blue-500' : item.checked }">
                        <el-image
                            style="width: 100%; height: 150px"
                            :src="item.url"
                            fit="cover"
                            :initial-index="0"
                            :preview-src-list="[item.url]"
                        ></el-image>
                        <div class="image-title">
                            {{ item.name }}
                        </div>

                        <div v-permission="['updateImage,POST','deleteImage,POST']" class="flex items-center justify-center p-2">
                            <el-checkbox v-if="openChoose" v-model="item.checked" @change="handleChooseChange(item)"></el-checkbox>

                            <el-button v-permission="['updateImage,POST']" class="ml-3" type="text" size="small" @click="handleEdit(item)">重命名</el-button>

                            <el-popconfirm title="是否要删除该图片？" confirm-button-text="确定" cancel-button-text="取消" @confirm="handleDelete(item.id)">
                                <template #reference>
                                    <el-button v-permission="['deleteImage,POST']" type="text" size="small">
                                        删除
                                    </el-button>
                                </template>
                            </el-popconfirm>
                        </div>
                    </el-card>
                    
                </el-col>
            </el-row>
        </div>
        <div class="flex items-center justify-center" style="height:50px;">
            <el-pagination 
            :currentPage="currentPage" 
            background 
            layout="prev, pager, next"
            :page-size="limit" 
            :total="total" 
            @current-change="getData"></el-pagination>
        </div>
    </div>

    <!-- 新增|修改表单 -->
    <el-drawer v-model="drawer" title="上传图片">
        <upload-file 
        :data="{ image_class_id:searchForm.image_class_id }" @success="handleUploadSuccess">
            只能上传jpg/png文件，且不超过500kb
        </upload-file>
    </el-drawer>


</template>
<script setup>
    import { onMounted, reactive, ref,computed } from 'vue'
    import UploadFile from '~/components/UploadFile.vue'
    import {
        toast,
        showFullLoading,
        hideFullLoading,
        showPrompt
    } from '~/composables/util.js'
    import { 
        updateImage,
        getImageList,
        deleteImage
    } from '~/api/image'

    // 分页参数
    const currentPage = ref(1)
    const limit = ref(10)
    const total = ref(1000)

    const loading = ref(true)
    const showLoading = ()=>loading.value = true
    const hideLoading = ()=>loading.value = false

    const tableData = ref([])

    const searchForm = reactive({
        image_class_id:0
    })

    // 获取表格数据
    function getData(page = false) {
        if (typeof page == "number") currentPage.value = page
        tableData.value = []

        // 开启loading
        showLoading()
        getImageList(currentPage.value, searchForm).then((res) => {
            total.value = res.totalCount
            tableData.value = res.list.map(o=>{
                o.checked = false
                return o
            })
        }).finally(() => hideLoading())
    }

    const loadData = (id)=>{
        currentPage.value = 1
        searchForm.image_class_id = id
        getData()
    }

    const handleDelete = (id)=>{
        showFullLoading()
        deleteImage([id]).then(res => {
            toast("删除成功")
            getData()
        }).finally(() => hideFullLoading())
    }

    const handleEdit = (item)=>{
        showPrompt("重命名",item.name).then(({ value })=>{
            showLoading()
            updateImage(item.id,{ name:value })
            .then(res => {
                toast("重命名成功")
                getData()
            })
            .finally(() => hideLoading())
        })
    }

    const drawer = ref(false)
    const openUpload = ()=>drawer.value = true
    const handleUploadSuccess = (e)=>getData()

    const props = defineProps({
        openChoose:{
            type:Boolean,
            default:false
        },
        limit:{
            type:Number,
            default:1
        }
    })

    const emit = defineEmits(["choose"])

    const checkedImages = computed(()=>tableData.value.filter(o=>o.checked))
    const handleChooseChange = (item)=>{
        if(item.checked && checkedImages.value.length > props.limit){
            item.checked = false
            return toast(`最多只能选中${props.limit}张`,"error")
        }
        emit("choose",checkedImages.value)
    }

    defineExpose({ loadData,openUpload })
</script>
<style scoped>
.image-main{
    position:absolute;
    top:0;
    left:0;
    right:0;
    bottom:0;
}
.image-title{
    @apply bg-gray-800 absolute py-1 px-2 text-sm truncate  text-gray-100 bg-opacity-50;
    top:122px;left:-1px;right:-1px;
}
</style>