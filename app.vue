<template>
    <NuxtLayout>
        <NuxtPage />
    </NuxtLayout>
</template>

<script setup lang="ts">
import '~/styles/global.scss';
import { useDark } from '@vueuse/core';

useDark();
</script>
