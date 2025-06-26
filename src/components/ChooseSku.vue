<template>
    <el-dialog
        top="5vh"
        v-model="dialogVisible"
        title="规格选择"
        width="80%"
    >
    <el-container class="bg-white rounded border" style="height:65vh;">
      <el-container>
        <el-aside width="220px" class="relative ">
            
            <div class="sku-aside flex flex-col">
                <div class="flex-1" id="sku-list-table" style="overflow-y:auto;">
                    <div class="aside-list" :class="{ 'active':activeId == item.id }" v-for="item in tableData" :key="item.id" @click="handleChangeActiveId(item.id)">
                        <span class="truncate" :title="item.name">{{ item.name }}</span> 
                    </div>
                </div>
                <div class="flex items-center justify-center" style="height:50px;">
                    <el-pagination 
                    :currentPage="currentPage" 
                    background 
                    layout="prev, next" 
                    :page-size="limit" 
                    :total="total" 
                    @current-change="getData"></el-pagination>
                </div>
            </div>

        </el-aside>
        <el-main class="relative ">
            <div class="c-scroll">
                <el-checkbox-group v-model="form.list" size="mini">
                    <el-checkbox v-for="sku in list" border :key="sku" :label="sku">
                        {{ sku }}
                    </el-checkbox>
                </el-checkbox-group>
            </div>
        </el-main>
      </el-container>
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
    import { ref,reactive } from 'vue'
    import { useInitTable } from '~/composables/useCommon'
    import { toast } from '~/composables/util'


    import { 
        getSkusList
    } from '~/api/skus'

    // 初始化表格数据
    const {
        // 分页
        currentPage,
        limit,
        total,
        // 表格数据
        tableData,
        // 获取数据方法
        getData,
    } = useInitTable({
        loading:"#sku-list-table",
        // 获取数据的方法
        getList:getSkusList,
        success:(res)=>{
            total.value = res.totalCount
            tableData.value = res.list
            const item = tableData.value[0]
            if(item){
                handleChangeActiveId(item.id)
            }
        },
    })

    const activeId = ref(0)
    const list = ref([])
    const form = reactive({
        name:"",
        list:[]
    })
    function handleChangeActiveId(id){
        activeId.value = id
        let item = tableData.value.find(o=>o.id == id)
        list.value = []
        form.list = []
        form.name = ""
        if(item){
            list.value = item.default.split(",")
            form.name = item.name
        }
    }


    const dialogVisible = ref(false)
    const callbackFunction = ref(false)
    const open = (callback = false)=>{
        callbackFunction.value = callback
        dialogVisible.value = true
    }
    const close = ()=>{
        dialogVisible.value = false
        callbackFunction.value = false
    }

    const submit = ()=>{

        if(typeof callbackFunction.value == "function"){
            callbackFunction.value(form)
        }

        close()
    }

    defineExpose({ open })
</script>
<style scoped>
.sku-aside{
    position:absolute;
    top:0;
    left:0;
    right:0;
    bottom:0;
    border-right:1px solid #eeeeee;
}
.aside-list{
    border-bottom: 1px solid #f4f4f4;
    cursor: pointer;
    @apply flex items-center p-3 text-sm text-gray-600;
}
.aside-list:hover,.active{
    @apply bg-blue-50;
}
</style>