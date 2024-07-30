<template>
    <div class="approval">
        <h1>请假申请</h1>
        <p>Please review the request and select an option below:</p>
        <form @submit.prevent="submitApproval">
        <div class="option">
            <label>
            <input type="radio" v-model="decision" value="approve" />
            <i class="fas fa-check-circle"></i> Approve
            </label>
        </div>
        <div class="option">
            <label>
            <input type="radio" v-model="decision" value="reject" />
            <i class="fas fa-times-circle"></i> Reject
            </label>
        </div>
        <button type="submit">Submit</button>
        </form>
        <p v-if="submitted">Your decision: {{ decision }}</p>
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
