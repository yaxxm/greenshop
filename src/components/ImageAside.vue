<template>
    <div class="image-aside flex flex-col">
        <div class="flex-1" id="list-table" style="overflow-y:auto;">
            <div class="aside-list" :class="{ 'active':activeId == item.id }" v-for="item in tableData" :key="item.id" @click="handleChangeActiveId(item.id)">
                <span class="truncate" :title="item.name">{{ item.name }}</span> 
                <el-button v-permission="['updateImageClass,POST']" class="ml-auto" type="text" size="small" @click="handleEdit(item)">
                    <el-icon :size="16"><edit /></el-icon>
                </el-button>
                <el-popconfirm title="是否要删除该分类？" confirm-button-text="确定" cancel-button-text="取消" @confirm="handleDelete(item.id)">
                    <template #reference>
                        <el-button v-permission="['deleteImageClass,POST']" type="text" size="small">
                            <el-icon :size="16"><close /></el-icon>
                        </el-button>
                    </template>
                </el-popconfirm>
            </div>
        </div>
        <div class="flex items-center justify-center" style="height:50px;">
            <el-pagination 
            :currentPage="currentPage" 
            background 
            layout="prev, next" 
            :page-size="limit" 
            :total="total" 
            @current-change="getData"></el-pagination>
        </div>
    </div>


    <!-- 新增|修改表单 -->
    <form-drawer 
    ref="formDrawerRef" 
    :title="drawerTitle" 
    @submit="handleSubmit">
        <el-form :model="form" ref="formRef" :rules="rules" label-width="80px" :inline="false" size="default">
            <el-form-item label="相册名称" prop="name">
                <el-input v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item label="排序" prop="order">
                <el-input-number v-model="form.order" :min="0" :max="1000"/>
            </el-form-item>
        </el-form>
    </form-drawer>

</template>
<script setup>
    import { ref } from 'vue'
    import FormDrawer from '~/components/FormDrawer.vue'
    import { useInitTable,useInitForm } from '~/composables/useCommon'
    import { 
        createImageClass,
        updateImageClass,
        getImageClassList,
        deleteImageClass
    } from '~/api/image_class'

    // 初始化表格数据
    const {
        // 分页
        currentPage,
        limit,
        total,
        // 表格数据
        tableData,
        // 获取数据方法
        getData,
        // 删除
        handleDelete,
    } = useInitTable({
        // 获取数据的方法
        getList:getImageClassList,
        success:(res)=>{
            total.value = res.totalCount
            tableData.value = res.list
            const item = tableData.value[0]
            if(item){
                handleChangeActiveId(item.id)
            }
        },
        // 删除/批量删除api
        deleteData:deleteImageClass,
    })


    // 初始化表格
    const {
        drawerTitle,
        form,
        formRef,
        rules,
        formDrawerRef,
        handleSubmit,
        handleCreate,
        handleEdit
    } = useInitForm({
        // 表单初始数据
        form:{
            id: null,
            name:"",
            order:50
        },
        // 表单验证规则
        rules:{},
        // 获取数据方法
        getData,
        // 新增数据api
        createData:createImageClass,
        // 修改数据api
        updateData:updateImageClass,
    })

    // 选中图库分类id
    const activeId = ref(0)
    const emit = defineEmits(["change"])
    function handleChangeActiveId(id){
        activeId.value = id
        emit("change",id)
    }

    defineExpose({
        openCreate:handleCreate
    })

</script>
<style scoped>
.image-aside{
    position:absolute;
    top:0;
    left:0;
    right:0;
    bottom:0;
    border-right:1px solid #eeeeee;
}
.aside-list{
    border-bottom: 1px solid #f4f4f4;
    cursor: pointer;
    @apply flex items-center p-3 text-sm text-gray-600;
}
.aside-list:hover,.active{
    @apply bg-blue-50;
}
</style>