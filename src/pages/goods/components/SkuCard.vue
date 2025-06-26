<template>
    <el-form-item label="添加规格" v-loading="bodyLoading">
        <!-- 规格 -->
        <div class="sku_card" v-for="(item,index) in sku_card_list" :key="item.id" v-loading="item.loading" style="width:100%;">
            <div class="header">
                <el-input size="default" style="width: 200px;" placeholder="规格名称" v-model="item.text" @change="handleUpdate(item)">
                    <template #append>
                        <div class="flex justify-center">
                            <el-button size="small" type="text" @click="handleChooseSku(item)"><el-icon><more/></el-icon></el-button>
                        </div>
                    </template>
                </el-input>
                <el-button :disabled="index == 0" class="ml-auto" size="small" type="text" @click="sortCard('up',index)">
                    <el-icon><top /></el-icon>
                </el-button>
                <el-button :disabled="index == (sku_card_list.length - 1)" size="small" type="text" @click="sortCard('down',index)">
                    <el-icon><bottom /></el-icon>
                </el-button>
                <el-popconfirm
                    confirm-button-text="删除"
                    cancel-button-text="取消"
                    title="是否要删除该规格？"
                    @confirm="handleDelete(item)"
                >
                    <template #reference>
                        <el-button type="text" size="small"><el-icon><delete /></el-icon></el-button>
                    </template>
                </el-popconfirm>
            </div>
            <div class="p-2">
                <sku-card-item :skuCardId="item.id"></sku-card-item>
            </div>
        </div>

        <el-button type="success" size="small" @click="addSkuCardEvent" :loading="btnLoading">添加规格</el-button>
    </el-form-item>


    <choose-sku ref="ChooseSkuRef"></choose-sku>
</template>
<script setup>
    import { ref } from 'vue'
    import SkuCardItem from "./SkuCardItem.vue"
    import ChooseSku from "~/components/ChooseSku.vue"
    import { 
        sku_card_list,
        goodsId,
        btnLoading,
        addSkuCardEvent,
        handleUpdate,
        handleDelete,
        bodyLoading,
        sortCard,
        handleChooseSetGoodsSkusCard
    } from '~/composables/sku'

    // 选择sku
    const ChooseSkuRef = ref(null)
    const handleChooseSku = (item)=>{
        ChooseSkuRef.value.open((value)=>{
            handleChooseSetGoodsSkusCard(item.id,{
                name: value.name,
                value:value.list
            })
        })
    }
    
</script>
<style scoped>
    .sku_card{
        @apply border rounded text-sm mb-2;
    }
    .sku_card .header{
        @apply bg-gray-100 px-3 py-2 flex items-center;
    }
</style>