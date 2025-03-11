<script setup lang="ts">
import {Card} from "@/types/card";

defineProps({
    card: {
        type: Object as () => Card,
        required: true,
    },
});

</script>

<template>
    <div class="card-container">
        <div class="card-header">
            <h2>{{ card.name }}</h2>
        </div>

        <div class="card-image-container">
            <img :src="card.image" class="card-image"/>
        </div>
    </div>
</template>

<style scoped>
.card-container {
    width: 250px;
    color: white;
    padding: 10px;
    border-radius: 8px;
    text-align: center;
    font-family: Arial, sans-serif;
    margin: 0 auto;
}

.card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.card-image-container {
    margin: 10px 0;
}

.card-image {
    width: 100%;
    border-radius: 8px;
}
</style>