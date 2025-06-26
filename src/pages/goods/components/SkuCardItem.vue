<template>
    <div v-loading="loading">
      <el-tag
        v-for="tag in item.goodsSkusCardValue"
        :key="tag"
        closable
        :disable-transitions="false"
        @close="handleClose(tag)"
        effect="plain"
      >
        <el-input v-model="tag.text" size="small" class="tag-edit-input" placeholder="规格值" @change="handleChange($event,tag)"></el-input>
      </el-tag>
      <el-input
        v-if="inputVisible"
        ref="saveTagInput"
        v-model="inputValue"
        class="input-new-tag border"
        size="small"
        @keyup.enter="handleInputConfirm"
        @blur="handleInputConfirm"
      >
      </el-input>
      <el-button v-else class="button-new-tag" size="small" @click="showInput">+ 添加值</el-button>
    </div>
</template>
<script setup>
    import { initSkusCardItem } from '~/composables/sku'

    const props = defineProps({
        skuCardId:[Number,String],
    })

    const { 
      item,
      loading,
      handleChange,
      handleInputConfirm,
      showInput,
      handleClose,
      inputVisible,
      inputValue,
      saveTagInput
    } = initSkusCardItem(props.skuCardId)

</script>
<style scoped>
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
}

:deep(.el-input__inner){
  border: 0!important;
}

.input-new-tag {
  width: 90px;
  margin-left: 10px;
  margin-bottom: 10px;
  vertical-align: bottom;
}
.tag-edit-input{
  width:100px;
  margin-left:-8px;
}
:deep(.tag-edit-input .el-input__inner){
  box-shadow: none!important;height: 22px;line-height: 22px;
}
</style>