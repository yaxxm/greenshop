<template>
    <el-card shadow="never" class="border-0">
        <!-- 新增,批量删除 | 刷新,列设置,导出 -->
        <list-header 
        :permissions="{
            create:'createSkus,POST',
            delete:'deleteSkus,POST',
            refresh:'getSkusList,GET'
        }"
        @create="handleCreate"
        @refresh="getData"
        @delete="handleDelete(true)"
        ></list-header>

        <!-- 表格 -->
        <el-table
        id="list-table" 
        ref="multipleTableRef" 
        @selection-change="handleSelectionChange" 
        :data="tableData" 
        style="width: 100%" 
        stripe
        lazy>
            <el-table-column fixed="left" type="selection" width="55" />
            <el-table-column prop="name" label="规格名称" width="150" />
            <el-table-column prop="default" label="规格值" width="250" />
            <el-table-column prop="order" label="排序" width="120" align="center"/>
            <el-table-column prop="status" label="状态" width="120" align="center"
            v-permission="['updateSkusStatus,POST']">
                <template #default="{ row }">
                    <el-switch @change="handleStatusChange($event,row)" :active-value="1" :inactive-value="0" :model-value="row.status"
                    :loading="row.statusLoading" />
                </template>
            </el-table-column>
            <el-table-column label="操作" min-width="180" align="right" v-permission="['updateSkus,POST','deleteSkus,POST']">
                <template #default="{ row }">
                    <el-button 
                    v-permission="['updateSkus,POST']"
                    type="text" size="small" @click="handleEdit(row)" >修改</el-button>
                    <el-popconfirm title="是否要删除该记录？" @confirm="handleDelete(row.id)" confirm-button-text="是" cancel-button-text="否">
                        <template #reference>
                            <el-button 
                            v-permission="['deleteSkus,POST']" 
                            type="text" size="small">删除</el-button>
                        </template>
                    </el-popconfirm>
                </template>
            </el-table-column>
        </el-table>

        <!-- 分页 -->
        <div class="mt-5 flex justify-center">
            <el-pagination 
            :currentPage="currentPage" 
            background 
            layout="prev, pager, next" 
            :page-size="limit" 
            :total="total" 
            @current-change="getData"></el-pagination>
        </div>

        <!-- 新增|修改表单 -->
        <form-drawer 
        ref="formDrawerRef" 
        :title="drawerTitle" 
        @submit="handleSubmit">
            <el-form :model="form" ref="formRef" :rules="rules" label-width="80px" :inline="false" size="default">
                <el-form-item label="规格名称" prop="name">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="排序" prop="order">
                    <el-input-number v-model="form.order" :min="0" :max="1000"/>
                </el-form-item>
                <el-form-item label="状态" prop="status">
                    <el-switch v-model="form.status" :active-value="1" :inactive-value="0"></el-switch>
                </el-form-item>
                <el-form-item label="规格值" prop="default">
                    <tag-input v-model="form.default"></tag-input>
                </el-form-item>
            </el-form>
        </form-drawer>

    </el-card>
</template>
<script setup>
    import ListHeader from '~/components/ListHeader.vue'
    import FormDrawer from '~/components/FormDrawer.vue'
    import TagInput from '~/components/TagInput.vue'
    import { useInitTable,useInitForm } from '~/composables/useCommon'
    import { 
        createSkus,
        updateSkus,
        getSkusList,
        updateSkusStatus,
        deleteSkus 
    } from '~/api/skus'


    // 初始化表格数据
    const {
        // 表格
        multipleTableRef,
        // 分页
        currentPage,
        limit,
        total,
        // 表格数据
        tableData,
        // 获取数据方法
        getData,
        // 多选相关
        multipleSelection,
        multipleSelectionIds,
        handleSelectionChange,
        handleDelete,
        handleStatusChange
    } = useInitTable({
        // 获取数据的方法
        getList:getSkusList,
        // 获取数据成功之后的回调
        success:(res)=>{
            total.value = res.totalCount
            tableData.value = res.list.map(o=>{
                o.statusLoading = false
                return o
            })
        },
        // 删除/批量删除api
        deleteData:deleteSkus,
        // 修改状态api
        updateStatus:updateSkusStatus,
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
            default: "",
            name: "",
            order: 100,
            status: 1,
        },
        // 表单验证规则
        rules:{
            name: [
            {
                required: true,
                message: '规格名称必填',
                trigger: 'blur',
            }
            ],
            default:[
                {
                    required: true,
                    message: '规格值必填',
                    trigger: 'blur',
                }
            ]
        },
        // 获取数据方法
        getData,
        // 新增数据api
        createData:createSkus,
        // 修改数据api
        updateData:updateSkus,
    })

</script>

<style>

</style>