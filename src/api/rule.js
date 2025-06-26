import axios from '~/axios'

export function createRule(data) {
    return axios.post("/admin/rule", data)
}

export function updateRule(id, data) {
    return axios.post("/admin/rule/" + id, data)
}

export function getRuleList(page) {
    return axios.get("/admin/rule/" + page)
}

export function updateRuleStatus(id, status) {
    return axios.post(`/admin/rule/${id}/update_status`, { status })
}

export function deleteRule(ids) {
    return axios.post(`/admin/rule/${ids[0]}/delete`)
}