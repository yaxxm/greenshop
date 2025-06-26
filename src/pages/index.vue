<template>
    <div class="container">

        <el-row :gutter="20" v-permission="['getStatistics1,GET']">
            <template v-if="panels.length == 0">
                <el-col :span="6" v-for="i in 4" :key="i">
                    <el-skeleton style="width: 240px" loading animated>
                        <template #template>
                            <el-card shadow="hover" class="border-0">
                                <template #header>
                                    <div class="flex justify-between">
                                        <el-skeleton-item variant="h3" style="width: 50%" />
                                        <el-skeleton-item variant="text" style="width: 10%" />
                                    </div>
                                </template>
                                <span class="text-3xl font-sans text-gray-500 font-bold">
                                    <el-skeleton-item variant="h3" style="width: 80%" />
                                </span>
                                <el-divider direction="horizontal"></el-divider>
                                <div class="text-sm flex justify-between text-gray-500">
                                    <el-skeleton-item variant="h3" style="width: 50%" />
                                    <el-skeleton-item variant="text" style="width: 10%" />
                                </div>
                            </el-card>
                        </template>
                    </el-skeleton>
                </el-col>
            </template>
            <el-col :span="6" v-for="(item,index) in panels" :key="index">
                <el-card shadow="hover" class="border-0">
                    <template #header>
                        <div class="flex justify-between">
                            <span class="text-sm">{{ item.title }}</span>
                            <el-tag :type="item.unitColor" size="small" effect="plain">{{item.unit}}</el-tag>
                        </div>
                    </template>
                    <span class="text-3xl font-sans text-gray-500 font-bold">
                        <count-to :value="item.value"></count-to>
                    </span>
                    <el-divider direction="horizontal"></el-divider>
                    <div class="text-sm flex justify-between text-gray-500">
                        <span>{{ item.subTitle }}</span>
                        <span>{{ item.subValue }}{{item.subUnit}}</span>
                    </div>
                </el-card>
            </el-col>
        </el-row>
         

         <el-row :gutter="20" class="mt-5">
             <el-col :span="3" v-for="(item,index) in iconNavs" :key="index">
                 <el-card shadow="hover" class="border-0" @click="$router.push(item.path)">
                     <div class="flex flex-col items-center justify-center pointer">
                        <el-icon size="25" class="mb-2" :class="item.color">
                            <component :is="item.icon"></component>
                        </el-icon>
                        <span class="text-sm">{{ item.title }}</span>
                     </div>
                 </el-card>
             </el-col>
         </el-row>
         

         <el-row :gutter="20" class="mt-4">
             <el-col :span="12" v-permission="['getStatistics3,GET']">
                 <index-chart></index-chart>
             </el-col>
             <el-col :span="12" v-permission="['getStatistics2,GET']">
                 <index-card :title="card1.title" :tip="card1.tip" :btns="card1.btns"></index-card>

                 <index-card class="mt-3" :title="card2.title" :tip="card2.tip" :btns="card2.btns"></index-card>

             </el-col>
         </el-row>

    </div>
</template>
<script setup>
    import { ref,reactive } from "vue"
    import CountTo from "~/components/CountTo.vue"
    import IndexChart from '~/components/IndexChart.vue'
    import IndexCard from '~/components/IndexCard.vue'

    import {
        getStatistics1,
        getStatistics2,
    } from '~/api/index.js'


    const panels = ref([]) 
    getStatistics1().then(res=>panels.value = res.panels.map(o=>{
        o.loading = false
        return o
    }))


    const card1 = reactive({
        title:"店铺及商品提示",
        tip:"店铺及商品提示",
        btns:[]
    })

    const card2 = reactive({
        title:"交易提示",
        tip:"需要立即处理的交易订单",
        btns:[]
    })
    getStatistics2().then(res=>{
        card1.btns = res.goods
        card2.btns = res.order
    })

    // const panels = ref([
    //     {
    //         title:"访问量",
    //         value:"25,848",
    //         unit:"日",
    //         unitColor:"success",
    //         subTitle:"总访问量",
    //         subValue:"280",
    //         subUnit:""
    //     },
    //     {
    //         title:"订单量",
    //         value:"1,680",
    //         unit:"周",
    //         unitColor:"danger",
    //         subTitle:"转化率",
    //         subValue:"60%",
    //         subUnit:""
    //     },
    //     {
    //         title:"销售额",
    //         value:"￥12,000",
    //         unit:"月",
    //         unitColor:"primary",
    //         subTitle:"总销售额",
    //         subValue:"50",
    //         subUnit:""
    //     },
    //     {
    //         title:"新增用户",
    //         value:"150",
    //         unit:"月",
    //         unitColor:"warning",
    //         subTitle:"总用户",
    //         subValue:"10800",
    //         subUnit:"人"
    //     }
    // ]) 

    const iconNavs = ref([
        {
            icon:"user",
            color:"text-light-blue-500",
            title:"用户",
            path:"/user/list"
        },
        {
            icon:"shopping-cart",
            color:"text-violet-500",
            title:"商品",
            path:"/goods/list"
        },
        {
            icon:"tickets",
            color:"text-fuchsia-500",
            title:"订单",
            path:"/order/list"
        },
        {
            icon:"chat-dot-square",
            color:"text-teal-500",
            title:"评价",
            path:"/comment/list"
        },
        {
            icon:"picture",
            color:"text-rose-500",
            title:"图库",
            path:"/image/list"
        },
        {
            icon:"bell",
            color:"text-green-500",
            title:"公告",
            path:"/notice/list"
        },
        {
            icon:"set-up",
            color:"text-grey-500",
            title:"配置",
            path:"/setting/base"
        },
        {
            icon:"files",
            color:"text-yellow-500",
            title:"优惠券",
            path:"/coupon/list"
        }
    ])

    // const card1 = ref({
    //     title:"店铺及商品提示",
    //     tip:"店铺及商品提示",
    //     btns:[{
    //         label:"出售中",
    //         value:64
    //     },{
    //         label:"库存中",
    //         value:64
    //     },{
    //         label:"审核中",
    //         value:64
    //     },{
    //         label:"库存预警",
    //         value:64
    //     }]
    // })

    // const card2 = ref({
    //     title:"交易提示",
    //     tip:"需要立即处理的交易订单",
    //     btns:[{
    //         label:"待付款",
    //         value:64
    //     },{
    //         label:"待发货",
    //         value:64
    //     },{
    //         label:"已发货",
    //         value:64
    //     },{
    //         label:"退款中",
    //         value:64
    //     }]
    // })
</script>
<style>

</style>