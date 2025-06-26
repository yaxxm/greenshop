<template>
    <el-card shadow="never" class="border-0" id="list-table">
        <el-form :model="form" size="default" label-width="160px">
            <el-form-item label="物流查询key">
                <el-input v-model="form.ship" style="width: 50%;" placeholder="appkey"></el-input>
                <small class="text-gray-500 flex mt-1">用于查询物流信息，<a target="_blank" href="https://www.jisuapi.com/api/express/">接口申请（仅供参考）</a></small>
            </el-form-item>
            <el-form-item v-permission="['setSysSetting,POST']">
                <el-button type="primary" size="small" @click="submit">保存</el-button>
            </el-form-item>
        </el-form>
    </el-card>
</template>
<script setup>
    import { ref,reactive,onMounted } from 'vue'
    import { showLoading,hideLoading,toast } from '~/composables/util'
    import { 
        getSysconfig,
        setSysconfig,
    } from '~/api/sysconfig'

    const activeName = ref("first")
    const form = reactive({
        ship:""
    })

    function getData(){
        showLoading()
        getSysconfig().then(d=>{
            for (const k in form) {
                form[k] = d[k]
            }
        }).finally(()=>{
            hideLoading()
        })
    }

    onMounted(()=>getData())

    const submit = ()=>{
        showLoading()
        setSysconfig(form).then(res=>{
            toast("修改成功")
            getData()
        }).finally(()=>{
            hideLoading()
        })
    }
</script>