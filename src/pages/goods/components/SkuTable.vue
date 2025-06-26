<template>
    <el-form-item label="规格设置" v-loading="tableLoading">
        <table class="border">
            <thead>
                <tr>
                    <th scope="col" class="text-center border" 
                    style="vertical-align: middle;"
                    v-for="(th,thi) in tableThs" :key="thi"
                    :rowspan="th.rowspan" :colspan="th.colspan">
                        {{th.name}}
                    </th>
                </tr>
                <tr>
                    <th scope="col"
                    class="text-center border" 
                    style="vertical-align: middle;"
                    width="120"
                    v-for="(th,thi) in skuLabels" :key="thi"
                    rowspan="1" colspan="1">
                        {{th.name}}
                    </th>
                </tr>
            </thead>
            <tbody v-if="skuLabels.length">
                <tr v-for="(item,index) in sku_list" :key="index">
                <!-- 商品规格 -->
                <th scope="row" v-for="(sku,skuI) in item.skus" :key="skuI" class="text-center border">
                    {{ sku.value }}
                </th>
                <td class="text-center border" width="100">
                    <el-input type="number" v-model="item.pprice" size="small"/>
                </td>
                <td class="text-center border" width="100">
                    <el-input type="number" v-model="item.oprice" size="small"/>
                </td>
                <td class="text-center border" width="100">
                    <el-input type="number" v-model="item.cprice" size="small"/>
                </td>
                <td class="text-center border" width="100">
                    <el-input type="number" v-model="item.stock" size="small"/>
                </td>
                <td class="text-center border" width="100">
                    <el-input type="number" v-model="item.volume" size="small"/>
                </td>
                <td class="text-center border" width="100">
                    <el-input type="number" v-model="item.weight" size="small"/>
                </td>
                <td class="text-center border" width="100">
                    <el-input v-model="item.code" size="small"/>
                </td>
                </tr>
            </tbody>
            </table>

    </el-form-item>
</template>
<script setup>
    import { ref } from 'vue'
    import {
        initSkuTable
    } from '~/composables/sku'

    const {
        skuLabels,
        sku_list,
        tableThs,
        tableLoading
    } = initSkuTable()

    defineExpose({ sku_list })
</script>