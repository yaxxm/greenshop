import { useCookies } from '@vueuse/integrations/useCookies'
const TokenKey = 'admin-token'
const Cookies = useCookies(['admin-token'])

// 获取token
export function getToken() {
    return Cookies.get(TokenKey)
}

// 设置token
export function setToken(token) {
    return Cookies.set(TokenKey, token)
}

// 清除token
export function removeToken() {
    return Cookies.remove(TokenKey)
}