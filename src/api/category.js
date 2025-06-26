import axios from '~/axios'

export function createCategory(data) {
    return axios.post("/admin/category", data)
}

export function updateCategory(id, data) {
    return axios.post("/admin/category/" + id, data)
}

export function getCategoryList() {
    return axios.get("/admin/category")
}

export function updateCategoryStatus(id, status) {
    return axios.post(`/admin/category/${id}/update_status`, { status })
}

export function deleteCategory(ids) {
    return axios.post(`/admin/category/${ids[0]}/delete`)
}

export function sortCategory(data) {
    return axios.post(`/admin/category/sort`, { sortdata: JSON.stringify(data) })
}

export function getCategoryGoods(id) {
    return axios.get(`/admin/app_category_item/list?category_id=${id}`)
}

export function deleteCategoryGoods(id) {
    return axios.post(`/admin/app_category_item/${id}/delete`)
}

export function connectCategoryGoods(data) {
    return axios.post(`/admin/app_category_item`, data)
}