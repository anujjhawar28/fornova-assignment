<template>
  <div class="dispatch-panel">
    <h2>Elevator Dispatch System</h2>
    <form @submit.prevent="dispatchElevator">
      <label for="requestedFloor">Requested Floor:</label>
      <input type="number" id="requestedFloor" v-model="requestedFloor" />
      <button type="submit">Call Elevator</button>
    </form>
    <div class="elevator-list">
      <elevator v-for="elevator in elevators" :key="elevator.id" :elevator="elevator" />
    </div>
    <div class="passenger-list">
      <passenger v-for="passenger in passengers" :key="passenger.id" :passenger="passenger" />
    </div>
  </div>
</template>

<script>
import Elevator from './Elevator.vue'
import Passenger from './Passenger.vue'

export default {
  components: {
    Elevator,
    Passenger
  },
  data() {
    return {
      requestedFloor: null,
      elevators: [],
      passengers: []
    }
  },
  mounted() {
    this.initializeElevators()
    this.startPassengerGeneration()
  },
  methods: {
    initializeElevators() {
      for (let i = 1; i <= 5; i++) {
        this.elevators.push({
          id: i,
          currentFloor: 1,
          direction: 'up',
          status: 'idle',
          capacity: 10
        })
      }
    },
    startPassengerGeneration() {
      setInterval(() => {
        const requestedFloor = Math.floor(Math.random() * 10) + 1
        this.passengers.push({
          id: this.passengers.length + 1,
          requestedFloor: requestedFloor,
          assignedElevator: null
        })
      }, 5000)
    },
    dispatchElevator() {
      const closestElevator = this.elevators.reduce(
        (closest, elevator) => {
          const distance = Math.abs(elevator.currentFloor - this.requestedFloor)
          if (
            distance < closest.distance ||
            (distance === closest.distance && elevator.direction === 'up')
          ) {
            return { elevator, distance }
          }
          return closest
        },
        { elevator: null, distance: Infinity }
      ).elevator

      if (closestElevator) {
        closestElevator.status = 'moving'
        closestElevator.direction =
          this.requestedFloor > closestElevator.currentFloor ? 'up' : 'down'
        this.passengers[this.passengers.length - 1].assignedElevator = closestElevator.id
      } else {
        // Queue the passenger
      }
    }
  }
}
</script>
