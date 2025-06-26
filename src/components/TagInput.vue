<template>
    <el-tag
    v-for="tag in dynamicTags"
    :key="tag"
    closable
    :disable-transitions="false"
    @close="handleClose(tag)"
  >
    {{ tag }}
  </el-tag>
  <el-input
    v-if="inputVisible"
    ref="saveTagInput"
    v-model="inputValue"
    class="input-new-tag"
    size="small"
    @keyup.enter="handleInputConfirm"
    @blur="handleInputConfirm"
  >
  </el-input>
  <el-button v-else class="button-new-tag" size="small" @click="showInput"
    >+ 添加值</el-button
  >
</template>
<script setup>
    import { ref,nextTick,computed,toRef, unref } from 'vue'

    const props = defineProps({
        modelValue:{
            type:String,
            default:""
        }
    })

    const emit = defineEmits(["update:modelValue"])

    const mv = toRef(props,"modelValue")

    const dynamicTags = computed({
        get(){
            return mv.value ? mv.value.split(",") : []
        },
    })

    const inputVisible = ref(false)
    const inputValue = ref("")
    const saveTagInput = ref(null)

    // 删除tag
    const handleClose = (tag)=>{
        let tags = unref(dynamicTags)
        tags.splice(tags.indexOf(tag), 1)
        emit("update:modelValue",tags.join(","))
    }

    // 显示input框
    const showInput = ()=> {
      inputVisible.value = true
      nextTick((_) => {
        saveTagInput.value.$refs.input.focus()
      })
    }

    const handleInputConfirm = ()=> {
      if (inputValue.value) {
        let tags = unref(dynamicTags)
        tags.push(inputValue.value)
        emit("update:modelValue",tags.join(","))
      }
      inputVisible.value = false
      inputValue.value = ''
    }
</script>
<style>
.el-tag {
  margin-left: 10px;
  margin-bottom: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 25px;
  line-height: 25px;
  padding-top: 0;
  padding-bottom: 0;
  margin-bottom: 10px;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  margin-bottom: 10px;
  vertical-align: bottom;
}
</style>