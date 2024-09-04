<template>
  <div class="passenger">
    <p>Passenger {{ id }}</p>
    <p>Requested Floor: {{ requestedFloor }}</p>
    <p>Assigned Elevator: {{ assignedElevator }}</p>
  </div>
</template>

<script>
export default {
  props: {
    passenger: {
      type: Object,
      required: true
    }
  },
  computed: {
    id() {
      return this.passenger.id
    },
    requestedFloor() {
      return this.passenger.requestedFloor
    },
    assignedElevator() {
      return this.passenger.assignedElevator
    }
  }
}
</script>
