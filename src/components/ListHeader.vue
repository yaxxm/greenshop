<template>
    <div class="flex items-center mb-4">
            <el-button v-if="showCreateBtn" type="primary" size="small" @click="$emit('create')">新增</el-button>
            <el-popconfirm  v-if="showDeleteBtn" title="是否要删除批量删除选中？" confirm-button-text="是" cancel-button-text="否" @confirm="$emit('delete')">
                <template #reference>
                    <el-button type="danger" size="small">批量删除</el-button>
                </template>
            </el-popconfirm>
        <slot></slot>
        <div class="ml-auto">
            <el-tooltip v-if="showRefreshBtn" effect="dark" content="刷新数据" placement="top">
                <el-link class="px-2" @click="$emit('refresh')">
                    <el-icon size="20"><refresh /></el-icon>
                </el-link>
            </el-tooltip>
            <el-tooltip v-if="showDownloadBtn" effect="dark" content="导出数据" placement="top">
                <el-link class="px-2" @click="$emit('download')">
                    <el-icon size="20"><download /></el-icon>
                </el-link>
            </el-tooltip>
        </div>
    </div>
</template>
<script setup>
    import { ref,computed } from 'vue'
    import { hasPermission } from "~/directive/permission.js"
    const props = defineProps({
        show:{
            type:String,
            default:""
        },
        permissions:{
            type:Object,
            default(){
                return {
                    create:"",
                    delete:"",
                    refresh:"",
                    download:""
                }
            }
        }
    })

    const emit = defineEmits(["create","delete","refresh","download"])

    const showCreateBtn = isShow("create")
    const showDeleteBtn = isShow("delete")
    const showRefreshBtn = isShow("refresh")
    const showDownloadBtn = isShow("download")
    // 是否显示
    function isShow(type){
        let p = props.permissions[type]
        if(p) return hasPermission([p])
        const show = props.show.split(",")
        return show.includes(type)
    }
</script>