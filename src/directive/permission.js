import store from '~/store'

export function hasPermission(value, el = false) {
    if (!Array.isArray(value)) throw new Error(`need accesses! Like v-permission="['createGoods,POST']"`)
    const hasAuth = value.findIndex(v => store.state.ruleNames.includes(v)) != -1
    if (el && !hasAuth) {
        el.parentNode && el.parentNode.removeChild(el)
    }
    return hasAuth
}

export default {
    install: (app, options) => {
        app.directive("permission", {
            mounted(el, binding) {
                hasPermission(binding.value, el)
            }
        })
    }
}