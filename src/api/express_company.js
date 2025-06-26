import axios from '~/axios'
export function getExpressCompanyList(page = 1) {
    return axios.get(`/admin/express_company/${page}`)
}