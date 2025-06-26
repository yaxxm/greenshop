<template>
    <el-container>
      <el-header>
          <f-header></f-header>
      </el-header>
      <el-container>
        <el-aside :width="$store.state.asideWidth">
            <f-menu></f-menu>
        </el-aside>
        <el-main>
            <f-tag-list></f-tag-list>
            <router-view></router-view>

            <div class="text-gray-400 text-xs font-thin" style="text-align: center;margin: 35px 0;height: 50px">本站点由 <a href="https://study.163.com/course/courseMain.htm?courseId=1212775807&share=2&shareId=480000001892585" target="_blank" class="font-normal border-b border-purple-300 text-purple-400">《Vue3实战商城后台管理系统开发视频课程》</a> 提供</div>
        </el-main>
      </el-container>
    </el-container>
</template>
<script setup>
import FHeader from './components/FHeader.vue'
import FMenu from './components/FMenu.vue'
import FTagList from './components/FTagList.vue'
</script>
<style>

</style>