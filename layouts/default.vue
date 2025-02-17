<template>
    <div
        class="fixed top-0 h-14 w-full b-0 b-b"
        border-base
        border-solid
        bg-glass
        lg:px-48
    >
        a
    </div>
    <div h-screen-2xl pt-14>
        <slot />
    </div>
</template>

<script setup lang="ts">
import { useDark } from '@vueuse/core';
import '~/styles/global.css';

useDark();
</script>
