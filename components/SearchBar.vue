<template>
    <form role="search" @submit.prevent>
        <div ref="overlay-wrapper" class="overlay-wrapper" max-w-full w-72>
            <input
                id="searchbox"
                v-model.trim="searchValue"
                role="searchbox"
                type="text"
                autocomplete="off"
                aria-haspopup="listbox"
                :aria-expanded="showDropdown"
                aria-controls="autocomplete-overlay"
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
            <div id="autocomplete-overlay" :class="{ show: showDropdown }">
                <TransitionGroup name="list" tag="ul" m-0 p-0 list-none>
                    <template v-for="result in searchResults" :key="result.key">
                        <li
                            px-4
                            py-2
                            role="option"
                            tabindex="0"
                            @click="console.log(result)"
                        >
                            {{ result.value.category }}
                            {{ result.value.moduleName }}
                        </li>
                    </template>
                </TransitionGroup>
            </div>
        </div>
    </form>
</template>

<script setup lang="ts">
import { TransitionGroup } from 'vue';

const overlayWrapper = useTemplateRef('overlay-wrapper');
const wrapperFocus = useFocusWithin(overlayWrapper);

const searchValue = ref('');
const debouncedSearch = useDebounce(searchValue, 500);
const searchResults = computedAsync(
    async () => {
        if (!debouncedSearch.value) return [];

        const req = await useLazyFetch('/api/search', {
            query: { q: debouncedSearch.value },
        });

        return req.data.value ?? [];
    },
    [],
    { lazy: true },
);

const showDropdown = computed(
    () => wrapperFocus.focused.value && searchResults.value.length > 0,
);
</script>

<style lang="scss" scoped>
#searchbox {
    @apply b-1 b-solid border-base color-base bg-secondary m-0 box-border w-full rounded-lg px-3 py-2 font-mono
            outline-color-primary:0 outline-solid transition-all-50 focus-visible:(outline-2 outline-primary:100) outline-0;
}
.overlay-wrapper {
    @apply relative;
}
#autocomplete-overlay {
    @apply op0 bg-secondary z-overlay border-base b-1 b-solid invisible absolute left-0 right-0 top-10 rounded-lg transition-opacity h-72 of-y-scroll;

    &.show {
        @apply op100 visible;
    }

    li[role='option'] {
        @apply cursor-pointer;
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
