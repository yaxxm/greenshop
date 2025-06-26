<template>
    <el-card shadow="never" class="border-0">
        <!-- 新增,批量删除 | 刷新,列设置,导出 -->
        <list-header 
        :permissions="{
            create:'createUserLevel,POST',
            refresh:'getUserLevelList,GET'
        }"
        @create="handleCreate"
        @refresh="getData"
        ></list-header>

        <!-- 表格 -->
        <el-table
        id="list-table" 
        :data="tableData" 
        style="width: 100%" 
        stripe
        lazy>
            <el-table-column align="center" label="会员等级" prop="name"></el-table-column>
            <el-table-column prop="discount" align="center" label="折扣率(%)"></el-table-column>
            <el-table-column prop="level" align="center" label="等级序号"></el-table-column>
            <el-table-column v-permission="['updateUserLevelStatus,POST']" 
            prop="status" label="状态" width="120" align="center">
                <template #default="{ row }">
                    <el-switch @change="handleStatusChange($event,row)" :active-value="1" :inactive-value="0" :model-value="row.status"
                    :loading="row.statusLoading" />
                </template>
            </el-table-column>
            <el-table-column  v-permission="['updateUserLevel,POST','deleteUserLevel,POST']" fixed="right" label="操作" width="180" align="center">
                <template #default="{ row }">
                    <el-button v-permission="['updateUserLevel,POST']" type="text" size="small" @click="handleEdit(row)">修改</el-button>
                    <el-popconfirm title="是否要删除该记录？" @confirm="handleDelete(row.id)" confirm-button-text="是" cancel-button-text="否">
                        <template #reference>
                            <el-button v-permission="['deleteUserLevel,POST']" type="text" size="small">删除</el-button>
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

                <el-form-item label="等级名称" prop="name">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="等级权重" prop="level">
                    <el-input type="number" v-model="form.level" style="width: 50%;"></el-input>
                </el-form-item>
                <el-form-item label="是否启用" prop="status">
                    <el-switch v-model="form.status" :active-value="1" :inactive-value="0"></el-switch>
                </el-form-item>
                <el-form-item label="升级条件">
                    <div class="mb-2">
                        <small class="text-xs mr-2">累计消费满</small>
                        <el-input type="number" v-model="form.max_price" placeholder="累计消费" size="small" style="width: 50%;">
                            <template #append>元</template>
                        </el-input>
                        <small class="text-xs flex text-gray-400">
                            设置会员等级所需要的累计消费必须大于等于0,单位：元
                        </small>
                    </div>
                    <div>
                        <small class="text-xs mr-2">累计次数满</small>
                        <el-input type="number" v-model="form.max_times" placeholder="累计次数" size="small" style="width: 50%;">
                            <template #append>次</template>
                        </el-input>
                        <small class="text-xs flex text-gray-400">
                            设置会员等级所需要的购买量必须大于等于0,单位：笔
                        </small>
                    </div>
                </el-form-item>
                <el-form-item label="折扣率(%)">
                    <el-input size='small' type="number" v-model="form.discount" placeholder="折扣率" style="width: 50%;">
                        <template #append>%</template>
                    </el-input>
                    <small class="text-gray-400 leading-tight flex">
                        折扣率单位为百分比，如输入90，表示该会员等级的用户可以以商品原价的90%购买
                    </small>
                </el-form-item>
            </el-form>
        </form-drawer>

    </el-card>
</template>
<script setup>
    import ListHeader from '~/components/ListHeader.vue'
    import FormDrawer from '~/components/FormDrawer.vue'
    import { useInitTable,useInitForm } from '~/composables/useCommon'
    import { 
        createUserLevel,
        updateUserLevel,
        getUserLevelList,
        updateUserLevelStatus,
        deleteUserLevel
    } from '~/api/user_level'


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
        // 修改状态
        handleStatusChange
    } = useInitTable({
        // 获取数据的方法
        getList:getUserLevelList,
        // 获取数据成功之后的回调
        success:(res)=>{
            total.value = res.totalCount
            tableData.value = res.list.map(o=>{
                o.statusLoading = false
                return o
            })
        },
        // 删除/批量删除api
        deleteData:deleteUserLevel,
        // 修改状态api
        updateStatus:updateUserLevelStatus,
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
            max_price:0,
            max_times:0,
            discount:0,
            level:0,
            status:1,
        },
        // 表单验证规则
        rules:{},
        // 获取数据方法
        getData,
        // 新增数据api
        createData:createUserLevel,
        // 修改数据api
        updateData:updateUserLevel,
    })


</script>

<style>

</style>