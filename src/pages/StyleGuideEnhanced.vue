<template>
  <div class="style-guide">
    <div class="mb-5">
      <h1 class="text-4xl font-bold mb-2">IdeaHub Style Guide</h1>
      <p class="text-xl text-500">Design system and component showcase</p>
    </div>

    <!-- Colors Section -->
    <section class="mb-6">
      <h2 class="text-2xl font-bold mb-4">Color Palette</h2>
      <div class="grid">
        <div class="col-12 md:col-6">
          <h3 class="text-lg font-semibold mb-3">Primary Colors</h3>
          <div class="flex flex-column gap-2">
            <div v-for="shade in primaryShades" :key="shade" class="flex align-items-center gap-3">
              <div :class="`bg-primary-${shade}`" class="color-box"></div>
              <span class="font-mono text-sm">primary-{{ shade }}</span>
            </div>
          </div>
        </div>
        <div class="col-12 md:col-6">
          <h3 class="text-lg font-semibold mb-3">Surface Colors</h3>
          <div class="flex flex-column gap-2">
            <div v-for="shade in surfaceShades" :key="shade" class="flex align-items-center gap-3">
              <div :class="`bg-${shade}`" class="color-box border-1 border-300"></div>
              <span class="font-mono text-sm">{{ shade }}</span>
            </div>
          </div>
        </div>
        <div class="col-12">
          <h3 class="text-lg font-semibold mb-3">Semantic Colors</h3>
          <div class="grid">
            <div v-for="color in semanticColors" :key="color.name" class="col-6 md:col-3">
              <div class="flex align-items-center gap-3">
                <div :class="`bg-${color.class}-500`" class="color-box"></div>
                <span class="font-mono text-sm">{{ color.name }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <Divider />

    <!-- Typography Section -->
    <section class="mb-6">
      <h2 class="text-2xl font-bold mb-4">Typography</h2>
      <div class="surface-card p-4 border-round">
        <h1 class="mb-3">Heading 1 - The quick brown fox</h1>
        <h2 class="mb-3">Heading 2 - The quick brown fox</h2>
        <h3 class="mb-3">Heading 3 - The quick brown fox</h3>
        <h4 class="mb-3">Heading 4 - The quick brown fox</h4>
        <h5 class="mb-3">Heading 5 - The quick brown fox</h5>
        <h6 class="mb-3">Heading 6 - The quick brown fox</h6>
        <p class="mb-3">Body text - Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio.</p>
        <p class="text-sm mb-3">Small text - Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
        <p class="text-xs mb-3">Extra small text - Lorem ipsum dolor sit amet.</p>
        <p class="font-bold mb-3">Bold text - The quick brown fox jumps over the lazy dog</p>
        <p class="font-italic mb-3">Italic text - The quick brown fox jumps over the lazy dog</p>
        <p class="font-mono">Monospace text - const example = 'Hello World';</p>
      </div>
    </section>

    <Divider />

    <!-- Buttons Section -->
    <section class="mb-6">
      <h2 class="text-2xl font-bold mb-4">Buttons</h2>
      
      <div class="mb-4">
        <h3 class="text-lg font-semibold mb-3">Severities</h3>
        <div class="flex flex-wrap gap-2">
          <Button label="Primary" />
          <Button label="Secondary" severity="secondary" />
          <Button label="Success" severity="success" />
          <Button label="Info" severity="info" />
          <Button label="Warning" severity="warning" />
          <Button label="Danger" severity="danger" />
          <Button label="Help" severity="help" />
        </div>
      </div>

      <div class="mb-4">
        <h3 class="text-lg font-semibold mb-3">Variants</h3>
        <div class="flex flex-wrap gap-2">
          <Button label="Default" />
          <Button label="Outlined" outlined />
          <Button label="Text" text />
          <Button label="Raised" raised />
          <Button label="Rounded" rounded />
          <Button label="Link" link />
        </div>
      </div>

      <div class="mb-4">
        <h3 class="text-lg font-semibold mb-3">With Icons</h3>
        <div class="flex flex-wrap gap-2">
          <Button label="Save" icon="pi pi-check" />
          <Button label="Delete" icon="pi pi-trash" severity="danger" />
          <Button icon="pi pi-search" rounded text />
          <Button icon="pi pi-user" rounded outlined />
          <Button label="Upload" icon="pi pi-upload" iconPos="right" />
        </div>
      </div>

      <div class="mb-4">
        <h3 class="text-lg font-semibold mb-3">Sizes</h3>
        <div class="flex flex-wrap align-items-center gap-2">
          <Button label="Small" size="small" />
          <Button label="Normal" />
          <Button label="Large" size="large" />
        </div>
      </div>

      <div class="mb-4">
        <h3 class="text-lg font-semibold mb-3">States</h3>
        <div class="flex flex-wrap gap-2">
          <Button label="Normal" />
          <Button label="Disabled" :disabled="true" />
          <Button label="Loading" :loading="true" />
        </div>
      </div>
    </section>

    <Divider />

    <!-- Form Elements Section -->
    <section class="mb-6">
      <h2 class="text-2xl font-bold mb-4">Form Elements</h2>
      
      <div class="grid">
        <div class="col-12 md:col-6">
          <div class="surface-card p-4 border-round">
            <h3 class="text-lg font-semibold mb-3">Input Fields</h3>
            
            <div class="field">
              <label for="input1" class="block mb-2">Standard Input</label>
              <InputText id="input1" v-model="formDemo.text" placeholder="Enter text" class="w-full" />
            </div>

            <div class="field">
              <label for="input2" class="block mb-2">With Icon</label>
              <span class="p-input-icon-left w-full">
                <i class="pi pi-search" />
                <InputText id="input2" v-model="formDemo.search" placeholder="Search" class="w-full" />
              </span>
            </div>

            <div class="field">
              <label for="input3" class="block mb-2">Invalid State</label>
              <InputText id="input3" v-model="formDemo.invalid" class="p-invalid w-full" />
              <small class="p-error">Username is required</small>
            </div>

            <div class="field">
              <label for="textarea1" class="block mb-2">Textarea</label>
              <Textarea id="textarea1" v-model="formDemo.description" rows="3" class="w-full" />
            </div>

            <div class="field">
              <label for="number1" class="block mb-2">Number Input</label>
              <InputNumber id="number1" v-model="formDemo.number" class="w-full" />
            </div>
          </div>
        </div>

        <div class="col-12 md:col-6">
          <div class="surface-card p-4 border-round">
            <h3 class="text-lg font-semibold mb-3">Selection Controls</h3>
            
            <div class="field">
              <label for="dropdown1" class="block mb-2">Dropdown</label>
              <Dropdown id="dropdown1" v-model="formDemo.dropdown" :options="dropdownOptions" placeholder="Select an option" class="w-full" />
            </div>

            <div class="field">
              <label for="multiselect1" class="block mb-2">MultiSelect</label>
              <MultiSelect id="multiselect1" v-model="formDemo.multiselect" :options="multiselectOptions" display="chip" placeholder="Choose items" class="w-full" />
            </div>

            <div class="field">
              <label for="calendar1" class="block mb-2">Calendar</label>
              <Calendar id="calendar1" v-model="formDemo.date" showIcon class="w-full" />
            </div>

            <div class="field">
              <label class="block mb-2">Radio Buttons</label>
              <div class="flex gap-3">
                <div class="flex align-items-center">
                  <RadioButton inputId="radio1" value="option1" v-model="formDemo.radio" />
                  <label for="radio1" class="ml-2">Option 1</label>
                </div>
                <div class="flex align-items-center">
                  <RadioButton inputId="radio2" value="option2" v-model="formDemo.radio" />
                  <label for="radio2" class="ml-2">Option 2</label>
                </div>
              </div>
            </div>

            <div class="field">
              <label class="block mb-2">Checkboxes</label>
              <div class="flex flex-column gap-2">
                <div class="flex align-items-center">
                  <Checkbox inputId="check1" v-model="formDemo.checks" value="check1" />
                  <label for="check1" class="ml-2">Option 1</label>
                </div>
                <div class="flex align-items-center">
                  <Checkbox inputId="check2" v-model="formDemo.checks" value="check2" />
                  <label for="check2" class="ml-2">Option 2</label>
                </div>
              </div>
            </div>

            <div class="field">
              <label class="block mb-2">Switch</label>
              <InputSwitch v-model="formDemo.switch" />
            </div>
          </div>
        </div>
      </div>
    </section>

    <Divider />

    <!-- Data Display Section -->
    <section class="mb-6">
      <h2 class="text-2xl font-bold mb-4">Data Display</h2>
      
      <div class="grid">
        <div class="col-12 md:col-6">
          <h3 class="text-lg font-semibold mb-3">Tags & Badges</h3>
          <div class="surface-card p-4 border-round">
            <div class="mb-3">
              <Tag value="Default" />
              <Tag value="Success" severity="success" class="ml-2" />
              <Tag value="Info" severity="info" class="ml-2" />
              <Tag value="Warning" severity="warning" class="ml-2" />
              <Tag value="Danger" severity="danger" class="ml-2" />
            </div>
            <div class="mb-3">
              <Tag value="With Icon" icon="pi pi-star" />
              <Tag value="Rounded" rounded class="ml-2" />
            </div>
            <div>
              <Badge value="2" />
              <Badge value="8" severity="success" class="ml-2" />
              <Badge value="4" severity="info" class="ml-2" />
              <Badge value="12" severity="warning" class="ml-2" />
              <Badge value="3" severity="danger" class="ml-2" />
            </div>
          </div>
        </div>

        <div class="col-12 md:col-6">
          <h3 class="text-lg font-semibold mb-3">Chips</h3>
          <div class="surface-card p-4 border-round">
            <Chip label="Simple Chip" />
            <Chip label="With Icon" icon="pi pi-user" class="ml-2" />
            <Chip label="With Image" :image="avatarUrl" class="ml-2" />
            <Chip label="Removable" removable class="ml-2" />
          </div>
        </div>
      </div>

      <div class="mt-4">
        <h3 class="text-lg font-semibold mb-3">Progress Indicators</h3>
        <div class="surface-card p-4 border-round">
          <div class="mb-3">
            <label class="block mb-2">ProgressBar</label>
            <ProgressBar :value="60" />
          </div>
          <div class="mb-3">
            <label class="block mb-2">Indeterminate</label>
            <ProgressBar mode="indeterminate" style="height: 6px" />
          </div>
          <div>
            <label class="block mb-2">ProgressSpinner</label>
            <ProgressSpinner style="width: 50px; height: 50px" />
          </div>
        </div>
      </div>
    </section>

    <Divider />

    <!-- Feedback Section -->
    <section class="mb-6">
      <h2 class="text-2xl font-bold mb-4">Feedback Components</h2>
      
      <div class="grid">
        <div class="col-12">
          <h3 class="text-lg font-semibold mb-3">Messages</h3>
          <div class="flex flex-column gap-3">
            <Message severity="success" :closable="false">Success message content</Message>
            <Message severity="info" :closable="false">Info message content</Message>
            <Message severity="warn" :closable="false">Warning message content</Message>
            <Message severity="error" :closable="false">Error message content</Message>
          </div>
        </div>

        <div class="col-12 mt-4">
          <h3 class="text-lg font-semibold mb-3">Toast Examples</h3>
          <div class="flex gap-2 flex-wrap">
            <Button label="Success" severity="success" @click="showToast('success')" />
            <Button label="Info" severity="info" @click="showToast('info')" />
            <Button label="Warn" severity="warning" @click="showToast('warn')" />
            <Button label="Error" severity="danger" @click="showToast('error')" />
          </div>
        </div>
      </div>
    </section>

    <Divider />

    <!-- Cards Section -->
    <section class="mb-6">
      <h2 class="text-2xl font-bold mb-4">Cards & Panels</h2>
      
      <div class="grid">
        <div class="col-12 md:col-6">
          <Card>
            <template #title>Card Title</template>
            <template #subtitle>Card Subtitle</template>
            <template #content>
              <p class="m-0">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit.
              </p>
            </template>
            <template #footer>
              <Button label="Save" icon="pi pi-check" />
              <Button label="Cancel" icon="pi pi-times" severity="secondary" text />
            </template>
          </Card>
        </div>

        <div class="col-12 md:col-6">
          <Panel header="Panel Header">
            <template #icons>
              <Button icon="pi pi-cog" severity="secondary" text />
            </template>
            <p class="m-0">
              Panel content goes here. Lorem ipsum dolor sit amet.
            </p>
          </Panel>
        </div>
      </div>
    </section>

    <Divider />

    <!-- Tables Section -->
    <section class="mb-6">
      <h2 class="text-2xl font-bold mb-4">Tables</h2>
      
      <div class="surface-card p-4 border-round">
        <DataTable :value="tableData" paginator :rows="5" class="p-datatable-sm">
          <Column field="name" header="Name" sortable />
          <Column field="category" header="Category" sortable>
            <template #body="{ data }">
              <Tag :value="data.category" severity="info" />
            </template>
          </Column>
          <Column field="status" header="Status">
            <template #body="{ data }">
              <Tag :value="data.status" :severity="getStatusSeverity(data.status)" />
            </template>
          </Column>
          <Column field="progress" header="Progress">
            <template #body="{ data }">
              <ProgressBar :value="data.progress" :showValue="false" style="height: 6px" />
            </template>
          </Column>
        </DataTable>
      </div>
    </section>

    <Divider />

    <!-- Accessibility Section -->
    <section class="mb-6">
      <h2 class="text-2xl font-bold mb-4">Accessibility Features</h2>
      
      <div class="surface-card p-4 border-round">
        <h3 class="text-lg font-semibold mb-3">Keyboard Navigation</h3>
        <ul class="line-height-3">
          <li><kbd>Tab</kbd> - Navigate between interactive elements</li>
          <li><kbd>Shift + Tab</kbd> - Navigate backwards</li>
          <li><kbd>Enter</kbd> or <kbd>Space</kbd> - Activate buttons and links</li>
          <li><kbd>Arrow Keys</kbd> - Navigate within menus and lists</li>
          <li><kbd>Escape</kbd> - Close modals and overlays</li>
        </ul>

        <h3 class="text-lg font-semibold mb-3 mt-4">Screen Reader Support</h3>
        <p>All interactive elements include proper ARIA labels and descriptions for screen reader compatibility.</p>

        <h3 class="text-lg font-semibold mb-3 mt-4">Focus Indicators</h3>
        <p>Clear focus indicators are provided for keyboard navigation:</p>
        <div class="flex gap-2 mt-2">
          <Button label="Focus Me" />
          <InputText placeholder="Focus this input" />
        </div>
      </div>
    </section>

    <Toast />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useToast } from 'primevue/usetoast'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
import InputNumber from 'primevue/inputnumber'
import Dropdown from 'primevue/dropdown'
import MultiSelect from 'primevue/multiselect'
import Calendar from 'primevue/calendar'
import RadioButton from 'primevue/radiobutton'
import Checkbox from 'primevue/checkbox'
import InputSwitch from 'primevue/inputswitch'
import Tag from 'primevue/tag'
import Badge from 'primevue/badge'
import Chip from 'primevue/chip'
import ProgressBar from 'primevue/progressbar'
import ProgressSpinner from 'primevue/progressspinner'
import Message from 'primevue/message'
import Card from 'primevue/card'
import Panel from 'primevue/panel'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Divider from 'primevue/divider'
import Toast from 'primevue/toast'

const toast = useToast()

const primaryShades = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900']
const surfaceShades = ['surface-0', 'surface-50', 'surface-100', 'surface-200', 'surface-300', 'surface-400', 'surface-500', 'surface-600', 'surface-700', 'surface-800', 'surface-900']
const semanticColors = [
  { name: 'success', class: 'green' },
  { name: 'info', class: 'blue' },
  { name: 'warning', class: 'orange' },
  { name: 'danger', class: 'red' }
]

const formDemo = ref({
  text: '',
  search: '',
  invalid: '',
  description: '',
  number: 0,
  dropdown: null,
  multiselect: [],
  date: null,
  radio: 'option1',
  checks: [],
  switch: false
})

const dropdownOptions = ['Option 1', 'Option 2', 'Option 3', 'Option 4']
const multiselectOptions = ['Item 1', 'Item 2', 'Item 3', 'Item 4', 'Item 5']
const avatarUrl = 'https://primefaces.org/cdn/primevue/images/avatar/amyelsner.png'

const tableData = ref([
  { name: 'Project Alpha', category: 'Development', status: 'Active', progress: 75 },
  { name: 'Project Beta', category: 'Design', status: 'Pending', progress: 30 },
  { name: 'Project Gamma', category: 'Marketing', status: 'Complete', progress: 100 },
  { name: 'Project Delta', category: 'Development', status: 'Active', progress: 60 },
  { name: 'Project Epsilon', category: 'Research', status: 'On Hold', progress: 45 }
])

function getStatusSeverity(status) {
  switch (status) {
    case 'Active': return 'success'
    case 'Pending': return 'warning'
    case 'Complete': return 'info'
    case 'On Hold': return 'secondary'
    default: return null
  }
}

function showToast(severity) {
  toast.add({
    severity: severity,
    summary: severity.charAt(0).toUpperCase() + severity.slice(1) + ' Message',
    detail: 'This is a ' + severity + ' toast message',
    life: 3000
  })
}
</script>

<style scoped>
.color-box {
  width: 3rem;
  height: 3rem;
  border-radius: 8px;
}

.field {
  margin-bottom: 1.5rem;
}

kbd {
  background: var(--surface-200);
  border: 1px solid var(--surface-300);
  border-radius: 4px;
  padding: 0.2rem 0.4rem;
  font-family: monospace;
  font-size: 0.9em;
}

.style-guide {
  max-width: 1400px;
  margin: 0 auto;
}

@media (max-width: 768px) {
  .color-box {
    width: 2rem;
    height: 2rem;
  }
}
</style>