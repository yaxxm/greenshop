import axios from '~/axios'

export function createSkus(data) {
    return axios.post("/admin/skus", data)
}

export function updateSkus(id, data) {
    return axios.post("/admin/skus/" + id, data)
}

export function getSkusList(page) {
    return axios.get("/admin/skus/" + page)
}

export function updateSkusStatus(id, status) {
    return axios.post(`/admin/skus/${id}/update_status`, { status })
}

export function deleteSkus(ids) {
    return axios.post("/admin/skus/delete_all", { ids })
}