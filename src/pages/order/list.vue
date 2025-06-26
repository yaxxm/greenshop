<template>
    <!-- tab -->
    <el-tabs v-model="searchForm.tab" @tab-click="getData">
        <el-tab-pane :label="tab.name" :key="tabI"
        v-for="(tab,tabI) in tabbars" :name="tab.key"></el-tab-pane>
    </el-tabs>
    <el-card shadow="never" class="border-0">
        <!-- 搜索 -->
        <search-header :model="searchForm" @search="getData" @reset="resetSearchForm">
            <search-header-item label="订单编号" prop="no">
                <el-input v-model="searchForm.no" placeholder="订单编号" clearable></el-input>
            </search-header-item>
            <template #show>
                <search-header-item label="收货人" prop="name">
                    <el-input v-model="searchForm.name" placeholder="收货人" clearable></el-input>
                </search-header-item>
                <search-header-item label="手机号" prop="phone">
                    <el-input v-model="searchForm.phone" placeholder="手机号" clearable></el-input>
                </search-header-item>
                <search-header-item label="开始时间" prop="starttime">
                    <el-date-picker style="width:90%;" v-model="searchForm.starttime" type="date" placeholder="开始日期" value-format="YYYY-MM-DD"/>
                </search-header-item>
                <search-header-item label="结束时间" prop="endtime">
                    <el-date-picker style="width:90%;" v-model="searchForm.endtime" type="date" placeholder="结束时间" value-format="YYYY-MM-DD"/>
                </search-header-item>
            </template>
        </search-header>

        <!-- 新增,批量删除 | 刷新,列设置,导出 -->
        <list-header 
        :permissions="{
            refresh:'getOrderList,GET',
            delete:'deleteOrder,POST',
            download:'exportOrder,POST'
        }"
        @refresh="getData"
        @delete="handleDelete(true)"
        @download="handleExportExcel"
        ></list-header>

        <!-- 表格 -->
        <el-table
        id="list-table" 
        ref="multipleTableRef" 
        @selection-change="handleSelectionChange" 
        :data="tableData" 
        style="width: 100%" 
        stripe
        lazy>
            <el-table-column fixed="left" type="selection" width="55" />
            <el-table-column label="商品" width="370">
			<template #default="{ row }">
				<div class="flex text-sm">
					<div class="flex-1">
						<p>订单号：</p>
						<small>{{row.no}}</small>
					</div>
					<div class="flex-1">
						<p>下单时间：</p>
						<small>{{row.create_time}}</small>
					</div>
				</div>
				<div class="flex py-2" v-for="(item,index) in row.order_items" :key="index">
                    <el-image class="mr-3 rounded" style="width: 30px;height: 30px;" :src="item.goods_item ? item.goods_item.cover : ''" fit="cover"/>
				    <p class="mt-0 text-blue-500">
						{{item.goods_item ? item.goods_item.title : '商品已被删除'}}
					</p>
				</div>
			</template>
		  </el-table-column>
		  <el-table-column prop="total_price" align="center" width="120" label="实付款"/>
		  <el-table-column align="center" label="买家" width="120">
			<template #default="{ row }">
				<p>{{row.user.username}}</p>
				<small>(用户ID：{{row.user.id}})</small>
			</template>
		  </el-table-column>
			<el-table-column align="left" width="170" label="交易状态">
			<template #default="{ row }">
				<div>付款状态: 
					<el-tag v-if="row.payment_method === 'wechat'" size="small" type="success">微信支付</el-tag>
                    <el-tag v-else-if="row.payment_method === 'alipay'" size="small">支付宝支付</el-tag>
                    <el-tag v-else size="small" type="info">未支付</el-tag>
				</div>
				<div>发货状态: 
                    <el-tag size="small" :type="row.ship_data ? 'success' : 'info'">{{row.ship_data ? '已发货' : '未发货'}}</el-tag>
				</div>
				<div>收货状态: 
                    <el-tag size="small" :type="row.ship_status === 'received' ? 'success' : 'info'">{{row.ship_status === 'received' ? '已收货' : '未收货'}}</el-tag>
				</div>
			</template>
		  </el-table-column>
		  <el-table-column label="操作" align="right" min-width="180">
			<template #default="{ row }">

				<el-button type="text" size="small" @click="openInfoModal(row)">订单详情</el-button>

				<el-button v-permission="['shipOrder,POST']" 
                type="text" size="small" @click="ship(row)" v-if="row.ship_status ==='pending' && row.closed === 0 && row.payment_method && row.refund_status === 'pending'">订单发货</el-button>

				<el-button v-permission="['refundOrder,POST']" 
                type="text" size="small" v-if="row.ship_status ==='pending' && row.closed === 0 && row.payment_method && row.refund_status === 'applied'" @click="handleRefund(row.id,1)">同意退款</el-button>

				<el-button v-permission="['refundOrder,POST']" 
                type="text" size="small" v-if="row.ship_status ==='pending' && row.closed === 0 && row.payment_method && row.refund_status === 'applied'" @click="handleRefund(row.id,0)">拒绝退款</el-button>

			</template>
		  </el-table-column>
        </el-table>

        <!-- 分页 -->
        <div class="mt-5 flex justify-center">
            <el-pagination 
            :currentPage="currentPage" 
            background 
            layout="prev, pager, next" 
            :page-size="limit" 
            :total="total" 
            @current-change="getData"></el-pagination>
        </div>

        <info-modal ref="InfoModalRef" :info="info"></info-modal>

        <export-excel :tabs="tabbars" ref="ExportExcelRef"></export-excel>

        <ship-modal ref="ShipModalRef"></ship-modal>
    </el-card>
</template>
<script setup>
    import { ref,reactive,toRef } from 'vue'
    import SearchHeader from '~/components/SearchHeader.vue'
    import SearchHeaderItem from '~/components/SearchHeaderItem.vue'
    import ListHeader from '~/components/ListHeader.vue'
    import FormDrawer from '~/components/FormDrawer.vue'
    import InfoModal from './InfoModal.vue'
    import ExportExcel from './ExportExcel.vue'
    import ShipModal from './ShipModal.vue'
    import { useInitTable } from '~/composables/useCommon'
    import { showModal,showPrompt,showLoading,hideLoading,toast } from '~/composables/util'
    import { 
        getOrderList,
        deleteOrder,
        shipOrder,
        refundOrder,
    } from '~/api/order'


    // 初始化表格数据
    const {
        // 搜索
        searchForm,
        resetSearchForm,
        // 表格
        multipleTableRef,
        // 分页
        currentPage,
        limit,
        total,
        // 表格数据
        tableData,
        // 获取数据方法
        getData,
        // 多选相关
        multipleSelection,
        multipleSelectionIds,
        handleSelectionChange,
        handleDelete,
    } = useInitTable({
        // 搜索表单
        searchForm: {
            tab:"all",
            no:null,
            starttime:null,
            endtime:null,
            name:null,
            phone:null
        },
        // 获取数据的方法
        getList:getOrderList,
        // 获取数据成功之后的回调
        success:(res)=>{
            total.value = res.totalCount
            tableData.value = res.list.map(o=>{
                o.statusLoading = false
                return o
            })
        },
        // 删除/批量删除api
        deleteData:deleteOrder,
    })

    // tab切换
    const tabbars = ref([
        { name:"全部",key:"all"},
        { name:"待付款",key:"nopay" },
        { name:"待发货",key:"noship"},
        { name:"已发货",key:"shiped" },
        { name:"已收货",key:"received" },
        { name:"已完成",key:"finish" },
        { name:"已关闭",key:"closed" },
        { name:"退款中",key:"refunding" },
    ])

    // 订单详情
    const InfoModalRef = ref(null)
    const info = ref(null)
    const openInfoModal = (row)=>{
        row.order_items = row.order_items.map(v=>{
            if(v.skus_type == 1 && v.goods_skus){
                let s = []
                for (let k in v.goods_skus.skus) {
                    s.push(v.goods_skus.skus[k].value)
                }
                v.sku = s.join(',')
            }
            return v
        })
        info.value = row
        InfoModalRef.value.open()
    }

    // 导出订单
    const ExportExcelRef = ref(null)
    const handleExportExcel = ()=> ExportExcelRef.value.open()

    // 订单发货
    const ShipModalRef = ref(null)
    const ship = (row)=>ShipModalRef.value.open(row.id)

    // 退款处理
    const handleRefund = (id,agree = 0)=>{
        (agree ? showModal('是否要同意该订单退款?') : showPrompt('请输入拒绝的理由')).then(({ value }) => {
            showLoading()
            let data = { agree }
            if(!agree){
                data.disagree_reason = value
            }
            refundOrder(id,data).then(res=>{
                getData()
                toast('操作成功');
            }).finally(()=>hideLoading())
        })
    }

</script>

<style>

</style>