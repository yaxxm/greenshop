import router from '~/router'
import store from '~/store'
import { getToken } from '~/composables/auth'
import { toast, showFullLoading, hideFullLoading } from '~/composables/util.js'

// 是否已经加载了管理员信息
let hasLoadManagerInfo = false

// 全局路由守卫
router.beforeEach(async(to, from, next) => {
    // 显示全局loading
    showFullLoading()

    // 跳过404页面
    if (to.path == "/404") {
        return next()
    }

    // 登录和权限验证
    const token = getToken()

    // 未登录
    if (!token && to.path != "/login") {
        toast("请先登录", "error")
        return next({ path: '/login' })
    }

    // 防止重复登录
    if (token && to.path == '/login') {
        toast("请勿重复登录", "error")
        return next({ path: from.path ? from.path : '/' })
    }
    

    // 权限验证
    if (token && !hasLoadManagerInfo) {
        let d = await store.dispatch("getInfo")
        if (d) {
            hasLoadManagerInfo = true
        }
    }

    // 如果到达登录页，hasLoadManagerInfo设为false
    if(to.path == "/login" && !token){
        hasLoadManagerInfo = false
    }

    // 设置页面标题
    let title = (to.meta.title ? to.meta.title : "") + "-帝莎编程商城后台"
    document.title = title

    next()
})

router.afterEach(() => hideFullLoading())