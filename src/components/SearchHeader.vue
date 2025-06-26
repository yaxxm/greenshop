<template>
    <el-form :model="model" size="small" label-width="80px" class="mb-3">
        <el-row :gutter="20">
            <slot></slot>
            <template v-if="showSearch">
                <slot name="show"></slot>
            </template>

            <el-col :span="8" :offset="offset" >
                <div class="flex items-center justify-end">
                    <el-button type="primary" @click="$emit('search')">搜索</el-button>
                    <el-button @click="$emit('reset')">重置</el-button>
                    <el-button v-if="hasShowSearch" type="text" @click="showSearch = !showSearch">
                        {{ showSearch ? "收起" : "展开" }}
                        <el-icon class="ml-1">
                            <component :is="showSearch ? 'arrow-up-bold' : 'arrow-down-bold'"></component>
                        </el-icon>
                    </el-button>
                </div>
            </el-col>
        </el-row>
    </el-form>
</template>
<script setup>
    import { ref,computed,toRefs, useSlots } from 'vue'
    const props = defineProps({
        model:Object,
    })

    defineEmits(["search","reset"])
    const showSearch = ref(false)
    
    const offset = computed(()=> (!onlyOne.value || showSearch.value) ? 0 : 8)

    const slots = useSlots()
    const onlyOne = ref(true)
    if(slots.default){
       onlyOne.value = (slots.default()).length == 1 
    }

    const hasShowSearch = ref(!!slots.show)
</script>