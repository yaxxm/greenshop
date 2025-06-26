<template>
    <form-drawer 
    ref="formDrawerRef" 
    title="推荐产品" 
    confirm-text="关联"
    @submit="handleConnect"
    >
        <el-table :data="tableData" border style="width: 100%">
            <el-table-column prop="goods_id" label="ID" width="60"/>
            <el-table-column label="商品封面" width="180">
                <template #default="{ row }">
                    <el-image :src="row.cover" fit="fill" :lazy="true" style="width: 64px;height: 64px;"></el-image>
                </template>
            </el-table-column>
            <el-table-column prop="name" label="商品名称" width="180"/>
            <el-table-column label="操作">
                <template #default="{ row,$index }">
                    <el-popconfirm title="是否要删除该记录？" @confirm="handleDelete(row.id,$index)" confirm-button-text="是" cancel-button-text="否">
                        <template #reference>
                            <el-button type="text" size="small">删除</el-button>
                        </template>
                    </el-popconfirm>
                </template>
            </el-table-column>
        </el-table>
    </form-drawer>
    <choose-goods ref="ChooseGoodsRef"></choose-goods>
</template>
<script setup>
import { ref } from 'vue'
import FormDrawer from '~/components/FormDrawer.vue'
import ChooseGoods from '~/components/ChooseGoods.vue'
import { showLoading,hideLoading,toast } from '~/composables/util'
import {
    getCategoryGoods,
    deleteCategoryGoods,
    connectCategoryGoods
} from '~/api/category'

const formDrawerRef = ref(null)
const tableData = ref([])
// 打开查看推荐产品
const category_id = ref(0)
const open = (id)=>{
    category_id.value = id
    showLoading(true)
    getData().then(()=>formDrawerRef.value.open()).finally(()=>hideLoading())
}

function getData(){
    return getCategoryGoods(category_id.value)
    .then(list=>{
        tableData.value = list
    })
}

const handleDelete = (id,index)=>{
    showLoading(true)
    deleteCategoryGoods(id).then(()=>{
        tableData.value.splice(index,1)
        toast("删除成功")
    }).finally(()=>hideLoading())
}

// 关联产品
const ChooseGoodsRef = ref(null)
const handleConnect = ()=>{
    ChooseGoodsRef.value.open((goods_ids)=>{
        showLoading(true)
        connectCategoryGoods({
            category_id:category_id.value,
			goods_ids
        }).then(res=>{
            getData()
            toast("关联成功")
        }).finally(()=>hideLoading())
    })
}

defineExpose({ open })
</script>