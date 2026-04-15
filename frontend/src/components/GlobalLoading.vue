<template>
    <div v-if="store.isLoading" class="loading-overlay">
        <div class="loading-spinner">
            <div class="loading-dots">
                <div class="dot"></div>
                <div class="dot"></div>
                <div class="dot"></div>
            </div>
            <div class="progress-bar">
                <div class="progress-fill"></div>
            </div>
            <div class="loading-text">{{ store.loadingText }}</div>
        </div>
    </div>
</template>

<script setup>
import { useLoadingStore } from '../stores/loading.js'

const store = useLoadingStore()
</script>

<style scoped>
.loading-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(5px);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
}

.loading-spinner {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
}

.loading-dots {
    display: flex;
    gap: 8px;
}

.dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: linear-gradient(45deg, #32A398 0%, #667eea 100%);
    animation: bounce 1.4s infinite ease-in-out both;
}

.dot:nth-child(1) {
    animation-delay: -0.32s;
}

.dot:nth-child(2) {
    animation-delay: -0.16s;
}

@keyframes bounce {

    0%,
    80%,
    100% {
        transform: scale(0);
    }

    40% {
        transform: scale(1);
    }
}

.progress-bar {
    width: 200px;
    height: 4px;
    background: rgba(0, 0, 0, 0.1);
    border-radius: 2px;
    overflow: hidden;
}

.progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #32A398 0%, #667eea 100%);
    border-radius: 2px;
    width: 0%;
    animation: progress 2s infinite ease-in-out;
}

@keyframes progress {
    0% {
        width: 0%;
    }

    50% {
        width: 70%;
    }

    100% {
        width: 100%;
    }
}

.loading-text {
    font-size: 16px;
    font-weight: 500;
    color: #666;
}

@media (max-width: 768px) {
    .progress-bar {
        width: 150px;
    }

    .loading-text {
        font-size: 14px;
    }
}
</style>