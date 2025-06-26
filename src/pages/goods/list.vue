<template>
    <!-- tab -->
    <el-tabs v-model="searchForm.tab" @tab-click="getData">
        <el-tab-pane :label="tab.name" :key="tabI"
        v-for="(tab,tabI) in tabbars" :name="tab.key"></el-tab-pane>
    </el-tabs>
    <el-card shadow="never" class="border-0">
        <!-- 搜索 -->
        <search-header :model="searchForm" @search="getData" @reset="resetSearchForm">
            <search-header-item label="商品名称" prop="title">
                <el-input v-model="searchForm.title" placeholder="商品名称" clearable></el-input>
            </search-header-item>
            <template #show>
                <search-header-item label="商品分类" prop="category_id">
                    <el-select v-model="searchForm.category_id" placeholder="请选择商品分类" clearable>
                        <el-option
                        v-for="item in category_list"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                        >
                        </el-option>
                    </el-select>
                </search-header-item>
            </template>
        </search-header>

        <!-- 新增,批量删除 | 刷新,列设置,导出 -->
        <list-header 
        :permissions="{
            create:'createGoods,POST',
            refresh:'getGoodsList,GET'
        }"
        @create="handleCreate"
        @refresh="getData"
        >
            <el-button v-permission="['restoreGoods,POST']" 
            type="warning" size="small" v-if="searchForm.tab === 'delete'" @click="handleRestoreGoods">恢复商品</el-button>

            <el-popconfirm v-if="searchForm.tab === 'delete'" title="是否要删除彻底删除选中？" confirm-button-text="是" cancel-button-text="否" @confirm="handleDestroyGoods()">
                <template #reference>
                    <el-button v-permission="['destroyGoods,POST']" 
                    type="danger" size="small">彻底删除</el-button>
                </template>
            </el-popconfirm>

            <el-popconfirm v-else title="是否要删除批量删除选中？" confirm-button-text="是" cancel-button-text="否" @confirm="handleDelete(true)">
                <template #reference>
                    <el-button v-permission="['deleteGoods,POST']" 
                    type="danger" size="small">批量删除</el-button>
                </template>
            </el-popconfirm>
            <el-button v-permission="['updateGoodsStatus,POST']" 
            size="small" v-if="searchForm.tab === 'all' || searchForm.tab === 'off'" @click="changeStatus(1)">上架</el-button>
			<el-button v-permission="['updateGoodsStatus,POST']" 
            size="small" v-if="searchForm.tab === 'all' || searchForm.tab === 'saling'" @click="changeStatus(0)">下架</el-button>
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
            <el-table-column fixed="left" type="selection" width="55" />
            <el-table-column label="商品" width="300">
                <template #default="{ row }">
                    <div class="flex">
                        <el-image class="mr-3 rounded" style="width: 50px;height: 50px;" :src="row.cover" fit="cover"></el-image>
                        <div class="flex-1">
                            <p>{{row.title}}</p>
                            <div>
                                <span class="text-rose-500">￥{{row.min_price}}</span>
                                <el-divider direction="vertical"></el-divider>
                                <span class="text-gray-500 text-xs">￥{{row.min_oprice}}</span>
                            </div>
                            <p class="text-xs mb-1 text-gray-400">分类：{{row.category ? row.category.name : '未分类'}}</p>
                            <p class="text-xs text-gray-400">创建时间：{{row.create_time}}</p>
                        </div>
                    </div>
                </template>
		  </el-table-column>
		  <el-table-column align="center" prop="sale_count" width="70" label="实际销量"/>
		  <el-table-column align="center" label="商品状态" width="60">
			<template #default="{ row }">
                <el-tag :type="row.status ? 'success' : 'danger'" size="small">{{row.status ? '上架' : '仓库'}}</el-tag>
			</template>
		  </el-table-column>
		  <el-table-column align="center" width="120" label="审核状态" v-if="searchForm.tab != 'delete'">
			<template #default="{ row }">
				<div v-permission="['checkGoods,POST']" 
                class="flex flex-col" v-if="!row.ischeck">
					<el-button type="success" size="small" @click="handleCheckGoods(row,1)" plain>审核通过</el-button>
					
					<el-button class="mt-2" style="margin-left:0!important;" type="danger" size="small" @click="handleCheckGoods(row,2)" plain>审核拒绝</el-button>
				</div>
				<span v-else>{{row.ischeck == 1? '通过' : '拒绝'}}</span>
			</template>
		  </el-table-column>
		  <el-table-column prop="stock" align="center" width="90" label="总库存"/>
		  <el-table-column 
          v-permission="[
            'updateGoods,POST',
            'updateGoodsSkusCard,POST',
            'setGoodsBanner,POST',
            'deleteGoods,POST'
          ]" 
          label="操作" min-width="220" align="right">
			<template #default="{ row }">
				<template v-if="searchForm.tab != 'delete'">
                    <a v-permission="['updateGoods,POST']" 
                    class="btn-text" @click="handleEdit(row)">修改</a>

                    <a v-permission="['updateGoodsSkusCard,POST']"
                    class="btn-text" @click="handleSetGoodsSkus(row.id)" :class="(row.sku_type == 0 && !row.sku_value) || (row.sku_type == 1 && !row.goods_skus.length) ? 'btn-text-danger' : ''">商品规格</a>

                    <a v-permission="['setGoodsBanner,POST']" 
                    class="btn-text" @click="handleSetGoodsBanners(row.id)" :class="row.goods_banner.length == 0 ? 'btn-text-danger' : ''">设置轮播图</a>

                    <a v-permission="['updateGoods,POST']"
                    class="btn-text" @click="handleSetGoodsContent(row.id)" :class="!row.content ? 'btn-text-danger' : ''">商品详情</a>

                    <el-popconfirm title="是否要删除该记录？" @confirm="handleDelete(row.id)" confirm-button-text="是" cancel-button-text="否">
                        <template #reference>
                            <a v-permission="['deleteGoods,POST']"
                            class="btn-text">删除</a>
                        </template>
                    </el-popconfirm>

					<!-- <el-button type="text" size="small" @click="handleEdit(row)">修改</el-button>
					<el-button type="text" size="small" @click="handleSetGoodsSkus(row.id)" :class="(row.sku_type == 0 && !row.sku_value) || (row.sku_type == 1 && !row.goods_skus.length) ? 'text-rose-500' : ''">商品规格</el-button>

					<el-button type="text" size="small" @click="handleSetGoodsBanners(row.id)" :class="row.goods_banner.length == 0 ? 'text-rose-500' : ''">设置轮播图</el-button>

					<el-button type="text" size="small" @click="handleSetGoodsContent(row.id)" :class="!row.content ? 'text-rose-500' : ''">商品详情</el-button>
                    <el-popconfirm title="是否要删除该记录？" @confirm="handleDelete(row.id)" confirm-button-text="是" cancel-button-text="否">
                        <template #reference>
                            <el-button type="text" size="small">删除</el-button>
                        </template>
                    </el-popconfirm> -->
				</template>
				<template v-else>暂无操作</template>
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
                <el-form-item label="商品名称" prop="title">
                    <el-input v-model="form.title" placeholder="请输入商品名称，不能超过60个字符"/>
                </el-form-item>
                <el-form-item label="封面" prop="cover">
                   <choose-image :limit="1" v-model="form.cover"></choose-image>
                </el-form-item>
                <el-form-item label="商品分类" prop="category_id">
                    <el-select v-model="form.category_id" 
                    placeholder="请选择商品分类">
                        <el-option
                        v-for="item in category_list"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id" />
                    </el-select>
                </el-form-item>
                <el-form-item label="商品描述" prop="desc">
                    <el-input  type="textarea" v-model="form.desc"  placeholder="选填，商品卖点简述，例如：此款商品美观大方 性价比较高 不容错过"/>
                </el-form-item>
                <el-form-item label="商品单位" prop="unit">
                    <el-input v-model="form.unit" placeholder="请输入商品单位" style="width:50%;"/>
                </el-form-item>
                <el-form-item label="总库存" prop="stock">
                    <el-input type="number" v-model="form.stock"
                    style="width:40%;">
                        <template #append>件</template>
                    </el-input>
                </el-form-item>
                <el-form-item label="库存预警" prop="min_stock">
                    <el-input type="number" v-model="form.min_stock" style="width:40%;">
                        <template #append>件</template>
                    </el-input>
                </el-form-item>
                <el-form-item label="最低销售价" prop="min_price">
                    <el-input type="number" v-model="form.min_price" style="width:40%;">
                        <template #append>元</template>
                    </el-input>
                </el-form-item>
                <el-form-item label="最低原价" prop="min_oprice">
                    <el-input type="number" v-model="form.min_oprice" style="width:40%;">
                        <template #append>元</template>
                    </el-input>
                </el-form-item>
                <el-form-item label="库存显示" prop="stock_display">
                    <el-radio-group v-model="form.stock_display" >
                        <el-radio :label="1" border>是</el-radio>
                        <el-radio :label="0" border>否</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="是否上架" prop="status">
                    <el-radio-group v-model="form.status" >
                        <el-radio :label="0" border>放入仓库</el-radio>
                        <el-radio :label="1" border>立即上架</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
        </form-drawer>
    
        <banners ref="bannersRef" @reload-data="getData"></banners>
        <content ref="contentRef" @reload-data="getData"></content>
        <skus ref="skusRef" @reload-data="getData"></skus>
        
    </el-card>
</template>
<script setup>
    import { ref,reactive,toRef } from 'vue'
    import SearchHeader from '~/components/SearchHeader.vue'
    import SearchHeaderItem from '~/components/SearchHeaderItem.vue'
    import ListHeader from '~/components/ListHeader.vue'
    import FormDrawer from '~/components/FormDrawer.vue'
    import ChooseImage from '~/components/ChooseImage.vue'
    import banners from './banners.vue'
    import content from './content.vue'
    import skus from './skus.vue'
    import { useInitTable,useInitForm } from '~/composables/useCommon'
    import { showModal,showPrompt,showLoading,hideLoading,toast,showFullLoading,hideFullLoading } from '~/composables/util'
    import { 
        getCategoryList,
    } from '~/api/category'
    import { 
        getGoodsList,
        deleteGoods,
        createGoods,
        updateGoods,
        updateGoodsStatus,
        restoreGoods,
        destroyGoods,
        readGoods,
        checkGoods
    } from '~/api/goods'


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
            title:"",
			category_id:""
        },
        // 获取数据的方法
        getList:getGoodsList,
        // 获取数据成功之后的回调
        success:(res)=>{
            total.value = res.totalCount
            tableData.value = res.list.map(o=>{
                o.statusLoading = false
                return o
            })
        },
        // 删除/批量删除api
        deleteData:deleteGoods,
    })

    // 初始化表格
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
            title:null,
            category_id:null,
            cover:null,
            desc:null,
            unit:"件",
            stock:100,
            min_stock:10,
            ischeck:0,
            status:0,
            stock_display:0,
            min_price:0,
            min_oprice:0,
        },
        // 表单验证规则
        rules:{},
        // 获取数据方法
        getData,
        // 新增数据api
        createData:createGoods,
        // 修改数据api
        updateData:updateGoods,
    })

    // tab切换
    const tabbars = ref([
        { name:"全部",key:"all"},
        { name:"审核中",key:"checking"},
        { name:"出售中",key:"saling"},
        { name:"已下架",key:"off"},
        { name:"库存预警" ,key:"min_stock"},
        { name:"回收站" ,key:"delete"},
    ])

    // 商品分类
    const category_list = ref([])
    getCategoryList().then(res=>category_list.value = res)

    // 设置轮播图
    const bannersRef = ref(null)
    const handleSetGoodsBanners = (id)=>bannersRef.value.open(id)

    // 设置商品详情
    const contentRef = ref(null)
    const handleSetGoodsContent = (id)=>contentRef.value.open(id)

    // 设置商品规格
    const skusRef = ref(null)
    const handleSetGoodsSkus = (id)=>skusRef.value.open(id)

    // 批量上架/下架
    const changeStatus = (status)=>useMultiAction(()=>updateGoodsStatus(multipleSelectionIds.value,status))

    // 审核商品
    const handleCheckGoods = (row,ischeck)=>{
        showFullLoading()
        checkGoods(row.id,ischeck).then(res=>{
            toast("操作成功")
            getData()
        }).finally(()=>hideFullLoading())
    }

    // 批量恢复商品
    const handleRestoreGoods = ()=>useMultiAction(()=>restoreGoods(multipleSelectionIds.value))

    // 彻底删除
    const handleDestroyGoods = ()=>useMultiAction(()=>destroyGoods(multipleSelectionIds.value))

    // 批量操作
    function useMultiAction(func){
        if(hasMulti()){
            showFullLoading()
            func().then(res=>{
                toast("操作成功")
                getData()
            }).finally(()=>hideFullLoading())
        }
    }

    // 批量操作验证
    function hasMulti(){
        if(multipleSelectionIds.value.length == 0){
            toast("请先选择商品","error")
            return false
        }
        return true
    }
</script>
<style>

</style>