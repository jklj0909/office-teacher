<template>
    <div>
        <Row>
            <Button style="float: left" type="primary" shape="circle" v-show="state>=0">上一步</Button>
            <Button style="float: right" type="primary" shape="circle" v-if="state<30">下一步</Button>
            <Button style="float: right" type="success" shape="circle" v-else>完成</Button>
        </Row>
        <br>
        <Row type="flex" align="top" :gutter="32">
            <!--左边是关于试题的信息-->
            <Col span="12">
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
            <Col span="12">
            <div v-if="state==-1">
                <Row>
                    <div class="upload-instruction">
                        请在此处上传素材文件,请注意:<br/>
                        1.word的版本请使用docx的新版本,否则将无法进行文档的比对。<br/>
                        2.请将作为word、excel、ppt命名为“raw”以方便识别。<br/>
                        3.请将学生答题所需要的所有资源(包括raw.docx)压缩成rar或zip文件再上传(限制大小为20MB)。
                    </div>
                    <br/>
                    <br/>
                    <Upload :action="uploadUrl" :max-size="20*1024" :multiple="true" :on-success="onSuccess"
                            :on-error="onError" :on-exceeded-size="exceedSize" :on-format-error="formatError"
                            :format="['rar','zip']">
                        <Button icon="ios-cloud-upload-outline">上传文件</Button>
                    </Upload>
                </Row>
                <br>
                <Row></Row>
            </div>
            <div v-else>

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
                state: -1,
                title: "",
                description: "",
                type: "",
                uploadUrl: "http://localhost:8083/mark/upload/raw/"
            }
        },
        mounted() {
            this.questionId = this.$route.params.questionId;
            this.type = this.$route.params.type;
            this.uploadUrl += this.type + "/" + this.questionId;
            this.checkIdIfExists(this.questionId);
        },
        methods: {
            checkIdIfExists(id) {
                request({
                    url: '/mark/checkId/' + id,
                    method: 'get',
                }).then(({data}) => {
                    this.state = data.info.state;
                    this.title = data.info.title;
                    this.description = data.info.description;
                }).catch(() => {
                    this.$Message.error("试题不存在,请重新创建");
                    this.$router.push("/index");
                });
            },
            onSuccess() {
                this.$Message.success("上传成功");
            },
            onError() {
                this.$Message.error("上传失败");
            },
            exceedSize() {
                this.$Message.error("文件超出限制大小");
            },
            formatError() {
                this.$Message.error("文件格式错误");
            }
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