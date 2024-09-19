// src/store/index/authStore.js
const state = {
    user: null,
    token: '',
    refreshToken: '',
    isExemptionfromlogin: false, //免登陆标记
    pemPublicKey: `-----BEGIN PUBLIC KEY-----
MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAExjUb1+aTNZRCEqZcDCw8wbwgKCOyXUaHk0ORGEhQCjKil1HdYPs4KzwIvDwpDffuXd10c668JOXi/XkXcr4vEQ==
-----END PUBLIC KEY-----`,
    pgpPublicKey: `-----BEGIN PGP PUBLIC KEY BLOCK-----

mDMEZuwr7BYJKwYBBAHaRw8BAQdAq/cNbUZuW5c7dRlmuVH2H4PZoIvPQhuzF5DU
z4Oz/f20ImxpaGVuZyAoZWNjKSA8MTM2ODgwMDcxNjVAMTM5LmNvbT6IkAQTFggA
OBYhBDuX1ic7Oanzt3aRP3mUP8IgawE/BQJm7CvsAhsDBQsJCAcCBhUKCQgLAgQW
AgMBAh4BAheAAAoJEHmUP8IgawE/ZpkBAN0xHwMyv6sM/punxpvx0B7E8y4EHeSj
ZM4pb4DghgFgAQCdXN5wseMD8AeVzIdPDsFPeyBhPBwbYxbZZii3nMT3CLg4BGbs
K+wSCisGAQQBl1UBBQEBB0CGOa/durKqagchUSZdiGsHe7gEmQ8+mnwnGPx39Q7W
cQMBCAeIeAQYFggAIBYhBDuX1ic7Oanzt3aRP3mUP8IgawE/BQJm7CvsAhsMAAoJ
EHmUP8IgawE/E0MBANwTcJFxdSSJF4rt72sceG/sYc7GmG7boT8aQwHfehmgAP9x
QlDGbFcrnuMWmyinPxODrz+CPzlG0apj+MvSIiq7CQ==
=4uep
-----END PGP PUBLIC KEY BLOCK-----`

};

const getters = {
    user: (state) => state.user,
    token: (state) => state.token,
    refreshToken: (state) => state.refreshToken,
    isExemptionfromlogin: (state) => state.isExemptionfromlogin,
    pemPublicKey: (state) => state.pemPublicKey,
    pgpPublicKey: (state) => state.pgpPublicKey,

};

const mutations = {
    changeLogin(state, payload) {
        state.user = payload.user;
        state.token = payload.token;
        state.refreshToken = payload.refreshToken;
    },
    setExemptionfromlogin(state, status) {
        state.isExemptionfromlogin = status;
    }
};

const actions = {
    updateExemptionfromlogin({ commit }, status) {
        commit('setExemptionfromlogin', status);
    }
};

export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions,
};

