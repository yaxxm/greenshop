import { createStore as _createStore } from 'vuex'
import { useCookies } from '@vueuse/integrations/useCookies'
import { setToken, removeToken } from '~/composables/auth'
import { login, getinfo } from '~/api/manager'
const store = _createStore({
    state() {
        return {
            // 侧边宽度
            asideWidth: "250px",

            // 多页标签
            tagList: [{
                title: "后台首页",
                path: "/"
            }],

            user: {},
            menus: [],
            ruleNames: [],
        }
    },
    mutations: {
        // 展开/缩起侧边
        handleAsideMenu(state) {
            state.asideWidth = state.asideWidth == "250px" ? "64px" : "250px"
        },
        // 添加标签页
        addTag(state, { path, title }) {
            let i = state.tagList.findIndex(o => o.path == path)
            if (i == -1) {
                state.tagList.push({
                    path,
                    title
                })

                // 存储cookie
                const cookies = useCookies(['tagList'])
                cookies.set("tagList", state.tagList)
            }

        },
        // 初始化tagList
        initTagList(state) {
            // 获取cookie
            const cookies = useCookies(['tagList'])
            const tagList = cookies.get("tagList")
            if (tagList) {
                state.tagList = tagList
            }
        },
        // 删除tag
        removeTag(state, path) {
            let i = state.tagList.findIndex(o => o.path == path)
            if (i != -1) {
                state.tagList.splice(i, 1)

                // 存储cookie
                const cookies = useCookies(['tagList'])
                cookies.set("tagList", state.tagList)
            }
        },
        // 关闭其他标签
        clearOtherTag(state, path) {
            state.tagList = state.tagList.filter(o => o.path == "/" || o.path == path)

            // 存储cookie
            const cookies = useCookies(['tagList'])
            cookies.set("tagList", state.tagList)
        },
        // 清除所有标签
        clearAllTag(state) {
            state.tagList = [{
                title: "后台首页",
                path: "/"
            }]

            // 存储cookie
            const cookies = useCookies(['tagList'])
            cookies.set("tagList", state.tagList)
        },

        // 记录用户信息
        SET_USERINFO(state, user) {
            state.user = user
        },

        // 记录菜单
        SET_MENUS(state, menus) {
            state.menus = menus
        },
        // 记录权限
        SET_RULENAMES(state, ruleNames) {
            state.ruleNames = ruleNames
        },
    },
    actions: {
        login({ commit }, { username, password }) {
            return new Promise((resolve, reject) => {
                login(username, password).then(res => {
                    // 存储token
                    setToken(res.token)
                    resolve()
                }).catch(err => reject(err))
            })
        },
        getInfo({ commit }) {
            return new Promise((resolve, reject) => {
                getinfo().then(res => {
                    commit('SET_USERINFO', res)

                    commit('SET_MENUS', res.menus)
                    commit('SET_RULENAMES', res.ruleNames)
                    resolve(res)
                }).catch(err => reject(err))
            })
        },
        logout({ commit }) {
            return new Promise((resolve, reject) => {
                // 清除token
                removeToken()
                commit('SET_USERINFO', {})
                commit('SET_MENUS', [])
                commit('SET_RULENAMES', [])
                commit("clearAllTag")
                resolve()
            })
        },
    }
})

export default store