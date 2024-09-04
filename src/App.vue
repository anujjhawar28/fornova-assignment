<template>
  <div>
    <elevator v-for="elevator in elevators" :key="elevator.id" :elevator="elevator" />
    <passenger v-for="passenger in passengers" :key="passenger.id" :passenger="passenger" />
    <dispatch-panel
      :elevators="elevators"
      :passengers="passengers"
      @dispatch-elevator="dispatchElevator"
    />
  </div>
</template>

<script>
import Elevator from '@/components/Elevator.vue'
import Passenger from '@/components/Passenger.vue'
import DispatchPanel from '@/components/DispatchPanel.vue'

export default {
  components: {
    Elevator,
    Passenger,
    DispatchPanel
  },
  data() {
    return {
      elevators: [],
      passengers: []
    }
  },
  mounted() {
    // Initialize elevators and start random passenger generation
  },
  methods: {
    dispatchElevator(passenger) {
      // Implement dispatchElevator logic
    }
  }
}
</script>
