// export const API = (import.meta.env.VITE_API_URL || 'https://hotel-booking-app-x553.onrender.com').replace(/\/+$/, '')

// export const imgUrl = (path) => (path ? `${API}/${path.replace(/\\/g, '/')}` : '')

// // reads a fetch response safely and handles expired login
// export const handleAuthError = (res) => {
//   if (res.status === 401 || res.status === 403) {
//     localStorage.removeItem('token')
//     localStorage.removeItem('user')
//     alert('Your session expired. Please log in again.')
//     window.location.href = '/login'
//     return true
//   }
//   return false
// }
