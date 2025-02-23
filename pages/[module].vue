<!-- Redirect for /module-id to /?q=module-id -->

<template></template>

<script setup lang="ts">
const route = useRoute();
const path = [route.params.module].flat().join('');

await navigateTo(`/?q=${encodeURIComponent(path)}`, {
    redirectCode: 301,
    replace: true,
});
</script>
