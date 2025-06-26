import axios from '~/axios'

export function createUserLevel(data) {
    return axios.post("/admin/user_level", data)
}

export function updateUserLevel(id, data) {
    return axios.post("/admin/user_level/" + id, data)
}

export function getUserLevelList(page) {
    return axios.get("/admin/user_level/" + page)
}

export function updateUserLevelStatus(id, status) {
    return axios.post(`/admin/user_level/${id}/update_status`, { status })
}

export function deleteUserLevel(ids) {
    return axios.post(`/admin/user_level/${ids[0]}/delete`)
}