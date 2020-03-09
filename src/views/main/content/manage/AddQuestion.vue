<template>
    <Form :model="formItem" :label-width="80">
        <FormItem label="标题">
            <Input v-model="formItem.input" placeholder="请输入试题的标题"></Input>
        </FormItem>
        <FormItem label="详细描述">
            <Input v-model="formItem.textarea" type="textarea" :autosize="{minRows: 3,maxRows: 7}"
                   placeholder="请输入关于试题的详细描述"></Input>
        </FormItem>
        <FormItem label="试题类型">
            <RadioGroup v-model="formItem.radio">
                <Radio label="word">word</Radio>
                <Radio label="excel">excel</Radio>
                <Radio label="ppt">ppt</Radio>
            </RadioGroup>
        </FormItem>
        <FormItem>
            <Button type="primary" @click="handClick(formItem.input,formItem.textarea,formItem.radio)">新建</Button>
        </FormItem>
    </Form>
</template>

<script>
    import {request} from "network/teacher";

    export default {
        name: "AddQuestion",
        data() {
            return {
                formItem: {
                    input: "",
                    textarea: "",
                    radio: ""
                },
            }
        },
        methods: {
            createQuestion(title, description, radio) {
                request({
                    url: '/mark/createQuestion',
                    method: 'post',
                    data: {
                        title: title,
                        description: description,
                        questionType: radio,
                        username: this.$store.state.user.username
                    }
                }).then(({data}) => {
                    this.$Message.success("创建成功");
                    this.$router.push("/manage/initialize/" + radio + "/" + data.message);
                }).catch(({response}) => {
                    this.$Message.error(response.data.message);
                })
            },
            handClick(title, description, radio) {
                if (title == "" || description == "" || radio == "") {
                    this.$Message.error("请将信息填写完整");
                    return;
                }
                if (title.length >= 128 || description.length >= 1024) {
                    this.$Message.error("题目或者描述信息过长");
                    return;
                }
                this.createQuestion(title, description, radio)
            }
        }
    }
</script>
<style scoped>

</style>