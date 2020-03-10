import Vue from 'vue';
import Router from 'vue-router';

const originalPush = Router.prototype.push;
Router.prototype.push = function push(location, onResolve, onReject) {
    if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject);
    return originalPush.call(this, location).catch(err => err)
};
const Index = () => import('views/main/content/index');
const Login = () => import('views/main/content/user/Login');
const UserInfo = () => import('views/main/content/user/UserInfo');
const AddingQuestion = () => import('views/main/content/manage/AddQuestion');
const InitializeQuestion = () => import('views/main/content/manage/InitializeQuestion');
Vue.use(Router);

const routes = [
    {
        path: '',
        redirect: '/profile/login'
    },
    {
        path: '/index',
        component: Index,
    },
    {
        path: '/profile/login',
        component: Login,
    },
    {
        path: '/profile/info',
        component: UserInfo,
    },
    {
        path: '/manage/add',
        component: AddingQuestion,
    },
    {
        path: '/manage/initialize/:type/:questionId',
        component: InitializeQuestion,
    }
];
const router = new Router({
    mode: 'history',
    routes
});
export default router;