<template>
    <div v-if="loading" class="loading-indicator" >
        <div class="dot"></div>
        <div class="dot"></div>
        <div class="dot"></div>
    </div>
</template>

<script>
export default {
    name: "LoadingIndicator",
    props: {
        loading: {
            type: Boolean,
            required: true
        }
    }
};
</script>

<style scoped>
/* 加载中 ************************ */
.loading-indicator {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 0; 
    left: 0;
	right: 0;
    position: fixed; /* 让加载提示固定在屏幕上 */
    margin-left: auto;
    margin-right: auto;
    top: 0;
    left: 0;
    width: 100%; /* 占据全屏宽度 */
    height: 100vh; /* 占据全屏高度 */
    background-color: rgba(0, 0, 0, 0.3);  /*半透明背景 */
    z-index: 9999; /* 确保在最前面显示 */
    font-size: 1.5rem; /* 调整字体大小 */
}


.dot {
    width: 1rem;
    height: 1rem;
    margin: 0 5px;
    background-color: #ddd;
    border-radius: 50%;
    animation: bounce 0.6s infinite alternate;
}

.dot:nth-child(2) {
    animation-delay: 0.2s;
}

.dot:nth-child(3) {
    animation-delay: 0.4s;
}


@keyframes bounce {
    to {
        transform: translateY(-15px);
    }
}
</style>