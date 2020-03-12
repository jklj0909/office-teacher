<template>
    <div>
        我的试题
    </div>
</template>

<script>
    export default {
        name: "MyQuestion",
        data() {
            return {}
        },
        created() {
            this.$store.commit("updateBreadcrumbItems", ['管理', '我的试题']);
        },
    }
</script>
<style scoped>

</style>