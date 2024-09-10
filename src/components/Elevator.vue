<template>
  <BaseTable :rows="rows" :columns="columns" />
</template>

<script setup>
import { reactive, computed } from 'vue'
import BaseTable from './BaseTable.vue'

const props = defineProps({
  elevators: {
    type: Array,
    required: true,
    default: () => []
  }
})

const columns = reactive(['Elevator No', 'Current Floor', 'Target Floor', 'Direction'])
const rows = computed(() =>
  props.elevators.map(({ id, currentFloor, targetFloor, direction }) => {
    return [id, currentFloor, targetFloor, direction]
  })
)
</script>
