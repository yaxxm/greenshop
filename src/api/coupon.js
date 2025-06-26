import axios from '~/axios'

export function createCoupon(data) {
    return axios.post("/admin/coupon", data)
}

export function updateCoupon(id, data) {
    return axios.post("/admin/coupon/" + id, data)
}

export function getCouponList(page) {
    return axios.get("/admin/coupon/" + page)
}

export function updateCouponStatus(id, status) {
    return axios.post(`/admin/coupon/${id}/update_status`, { status })
}

export function deleteCoupon(ids) {
    return axios.post(`/admin/coupon/${ids[0]}/delete`)
}