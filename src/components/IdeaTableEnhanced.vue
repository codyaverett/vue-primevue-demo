<template>
  <div class="card">
    <Toolbar class="mb-3">
      <template #start>
        <div class="flex align-items-center gap-2 flex-wrap">
          <Button label="New Idea" icon="pi pi-plus" severity="success" @click="openNew" />
          <Button label="Refresh" severity="secondary" icon="pi pi-refresh" @click="store.refresh" :loading="store.loading" />
          <Divider layout="vertical" />
          <Button v-if="selectedItems.length" 
            :label="`Bulk Actions (${selectedItems.length})`" 
            icon="pi pi-cog" 
            severity="warning" 
            @click="bulkActionsMenu.toggle($event)" />
          <Menu ref="bulkActionsMenu" :model="bulkMenuItems" :popup="true" />
        </div>
      </template>
      <template #end>
        <div class="flex align-items-center gap-2 flex-wrap">
          <span class="p-input-icon-left">
            <i class="pi pi-search" />
            <InputText 
              v-model="search" 
              placeholder="Search ideas..." 
              @input="debouncedSearch"
              class="w-12rem md:w-15rem"
            />
          </span>
          <Button icon="pi pi-filter" severity="info" @click="showAdvancedFilters = !showAdvancedFilters" 
            :badge="activeFiltersCount > 0 ? activeFiltersCount.toString() : null" 
            v-tooltip="'Advanced Filters'" />
          <Button icon="pi pi-download" severity="secondary" @click="exportData" v-tooltip="'Export'" />
          <Button icon="pi pi-cog" severity="secondary" @click="showColumnToggle = true" v-tooltip="'Columns'" />
          <ToggleButton 
            v-model="grid" 
            onLabel="Grid" 
            offLabel="Table" 
            :onIcon="'pi pi-th-large'" 
            :offIcon="'pi pi-list'"
          />
        </div>
      </template>
    </Toolbar>

    <div v-if="showAdvancedFilters" class="surface-50 p-3 border-round mb-3">
      <div class="grid">
        <div class="col-12 md:col-3">
          <label class="block mb-2 font-semibold">Category</label>
          <MultiSelect 
            v-model="filters.categories" 
            :options="categories" 
            placeholder="All Categories"
            class="w-full"
            :showToggleAll="true"
            display="chip"
          />
        </div>
        <div class="col-12 md:col-3">
          <label class="block mb-2 font-semibold">Status</label>
          <MultiSelect 
            v-model="filters.statuses" 
            :options="statuses"
            placeholder="All Statuses"
            class="w-full"
            :showToggleAll="true"
            display="chip"
          />
        </div>
        <div class="col-12 md:col-3">
          <label class="block mb-2 font-semibold">Tags</label>
          <MultiSelect 
            v-model="filters.tags" 
            :options="allTags"
            placeholder="All Tags"
            class="w-full"
            :showToggleAll="true"
            display="chip"
            :filter="true"
          />
        </div>
        <div class="col-12 md:col-3">
          <label class="block mb-2 font-semibold">Date Range</label>
          <Calendar 
            v-model="filters.dateRange" 
            selectionMode="range" 
            dateFormat="mm/dd/yy"
            showIcon
            placeholder="Select date range"
            class="w-full"
          />
        </div>
        <div class="col-12">
          <div class="flex gap-2">
            <Button label="Apply Filters" icon="pi pi-check" severity="success" @click="applyFilters" />
            <Button label="Clear All" icon="pi pi-times" severity="secondary" outlined @click="clearFilters" />
          </div>
        </div>
      </div>
    </div>

    <div v-if="grid" class="grid">
      <TransitionGroup name="list-move">
        <div v-for="i in paginatedItems" :key="i.id" class="col-12 md:col-6 lg:col-4">
          <div class="surface-card p-3 border-round shadow-2 h-full flex flex-column">
            <div class="flex justify-content-between align-items-start mb-2">
              <Checkbox v-model="selectedItems" :value="i.id" class="mt-1" />
              <h3 class="mt-0 mb-0 text-xl flex-grow-1 mx-2">{{ i.title }}</h3>
              <div class="flex flex-column align-items-center">
                <Button 
                  icon="pi pi-angle-up" 
                  severity="success"
                  rounded
                  text
                  @click="vote(i)" 
                  :disabled="votingId === i.id || hasVoted(i.id)"
                  v-tooltip.left="hasVoted(i.id) ? 'Already voted' : 'Vote'"
                  class="vote-button"
                />
                <Badge :value="i.votes || 0" severity="info" />
              </div>
            </div>
            <p class="text-600 mb-3 flex-grow-1">{{ i.description }}</p>
            <div class="flex gap-2 mb-2 flex-wrap">
              <Tag :value="i.category" severity="info" />
              <Tag :value="i.status" :severity="statusSeverity(i.status)" />
              <Tag v-if="i.priority" :value="i.priority" :severity="prioritySeverity(i.priority)" />
            </div>
            <div class="text-600 text-sm mb-3">
              <i class="pi pi-tags mr-1"></i>
              {{ (i.tags || []).join(', ') || 'No tags' }}
            </div>
            <div class="text-500 text-xs mb-3">
              <i class="pi pi-calendar mr-1"></i>
              {{ formatDate(i.createdAt) }}
            </div>
            <div class="flex justify-content-end gap-1">
              <Button icon="pi pi-eye" severity="info" text rounded @click="viewDetails(i)" v-tooltip="'View'" />
              <Button icon="pi pi-pencil" severity="secondary" text rounded @click="editRow(i)" v-tooltip="'Edit'" />
              <Button icon="pi pi-trash" severity="danger" text rounded @click="removeRow(i)" v-tooltip="'Delete'" />
            </div>
          </div>
        </div>
      </TransitionGroup>
      <div v-if="!paginatedItems.length" class="col-12">
        <Message severity="info" :closable="false">
          <i class="pi pi-info-circle mr-2"></i>
          No ideas found matching your criteria.
        </Message>
      </div>
    </div>

    <DataTable 
      v-else 
      v-model:selection="selectedItemsTable"
      :value="filtered" 
      :loading="store.loading" 
      dataKey="id" 
      :paginator="true" 
      :rows="rowsPerPage"
      :rowsPerPageOptions="[5, 10, 20, 50]"
      :globalFilterFields="['title', 'description', 'category', 'status', 'tags']"
      :sortField="sortField"
      :sortOrder="sortOrder"
      @sort="onSort"
      class="p-datatable-sm"
      :scrollable="true"
      scrollHeight="600px"
      :resizableColumns="true"
      columnResizeMode="expand"
      stateStorage="local"
      stateKey="idea-table-state"
    >
      <template #empty>
        <div class="p-3 text-600 text-center">
          <i class="pi pi-inbox text-4xl mb-3 block"></i>
          <div>No ideas found.</div>
        </div>
      </template>
      <template #loading>
        <div class="p-3 text-center">
          <i class="pi pi-spin pi-spinner text-4xl"></i>
          <div class="mt-3">Loading ideas...</div>
        </div>
      </template>
      
      <Column selectionMode="multiple" :headerStyle="{ width: '3rem' }" v-if="visibleColumns.includes('selection')"></Column>
      
      <Column field="title" header="Title" :sortable="true" v-if="visibleColumns.includes('title')">
        <template #body="{ data }">
          <div class="font-semibold">{{ data.title }}</div>
        </template>
      </Column>
      
      <Column field="description" header="Description" v-if="visibleColumns.includes('description')">
        <template #body="{ data }">
          <div class="text-600 text-sm" style="max-width: 300px; overflow: hidden; text-overflow: ellipsis;">
            {{ data.description }}
          </div>
        </template>
      </Column>
      
      <Column field="category" header="Category" :sortable="true" v-if="visibleColumns.includes('category')">
        <template #body="{ data }">
          <Tag :value="data.category" severity="info" />
        </template>
        <template #filter="{ filterModel, filterCallback }">
          <MultiSelect 
            v-model="filterModel.value" 
            :options="categories" 
            placeholder="Any"
            @change="filterCallback()"
          />
        </template>
      </Column>
      
      <Column field="status" header="Status" :sortable="true" v-if="visibleColumns.includes('status')">
        <template #body="{ data }">
          <Tag :value="data.status" :severity="statusSeverity(data.status)" />
        </template>
      </Column>
      
      <Column field="priority" header="Priority" :sortable="true" v-if="visibleColumns.includes('priority')">
        <template #body="{ data }">
          <Tag v-if="data.priority" :value="data.priority" :severity="prioritySeverity(data.priority)" />
          <span v-else class="text-500">-</span>
        </template>
      </Column>
      
      <Column field="votes" header="Votes" :sortable="true" style="width: 120px" v-if="visibleColumns.includes('votes')">
        <template #body="{ data }">
          <div class="flex align-items-center gap-2">
            <Button 
              icon="pi pi-angle-up" 
              severity="success"
              size="small"
              rounded
              text
              @click="vote(data)" 
              :disabled="votingId === data.id || hasVoted(data.id)"
              v-tooltip="hasVoted(data.id) ? 'Already voted' : 'Vote'"
              class="vote-button"
            />
            <Badge :value="data.votes || 0" severity="info" />
          </div>
        </template>
      </Column>
      
      <Column field="createdAt" header="Created" :sortable="true" v-if="visibleColumns.includes('createdAt')">
        <template #body="{ data }">
          <span class="text-sm">{{ formatDate(data.createdAt) }}</span>
        </template>
      </Column>
      
      <Column field="tags" header="Tags" v-if="visibleColumns.includes('tags')">
        <template #body="{ data }">
          <div class="flex gap-1 flex-wrap">
            <Chip v-for="tag in (data.tags || [])" :key="tag" :label="tag" class="text-xs" />
          </div>
        </template>
      </Column>
      
      <Column header="Actions" style="width: 150px" :frozen="true" alignFrozen="right" v-if="visibleColumns.includes('actions')">
        <template #body="{ data }">
          <div class="flex gap-1">
            <Button icon="pi pi-eye" severity="info" text rounded size="small" @click="viewDetails(data)" v-tooltip="'View'" />
            <Button icon="pi pi-pencil" severity="secondary" text rounded size="small" @click="editRow(data)" v-tooltip="'Edit'" />
            <Button icon="pi pi-trash" severity="danger" text rounded size="small" @click="removeRow(data)" v-tooltip="'Delete'" />
          </div>
        </template>
      </Column>
    </DataTable>

    <div v-if="grid && filtered.length > itemsPerPage" class="mt-4">
      <Paginator 
        v-model:first="first" 
        :rows="itemsPerPage" 
        :totalRecords="filtered.length"
        :rowsPerPageOptions="[9, 18, 36]"
        template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
      />
    </div>

    <IdeaForm v-model="showForm" :value="editing" @submit="saveRow" />
    
    <Dialog v-model:visible="showDetails" header="Idea Details" :modal="true" :style="{width: '50vw'}" :breakpoints="{'960px': '75vw', '640px': '90vw'}">
      <div v-if="selectedIdea">
        <h2 class="mt-0">{{ selectedIdea.title }}</h2>
        <div class="flex gap-2 mb-3">
          <Tag :value="selectedIdea.category" severity="info" />
          <Tag :value="selectedIdea.status" :severity="statusSeverity(selectedIdea.status)" />
          <Tag v-if="selectedIdea.priority" :value="selectedIdea.priority" :severity="prioritySeverity(selectedIdea.priority)" />
        </div>
        <p class="line-height-3">{{ selectedIdea.description }}</p>
        <div v-if="selectedIdea.impact" class="mb-3">
          <label class="font-semibold">Impact Score:</label>
          <ProgressBar :value="selectedIdea.impact * 10" class="mt-2" />
        </div>
        <div v-if="selectedIdea.complexity" class="mb-3">
          <label class="font-semibold">Complexity:</label>
          <span class="ml-2">{{ selectedIdea.complexity }}</span>
        </div>
        <div v-if="selectedIdea.tags?.length" class="mb-3">
          <label class="font-semibold">Tags:</label>
          <div class="flex gap-2 mt-2 flex-wrap">
            <Chip v-for="tag in selectedIdea.tags" :key="tag" :label="tag" />
          </div>
        </div>
        <div class="text-500 text-sm">
          Created: {{ formatDate(selectedIdea.createdAt) }}
        </div>
      </div>
    </Dialog>

    <Dialog v-model:visible="showColumnToggle" header="Column Visibility" :modal="true" :style="{width: '30vw'}" :breakpoints="{'960px': '50vw', '640px': '80vw'}">
      <div class="flex flex-column gap-3">
        <div v-for="col in allColumns" :key="col.field" class="flex align-items-center">
          <Checkbox 
            :inputId="col.field" 
            :modelValue="visibleColumns.includes(col.field)"
            @update:modelValue="toggleColumn(col.field, $event)"
            :binary="true"
          />
          <label :for="col.field" class="ml-2 cursor-pointer">{{ col.header }}</label>
        </div>
      </div>
      <template #footer>
        <Button label="Reset to Default" severity="secondary" @click="resetColumns" />
        <Button label="Close" @click="showColumnToggle = false" />
      </template>
    </Dialog>
    
    <Toast position="bottom-right" />
    <ConfirmDialog />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useIdeasStore } from '../stores/ideas'
import { useToast } from 'primevue/usetoast'
import { useConfirm } from 'primevue/useconfirm'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Tag from 'primevue/tag'
import Badge from 'primevue/badge'
import Chip from 'primevue/chip'
import Toolbar from 'primevue/toolbar'
import Dropdown from 'primevue/dropdown'
import MultiSelect from 'primevue/multiselect'
import Calendar from 'primevue/calendar'
import ToggleButton from 'primevue/togglebutton'
import Checkbox from 'primevue/checkbox'
import Dialog from 'primevue/dialog'
import Divider from 'primevue/divider'
import Menu from 'primevue/menu'
import Message from 'primevue/message'
import Paginator from 'primevue/paginator'
import ProgressBar from 'primevue/progressbar'
import Toast from 'primevue/toast'
import ConfirmDialog from 'primevue/confirmdialog'
import IdeaForm from './IdeaForm.vue'

const store = useIdeasStore()
const toast = useToast()
const confirm = useConfirm()

const categories = ['Platform', 'UI/UX', 'Performance', 'Integrations', 'Security', 'Documentation', 'Testing']
const statuses = ['New', 'Planned', 'In Progress', 'Done']
const search = ref('')
const filters = ref({ 
  categories: [], 
  statuses: [], 
  tags: [],
  dateRange: null 
})
const grid = ref(false)
const votingId = ref(null)
const votedIdeas = ref(JSON.parse(localStorage.getItem('votedIdeas') || '[]'))
const showAdvancedFilters = ref(false)
const selectedItems = ref([])
const selectedItemsTable = ref([])
const bulkActionsMenu = ref()
const showDetails = ref(false)
const selectedIdea = ref(null)
const showColumnToggle = ref(false)
const sortField = ref('createdAt')
const sortOrder = ref(-1)
const rowsPerPage = ref(10)
const first = ref(0)
const itemsPerPage = ref(9)

const allColumns = [
  { field: 'selection', header: 'Select' },
  { field: 'title', header: 'Title' },
  { field: 'description', header: 'Description' },
  { field: 'category', header: 'Category' },
  { field: 'status', header: 'Status' },
  { field: 'priority', header: 'Priority' },
  { field: 'votes', header: 'Votes' },
  { field: 'createdAt', header: 'Created' },
  { field: 'tags', header: 'Tags' },
  { field: 'actions', header: 'Actions' }
]

const defaultColumns = ['selection', 'title', 'category', 'status', 'votes', 'createdAt', 'actions']
const visibleColumns = ref([...defaultColumns])

const bulkMenuItems = [
  {
    label: 'Change Status',
    icon: 'pi pi-sync',
    items: statuses.map(status => ({
      label: status,
      command: () => bulkChangeStatus(status)
    }))
  },
  {
    label: 'Export Selected',
    icon: 'pi pi-download',
    command: () => exportSelected()
  },
  {
    separator: true
  },
  {
    label: 'Delete Selected',
    icon: 'pi pi-trash',
    command: () => bulkDelete()
  }
]

const allTags = computed(() => {
  const tags = new Set()
  store.items.forEach(item => {
    if (item.tags) {
      item.tags.forEach(tag => tags.add(tag))
    }
  })
  return Array.from(tags)
})

const activeFiltersCount = computed(() => {
  let count = 0
  if (filters.value.categories.length) count++
  if (filters.value.statuses.length) count++
  if (filters.value.tags.length) count++
  if (filters.value.dateRange) count++
  return count
})

const filtered = computed(() => {
  let list = store.items
  const t = search.value.trim().toLowerCase()
  
  if (t) {
    list = list.filter(i =>
      [i.title, i.description, ...(i.tags || [])].some(v =>
        String(v).toLowerCase().includes(t)
      )
    )
  }
  
  if (filters.value.categories.length) {
    list = list.filter(i => filters.value.categories.includes(i.category))
  }
  
  if (filters.value.statuses.length) {
    list = list.filter(i => filters.value.statuses.includes(i.status))
  }
  
  if (filters.value.tags.length) {
    list = list.filter(i => 
      i.tags && i.tags.some(tag => filters.value.tags.includes(tag))
    )
  }
  
  if (filters.value.dateRange && filters.value.dateRange[0]) {
    const startDate = new Date(filters.value.dateRange[0])
    const endDate = filters.value.dateRange[1] ? new Date(filters.value.dateRange[1]) : new Date()
    list = list.filter(i => {
      const createdAt = new Date(i.createdAt)
      return createdAt >= startDate && createdAt <= endDate
    })
  }
  
  return list
})

const paginatedItems = computed(() => {
  const start = first.value
  const end = first.value + itemsPerPage.value
  return filtered.value.slice(start, end)
})

function statusSeverity(s) {
  return s === 'Done' ? 'success' :
         s === 'In Progress' ? 'warning' :
         s === 'Planned' ? 'info' : 'secondary'
}

function prioritySeverity(p) {
  return p === 'critical' ? 'danger' :
         p === 'high' ? 'warning' :
         p === 'medium' ? 'info' : 'secondary'
}

function formatDate(date) {
  if (!date) return '-'
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

function hasVoted(ideaId) {
  return votedIdeas.value.includes(ideaId)
}

const showForm = ref(false)
const editing = ref(null)

function openNew() {
  editing.value = {
    title: '',
    description: '',
    category: '',
    status: 'New',
    tags: []
  }
  showForm.value = true
}

function editRow(row) {
  editing.value = { ...row }
  showForm.value = true
}

async function saveRow(form) {
  if (editing.value?.id) {
    await store.patch(editing.value.id, form)
    toast.add({
      severity: 'success',
      summary: 'Updated',
      detail: 'Idea has been updated successfully',
      life: 3000
    })
  } else {
    await store.add(form)
    toast.add({
      severity: 'success',
      summary: 'Created',
      detail: 'New idea has been created successfully',
      life: 3000
    })
  }
}

async function removeRow(row) {
  confirm.require({
    message: `Are you sure you want to delete "${row.title}"?`,
    header: 'Confirm Delete',
    icon: 'pi pi-exclamation-triangle',
    acceptClass: 'p-button-danger',
    accept: async () => {
      await store.remove(row.id)
      toast.add({
        severity: 'success',
        summary: 'Deleted',
        detail: 'Idea has been deleted',
        life: 3000
      })
    }
  })
}

async function vote(row) {
  if (hasVoted(row.id)) {
    toast.add({
      severity: 'warn',
      summary: 'Already Voted',
      detail: 'You have already voted for this idea',
      life: 3000
    })
    return
  }
  
  votingId.value = row.id
  
  // Optimistic update
  const item = store.items.find(i => i.id === row.id)
  if (item) {
    item.votes = (item.votes || 0) + 1
  }
  
  try {
    await store.upvoteIdea(row.id)
    votedIdeas.value.push(row.id)
    localStorage.setItem('votedIdeas', JSON.stringify(votedIdeas.value))
    
    toast.add({
      severity: 'success',
      summary: 'Vote Recorded',
      detail: 'Thank you for your vote!',
      life: 3000
    })
  } catch (error) {
    // Revert optimistic update
    if (item) {
      item.votes = (item.votes || 1) - 1
    }
    toast.add({
      severity: 'error',
      summary: 'Vote Failed',
      detail: 'Unable to record your vote. Please try again.',
      life: 3000
    })
  } finally {
    votingId.value = null
  }
}

function viewDetails(idea) {
  selectedIdea.value = idea
  showDetails.value = true
}

function applyFilters() {
  first.value = 0
  showAdvancedFilters.value = false
  toast.add({
    severity: 'info',
    summary: 'Filters Applied',
    detail: `Showing ${filtered.value.length} ideas`,
    life: 3000
  })
}

function clearFilters() {
  filters.value = {
    categories: [],
    statuses: [],
    tags: [],
    dateRange: null
  }
  search.value = ''
  first.value = 0
  toast.add({
    severity: 'info',
    summary: 'Filters Cleared',
    detail: 'All filters have been removed',
    life: 3000
  })
}

function exportData() {
  const dataToExport = grid.value ? paginatedItems.value : filtered.value
  const csv = convertToCSV(dataToExport)
  downloadCSV(csv, 'ideas_export.csv')
  
  toast.add({
    severity: 'success',
    summary: 'Export Complete',
    detail: `Exported ${dataToExport.length} ideas`,
    life: 3000
  })
}

function exportSelected() {
  const selectedData = store.items.filter(item => 
    selectedItems.value.includes(item.id) || 
    selectedItemsTable.value.some(s => s.id === item.id)
  )
  const csv = convertToCSV(selectedData)
  downloadCSV(csv, 'selected_ideas_export.csv')
  
  toast.add({
    severity: 'success',
    summary: 'Export Complete',
    detail: `Exported ${selectedData.length} selected ideas`,
    life: 3000
  })
}

function convertToCSV(data) {
  const headers = ['Title', 'Description', 'Category', 'Status', 'Priority', 'Votes', 'Tags', 'Created']
  const rows = data.map(item => [
    item.title,
    item.description,
    item.category,
    item.status,
    item.priority || '',
    item.votes || 0,
    (item.tags || []).join(';'),
    formatDate(item.createdAt)
  ])
  
  const csv = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
  ].join('\n')
  
  return csv
}

function downloadCSV(csv, filename) {
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  link.setAttribute('href', url)
  link.setAttribute('download', filename)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

async function bulkChangeStatus(status) {
  const selectedIds = [...selectedItems.value, ...selectedItemsTable.value.map(s => s.id)]
  const uniqueIds = [...new Set(selectedIds)]
  
  confirm.require({
    message: `Change status to "${status}" for ${uniqueIds.length} selected ideas?`,
    header: 'Confirm Status Change',
    icon: 'pi pi-sync',
    accept: async () => {
      for (const id of uniqueIds) {
        await store.patch(id, { status })
      }
      selectedItems.value = []
      selectedItemsTable.value = []
      
      toast.add({
        severity: 'success',
        summary: 'Status Updated',
        detail: `Updated ${uniqueIds.length} ideas to "${status}"`,
        life: 3000
      })
    }
  })
}

async function bulkDelete() {
  const selectedIds = [...selectedItems.value, ...selectedItemsTable.value.map(s => s.id)]
  const uniqueIds = [...new Set(selectedIds)]
  
  confirm.require({
    message: `Are you sure you want to delete ${uniqueIds.length} selected ideas?`,
    header: 'Confirm Delete',
    icon: 'pi pi-exclamation-triangle',
    acceptClass: 'p-button-danger',
    accept: async () => {
      for (const id of uniqueIds) {
        await store.remove(id)
      }
      selectedItems.value = []
      selectedItemsTable.value = []
      
      toast.add({
        severity: 'success',
        summary: 'Deleted',
        detail: `Deleted ${uniqueIds.length} ideas`,
        life: 3000
      })
    }
  })
}

function toggleColumn(field, visible) {
  if (visible) {
    visibleColumns.value.push(field)
  } else {
    visibleColumns.value = visibleColumns.value.filter(c => c !== field)
  }
  localStorage.setItem('ideaTableColumns', JSON.stringify(visibleColumns.value))
}

function resetColumns() {
  visibleColumns.value = [...defaultColumns]
  localStorage.removeItem('ideaTableColumns')
  toast.add({
    severity: 'info',
    summary: 'Columns Reset',
    detail: 'Column visibility reset to default',
    life: 3000
  })
}

function onSort(event) {
  sortField.value = event.sortField
  sortOrder.value = event.sortOrder
}

let searchTimeout = null
function debouncedSearch() {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    first.value = 0
  }, 300)
}

watch(() => store.items, () => {
  selectedItems.value = selectedItems.value.filter(id =>
    store.items.some(item => item.id === id)
  )
  selectedItemsTable.value = selectedItemsTable.value.filter(item =>
    store.items.some(i => i.id === item.id)
  )
})

onMounted(() => {
  store.refresh()
  
  const savedColumns = localStorage.getItem('ideaTableColumns')
  if (savedColumns) {
    visibleColumns.value = JSON.parse(savedColumns)
  }
  
  const savedView = localStorage.getItem('ideaTableView')
  if (savedView) {
    grid.value = savedView === 'grid'
  }
})

watch(grid, (newVal) => {
  localStorage.setItem('ideaTableView', newVal ? 'grid' : 'table')
})
</script>

<style scoped>
.card {
  background: var(--surface-card);
  border-radius: var(--border-radius);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
  padding: 1.5rem;
}

.vote-button {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.vote-button:not(:disabled):hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.vote-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.list-move-move,
.list-move-enter-active,
.list-move-leave-active {
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.list-move-enter-from {
  opacity: 0;
  transform: translateY(30px);
}

.list-move-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}

.list-move-leave-active {
  position: absolute;
}

:deep(.p-datatable .p-datatable-thead > tr > th) {
  background: var(--surface-50);
  color: var(--text-color);
  font-weight: 600;
  padding: 1rem;
}

:deep(.p-datatable .p-datatable-tbody > tr) {
  transition: background-color 0.2s;
}

:deep(.p-datatable .p-datatable-tbody > tr:hover) {
  background: var(--surface-50);
}

:deep(.p-paginator) {
  background: var(--surface-card);
  border: none;
  padding: 1rem;
}

@media (max-width: 768px) {
  .card {
    padding: 1rem;
  }
  
  :deep(.p-toolbar) {
    flex-direction: column;
    align-items: stretch;
    
    .p-toolbar-group-left,
    .p-toolbar-group-right {
      justify-content: center;
    }
  }
}
</style>