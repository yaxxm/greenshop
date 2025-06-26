<template>
    <el-drawer v-model="dialogVisible" title="导出订单" size="40%">
        <el-form :model="form" size="default" label-width="80px">
		    <el-form-item label="订单类型" prop="tab">
		      <el-select v-model="form.tab" placeholder="请选择">
		          <el-option
		            v-for="(item,index) in tabs"
		            :key="index" :label="item.name" 
                    :value="item.key"/>
		        </el-select>
		    </el-form-item>
		    <el-form-item label="时间范围" prop="time">
		      <el-date-picker
		        v-model="form.time"
		        type="daterange"
		        range-separator="至"
		        start-placeholder="开始日期"
		        end-placeholder="结束日期"
		        value-format="YYYY-MM-DD">
		      </el-date-picker>
		    </el-form-item>
            <el-form-item>
                <el-button type="primary" :loading="loading" @click="submit">
                    {{ loading ? "导出中..." : "导出" }}
                </el-button>
            </el-form-item>
		</el-form>
    </el-drawer>
</template>
<script setup>
    import { reactive, ref } from 'vue'
    import { exportOrder } from '~/api/order'
    import { toast } from '~/composables/util'

    defineProps({
        tabs:Array
    })

    const dialogVisible = ref(false)

    const open = ()=> dialogVisible.value = true
    const close = ()=> dialogVisible.value = false

    const form = reactive({
        tab:null,
        time:""
    })

    const loading = ref(false)
    const submit = ()=>{
        if(!form.tab) return toast("订单类型不能为空","error")
        loading.value = true
        let starttime = null
        let endtime = null
        const val = form.time
        if(val && Array.isArray(val)){
            starttime = val[0]
            endtime = val[1]
        }
        exportOrder({
            tab:form.tab,
            starttime,
            endtime
        }).then(data=>{
            let url = window.URL.createObjectURL(new Blob([data]))
            let link= document.createElement('a')
            link.style.display='none'
            link.href=url
            let filename = new Date().getTime() + '.xlsx';
            link.setAttribute('download', filename)
            document.body.appendChild(link)
            link.click()
            close()
        }).finally(()=>{
            loading.value = false
        })
    }

    defineExpose({ open })
</script>