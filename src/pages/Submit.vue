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
            <h2 class="mt-0">Submit Idea</h2>
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
                            <div class="col-12 md:col-6">
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
                                        <span class="text-red-500"
                                            >*</span
                                        ></label
                                    >
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
                                    />
                                    <small
                                        v-if="errorMessage && fieldMeta.touched"
                                        class="p-error block mt-1"
                                    >
                                        {{ errorMessage }}
                                    </small>
                                </Field>
                            </div>
                            <div class="col-12 md:col-6">
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
                                        <span class="text-red-500"
                                            >*</span
                                        ></label
                                    >
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
                                        <span class="text-red-500"
                                            >*</span
                                        ></label
                                    >
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
                                        <small class="text-600 mt-1">
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
                                        <span class="text-red-500"
                                            >*</span
                                        ></label
                                    >
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
                            <div class="col-12 md:col-6">
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
                                        <span class="text-red-500"
                                            >*</span
                                        ></label
                                    >
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
                            <div class="col-12 md:col-3">
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
                                        <span class="text-red-500"
                                            >*</span
                                        ></label
                                    >
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
                            <div class="col-12 md:col-3">
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
                                        <span class="text-red-500"
                                            >*</span
                                        ></label
                                    >
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
                            <div class="col-12 md:col-3">
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
                                        >Target Date</label
                                    >
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
                            <div class="col-12 md:col-4">
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
                                        <span class="text-red-500"
                                            >*</span
                                        ></label
                                    >
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
                            <div class="col-12 md:col-4">
                                <Field
                                    v-slot="{ value, handleChange }"
                                    name="dependencies"
                                >
                                    <label class="block mb-2"
                                        >Dependencies</label
                                    >
                                    <Chips
                                        :model-value="value"
                                        separator=","
                                        placeholder="Add dependencies"
                                        class="w-full"
                                        @update:model-value="handleChange"
                                    />
                                </Field>
                            </div>
                            <div class="col-12 md:col-4">
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
                                        >Repository URL</label
                                    >
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
                                        <span class="text-red-500"
                                            >*</span
                                        ></label
                                    >
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
                            <div class="col-12 md:col-4">
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
                                        <span class="text-red-500"
                                            >*</span
                                        ></label
                                    >
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
                            <div class="col-12 md:col-4">
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
                                        <span class="text-red-500"
                                            >*</span
                                        ></label
                                    >
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
                            <div class="col-12 md:col-4">
                                <Field
                                    v-slot="{ value, handleChange }"
                                    name="notify"
                                >
                                    <label class="block mb-2"
                                        >Email Notifications</label
                                    >
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
                                            <span class="text-red-500"
                                                >*</span
                                            ></label
                                        >
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
                <div class="col-12">
                    <div
                        class="flex justify-content-between align-items-center"
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
                            <Button
                                label="Submit Idea"
                                icon="pi pi-check"
                                type="submit"
                                :loading="isSubmitting"
                                :disabled="!meta.valid || isSubmitting"
                            />
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
</style>
