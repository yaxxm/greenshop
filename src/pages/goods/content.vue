<template>
    <form-drawer ref="formDrawerRef" title="设置商品详情" @submit="submit">
        <el-form :model="form">
		    <el-form-item>
                <editor v-model="form.content"></editor>
		    </el-form-item>
		</el-form>
    </form-drawer>
</template>
<script setup>
    import { reactive, ref,nextTick } from 'vue'
    import FormDrawer from '~/components/FormDrawer.vue'
    import Editor from '~/components/Editor.vue'
    import { toast,showFullLoading,hideFullLoading } from '~/composables/util'

    import {
        readGoods,
        updateGoods
    } from '~/api/goods'
    const emit = defineEmits(["reloadData"])
    const form = reactive({
        content:""
    })


    const formDrawerRef = ref(null)
    const goodsId = ref(0)
    const open = (id)=> {
        goodsId.value = id
        showFullLoading()
        readGoods(id).then(res=>{
            form.content = res.content
            formDrawerRef.value.open()
        }).finally(()=>hideFullLoading())
    }
    const close = ()=> formDrawerRef.value.close()

    const loading = ref(false)
    const submit = ()=>{
        loading.value = true
        updateGoods(goodsId.value,form)
        .then(data=>{
            toast("设置商品详情成功")
            close()
            emit("reloadData")
        })
        .finally(()=>loading.value = false)
    }

    defineExpose({ open })
</script>