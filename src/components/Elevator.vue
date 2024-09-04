<template>
  <div class="elevator">
    <p>Elevator {{ id }}</p>
    <p>Current Floor: {{ currentFloor }}</p>
    <p>Status: {{ status }}</p>
  </div>
</template>

<script>
export default {
  props: {
    elevator: {
      type: Object,
      required: true
    }
  },
  computed: {
    id() {
      return this.elevator.id
    },
    currentFloor() {
      return this.elevator.currentFloor
    },
    status() {
      return this.elevator.status
    }
  }
}
</script>
