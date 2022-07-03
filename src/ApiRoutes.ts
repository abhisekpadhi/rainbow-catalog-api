export const ApiRoutes = {
    root: '/',
    login: '/login',
    health: '/_health',
}

export const UnAuthenticatedRoutes = [
    ApiRoutes.health,
    ApiRoutes.login
]
