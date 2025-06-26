<template>
    <el-card shadow="never" class="border-0">
        <!-- 新增,批量删除 | 刷新,列设置,导出 -->
        <list-header 
        :permissions="{
            create:'createCoupon,POST',
            refresh:'getCouponList,GET'
        }"
        @create="handleCreate"
        @refresh="getData">
        </list-header>

        <!-- 表格 -->
        <el-table
        id="list-table" 
        ref="multipleTableRef" 
        @selection-change="handleSelectionChange" 
        :data="tableData" 
        style="width: 100%" 
        stripe
        lazy>
            <el-table-column label="优惠券名称" width="350">
                <template #default="{ row }">
                    <div class="border border-dashed py-2 px-4 rounded"
                    :class="row.statusText == '领取中' ? 'active' : 'inactive'">
                        <h5 class="text-md font-bold">{{ row.name }}</h5>
                        <small>{{ row.start_time }} ~ {{ row.end_time }}</small>
                    </div>
                </template>
            </el-table-column>
            <el-table-column align="center" prop="statusText" label="状态"/>
            <el-table-column align="center" label="优惠">
                <template #default="{ row }">
                    {{ row.type ? '满减' : '折扣' }} {{ row.type ? ("￥" + row.value): (row.value + "折") }}
                </template>
            </el-table-column>
            <el-table-column align="center" prop="total" label="发放数量"/>
            <el-table-column align="center" prop="used" label="已使用" />
            <el-table-column fixed="right" label="操作" width="180" align="center"
            v-permission="['updateCouponStatus,POST','updateCoupon,POST','deleteCoupon,POST']">
                <template #default="{ row }">

                    <el-popconfirm v-if="row.statusText =='领取中'" title="是否要让该优惠券失效" @confirm="handleStatusChange(0,row)" confirm-button-text="是" cancel-button-text="否">
                        <template #reference>
                            <el-button v-permission="['updateCouponStatus,POST']"
                            type="danger" size="small" plain :loading="row.statusLoading">失效</el-button>
                        </template>
                    </el-popconfirm>

                    <el-button v-permission="['updateCoupon,POST']"
                    v-if="row.statusText =='未开始'" type="text" size="small" @click="handleEdit(row)">修改</el-button>

                    <el-popconfirm v-if="row.statusText !='领取中'" title="是否要删除该记录？" @confirm="handleDelete(row.id)" confirm-button-text="是" cancel-button-text="否">
                        <template #reference>
                            <el-button v-permission="['deleteCoupon,POST']"
                            type="text" size="small">删除</el-button>
                        </template>
                    </el-popconfirm>
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

        <!-- 新增|修改表单 -->
        <form-drawer 
        ref="formDrawerRef" 
        :title="drawerTitle" 
        @submit="handleSubmit">
            <el-form :model="form" ref="formRef" :rules="rules" label-width="80px" :inline="false" size="default">
                <el-form-item label="优惠券名称" prop="name">
					<el-input v-model="form.name" placeholder="优惠券名称" style="width: 50%;"></el-input>
				</el-form-item>
				<el-form-item label="类型" prop="type">
					<el-radio-group v-model="form.type">
						<el-radio :label="0" border>满减</el-radio>
						<el-radio :label="1" border>折扣</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="面值" prop="value">
					<el-input type="number" v-model="form.value" class="w-50">
						<template #append>{{ form.type ? '折' : '元' }}</template>
					</el-input>
				</el-form-item>
				<el-form-item label="发行量" prop="total">
					<el-input-number v-model="form.total" :min="0"></el-input-number>
				</el-form-item>
				<el-form-item label="最低使用价格" prop="min_price">
                    <el-input type="number" v-model="form.min_price" class="w-50">
						<template #append>元</template>
					</el-input>
				</el-form-item>
				<el-form-item label="排序" prop="order">
					<el-input-number v-model="form.order" :min="0"></el-input-number>
				</el-form-item>
				<el-form-item label="活动时间">
                    <el-date-picker
                        v-model="timerange"
                        type="datetimerange"
                        range-separator="~"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期">
                    </el-date-picker>
				</el-form-item>
				<el-form-item label="描述" prop="desc">
					<el-input type="textarea" :rows="3" v-model="form.desc"></el-input>
				</el-form-item>
            </el-form>
        </form-drawer>

    </el-card>
</template>
<script setup>
    import { computed,ref,watch } from 'vue'
    import ListHeader from '~/components/ListHeader.vue'
    import FormDrawer from '~/components/FormDrawer.vue'
    import { formatDateTime,toast } from "~/composables/util"
    import { 
        useInitTable,
        useInitForm 
    } from '~/composables/useCommon'
    import { 
        createCoupon,
        updateCoupon,
        getCouponList,
        updateCouponStatus,
        deleteCoupon
    } from '~/api/coupon'


    // 初始化表格数据
    const {
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
        // 获取数据的方法
        getList:getCouponList,
        // 获取数据成功之后的回调
        success:(res)=>{
            total.value = res.totalCount
            tableData.value = res.list.map(o=>{
                o.statusLoading = false
                o.statusText = formatStatus(o)
                return o
            })
        },
        // 删除/批量删除api
        deleteData:deleteCoupon,
    })


    // 修改状态
    const handleStatusChange = (status, row) => {
        row.statusLoading = true
        updateCouponStatus(row.id, status).then(res => {
            toast("修改状态成功")
            row.status = status
            getData()
        }).finally(() => row.statusLoading = false)
    }

    // 初始化表单
    const {
        drawerTitle,
        form,
        formRef,
        rules,
        formDrawerRef,
        handleSubmit,
        handleCreate,
        handleEdit
    } = useInitForm({
        // 表单初始数据
        form:{
            id: null,
            name:"",
            type:0,
            value:0,
            total:100,
            min_price:0,
            start_time:"",
            end_time:"",
            order:50,
            desc:""
        },
        // 表单验证规则
        rules:{},
        // 获取数据方法
        getData,
        // 新增数据api
        createData:createCoupon,
        // 修改数据api
        updateData:updateCoupon,
        // 提交之前
        beforeSubmit:(e)=>{
            if(typeof form.start_time != "number"){
                form.start_time = (new Date(form.start_time)).getTime()
            }
            if(typeof form.end_time != "number"){
                form.end_time = (new Date(form.end_time)).getTime()
            }
        }
    })

    const timerange = computed({
        get() {
            if(form.start_time && form.end_time){
                return [new Date(form.start_time), new Date(form.end_time)]
            }
            return []
        },
        set(val) {
            form.start_time = (new Date(val[0])).getTime()
            form.end_time = (new Date(val[1])).getTime()
        }
    })

    function formatStatus(row){
		let s = '领取中'
		let start = (new Date(row.start_time)).getTime()
		let now = (new Date()).getTime()
		let end = (new Date(row.end_time)).getTime()
		if(start > now){
			s = '未开始'
		} else if(end < now){
			s = '已结束'
		}
		if(row.status == 0){
			s = '已失效'
		}
		return s;
	}

</script>

<style scoped>
.active{
    @apply border-rose-200 bg-rose-50 text-red-400;
}
.inactive{
    @apply border-gray-200 bg-gray-50 text-gray-400;
}
</style>