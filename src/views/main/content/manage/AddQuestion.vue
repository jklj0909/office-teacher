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
                }
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
                    console.log(data);
                }).catch(() => {
                    this.$Message.error("创建失败,请稍后重试");
                })
            },
            handClick(title, description, radio) {
                this.createQuestion(title, description, radio)
            }
        }
    }
</script>
<style scoped>

</style>