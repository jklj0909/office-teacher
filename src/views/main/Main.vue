<template>
    <div class="layout">
        <Layout>
            <!--顶部菜单栏-->
            <Header>
                <Menu mode="horizontal" theme="dark" active-name="1">
                    <a @click="goToIndex">
                        <div class="layout-logo">Office自动判卷系统 教师端</div>
                    </a>
                    <div class="layout-nav">
                        <div class="layout-nav-buttons" v-show="$store.state.user.isLogin==false">
                            <Button type="primary" @click="goToLogin">登录</Button>
                        </div>
                        <div class="layout-nav-buttons" v-show="$store.state.user.isLogin==true">
                            <dropdown-button @dropdownClick="dropdownClick"
                                             :username="$store.state.user.username"/>
                        </div>
                    </div>
                </Menu>
            </Header>

            <Layout>
                <!--左侧列表-->
                <Sider hide-trigger :style="{background: '#fff'}">
                    <Menu theme="light" width="auto" :accordion="true">
                        <Submenu :name="item.name" v-for="(item,index) in slider" :key="index"
                                 v-show="$store.state.user.isLogin==true||item.requireLogin==false">
                            <template slot="title">
                                <Icon :type="item.iconType"></Icon>
                                {{item.content}}
                            </template>
                            <MenuItem :name="itemList.name" v-for="(itemList,i) in item.childList" :key="i"
                                      v-show="$store.state.user.isLogin==itemList.requireLogin" :to="itemList.link">
                                {{itemList.content}}
                            </MenuItem>
                        </Submenu>
                    </Menu>
                </Sider>
                <Layout :style="{padding: '0 24px 24px'}">
                    <!--当前所在页面路径-->
                    <Breadcrumb :style="{margin: '24px 0'}">
                        <BreadcrumbItem v-for="(item,index) in breadcrumbItems" :key="index">{{item}}</BreadcrumbItem>
                    </Breadcrumb>
                    <!--路由的页面-->
                    <Content :style="{padding: '24px', minHeight: '300px', background: '#fff'}">
                        <router-view v-show="isShow"/>
                    </Content>
                </Layout>
            </Layout>
            <Footer class="layout-footer-right">2020 &copy; Office</Footer>
        </Layout>
    </div>
</template>

<script>
    import DropdownButton from 'components/content/main/outer/DropdownButton';
    import {request} from 'network/teacher';

    export default {
        name: "Main",
        components: {
            DropdownButton
        },
        data() {
            return {
                isShow: true,
                slider: [
                    {
                        childList: [{name: 'login', content: '登录', requireLogin: false, link: '/profile/login'},
                            {name: 'info', content: '个人信息', requireLogin: true, link: '/profile/info'}],
                        iconType: 'md-person',
                        content: '账户',
                        name: 'profile',
                        requireLogin: false
                    },
                    {
                        childList: [{name: 'addQuestion', content: '添加试题', requireLogin: true, link: '/manage/add'},
                            {name: 'MyQuestion', content: '我的试题', requireLogin: true, link: '/manage/myQuestion'}],
                        iconType: 'ios-add-circle-outline',
                        content: '试题管理',
                        name: 'manageQuestion',
                        requireLogin: true
                    }
                ],
            }
        },
        computed: {
            breadcrumbItems() {
                return this.$store.state.breadcrumbItems;
            }
        },
        methods: {
            goToIndex() {
                this.$router.push('/index');
            },
            goToLogin() {
                this.$router.push('/profile/login');
            },
            logout() {
                request({
                    url: "/teacher/logout",
                    method: "post",
                }).then(() => {
                    this.$Message.success("退出登录");
                }).catch(() => {
                });
                this.$store.commit("logout");
                this.$router.push("/profile/login");
            },
            dropdownClick(name) {
                if (name == "logout") {
                    this.logout();
                }
            }
        },
        mounted() {
            const requireNoLoginList = ['/profile/login'];
            this.$router.onReady(() => {
                if (requireNoLoginList.indexOf(this.$route.path) == -1) {
                    this.isShow = false;
                    this.$Spin.show();
                    request({
                        url: '/teacher/checkLogin',
                        method: "get"
                    }).then(({data}) => {
                        this.$store.commit("afterLogin", data.info);
                        this.isShow = true;
                        this.$Spin.hide();
                    }).catch(() => {
                        this.$Message.error("请登录后再尝试操作");
                        this.$router.push('/profile/login');
                        this.isShow = true;
                        this.$Spin.hide();
                    });
                }
            });
        }
    }
</script>
<style scoped>
    .layout {
        border: 1px solid #d7dde4;
        background: #f5f7f9;
        position: relative;
        border-radius: 4px;
        overflow: hidden;
    }

    .layout-logo {
        width: 200px;
        height: 30px;
        border-radius: 3px;
        float: left;
        position: relative;
        top: 5px;
        left: 5px;
        color: #d7dde4;
        font-size: 15px;
    }

    .layout-nav {
        width: 500px;
        float: right;
        right: 0;
    }

    .layout-nav-buttons {
        position: absolute;
        right: 5px;
        top: 5px;
    }

    .layout-nav button {
        margin: 10px;
    }

    .layout-footer-right {
        text-align: right;
        font-size: 13px;
    }
</style>