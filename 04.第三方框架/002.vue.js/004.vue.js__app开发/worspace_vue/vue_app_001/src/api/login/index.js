// login/index.js
import http from '../http';

const api = {
    login: (username, password) => {
        // "/" + $servers.sys + "/login"
		return http.post('/login', { username, password });
    },
	logout: () => {
		return http.post('/logout');
	}
};

export default api;


