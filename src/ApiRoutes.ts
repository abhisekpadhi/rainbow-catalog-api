export const ApiRoutes = {
    root: '/',
    login: '/login',
    otpRequest: '/otp',
    health: '/_/healthz',
    ping: '/_/ping',
}

export const UnAuthenticatedRoutes = [
    ApiRoutes.otpRequest,
    ApiRoutes.login,
    ApiRoutes.health,
    ApiRoutes.ping,
    '/tracking'
]
