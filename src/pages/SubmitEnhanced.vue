<template>
  <div class="surface-card p-4 border-round shadow-2">
    <!-- Sticky Progress Header -->
    <div ref="stickyHeader" class="sticky-header" :class="{ 'is-sticky': isSticky }">
      <div class="flex align-items-center justify-content-between mb-3">
        <h1 class="text-3xl font-bold mt-0 mb-0">Submit New Idea</h1>
        <Tag v-if="draftSaved" severity="success" icon="pi pi-check-circle">
          Draft saved
        </Tag>
      </div>
      <div v-if="showProgress" class="progress-container">
        <ProgressBar :value="formProgress" :showValue="false" />
        <div class="progress-info flex justify-content-between align-items-center mt-2 gap-3">
          <div class="text-sm white-space-nowrap">
            <span class="font-semibold text-primary">{{ formProgress }}%</span>
            <span class="text-600 ml-1 hidden sm:inline">Complete</span>
          </div>
          <div class="flex gap-1 flex-wrap justify-content-center flex-grow-1">
            <Tag v-for="section in sectionProgress" :key="section.name" 
              :severity="section.complete ? 'success' : 'secondary'" 
              :icon="section.complete ? 'pi pi-check' : null"
              class="text-xs">
              {{ section.name }}
            </Tag>
          </div>
          <div class="text-sm text-600 white-space-nowrap">
            <span class="hidden sm:inline">{{ filledFields }} of {{ totalFields }} required fields</span>
            <span class="inline sm:hidden">{{ filledFields }}/{{ totalFields }}</span>
          </div>
        </div>
      </div>
    </div>
    
    <Message v-if="validationSummary.length" severity="error" :closable="false" class="mb-3 mt-3">
      <ul class="m-0 pl-3">
        <li v-for="error in validationSummary" :key="error">{{ error }}</li>
      </ul>
    </Message>

    <Message v-if="submitSuccess" severity="success" :closable="true" @close="submitSuccess = false" class="mb-3">
      <i class="pi pi-check-circle mr-2"></i>
      Your idea has been successfully submitted!
    </Message>

    <form @submit.prevent="handleSubmit" novalidate>
      <div class="grid">
        <div class="col-12">
          <Panel header="1. Idea Basics" class="mb-3">
            <template #icons>
              <span class="text-sm text-500">Required fields marked with *</span>
            </template>
            <div class="grid">
              <div class="col-12 md:col-6">
                <div class="field">
                  <label for="title" class="block font-semibold mb-2">
                    Title <span class="text-red-500">*</span>
                  </label>
                  <InputText 
                    id="title" 
                    v-model="form.title"
                    :class="{'p-invalid': touched.title && errors.title}"
                    @blur="touched.title = true"
                    @input="validateField('title')"
                    class="w-full"
                    placeholder="Enter a clear, concise title"
                    aria-describedby="title-help title-error"
                    :aria-invalid="!!errors.title"
                  />
                  <small id="title-help" class="block text-600 mt-1">
                    A brief summary of your idea (5-10 words)
                  </small>
                  <small v-if="touched.title && errors.title" id="title-error" class="block text-red-500 mt-1">
                    <i class="pi pi-exclamation-circle mr-1"></i>{{ errors.title }}
                  </small>
                </div>
              </div>

              <div class="col-12 md:col-6">
                <div class="field">
                  <label for="category" class="block font-semibold mb-2">
                    Category <span class="text-red-500">*</span>
                  </label>
                  <Dropdown 
                    id="category" 
                    v-model="form.category"
                    :options="categories"
                    :class="{'p-invalid': touched.category && errors.category}"
                    @blur="touched.category = true"
                    @change="validateField('category')"
                    class="w-full"
                    placeholder="Select a category"
                    aria-describedby="category-error"
                    :aria-invalid="!!errors.category"
                  />
                  <small v-if="touched.category && errors.category" id="category-error" class="block text-red-500 mt-1">
                    <i class="pi pi-exclamation-circle mr-1"></i>{{ errors.category }}
                  </small>
                </div>
              </div>

              <div class="col-12">
                <div class="field">
                  <label for="description" class="block font-semibold mb-2">
                    Description <span class="text-red-500">*</span>
                  </label>
                  <Textarea 
                    id="description" 
                    v-model="form.description"
                    :class="{'p-invalid': touched.description && errors.description}"
                    @blur="touched.description = true"
                    @input="validateField('description')"
                    rows="4"
                    :autoResize="true"
                    class="w-full"
                    placeholder="Describe your idea in detail. What problem does it solve? What's the expected outcome?"
                    aria-describedby="description-help description-error"
                    :aria-invalid="!!errors.description"
                  />
                  <div class="flex justify-content-between align-items-center">
                    <small id="description-help" class="text-600 mt-1">
                      Provide context and expected benefits (min. 20 characters)
                    </small>
                    <small class="text-600 mt-1">
                      {{ form.description.length }} / 500
                    </small>
                  </div>
                  <small v-if="touched.description && errors.description" id="description-error" class="block text-red-500 mt-1">
                    <i class="pi pi-exclamation-circle mr-1"></i>{{ errors.description }}
                  </small>
                </div>
              </div>

              <div class="col-12">
                <div class="field">
                  <label for="tags" class="block font-semibold mb-2">
                    Tags
                  </label>
                  <Chips 
                    id="tags"
                    v-model="form.tags"
                    separator=","
                    class="w-full"
                    placeholder="Add tags and press Enter"
                    aria-describedby="tags-help"
                    :max="5"
                  />
                  <small id="tags-help" class="block text-600 mt-1">
                    Add up to 5 tags to categorize your idea
                  </small>
                </div>
              </div>
            </div>
          </Panel>
        </div>

        <div class="col-12">
          <Panel header="2. Impact & Priority" class="mb-3">
            <div class="grid">
              <div class="col-12 md:col-6">
                <div class="field">
                  <label for="personas" class="block font-semibold mb-2">
                    Target Personas <span class="text-red-500">*</span>
                  </label>
                  <MultiSelect 
                    id="personas"
                    v-model="form.personas"
                    :options="personas"
                    optionLabel="label"
                    :class="{'p-invalid': touched.personas && errors.personas}"
                    @blur="touched.personas = true"
                    @change="validateField('personas')"
                    display="chip"
                    placeholder="Select target user groups"
                    class="w-full"
                    aria-describedby="personas-help personas-error"
                    :aria-invalid="!!errors.personas"
                    :showToggleAll="true"
                    :filter="true"
                  />
                  <small id="personas-help" class="block text-600 mt-1">
                    Who will benefit from this idea?
                  </small>
                  <small v-if="touched.personas && errors.personas" id="personas-error" class="block text-red-500 mt-1">
                    <i class="pi pi-exclamation-circle mr-1"></i>{{ errors.personas }}
                  </small>
                </div>
              </div>

              <div class="col-12 md:col-3">
                <div class="field">
                  <label for="impact" class="block font-semibold mb-2">
                    Impact Score
                    <i class="pi pi-info-circle ml-1 text-sm cursor-pointer" v-tooltip="'Rate the potential impact from 1 (low) to 10 (high)'"></i>
                  </label>
                  <Slider 
                    id="impact"
                    v-model="form.impact"
                    :min="1"
                    :max="10"
                    class="w-full"
                    aria-describedby="impact-value"
                  />
                  <div id="impact-value" class="mt-2 text-center">
                    <Tag :severity="impactSeverity" class="w-full justify-content-center">
                      Score: {{ form.impact }} - {{ impactLabel }}
                    </Tag>
                  </div>
                </div>
              </div>

              <div class="col-12 md:col-3">
                <div class="field">
                  <label for="reach" class="block font-semibold mb-2">
                    Expected Reach
                  </label>
                  <InputNumber 
                    id="reach"
                    v-model="form.reach"
                    :min="0"
                    :step="100"
                    mode="decimal"
                    :useGrouping="true"
                    class="w-full"
                    placeholder="Number of users"
                    aria-describedby="reach-help"
                  />
                  <small id="reach-help" class="block text-600 mt-1">
                    Estimated users affected
                  </small>
                </div>
              </div>

              <div class="col-12 md:col-6">
                <div class="field">
                  <label for="targetDate" class="block font-semibold mb-2">
                    Target Implementation Date
                  </label>
                  <Calendar 
                    id="targetDate"
                    v-model="form.targetDate"
                    :minDate="minDate"
                    showIcon
                    showButtonBar
                    dateFormat="mm/dd/yy"
                    class="w-full"
                    placeholder="Select target date"
                    aria-describedby="targetDate-help"
                  />
                  <small id="targetDate-help" class="block text-600 mt-1">
                    When should this ideally be implemented?
                  </small>
                </div>
              </div>

              <div class="col-12 md:col-6">
                <div class="field">
                  <label for="priority" class="block font-semibold mb-2">
                    Priority Level
                  </label>
                  <SelectButton 
                    id="priority"
                    v-model="form.priority"
                    :options="priorities"
                    optionLabel="label"
                    optionValue="value"
                    class="w-full"
                    aria-describedby="priority-help"
                  />
                  <small id="priority-help" class="block text-600 mt-1">
                    How urgent is this idea?
                  </small>
                </div>
              </div>
            </div>
          </Panel>
        </div>

        <div class="col-12">
          <Panel header="3. Technical Details" class="mb-3">
            <div class="grid">
              <div class="col-12 md:col-4">
                <div class="field">
                  <label for="complexity" class="block font-semibold mb-2">
                    Implementation Complexity <span class="text-red-500">*</span>
                  </label>
                  <Dropdown 
                    id="complexity"
                    v-model="form.complexity"
                    :options="complexityOptions"
                    optionLabel="label"
                    optionValue="value"
                    :class="{'p-invalid': touched.complexity && errors.complexity}"
                    @blur="touched.complexity = true"
                    @change="validateField('complexity')"
                    class="w-full"
                    placeholder="Select complexity"
                    aria-describedby="complexity-help complexity-error"
                    :aria-invalid="!!errors.complexity"
                  />
                  <small id="complexity-help" class="block text-600 mt-1">
                    Estimated development effort
                  </small>
                  <small v-if="touched.complexity && errors.complexity" id="complexity-error" class="block text-red-500 mt-1">
                    <i class="pi pi-exclamation-circle mr-1"></i>{{ errors.complexity }}
                  </small>
                </div>
              </div>

              <div class="col-12 md:col-4">
                <div class="field">
                  <label for="dependencies" class="block font-semibold mb-2">
                    Dependencies
                  </label>
                  <Chips 
                    id="dependencies"
                    v-model="form.dependencies"
                    class="w-full"
                    placeholder="Add system dependencies"
                    aria-describedby="dependencies-help"
                  />
                  <small id="dependencies-help" class="block text-600 mt-1">
                    Other systems or features required
                  </small>
                </div>
              </div>

              <div class="col-12 md:col-4">
                <div class="field">
                  <label for="repoUrl" class="block font-semibold mb-2">
                    Repository URL
                  </label>
                  <InputText 
                    id="repoUrl"
                    v-model="form.repoUrl"
                    :class="{'p-invalid': touched.repoUrl && errors.repoUrl}"
                    @blur="touched.repoUrl = true; validateField('repoUrl')"
                    class="w-full"
                    placeholder="https://github.com/org/repo"
                    aria-describedby="repoUrl-help repoUrl-error"
                    :aria-invalid="!!errors.repoUrl"
                  />
                  <small id="repoUrl-help" class="block text-600 mt-1">
                    Link to relevant code repository
                  </small>
                  <small v-if="touched.repoUrl && errors.repoUrl" id="repoUrl-error" class="block text-red-500 mt-1">
                    <i class="pi pi-exclamation-circle mr-1"></i>{{ errors.repoUrl }}
                  </small>
                </div>
              </div>

              <div class="col-12">
                <div class="field">
                  <label class="block font-semibold mb-2">
                    Privacy Setting
                  </label>
                  <div class="flex flex-wrap gap-3">
                    <div class="flex align-items-center">
                      <RadioButton 
                        inputId="privacy1"
                        name="privacy"
                        value="public"
                        v-model="form.privacy"
                      />
                      <label for="privacy1" class="ml-2 cursor-pointer">
                        <i class="pi pi-globe mr-1"></i>Public
                      </label>
                    </div>
                    <div class="flex align-items-center">
                      <RadioButton 
                        inputId="privacy2"
                        name="privacy"
                        value="internal"
                        v-model="form.privacy"
                      />
                      <label for="privacy2" class="ml-2 cursor-pointer">
                        <i class="pi pi-lock mr-1"></i>Internal
                      </label>
                    </div>
                    <div class="flex align-items-center">
                      <RadioButton 
                        inputId="privacy3"
                        name="privacy"
                        value="private"
                        v-model="form.privacy"
                      />
                      <label for="privacy3" class="ml-2 cursor-pointer">
                        <i class="pi pi-eye-slash mr-1"></i>Private
                      </label>
                    </div>
                  </div>
                  <small class="block text-600 mt-1">
                    Who can view this idea?
                  </small>
                </div>
              </div>
            </div>
          </Panel>
        </div>

        <div class="col-12">
          <Panel header="4. Contact & Notifications" class="mb-3">
            <div class="grid">
              <div class="col-12 md:col-4">
                <div class="field">
                  <label for="requesterName" class="block font-semibold mb-2">
                    Your Name <span class="text-red-500">*</span>
                  </label>
                  <InputText 
                    id="requesterName"
                    v-model="form.requester.name"
                    :class="{'p-invalid': touched.requesterName && errors.requesterName}"
                    @blur="touched.requesterName = true"
                    @input="validateField('requesterName')"
                    class="w-full"
                    placeholder="John Doe"
                    aria-describedby="requesterName-error"
                    :aria-invalid="!!errors.requesterName"
                  />
                  <small v-if="touched.requesterName && errors.requesterName" id="requesterName-error" class="block text-red-500 mt-1">
                    <i class="pi pi-exclamation-circle mr-1"></i>{{ errors.requesterName }}
                  </small>
                </div>
              </div>

              <div class="col-12 md:col-4">
                <div class="field">
                  <label for="requesterEmail" class="block font-semibold mb-2">
                    Email Address <span class="text-red-500">*</span>
                  </label>
                  <InputText 
                    id="requesterEmail"
                    v-model="form.requester.email"
                    :class="{'p-invalid': touched.requesterEmail && errors.requesterEmail}"
                    @blur="touched.requesterEmail = true"
                    @input="validateField('requesterEmail')"
                    type="email"
                    class="w-full"
                    placeholder="john.doe@example.com"
                    aria-describedby="requesterEmail-help requesterEmail-error"
                    :aria-invalid="!!errors.requesterEmail"
                  />
                  <small id="requesterEmail-help" class="block text-600 mt-1">
                    We'll use this to contact you about your idea
                  </small>
                  <small v-if="touched.requesterEmail && errors.requesterEmail" id="requesterEmail-error" class="block text-red-500 mt-1">
                    <i class="pi pi-exclamation-circle mr-1"></i>{{ errors.requesterEmail }}
                  </small>
                </div>
              </div>

              <div class="col-12 md:col-4">
                <div class="field">
                  <label for="department" class="block font-semibold mb-2">
                    Department
                  </label>
                  <Dropdown 
                    id="department"
                    v-model="form.department"
                    :options="departments"
                    class="w-full"
                    placeholder="Select department"
                    aria-describedby="department-help"
                  />
                  <small id="department-help" class="block text-600 mt-1">
                    Your team or department
                  </small>
                </div>
              </div>

              <div class="col-12">
                <div class="field">
                  <div class="flex align-items-center mb-2">
                    <InputSwitch 
                      id="notify"
                      v-model="form.notify"
                      class="mr-2"
                    />
                    <label for="notify" class="font-semibold cursor-pointer">
                      Email Notifications
                    </label>
                  </div>
                  <small class="block text-600">
                    Receive updates about the status of your idea
                  </small>
                </div>
              </div>

              <div class="col-12">
                <div class="field">
                  <div class="flex align-items-start">
                    <Checkbox 
                      inputId="terms"
                      v-model="form.terms"
                      :binary="true"
                      :class="{'p-invalid': touched.terms && errors.terms}"
                      @change="touched.terms = true; validateField('terms')"
                      class="mt-1"
                      aria-describedby="terms-text terms-error"
                      :aria-invalid="!!errors.terms"
                    />
                    <label for="terms" id="terms-text" class="ml-2 cursor-pointer">
                      I confirm that the information provided is accurate and I have reviewed the 
                      <a href="#" @click.prevent="showTermsDialog = true" class="text-primary">submission guidelines</a>.
                      <span class="text-red-500">*</span>
                    </label>
                  </div>
                  <small v-if="touched.terms && errors.terms" id="terms-error" class="block text-red-500 mt-1 ml-4">
                    <i class="pi pi-exclamation-circle mr-1"></i>{{ errors.terms }}
                  </small>
                </div>
              </div>
            </div>
          </Panel>
        </div>

        <div class="col-12">
          <div class="flex justify-content-between align-items-center flex-wrap gap-2">
            <div>
              <Button 
                label="Load Draft"
                icon="pi pi-download"
                severity="info"
                text
                @click="loadDraft"
                :disabled="!hasDraft"
                v-tooltip.top="hasDraft ? 'Load previously saved draft' : 'No draft available'"
              />
            </div>
            <div class="flex gap-2">
              <Button 
                label="Clear Form"
                icon="pi pi-times"
                severity="secondary"
                outlined
                @click="clearForm"
              />
              <Button 
                label="Save Draft"
                icon="pi pi-save"
                severity="warning"
                @click="saveDraft"
                :loading="savingDraft"
              />
              <Button 
                type="submit"
                label="Submit Idea"
                icon="pi pi-check"
                severity="success"
                :loading="submitting"
                :disabled="submitting"
              />
            </div>
          </div>
        </div>
      </div>
    </form>

    <Dialog v-model:visible="showTermsDialog" header="Submission Guidelines" :modal="true" :style="{width: '50vw'}" :breakpoints="{'960px': '75vw', '640px': '90vw'}">
      <div class="line-height-3">
        <h3>Guidelines for Submitting Ideas</h3>
        <ol>
          <li>Ensure your idea is original and not a duplicate of existing submissions</li>
          <li>Provide clear, actionable descriptions with specific outcomes</li>
          <li>Consider the feasibility and resource requirements</li>
          <li>Include relevant stakeholders and affected teams</li>
          <li>Be respectful and constructive in your proposals</li>
        </ol>
        <p class="text-600">
          By submitting this form, you agree to these guidelines and understand that your idea will be reviewed by the appropriate teams.
        </p>
      </div>
      <template #footer>
        <Button label="Close" @click="showTermsDialog = false" />
      </template>
    </Dialog>

    <Toast position="top-right" />
    <ConfirmDialog />
  </div>
</template>

<script setup>
import { reactive, ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useIdeasStore } from '../stores/ideas'
import { useToast } from 'primevue/usetoast'
import { useConfirm } from 'primevue/useconfirm'

import Panel from 'primevue/panel'
import InputText from 'primevue/inputtext'
import Textarea from 'primevue/textarea'
import Dropdown from 'primevue/dropdown'
import Chips from 'primevue/chips'
import MultiSelect from 'primevue/multiselect'
import Slider from 'primevue/slider'
import InputNumber from 'primevue/inputnumber'
import Calendar from 'primevue/calendar'
import RadioButton from 'primevue/radiobutton'
import Checkbox from 'primevue/checkbox'
import InputSwitch from 'primevue/inputswitch'
import Button from 'primevue/button'
import SelectButton from 'primevue/selectbutton'
import Tag from 'primevue/tag'
import Message from 'primevue/message'
import ProgressBar from 'primevue/progressbar'
import Dialog from 'primevue/dialog'
import Toast from 'primevue/toast'
import ConfirmDialog from 'primevue/confirmdialog'

const router = useRouter()
const store = useIdeasStore()
const toast = useToast()
const confirm = useConfirm()

const categories = ['Platform', 'UI/UX', 'Performance', 'Integrations', 'Security', 'Documentation', 'Testing']
const personas = [
  { label: 'Administrator', value: 'admin' },
  { label: 'Developer', value: 'developer' },
  { label: 'Business Analyst', value: 'analyst' },
  { label: 'End User', value: 'end-user' },
  { label: 'Manager', value: 'manager' },
  { label: 'Support Staff', value: 'support' }
]
const complexityOptions = [
  { label: 'Low (< 1 week)', value: 'low' },
  { label: 'Medium (1-4 weeks)', value: 'medium' },
  { label: 'High (1-3 months)', value: 'high' },
  { label: 'Very High (> 3 months)', value: 'very-high' }
]
const priorities = [
  { label: 'Low', value: 'low' },
  { label: 'Medium', value: 'medium' },
  { label: 'High', value: 'high' },
  { label: 'Critical', value: 'critical' }
]
const departments = [
  'Engineering',
  'Product',
  'Design',
  'Marketing',
  'Sales',
  'Support',
  'Operations',
  'Finance',
  'HR'
]

const minDate = ref(new Date())

const form = reactive({
  title: '',
  description: '',
  category: '',
  tags: [],
  personas: [],
  impact: 5,
  reach: 0,
  targetDate: null,
  priority: 'medium',
  complexity: '',
  dependencies: [],
  repoUrl: '',
  privacy: 'internal',
  department: '',
  requester: {
    name: '',
    email: ''
  },
  notify: true,
  terms: false
})

const errors = reactive({
  title: '',
  category: '',
  description: '',
  personas: '',
  complexity: '',
  requesterName: '',
  requesterEmail: '',
  repoUrl: '',
  terms: ''
})

const touched = reactive({
  title: false,
  category: false,
  description: false,
  personas: false,
  complexity: false,
  requesterName: false,
  requesterEmail: false,
  repoUrl: false,
  terms: false
})

const submitting = ref(false)
const savingDraft = ref(false)
const draftSaved = ref(false)
const hasDraft = ref(false)
const submitSuccess = ref(false)
const showTermsDialog = ref(false)
const showProgress = ref(true)
const validationSummary = ref([])
const stickyHeader = ref(null)
const isSticky = ref(false)

const totalFields = 8 // Required fields count
const filledFields = computed(() => {
  let filled = 0
  const fields = [
    form.title,
    form.category,
    form.description,
    form.personas.length > 0,
    form.complexity,
    form.requester.name,
    form.requester.email,
    form.terms
  ]
  fields.forEach(field => {
    if (field) filled++
  })
  return filled
})

const formProgress = computed(() => {
  return Math.round((filledFields.value / totalFields) * 100)
})

const sectionProgress = computed(() => {
  return [
    {
      name: 'Basics',
      complete: !!(form.title && form.category && form.description)
    },
    {
      name: 'Impact',
      complete: !!(form.personas.length > 0)
    },
    {
      name: 'Technical',
      complete: !!(form.complexity)
    },
    {
      name: 'Contact',
      complete: !!(form.requester.name && form.requester.email && form.terms)
    }
  ]
})

const impactSeverity = computed(() => {
  if (form.impact <= 3) return 'secondary'
  if (form.impact <= 6) return 'info'
  if (form.impact <= 8) return 'warning'
  return 'success'
})

const impactLabel = computed(() => {
  if (form.impact <= 3) return 'Low Impact'
  if (form.impact <= 6) return 'Moderate Impact'
  if (form.impact <= 8) return 'High Impact'
  return 'Critical Impact'
})

function validateField(field) {
  switch (field) {
    case 'title':
      errors.title = !form.title?.trim() ? 'Title is required' :
                     form.title.trim().length < 5 ? 'Title must be at least 5 characters' :
                     form.title.trim().length > 100 ? 'Title must not exceed 100 characters' : ''
      break
    case 'category':
      errors.category = !form.category ? 'Category is required' : ''
      break
    case 'description':
      errors.description = !form.description?.trim() ? 'Description is required' :
                          form.description.trim().length < 20 ? 'Description must be at least 20 characters' :
                          form.description.trim().length > 500 ? 'Description must not exceed 500 characters' : ''
      break
    case 'personas':
      errors.personas = form.personas.length === 0 ? 'At least one target persona is required' : ''
      break
    case 'complexity':
      errors.complexity = !form.complexity ? 'Complexity estimation is required' : ''
      break
    case 'requesterName':
      errors.requesterName = !form.requester.name?.trim() ? 'Your name is required' :
                            form.requester.name.trim().length < 2 ? 'Name must be at least 2 characters' : ''
      break
    case 'requesterEmail':
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      errors.requesterEmail = !form.requester.email?.trim() ? 'Email is required' :
                             !emailRegex.test(form.requester.email.trim()) ? 'Please enter a valid email address' : ''
      break
    case 'repoUrl':
      if (form.repoUrl?.trim()) {
        const urlRegex = /^https?:\/\/.+/
        errors.repoUrl = !urlRegex.test(form.repoUrl.trim()) ? 'Please enter a valid URL starting with http:// or https://' : ''
      } else {
        errors.repoUrl = ''
      }
      break
    case 'terms':
      errors.terms = !form.terms ? 'You must accept the terms to submit' : ''
      break
  }
}

function validateForm() {
  Object.keys(errors).forEach(field => {
    touched[field] = true
    validateField(field)
  })

  validationSummary.value = []
  if (errors.title) validationSummary.value.push('Title: ' + errors.title)
  if (errors.category) validationSummary.value.push('Category: ' + errors.category)
  if (errors.description) validationSummary.value.push('Description: ' + errors.description)
  if (errors.personas) validationSummary.value.push('Target Personas: ' + errors.personas)
  if (errors.complexity) validationSummary.value.push('Complexity: ' + errors.complexity)
  if (errors.requesterName) validationSummary.value.push('Name: ' + errors.requesterName)
  if (errors.requesterEmail) validationSummary.value.push('Email: ' + errors.requesterEmail)
  if (errors.repoUrl) validationSummary.value.push('Repository URL: ' + errors.repoUrl)
  if (errors.terms) validationSummary.value.push('Terms: ' + errors.terms)

  return validationSummary.value.length === 0
}

async function handleSubmit() {
  if (!validateForm()) {
    toast.add({
      severity: 'error',
      summary: 'Validation Error',
      detail: 'Please fix the errors in the form',
      life: 5000
    })
    
    const firstError = document.querySelector('.p-invalid')
    if (firstError) {
      firstError.scrollIntoView({ behavior: 'smooth', block: 'center' })
      firstError.focus()
    }
    return
  }

  submitting.value = true
  try {
    const ideaData = {
      title: form.title.trim(),
      description: form.description.trim(),
      category: form.category,
      tags: form.tags,
      status: 'New',
      votes: 0,
      personas: form.personas,
      impact: form.impact,
      reach: form.reach,
      targetDate: form.targetDate,
      priority: form.priority,
      complexity: form.complexity,
      dependencies: form.dependencies,
      repoUrl: form.repoUrl,
      privacy: form.privacy,
      department: form.department,
      requester: {
        name: form.requester.name.trim(),
        email: form.requester.email.trim()
      },
      notify: form.notify
    }

    await store.add(ideaData)
    
    localStorage.removeItem('draft_submit_idea')
    submitSuccess.value = true
    
    toast.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Your idea has been submitted successfully!',
      life: 5000
    })

    setTimeout(() => {
      router.push('/ideas')
    }, 2000)
  } catch (error) {
    toast.add({
      severity: 'error',
      summary: 'Submission Error',
      detail: 'Failed to submit your idea. Please try again.',
      life: 5000
    })
  } finally {
    submitting.value = false
  }
}

function saveDraft() {
  savingDraft.value = true
  setTimeout(() => {
    localStorage.setItem('draft_submit_idea', JSON.stringify(form))
    localStorage.setItem('draft_submit_idea_timestamp', new Date().toISOString())
    draftSaved.value = true
    savingDraft.value = false
    
    toast.add({
      severity: 'success',
      summary: 'Draft Saved',
      detail: 'Your draft has been saved locally',
      life: 3000
    })
    
    setTimeout(() => {
      draftSaved.value = false
    }, 3000)
  }, 500)
}

function loadDraft() {
  const draft = localStorage.getItem('draft_submit_idea')
  const timestamp = localStorage.getItem('draft_submit_idea_timestamp')
  
  if (draft) {
    const draftData = JSON.parse(draft)
    const draftDate = timestamp ? new Date(timestamp) : null
    
    confirm.require({
      message: draftDate ? 
        `Load draft saved on ${draftDate.toLocaleDateString()} at ${draftDate.toLocaleTimeString()}?` :
        'Load the saved draft?',
      header: 'Load Draft',
      icon: 'pi pi-download',
      accept: () => {
        Object.assign(form, draftData)
        if (form.targetDate) {
          form.targetDate = new Date(form.targetDate)
        }
        
        Object.keys(touched).forEach(key => touched[key] = false)
        Object.keys(errors).forEach(key => errors[key] = '')
        validationSummary.value = []
        
        toast.add({
          severity: 'info',
          summary: 'Draft Loaded',
          detail: 'Your saved draft has been restored',
          life: 3000
        })
      }
    })
  }
}

function clearForm() {
  confirm.require({
    message: 'Are you sure you want to clear all form data?',
    header: 'Clear Form',
    icon: 'pi pi-exclamation-triangle',
    acceptClass: 'p-button-danger',
    accept: () => {
      Object.assign(form, {
        title: '',
        description: '',
        category: '',
        tags: [],
        personas: [],
        impact: 5,
        reach: 0,
        targetDate: null,
        priority: 'medium',
        complexity: '',
        dependencies: [],
        repoUrl: '',
        privacy: 'internal',
        department: '',
        requester: {
          name: '',
          email: ''
        },
        notify: true,
        terms: false
      })
      
      Object.keys(touched).forEach(key => touched[key] = false)
      Object.keys(errors).forEach(key => errors[key] = '')
      validationSummary.value = []
      
      toast.add({
        severity: 'info',
        summary: 'Form Cleared',
        detail: 'All form data has been cleared',
        life: 3000
      })
    }
  })
}

watch(form, () => {
  draftSaved.value = false
}, { deep: true })

let observer = null

onMounted(() => {
  hasDraft.value = !!localStorage.getItem('draft_submit_idea')
  
  const autoDraft = localStorage.getItem('draft_submit_idea_auto')
  if (autoDraft) {
    const autoData = JSON.parse(autoDraft)
    if (new Date() - new Date(autoData.timestamp) < 300000) {
      loadDraft()
    }
  }
  
  // Setup intersection observer for sticky header
  if (stickyHeader.value && 'IntersectionObserver' in window) {
    observer = new IntersectionObserver(
      ([entry]) => {
        // When the top of the header hits the top of the viewport
        isSticky.value = !entry.isIntersecting && entry.boundingClientRect.top <= 0
      },
      {
        threshold: [1],
        rootMargin: '-1px 0px 0px 0px'
      }
    )
    
    // Create a sentinel element to observe
    const sentinel = document.createElement('div')
    sentinel.style.position = 'absolute'
    sentinel.style.top = '0'
    sentinel.style.height = '1px'
    sentinel.style.width = '1px'
    stickyHeader.value.parentElement.insertBefore(sentinel, stickyHeader.value)
    observer.observe(sentinel)
  }
})

onUnmounted(() => {
  if (observer) {
    observer.disconnect()
  }
})

setInterval(() => {
  if (Object.values(form).some(v => v && (typeof v !== 'object' || Object.values(v).some(sv => sv)))) {
    localStorage.setItem('draft_submit_idea_auto', JSON.stringify({
      ...form,
      timestamp: new Date().toISOString()
    }))
  }
}, 30000)
</script>

<style scoped>
.sticky-header {
  position: sticky;
  top: -1px;
  z-index: 100;
  background: var(--surface-card);
  padding: 1rem 1rem 1.5rem 1rem;
  margin: -1rem -1rem 1rem -1rem;
  border-bottom: 2px solid var(--surface-200);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.progress-container {
  margin-top: 1rem;
}

.progress-info {
  min-height: 2rem;
}

/* Utility classes for responsive visibility */
.hidden {
  display: none !important;
}

@media (min-width: 576px) {
  .sm\:inline {
    display: inline !important;
  }
  .sm\:hidden {
    display: none !important;
  }
}

.white-space-nowrap {
  white-space: nowrap;
}

.flex-grow-1 {
  flex-grow: 1;
}

.field {
  margin-bottom: 1rem;
}

:deep(.p-panel-header) {
  background: var(--surface-50);
  border-bottom: 1px solid var(--surface-200);
}

:deep(.p-invalid) {
  border-color: var(--red-500) !important;
}

:deep(.p-progressbar) {
  height: 0.75rem;
  border-radius: 0.5rem;
}

:deep(.p-progressbar-value) {
  background: linear-gradient(90deg, var(--primary-400) 0%, var(--primary-color) 100%);
  transition: width 0.3s ease;
}

/* Smooth scroll behavior */
html {
  scroll-behavior: smooth;
}

/* Add visual indicator when sticky */
.sticky-header.is-sticky {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

@media (max-width: 768px) {
  .surface-card {
    padding: 1rem !important;
  }
  
  .sticky-header {
    padding: 0.75rem 0.75rem 1rem 0.75rem;
    margin: -1rem -1rem 1rem -1rem;
  }
  
  /* Only the section tags should wrap when needed */
  .sticky-header .flex.gap-2 {
    flex-wrap: wrap;
  }
  
  :deep(.p-panel-content) {
    padding: 1rem;
  }
  
  :deep(.p-tag.text-xs) {
    font-size: 0.65rem;
    padding: 0.25rem 0.5rem;
  }
  
  .text-3xl {
    font-size: 1.5rem;
  }
}

/* Only on very small screens should we stack vertically */
@media (max-width: 480px) {
  .sticky-header .flex.justify-content-between.align-items-center {
    flex-wrap: wrap;
    gap: 0.75rem;
  }
  
  .sticky-header .flex.justify-content-between.align-items-center > * {
    min-width: 0;
    flex-shrink: 1;
  }
}

/* Dark theme adjustments */
:global(.dark-theme) .sticky-header {
  background: var(--surface-card);
  border-bottom-color: var(--surface-300);
}
</style>