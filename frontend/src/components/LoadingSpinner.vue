<!-- src/components/LoadingSpinner.vue -->
<template>
    <div class="loading-overlay" v-if="show">
        <div class="loading-content">
            <div class="spinner"></div>
            <p>{{ message || 'Carregando...' }}</p>
        </div>
    </div>
</template>

<script>
export default {
    name: 'LoadingSpinner',
    props: { show: Boolean, message: String }
}
</script>

<style scoped>
.loading-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(5px);
    z-index: 9999;
    display: flex;
    justify-content: center;
    align-items: center;
}

.loading-content {
    background: white;
    padding: 2rem;
    border-radius: 16px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
    text-align: center;
}

.spinner {
    width: 40px;
    height: 40px;
    border: 4px solid #f3f3f3;
    border-top: 4px solid #32A398;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin: 0 auto 1rem;
}

.loading-content p {
    margin: 0;
    color: #2c3e50;
    font-weight: 500;
}

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}
</style>