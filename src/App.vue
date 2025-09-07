<template>
    <div class="app-container surface-ground text-color">
        <HeaderBar />
        <main class="main-content">
            <router-view v-slot="{ Component }">
                <transition name="page" mode="out-in">
                    <component :is="Component" />
                </transition>
            </router-view>
        </main>
    </div>
</template>
<script setup>
import HeaderBar from "./components/HeaderBar.vue";
</script>

<style>
.app-container {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
}

.main-content {
    flex: 1;
    display: flex;
    flex-direction: column;
}

/* Only apply full-height layout to Ideas page */
.main-content > .ideas-page {
    flex: 1;
    display: flex;
    flex-direction: column;
    height: calc(100vh - 60px); /* Adjust for header height */
    overflow: hidden;
}

/* Other pages should scroll normally */
.main-content > *:not(.ideas-page) {
    flex: 1;
}
</style>
