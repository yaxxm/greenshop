<template>
    <el-card shadow="never" class="border-0">
        <!-- 搜索 -->
        <search-header :model="searchForm" @search="getData" @reset="resetSearchForm">
            <search-header-item label="关键词" prop="keyword">
                <el-input v-model="searchForm.keyword" placeholder="手机号/邮箱/会员昵称" clearable></el-input>
            </search-header-item>
            <template #show>
                <search-header-item label="会员等级" prop="user_level_id">
                    <el-select v-model="searchForm.user_level_id" placeholder="请选择会员等级" clearable>
                        <el-option
                        v-for="item in user_level_list"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                        >
                        </el-option>
                    </el-select>
                </search-header-item>
            </template>
        </search-header>

        <!-- 新增,批量删除 | 刷新,列设置,导出 -->
        <list-header 
        :permissions="{
            create:'createUser,POST',
            refresh:'getUserList,GET'
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
            <el-table-column label="会员" width="280">
                <template #default="{ row }">
                    <div class="flex items-center">
                        <el-avatar :size="40" :src="row.avatar"></el-avatar>
                        <div class="ml-3">
                            <h6 class="text-sm font-medium">{{row.username}}</h6>
                            <small>ID：{{row.id}}</small>
                        </div>
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="会员等级" align="center">
                <template #default="{ row }">
                    {{row.user_level ? row.user_level.name : '-'}}
                </template>
            </el-table-column>
            <el-table-column label="登录注册" align="center" width="250">
                <template #default="{ row }">
                    <div class="text-sm">注册时间 : {{row.create_time}}</div>
                    <div class="text-sm" v-if="row.last_login_time">最后登录 : {{row.last_login_time}}</div>
                </template>
            </el-table-column>
            <el-table-column v-permission="['updateUserStatus,POST']" 
            prop="status" label="状态" width="120" align="center">
                <template #default="{ row }">
                    <el-switch @change="handleStatusChange($event,row)" :active-value="1" :inactive-value="0" :model-value="row.status"
                    :loading="row.statusLoading" />
                </template>
            </el-table-column>
            <el-table-column v-permission="['updateUser,POST','deleteUser,POST']" fixed="right" label="操作" width="180" align="center">
                <template #default="{ row }">

                    <el-button v-permission="['updateUser,POST']" 
                    type="text" size="small" @click="handleEdit(row)">修改</el-button>

                    <el-popconfirm title="是否要删除该记录？" @confirm="handleDelete(row.id)" confirm-button-text="是" cancel-button-text="否">
                        <template #reference>
                            <el-button v-permission="['deleteUser,POST']"  type="text" size="small">删除</el-button>
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
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="form.username"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input v-model="form.password"></el-input>
                </el-form-item>
                <el-form-item label="昵称" prop="nickname">
                    <el-input v-model="form.nickname"></el-input>
                </el-form-item>
                <el-form-item label="头像" prop="avatar">
                    <choose-image :limit="1" v-model="form.avatar"></choose-image>
                </el-form-item>
                <el-form-item label="会员等级" prop="user_level_id">
                    <el-select v-model="form.user_level_id" placeholder="请选择会员等级">
                        <el-option
                        v-for="item in user_level_list"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                        >
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="手机" prop="phone">
                    <el-input v-model="form.phone"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="form.email"></el-input>
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
    import { useInitTable,useInitForm } from '~/composables/useCommon'
    import { 
        createUser,
        updateUser,
        getUserList,
        updateUserStatus,
        deleteUser
    } from '~/api/user'
    import { 
        getUserLevelList
    } from '~/api/user_level'

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
            keyword:"",
            user_level_id:null
        },
        // 获取数据的方法
        getList:getUserList,
        // 获取数据成功之后的回调
        success:(res)=>{
            total.value = res.totalCount
            tableData.value = res.list.map(o=>{
                o.statusLoading = false
                return o
            })
        },
        // 删除/批量删除api
        deleteData:deleteUser,
        // 修改状态api
        updateStatus:updateUserStatus,
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
            username:"",
            password:"",
            nickname:"",
            avatar:"",
            user_level_id:null,
            phone:"",
            email:"",
            status:1,
        },
        // 表单验证规则
        rules:{},
        // 获取数据方法
        getData,
        // 新增数据api
        createData:createUser,
        // 修改数据api
        updateData:updateUser,
    })

    // 获取会员等级列表
    const user_level_list = ref([])
    getUserLevelList(1).then(res=>{
        user_level_list.value = res.list
    })
    

</script>

<style>

</style>