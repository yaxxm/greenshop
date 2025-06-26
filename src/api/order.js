import axios from '~/axios'
import { queryParams } from '~/composables/util'

export function getOrderList(page, query = {}) {
    let q = queryParams(query, true)
    return axios.get(`/admin/order/${page}${q}`)
}

export function deleteOrder(ids) {
    return axios.post(`/admin/order/delete_all`, { ids })
}

export function shipOrder(id, data) {
    return axios.post(`/admin/order/${id}/ship`, data)
}

export function refundOrder(id, data) {
    return axios.post(`/admin/order/${id}/handle_refund`, data)
}

export function exportOrder(query = {}) {
    let q = queryParams(query, true)
    return axios.post(`/admin/order/excelexport${q}`, {}, {
        token: true,
        responseType: 'blob'
    })
}

export function getShipInfo(id) {
    return axios.get(`/admin/order/${id}/get_ship_info`)
}