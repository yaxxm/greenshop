<template>
    <el-drawer v-model="dialogVisible" title="订单详情" size="50%">
        <div class="info-modal">
            <el-card v-if="info" shadow="never" class="mb-3">
                <template #header><b class="text-sm">订单信息</b></template>
                <el-form label-position="left" label-width="80px">
                    <el-form-item label="订单号">
                        {{ info.no }}
                    </el-form-item>
                    <el-form-item v-if="info.payment_method" label="付款方式">
                        {{ info.payment_method }}
                    </el-form-item>
                    <el-form-item v-if="info.paid_time" label="付款时间">
                        {{ info.paid_time }}
                    </el-form-item>
                    <el-form-item label="创建时间">
                        {{ info.create_time }}
                    </el-form-item>
                </el-form>
            </el-card>
            <el-card v-if="info.ship_data" shadow="never" class="mb-3">
                <template #header><b class="text-sm">发货信息</b></template>
                <el-form label-position="left" label-width="80px">
                    <el-form-item label="物流公司">
                        {{ info.ship_data.express_company }}
                    </el-form-item>
                    <el-form-item label="运单号">
                        {{ info.ship_data.express_no }}
                        <el-button :loading="loading" size="small" class="ml-3" type="text" @click="openShipInfoModal(info.id)">查看物流</el-button>
                    </el-form-item>
                    <el-form-item label="发货时间">
                        {{ info.ship_data.express_time }}
                    </el-form-item>
                </el-form>
            </el-card>
            
            <el-card shadow="never" class="mb-3">
                <template #header><b class="text-sm">商品信息</b></template>
                <div class="flex mb-2" v-for="(item,index) in info.order_items" :key="index">
                    <el-image :src="item.goods_item ? item.goods_item.cover : ''" fit="cover" :lazy="true" style="width: 60px;height: 60px;" class="rounded"></el-image>
                    <div class="ml-2 text-sm">
                        <p>{{ item.goods_item ? item.goods_item.title : '商品已被删除' }}</p>
                        <p v-if="item.skus_type == 1 && item.goods_skus" class="mt-1">
                            <el-tag type="info" size="small">{{ item.sku }}</el-tag>
                            
                        </p>
                        <p class="mt-1">
                            <b class="mr-2 text-rose-500">￥{{ item.price }}</b>
                            <span class="text-xs text-gray-500">x{{ item.num }}</span>
                        </p>
                    </div>
                </div>
                <el-form label-position="left" label-width="80px">
                    <el-form-item label="成交价">
                        <span style="color: red;font-size: 14px;font-weight: bold;">￥{{ info.total_price }}</span>
                    </el-form-item>
                </el-form>
            </el-card>
            
            <el-card shadow="never" class="mb-3" v-if="info.address">
                <template #header><b class="text-sm">收货信息</b></template>
                <el-form label-position="left" label-width="80px">
                    <el-form-item label="收货人">
                        {{ info.address.name }}
                    </el-form-item>
                    <el-form-item label="联系方式">
                        {{ info.address.phone }}
                    </el-form-item>
                    <el-form-item label="收货地址">
                        {{ info.address.province + info.address.city + info.address.district + info.address.address }}
                    </el-form-item>
                </el-form>
            </el-card>
            
            <el-card shadow="never" class="mb-3" v-if="info.refund_status != 'pending'">
                <template #header>
                    <b class="text-sm">退款消息</b>
                    <el-button disabled style="float: right; padding: 3px 0" type="text">{{ refund_status }}</el-button>
                </template>
                <el-form label-position="left" label-width="80px">
                    <el-form-item v-if="info.refund_data" label="退货理由">
                        {{ info.refund_data.reason }}
                    </el-form-item>
                    <el-form-item v-if="info.refund_refuse" label="拒绝理由">
                        {{ info.refund_refuse }}
                    </el-form-item>
                    <el-form-item v-if="info.refund_refuse" label="商家拒绝理由">
                        {{ info.refund_refuse.refund_disagree_reason }}
                    </el-form-item>
                </el-form>
            </el-card>
        </div>
  </el-drawer>

  <ship-info-modal ref="ShipInfoModalRef"/>
</template>

<script setup>
    import { ref,computed } from 'vue'
    import ShipInfoModal from './ShipInfoModal.vue'
    const props = defineProps({
        info:{
            type:Object,
            default:{}
        }
    })

    const dialogVisible = ref(false)

    const open = ()=> dialogVisible.value = true

    const refund_status = computed(()=>{
        const opt = {
            pending:'未退款',
            applied:'已申请，等待审核',
            processing:'退款中',
            success:'退款成功',
            failed:'退款失败',
        }
        return props.info.refund_status ? opt[props.info.refund_status] : ""
    })
    
    const loading = ref(false)
    const ShipInfoModalRef = ref(false)
    function openShipInfoModal(id){
        loading.value = true
        ShipInfoModalRef.value.open(id,()=>loading.value = false)
    }

    defineExpose({ open })
</script>

<style scoped>
    .info-modal{
        top:60px;
        overflow-y:auto;
        @apply px-3 absolute bottom-0 left-0 right-0;
    }
</style>