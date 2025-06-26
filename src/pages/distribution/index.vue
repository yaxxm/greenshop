<template>
    <el-row class="mb-5" :gutter="20">
        <el-col :span="6" v-for="(item, index) in statistics" :key="index">
            <el-card shadow="never" class="border-0">
                <div class="flex items-center">
                    <el-icon :size="20" :class="item.color" class=" text-white rounded-full"
                        style="width:40px;height: 40px;">
                        <user v-if="index == 0" />
                        <shopping-cart v-if="index == 1" />
                        <price-tag v-if="index == 2" />
                        <timer v-if="index == 3" />
                    </el-icon>
                    <div class="ml-3">
                        <h2 class="text-lg font-bold">{{ item.value }}</h2>
                        <small class="text-gray-400 text-xs">{{ item.label }}</small>
                    </div>
                </div>
            </el-card>
        </el-col>
    </el-row>

    <el-card shadow="never" class="border-0">
        <!-- 搜索 -->
        <el-form :model="searchForm" label-width="80px" class="mb-3">
            <el-row :gutter="20">
                <el-col :span="24" :offset="0">
                    <el-row>
                        <el-col :span="24" :lg="9" :md="12">
                            <el-form-item label="时间选择" prop="tag">
                                <el-radio-group v-model="searchForm.tag">
                                    <el-radio-button label="all">
                                        全部
                                    </el-radio-button>
                                    <el-radio-button label="today">
                                        今天
                                    </el-radio-button>
                                    <el-radio-button label="yesterday">
                                        昨天
                                    </el-radio-button>
                                    <el-radio-button label="last7days">
                                        最近7天
                                    </el-radio-button>
                                </el-radio-group>
                            </el-form-item>
                        </el-col>
                        <el-col :span="24" :lg="15" :md="12">
                            <el-form-item prop="date" label="日期范围">
                                <el-date-picker v-model="searchForm.date" type="datetimerange" range-separator="至"
                                    start-placeholder="开始日期" end-placeholder="结束日期" />
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-col>
                <el-col :span="24" :lg="9" :md="12" :offset="0">
                    <el-form-item label="关键词" prop="keyword">
                        <el-input v-model="searchForm.keyword" placeholder="请输入关键词" clearable></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="24" :lg="15" :md="12" :offset="0">
                    <div class="flex items-center justify-end">
                        <el-button type="primary" @search="getData">搜索</el-button>
                        <el-button @click="resetSearchForm">重置</el-button>
                    </div>
                </el-col>
            </el-row>
        </el-form>

        <!-- 新增,批量删除 | 刷新,列设置,导出 -->
        <list-header @refresh="getData"></list-header>

        <!-- 表格 -->
        <el-table id="list-table" :data="tableData" style="width: 100%" stripe lazy>
            <el-table-column label="ID" prop="user_id" align="center" />
            <el-table-column label="头像" width="65">
                <template #default="{ row }">
                    <el-avatar :size="38" :src="row.avatar"></el-avatar>
                </template>
            </el-table-column>
            <el-table-column label="用户信息" width="280">
                <template #default="{ row }">
                    <p class="text-xs font-medium">昵称：{{ row.nickname }}</p>
                    <p class="text-xs font-medium">姓名：{{ row.real_name }}</p>
                    <p class="text-xs font-medium">电话：{{ row.phone }}</p>
                </template>
            </el-table-column>
            <el-table-column label="推广用户数量" prop="spread_count" />
            <el-table-column label="订单数量" prop="order_count" />
            <el-table-column label="订单金额" prop="order_price" />
            <el-table-column label="账户佣金" prop="now_money" />
            <el-table-column label="已提现金额" prop="extract_count_price" />
            <el-table-column label="提现次数" prop="extract_count_num" />
            <el-table-column label="未提现金额" prop="new_money" />
            <el-table-column fixed="right" label="操作" width="180" align="center">
                <template #default="{ row }">

                    <el-button type="text" size="small" @click="openFormDrawerRef(row.user_id, 'user')">推广人</el-button>
                    <el-button type="text" size="small" @click="openFormDrawerRef(row.user_id, 'order')">推广订单</el-button>

                </template>
            </el-table-column>
        </el-table>

        <!-- 分页 -->
        <div class="mt-5 flex justify-center">
            <el-pagination :currentPage="currentPage" background layout="prev, pager, next" :page-size="limit"
                :total="total" @current-change="handlePageChange"></el-pagination>
        </div>


        <form-drawer size="70%" ref="formDrawerRef" :title="drawerTitle" :showActions="false">
            <el-form :model="drawerSearchForm" label-width="80px" class="mb-3">
                <el-form-item label="时间选择" prop="tag">
                    <el-radio-group v-model="drawerSearchForm.tag">
                        <el-radio-button label="all">
                            全部
                        </el-radio-button>
                        <el-radio-button label="today">
                            今天
                        </el-radio-button>
                        <el-radio-button label="yesterday">
                            昨天
                        </el-radio-button>
                        <el-radio-button label="last7days">
                            最近7天
                        </el-radio-button>
                    </el-radio-group>
                </el-form-item>
                <el-form-item prop="date" label="日期范围" style="max-width:450px;">
                    <el-date-picker v-model="drawerSearchForm.date" type="datetimerange" range-separator="至"
                        start-placeholder="开始日期" end-placeholder="结束日期" />
                </el-form-item>
                <el-form-item label="用户类型" prop="tag">
                    <el-radio-group v-model="drawerSearchForm.user_type">
                        <el-radio-button label="all">
                            全部
                        </el-radio-button>
                        <el-radio-button label="first">
                            一级推广
                        </el-radio-button>
                        <el-radio-button label="second">
                            二级推广
                        </el-radio-button>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="关键词" prop="keyword">
                    <el-input style="width:200px;" v-model="drawerSearchForm.keyword" placeholder="请输入关键词" clearable></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @search="getData">搜索</el-button>
                    <el-button @click="resetSearchForm">重置</el-button>
                </el-form-item>
            </el-form>

            <el-table id="list-table" :data="drawerTableData" style="width: 100%" stripe lazy>
                <el-table-column label="订单ID" prop="order_id" />
                <el-table-column label="昵称|电话|姓名" prop="user_info" />
                <el-table-column label="时间" prop="_add_time" />
                <el-table-column label="返佣金额" prop="brokerage_price" width="120"/>
            </el-table>

            <div class="mt-5 flex justify-center">
                <el-pagination :currentPage="drawerPager.currentPage" background layout="prev, pager, next" :page-size="drawerPager.limit"
                    :total="drawerPager.total" @current-change="handleDrawerPageChange"></el-pagination>
            </div>
        </form-drawer>


    </el-card>
</template>
<script setup>
import { ref, reactive } from 'vue'
import ListHeader from '~/components/ListHeader.vue'
import FormDrawer from '~/components/FormDrawer.vue'
import useTestData from '~/composables/testData.js'


const searchForm = reactive({
    date: "",
    keyword: "",
    tag: "all"
})
// 重置表单
const resetSearchForm = () => {
    form.date = ""
    form.keyword = ""
    form.tag = "all"
}

const tableData = ref([])


// 分页
const limit = ref(20)
const total = ref(1000)
const currentPage = ref(1)
const handlePageChange = (p) => {
    currentPage.value = p
    getData()
}
function getData() {
    const { list, count } = useTestData("distributions")
    tableData.value = list
    total.value = count
}

getData()

const statistics = ref([{
    color: "bg-blue-400",
    label: "分销员人数(人)",
    value: "12842"
}, {
    color: "bg-orange-400",
    label: "订单数(单)",
    value: "801"
}, {
    color: "bg-green-400",
    label: "订单金额(元)",
    value: "12842"
}, {
    color: "bg-indigo-400",
    label: "提现次数(次)",
    value: "6"
}])


const drawerTitle = ref("")
const formDrawerRef = ref(false)

const drawerSearchForm = reactive({
    date: "",
    keyword: "",
    tag: "all",
    user_type:"all"
})
// 重置表单
const resetDrawerSearchForm = () => {
    form.date = ""
    form.keyword = ""
    form.tag = "all"
    form.user_type = "all"
}

const drawerTableData = ref([])
const drawerPager = reactive({
    limit:20,
    total:100,
    currentPage:1
})
const openFormDrawerRef = (id, type) => {
    drawerTitle.value = type == 'user' ? "推广人列表" : "推广订单"
    const {list,count} = useTestData("distribution_orders")
    drawerTableData.value = list
    formDrawerRef.value.open()
}

const handleDrawerPageChange = (p)=>{
    drawerPager.currentPage = p
}



</script>

<style>
</style>