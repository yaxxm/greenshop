<template>
    <el-card shadow="never" class="border-0">
        <!-- 新增,批量删除 | 刷新,列设置,导出 -->
        <list-header 
        :permissions="{
            create:'createRule,POST',
            refresh:'getRuleList,GET'
        }"
        @create="handleCreate"
        @refresh="getData"
        ></list-header>

        <!-- 表格 -->
        <el-tree id="list-table"  :data="tableData" :props="{ children: 'child', label: 'name' }" @node-click="()=>{}" :expand-on-click-node="false" :default-expanded-keys="defaultExpandedKeys" node-key="id">
            <template #default="{ node, data }">

                <div class="custom-tree-node">
                    <el-tag style="margin: 0!important;" :type="data.menu ? '' : 'info'" size="small">
                        {{ data.menu ? "菜单" : "权限" }}
                    </el-tag>
                    <el-icon :size="16" v-if="data.icon" class="ml-2">
                        <component :is="data.icon"></component>
                    </el-icon>
                    <el-tooltip
                        v-if="!data.menu"
                        effect="dark"
                        :content="data.condition+','+data.method"
                        placement="right"
                    >
                        <span class="ml-2">{{ node.label }}</span>
                    </el-tooltip>
                    <span v-else class="ml-2">{{ node.label }}</span>

                    <span class="ml-auto">

                        <el-switch v-permission="['updateRuleStatus,POST']" @change="handleStatusChange($event,data)" :active-value="1" :inactive-value="0" :model-value="data.status" class="mr-2"/>

                        <el-button v-permission="['updateRule,POST']" 
                        class="mr-2" type="text" size="small" @click="handleEdit(data)">修改</el-button>

                        <el-button v-if="node.level < 3" v-permission="['createRule,POST']" 
                        class="mr-2" type="text" size="small" @click="addChild(data.id)">增加</el-button>

                        <el-popconfirm title="是否要删除该记录？" @confirm="handleDelete(data.id)" confirm-button-text="是" cancel-button-text="否">
                            <template #reference>
                                <el-button v-permission="['deleteRule,POST']" type="text" size="small">删除</el-button>
                            </template>
                        </el-popconfirm>

                    </span>
                </div>
            </template>
		</el-tree>

        <!-- 新增|修改表单 -->
        <form-drawer 
        ref="formDrawerRef" 
        :title="drawerTitle" 
        @submit="handleSubmit">
            <el-form :model="form" ref="formRef" :rules="rules" label-width="80px" :inline="false" size="default">
                <el-form-item label="上级菜单">
                    <el-cascader
                    placeholder="请选择上级菜单"
                    v-model="form.rule_id"
                    :options="options"
                    :props="{ value:'id',label:'name',children:'child' ,emitPath:false,checkStrictly: true}"
                    ></el-cascader>
                </el-form-item>
                <el-form-item label="菜单/规则">
                    <el-radio-group v-model="form.menu">
                        <el-radio :label="1" border>菜单</el-radio>
                        <el-radio :label="0" border>规则</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="名称">
                    <el-input v-model="form.name" placeholder="名称" style="width: 30%;"/>
                </el-form-item>
                <el-form-item label="菜单图标" v-if="form.menu">
                    <icon-select v-model="form.icon"></icon-select>
                </el-form-item>
                <el-form-item label="前端路由路径" v-if="form.menu && form.rule_id > 0">
                    <el-input v-model="form.frontpath" placeholder="前端路由path"/>
                </el-form-item>
                <!-- <el-form-item label="前台路由别名" v-if="form.menu && form.rule_id > 0">
                    <el-input v-model="form.desc" placeholder="前台路由别名"/>
                </el-form-item> -->
                <el-form-item label="后端规则" v-if="!form.menu">
                    <el-input v-model="form.condition" placeholder="后端规则"/>
                </el-form-item>
                <el-form-item label="请求方式" v-if="!form.menu">
                    <el-select v-model="form.method" placeholder="请选择请求方式">
                        <el-option label="GET" value="GET"/>
                        <el-option label="POST" value="POST"/>
                        <el-option label="PUT" value="PUT"/>
                        <el-option label="DELETE" value="DELETE"/>
                    </el-select>
                </el-form-item>
                <el-form-item label="排序" prop="order">
                    <el-input-number v-model="form.order" :min="0" :max="1000"/>
                </el-form-item>
            </el-form>
        </form-drawer>

    </el-card>
</template>
<script setup>
    import { ref } from 'vue'
    import ListHeader from '~/components/ListHeader.vue'
    import FormDrawer from '~/components/FormDrawer.vue'
    import IconSelect from '~/components/IconSelect.vue'
    import { toast,showLoading,hideLoading } from '~/composables/util'
    import { useInitTable,useInitForm } from '~/composables/useCommon'
    import { 
        createRule,
        updateRule,
        getRuleList,
        deleteRule,
        updateRuleStatus,
    } from '~/api/rule'

    // 权限菜单选项
    const options = ref([])
    // 默认展开
    const defaultExpandedKeys = ref([])
    // 初始化表格数据
    const {
        // 表格数据
        tableData,
        // 获取数据方法
        getData,
        handleDelete,
        handleStatusChange
    } = useInitTable({
        // 获取数据的方法
        getList:getRuleList,
        success:(res)=>{
            tableData.value = res.list
            console.log(tableData.value)
            options.value = res.rules
            // options.value = res.rules.map(o=>{
            //     if (o.level > 0) {
			// 		let str = ''
            //         for (let i = 0; i < o.level; i++) {
            //             str += i == 0 ? '|--' : '--'
            //         }
            //         o.name = str + ' ' +o.name;
			// 	}
			// 	return o
            // })
            defaultExpandedKeys.value = res.list.map(o=>o.id)
        },
        // 删除/批量删除api
        deleteData:deleteRule,
        // 修改状态api
        updateStatus:updateRuleStatus,
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
            menu:0,
            rule_id:0,
            name:"",
            status:1,
            frontpath:"",
            desc:"",
            condition:"",
            icon:"",
            method:"GET",
            order:50
        },
        // 表单验证规则
        rules:{},
        // 获取数据方法
        getData,
        // 新增数据api
        createData:createRule,
        // 修改数据api
        updateData:updateRule
    })

    // 添加子分类
    const addChild = (rid)=>{
        handleCreate()
        form.rule_id = rid
        form.status = 1
    }

</script>

<style>
.custom-tree-node {
		flex: 1;
		display: flex;
		align-items: center;
		font-size: 14px;
		padding-right: 8px;
	}

	.el-tree-node__content {
		padding: 20px 0;
	}
</style>