<template>
    <div class="card">
        <Toolbar v-if="!props.limit" class="mb-3">
            <template #start>
                <div class="flex align-items-center gap-2">
                    <Button label="New" icon="pi pi-plus" @click="openNew" />
                    <Button
                        label="Refresh"
                        severity="secondary"
                        icon="pi pi-refresh"
                        @click="store.refresh"
                    />
                </div>
            </template>
            <template #end>
                <span class="p-input-icon-left mr-2"
                    ><i class="pi pi-search" /><InputText
                        v-model="search"
                        placeholder="Search..."
                /></span>
                <MultiSelect
                    v-model="filters.status"
                    :options="statuses"
                    placeholder="Filter by Status"
                    class="mr-2"
                    :max-selected-labels="2"
                    :show-clear="true"
                />
                <MultiSelect
                    v-model="filters.category"
                    :options="categories"
                    placeholder="Filter by Category"
                    class="mr-2"
                    :max-selected-labels="2"
                    :show-clear="true"
                />
                <Dropdown
                    v-model="selectedSort"
                    :options="sortOptions"
                    option-label="label"
                    placeholder="Sort by"
                    class="mr-2"
                />
                <ToggleButton
                    v-model="grid"
                    on-label="Grid"
                    off-label="Table"
                    :on-icon="'pi pi-th-large'"
                    :off-icon="'pi pi-list'"
                />
            </template>
        </Toolbar>

        <!-- Enhanced pagination for grid view -->
        <div v-if="grid">
            <div class="grid">
                <div
                    v-for="i in paginatedItems"
                    :key="i.id"
                    class="col-12 md:col-6 lg:col-4"
                >
                    <div class="surface-card p-3 border-round shadow-1">
                        <div
                            class="flex justify-content-between align-items-center mb-2"
                        >
                            <h3 class="mt-0 mb-0 text-xl">
                                {{ i.title }}
                            </h3>
                            <Button
                                icon="pi pi-angle-up"
                                class="p-button-sm"
                                :disabled="votingId === i.id"
                                @click="vote(i)"
                            >
                                {{ i.votes || 0 }}
                            </Button>
                        </div>
                        <p class="text-600 mb-2">
                            {{ i.description }}
                        </p>
                        <div class="flex gap-2 mb-2">
                            <Tag :value="i.category" severity="info" /><Tag
                                :value="i.status"
                                :severity="statusSeverity(i.status)"
                            />
                        </div>
                        <div class="text-600 text-sm">
                            Tags: {{ (i.tags || []).join(", ") || "—" }}
                        </div>
                        <div class="flex justify-content-end gap-1 mt-3">
                            <Button
                                icon="pi pi-pencil"
                                severity="secondary"
                                rounded
                                @click="editRow(i)"
                            /><Button
                                icon="pi pi-trash"
                                severity="danger"
                                rounded
                                @click="removeRow(i)"
                            />
                        </div>
                    </div>
                </div>
            </div>
            <!-- Pagination for grid view -->
            <Paginator
                v-if="totalRecords > rowsPerPage"
                :rows="rowsPerPage"
                :total-records="totalRecords"
                :rows-per-page-options="[6, 12, 24, 48]"
                :first="currentPage * rowsPerPage"
                class="mt-3"
                template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                @page="onPageChange"
            >
                <template #start>
                    <span class="text-600">
                        Showing {{ currentPage * rowsPerPage + 1 }} to
                        {{
                            Math.min(
                                (currentPage + 1) * rowsPerPage,
                                totalRecords
                            )
                        }}
                        of {{ totalRecords }}
                    </span>
                </template>
            </Paginator>
        </div>

        <DataTable
            v-else
            :value="filtered"
            :loading="store.loading"
            data-key="id"
            paginator
            :rows="rowsPerPage"
            :rows-per-page-options="[5, 10, 20, 50]"
            class="p-datatable-sm"
            :paginator-template="'FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown'"
            :current-page-report-template="'Showing {first} to {last} of {totalRecords} ideas'"
            @page="onPageChange"
        >
            <template #empty>
                <div class="p-3 text-600">No ideas found.</div>
            </template>
            <template #loading>
                <div class="p-3">Loading ideas…</div>
            </template>
            <Column field="title" header="Title" sortable>
                <template #body="{ data }">
                    <div>
                        <div class="font-semibold">
                            {{ data.title }}
                        </div>
                        <div class="text-sm text-600 mt-1">
                            {{ data.description?.substring(0, 100)
                            }}{{ data.description?.length > 100 ? "..." : "" }}
                        </div>
                    </div>
                </template>
            </Column>
            <Column field="category" header="Category" sortable>
                <template #body="{ data }">
                    <Tag :value="data.category" severity="info" />
                </template>
            </Column>
            <Column field="status" header="Status" sortable>
                <template #body="{ data }">
                    <Tag
                        :value="data.status"
                        :severity="statusSeverity(data.status)"
                    />
                </template>
            </Column>
            <Column field="votes" header="Votes" sortable>
                <template #body="{ data }">
                    <Button
                        icon="pi pi-angle-up"
                        class="p-button-sm"
                        :disabled="votingId === data.id"
                        @click="vote(data)"
                    >
                        {{ data.votes || 0 }}
                    </Button>
                </template>
            </Column>
            <Column header="Actions" style="width: 10rem">
                <template #body="{ data }">
                    <div class="flex gap-1">
                        <Button
                            icon="pi pi-pencil"
                            severity="secondary"
                            rounded
                            @click="editRow(data)"
                        /><Button
                            icon="pi pi-trash"
                            severity="danger"
                            rounded
                            @click="removeRow(data)"
                        />
                    </div>
                </template>
            </Column>
        </DataTable>

        <IdeaForm v-model="showForm" :value="editing" @submit="saveRow" />
    </div>
</template>
<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useIdeasStore } from "../stores/ideas";
import { useFuzzySearch } from "../composables/useFuzzySearch";
import { useDebounceFn } from "@vueuse/core";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Button from "primevue/button";
import InputText from "primevue/inputtext";
import Tag from "primevue/tag";
import Toolbar from "primevue/toolbar";
import Dropdown from "primevue/dropdown";
import MultiSelect from "primevue/multiselect";
import ToggleButton from "primevue/togglebutton";
import Paginator from "primevue/paginator";
import IdeaForm from "./IdeaForm.vue";

const props = defineProps({
    limit: {
        type: Number,
        default: null,
    },
});

const store = useIdeasStore();
const categories = [
    "Platform",
    "UI",
    "Performance",
    "Integrations",
    "Security",
];
const statuses = ["New", "Planned", "In Progress", "Done"];
const search = ref("");
const filters = ref({ status: [], category: [] });
const grid = ref(false);
const votingId = ref(null);
const sortField = ref("votes");
const sortOrder = ref(-1);
const currentPage = ref(0);
const rowsPerPage = ref(10);

// Fuzzy search setup
const { filteredItems: fuzzyFiltered } = useFuzzySearch(
    computed(() => store.items),
    search,
    ["title", "description", "tags", "category", "status", "requesterName"]
);

const filtered = computed(() => {
    let list = fuzzyFiltered.value;

    // Multi-select filtering
    if (filters.value.status && filters.value.status.length > 0) {
        list = list.filter((i) => filters.value.status.includes(i.status));
    }
    if (filters.value.category && filters.value.category.length > 0) {
        list = list.filter((i) => filters.value.category.includes(i.category));
    }

    // Enhanced sorting
    if (sortField.value) {
        list = [...list].sort((a, b) => {
            let aVal = a[sortField.value];
            let bVal = b[sortField.value];

            // Handle null/undefined values
            if (aVal == null) aVal = "";
            if (bVal == null) bVal = "";

            // Numeric comparison for votes and id
            if (sortField.value === "votes" || sortField.value === "id") {
                aVal = Number(aVal) || 0;
                bVal = Number(bVal) || 0;
            }

            // Date comparison for dates
            if (
                sortField.value === "createdAt" ||
                sortField.value === "targetDate"
            ) {
                aVal = new Date(aVal).getTime();
                bVal = new Date(bVal).getTime();
            }

            if (aVal < bVal) return -sortOrder.value;
            if (aVal > bVal) return sortOrder.value;
            return 0;
        });
    }

    // Apply limit if provided
    if (props.limit && props.limit > 0) {
        list = list.slice(0, props.limit);
    }

    return list;
});

// Pagination computed values
const paginatedItems = computed(() => {
    const start = currentPage.value * rowsPerPage.value;
    const end = start + rowsPerPage.value;
    return filtered.value.slice(start, end);
});

const totalRecords = computed(() => filtered.value.length);

// Reset page when filters change
watch([search, filters], () => {
    currentPage.value = 0;
});
function statusSeverity(s) {
    return s === "Done"
        ? "success"
        : s === "In Progress"
          ? "warning"
          : s === "Planned"
            ? "info"
            : "secondary";
}
const showForm = ref(false),
    editing = ref(null);
function openNew() {
    editing.value = {
        title: "",
        description: "",
        category: "",
        status: "New",
        tags: [],
    };
    showForm.value = true;
}
function editRow(row) {
    editing.value = { ...row };
    showForm.value = true;
}
async function saveRow(form) {
    if (editing.value?.id) await store.patch(editing.value.id, form);
    else await store.add(form);
}
async function removeRow(row) {
    if (confirm("Delete this idea?")) await store.remove(row.id);
}
// Debounced voting function
const debouncedVote = useDebounceFn(async (row) => {
    votingId.value = row.id;
    try {
        await store.upvoteIdea(row.id);
    } finally {
        votingId.value = null;
    }
}, 300);

async function vote(row) {
    if (votingId.value === row.id) return;
    debouncedVote(row);
}

// Pagination functions
function onPageChange(event) {
    currentPage.value = event.page;
    rowsPerPage.value = event.rows;
}

// Sorting options for dropdown
const sortOptions = [
    { label: "Most Voted", value: "votes", order: -1 },
    { label: "Least Voted", value: "votes", order: 1 },
    { label: "Title (A-Z)", value: "title", order: 1 },
    { label: "Title (Z-A)", value: "title", order: -1 },
    { label: "Newest First", value: "createdAt", order: -1 },
    { label: "Oldest First", value: "createdAt", order: 1 },
    { label: "Status", value: "status", order: 1 },
    { label: "Category", value: "category", order: 1 },
];

const selectedSort = computed({
    get() {
        return sortOptions.find(
            (opt) =>
                opt.value === sortField.value && opt.order === sortOrder.value
        );
    },
    set(val) {
        if (val) {
            sortField.value = val.value;
            sortOrder.value = val.order;
        }
    },
});
onMounted(() => {
    store.refresh();
});
</script>
<style scoped>
.card {
    background: var(--surface-card);
    border-radius: var(--border-radius);
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.06);
    padding: 1rem;
}
</style>
