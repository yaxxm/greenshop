<template>
    <form-drawer destroy-on-close ref="formDrawerRef" title="设置商品规格" size="70%" @submit="submit">
        <el-form :model="form" size="default">
		    <el-form-item label="规格类型" prop="sku_type">
                <el-radio-group v-model="form.sku_type">
					<el-radio :label="0" border>单规格</el-radio>
					<el-radio :label="1" border>多规格</el-radio>
				</el-radio-group>
		    </el-form-item>
            <template v-if="form.sku_type == 0">
                <el-form-item label="市场价格">
                    <el-input type="number" v-model="form.sku_value.oprice" style="width:35%">
                        <template #append>元</template>
                    </el-input>
                </el-form-item>
                <el-form-item label="销售价格">
                    <el-input type="number" v-model="form.sku_value.pprice" style="width:35%">
                        <template #append>元</template>
                    </el-input>
                </el-form-item>
                <el-form-item label="成本价格">
                    <el-input type="number" v-model="form.sku_value.cprice" style="width:35%">
                        <template #append>元</template>
                    </el-input>
                </el-form-item>
                <el-form-item label="商品重量">
                    <el-input type="number" v-model="form.sku_value.weight" style="width:35%">
                        <template #append>公斤</template>
                    </el-input>
                </el-form-item>
                <el-form-item label="商品体积">
                    <el-input type="number" v-model="form.sku_value.volume" style="width:35%">
                        <template #append>立方米</template>
                    </el-input>
                </el-form-item>
            </template>
            <template v-else>
                <sku-card></sku-card>
                <!-- 规格价格配置 -->
                <sku-table ref="SkuTableRef"></sku-table>
            </template>
		</el-form>
    </form-drawer>
</template>
<script setup>
    import { reactive, ref,nextTick } from 'vue'
    import FormDrawer from '~/components/FormDrawer.vue'
    import SkuCard from './components/SkuCard.vue'
    import SkuTable from './components/SkuTable.vue'
    import { toast,showLoading,hideLoading } from '~/composables/util'

    import { 
        sku_card_list,
        initSkuCardList,
        sku_list,
        goodsId
    } from '~/composables/sku'

    import {
        readGoods,
        updateGoodsSkus
    } from '~/api/goods'
    const emit = defineEmits(["reloadData"])
    const form = reactive({
        sku_type:0,
        sku_value:{
            oprice:0,
            pprice:0,
            cprice:0,
            weight:0,
            volume:0
        },
    })
    
    const formDrawerRef = ref(null)
    
    // 打开窗口
    const open = (id)=> {
        goodsId.value = id
        showLoading(true)
        readGoods(id).then(res=>{
            form.sku_type = res.sku_type
            form.sku_value = res.sku_value || {
                oprice:0,
                pprice:0,
                cprice:0,
                weight:0,
                volume:0
            }

            initSkuCardList(res)

            formDrawerRef.value.open()
        }).finally(()=>hideLoading())
    }
    // 关闭窗口
    const close = ()=> formDrawerRef.value.close()

    // 提交按钮
    const SkuTableRef = ref(null)
    const submit = ()=>{
        formDrawerRef.value.showLoading()

        let data = {
            sku_type:form.sku_type,
            sku_value:form.sku_value,
        }
        if(form.sku_type == 1){
            data.goodsSkus = SkuTableRef.value.sku_list
        }
        updateGoodsSkus(goodsId.value,data)
        .then(data=>{
            toast("设置商品规格成功")
            close()
            emit("reloadData")
        })
        .finally(()=>formDrawerRef.value.hideLoading())
    }

    defineExpose({ open })
</script>
