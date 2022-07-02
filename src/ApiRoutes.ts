export const ApiRoutes = {
    root: '/',
    auth: {
        root: '/auth',
        routes: {
            loginOtpRequest: '/otp',
            loginWhatsappWebhook: '/whatsapp',
            login: '/login',
            onboarding: '/onboarding',
        }
    },
    prefs: {
        root: '/prefs',
        routes: {
            getUserPrefs: '/all',
            updateUserPrefs: '/update'
        },
    },
    articles: {
        root: '/articles',
        routes: {
            getAll: '/all',
            update: '/update',
        },
    },
    expression: {
        root: '/expressions',
        routes: {
            getAll: '/all',
            update: '/update',
        },
    },
    categoryStats: {
        root: '/stats/category',
        routes: {
            get: '/',
        }
    },
    subcategoryStats: {
        root: '/stats/subcategory',
        routes: {
            get: '/',
        },
    },
    planProduct: {
        root: '/plans',
        routes: {
            get: '/',
        }
    },
    subscription: {
        root: '/subscription',
        routes: {
            get: '/',
        }
    },
    subscriptionOrder: {
        root: '/order',
        routes: {
            get: '/history',
            update: '/update'
        }
    },
    trustee: {
        route: '/trustee',
        routes: {
            update: '/update',
            getAll: '/all',
        }
    },
    trusteeVaultAccessRequest: {
        root: '/trustee/vaultaccess',
        routes: {
            update: '/update',
            get: '/',
            getAll: '/all',
        }
    },
    trusteeVaultAccessRequestAdminComment: {
        root: '/trustee/vaultaccess/admin',
        routes: {
            commentUpdate: '/comment',
            getAllComments: '/comment/all',
        }
    },
    trusteeVaultAccessRequestProof: {
        root: '/trustee/vaultaccess/proof',
        routes: {
            get: '/',
            upload: '/upload',
            delete: '/delete',
        },
    },
    userUploadStats: {
        root: '/stats/user/uploads',
        routes: {
            get: '/',
        },
    },
    vaultTaxonomy: {
        root: '/vault/taxonomy',
        routes: {
            getAll: '/',
            update: '/update',
        }
    },
    vaultDataInputs: {
        root: '/vault/inputs',
        routes: {
            getAll: '/all',
            update: '/update'
        },
    },
    vaultData: {
        root: '/vault/data',
        routes: {
            getAll: '/all',
            update: '/update',
        }
    },
    health: '/_health',
}

export const UnAuthenticatedRoutes = [
    ApiRoutes.health,
    ApiRoutes.auth.routes.loginOtpRequest,
    ApiRoutes.auth.routes.loginWhatsappWebhook,
    ApiRoutes.auth.routes.login,
]
