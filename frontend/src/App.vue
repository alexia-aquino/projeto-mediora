<template>
  <div id="app">
    <main>
      <router-view v-slot="{ Component }">
        <transition name="page-fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background: hsla(229, 76%, 66%, 1);
  background: linear-gradient(225deg, hsla(229, 76%, 66%, 1) 0%, hsla(191, 47%, 73%, 1) 50%, hsla(32, 49%, 80%, 1) 100%);
  background: -moz-linear-gradient(225deg, hsla(229, 76%, 66%, 1) 0%, hsla(191, 47%, 73%, 1) 50%, hsla(32, 49%, 80%, 1) 100%);
  background: -webkit-linear-gradient(225deg, hsla(229, 76%, 66%, 1) 0%, hsla(191, 47%, 73%, 1) 50%, hsla(32, 49%, 80%, 1) 100%);
  filter: progid: DXImageTransform.Microsoft.gradient(startColorstr="#667EEA", endColorstr="#9ACFDB", GradientType=1);
  min-height: 100vh;
}

/* ANIMAÇÕES

/* Fade In/Out */
.page-fade-enter-active,
.page-fade-leave-active {
  transition: opacity 0.3s ease;
}

.page-fade-enter-from,
.page-fade-leave-to {
  opacity: 0;
}

/* Slide Up/Down */
.page-slide-enter-active,
.page-slide-leave-active {
  transition: all 0.4s ease;
}

.page-slide-enter-from {
  opacity: 0;
  transform: translateY(30px);
}

.page-slide-leave-to {
  opacity: 0;
  transform: translateY(-30px);
}

/* Zoom In/Out */
.page-zoom-enter-active,
.page-zoom-leave-active {
  transition: all 0.3s ease;
}

.page-zoom-enter-from {
  opacity: 0;
  transform: scale(0.95);
}

.page-zoom-leave-to {
  opacity: 0;
  transform: scale(1.05);
}

#app {
  min-height: 100vh;
}

main {
  width: 100%;
}
</style>