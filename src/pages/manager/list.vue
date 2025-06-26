<template>
    <el-card shadow="never" class="border-0">
        <!-- 搜索 -->
        <search-header :model="searchForm" @search="getData" @reset="resetSearchForm">
            <search-header-item label="关键词" prop="keyword">
                <el-input v-model="searchForm.keyword" placeholder="管理员昵称" clearable></el-input>
            </search-header-item>
        </search-header>

        <!-- 新增,批量删除 | 刷新,列设置,导出 -->
        <list-header :permissions="{
            create: 'createManager,POST',
            refresh: 'getManagerList,GET'
        }" @create="handleCreate" @refresh="getData"></list-header>

        <!-- 表格 -->
        <el-table id="list-table" :data="tableData" style="width: 100%" stripe lazy>
            <el-table-column label="管理员" width="280">
                <template #default="{ row }">
                    <div class="flex items-center">
                        <el-avatar :size="40" :src="row.avatar">
                            <img src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png" />
                        </el-avatar>
                        <div class="ml-3">
                            <h6 class="text-sm font-medium">{{ row.username }}</h6>
                            <small>ID：{{ row.id }}</small>
                        </div>
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="所属管理员" align="center">
                <template #default="{ row }">
                    {{ row.role ? row.role.name : '-' }}
                </template>
            </el-table-column>
            <el-table-column v-permission="['updateManagerStatus,POST']" prop="status" label="状态" width="120"
                align="center">
                <template #default="{ row }">
                    <el-switch @change="handleStatusChange($event, row)" :active-value="1" :inactive-value="0"
                        :model-value="row.status" :loading="row.statusLoading" :disabled="!!row.super" />
                </template>
            </el-table-column>
            <el-table-column v-permission="['updateManager,POST', 'deleteManager,POST']" label="操作" min-width="180"
                align="right">
                <template #default="{ row }">
                    <small v-if="row.super" class="text-sm text-gray-500">暂无操作</small>
                    <div v-else>

                        <el-button v-permission="['updateManager,POST']" type="text" size="small"
                            @click="handleEdit(row)">修改</el-button>

                        <el-popconfirm title="是否要删除该记录？" @confirm="handleDelete(row.id)" confirm-button-text="是"
                            cancel-button-text="否">
                            <template #reference>
                                <el-button v-permission="['deleteManager,POST']" type="text" size="small">删除</el-button>
                            </template>
                        </el-popconfirm>

                    </div>
                </template>
            </el-table-column>
        </el-table>

        <!-- 分页 -->
        <div class="mt-5 flex justify-center">
            <el-pagination :currentPage="currentPage" background layout="prev, pager, next" :page-size="limit"
                :total="total" @current-change="getData"></el-pagination>
        </div>

        <!-- 新增|修改表单 -->
        <form-drawer ref="formDrawerRef" :title="drawerTitle" @submit="handleSubmit">
            <el-form :model="form" ref="formRef" :rules="rules" label-width="80px" :inline="false" size="default">
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="form.username"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input v-model="form.password"></el-input>
                </el-form-item>
                <el-form-item label="头像" prop="avatar">
                    <choose-image :limit="1" v-model="form.avatar"></choose-image>
                </el-form-item>
                <el-form-item label="所属管理员" prop="role_id">
                    <el-select v-model="form.role_id" placeholder="请选择所属管理员">
                        <el-option v-for="item in roles" :key="item.id" :label="item.name" :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="状态" prop="status">
                    <el-switch v-model="form.status" :active-value="1" :inactive-value="0"></el-switch>
                </el-form-item>
            </el-form>
        </form-drawer>

    </el-card>
</template>
<script setup>
import { ref } from 'vue'
import SearchHeader from '~/components/SearchHeader.vue'
import SearchHeaderItem from '~/components/SearchHeaderItem.vue'
import ListHeader from '~/components/ListHeader.vue'
import FormDrawer from '~/components/FormDrawer.vue'
import ChooseImage from '~/components/ChooseImage.vue'
import { useInitTable, useInitForm } from '~/composables/useCommon'
import {
    createManager,
    updateManager,
    getManagerList,
    updateManagerStatus,
    deleteManager
} from '~/api/manager'

const roles = ref([])

// 初始化表格数据
const {
    // 搜索
    searchForm,
    resetSearchForm,
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
    // 搜索表单
    searchForm: {
        keyword: "",
        user_level_id: null
    },
    // 获取数据的方法
    getList: getManagerList,
    // 获取数据成功之后的回调
    success: (res) => {
        total.value = res.totalCount
        tableData.value = res.list.map(o => {
            o.statusLoading = false
            return o
        })
        roles.value = res.roles
    },
    // 删除/批量删除api
    deleteData: deleteManager,
    // 修改状态api
    updateStatus: updateManagerStatus,
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
    form: {
        id: null,
        username: "",
        password: "",
        avatar: "",
        role_id: "",
        status: 1
    },
    // 表单验证规则
    rules: {},
    // 获取数据方法
    getData,
    // 新增数据api
    createData: createManager,
    // 修改数据api
    updateData: updateManager,
})

</script>

<style>
</style>