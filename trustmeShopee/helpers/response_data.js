export const errorRes = (errMsg) => {
    return {
        message: errMsg
    }
}
export const successRes = (msg,data) => {
    return {
        message: msg, ...data,
    }
}
