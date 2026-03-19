export const isAuthenticated = () => {
    const token = localStorage.getItem('token')
    return !!token
}

export const getToken = () => {
    return localStorage.getItem('token')
}

export const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('userType')
    localStorage.removeItem('userData')
    window.location.href = '/'
}

export const getUserData = () => {
    const token = localStorage.getItem('token')
    if (!token) return null

    try {
        const payload = token.split('.')[1]
        return JSON.parse(atob(payload))
    } catch (error) {
        return null
    }
}

export const saveUserData = (userData) => {
    localStorage.setItem('userData', JSON.stringify(userData))
}