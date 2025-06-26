<template>
    <el-drawer v-model="dialogVisible" title="设置轮播图" size="50%">
        <el-form :model="form" size="default" label-width="80px">
		    <el-form-item label="轮播图" prop="banners">
                <choose-image :limit="9" v-model="form.banners"></choose-image>
		    </el-form-item>
            <el-form-item>
                <el-button type="primary" :loading="loading" @click="submit">
                    {{ loading ? "提交中..." : "提交" }}
                </el-button>
            </el-form-item>
		</el-form>
    </el-drawer>
</template>
<script setup>
    import { reactive, ref } from 'vue'
    import ChooseImage from '~/components/ChooseImage.vue'
    import { toast,showFullLoading,hideFullLoading } from '~/composables/util'

    import {
        readGoods,
        setGoodsBanner
    } from '~/api/goods'

    const emit = defineEmits(["reloadData"])

    const form = reactive({
        banners:[]
    })

    const dialogVisible = ref(false)
    const goodsId = ref(0)
    const open = (id)=> {
        goodsId.value = id
        showFullLoading()
        readGoods(id).then(res=>{
            form.banners = res.goodsBanner.map(o=>o.url)
            dialogVisible.value = true
        }).finally(()=>hideFullLoading())
    }
    const close = ()=> dialogVisible.value = false

    const loading = ref(false)
    const submit = ()=>{
        loading.value = true
        setGoodsBanner(goodsId.value,form)
        .then(data=>{
            toast("设置轮播图成功")
            close()
            emit("reloadData")
        })
        .finally(()=>loading.value = false)
    }

    defineExpose({ open })
</script>