export default{
    clear() {
        localStorage.clear()
    },
    set(key, value) {
        localStorage.setItem(key, value)
    },
    get(key) {
        return localStorage.getItem(key)
    },
    setToken(token) {
        localStorage.setItem("token", token)
    },
    getToken() {
        return localStorage.getItem("token")
    },
    getUserId() {
        return localStorage.getItem("userId")
    },
    setUserId(userId) {
        localStorage.setItem("userId", userId)
    },
    setUserRole(role) {
        localStorage.setItem("role", role)
    },
    getUserRole() {
        return localStorage.getItem("role")
    },
    setUserHeader(url) {
        localStorage.setItem("headerUrl", url)
    },
    getUserHeader() {
        return localStorage.getItem("headerUrl")
    },
}