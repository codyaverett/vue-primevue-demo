<!-- eslint-disable vue/no-template-shadow -->
<template>
    <Form
        ref="formRef"
        v-slot="{ errors: formErrors, meta, values }"
        :initial-values="formInitialValues"
        @submit="onSubmit"
    >
        {{ watchFormValues(values) }}
        <div class="surface-card p-3 border-round shadow-1">
            <a
                href="#form-actions"
                class="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 bg-primary text-white p-2 border-round"
                >Skip to form actions</a
            >
            <h2 id="form-title" class="mt-0">Submit Idea</h2>
            <p class="text-600">
                Complete the form below to submit your idea. All fields marked
                with * are required.
            </p>

            <!-- Validation Summary -->
            <Message
                v-if="showValidationSummary && Object.keys(formErrors).length"
                severity="error"
                :closable="false"
                class="mb-3"
            >
                <ul class="m-0 pl-3">
                    <li v-for="error in formErrors" :key="error">
                        {{ error }}
                    </li>
                </ul>
            </Message>

            <!-- Success Message -->
            <Message
                v-if="submitSuccess"
                severity="success"
                :closable="true"
                class="mb-3"
                @close="submitSuccess = false"
            >
                Your idea has been successfully submitted!
            </Message>

            <div class="grid">
                <!-- Idea Basics Section -->
                <div class="col-12">
                    <Panel header="Idea Basics">
                        <div class="grid">
                            <div class="col-12 lg:col-6">
                                <Field
                                    v-slot="{
                                        field,
                                        errorMessage,
                                        meta: fieldMeta,
                                    }"
                                    name="title"
                                    :rules="validationRules.title"
                                >
                                    <label class="block mb-2" for="title"
                                        >Title
                                        <span
                                            class="text-red-500"
                                            aria-label="required"
                                            >*</span
                                        >
                                        <i
                                            v-tooltip.right="fieldHelp.title"
                                            class="pi pi-info-circle ml-2 text-400 cursor-help"
                                    /></label>
                                    <InputText
                                        id="title"
                                        v-bind="field"
                                        :class="{
                                            'p-invalid':
                                                errorMessage &&
                                                fieldMeta.touched,
                                        }"
                                        class="w-full"
                                        placeholder="Enter a descriptive title"
                                        aria-describedby="title-help"
                                        aria-required="true"
                                        aria-invalid="!!errorMessage && fieldMeta.touched"
                                    />
                                    <small
                                        id="title-help"
                                        class="text-600 block mt-1"
                                        >Choose a clear, concise title (3-100
                                        characters)</small
                                    >
                                    <small
                                        v-if="errorMessage && fieldMeta.touched"
                                        class="p-error block mt-1"
                                        role="alert"
                                    >
                                        {{ errorMessage }}
                                    </small>
                                </Field>
                            </div>
                            <div class="col-12 lg:col-6">
                                <Field
                                    v-slot="{
                                        errorMessage,
                                        meta: fieldMeta,
                                        value,
                                        handleChange,
                                    }"
                                    name="category"
                                    :rules="validationRules.category"
                                >
                                    <label class="block mb-2" for="category"
                                        >Category
                                        <span
                                            class="text-red-500"
                                            aria-label="required"
                                            >*</span
                                        >
                                        <i
                                            v-tooltip.right="fieldHelp.category"
                                            class="pi pi-info-circle ml-2 text-400 cursor-help"
                                    /></label>
                                    <Dropdown
                                        id="category"
                                        :model-value="value"
                                        :options="categories"
                                        placeholder="Select a category"
                                        :class="{
                                            'p-invalid':
                                                errorMessage &&
                                                fieldMeta.touched,
                                        }"
                                        class="w-full"
                                        aria-describedby="category-help"
                                        aria-required="true"
                                        aria-invalid="!!errorMessage && fieldMeta.touched"
                                        @update:model-value="handleChange"
                                    />
                                    <small
                                        id="category-help"
                                        class="text-600 block mt-1"
                                        >Select the category that best fits your
                                        idea</small
                                    >
                                    <small
                                        v-if="errorMessage && fieldMeta.touched"
                                        class="p-error block mt-1"
                                        role="alert"
                                    >
                                        {{ errorMessage }}
                                    </small>
                                </Field>
                            </div>
                            <div class="col-12">
                                <Field
                                    v-slot="{
                                        field,
                                        errorMessage,
                                        meta: fieldMeta,
                                    }"
                                    name="description"
                                    :rules="validationRules.description"
                                >
                                    <label class="block mb-2" for="desc"
                                        >Description
                                        <span
                                            class="text-red-500"
                                            aria-label="required"
                                            >*</span
                                        >
                                        <i
                                            v-tooltip.right="
                                                fieldHelp.description
                                            "
                                            class="pi pi-info-circle ml-2 text-400 cursor-help"
                                    /></label>
                                    <Textarea
                                        id="desc"
                                        v-bind="field"
                                        rows="4"
                                        :auto-resize="true"
                                        :class="{
                                            'p-invalid':
                                                errorMessage &&
                                                fieldMeta.touched,
                                        }"
                                        class="w-full"
                                        placeholder="Describe your idea in detail (10-500 characters)"
                                        aria-describedby="desc-help desc-counter"
                                        aria-required="true"
                                        aria-invalid="!!errorMessage && fieldMeta.touched"
                                    />
                                    <div class="flex justify-content-between">
                                        <small
                                            v-if="
                                                errorMessage &&
                                                fieldMeta.touched
                                            "
                                            class="p-error block mt-1"
                                        >
                                            {{ errorMessage }}
                                        </small>
                                        <small
                                            id="desc-help"
                                            class="text-600 block mt-1"
                                            >Provide a detailed explanation of
                                            your idea</small
                                        >
                                        <small
                                            id="desc-counter"
                                            class="text-600 mt-1"
                                            aria-live="polite"
                                        >
                                            {{ field.value?.length || 0 }}/500
                                            characters
                                        </small>
                                    </div>
                                </Field>
                            </div>
                            <div class="col-12">
                                <Field
                                    v-slot="{
                                        errorMessage,
                                        meta: fieldMeta,
                                        value,
                                        handleChange,
                                    }"
                                    name="tags"
                                    :rules="validationRules.tags"
                                >
                                    <label class="block mb-2"
                                        >Tags
                                        <span class="text-red-500">*</span>
                                        <i
                                            v-tooltip.right="fieldHelp.tags"
                                            class="pi pi-info-circle ml-2 text-400 cursor-help"
                                    /></label>
                                    <Chips
                                        :model-value="value"
                                        separator=","
                                        :class="{
                                            'p-invalid':
                                                errorMessage &&
                                                fieldMeta.touched,
                                        }"
                                        class="w-full"
                                        placeholder="Add tags and press Enter"
                                        @update:model-value="handleChange"
                                    />
                                    <small
                                        v-if="errorMessage && fieldMeta.touched"
                                        class="p-error block mt-1"
                                    >
                                        {{ errorMessage }}
                                    </small>
                                </Field>
                            </div>
                        </div>
                    </Panel>
                </div>

                <!-- Impact & Priority Section -->
                <div class="col-12">
                    <Panel header="Impact & Priority">
                        <div class="grid">
                            <div class="col-12 lg:col-6">
                                <Field
                                    v-slot="{
                                        errorMessage,
                                        meta: fieldMeta,
                                        value,
                                        handleChange,
                                    }"
                                    name="personas"
                                    :rules="validationRules.personas"
                                >
                                    <label class="block mb-2"
                                        >Target Personas
                                        <span class="text-red-500">*</span>
                                        <i
                                            v-tooltip.right="fieldHelp.personas"
                                            class="pi pi-info-circle ml-2 text-400 cursor-help"
                                    /></label>
                                    <MultiSelect
                                        :model-value="value"
                                        :options="personas"
                                        option-label="label"
                                        display="chip"
                                        placeholder="Select target personas"
                                        :class="{
                                            'p-invalid':
                                                errorMessage &&
                                                fieldMeta.touched,
                                        }"
                                        class="w-full"
                                        @update:model-value="handleChange"
                                    />
                                    <small
                                        v-if="errorMessage && fieldMeta.touched"
                                        class="p-error block mt-1"
                                    >
                                        {{ errorMessage }}
                                    </small>
                                </Field>
                            </div>
                            <div class="col-12 md:col-6 lg:col-3">
                                <Field
                                    v-slot="{
                                        errorMessage,
                                        meta: fieldMeta,
                                        value,
                                        handleChange,
                                    }"
                                    name="impact"
                                    :rules="validationRules.impact"
                                >
                                    <label class="block mb-2"
                                        >Impact Score
                                        <span class="text-red-500">*</span>
                                        <i
                                            v-tooltip.right="fieldHelp.impact"
                                            class="pi pi-info-circle ml-2 text-400 cursor-help"
                                    /></label>
                                    <Slider
                                        :model-value="value"
                                        :min="1"
                                        :max="10"
                                        :class="{
                                            'p-invalid':
                                                errorMessage &&
                                                fieldMeta.touched,
                                        }"
                                        @update:model-value="handleChange"
                                    />
                                    <div class="flex justify-content-between">
                                        <small class="text-600">
                                            Score: {{ value || 5 }}
                                        </small>
                                        <small
                                            v-if="
                                                errorMessage &&
                                                fieldMeta.touched
                                            "
                                            class="p-error"
                                        >
                                            {{ errorMessage }}
                                        </small>
                                    </div>
                                </Field>
                            </div>
                            <div class="col-12 md:col-6 lg:col-3">
                                <Field
                                    v-slot="{
                                        errorMessage,
                                        meta: fieldMeta,
                                        value,
                                        handleChange,
                                    }"
                                    name="reach"
                                    :rules="validationRules.reach"
                                >
                                    <label class="block mb-2"
                                        >Expected Reach
                                        <span class="text-red-500">*</span>
                                        <i
                                            v-tooltip.right="fieldHelp.reach"
                                            class="pi pi-info-circle ml-2 text-400 cursor-help"
                                    /></label>
                                    <InputNumber
                                        :model-value="value"
                                        :min="1"
                                        :step="100"
                                        mode="decimal"
                                        placeholder="Number of users"
                                        :class="{
                                            'p-invalid':
                                                errorMessage &&
                                                fieldMeta.touched,
                                        }"
                                        class="w-full"
                                        @update:model-value="handleChange"
                                    />
                                    <small
                                        v-if="errorMessage && fieldMeta.touched"
                                        class="p-error block mt-1"
                                    >
                                        {{ errorMessage }}
                                    </small>
                                </Field>
                            </div>
                            <div class="col-12 md:col-6 lg:col-3">
                                <Field
                                    v-slot="{
                                        errorMessage,
                                        meta: fieldMeta,
                                        value,
                                        handleChange,
                                    }"
                                    name="targetDate"
                                    :rules="validationRules.targetDate"
                                >
                                    <label class="block mb-2"
                                        >Target Date
                                        <i
                                            v-tooltip.right="
                                                fieldHelp.targetDate
                                            "
                                            class="pi pi-info-circle ml-2 text-400 cursor-help"
                                    /></label>
                                    <Calendar
                                        :model-value="value"
                                        :show-icon="true"
                                        :min-date="new Date()"
                                        date-format="mm/dd/yy"
                                        placeholder="Select target date"
                                        :class="{
                                            'p-invalid':
                                                errorMessage &&
                                                fieldMeta.touched,
                                        }"
                                        class="w-full"
                                        @update:model-value="handleChange"
                                    />
                                    <small
                                        v-if="errorMessage && fieldMeta.touched"
                                        class="p-error block mt-1"
                                    >
                                        {{ errorMessage }}
                                    </small>
                                </Field>
                            </div>
                        </div>
                    </Panel>
                </div>

                <!-- Technical Section -->
                <div class="col-12">
                    <Panel header="Technical Details">
                        <div class="grid">
                            <div class="col-12 md:col-6 lg:col-4">
                                <Field
                                    v-slot="{
                                        errorMessage,
                                        meta: fieldMeta,
                                        value,
                                        handleChange,
                                    }"
                                    name="complexity"
                                    :rules="validationRules.complexity"
                                >
                                    <label class="block mb-2"
                                        >Complexity
                                        <span class="text-red-500">*</span>
                                        <i
                                            v-tooltip.right="
                                                fieldHelp.complexity
                                            "
                                            class="pi pi-info-circle ml-2 text-400 cursor-help"
                                    /></label>
                                    <Dropdown
                                        :model-value="value"
                                        :options="complexityOptions"
                                        placeholder="Select complexity"
                                        :class="{
                                            'p-invalid':
                                                errorMessage &&
                                                fieldMeta.touched,
                                        }"
                                        class="w-full"
                                        @update:model-value="handleChange"
                                    />
                                    <small
                                        v-if="errorMessage && fieldMeta.touched"
                                        class="p-error block mt-1"
                                    >
                                        {{ errorMessage }}
                                    </small>
                                </Field>
                            </div>
                            <div class="col-12 md:col-6 lg:col-4">
                                <Field
                                    v-slot="{ value, handleChange }"
                                    name="dependencies"
                                >
                                    <label class="block mb-2"
                                        >Dependencies
                                        <i
                                            v-tooltip.right="
                                                fieldHelp.dependencies
                                            "
                                            class="pi pi-info-circle ml-2 text-400 cursor-help"
                                    /></label>
                                    <Chips
                                        :model-value="value"
                                        separator=","
                                        placeholder="Add dependencies"
                                        class="w-full"
                                        @update:model-value="handleChange"
                                    />
                                </Field>
                            </div>
                            <div class="col-12 md:col-6 lg:col-4">
                                <Field
                                    v-slot="{
                                        field,
                                        errorMessage,
                                        meta: fieldMeta,
                                    }"
                                    name="repoUrl"
                                    :rules="validationRules.repoUrl"
                                >
                                    <label class="block mb-2" for="repo"
                                        >Repository URL
                                        <i
                                            v-tooltip.right="fieldHelp.repoUrl"
                                            class="pi pi-info-circle ml-2 text-400 cursor-help"
                                    /></label>
                                    <InputText
                                        id="repo"
                                        v-bind="field"
                                        placeholder="https://github.com/org/repo"
                                        :class="{
                                            'p-invalid':
                                                errorMessage &&
                                                fieldMeta.touched,
                                        }"
                                        class="w-full"
                                    />
                                    <small
                                        v-if="errorMessage && fieldMeta.touched"
                                        class="p-error block mt-1"
                                    >
                                        {{ errorMessage }}
                                    </small>
                                </Field>
                            </div>
                            <div class="col-12">
                                <Field
                                    v-slot="{ value, handleChange }"
                                    name="privacy"
                                    :rules="validationRules.privacy"
                                >
                                    <label class="block mb-2"
                                        >Privacy Setting
                                        <span class="text-red-500">*</span>
                                        <i
                                            v-tooltip.right="fieldHelp.privacy"
                                            class="pi pi-info-circle ml-2 text-400 cursor-help"
                                    /></label>
                                    <div class="flex gap-3">
                                        <div
                                            class="flex align-items-center gap-2"
                                        >
                                            <RadioButton
                                                :model-value="value"
                                                input-id="privacy1"
                                                name="privacy"
                                                value="public"
                                                @update:model-value="
                                                    handleChange
                                                "
                                            />
                                            <label for="privacy1">Public</label>
                                        </div>
                                        <div
                                            class="flex align-items-center gap-2"
                                        >
                                            <RadioButton
                                                :model-value="value"
                                                input-id="privacy2"
                                                name="privacy"
                                                value="internal"
                                                @update:model-value="
                                                    handleChange
                                                "
                                            />
                                            <label for="privacy2"
                                                >Internal</label
                                            >
                                        </div>
                                        <div
                                            class="flex align-items-center gap-2"
                                        >
                                            <RadioButton
                                                :model-value="value"
                                                input-id="privacy3"
                                                name="privacy"
                                                value="private"
                                                @update:model-value="
                                                    handleChange
                                                "
                                            />
                                            <label for="privacy3"
                                                >Private</label
                                            >
                                        </div>
                                    </div>
                                </Field>
                            </div>
                        </div>
                    </Panel>
                </div>

                <!-- Contact & Meta Section -->
                <div class="col-12">
                    <Panel header="Contact Information">
                        <div class="grid">
                            <div class="col-12 md:col-6 lg:col-4">
                                <Field
                                    v-slot="{
                                        field,
                                        errorMessage,
                                        meta: fieldMeta,
                                    }"
                                    name="requesterName"
                                    :rules="validationRules.requesterName"
                                >
                                    <label class="block mb-2" for="name"
                                        >Your Name
                                        <span class="text-red-500">*</span>
                                        <i
                                            v-tooltip.right="
                                                fieldHelp.requesterName
                                            "
                                            class="pi pi-info-circle ml-2 text-400 cursor-help"
                                    /></label>
                                    <InputText
                                        id="name"
                                        v-bind="field"
                                        placeholder="John Doe"
                                        :class="{
                                            'p-invalid':
                                                errorMessage &&
                                                fieldMeta.touched,
                                        }"
                                        class="w-full"
                                    />
                                    <small
                                        v-if="errorMessage && fieldMeta.touched"
                                        class="p-error block mt-1"
                                    >
                                        {{ errorMessage }}
                                    </small>
                                </Field>
                            </div>
                            <div class="col-12 md:col-6 lg:col-4">
                                <Field
                                    v-slot="{
                                        field,
                                        errorMessage,
                                        meta: fieldMeta,
                                    }"
                                    name="requesterEmail"
                                    :rules="validationRules.requesterEmail"
                                >
                                    <label class="block mb-2" for="email"
                                        >Your Email
                                        <span class="text-red-500">*</span>
                                        <i
                                            v-tooltip.right="
                                                fieldHelp.requesterEmail
                                            "
                                            class="pi pi-info-circle ml-2 text-400 cursor-help"
                                    /></label>
                                    <InputText
                                        id="email"
                                        v-bind="field"
                                        type="email"
                                        placeholder="john@example.com"
                                        :class="{
                                            'p-invalid':
                                                errorMessage &&
                                                fieldMeta.touched,
                                        }"
                                        class="w-full"
                                    />
                                    <small
                                        v-if="errorMessage && fieldMeta.touched"
                                        class="p-error block mt-1"
                                    >
                                        {{ errorMessage }}
                                    </small>
                                </Field>
                            </div>
                            <div class="col-12 md:col-6 lg:col-4">
                                <Field
                                    v-slot="{ value, handleChange }"
                                    name="notify"
                                >
                                    <label class="block mb-2"
                                        >Email Notifications
                                        <i
                                            v-tooltip.right="fieldHelp.notify"
                                            class="pi pi-info-circle ml-2 text-400 cursor-help"
                                    /></label>
                                    <div class="flex align-items-center h-3rem">
                                        <InputSwitch
                                            :model-value="value"
                                            @update:model-value="handleChange"
                                        />
                                        <span class="ml-2 text-600"
                                            >Receive updates about this
                                            idea</span
                                        >
                                    </div>
                                </Field>
                            </div>
                            <div class="col-12">
                                <Field
                                    v-slot="{
                                        errorMessage,
                                        value,
                                        handleChange,
                                    }"
                                    name="terms"
                                    :rules="validationRules.terms"
                                >
                                    <div class="flex align-items-center gap-2">
                                        <Checkbox
                                            :model-value="value"
                                            input-id="terms"
                                            :binary="true"
                                            :class="{
                                                'p-invalid': errorMessage,
                                            }"
                                            @update:model-value="handleChange"
                                        />
                                        <label for="terms"
                                            >I confirm the information provided
                                            is accurate and I agree to the terms
                                            of service
                                            <span class="text-red-500">*</span>
                                            <i
                                                v-tooltip.right="
                                                    fieldHelp.terms
                                                "
                                                class="pi pi-info-circle ml-2 text-400 cursor-help"
                                        /></label>
                                    </div>
                                    <small
                                        v-if="errorMessage"
                                        class="p-error block mt-1"
                                    >
                                        {{ errorMessage }}
                                    </small>
                                </Field>
                            </div>
                        </div>
                    </Panel>
                </div>

                <!-- Form Actions -->
                <div id="form-actions" class="col-12">
                    <div
                        class="flex flex-column sm:flex-row justify-content-between align-items-start sm:align-items-center gap-3"
                    >
                        <div class="flex align-items-center gap-3">
                            <div class="text-600 text-sm">
                                <span class="text-red-500">*</span> Required
                                fields
                            </div>
                            <div v-if="autoSaveStatus" class="text-sm">
                                <span
                                    v-if="autoSaveStatus === 'saving'"
                                    class="text-blue-500"
                                >
                                    <i class="pi pi-spin pi-spinner mr-1" />
                                    Saving draft...
                                </span>
                                <span
                                    v-else-if="autoSaveStatus === 'saved'"
                                    class="text-green-500"
                                >
                                    <i class="pi pi-check mr-1" />
                                    Draft saved
                                </span>
                            </div>
                        </div>
                        <div class="flex gap-2">
                            <Button
                                label="Clear Form"
                                icon="pi pi-times"
                                severity="secondary"
                                type="button"
                                @click="clearForm"
                            />
                            <Button
                                label="Save Draft"
                                icon="pi pi-save"
                                severity="info"
                                type="button"
                                :disabled="!meta.dirty"
                                @click="() => saveDraft(values)"
                            />
                            <span
                                v-tooltip.top="
                                    !meta.valid
                                        ? getMissingFieldsMessage(values)
                                        : ''
                                "
                                class="inline-block"
                            >
                                <Button
                                    label="Submit Idea"
                                    icon="pi pi-check"
                                    type="submit"
                                    :loading="isSubmitting"
                                    :disabled="!meta.valid || isSubmitting"
                                />
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </Form>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { Form, Field } from "vee-validate";
import { useToast } from "primevue/usetoast";
import { useIdeasStore } from "../stores/ideas";
import Panel from "primevue/panel";
import InputText from "primevue/inputtext";
import Textarea from "primevue/textarea";
import Dropdown from "primevue/dropdown";
import Chips from "primevue/chips";
import MultiSelect from "primevue/multiselect";
import Slider from "primevue/slider";
import InputNumber from "primevue/inputnumber";
import Calendar from "primevue/calendar";
import RadioButton from "primevue/radiobutton";
import Checkbox from "primevue/checkbox";
import InputSwitch from "primevue/inputswitch";
import Button from "primevue/button";
import Message from "primevue/message";

const toast = useToast();
const ideasStore = useIdeasStore();

// Form state
const isSubmitting = ref(false);
const showValidationSummary = ref(false);
const submitSuccess = ref(false);
const autoSaveStatus = ref(""); // 'saving', 'saved', or ''
const autoSaveTimer = ref(null);

// Options
const categories = [
    "Platform",
    "UI",
    "Performance",
    "Integrations",
    "Security",
];
const personas = [
    { label: "Admin", value: "admin" },
    { label: "Developer", value: "developer" },
    { label: "Analyst", value: "analyst" },
    { label: "End User", value: "end-user" },
];
const complexityOptions = ["Low", "Medium", "High"];

// Field help content for tooltips
const fieldHelp = {
    title: `A concise, descriptive title for your idea.

Examples:
• "Add Dark Mode Toggle to Settings"
• "Implement CSV Export for Reports"
• "Optimize Dashboard Load Time"

Tips:
• Be specific about the feature
• Avoid generic titles like "New Feature"
• Keep it under 100 characters`,

    category: `Select the area most impacted by your idea.

• Platform: Core system functionality
• UI: User interface improvements
• Performance: Speed and optimization
• Integrations: Third-party connections
• Security: Safety and access control`,

    description: `Explain your idea in detail.

Include:
• What problem it solves
• Who will benefit
• Expected outcome

Example:
"Users currently have to manually export data one table at a time. This feature would allow bulk export of all related data with a single click, saving hours of work for analysts."`,

    tags: `Add keywords to help categorize your idea.

Examples:
• Feature tags: export, automation, analytics
• Tech tags: api, database, frontend
• Priority tags: urgent, nice-to-have

Tip: Press Enter after each tag`,

    personas: `Select all user groups who will benefit.

• Admin: System administrators
• Developer: Technical users & API consumers
• Analyst: Data and reporting users
• End User: General application users

Tip: Select multiple if applicable`,

    impact: `Rate the potential impact (1-10).

1-3: Minor improvement
4-6: Moderate enhancement
7-9: Major feature
10: Game-changing

Consider: User base size, time saved, revenue impact`,

    reach: `Estimated number of users affected.

Examples:
• Internal tool: 50-200 users
• Department feature: 500-1000
• Company-wide: 5000+
• Customer-facing: 10000+`,

    targetDate: `When should this be implemented?

Consider:
• Business deadlines
• Seasonal requirements
• Dependencies on other features
• Resource availability`,

    complexity: `Technical implementation difficulty.

Low: < 1 week, minimal risk
• Simple UI changes
• Config updates

Medium: 1-4 weeks, some risk
• New features
• Integration work

High: > 1 month, significant risk
• Architecture changes
• Multiple system impacts`,

    dependencies: `List any prerequisites or related items.

Examples:
• "Requires API v2 upgrade"
• "Depends on user auth system"
• "Needs design approval"
• "Related to ticket #1234"`,

    repoUrl: `Link to relevant code repository.

Examples:
• https://github.com/company/project
• https://gitlab.com/team/app
• https://bitbucket.org/workspace/repo

Optional but helpful for technical review`,

    privacy: `Who can view this idea?

• Public: Everyone can see
• Internal: Company employees only
• Private: Only you and admins

Default: Internal for most ideas`,

    requesterName: `Your full name for follow-up.

This helps us:
• Contact you for clarification
• Give credit for the idea
• Include you in implementation discussions`,

    requesterEmail: `Valid email for notifications.

You'll receive updates on:
• Status changes
• Comments from reviewers
• Implementation timeline
• Questions from the team`,

    notify: `Email notification preferences.

When enabled, you'll get notified about:
• Idea approval/rejection
• Status updates
• Comments and questions
• Implementation progress`,

    terms: `Agreement to submission terms.

By checking, you confirm:
• Information is accurate
• Idea is original or properly attributed
• You accept the review process
• Implementation is at company discretion`,
};

// Initial form values (reactive for draft loading)
const formInitialValues = ref({
    title: "",
    description: "",
    category: "",
    tags: [],
    personas: [],
    impact: 5,
    reach: 100,
    targetDate: null,
    complexity: "",
    dependencies: [],
    repoUrl: "",
    privacy: "internal",
    requesterName: "",
    requesterEmail: "",
    notify: false,
    terms: false,
});

// Validation rules
const validationRules = {
    title: (value) => {
        if (!value) return "Title is required";
        if (value.length < 3) return "Title must be at least 3 characters";
        if (value.length > 100) return "Title must be less than 100 characters";
        return true;
    },
    description: (value) => {
        if (!value) return "Description is required";
        if (value.length < 10)
            return "Description must be at least 10 characters";
        if (value.length > 500)
            return "Description must be less than 500 characters";
        return true;
    },
    category: (value) => {
        if (!value) return "Category is required";
        return true;
    },
    tags: (value) => {
        if (!value || value.length === 0) return "At least one tag is required";
        return true;
    },
    personas: (value) => {
        if (!value || value.length === 0)
            return "At least one persona must be selected";
        return true;
    },
    impact: (value) => {
        if (!value || value < 1 || value > 10)
            return "Impact score must be between 1 and 10";
        return true;
    },
    reach: (value) => {
        if (!value || value < 1) return "Expected reach must be at least 1";
        return true;
    },
    targetDate: (value) => {
        if (value) {
            const date = new Date(value);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            if (date < today) return "Target date must be in the future";
        }
        return true;
    },
    complexity: (value) => {
        if (!value) return "Complexity is required";
        return true;
    },
    repoUrl: (value) => {
        if (value) {
            const urlPattern = /^https?:\/\/.+/;
            if (!urlPattern.test(value)) return "Must be a valid URL";
            const githubPattern =
                /^https?:\/\/(www\.)?github\.com\/[\w-]+\/[\w.-]+\/?$/;
            if (value.includes("github.com") && !githubPattern.test(value)) {
                return "Must be a valid GitHub repository URL";
            }
        }
        return true;
    },
    privacy: (value) => {
        if (!value) return "Privacy setting is required";
        return true;
    },
    requesterName: (value) => {
        if (!value) return "Name is required";
        if (value.length < 2) return "Name must be at least 2 characters";
        if (value.length > 50) return "Name must be less than 50 characters";
        return true;
    },
    requesterEmail: (value) => {
        if (!value) return "Email is required";
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(value)) return "Must be a valid email address";
        return true;
    },
    terms: (value) => {
        if (!value) return "You must accept the terms";
        return true;
    },
};

// Form submission
async function onSubmit(values, { resetForm }) {
    showValidationSummary.value = true;
    isSubmitting.value = true;

    try {
        // Transform data for API
        const ideaData = {
            title: values.title,
            description: values.description,
            category: values.category,
            tags: values.tags,
            status: "New",
            personas: values.personas,
            impact: values.impact,
            reach: values.reach,
            targetDate: values.targetDate,
            complexity: values.complexity,
            dependencies: values.dependencies,
            repoUrl: values.repoUrl,
            privacy: values.privacy,
            requester: {
                name: values.requesterName,
                email: values.requesterEmail,
            },
            notify: values.notify,
        };

        await ideasStore.add(ideaData);

        // Clear saved draft
        localStorage.removeItem("draft_submit_idea");

        // Show success
        submitSuccess.value = true;
        toast.add({
            severity: "success",
            summary: "Success",
            detail: "Your idea has been submitted successfully!",
            life: 5000,
        });

        // Reset form
        resetForm();
        showValidationSummary.value = false;
    } catch (error) {
        toast.add({
            severity: "error",
            summary: "Error",
            detail: "Failed to submit idea. Please try again.",
            life: 5000,
        });
    } finally {
        isSubmitting.value = false;
    }
}

// Form ref for access to form methods
const formRef = ref(null);

// Save draft to localStorage
function saveDraft(values, showToast = true) {
    // Use the values passed from the form slot
    localStorage.setItem("draft_submit_idea", JSON.stringify(values));
    if (showToast) {
        toast.add({
            severity: "info",
            summary: "Draft Saved",
            detail: "Your draft has been saved locally.",
            life: 3000,
        });
    }
}

// Auto-save draft with debounce
function autoSaveDraft(values) {
    // Clear any existing timer
    if (autoSaveTimer.value) {
        clearTimeout(autoSaveTimer.value);
    }

    // Don't auto-save if the form was just submitted successfully
    if (submitSuccess.value) {
        return;
    }

    // Show saving status
    autoSaveStatus.value = "saving";

    // Set a new timer for auto-save (2 second debounce)
    autoSaveTimer.value = setTimeout(() => {
        saveDraft(values, false); // Don't show toast for auto-save
        autoSaveStatus.value = "saved";

        // Clear the saved status after 3 seconds
        setTimeout(() => {
            autoSaveStatus.value = "";
        }, 3000);
    }, 2000);
}

// Watch form values for changes (called from template)
const lastFormValues = ref(null);
function watchFormValues(values) {
    // Compare with last values to detect changes
    if (JSON.stringify(values) !== JSON.stringify(lastFormValues.value)) {
        lastFormValues.value = { ...values };
        autoSaveDraft(values);
    }
    return ""; // Return empty string so nothing is rendered
}

// Get missing required fields message for tooltip
function getMissingFieldsMessage(values) {
    const sections = {};

    // Check Idea Basics section
    if (!values.title || values.title.length < 3) {
        if (!sections["Idea Basics"]) sections["Idea Basics"] = [];
        sections["Idea Basics"].push("Title");
    }
    if (!values.category) {
        if (!sections["Idea Basics"]) sections["Idea Basics"] = [];
        sections["Idea Basics"].push("Category");
    }
    if (!values.description || values.description.length < 10) {
        if (!sections["Idea Basics"]) sections["Idea Basics"] = [];
        sections["Idea Basics"].push("Description");
    }
    if (!values.tags || values.tags.length === 0) {
        if (!sections["Idea Basics"]) sections["Idea Basics"] = [];
        sections["Idea Basics"].push("Tags");
    }

    // Check Impact & Priority section
    if (!values.personas || values.personas.length === 0) {
        if (!sections["Impact & Priority"]) sections["Impact & Priority"] = [];
        sections["Impact & Priority"].push("Target Personas");
    }
    if (!values.impact) {
        if (!sections["Impact & Priority"]) sections["Impact & Priority"] = [];
        sections["Impact & Priority"].push("Impact Score");
    }
    if (!values.reach || values.reach < 1) {
        if (!sections["Impact & Priority"]) sections["Impact & Priority"] = [];
        sections["Impact & Priority"].push("Expected Reach");
    }

    // Check Technical Details section
    if (!values.complexity) {
        if (!sections["Technical Details"]) sections["Technical Details"] = [];
        sections["Technical Details"].push("Complexity");
    }
    if (!values.privacy) {
        if (!sections["Technical Details"]) sections["Technical Details"] = [];
        sections["Technical Details"].push("Privacy Setting");
    }

    // Check Contact Information section
    if (!values.requesterName || values.requesterName.length < 2) {
        if (!sections["Contact Information"])
            sections["Contact Information"] = [];
        sections["Contact Information"].push("Your Name");
    }
    if (!values.requesterEmail || !isValidEmail(values.requesterEmail)) {
        if (!sections["Contact Information"])
            sections["Contact Information"] = [];
        sections["Contact Information"].push("Your Email");
    }
    if (!values.terms) {
        if (!sections["Contact Information"])
            sections["Contact Information"] = [];
        sections["Contact Information"].push("Terms Agreement");
    }

    // Build the message
    if (Object.keys(sections).length === 0) {
        return "";
    }

    let message = "Missing required fields:\n\n";
    for (const [section, fields] of Object.entries(sections)) {
        message += `${section}:\n`;
        fields.forEach((field) => {
            message += `  • ${field}\n`;
        });
        message += "\n";
    }

    return message.trim();
}

// Helper function to validate email
function isValidEmail(email) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
}

// Clear form
function clearForm() {
    if (confirm("Are you sure you want to clear all form data?")) {
        // Clear any pending auto-save
        if (autoSaveTimer.value) {
            clearTimeout(autoSaveTimer.value);
        }

        // Reset form using VeeValidate's resetForm
        if (formRef.value) {
            formRef.value.resetForm();
        }
        localStorage.removeItem("draft_submit_idea");
        showValidationSummary.value = false;
        submitSuccess.value = false;
        autoSaveStatus.value = "";
    }
}

// Load draft on mount
onMounted(() => {
    const draft = localStorage.getItem("draft_submit_idea");
    if (draft) {
        try {
            const draftData = JSON.parse(draft);
            // Update initial values with draft data
            formInitialValues.value = {
                ...formInitialValues.value,
                ...draftData,
            };

            // If formRef is available, set the values directly
            if (formRef.value) {
                formRef.value.setValues(draftData);
            }

            toast.add({
                severity: "info",
                summary: "Draft Loaded",
                detail: "Your previous draft has been restored.",
                life: 3000,
            });
        } catch (error) {
            console.error("Failed to load draft:", error);
        }
    }
});

// Clean up timer on unmount
onUnmounted(() => {
    if (autoSaveTimer.value) {
        clearTimeout(autoSaveTimer.value);
    }
});
</script>

<style scoped>
.p-invalid {
    border-color: var(--red-500) !important;
}

.p-error {
    color: var(--red-500);
}

/* Screen reader only class for skip links */
.sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
}

.sr-only:focus,
.focus\:not-sr-only:focus {
    position: absolute;
    width: auto;
    height: auto;
    padding: 0.5rem;
    margin: 0;
    overflow: visible;
    clip: auto;
    white-space: normal;
}

/* Improve focus visibility */
:focus-visible {
    outline: 2px solid var(--primary-color);
    outline-offset: 2px;
}

/* Mobile responsiveness improvements */
@media (max-width: 576px) {
    .surface-card {
        padding: 1rem !important;
    }

    .p-panel .p-panel-content {
        padding: 1rem;
    }
}
</style>
