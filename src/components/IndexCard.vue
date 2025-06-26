<template>
    <el-card shadow="never" class="border-0">
        <template #header>
        <div class="flex justify-between">
            <span class="text-sm">{{ title }}</span>
            <el-tag type="danger" size="small" effect="plain">{{ tip }}</el-tag>
        </div>
    </template>
        <el-row :gutter="20">
             <template v-if="btns.length == 0">
                <el-col :span="6" v-for="i in 4" :key="i">
                    <el-skeleton style="width: 100%;" loading animated>
                        <template #template>
                            <el-card>
                                <div class="flex flex-col items-center justify-center pointer">
                                    <el-skeleton-item variant="h3" style="width: 30%" class="mb-3"/>
                                    <el-skeleton-item variant="h3" style="width: 70%" />
                                </div>
                            </el-card>
                        </template>
                    </el-skeleton>
                </el-col>
            </template>
            <el-col :span="6" v-for="(item,index) in btns" :key="index">
                <el-card shadow="hover" class="border-0 bg-light-400">
                    <div class="flex flex-col items-center justify-center pointer">
                        <span class="text-xl mb-2">{{ item.value }}</span>
                        <span class="text-sm text-gray-500">{{ item.label }}</span>
                    </div>
                </el-card>
            </el-col>
        </el-row>
    </el-card>
</template>
<script setup>
defineProps({
    title:String,
    tip:String,
    btns:Array
})
</script>