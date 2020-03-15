<template>
    <div>
        <Row>
            <Button style="float: left" type="primary" shape="circle" v-show="state>=0" @click="toLastState">上一步
            </Button>
            <Button style="float: right" type="primary" shape="circle" v-show="state<=30" :disabled="step<=state"
                    @click="toNextState">下一步
            </Button>
            <Button style="float: right" type="success" shape="circle" v-show="state>30" @click="completeEdit">完成
            </Button>
        </Row>
        <br>
        <Row type="flex" align="top" :gutter="64">
            <!--左边是关于试题的信息-->
            <Col span="11">
            <Row><span>标题</span></Row>
            <br>
            <Row><Input v-model="title" readonly></Input></Row>
            <br>
            <Row><span>题目详细信息</span></Row>
            <br>
            <Row>
                <Row><Input v-model="description" type="textarea" :rows="8" readonly></Input></Row>
            </Row>
            </Col>
            <!--右边是操作部分-->
            <Col span="11">
            <div style="text-align: center" v-show="state>=1&&state<=30">
                <span style="color: #3399ff" v-show="step>1"><a @click="goToPageOne"
                                                                href="javascript:void(0);">前往第1步</a>&nbsp;</span>
                <span style="color: #c3cbd6">|&nbsp;</span>
                <span style="font-family: 宋体;color: #464c5b;font-weight: bold">这是步骤{{state}},您已完成前{{step-1}}个步骤的上传</span>
                <span style="color: #c3cbd6">&nbsp;|</span>
                <span style="color: #3399ff" v-show="step>1&&step<=31">&nbsp;<a @click="goToLatestPage"
                                                                                href="javascript:void(0);">前往第{{step}}步</a></span>
            </div>
            <br/>
            <div v-show="state==-1">
                <Row>
                    <div class="upload-instruction">
                        请在此处上传素材文件,请注意:<br/>
                        1.word的版本请使用docx的新版本,否则将无法进行文档的比对。<br/>
                        2.请将学生答题所需要的所有资源(包括raw.docx)压缩成rar或zip文件再上传(限制大小为20MB)。<br/>
                        3.如果您因为特殊情况丢失登录状态,请进入"我的试题"找到对应试题选择"编辑"以重新回到该页面。
                    </div>
                    <br/>
                    <br/>
                    <Upload :action="rawUploadUrl" :max-size="20*1024" :multiple="true" :on-success="onSuccess"
                            :on-error="onError" :on-exceeded-size="exceedSize" :on-format-error="formatError"
                            :format="['rar','zip']" :before-upload="beforeUpload">
                        <Button icon="ios-cloud-upload-outline">上传文件</Button>
                        <span v-show="state<step"><Icon style="margin-left: 5px"
                                                        type="ios-checkmark-circle"></Icon>ok</span>
                    </Upload>
                </Row>
            </div>
            <div v-show="state==0">
                <Row>
                    <div class="upload-instruction">
                        请在此处上传初始状态未进行任何操作的word、excel或者ppt,请注意:<br/>
                        1.word的版本请使用docx的新版本,否则将无法进行文档的比对。<br/>
                        2.限制大小为4MB<br/>
                        3.请将题目要求的操作分成30个步骤完成,并将每一次增量后的文档在之后的页面上传
                        (每一次提交的文档都是在前一步的基础上操作，否则将会使得判卷失效)<br/>
                        4.重新上传将会自动删除后面步骤上传的所有文件(无论本次上传失败与否)。
                    </div>
                    <br/>
                    <br/>
                    <Upload :action="stepUploadUrl+'/0'" :max-size="4*1024" :multiple="true" :on-success="onSuccess"
                            :on-error="onError" :on-exceeded-size="exceedSize" :on-format-error="formatError"
                            :format="[format]" :before-upload="beforeUpload">
                        <Button icon="ios-cloud-upload-outline">上传文件</Button>
                        <span v-show="state<step"><Icon style="margin-left: 5px"
                                                        type="ios-checkmark-circle"></Icon>ok</span>
                    </Upload>
                    <br/>
                    <Button @click="downloadStep" v-show="state<step">
                        <Icon type="md-arrow-down"/>
                        下载查看
                    </Button>
                </Row>
            </div>
            <div v-show="state>0&&state<=30">
                <Row>
                    <div class="upload-instruction">
                        请在此处填入该步骤的操作说明以方便学生检错<br/>
                    </div>
                    <br/>
                    <Input v-model="stepDescription" placeholder="请输入操作说明"></Input><br/><br/>
                    <Button type="primary" @click="submitStepDescription(stepDescription)">提交说明</Button>
                    <br/><br/>
                    <div class="upload-instruction">
                        请在此处上传每一步的word、excel或者ppt,请注意:<br/>
                        1.重新上传将会自动删除后面步骤上传的所有文件(无论本次上传失败与否)。
                    </div>
                    <br/>
                    <Upload :action="stepUploadUrl+'/'+state" :max-size="4*1024" :multiple="true"
                            :on-success="onSuccess"
                            :on-error="onError" :on-exceeded-size="exceedSize" :on-format-error="formatError"
                            :format="[format]" :show-upload-list="false" :before-upload="beforeUpload">
                        <Button icon="ios-cloud-upload-outline">上传文件</Button>
                        <span v-show="state<step"><Icon style="margin-left: 5px"
                                                        type="ios-checkmark-circle"></Icon>ok</span>
                    </Upload>
                    <br/>
                    <Button @click="downloadStep" v-show="state<step">
                        <Icon type="md-arrow-down"/>
                        下载查看
                    </Button>
                </Row>
            </div>
            <div v-show="state==31">
                <Row>
                    <div style="font-family: 宋体;color: #464c5b;font-weight: bold;font-size: 25px;text-align: center">
                        已完成所有步骤,请确认无误后点击"完成"<br/>
                    </div>
                </Row>
            </div>
            </Col>
        </Row>
    </div>
</template>

<script>
    import {request} from "network/teacher";

    export default {
        name: "InitializeQuestion",
        data() {
            return {
                questionId: "",
                //当前所在的页码
                state: -1,
                //数据库存储的状态,标示最新等待完成的步骤
                step: -1,
                title: "",
                description: "",
                type: "",
                format: "",
                rawUploadUrl: "http://localhost:8083/mark/upload/raw/",
                stepUploadUrl: "http://localhost:8083/mark/upload/step/",
                stepDescription: "",
            }
        },
        created() {
            this.$store.commit("updateBreadcrumbItems", ['管理', '上传']);
        },
        mounted() {
            this.questionId = this.$route.params.questionId;
            this.type = this.$route.params.type;
            if (this.type == "word") {
                this.format = "docx";
            } else if (this.type == "ppt") {
                this.format = "pptx";
            } else if (this.type == "excel") {
                this.format = "xlsx";
            }
            this.rawUploadUrl += this.type + "/" + this.questionId;
            this.stepUploadUrl += this.type + "/" + this.questionId;
            this.checkIdIfExists(this.questionId);
        },
        methods: {
            checkIdIfExists(id) {
                request({
                    url: '/mark/checkId/' + id,
                    method: 'get',
                }).then(({data}) => {
                    this.state = data.info.state;
                    this.step = data.info.state;
                    this.title = data.info.title;
                    this.description = data.info.description;
                    this.stepDescription = data.message;
                    if (this.step > -1) {
                        this.$Message.info({
                            content: "已跳转到最新等待完成的步骤"
                        })
                    }
                }).catch(({response}) => {
                    if (response.data.message != "not_login") {
                        this.$Message.error(response.data.message);
                    }
                    this.$router.push("/index");
                });
            },
            getStepDescription() {
                request({
                    url: '/mark/getStepDescription',
                    method: 'get',
                    params: {
                        id: this.questionId,
                        step: this.state,
                        type: this.type
                    }
                }).then(({data}) => {
                    this.stepDescription = data.message;
                }).catch(() => {
                    this.stepDescription = "";
                })
            },
            toLastState() {
                if (this.state > -1) {
                    this.state--;
                    this.getStepDescription();
                }
            },
            toNextState() {
                if (this.state < 31) {
                    this.state++;
                    this.getStepDescription();
                }
            },
            goToPageOne() {
                if (this.step > 1) {
                    this.state = 1;
                    this.getStepDescription();
                }
            },
            goToLatestPage() {
                if (this.state < 31) {
                    this.state = this.step;
                    this.getStepDescription();
                }
            },
            onSuccess(response) {
                this.$Message.success("上传成功");
                this.step = response.info;
            },
            onError() {
                this.$Message.error("上传失败");
            },
            exceedSize() {
                this.$Message.error("文件超出限制大小");
            },
            formatError() {
                this.$Message.error("文件格式错误");
            },
            beforeUpload() {
                if (this.state < this.step) {
                    this.$Modal.confirm({
                        title: "确认框",
                        content: "在此步骤上传文件会自动删除之后步骤曾经上传过的文件,您确定要这么做吗?",
                        onOk() {
                            return true;
                        },
                        onCancel() {
                            this.$Message.success("已取消");
                            return false;
                        }
                    });
                }
                return true;
            },
            submitStepDescription(stepDescription) {
                if (stepDescription == null || stepDescription == "") {
                    this.$Message.error("请输入步骤说明");
                    return;
                }
                if (stepDescription.length >= 127) {
                    this.$Message.error("步骤说明过长,请限制在128个字以内");
                    return;
                }
                request({
                    url: '/mark/stepDescription',
                    method: 'post',
                    data: {
                        id: this.questionId,
                        //当前业对应的步骤
                        step: this.state,
                        questionType: this.type,
                        stepDescription: stepDescription
                    }
                }).then(() => {
                    this.$Message.success("已提交");
                }).catch(() => {
                    this.$Message.error("出现未知错误,请稍后再试");
                })
            },
            completeEdit() {
                this.$Spin.show();
                request({
                    url: '/mark/completeEdit',
                    method: 'post',
                    data: {
                        questionType: this.type,
                        id: this.questionId,
                        username: this.$store.state.user.username
                    }
                }).then(() => {
                    this.$Spin.hide();
                    this.$router.push("/manage/myQuestion");
                }).catch(({response}) => {
                    this.$Spin.hide();
                    this.$Message.error(response.data.message);
                });
            },
            downloadStep() {
                let filename = this.state + "." + this.format;
                request({
                    url: '/mark/download/' + this.type + '/' + this.questionId + '/' + this.state,
                    method: 'get',
                    responseType: 'blob',
                    headers: {
                        'Content-Type': 'application/json; application/octet-stream'
                    },
                }).then(res => {
                    let blob = new Blob([res.data]);
                    let downloadElement = document.createElement('a');
                    let href = window.URL.createObjectURL(blob); //创建下载的链接
                    downloadElement.href = href;
                    downloadElement.download = filename; //下载后文件名
                    document.body.appendChild(downloadElement);
                    downloadElement.click(); //点击下载
                    document.body.removeChild(downloadElement); //下载完成移除元素
                    window.URL.revokeObjectURL(href);
                }).catch(() => {
                    this.$Message.error("请求失败,找不到相关文件");
                })
            },
        }
    }
</script>
<style scoped>
    .upload-instruction {
        font-family: 宋体;
        font-weight: bold;
        font-size: 15px;
        color: #ff0000;
        line-height: 25px;
    }
</style>