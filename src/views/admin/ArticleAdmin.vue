<template>
    <div class="articleContent">
        <Forum :isAdmin="true"></Forum>
    </div>
</template>
<script>
import Forum from '@/views/components/forum.vue'
export default {
    components:{
        Forum
    },
    data() {
        return {

        }
    },
    created() {

    }
}
</script>
<style scoped>
.articleContent {
    padding: 20px;
    background-color: #fff;
    border-radius: 10px;
    text-align: center;
}
</style>