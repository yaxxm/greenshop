import axios from '~/axios'
import { queryParams } from '~/composables/util'

export function createUser(data) {
    return axios.post("/admin/user", data)
}

export function updateUser(id, data) {
    return axios.post("/admin/user/" + id, data)
}

export function getUserList(page, query = {}) {
    let q = queryParams(query, true)
    return axios.get(`/admin/user/${page}${q}`)
}

export function updateUserStatus(id, status) {
    return axios.post(`/admin/user/${id}/update_status`, { status })
}

export function deleteUser(ids) {
    return axios.post(`/admin/user/${ids[0]}/delete`)
}