<template>
    <el-drawer v-model="dialogVisible" title="订单发货" size="40%">
        <el-form :model="form" size="default" label-width="80px">
		    <el-form-item label="快递公司" prop="express_company">
		      <el-select v-model="form.express_company" placeholder="请选择">
		          <el-option
		            v-for="(item,index) in express_company_options"
		            :key="index" :label="item.name" 
                    :value="item.name"/>
		        </el-select>
		    </el-form-item>
		    <el-form-item label="快递单号" prop="express_no">
		      <el-input type="text" v-model="form.express_no"/>
		    </el-form-item>
            <el-form-item>
                <el-button type="primary" :loading="loading" @click="submit">
                    {{ loading ? "提交中..." : "提交" }}
                </el-button>
            </el-form-item>
		</el-form>
    </el-drawer>
</template>
<script setup>
    import { reactive, ref } from 'vue'
    import { exportOrder } from '~/api/order'
    import { toast,showFullLoading,hideFullLoading } from '~/composables/util'

    import {
        getExpressCompanyList
    } from '~/api/express_company'

    import {
        shipOrder
    } from '~/api/order'

    const dialogVisible = ref(false)
    const express_company_options = ref([])
    const shipId = ref(0)
    const open = (id)=> {
        shipId.value = id
        showFullLoading()
        getExpressCompanyList().then(res=>{
            express_company_options.value = res.list
            dialogVisible.value = true
        }).finally(()=>hideFullLoading())
    }
    const close = ()=> dialogVisible.value = false

    const form = reactive({
        express_company:null,
        express_no:null
    })

    const loading = ref(false)
    const submit = ()=>{
        loading.value = true
        shipOrder(shipId.value,form)
        .then(data=>{
            toast("发货成功")
            close()
        }).finally(()=>loading.value = false)
    }

    defineExpose({ open })
</script>