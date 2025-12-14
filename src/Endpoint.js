function createEndpoint(fn, method, authRequired = false, roles = undefined) {
    return {
        authRequired: authRequired,
        method: method,
        handler: fn,
        roles: roles
    }
}