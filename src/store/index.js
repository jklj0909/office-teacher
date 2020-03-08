import Vue from "vue";
import VueX from "vuex";

Vue.use(VueX);
const store = new VueX.Store({
    state: {
        user: {
            isLogin: false,
            username: "",
        }
    },
    mutations: {
        afterLogin(state, info) {
            state.user.isLogin = true;
            state.user.username = info.username;
        },
        logout(state) {
            state.user.isLogin = false;
            state.user.username = "";
        }
    }
});
export default store;