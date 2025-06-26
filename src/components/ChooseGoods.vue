<template>
    <el-dialog
        top="5vh"
        v-model="dialogVisible"
        title="商品选择"
        width="80%"
        destroy-on-close
    >
    <el-container class="bg-white rounded border" style="height:65vh;">
      <el-header class="flex items-center px-3">
          <el-input size="mini" v-model="searchForm.title" placeholder="商品名称" clearable style="width:150px;"></el-input>
          <el-button type="primary" size="mini" @click="getData" class="ml-2">搜索</el-button>
      </el-header>
        <el-main class="relative p-0">
            <div class="c-scroll">
                <el-table
                    id="goods-list-table" 
                    ref="multipleTableRef" 
                    @selection-change="handleSelectionChange" 
                    :data="tableData" 
                    style="width: 100%" 
                    stripe
                    lazy>
                        <el-table-column fixed="left" type="selection" width="55" />
                        <el-table-column label="商品" min-width="300">
                            <template #default="{ row }">
                                <div class="flex">
                                    <el-image class="mr-3 rounded" style="width: 50px;height: 50px;" :src="row.cover" fit="cover"></el-image>
                                    <div class="flex-1">
                                        <p>{{row.title}}</p>
                                        <p class="text-xs mb-1 text-gray-400">分类：{{row.category ? row.category.name : '未分类'}}</p>
                                        <p class="text-xs text-gray-400">创建时间：{{row.create_time}}</p>
                                    </div>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column prop="stock" align="center" width="90" label="总库存"/>
                        <el-table-column align="center" label=" 价格(元)" width="150">
                        <template #default="{ row }">
                            <span class="text-rose-500">￥{{row.min_price}}</span>
                            <el-divider direction="vertical"></el-divider>
                            <span class="text-gray-500 text-xs">￥{{row.min_oprice}}</span>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </el-main>
        <el-footer class="flex justify-center items-center">
            <el-pagination 
                :currentPage="currentPage" 
                background 
                layout="prev, pager, next" 
                :page-size="limit" 
                :total="total" 
                @current-change="getData"></el-pagination>
        </el-footer>
    </el-container>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="close">取消</el-button>
        <el-button type="primary" @click="submit">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script setup>
    import { ref,reactive, nextTick } from 'vue'
    import { useInitTable } from '~/composables/useCommon'
    import { toast } from '~/composables/util'

    import { 
        getGoodsList
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
    } = useInitTable({
        // 搜索表单
        searchForm: {
            tab:"saling",
            title:"",
			category_id:""
        },
        autoGetData:false,
        loading:"#goods-list-table",
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
    })

    const dialogVisible = ref(false)
    const callbackFunction = ref(false)
    const open = (callback = false)=>{
        callbackFunction.value = callback
        dialogVisible.value = true
        nextTick(()=>getData())
    }
    const close = ()=>{
        dialogVisible.value = false
        callbackFunction.value = false
    }

    const submit = ()=>{
        if(typeof callbackFunction.value == "function") callbackFunction.value(multipleSelectionIds.value)
        close()
    }

    defineExpose({ open })
</script>
<style scoped>

</style>