<template>
    <form role="search" @submit.prevent>
        {{ showDropdown }}
        <ClientOnly>
            <Dropdown :shown="showDropdown" no-auto-focus>
                <input
                    ref="search"
                    v-model.trim="searchValue"
                    role="searchbox"
                    type="text"
                    autocomplete="off"
                    class="b-1 border-base rounded-lg b-solid px-3 py-2 font-mono bg-secondary color-base"
                    w-52
                    outline-0
                    outline-color-primary:0
                    outline-solid
                    transition-all-50
                    focus-visible="~ outline-2 outline-primary:100"
                    @focusout="hasFocus = false"
                    @focusin="hasFocus = true"
                />
                <template #popper>
                    <div>A</div>
                </template>
            </Dropdown>
        </ClientOnly>
    </form>
</template>

<script setup lang="ts">
import { Dropdown } from 'floating-vue';

const searchValue = ref('');
// const searchResults = reactive<any[]>(['a']);
const searchResults = computed(() => searchValue.value.split(''));
const hasFocus = ref(false);
const showDropdown = computed(
    () => hasFocus.value && searchResults.value.length > 0,
);
</script>
