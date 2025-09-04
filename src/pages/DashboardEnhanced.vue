<template>
  <div>
    <div class="grid mb-4">
      <!-- KPI Cards Row 1 -->
      <div class="col-12 md:col-6 lg:col-3">
        <div class="surface-card p-3 border-round shadow-2">
          <div class="flex justify-content-between align-items-start">
            <div>
              <span class="block text-500 font-semibold mb-2">Total Ideas</span>
              <div class="text-3xl font-bold text-900">{{ stats.total }}</div>
              <span class="text-green-500 font-semibold text-sm">
                <i class="pi pi-arrow-up"></i> {{ newThisMonth }} this month
              </span>
            </div>
            <div class="flex align-items-center justify-content-center bg-blue-100 border-round" style="width: 3rem; height: 3rem">
              <i class="pi pi-lightbulb text-blue-500 text-2xl"></i>
            </div>
          </div>
        </div>
      </div>

      <div class="col-12 md:col-6 lg:col-3">
        <div class="surface-card p-3 border-round shadow-2">
          <div class="flex justify-content-between align-items-start">
            <div>
              <span class="block text-500 font-semibold mb-2">Most Voted</span>
              <div class="text-2xl font-bold text-900 text-overflow-ellipsis overflow-hidden white-space-nowrap" style="max-width: 150px">
                {{ stats.mostVoted?.title || 'None yet' }}
              </div>
              <span class="text-blue-500 font-semibold text-sm">
                <i class="pi pi-thumbs-up"></i> {{ stats.mostVoted?.votes || 0 }} votes
              </span>
            </div>
            <div class="flex align-items-center justify-content-center bg-green-100 border-round" style="width: 3rem; height: 3rem">
              <i class="pi pi-star text-green-500 text-2xl"></i>
            </div>
          </div>
        </div>
      </div>

      <div class="col-12 md:col-6 lg:col-3">
        <div class="surface-card p-3 border-round shadow-2">
          <div class="flex justify-content-between align-items-start">
            <div>
              <span class="block text-500 font-semibold mb-2">In Progress</span>
              <div class="text-3xl font-bold text-900">{{ stats.byStatus['In Progress'] || 0 }}</div>
              <ProgressBar :value="progressPercentage" :showValue="false" class="mt-2" style="height: 6px" />
            </div>
            <div class="flex align-items-center justify-content-center bg-orange-100 border-round" style="width: 3rem; height: 3rem">
              <i class="pi pi-spin pi-spinner text-orange-500 text-2xl"></i>
            </div>
          </div>
        </div>
      </div>

      <div class="col-12 md:col-6 lg:col-3">
        <div class="surface-card p-3 border-round shadow-2">
          <div class="flex justify-content-between align-items-start">
            <div>
              <span class="block text-500 font-semibold mb-2">Completion Rate</span>
              <div class="text-3xl font-bold text-900">{{ completionRate }}%</div>
              <span class="text-purple-500 font-semibold text-sm">
                <i class="pi pi-check-circle"></i> {{ stats.byStatus['Done'] || 0 }} completed
              </span>
            </div>
            <div class="flex align-items-center justify-content-center bg-purple-100 border-round" style="width: 3rem; height: 3rem">
              <i class="pi pi-chart-pie text-purple-500 text-2xl"></i>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Status Cards Row -->
    <div class="grid mb-4">
      <div class="col-12 md:col-3" v-for="(count, status) in stats.byStatus" :key="status">
        <div class="surface-card p-3 border-round shadow-1">
          <div class="flex justify-content-between align-items-center">
            <div>
              <span class="text-500 text-sm font-semibold">{{ status }}</span>
              <div class="text-2xl font-bold mt-1">{{ count }}</div>
            </div>
            <Tag :value="status" :severity="statusSeverity(status)" />
          </div>
        </div>
      </div>
    </div>

    <!-- Charts Row -->
    <div class="grid mb-4">
      <div class="col-12 lg:col-6">
        <div class="surface-card p-4 border-round shadow-2">
          <div class="flex justify-content-between align-items-center mb-3">
            <h3 class="mt-0 mb-0">Status Distribution</h3>
            <Button icon="pi pi-refresh" severity="secondary" text @click="refreshCharts" />
          </div>
          <canvas ref="statusChart" height="300"></canvas>
        </div>
      </div>

      <div class="col-12 lg:col-6">
        <div class="surface-card p-4 border-round shadow-2">
          <div class="flex justify-content-between align-items-center mb-3">
            <h3 class="mt-0 mb-0">Ideas by Category</h3>
            <Button icon="pi pi-refresh" severity="secondary" text @click="refreshCharts" />
          </div>
          <canvas ref="categoryChart" height="300"></canvas>
        </div>
      </div>
    </div>

    <div class="grid mb-4">
      <div class="col-12">
        <div class="surface-card p-4 border-round shadow-2">
          <div class="flex justify-content-between align-items-center mb-3">
            <h3 class="mt-0 mb-0">Ideas Trend (Last 7 Days)</h3>
            <div class="flex gap-2">
              <Tag severity="info">{{ totalLastWeek }} ideas</Tag>
              <Button icon="pi pi-refresh" severity="secondary" text @click="refreshCharts" />
            </div>
          </div>
          <canvas ref="trendChart" height="100"></canvas>
        </div>
      </div>
    </div>

    <!-- Top Ideas Section -->
    <div class="grid mb-4">
      <div class="col-12 lg:col-6">
        <div class="surface-card p-4 border-round shadow-2">
          <h3 class="mt-0 mb-3">🔥 Trending Ideas</h3>
          <div v-if="trendingIdeas.length">
            <div v-for="(idea, index) in trendingIdeas" :key="idea.id" class="flex align-items-center justify-content-between p-2 mb-2 hover:surface-hover border-round">
              <div class="flex align-items-center gap-3">
                <Badge :value="index + 1" severity="warning" />
                <div>
                  <div class="font-semibold">{{ idea.title }}</div>
                  <div class="text-sm text-500">{{ idea.category }}</div>
                </div>
              </div>
              <div class="flex align-items-center gap-2">
                <i class="pi pi-thumbs-up text-green-500"></i>
                <span class="font-semibold">{{ idea.votes }}</span>
              </div>
            </div>
          </div>
          <div v-else class="text-center text-500 py-4">
            <i class="pi pi-inbox text-3xl mb-2"></i>
            <p>No trending ideas yet</p>
          </div>
        </div>
      </div>

      <div class="col-12 lg:col-6">
        <div class="surface-card p-4 border-round shadow-2">
          <h3 class="mt-0 mb-3">📊 Category Performance</h3>
          <div v-for="cat in categoryPerformance" :key="cat.category" class="mb-3">
            <div class="flex justify-content-between align-items-center mb-1">
              <span class="font-semibold">{{ cat.category }}</span>
              <span class="text-sm text-500">{{ cat.count }} ideas</span>
            </div>
            <ProgressBar :value="cat.percentage" :showValue="false" style="height: 8px">
              <template #start>
                <span class="text-xs">{{ cat.percentage }}%</span>
              </template>
            </ProgressBar>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Activity -->
    <div class="grid mb-4">
      <div class="col-12">
        <div class="surface-card p-4 border-round shadow-2">
          <div class="flex justify-content-between align-items-center mb-3">
            <h3 class="mt-0 mb-0">Recent Activity</h3>
            <Button label="View All Ideas" icon="pi pi-arrow-right" text @click="$router.push('/ideas')" />
          </div>
          <DataTable :value="recentIdeas" :paginator="false" class="p-datatable-sm" responsiveLayout="scroll">
            <Column field="title" header="Title" style="min-width: 200px">
              <template #body="{ data }">
                <div class="font-semibold">{{ data.title }}</div>
              </template>
            </Column>
            <Column field="category" header="Category">
              <template #body="{ data }">
                <Tag :value="data.category" severity="info" />
              </template>
            </Column>
            <Column field="status" header="Status">
              <template #body="{ data }">
                <Tag :value="data.status" :severity="statusSeverity(data.status)" />
              </template>
            </Column>
            <Column field="createdAt" header="Created">
              <template #body="{ data }">
                <span class="text-sm">{{ formatDate(data.createdAt) }}</span>
              </template>
            </Column>
            <Column field="votes" header="Votes">
              <template #body="{ data }">
                <Badge :value="data.votes || 0" severity="success" />
              </template>
            </Column>
          </DataTable>
        </div>
      </div>
    </div>

    <!-- Full Ideas Table -->
    <div class="grid">
      <div class="col-12">
        <IdeaTableEnhanced />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useIdeasStore } from '../stores/ideas'
import Chart from 'chart.js/auto'
import IdeaTableEnhanced from '../components/IdeaTableEnhanced.vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Tag from 'primevue/tag'
import Badge from 'primevue/badge'
import Button from 'primevue/button'
import ProgressBar from 'primevue/progressbar'

const router = useRouter()
const store = useIdeasStore()
const stats = computed(() => store.stats)

const statusChart = ref(null)
const categoryChart = ref(null)
const trendChart = ref(null)
let statusChartInstance = null
let categoryChartInstance = null
let trendChartInstance = null

const newThisMonth = computed(() => {
  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  return store.items.filter(item => new Date(item.createdAt) >= startOfMonth).length
})

const progressPercentage = computed(() => {
  const total = stats.value.total
  const inProgress = stats.value.byStatus['In Progress'] || 0
  return total > 0 ? Math.round((inProgress / total) * 100) : 0
})

const completionRate = computed(() => {
  const total = stats.value.total
  const done = stats.value.byStatus['Done'] || 0
  return total > 0 ? Math.round((done / total) * 100) : 0
})

const trendingIdeas = computed(() => {
  return store.items
    .filter(item => item.votes > 0)
    .sort((a, b) => (b.votes || 0) - (a.votes || 0))
    .slice(0, 5)
})

const recentIdeas = computed(() => {
  return store.items
    .slice()
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5)
})

const categoryPerformance = computed(() => {
  const categories = {}
  store.items.forEach(item => {
    categories[item.category] = (categories[item.category] || 0) + 1
  })
  
  const total = store.items.length
  return Object.entries(categories)
    .map(([category, count]) => ({
      category,
      count,
      percentage: total > 0 ? Math.round((count / total) * 100) : 0
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)
})

const totalLastWeek = computed(() => {
  const now = new Date()
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
  return store.items.filter(item => new Date(item.createdAt) >= weekAgo).length
})

function statusSeverity(status) {
  return status === 'Done' ? 'success' :
         status === 'In Progress' ? 'warning' :
         status === 'Planned' ? 'info' : 'secondary'
}

function formatDate(date) {
  if (!date) return '-'
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

function initCharts() {
  // Status Distribution Chart (Doughnut)
  if (statusChart.value) {
    const statusData = Object.entries(stats.value.byStatus || {})
    
    if (statusChartInstance) {
      statusChartInstance.destroy()
    }
    
    statusChartInstance = new Chart(statusChart.value, {
      type: 'doughnut',
      data: {
        labels: statusData.map(([status]) => status),
        datasets: [{
          data: statusData.map(([, count]) => count),
          backgroundColor: [
            '#10b981', // success - Done
            '#f59e0b', // warning - In Progress
            '#3b82f6', // info - Planned
            '#94a3b8'  // secondary - New
          ],
          borderWidth: 2,
          borderColor: '#ffffff'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              padding: 15,
              usePointStyle: true
            }
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const total = context.dataset.data.reduce((a, b) => a + b, 0)
                const percentage = ((context.parsed / total) * 100).toFixed(1)
                return `${context.label}: ${context.parsed} (${percentage}%)`
              }
            }
          }
        }
      }
    })
  }

  // Category Chart (Horizontal Bar)
  if (categoryChart.value) {
    const categoryData = {}
    store.items.forEach(item => {
      categoryData[item.category] = (categoryData[item.category] || 0) + 1
    })
    
    if (categoryChartInstance) {
      categoryChartInstance.destroy()
    }
    
    categoryChartInstance = new Chart(categoryChart.value, {
      type: 'bar',
      data: {
        labels: Object.keys(categoryData),
        datasets: [{
          label: 'Ideas',
          data: Object.values(categoryData),
          backgroundColor: '#3b82f6',
          borderRadius: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: 'y',
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          x: {
            beginAtZero: true,
            ticks: {
              stepSize: 1
            }
          }
        }
      }
    })
  }

  // Trend Chart (Line)
  if (trendChart.value) {
    const last7Days = []
    const counts = []
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      date.setHours(0, 0, 0, 0)
      
      const nextDate = new Date(date)
      nextDate.setDate(nextDate.getDate() + 1)
      
      const count = store.items.filter(item => {
        const itemDate = new Date(item.createdAt)
        return itemDate >= date && itemDate < nextDate
      }).length
      
      last7Days.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }))
      counts.push(count)
    }
    
    if (trendChartInstance) {
      trendChartInstance.destroy()
    }
    
    trendChartInstance = new Chart(trendChart.value, {
      type: 'line',
      data: {
        labels: last7Days,
        datasets: [{
          label: 'New Ideas',
          data: counts,
          borderColor: '#3b82f6',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          tension: 0.4,
          fill: true
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 1
            }
          }
        }
      }
    })
  }
}

function refreshCharts() {
  store.refresh()
  nextTick(() => {
    initCharts()
  })
}

watch(() => store.items, () => {
  nextTick(() => {
    initCharts()
  })
}, { deep: true })

onMounted(() => {
  store.refresh()
  nextTick(() => {
    initCharts()
  })
})
</script>

<style scoped>
.hover\:surface-hover:hover {
  background: var(--surface-hover);
  cursor: pointer;
}

canvas {
  max-height: 300px;
}

:deep(.p-progressbar) {
  background: var(--surface-200);
}

:deep(.p-progressbar-value) {
  background: linear-gradient(90deg, var(--primary-color) 0%, var(--primary-400) 100%);
}

@media (max-width: 768px) {
  canvas {
    max-height: 250px;
  }
}
</style>