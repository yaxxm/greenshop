<template>
    <div class="f-tag-list" :style="{ left:$store.state.asideWidth }">
        <span class="tag-btn text-gray-500 bg-transparent" 
        :class="{ 'text-gray-300':isMin }"
        @click="handleScroll('pre')"
        v-if="showPreBtn">
            <el-icon><arrow-left-bold /></el-icon>
        </span>
        <div ref="tagList" class="tag-left" @scroll="onScroll">
            <span
            :ref="el => { if (el) tagBtn[index] = el }"
            class="tag-btn text-gray-500 mr-2" 
            v-for="(item,index) in tagListData" 
            :key="index"
            :class="{ 'tag-btn-active': item.path == activePath }"
            @click="$router.push(item.path)">
                {{ item.title }}
                <el-icon class="ml-1" v-if="item.path != '/'" @click.stop="handleCloseTag(item.path)"><close /></el-icon>
            </span>
        </div>
        <span class="tag-btn text-gray-500 bg-transparent" 
        :class="{ 'text-gray-300':isMax }"
        @click="handleScroll('next')"
        v-if="showNextBtn">
            <el-icon><arrow-right-bold /></el-icon>
        </span>
        <span class="ml-auto tag-btn">
            <el-dropdown 
            placement="bottom-end"
            @command="handleClose">
                <el-icon><arrow-down /></el-icon>
                <template #dropdown>
                <el-dropdown-menu>
                    <el-dropdown-item command="clearOtherTag">关闭其他</el-dropdown-item>
                    <el-dropdown-item command="clearAllTag">全部关闭</el-dropdown-item>
                </el-dropdown-menu>
                </template>
            </el-dropdown>
        </span>
    </div>
    <div style="height:44px;"></div>
</template>
<script setup>
    import { ref,onMounted, computed } from 'vue'
    import { onBeforeRouteUpdate,useRoute,useRouter } from 'vue-router'
    import { useStore } from 'vuex'
    import { useResizeObserver } from '@vueuse/core'
    const route = useRoute()
    const router = useRouter()
    const store = useStore()
    // 绑定dom
    const tagList = ref(null)
    const tagBtn = ref([])

    const isMin = ref(true)
    const isMax = ref(false)
    const showPreBtn = ref(false)
    const showNextBtn = ref(false)
    
    const activePath = ref(route.path)
    // 初始化tagList
    const { tagListData,onScroll } = useInitTagList()

    // 路由守卫
    onBeforeRouteUpdate((to,from)=>{
        store.commit("addTag",{
            title:to.meta.title,
            path:to.path
        })
        activePath.value = to.path

        setTimeout(()=>{
            activeTag(to.path,300)
        },200)
    })

    // 处理关闭命令
    const handleClose = (c)=>{
        if(c == "clearAllTag"){
            router.push("/")
        }
        store.commit(c,activePath.value)
    }

    // 关闭tag
    const handleCloseTag = (path)=>{
        if(path == activePath.value){
            router.push("/")
        }
        store.commit("removeTag",path)
    }


    // 上一页/下一页
    const handleScroll = (type)=>{
        if((type == 'next' && isMax.value) || (type == 'pre' && isMin.value)){
            return
        }
        let clientWidth = tagList.value.clientWidth
        let scrollWidth = tagList.value.scrollWidth
        let max = scrollWidth - clientWidth
        let scrollLeft = tagList.value.scrollLeft
        if(type == 'next'){
            scrollLeft = scrollLeft + clientWidth
            // tagList.value.scrollLeft = scrollLeft > max ? max : scrollLeft
            animateScrollLeft(scrollLeft > max ? max : scrollLeft,200)
        } else {
            scrollLeft = scrollLeft - clientWidth
            // tagList.value.scrollLeft = scrollLeft < 0 ? 0 : scrollLeft
            animateScrollLeft(scrollLeft < 0 ? 0 : scrollLeft,200)
        }
    }

    // 获取tagList的相关状态
    function getTagListState(){
        let clientWidth = tagList.value.clientWidth
        let scrollWidth = tagList.value.scrollWidth
        let max = scrollWidth - clientWidth
        let min = 0
        isMin.value = tagList.value.scrollLeft == min
        isMax.value = tagList.value.scrollLeft == max

        showPreBtn.value = showNextBtn.value = max > 0
    }

    // 让当前激活标签处于可视范围
    function activeTag(path,time = 0){
        let clientWidth = tagList.value.clientWidth
        let index = tagListData.value.findIndex(o=>o.path == path)
        let el = tagBtn.value[index]
        if(el){
            let scrollLeft = el.offsetLeft
            animateScrollLeft(scrollLeft - 40,time)
        }
    }

    // 滚动动画
    function animateScrollLeft(number = 0, time){
        if(number < 0){
            number = 0
        }
        if (!time) {
            tagList.value.scrollLeft = number;
            return number;
        }
        const spacingTime = 20; // 设置循环的间隔时间  值越小消耗性能越高
        let spacingInex = time / spacingTime; // 计算循环的次数
        let nowLeft = tagList.value.scrollLeft; // 获取当前滚动条位置
        let everLeft = (number - nowLeft) / spacingInex; // 计算每次滑动的距离
        let scrollTimer = setInterval(() => {
            if (spacingInex > 0) {
                spacingInex--;
                animateScrollLeft(nowLeft += everLeft);
            } else {
                clearInterval(scrollTimer); // 清除计时器
            }
        }, spacingTime);
    };

    // 初始化taglist
    function useInitTagList(){
        store.commit("initTagList")
        const tagListData = computed(()=>store.state.tagList)

        // 添加标签页
        store.commit("addTag",{
            title:route.meta.title,
            path:route.path
        })

        // 监听tagList宽高变化
        useResizeObserver(tagList, (entries) => {
            getTagListState()
        })

        // 监听滚动
        const onScroll = (e)=> getTagListState()

        // 页面渲染
        onMounted(()=>{
            getTagListState()

            activeTag(activePath.value)
        })

        return {
            tagListData,
            onScroll
        }
    }
</script>
<style scoped>
.f-tag-list{
    @apply fixed right-0 flex items-center px-2 bg-gray-100;
    top: 64px;
    height: 44px;
    z-index: 100;
}
.tag-left{
    @apply flex-1 flex items-center;
    overflow: hidden;
}
.tag-left::-webkit-scrollbar {
    width: 0px;
    height: 4px;
}
.tag-btn{
    height: 32px;
    @apply flex items-center justify-center rounded bg-light-50 px-3 text-sm flex-shrink-0;
    cursor: pointer;
}
.tag-btn-active{
    @apply text-indigo-500;
}
</style>