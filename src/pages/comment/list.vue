<template>
    <el-card shadow="never" class="border-0">
        <!-- 搜索 -->
        <search-header :model="searchForm" @search="getData" @reset="resetSearchForm">
            <search-header-item label="关键词" prop="title">
                <el-input v-model="searchForm.title" placeholder="要搜索的商品" clearable></el-input>
            </search-header-item>
        </search-header>

        <!-- 表格 -->
        <el-table
        id="list-table" 
        :data="tableData" 
        style="width: 100%" 
        stripe
        lazy>
            <el-table-column type="expand">
                <template #default="{ row }">
                    <div class="flex pl-18">
                        <el-avatar :size="50" class="mr-3" :src="row.user.avatar"/>
                        <div class="flex-1">
                            <h6 class="mt-0 flex items-center">
                                {{row.user.username}} 
                                <small class="ml-2 text-gray-400">{{row.review_time}}</small>
                                <el-button v-permission="['reviewComment,POST']" v-if="!row.extra && !textareaEdit" class="ml-auto" size="small" @click="openTextarea()">回复</el-button>
                            </h6>
                            {{row.review.data}}
                            <div class="py-2">
                                <el-image v-for="(item,index) in row.review.image" :key="index" :src="item" style="max-width: 100px;max-height: 100px;" fit="cover" class="rounded"/>
                            </div>

                            <!-- 回复框 -->
                            <div v-if="textareaEdit">
                            <el-input 
                                type="textarea"
                                :rows="2"
                                placeholder="请输入评价内容"
                                v-model="textarea">
                            </el-input>
                            <div class="py-2">
                                <el-button class="ml-auto mr-2" type="primary" size="small" @click="review(row.id)" :loading="textareaLoading">回复</el-button>
                                <el-button class="ml-auto" size="small" @click="textareaEdit = false" plain>取消</el-button>
                            </div>
                        </div>

                            <div v-if="row.extra && !textareaEdit">
                                <div class="mt-3 bg-gray-100 p-3 rounded" v-for="(item,index) in row.extra" :key="index">
                                    <h6 class="mt-0 flex text-md font-bold">
                                        客服
                                        <el-button v-permission="['reviewComment,POST']"  v-if="!textareaEdit" class="ml-auto" type="info" size="small" @click="openTextarea(item.data)">修改</el-button>
                                    </h6>
                                    <p>{{item.data}}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </template>
            </el-table-column>

            <el-table-column label="ID" width="70" align="center" prop="id"/>
            <el-table-column label="商品" width="300">
                <template #default="{ row }">
                    <div class="flex">
                        <el-image class="mr-3 rounded" style="width: 50px;height: 50px;" :src="row.goods_item ? row.goods_item.cover : ''" fit="cover"/>
                        <div class="media-body">
                            <p class="mt-0">{{row.goods_item ? row.goods_item.title : '商品已被删除'}}</p>
                        </div>
                    </div>
                </template>
            </el-table-column>
            <el-table-column width="250" label="评价信息">
                <template #default="{ row }">
                    <div class="flex flex-col">
                        <p>用户：{{row.user.username}}</p>
                        <p><el-rate
                            v-model="row.rating"
                            disabled
                            show-score
                            text-color="#ff9900"
                            score-template="{value}">
                            </el-rate></p>
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="review_time" align="center" width="200" label="评价时间"/>
            <el-table-column v-permission="['updateCommentStatus,POST']"  align="center" label="是否显示" width="150">
                <template #default="{ row }">
                    <el-switch @change="handleStatusChange($event,row)" :active-value="1" :inactive-value="0" :model-value="row.status"
                    :loading="row.statusLoading" />
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

    </el-card>
</template>
<script setup>
    import { ref } from 'vue'
    import SearchHeader from '~/components/SearchHeader.vue'
    import SearchHeaderItem from '~/components/SearchHeaderItem.vue'
    import { useInitTable } from '~/composables/useCommon'
    import { toast,showLoading,hideLoading } from '~/composables/util'
    import { 
        getGoodsCommentList,
        updateGoodsCommentStatus,
        reviewGoodsComment
    } from '~/api/goods_comment'


    // 初始化表格数据
    const {
        // 搜索
        searchForm,
        resetSearchForm,
        // 分页
        currentPage,
        limit,
        total,
        // 表格数据
        tableData,
        // 获取数据方法
        getData,
        // 修改状态
        handleStatusChange
    } = useInitTable({
        // 搜索表单
        searchForm: {
            title:""
        },
        // 获取数据的方法
        getList:getGoodsCommentList,
        // 获取数据成功之后的回调
        success:(res)=>{
            total.value = res.totalCount
            tableData.value = res.list.map(o=>{
                o.statusLoading = false
                return o
            })
        },
        // 修改状态api
        updateStatus:updateGoodsCommentStatus,
    })


    // 回复评价
    const textareaEdit = ref(false)
    const textarea = ref("")
    const textareaLoading = ref(false)
    const review = (id)=>{
        if(textarea.value == '') return toast("回复内容不能为空",'error')
        textareaLoading.value = true
        reviewGoodsComment(id,textarea.value).then(res=>{
            textareaEdit.value = false
            toast('回复成功')
            getData()
        }).finally(err=>textareaLoading.value = false)
    }
    const openTextarea = (data = "")=>{
        textarea.value = data
        textareaEdit.value = true
    }

</script>

<style>
</style>