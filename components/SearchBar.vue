<template>
    <form role="search" @submit.prevent flex justify-center>
        <div ref="overlay-wrapper" class="overlay-wrapper" max-w-full w-96>
            <input
                id="searchbox"
                v-model.trim="searchValue"
                role="searchbox"
                type="text"
                autocomplete="off"
                aria-haspopup="listbox"
                :aria-expanded="showDropdown"
                aria-controls="autocomplete-overlay"
                @keydown.enter="
                    searchResults.length > 0 && openManifest(searchResults[0])
                "
                @keydown.down.prevent="selectNext(undefined, 0)"
            />
            <p
                role="status"
                aria-live="polite"
                absolute
                left-0
                top-0
                h-0
                w-0
                of-hidden
            >
                {{ searchResults?.length }}
                {{
                    searchResults?.length == 1
                        ? 'result is available'
                        : 'results are available'
                }}
            </p>
            <div
                id="autocomplete-overlay"
                :class="{ show: showDropdown }"
                tabindex="-1"
            >
                <ul m-0 p-0 list-none text-left>
                    <template
                        v-for="manifest in searchResults"
                        :key="manifest.key"
                    >
                        <li
                            :ref="(el) => listItems.set(manifest, el as any)"
                            px-2
                            py-2
                            role="option"
                            text-nowrap
                            of-hidden
                            tabindex="-1"
                            @click="openManifest(manifest)"
                            @keydown.enter="openManifest(manifest)"
                            @keydown.up.prevent="
                                selectNext($event.target as HTMLLIElement, -1)
                            "
                            @keydown.down.prevent="
                                selectNext($event.target as HTMLLIElement)
                            "
                        >
                            <ModuleBadge :module="manifest.value" mr-1 />
                            {{ manifest.value.moduleName }}
                        </li>
                    </template>
                </ul>
            </div>
        </div>
    </form>
</template>

<script setup lang="ts">
import type { KeyedModuleReplacement } from '~/types/module-manifests';

const props = defineProps<{
    value?: string;
}>();

const overlayWrapper = useTemplateRef('overlay-wrapper');
const wrapperFocus = useFocusWithin(overlayWrapper);

const searchValue = ref('');
const searchDebounced = useDebounce(searchValue, 500);
const { data: searchResults } = useFetch('/api/search', {
    deep: false,
    query: computed(() => ({ q: searchDebounced.value })),
    default: () => [],
});

watchImmediate(
    () => props.value,
    (val) => {
        if (val) {
            searchValue.value = val;
        }
    },
);

const showDropdown = computed(
    () => wrapperFocus.focused.value && searchResults.value.length > 0,
);

const listItems = shallowReactive(
    new Map<KeyedModuleReplacement, HTMLLIElement>(),
);

async function openManifest(manifest: KeyedModuleReplacement) {
    if (manifest.value) {
        searchValue.value = manifest.value.moduleName;
        await navigateTo({ query: { q: manifest.key } });
        // Remove focus from input
        if (
            document.activeElement &&
            'blur' in document.activeElement &&
            typeof document.activeElement.blur === 'function'
        ) {
            document.activeElement.blur();
        }
    }
}

function selectNext(element?: HTMLLIElement, offset = 1) {
    const entry = Array.from(listItems.entries()).find(
        ([, el]) => el === element,
    );
    const entryIndex = entry
        ? searchResults.value.findIndex((r) => r.key === entry[0].key)
        : 0;

    const i = entryIndex + offset;

    const wrappedI =
        i < 0 ? searchResults.value.length - 1 : i % searchResults.value.length;
    const item = searchResults.value[wrappedI];

    listItems.get(item)?.focus();
}
</script>

<style lang="scss" scoped>
#searchbox {
    @apply b-1 b-solid border-base color-base bg-base m-0 box-border w-full rounded-lg px-3 py-2 font-mono
            outline-color-primary:0 outline-solid transition-all-50 focus-visible:(outline-2 outline-primary:100) outline-0;
}
.overlay-wrapper {
    @apply relative;
}
#autocomplete-overlay {
    @apply op0 bg-base z-overlay border-base b-1 b-solid invisible absolute left-0 right-0 top-10 rounded-lg transition-opacity h-72 of-y-scroll;

    &.show {
        @apply op100 visible;
    }

    li[role='option'] {
        @apply cursor-pointer transition-100 outline-none;

        &:focus-visible,
        &:hover {
            @apply bg-active;
        }
    }
}

.list-enter-active,
.list-leave-active {
    @apply op100 transition-opacity;
}
.list-enter-from,
.list-leave-to {
    @apply op0;
}
</style>
