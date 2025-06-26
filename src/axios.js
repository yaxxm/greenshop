import axios from 'axios'
import { toast } from '~/composables/util'
import { getToken } from '~/composables/auth'
import store from '~/store'
const service = axios.create({
    // axios中请求配置有baseURL选项，表示请求URL公共部分
    // baseURL: "http://ceshi13.dishait.cn"
    baseURL: "/api"
})

// request拦截器
service.interceptors.request.use(config => {
    const token = getToken()
    if (token) {
        config.headers['token'] = token
    }
    return config
}, error => {
    Promise.reject(error)
})

// 响应拦截器
service.interceptors.response.use(res => {
        return res.request.responseType == "blob" ? res.data : res.data.data
    },
    error => {
        let msg = error.response.data.msg || "请求失败"
        if (msg == "非法token，请先登录！") {
            store.dispatch("logout").finally(() => location.reload())
        }
        toast(msg, "error", error.response.data.errorCode == 40000)

        return Promise.reject(error)
    }
)

export default service;