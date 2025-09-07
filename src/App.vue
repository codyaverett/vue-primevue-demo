<template>
    <div class="min-h-screen surface-ground text-color">
        <HeaderBar />
        <main>
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
