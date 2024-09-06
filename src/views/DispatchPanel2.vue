<template>
  <div class="dispatch-panel">
    <BaseInput
      type="number"
      label="Requested Floor"
      name="requestedFloor"
      v-model="requestedFloor"
    />
    <button
      type="button"
      class="mt-4 block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
      @click="dispatchElevator"
    >
      Call Elevator
    </button>

    <div class="elevator-list">
      <Elevator :elevators="elevators" />
    </div>
    <div class="passenger-list">
      <Passenger v-for="passenger in passengers" :key="passenger.id" :passenger="passenger" />
    </div>
  </div>
</template>

<script>
import { PlusIcon } from '@heroicons/vue/20/solid'
import Elevator from '../components/Elevator.vue'
import Passenger from '../components/Passenger.vue'
import BaseInput from '@/components/BaseInput.vue'

export default {
  components: {
    Elevator,
    Passenger,
    BaseInput,
    PlusIcon
  },
  data() {
    return {
      requestedFloor: null,
      targetFloor: null,
      passengerName: null,
      noOfFloor: 0,
      noOfElevator: 5,

      elevators: [],
      passengers: [],
      elevator: {
        id: 122,
        direction: 'up | down | idle',
        currentFloor: 10,
        targetFloor: 20,
        passenger: {
          name: 'Name',
          requestedFloor: this.requestedFloor,
          assignedElevator: null
        }
      }
    }
  },
  mounted() {
    this.initializeElevators()
    this.startPassengerGeneration()
  },
  methods: {
    initializeElevators() {
      for (let i = 1; i <= this.noOfElevator; i++) {
        this.elevators.push({
          id: i,
          currentFloor: 0,
          targetFloor: 0,
          direction: 'up',
          status: 'idle',
          capacity: 10
        })
      }
    },
    startPassengerGeneration() {
      let count = 1
      const interval = setInterval(() => {
        if (count === 5) {
          clearInterval(interval)
          count = 1
        }
        const requestedFloor = Math.floor(Math.random() * 10) + 1
        this.passengers.push({
          id: this.passengers.length + 1,
          requestedFloor: requestedFloor,
          assignedElevator: null
        })
        this.dispatchElevator(requestedFloor)?.id
        count += 1
      }, 5000)
    },
    dispatchElevator(requestedFloor) {
      const closestElevator = this.elevators.reduce(
        (closest, elevator) => {
          const distance = Math.abs(elevator.currentFloor - requestedFloor)
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
        closestElevator.targetFloor = requestedFloor
        closestElevator.direction = requestedFloor > closestElevator.currentFloor ? 'up' : 'down'
        this.passengers[this.passengers.length - 1].assignedElevator = closestElevator.id
      } else {
        // Queue the passenger
      }
    }
  }
}
</script>
