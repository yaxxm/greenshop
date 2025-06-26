<template>
  <router-view></router-view>
  <!-- 客服窗口组件 -->
  <CustomerService />
</template>
<script setup>
import CustomerService from './components/CustomerService.vue'
</script>
<style>
*{
  transition-property: width;
  transition-duration: 0.15s;
}
body{
  @apply bg-gray-100;
}
.container {
  width: 100%;
  padding-right:15px;
  padding-left: 15px;
  margin-right: auto;
  margin-left: auto;
}

@media (min-width: 576px) {
  .container {
    max-width: 540px;
  }
}
@media (min-width: 768px) {
  .container {
    max-width: 720px;
  }
}
@media (min-width: 992px) {
  .container {
    max-width: 960px;
  }
}
@media (min-width: 1200px) {
  .container {
    max-width: 1140px;
  }
}
@media (min-width: 1400px) {
  .container {
    max-width: 1320px;
  }
}
.pointer{
  cursor: pointer;
}

::-webkit-scrollbar {
    width: 4px;
    height: 6px;
}

::-webkit-scrollbar-corner {
    display: block;
}

::-webkit-scrollbar-thumb {
    border-radius: 8px;
    background-color: rgba(0, 0, 0, .2);
}

::-webkit-scrollbar-thumb,
 ::-webkit-scrollbar-track {
    border-right: 1px solid transparent;
    border-left: 1px solid transparent;
    background-color: rgba(0, 0, 0, .1);
}

.bg-transparent{
  background: transparent!important;
}

 #nprogress .bar {
    background: #f4f4f4 !important;
    height: 3px!important; 
}
#nprogress .peg{
  transform: rotate(3deg) translate(0px, -5px)!important;
}

.btn-text{
    cursor: pointer;
    @apply mx-2 text-blue-400 underline text-xs;
}
.btn-text-danger{
    @apply text-rose-500;
}
</style>
