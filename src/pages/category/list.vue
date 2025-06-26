<template>
    <el-card shadow="never" class="border-0">
        <!-- 新增,批量删除 | 刷新,列设置,导出 -->
        <list-header 
        :permissions="{
            create:'createCategory,POST',
            refresh:'getCategoryList,GET'
        }"
        @create="handleCreate"
        @refresh="getData"
        ></list-header>
        <!-- 表格 -->

        <el-tree id="list-table" :draggable="false"
        :data="tableData" :props="{ children: 'child', label: 'name' }" @node-click="()=>{}" default-expand-all :expand-on-click-node="false" @node-drag-end="nodeDragEnd">
            <template #default="{ node, data }">
                <div class="custom-tree-node">
                    <span>{{ node.label }}</span>
                    <span class="ml-auto">

                        <el-button v-permission="['getCategoryGoods,GET']"
                        v-if="data.category_id == 0" type="text" size="small" class="mr-2" @click="openGoodsDrawer(data.id)">
                            推荐产品
                        </el-button>

                        <el-switch v-permission="['updateCategoryStatus,POST']"
                        @change="handleStatusChange($event,data)" :active-value="1" :inactive-value="0" :model-value="data.status" class="mr-2"/>

                        <el-button v-permission="['updateCategory,POST']"
                        class="mr-2" type="text" size="small" @click="handleEdit(data)">修改</el-button>

                        <!-- <el-button v-permission="['createCategory,POST']"
                        class="mr-2" type="text" size="small" @click="addChild(data.id)">增加</el-button> -->

                        <el-popconfirm title="是否要删除该记录？" @confirm="handleDelete(data.id)" confirm-button-text="是" cancel-button-text="否">
                            <template #reference>
                                <el-button v-permission="['getCategoryGoods,GET']"
                                type="text" size="small">删除</el-button>
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
                <el-form-item label="分类名称" prop="name">
                    <el-input v-model="form.name" placeholder="分类名称"></el-input>
                </el-form-item>
            </el-form>
        </form-drawer>

        <goods-drawer ref="GoodsDrawerRef"></goods-drawer>

    </el-card>
</template>
<script setup>
    import { ref } from 'vue'
    import ListHeader from '~/components/ListHeader.vue'
    import FormDrawer from '~/components/FormDrawer.vue'
    import TagInput from '~/components/TagInput.vue'
    import GoodsDrawer from './components/GoodsDrawer.vue'
    import { toast,showLoading,hideLoading } from '~/composables/util'
    import { useInitTable,useInitForm } from '~/composables/useCommon'
    import { 
        createCategory,
        updateCategory,
        getCategoryList,
        deleteCategory,
        updateCategoryStatus,
        sortCategory
    } from '~/api/category'

    import { hasPermission } from "~/directive/permission.js"

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
        getList:getCategoryList,
        success:(res)=>{
            tableData.value = res
        },
        // 删除/批量删除api
        deleteData:deleteCategory,
        // 修改状态api
        updateStatus:updateCategoryStatus,
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
            category_id:0,
            status:1
        },
        // 表单验证规则
        rules:{},
        // 获取数据方法
        getData,
        // 新增数据api
        createData:createCategory,
        // 修改数据api
        updateData:updateCategory
    })


    // 拖拽结束
	const nodeDragEnd = (...opt)=>{
        // 被拖拽节点对应的数据
        let item = opt[0].data
        // 结束拖拽时最后进入的节点数据
        let o = opt[1].data
        if(o){
            item.category_id = opt[2] === 'before' || opt[2] === "after" ? o.category_id : o.id
        }

        showLoading()
        sortCategory(sortData(tableData.value)).then(res=>{
            toast("排序成功")
        }).catch(()=>getData()).finally(()=>hideLoading())
    }

    // 排序后的数据
    function sortData(d) {
        let data = []
        const sort = function(arr){
            arr.forEach(item=>{
                data.push(item)
                if(item.child.length){
                    sort(item.child)
                }
            })
        }
        // 多维数组转一维数组
        sort(d)
        // 排序
        data = data.map((item,index)=>{
            return {
                id:item.id,
                order:index,
                category_id:item.category_id
            }
        })
        return data
    }

    // 添加子分类
    const addChild = (cid)=>{
        handleCreate()
        form.category_id = cid
        form.status = 1
    }

    // 查看推荐产品
    const GoodsDrawerRef = ref(null)
    const openGoodsDrawer = id => GoodsDrawerRef.value.open(id)

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