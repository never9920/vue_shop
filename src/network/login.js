import { post } from "./request";

export function loginpost(params) {
    return post("login", params)
}