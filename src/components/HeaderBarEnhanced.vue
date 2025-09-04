<template>
  <div class="surface-0 shadow-2 relative">
    <div class="container mx-auto px-3 py-3">
      <div class="flex align-items-center justify-content-between flex-wrap gap-3">
        <div class="flex align-items-center gap-3">
          <i class="pi pi-lightbulb text-3xl text-primary"></i>
          <router-link to="/dashboard" class="text-2xl font-bold text-color no-underline">
            IdeaHub
          </router-link>
        </div>
        
        <div class="flex align-items-center gap-2">
          <!-- Desktop Menu -->
          <div class="hidden md:flex align-items-center gap-2">
            <router-link v-for="item in menuItems" :key="item.path" 
              :to="item.path" 
              class="p-button p-component p-button-text p-button-rounded"
              :class="{ 'router-link-active': $route.path === item.path }">
              <i :class="item.icon" class="mr-2"></i>
              <span class="p-button-label">{{ item.label }}</span>
            </router-link>
          </div>

          <!-- Theme Toggle -->
          <Button 
            :icon="`pi pi-${currentTheme === 'dark' ? 'sun' : 'moon'}`" 
            severity="secondary"
            text
            rounded
            @click="toggleTheme"
            v-tooltip.bottom="`Switch to ${currentTheme === 'dark' ? 'light' : 'dark'} mode`"
            class="theme-toggle-btn"
          />

          <!-- User Menu -->
          <Button 
            icon="pi pi-user" 
            severity="secondary"
            text
            rounded
            @click="userMenu.toggle($event)"
            v-tooltip.bottom="'User menu'"
          />
          <Menu ref="userMenu" :model="userMenuItems" :popup="true" />

          <!-- Mobile Menu Toggle -->
          <Button 
            icon="pi pi-bars" 
            severity="secondary"
            text
            rounded
            @click="mobileMenuVisible = !mobileMenuVisible"
            class="md:hidden"
          />
        </div>
      </div>
    </div>

    <!-- Mobile Menu -->
    <Sidebar v-model:visible="mobileMenuVisible" position="right" :showCloseIcon="false">
      <template #header>
        <div class="flex align-items-center gap-2 w-full">
          <i class="pi pi-lightbulb text-2xl text-primary"></i>
          <span class="text-xl font-bold">IdeaHub</span>
        </div>
      </template>
      
      <div class="flex flex-column gap-3">
        <router-link v-for="item in menuItems" :key="item.path" 
          :to="item.path" 
          @click="mobileMenuVisible = false"
          class="flex align-items-center gap-3 p-3 border-round hover:surface-hover no-underline text-color"
          :class="{ 'surface-100': $route.path === item.path }">
          <i :class="item.icon" class="text-xl"></i>
          <span class="text-lg">{{ item.label }}</span>
        </router-link>
        
        <Divider />
        
        <div class="px-3">
          <label class="font-semibold block mb-2">Theme</label>
          <SelectButton 
            v-model="currentTheme" 
            :options="themeOptions" 
            optionLabel="label"
            optionValue="value"
            @change="setTheme($event.value)"
            class="w-full"
          />
        </div>
      </div>
    </Sidebar>

    <!-- Announcement Bar -->
    <Transition name="announcement">
      <Message 
        v-if="showAnnouncement" 
        severity="info" 
        :closable="true"
        @close="dismissAnnouncement"
        class="m-0 border-noround border-none announcement-message"
        :pt="{
          root: { class: 'surface-100 border-0 border-noround' },
          wrapper: { class: 'flex align-items-center justify-content-center py-2' },
          text: { class: 'text-center flex-1' }
        }">
        <template #default>
          <div class="flex align-items-center justify-content-center gap-2 w-full announcement-content">
            <i class="pi pi-megaphone"></i>
            <span class="font-medium">Welcome to IdeaHub! Submit your innovative ideas and vote on others.</span>
          </div>
        </template>
      </Message>
    </Transition>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useTheme } from '../composables/useTheme'
import Button from 'primevue/button'
import Menu from 'primevue/menu'
import Sidebar from 'primevue/sidebar'
import Divider from 'primevue/divider'
import SelectButton from 'primevue/selectbutton'
import Message from 'primevue/message'

const route = useRoute()
const { currentTheme, toggleTheme, setTheme, initTheme } = useTheme()

const mobileMenuVisible = ref(false)
const showAnnouncement = ref(true)
const userMenu = ref()

const menuItems = [
  { label: 'Dashboard', path: '/dashboard', icon: 'pi pi-chart-pie' },
  { label: 'Ideas', path: '/ideas', icon: 'pi pi-list' },
  { label: 'Submit', path: '/submit', icon: 'pi pi-plus-circle' },
  { label: 'Style Guide', path: '/style-guide', icon: 'pi pi-palette' }
]

const userMenuItems = [
  {
    label: 'Profile',
    icon: 'pi pi-user',
    command: () => {
      // Navigate to profile
    }
  },
  {
    label: 'Settings',
    icon: 'pi pi-cog',
    command: () => {
      // Navigate to settings
    }
  },
  { separator: true },
  {
    label: 'Sign Out',
    icon: 'pi pi-sign-out',
    command: () => {
      // Handle sign out
    }
  }
]

const themeOptions = [
  { label: 'Light', value: 'light', icon: 'pi pi-sun' },
  { label: 'Dark', value: 'dark', icon: 'pi pi-moon' }
]

// Check if announcement was previously dismissed
onMounted(() => {
  initTheme()
  const announcementDismissed = localStorage.getItem('announcement-dismissed')
  if (announcementDismissed) {
    showAnnouncement.value = false
  }
})

// Save announcement dismissal
function dismissAnnouncement() {
  showAnnouncement.value = false
  localStorage.setItem('announcement-dismissed', 'true')
}
</script>

<style scoped>
.router-link-active {
  background: var(--surface-100);
  color: var(--primary-color);
}

.hover\:surface-hover:hover {
  background: var(--surface-hover);
}

.theme-toggle-btn {
  transition: transform 0.3s ease;
}

.theme-toggle-btn:hover {
  transform: rotate(15deg);
}

/* Message bar styling */
:deep(.p-message) {
  border-radius: 0;
  margin: 0;
  border: none;
}

:deep(.p-message-wrapper) {
  padding: 0.75rem 1rem;
}

:deep(.p-message-close) {
  width: 1.75rem;
  height: 1.75rem;
  margin-left: auto;
}

:deep(.p-message.p-message-info) {
  background: var(--primary-50);
  border: none;
  color: var(--primary-900);
}

:deep(.p-message.p-message-info .p-message-icon) {
  color: var(--primary-600);
}

:deep(.p-message.p-message-info .p-message-close) {
  color: var(--primary-600);
}

:deep(.p-message.p-message-info .p-message-close:hover) {
  background: var(--primary-100);
}

/* Dark theme message styling */
:global(.dark-theme) :deep(.p-message.p-message-info) {
  background: rgba(59, 130, 246, 0.15);
  color: #e5e7eb;
  border: 1px solid rgba(59, 130, 246, 0.3);
}

:global(.dark-theme) :deep(.p-message.p-message-info .p-message-text) {
  color: #f3f4f6;
  font-weight: 500;
}

:global(.dark-theme) :deep(.p-message.p-message-info .p-message-icon),
:global(.dark-theme) :deep(.p-message.p-message-info .p-message-close) {
  color: #60a5fa;
}

:global(.dark-theme) :deep(.p-message.p-message-info .p-message-close:hover) {
  background: rgba(59, 130, 246, 0.2);
}

/* Announcement transition animations */
.announcement-enter-active,
.announcement-leave-active {
  transition: all 0.2s ease;
  max-height: 60px;
}

.announcement-enter-from,
.announcement-leave-to {
  opacity: 0;
  max-height: 0;
  transform: translateY(-10px);
}

/* Prevent announcement from flashing during theme change */
.announcement-message {
  will-change: background-color, color;
}

/* Announcement content styling */
.announcement-content i {
  color: var(--primary-600);
}

.announcement-content span {
  color: var(--primary-900);
}

/* Dark theme announcement content */
:global(.dark-theme) .announcement-content i {
  color: #60a5fa;
}

:global(.dark-theme) .announcement-content span {
  color: #f9fafb;
  font-weight: 500;
}

/* Dark theme specific styles */
:global(.dark-theme) {
  --surface-0: #1e1e1e;
  --surface-50: #2a2a2a;
  --surface-100: #363636;
  --surface-200: #4f4f4f;
  --surface-300: #6c6c6c;
  --surface-400: #898989;
  --surface-500: #a6a6a6;
  --surface-600: #c2c2c2;
  --surface-700: #dedede;
  --surface-800: #f4f4f4;
  --surface-900: #ffffff;
  --surface-ground: #121212;
  --surface-section: #1e1e1e;
  --surface-card: #1e1e1e;
  --surface-overlay: #1e1e1e;
  --surface-hover: rgba(255, 255, 255, 0.03);
  --text-color: rgba(255, 255, 255, 0.87);
  --text-color-secondary: rgba(255, 255, 255, 0.6);
}

@media (max-width: 768px) {
  .container {
    padding: 0.75rem;
  }
}
</style>