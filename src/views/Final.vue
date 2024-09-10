<template>
  <div class="container">
    <!-- Input fields for number of floors and elevators -->
    <div class="input-container">
      <div class="input-group">
        <label for="floors">Number of Floors:</label>
        <input type="number" v-model="numFloors" min="1" id="floors" :disabled="gridRendered" />
      </div>
      <div class="input-group">
        <label for="elevators">Number of Elevators:</label>
        <input
          type="number"
          v-model="numElevators"
          min="1"
          id="elevators"
          :disabled="gridRendered"
        />
      </div>
      <button @click="initializeSystem" v-if="!gridRendered" class="submit-button">Submit</button>
      <button @click="gridRendered = !gridRendered" v-else class="submit-button">Edit</button>
    </div>

    <!-- Passenger details input -->
    <div v-if="gridRendered" class="passenger-input-container">
      <div class="input-group">
        <label for="passenger">Passenger Name:</label>
        <input type="text" v-model="passengerName" id="passenger" />
      </div>
      <div class="input-group">
        <label for="current-floor">Current Floor:</label>
        <input type="number" v-model="currentFloor" :max="numFloors" min="1" id="current-floor" />
      </div>
      <div class="input-group">
        <label for="target-floor">Target Floor:</label>
        <input type="number" v-model="targetFloor" :max="numFloors" min="1" id="target-floor" />
      </div>
      <button @click="requestElevator" class="submit-button">Request Elevator</button>
    </div>

    <!-- Grid layout for floors, elevators, and extra columns/row -->
    <div v-if="gridRendered" class="grid-container" :style="gridStyle">
      <div v-for="floorIndex in numFloors" :key="floorIndex" class="row">
        <div class="floor-number">Floor {{ numFloors - floorIndex + 1 }}</div>

        <!-- Data storage to display queued passengers -->
        <div class="data-storage">
          <div
            v-for="passenger in passengersInQueueAtFloor(numFloors - floorIndex + 1)"
            :key="passenger.name"
          >
            {{ passenger.name }}
          </div>
        </div>

        <!-- Elevator cells -->
        <div
          v-for="(elevator, elevatorIndex) in numElevators"
          :key="elevatorIndex"
          class="floor"
          :class="{
            highlight:
              elevators[elevatorIndex] &&
              elevators[elevatorIndex].currentFloor === numFloors - floorIndex + 1
          }"
        >
          <!-- Display current passengers only in the highlighted elevator box -->
          <div v-if="elevators[elevatorIndex].currentFloor === numFloors - floorIndex + 1">
            <div
              v-for="passenger in elevators[elevatorIndex].currentPassengers"
              :key="passenger.name"
            >
              {{ passenger.name }}
            </div>
          </div>
        </div>
      </div>

      <div class="empty-cell"></div>
      <div class="empty-cell"></div>
      <div
        v-for="(elevator, elevatorIndex) in numElevators"
        :key="elevatorIndex"
        class="elevator-number"
      >
        Elevator {{ elevatorIndex + 1 }}
      </div>
    </div>
    {{ elevators }}
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

// State variables
const numFloors = ref(1)
const numElevators = ref(1)
const gridRendered = ref(false)
const passengerName = ref('')
const currentFloor = ref(1)
const targetFloor = ref(1)
const elevators = ref([])
const allPassengers = ref([])

// Computed property for the grid layout style
const gridStyle = computed(() => ({
  display: 'grid',
  gridTemplateColumns: `auto auto repeat(${numElevators.value}, 1fr)`,
  gridTemplateRows: `repeat(${numFloors.value + 1}, 1fr)`,
  gap: '10px'
}))

// Initialize elevator system
const initializeSystem = () => {
  elevators.value = Array.from({ length: numElevators.value }, (_, index) => ({
    id: index + 1,
    currentFloor: 1,
    direction: 'idle',
    targetFloor: null,
    currentPassengers: [],
    inQueuePassenger: []
  }))
  allPassengers.value = []
  gridRendered.value = true
  startElevatorUpdate()
}

// Request an elevator for a passenger
const requestElevator = () => {
  if (targetFloor.value === currentFloor.value) {
    alert('Target floor and current floor cannot be the same.')
    return
  }

  const passenger = {
    name: passengerName.value,
    targetFloor: targetFloor.value,
    currentFloor: currentFloor.value
  }

  allPassengers.value.push(passenger)
  requestElevatorFromPassenger(passenger.name, passenger.targetFloor, passenger.currentFloor)
  passengerName.value = ''
  currentFloor.value = 1
  targetFloor.value = 1
}

// Filter passengers waiting at a specific floor
const passengersInQueueAtFloor = (floor) => {
  return (allPassengers.value ?? []).filter((passenger) => passenger.currentFloor === floor)
}

// Main elevator request logic
const requestElevatorFromPassenger = (name, targetFloor, currentFloor) => {
  const passengerData = { name, targetFloor, currentFloor }
  const requestedDirection = targetFloor > currentFloor ? 'up' : 'down'

  const sameDirectionElevators = elevators.value.filter(
    (elevator) => elevator.direction === requestedDirection
  )

  if (sameDirectionElevators.length > 0) {
    const closestElevator = findClosestElevator(sameDirectionElevators, currentFloor)
    handleElevatorPickup(closestElevator, passengerData)
    return
  }

  const idleElevators = elevators.value.filter((elevator) => elevator.direction === 'idle')

  if (idleElevators.length > 0) {
    const closestIdleElevator = findClosestElevator(idleElevators, currentFloor)
    handleIdleElevatorPickup(closestIdleElevator, passengerData, targetFloor)
    return
  }

  const nearestElevator = findNearestElevatorToCompleteTask(currentFloor)
  nearestElevator.elevator.inQueuePassenger.push(passengerData)
}

// Find the closest elevator based on floor distance
const findClosestElevator = (elevators, currentFloor) => {
  return elevators.reduce(
    (closest, elevator) => {
      const distance = Math.abs(elevator.currentFloor - currentFloor)
      if (
        distance < closest.distance ||
        (distance === closest.distance && elevator.direction === 'up')
      ) {
        return { elevator, distance }
      }
      return closest
    },
    { elevator: null, distance: Infinity }
  )
}

// Find the nearest elevator to complete its current task and move to pick up the passenger
const findNearestElevatorToCompleteTask = (currentFloor) => {
  const allElevatorTasks = elevators.value.map((elevator) => {
    const timeToCompleteCurrentTask =
      elevator.direction === 'down'
        ? elevator.currentFloor - elevator.targetFloor
        : elevator.targetFloor - elevator.currentFloor

    const timeToReachPassenger = Math.abs(currentFloor - elevator.currentFloor)
    return { elevator, time: timeToCompleteCurrentTask + timeToReachPassenger }
  })

  return allElevatorTasks.reduce(
    (nearest, task) => {
      return task.time < nearest.time ? task : nearest
    },
    { elevator: null, time: Infinity }
  )
}

// Handle elevator logic when it picks up passengers
const handleElevatorPickup = (closestElevator, passengerData) => {
  if (closestElevator.distance === 0) {
    closestElevator.elevator.currentPassengers.push(passengerData)
    closestElevator.elevator.targetFloor = getTargetFloorFromPassengers(
      closestElevator.elevator.currentPassengers,
      closestElevator.elevator.direction
    )
    allPassengers.value = allPassengers.value.filter((p) => p !== passengerData)
  } else {
    closestElevator.elevator.inQueuePassenger.push(passengerData)
  }
}

// Handle idle elevators picking up passengers
const handleIdleElevatorPickup = (closestIdleElevator, passengerData, targetFloor) => {
  if (closestIdleElevator.distance === 0) {
    closestIdleElevator.elevator.currentPassengers.push(passengerData)
    closestIdleElevator.elevator.targetFloor = getTargetFloorFromPassengers(
      closestIdleElevator.elevator.currentPassengers,
      closestIdleElevator.elevator.direction
    )
    closestIdleElevator.elevator.direction = targetFloor > currentFloor.value ? 'up' : 'down'
  } else {
    closestIdleElevator.elevator.inQueuePassenger.push(passengerData)
    closestIdleElevator.elevator.direction =
      currentFloor.value > closestIdleElevator.elevator.currentFloor ? 'up' : 'down'
    closestIdleElevator.elevator.targetFloor = targetFloor
  }
}

// Calculate the target floor based on the passengers' destinations
const getTargetFloorFromPassengers = (passengers, direction = 'up') => {
  if (direction === 'up') {
    return passengers.reduce((max, passenger) => Math.max(max, passenger.targetFloor), -Infinity)
  } else {
    return passengers.reduce((min, passenger) => Math.min(min, passenger.targetFloor), Infinity)
  }
}

// Update the elevators' positions periodically
const startElevatorUpdate = () => {
  setInterval(() => {
    elevators.value.forEach((elevator) => {
      if (elevator.direction !== 'idle') {
        elevator.currentFloor += elevator.direction === 'up' ? 1 : -1

        const boardingPassengers = elevator.inQueuePassenger.filter(
          (passenger) => passenger.currentFloor === elevator.currentFloor
        )
        elevator.currentPassengers.push(...boardingPassengers)
        elevator.inQueuePassenger = elevator.inQueuePassenger.filter(
          (passenger) => passenger.currentFloor !== elevator.currentFloor
        )

        elevator.targetFloor = getTargetFloorFromPassengers(
          elevator.currentPassengers,
          elevator.direction
        )

        elevator.currentPassengers = elevator.currentPassengers.filter(
          (passenger) => passenger.targetFloor !== elevator.currentFloor
        )
      }

      if (elevator.currentFloor === elevator.targetFloor) {
        if (elevator.inQueuePassenger.length > 0) {
          elevator.direction =
            elevator.inQueuePassenger[0].targetFloor > elevator.currentFloor ? 'up' : 'down'
          elevator.targetFloor = elevator.inQueuePassenger[0].targetFloor
          elevator.currentPassengers.push(
            ...elevator.inQueuePassenger.filter((p) => p.currentFloor === elevator.currentFloor)
          )
          elevator.inQueuePassenger = elevator.inQueuePassenger.filter(
            (p) => p.currentFloor !== elevator.currentFloor
          )
        } else {
          elevator.direction = 'idle'
          elevator.targetFloor = null
        }
      }
    })
  }, 7000)
}
</script>

<style scoped>
.container {
  max-width: 100%;
  margin: 20px auto;
  padding: 20px;
  background-color: #f9fafb;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.input-container {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.passenger-input-container {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.input-group {
  display: flex;
  flex-direction: column;
}

input[type='number'],
input[type='text'] {
  padding: 8px;
  border: 2px solid #cbd5e1;
  border-radius: 4px;
  font-size: 16px;
  transition: border-color 0.3s ease;
}

input[type='number']:focus,
input[type='text']:focus {
  border-color: #3b82f6;
  outline: none;
}

.submit-button {
  padding: 10px 20px;
  background-color: #2563eb;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s ease;
}

.submit-button:hover {
  background-color: #1e40af;
}

.grid-container {
  display: grid;
  gap: 10px;
  background-color: #f1f5f9;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.floor-number,
.elevator-number {
  background-color: #1e40af;
  color: white;
  text-align: center;
  padding: 10px;
  border-radius: 4px;
  font-weight: bold;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.data-storage,
.floor {
  background-color: #e2e8f0;
  text-align: center;
  padding: 10px;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: background-color 0.3s ease;
}

.floor:hover {
  background-color: #bfdbfe;
}

.elevator-number {
  background-color: #2563eb;
}
.highlight {
  border: 2px solid green;
  background-color: lightblue;
}

.row {
  display: contents;
}

.empty-cell {
  background-color: transparent;
}
</style>
