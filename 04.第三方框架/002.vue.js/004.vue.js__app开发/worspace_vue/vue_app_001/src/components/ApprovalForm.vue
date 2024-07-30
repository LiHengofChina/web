<template>
    <div class="approval">
        <h1>请假申请</h1>
        <p>请审核申请并选择以下选项：</p>
        <form @submit.prevent="submitApproval">
        <div class="option">
            <label>
            <input type="radio" v-model="decision" value="approve" />
            <i class="fas fa-check-circle"></i> 同意
            </label>
        </div>
        <div class="option">
            <label>
            <input type="radio" v-model="decision" value="reject" />
            <i class="fas fa-times-circle"></i> 拒绝
            </label>
        </div>
        <button type="submit">提交</button>
        </form>
        <p v-if="submitted">您的决定：{{ decision }}</p>
    </div>
</template>

<script>
import '@fortawesome/fontawesome-free/css/all.css';

export default {
    name: 'ApprovalForm',
    data() {
        return {
        decision: null,
        submitted: false
        };
    },
    methods: {
        submitApproval() {
        this.submitted = true;
        console.log("Decision submitted:", this.decision);
        }
    }
};
</script>

<style scoped>
.approval {
    max-width: 400px;
    margin: auto;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 10px;
}
.option {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
}
.option label {
    display: flex;
    align-items: center;
}
.option i {
    margin-right: 8px;
}
button {
    margin-top: 10px;
}
</style>
