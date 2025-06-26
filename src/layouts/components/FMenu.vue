<template>
    <div class="f-menu" :style="{ width:$store.state.asideWidth }">
        
    <el-menu
    :default-active="defaultActive"
    class="border-0"
    :collapse-transition="false"
    unique-opened
    :collapse="isCollapse"
    @select="handleSelect">

    <!-- <el-menu-item index="https://study.163.com/course/courseMain.htm?courseId=1212775807&share=2&shareId=480000001892585">
        <el-icon><video-camera /></el-icon>
        <template #title>完整视频课程</template>
      </el-menu-item> -->

    <template v-for="(item,index) in asideMenus" :key="index">
      <el-sub-menu 
        v-if="item.child && item.child.length"
        :index="item.name">
        <template #title>
          <el-icon v-if="item.icon">
            <component :is="item.icon"></component>
          </el-icon>
          <span>{{ item.name }}</span>
        </template>
        <el-menu-item :index="item2.frontpath" v-for="(item2,index2) in item.child" :key="index2">
          <el-icon v-if="item2.icon">
            <component :is="item2.icon"></component>
          </el-icon>
          <template #title>{{ item2.name }}</template>
        </el-menu-item>
      </el-sub-menu>

      <el-menu-item :index="item.frontpath" v-else>
        <el-icon v-if="item.icon">
          <component :is="item.icon"></component>
        </el-icon>
        <template #title>{{ item.name }}</template>
      </el-menu-item>
    </template>

  </el-menu>
        
    </div>
</template>
<script setup>
    import { computed, ref } from 'vue'
    import { useStore } from 'vuex'
    import { useRouter,useRoute,onBeforeRouteUpdate } from 'vue-router'
    // import useTestData from '~/composables/testData'
    const store = useStore()
    const router = useRouter()
    const route = useRoute()

    // 是否展开菜单
    const isCollapse = computed(()=>!(store.state.asideWidth == "250px"))

    // 菜单列表
    const asideMenus = computed(()=>store.state.menus)

    // 默认选中
    const defaultActive = ref(route.path)

    // 路由守卫
    onBeforeRouteUpdate((to,from)=>{
        defaultActive.value = to.path
    })

    // 菜单选中事件
    const handleSelect = (path)=>{
      if(path == "https://study.163.com/course/courseMain.htm?courseId=1212775807&share=2&shareId=480000001892585"){
        window.open(path,'_blank')
        return;
      }
      router.push({ path })
    }
</script>
<style>
.f-menu{
    @apply bg-light-50 fixed left-0 bottom-0 z-60;
    top: 64px;
    overflow: auto;
    box-shadow: 2px 0 8px 0 rgb(29 35 41 / 5%);
}
.f-menu::-webkit-scrollbar {
    width: 0px;
}
</style>