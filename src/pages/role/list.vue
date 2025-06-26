<template>
    <el-card shadow="never" class="border-0">
        <!-- 新增,批量删除 | 刷新,列设置,导出 -->
        <list-header 
        :permissions="{
            create:'createRole,POST',
            refresh:'getRoleList,GET'
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
            <el-table-column label="角色名称" prop="name"/>
		    <el-table-column prop="desc" align="left" width="380" label="角色描述"/>
            <el-table-column v-permission="['updateRoleStatus,POST']" 
            prop="status" label="状态" width="120" align="center">
                <template #default="{ row }">
                    <el-switch @change="handleStatusChange($event,row)" :active-value="1" :inactive-value="0" :model-value="row.status"
                    :loading="row.statusLoading" :disabled="row.id == 2 || row.id == 3"/>
                </template>
            </el-table-column>
            <el-table-column v-permission="['setRoleRules,POST','updateRole,POST','deleteRole,POST']" 
            label="操作" min-width="180" align="right">
                <template #default="{ row }">

                    <el-button v-permission="['setRoleRules,POST']" type="text" size="small" @click="openSetRule(row)">配置权限</el-button>

                    <template v-if="row.id != 2 && row.id != 3">

                        <el-button v-permission="['updateRole,POST']" type="text" size="small" @click="handleEdit(row)">修改</el-button>

                        <el-popconfirm title="是否要删除该记录？" @confirm="handleDelete(row.id)" confirm-button-text="是" cancel-button-text="否">
                            <template #reference>
                                <el-button v-permission="['deleteRole,POST']" type="text" size="small">删除</el-button>
                            </template>
                        </el-popconfirm>
                        
                    </template>
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
                <el-form-item label="角色名称" prop="name">
                    <el-input v-model="form.name" placeholder="角色名称"></el-input>
                </el-form-item>
                <el-form-item label="角色描述" prop="desc">
                    <el-input type="textarea" v-model="form.desc" placeholder="角色描述" :rows="5"></el-input>
                </el-form-item>
                <el-form-item label="状态" prop="status">
                    <el-switch v-model="form.status" :active-value="1" :inactive-value="0"></el-switch>
                </el-form-item>
            </el-form>
        </form-drawer>

        <!-- 权限配置 -->
        <form-drawer 
        ref="setRuleFormDrawerRef" 
        title="权限配置" 
        @submit="handleSetRuleSubmit">
            <el-tree-v2
            ref="elTreeRef"
            :height="treeHeight"
            :data="ruleList"
            show-checkbox
            node-key="id"
            :default-expanded-keys="allRuleIds"
            :props="{ children: 'child', label: 'name' }"
            :check-strictly="checkStrictly"
            @check="handleTreeCheck">
            <template #default="{ node,data }">
                <div class="flex items-center">
                    <el-tag style="margin: 0!important;" :type="data.menu ? '' : 'info'" size="small">
                        {{ data.menu ? "菜单" : "权限" }}
                    </el-tag>
                    <span class="ml-2 text-sm">{{ node.label }}</span>
                </div>
            </template>
            </el-tree-v2>
        </form-drawer>

    </el-card>
</template>
<script setup>
    import { ref,nextTick } from 'vue'
    import ListHeader from '~/components/ListHeader.vue'
    import FormDrawer from '~/components/FormDrawer.vue'
    import TagInput from '~/components/TagInput.vue'
    import { toast,showLoading,hideLoading } from '~/composables/util'
    import { useInitTable,useInitForm } from '~/composables/useCommon'
    import { 
        createRole,
        updateRole,
        getRoleList,
        deleteRole,
        updateRoleStatus,
        setRoleRules
    } from '~/api/role'

    import { 
        getRuleList,
    } from '~/api/rule'


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
        handleDelete,
        handleStatusChange
    } = useInitTable({
        // 获取数据的方法
        getList:getRoleList,
        // 获取数据成功之后的回调
        success:(res)=>{
            total.value = res.totalCount
            tableData.value = res.list.map(o=>{
                o.statusLoading = false
                return o
            })
        },
        // 删除/批量删除api
        deleteData:deleteRole,
        // 修改状态api
        updateStatus:updateRoleStatus,
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
            desc:"",
            status:1
        },
        // 表单验证规则
        rules:{},
        // 获取数据方法
        getData,
        // 新增数据api
        createData:createRole,
        // 修改数据api
        updateData:updateRole,
    })

    // 配置权限
    const setRuleFormDrawerRef = ref(null)
    const ruleList = ref([])
    const allRuleIds = ref([])
    const treeHeight = ref(500)
    const ruleIds = ref([])
    const roleId = ref(0)
    const elTreeRef = ref(null)
    const checkStrictly = ref(true)
    // 打开配置权限
    const openSetRule = (row)=>{
        roleId.value = row.id
        treeHeight.value = window.innerHeight - 170
        showLoading(true)
        checkStrictly.value = false
        getRuleList(1).then(res=>{
            allRuleIds.value = res.rules.map(o=>o.id)
            ruleList.value = res.list
            setRuleFormDrawerRef.value.open()
            ruleIds.value = row.rules.map(o=>o.id)
            setTimeout(()=>{
                elTreeRef.value.setCheckedKeys(ruleIds.value)
                checkStrictly.value = false
            },150)
        }).finally(()=>hideLoading())
    }
    // 提交配置权限
    const handleSetRuleSubmit = ()=>{
        setRuleFormDrawerRef.value.showLoading()
        setRoleRules(roleId.value,ruleIds.value).then(res=>{
            toast("配置成功")
            getData()
            setRuleFormDrawerRef.value.close()
        }).finally(()=>setRuleFormDrawerRef.value.hideLoading())
    }
    
    const handleTreeCheck = (...e)=>{
        const { checkedKeys,halfCheckedKeys } = e[1]
        ruleIds.value = [...checkedKeys,...halfCheckedKeys]
    }

</script>

<style>

</style>