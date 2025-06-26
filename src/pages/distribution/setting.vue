<template>
    <el-card shadow="never" class="border-0" id="list-table">
        <el-form :model="form" size="default" label-width="160px">
            <h5 class="bg-gray-100 p-3 mb-5 rounded">基础设置</h5>
            <el-form-item label="分销启用" prop="distribution_open">
                <div>
                    <el-radio-group v-model="form.distribution_open">
                        <el-radio :label="1" border class="mr-1">是</el-radio>
                        <el-radio :label="0" border class="mr-1">否</el-radio>
                    </el-radio-group>
                    <small class="text-gray-500 flex mt-3"
                        style="line-height: 1;">关闭分销功能后不会再产生新的分销佣金，商城端分销入口会关闭。</small>
                </div>
            </el-form-item>
            <el-form-item label="分销海报图" prop="spread_banners">
                <choose-image :limit="9" v-model="form.spread_banners"></choose-image>
            </el-form-item>

            <h5 class="bg-gray-100 p-3 my-5 rounded">返佣设置</h5>
            <el-form-item label="一级返佣比例" prop="store_first_rebate">
                <div>
                    <el-input v-model="form.store_first_rebate" style="width: 60%;" placeholder="0-100">
                        <template #append>%</template>
                    </el-input>
                    <small class="text-gray-500 flex mt-3"
                            style="line-height: 1;">订单交易成功后给上级返佣的比例0 - 100,例:5 = 反订单金额的5%</small>
                </div>
            </el-form-item>
            <el-form-item label="二级返佣比例" prop="store_second_rebate">
                <div>
                    <el-input v-model="form.store_second_rebate" style="width: 60%;" placeholder="0-100">
                        <template #append>%</template>
                    </el-input>
                    <small class="text-gray-500 flex mt-3"
                            style="line-height: 1;">订单交易成功后给上级返佣的比例0 - 100,例:5 = 反订单金额的5%</small>
                </div>
            </el-form-item>
            <el-form-item label="自购返佣" prop="is_self_brokerage">
                <div>
                    <el-radio-group v-model="form.is_self_brokerage">
                        <el-radio :label="1" border class="mr-1">是</el-radio>
                        <el-radio :label="0" border class="mr-1">否</el-radio>
                    </el-radio-group>
                    <small class="text-gray-500 flex mt-3"
                        style="line-height: 1;">是否开启自购返佣（开启：分销员自己购买商品，享受一级返佣，上级享受二级返佣； 关闭：分销员自己购买商品没有返佣）</small>
                </div>
            </el-form-item>
            <h5 class="bg-gray-100 p-3 my-5 rounded">结算设置</h5>
            <el-form-item label="结算时间" prop="settlement_days">
                <div>
                    <el-input type="number" style="width: 250px;" v-model="form.settlement_days">
                        <template #prepend>订单完成后</template>
                        <template #append>天</template>
                    </el-input>
                    <small class="text-gray-500 flex mt-3" style="line-height: 1;">预估佣金结算后无法进行回收，请谨慎设置结算天数</small>
                </div>
            </el-form-item>
            <el-form-item label="佣金到账方式" prop="brokerage_method">
                <div>
                    <el-radio-group v-model="form.brokerage_method">
                        <el-radio :label="1" border class="mr-1">手动转账</el-radio>
                        <el-radio :label="0" border class="mr-1">自动到微信零钱</el-radio>
                    </el-radio-group>
                    <small class="text-gray-500 flex mt-3" style="line-height: 1;">佣金到账方式支持线下转账和微信零钱自动转账，手动转账更安全，自动转账更方便</small>
                </div>
            </el-form-item>

            <el-form-item v-permission="['setSysSetting,POST']">
                <el-button type="primary" size="small" @click="submit">保存</el-button>
            </el-form-item>
        </el-form>
    </el-card>
</template>
<script setup>
import { ref, reactive, onMounted } from 'vue'
import { showLoading, hideLoading, toast } from '~/composables/util'
import {
    getSysconfig,
    setSysconfig,
} from '~/api/sysconfig'
import ChooseImage from '~/components/ChooseImage.vue'


const form = reactive({
    distribution_open: 1,
    store_first_rebate:10,
    store_second_rebate:20,
    spread_banners:["http://tangzhe123-com.oss-cn-shenzhen.aliyuncs.com/public/62710076cd93e.png"],
    is_self_brokerage:1,
    settlement_days:7,
    brokerage_method:1,
})

function getData() {
    // showLoading()
    // getSysconfig().then(d => {
    //     for (const k in form) {
    //         form[k] = d[k]
    //     }
    //     form.password_encrypt = form.password_encrypt.split(',')
    // }).finally(() => {
    //     hideLoading()
    // })
}

onMounted(() => getData())

const submit = () => {
    toast("演示数据禁止操作","error")
    // showLoading()
    // form.password_encrypt = form.password_encrypt.join(',')
    // setSysconfig(form).then(res => {
    //     toast("修改成功")
    //     getData()
    // }).finally(() => {
    //     hideLoading()
    // })
}
</script>