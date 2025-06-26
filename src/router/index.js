import {
    createRouter as _createRouter,
    createWebHashHistory,
} from 'vue-router'

import adminLayout from "~/layouts/admin.vue"
const routes = [{
        path: "/",
        component: adminLayout,
        children: [{
                path: "/",
                component: () =>
                    import ("~/pages/index.vue"),
                meta: {
                    title: "后台首页"
                }
            },
            {
                path: "/goods/list",
                component: () =>
                    import ("~/pages/goods/list.vue"),
                meta: {
                    title: "商城管理"
                }
            },
            {
                path: "/category/list",
                component: () =>
                    import ("~/pages/category/list.vue"),
                meta: {
                    title: "分类管理"
                }
            },
            {
                path: "/skus/list",
                component: () =>
                    import ("~/pages/skus/list.vue"),
                meta: {
                    title: "规格管理"
                }
            },
            {
                path: "/comment/list",
                component: () =>
                    import ("~/pages/comment/list.vue"),
                meta: {
                    title: "评论管理"
                }
            },
            {
                path: "/user/list",
                component: () =>
                    import ("~/pages/user/list.vue"),
                meta: {
                    title: "用户管理"
                }
            },
            {
                path: "/level/list",
                component: () =>
                    import ("~/pages/level/list.vue"),
                meta: {
                    title: "会员等级"
                }
            },
            {
                path: "/coupon/list",
                component: () =>
                    import ("~/pages/coupon/list.vue"),
                meta: {
                    title: "优惠券管理"
                }
            },
            {
                path: "/order/list",
                component: () =>
                    import ("~/pages/order/list.vue"),
                meta: {
                    title: "订单管理"
                }
            },
            {
                path: "/setting/base",
                component: () =>
                    import ("~/pages/setting/base.vue"),
                meta: {
                    title: "基础设置"
                }
            },
            {
                path: "/setting/buy",
                component: () =>
                    import ("~/pages/setting/buy.vue"),
                meta: {
                    title: "支付设置"
                }
            },
            {
                path: "/notice/list",
                component: () =>
                    import ("~/pages/notice/list.vue"),
                meta: {
                    title: "公告管理"
                }
            },
            {
                path: "/setting/ship",
                component: () =>
                    import ("~/pages/setting/ship.vue"),
                meta: {
                    title: "物流设置"
                }
            },
            {
                path: "/image/list",
                component: () =>
                    import ("~/pages/image/list.vue"),
                meta: {
                    title: "图库管理"
                }
            },
            {
                path: "/manager/list",
                component: () =>
                    import ("~/pages/manager/list.vue"),
                meta: {
                    title: "管理员管理"
                }
            },
            {
                path: "/role/list",
                component: () =>
                    import ("~/pages/role/list.vue"),
                meta: {
                    title: "角色管理"
                }
            },
            {
                path: "/access/list",
                component: () =>
                    import ("~/pages/access/list.vue"),
                meta: {
                    title: "权限管理"
                }
            },
            {
                path: "/distribution/index",
                component: () =>
                    import ("~/pages/distribution/index.vue"),
                meta: {
                    title: "分销员管理"
                }
            },
            {
                path: "/distribution/setting",
                component: () =>
                    import ("~/pages/distribution/setting.vue"),
                meta: {
                    title: "分销设置"
                }
            },
        ],
    },
    {
        path: "/login",
        component: () =>
            import ("~/pages/login.vue"),
        meta: {
            title: "登录页"
        }
    },

    {
        path: '/:pathMatch(.*)*',
        name: '404',
        component: () =>
            import ("~/pages/404.vue"),
    }
]

function createRouter() {
    return _createRouter({
        history: createWebHashHistory(),
        routes
    })
}

const router = createRouter()

export default router