<template>
  <div class="dispatch-panel">
    <BaseInput type="number" label="Number of Floors" name="noOfFloor" v-model="noOfFloor" />
    <BaseInput
      type="number"
      label="Number of Elevator"
      name="noOfElevator"
      v-model="noOfElevator"
    />
    <button
      type="button"
      class="mt-4 block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
      @click="handleSubmit"
    >
      Submit
    </button>
    <div class="relative my-6">
      <div class="absolute inset-0 flex items-center" aria-hidden="true">
        <div class="w-full border-t border-gray-300" />
      </div>
      <div class="relative flex justify-center">
        <span class="bg-white px-2 text-gray-500">
          <PlusIcon class="h-5 w-5 text-gray-500" aria-hidden="true" />
        </span>
      </div>
    </div>

    <BaseInput label="Passenger Name" name="passengerName" v-model="passengerName" />
    <BaseInput
      type="number"
      label="Requested Floor"
      name="requestedFloor"
      v-model="requestedFloor"
    />
    <BaseInput type="number" label="Target Floor" name="targetFloor" v-model="targetFloor" />
    <button
      type="button"
      class="mt-4 block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
      @click="callElevator"
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
      noOfElevator: 0,

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
  methods: {
    initializeElevators() {
      for (let i = 1; i <= this.noOfElevator; i++) {
        this.elevators.push({
          id: i,
          currentFloor: 0,
          direction: 'up',
          status: 'idle',
          capacity: 10
        })
      }
    },
    // startPassengerGeneration() {
    //   setInterval(() => {
    //     const requestedFloor = Math.floor(Math.random() * 10) + 1
    //     this.passengers.push({
    //       id: this.passengers.length + 1,
    //       requestedFloor: requestedFloor,
    //       assignedElevator: null
    //     })
    //   }, 5000)
    // },
    // dispatchElevator() {
    //   const closestElevator = this.elevators.reduce(
    //     (closest, elevator) => {
    //       const distance = Math.abs(elevator.currentFloor - this.requestedFloor)
    //       if (
    //         distance < closest.distance ||
    //         (distance === closest.distance && elevator.direction === 'up')
    //       ) {
    //         return { elevator, distance }
    //       }
    //       return closest
    //     },
    //     { elevator: null, distance: Infinity }
    //   ).elevator

    //   if (closestElevator) {
    //     closestElevator.status = 'moving'
    //     closestElevator.direction =
    //       this.requestedFloor > closestElevator.currentFloor ? 'up' : 'down'
    //     this.passengers[this.passengers.length - 1].assignedElevator = closestElevator.id
    //   } else {
    //     // Queue the passenger
    //   }
    // },
    callElevator() {
      this.passengers.push({
        name: `${this.passengerName + (this.passengers.length + 1)}`,
        requestedFloor: this.requestedFloor,
        assignedElevator: null
      })
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
    },
    handleSubmit() {
      this.initializeElevators()
    }
  }
}
</script>
