import store from '../store';

export function getToken() {
    if(!store.getters.token){
      return null;
    }
    let data = {
        user: store.getters.user,
        buttonAuth: store.getters.buttonAuth,
        token: store.getters.token,
        refreshToken: store.getters.refreshToken,
        buttons: store.getters.buttons,
        menu: store.getters.menu,
        routes: store.getters.routes
    }
    return data;
}

export function setToken(data) {
    let status = data.token;
    store.commit('changeLogin', {
        user:status.user,
        buttonAuth: status.buttonAuth,
        token: status.token,
        refreshToken: status.refreshToken,
        buttons: status.buttons,
        menu: status.menu,
        routes: status.routes
    });
    let initParams = data.initParams;
    store.commit('set_initParams', initParams);
}
