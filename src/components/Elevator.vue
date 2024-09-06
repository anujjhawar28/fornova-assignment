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

const columns = reactive(['Elevator No', 'Current Floor', 'Status', 'Target Floor', 'Direction'])
const rows = computed(() =>
  props.elevators.map(({ id, currentFloor, status, targetFloor, direction }) => {
    return [id, currentFloor, status, targetFloor, direction]
  })
)
</script>
