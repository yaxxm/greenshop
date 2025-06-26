import axios from '~/axios'
import { queryParams } from '~/composables/util'
export function getGoodsCommentList(page, query = {}) {
    let q = queryParams(query, true)
    return axios.get(`/admin/goods_comment/${page}${q}`)
}

export function updateGoodsCommentStatus(id, status) {
    return axios.post(`/admin/goods_comment/${id}/update_status`, { status })
}

export function reviewGoodsComment(id, data) {
    return axios.post(`/admin/goods_comment/review/${id}`, { data })
}