<template>
    <div class="min-h-screen surface-ground text-color">
        <HeaderBarEnhanced />
        <main class="p-3 md:p-4 lg:p-5">
            <router-view />
        </main>
    </div>
</template>
<script setup>
import HeaderBarEnhanced from './components/HeaderBarEnhanced.vue';
</script>
