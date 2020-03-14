<template>
    <div>
        <Table :columns="columns" :data="questions" @on-sort-change="sortChanged"></Table>
        <br/>
        <Page :current="currentPage" :total="total" :page-size="7" @on-change="pageChange" simple/>
    </div>
</template>

<script>
    import {request} from "network/teacher";
    import qs from "qs";

    export default {
        name: "MyQuestion",
        data() {
            return {
                columns: [
                    {
                        title: "标题",
                        key: "title",
                        tooltip: true
                    },
                    {
                        title: "描述",
                        key: "description",
                        tooltip: true
                    },
                    {
                        title: "创建时间",
                        key: "createdTime",
                        sortable: "custom"
                    },
                    {
                        title: "更新时间",
                        key: "lastUpdatedTime",
                        sortable: "custom"
                    },
                    {
                        title: "访问次数",
                        key: "visitedCount",
                        sortable: "custom"
                    },
                    {
                        title: "状态",
                        key: "state",
                        align: "center",
                        render: (h, params) => {
                            return h('span', params.row.state == 31 ? "已完成" : "待完成");
                        }
                    },
                    {
                        align: "center",
                        key: "questionType",
                        renderHeader: (h) => {
                            return h('div', [
                                h('a', {
                                    props: {
                                        href: 'javascript:void(0)',
                                    },
                                    on: {
                                        click: () => {
                                            this.typeSelected("word");
                                        }
                                    },
                                    style: {
                                        color: this.selectedTypes.indexOf("word") == -1 ? "#17233d" : ""
                                    },
                                }, "word"),
                                h('span', " | "),
                                h('a', {
                                    props: {
                                        href: 'javascript:void(0)',
                                    },
                                    style: {
                                        color: this.selectedTypes.indexOf("ppt") == -1 ? "#17233d" : ""
                                    },
                                    on: {
                                        click: () => {
                                            this.typeSelected("ppt");
                                        }
                                    }
                                }, "ppt"),
                                h('span', " | "),
                                h('a', {
                                    props: {
                                        href: 'javascript:void(0)',
                                    },
                                    on: {
                                        click: () => {
                                            this.typeSelected("excel");
                                        }
                                    },
                                    style: {
                                        color: this.selectedTypes.indexOf("excel") == -1 ? "#17233d" : ""
                                    },
                                }, "excel"),
                            ])
                        }
                    },
                    {
                        title: '操作',
                        key: 'action',
                        width: 150,
                        align: 'center',
                        render: (h, params) => {
                            return h('div', [
                                h('Button', {
                                    props: {
                                        type: 'primary',
                                        size: 'small'
                                    },
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                            this.editQuestion(params.row);
                                        }
                                    }
                                }, '编辑'),
                                h('Button', {
                                    props: {
                                        type: 'error',
                                        size: 'small'
                                    },
                                    on: {
                                        click: () => {
                                            this.deleteQuestion(params.row);
                                        }
                                    }
                                }, '删除')
                            ]);
                        }
                    }
                ],
                questions: [],
                selectedTypes: [],
                currentPage: 1,
                total: 0,
                order: "",
                key: "",
            }
        },
        created() {
            this.$store.commit("updateBreadcrumbItems", ['管理', '我的试题']);
            this.questions = this.getQuestionInfoByPage();
        },
        methods: {
            getQuestionInfoByPage(page, types, sort, column) {
                request({
                    url: '/mark/getQuestionInfo',
                    method: 'get',
                    params: {
                        page: page,
                        types: types,
                        sort: sort,
                        column: column
                    },
                    paramsSerializer: function (params) {
                        return qs.stringify(params, {arrayFormat: 'repeat'})
                    }
                }).then(({data}) => {
                    this.questions = data.items;
                    this.total = data.total;
                    this.currentPage = data.currentPage;
                }).catch(() => {
                    this.$Message.error("服务器内部请刷新后重试");
                });
            },
            deleteQuestion(row) {
                request({
                    url: '/mark/deleteQuestionInfo',
                    method: 'delete',
                    params: {
                        id: row.id,
                        questionType: row.questionType
                    }
                }).then(() => {
                    this.$Message.success("成功删除");
                    this.getQuestionInfoByPage();
                }).catch(() => {
                    this.$Message.error("删除失败");
                })
            },
            editQuestion(row) {
                this.$router.push("/manage/initialize/" + row.questionType + "/" + row.id);
            },
            sortChanged(column) {
                this.order = column.order;
                this.key = column.key;
                this.getQuestionInfoByPage(1, this.selectedTypes, column.order, column.key);
            },
            typeSelected(type) {
                let index = -1;
                if ((index = this.selectedTypes.indexOf(type)) == -1) {
                    this.selectedTypes.push(type);
                } else {
                    this.selectedTypes.splice(index, 1);

                }
                this.getQuestionInfoByPage(1, this.selectedTypes, null, null);
            },
            pageChange(page) {
                this.getQuestionInfoByPage(page, this.selectedTypes, this.order, this.key);
            }
        }
    }
</script>
<style scoped>
</style>