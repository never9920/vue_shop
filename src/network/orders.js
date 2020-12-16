import {get, put } from "./request";

export function orderget(params) {
    return get("orders", params)
}

export function kuaidiget(id) {
    return get("/kuaidi/" + id)
}

export function ordersput(id, params) {
    return put("orders/" + id, params)
}

export function ordersgetid(id) {
    return get("orders/" + id)
}



/*this.$http.get(`orders`, { params: this.orders })

this.$http.get(`/kuaidi/` + id)

this.$http.put(`orders/` + form.order_id, form)

this.$http.get(`orders/` + id)*/