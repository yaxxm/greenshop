<template>
  <div class="f-header">
      <router-link to="/" tag="span" class="logo">
        <el-icon size="25" class="mr-2"><eleme-filled /></el-icon>
        帝莎编程
      </router-link>
      <el-icon size="20" class="icon-btn" @click="handleAsideMenu">
        <fold v-if="isopen"/>
        <expand v-else/>
      </el-icon>
      <el-tooltip
        class="item"
        effect="dark"
        content="刷新"
        placement="bottom"
      >
      <el-icon size="20" class="icon-btn" @click="handleRefresh"><refresh /></el-icon>
      </el-tooltip>
      <div class="ml-auto flex">
        <el-tooltip
          class="item"
          effect="dark"
          content="点击查看完整开发教程"
          placement="bottom"
        >
        <el-icon size="20" class="icon-btn" @click="openTest">
          <video-camera />
        </el-icon>
        </el-tooltip>

        <el-tooltip
          class="item"
          effect="dark"
          :content="isFullscreen ? '退出全屏':'全屏'"
          placement="bottom"
        >
        <el-icon size="20" class="icon-btn" @click="toggle">
          <full-screen v-if="!isFullscreen"/>
          <aim v-else/>
        </el-icon>
        </el-tooltip>
        <!-- <el-icon size="20" class="icon-btn" @click="handleBell"><bell /></el-icon> -->
        <el-dropdown class="dropdown" @command="handleCommand">
          <span class="flex items-center">
            <el-avatar :size="25" :src="$store.state.user.avatar" class="mr-2"></el-avatar> {{ $store.state.user.username }}
            <el-icon class="el-icon--right">
              <arrow-down />
            </el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="resetPassword">修改密码</el-dropdown-item>
              <el-dropdown-item command="logout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
  </div>

  <form-drawer ref="formDrawerRef" title="修改密码" destroy-on-close @submit="handleResetPassword">
        <el-form :model="form" ref="formRef" :rules="rules" label-width="80px" :inline="false" size="small">
            <el-form-item label="旧密码" prop="oldpassword">
                <el-input v-model="form.oldpassword"></el-input>
            </el-form-item>
            <el-form-item label="新密码" prop="password">
                <el-input v-model="form.password"></el-input>
            </el-form-item>
            <el-form-item label="确认密码" prop="repassword">
                <el-input v-model="form.repassword"></el-input>
            </el-form-item>
        </el-form>
    </form-drawer>

</template>
<script setup>
import { ref,onBeforeUnmount,computed,reactive,readonly } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useStore } from 'vuex'
import { useFullscreen } from '@vueuse/core'
import { showModal,toast,showFullLoading,hideLoading } from '~/composables/util.js'
import FormDrawer from '~/components/FormDrawer.vue'
import { logout,updatepassword } from '~/api/manager'

const { isFullscreen, enter, exit, toggle } = useFullscreen()
const router = useRouter()
const route = useRoute()
const store = useStore()

// 展开/收起侧边菜单
const handleAsideMenu = ()=> store.commit('handleAsideMenu')
const isopen = computed(()=>store.state.asideWidth == "250px")

// 刷新
const handleRefresh = ()=> location.reload()

// 消息通知
const handleBell = ()=> router.push("/comment/list")

// 重置密码
const formDrawerRef = ref(null)
const formRef = ref(null)
const form = reactive({
  oldpassword:"",
  password:"",
  repassword:""
})
const rules = readonly({
  oldpassword: [{
    required: true,
    message: '旧密码必填',
    trigger: 'blur',
  }],
  password: [{
    required: true,
    message: '新密码必填',
    trigger: 'blur',
  }],
  repassword:[{
    required: true,
    message: '确认密码必填',
    trigger: 'blur',
  },{
    validator(rule,value,callback){
      if(value != form.password){
        return callback(new Error('确认密码和新密码一致'))
      }
      callback()
    },
    trigger: 'blur',
  }]
})
const handleResetPassword = ()=>{
  formRef.value.validate((valid)=>{
    if(!valid) return
    updatepassword(form).then(res=>{
      toast("修改密码成功，请重新登录")
      store.dispatch("logout")
      router.push("/login")
    })
  })
}

// 头像下拉菜单选中
const handleCommand = (command)=>{
  switch (command) {
    case "logout":
      showModal("是否要退出登录").then(()=>{
        showFullLoading()
        logout().finally(()=>{
          store.dispatch("logout")
          router.push("/login")
          toast("退出登录成功")
          hideLoading()
        })
      })
      break;
    case "resetPassword":
      formDrawerRef.value.open()
      break;
    default:
      break;
  }
}

function openTest(){
  window.open('https://study.163.com/course/courseMain.htm?courseId=1212775807&share=2&shareId=480000001892585','_blank')
}

</script>
<style>
.f-header {
  @apply fixed top-0 left-0 right-0 z-60 bg-indigo-700 text-light-50 flex items-center shadow;
  height: 64px;
}
.logo{
    width: 250px;
    @apply flex justify-center items-center font-sans text-xl font-thin text-indigo-100;
}
.f-header .icon-btn{
  @apply flex justify-center items-center;
  height: 64px;
  width: 42px;
  cursor: pointer;
}
.f-header .icon-btn:hover{
  @apply bg-indigo-600;
}
.f-header .dropdown{
  height: 64px;
  @apply flex justify-center items-center text-indigo-50 mx-5;
  cursor: pointer;
}
</style>