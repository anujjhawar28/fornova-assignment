Passenger - name, targetFloor, currentFloor
ELevator - id, status, currentFloor, targetFloor, direction, currentPassengers, inQueuePassengers


elevators = []
passengers = []

requestElevatorFromPassenger(name, targetFloor, currentFloor){
    const passengerData = {
        name,
        targetFloor,
        currentFloor
    }

        < !--Check Requested path (kaha Passenger jaan chahta he)--> 
    const requestedDirection = targetFloor - currentFloor > 1 ? 'up' : 'down';

    <!--What Elevators are going in same direction where passenger has requested(Hum Ye check karenge ki Passenger ki direction mein kon kon si elevators available he)-- >
    const sameDirectionsElevators = elevators.filter(elevator => elevator.direction === requestedDirection)

        < !--Which Elevator is closest to passenger currentFloor (Konsi elevator paas mein he currentFloor of passenger) assign that elevator-- >
    if (sameDirectionsElevators.length > 1) {
        const closestElevator = sameDirectionsElevators.reduce(
            (closest, elevator) => {
                const distance = Math.abs(elevator.currentFloor - targetFloor)
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

        if (closestElevator.distance === 0) {
            closestElevator.elevator.currentPassengers.push(passengerData);
            closestElevator.elevator.targetFloor = checkTargetFloorFromPassengers(closestElevator.elevator.currentPassengers, closestElevator.elevator.direction)
        } else {
            closestElevator.elevator.inQueuePassenger.push(passengerData);
        }
        return;
    }


    <!--If no elevator is moving in same directuon will check idle elevator and assign passenger-- >
    const idleElevators = elevators.filter(elevator => elevator.direction === 'idle')
    if (idleElevators.length > 1) {
        const closestElevator = idleElevators.reduce(
            (closest, elevator) => {
                const distance = Math.abs(elevator.currentFloor - targetFloor)
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
        if (closestElevator.distance === 0) {
            closestElevator.elevator.currentPassengers.push(passengerData);
            closestElevator.elevator.targetFloor = checkTargetFloorFromPassengers(closestElevator.elevator.currentPassengers, closestElevator.elevator.direction)
        } else {
            closestElevator.elevator.inQueuePassenger.push(passengerData);
        }
        return;
    }

    <!--If No Elevators not moving in same direction  or not idle then will check which is closest elevator completing its task early-- >
        const currentElevatorCompletionTaskTime = elevator.direction === 'down' ? currentFloor - targetFloor : targetFloor - currentFloor;
    const allElevatorCurrentTasksToCompleteTurnAround = [];
    elevators.forEach(elevator => {
        if (elevator.direction === 'down') {
            const timeToCompleteActualElevatorTask = elevator.currentFloor - elevator.targetFloor;
            const timeTakenByElevatorToReachPassenger = currentFloor > elevator.targetFloor ? currentFloor - elevator.targetFloor : elevator.targetFloor - currentFloor;
            allElevatorCurrentTasksToCompleteTurnAround.push({ elevatorId: elevator.id, time: timeToCompleteActualElevatorTask + timeTakenByElevatorToReachPassenger })
        } else {
            const timeToCompleteActualElevatorTask = elevator.targetFloor - elevator.currentFloor;
            const timeTakenByElevatorToReachPassenger = currentFloor < elevator.targetFloor ? elevator.targetFloor - currentFloor : currentFloor - elevator.targetFloor;
            allElevatorCurrentTasksToCompleteTurnAround.push({ elevatorId: elevator.id, time: timeToCompleteActualElevatorTask + timeTakenByElevatorToReachPassenger })
        }
    })

    const nearestElevator = return allElevatorCurrentTasksToCompleteTurnAround.reduce(({ min, elevator }, obj) => {
        return obj.time < min ? { min: obj.time, obj } : { min, elevator };
    }, -Infinity);
    nearestElevator.inQueuePassenger.push(passengerData);
}


checkTargetFloorFromPassengers(passengers, direction = 'up'){
    if (direction === 'up') {
        return passengers.reduce((max, obj) => {
            return obj.targetFloor > max ? obj.targetFloor : max;
        }, -Infinity);
    }
    if (direction === 'else') {
        return passengers.reduce((min, obj) => {
            return obj.targetFloor < min ? obj.targetFloor : min;
        }, -Infinity);
    }
}


Validation to be added considering below points
1. Both targertFloor(Passenger) and currentFloor(Passenger) can not be same
2.



updateElevators() {
    setInterval(() => {
        for (const elevator of elevators) {
            if (elevator.direction !== 'idle') {
                elevator.currentFloor = elevator.direction === 'up' ? elevator.currentFloor + 1 : elevator.currentFloor - 1;

                const allPassengerToGetInElevator = elevator.inQueuePassenger.filter(passenger => passenger.currentFloor === elevator.currentFloor);
                while (elevator.inQueuePassenger.length > 0 && allPassengerToGetInElevator.length > 0) {
                    const passengerName = allPassengerToGetInElevator.shift();
                    elevator.currentPassengers.push(passengerName);
                    elevator.targetFloor = checkTargetFloorFromPassengers(elevator.currentPassengers, elevator.direction)
                }

                const allPassengerNotToLeaveTheElevator = elevator.currentPassengers.filter(passenger => passenger.targetFloor !== elevator.currentFloor);
                elevator.currentPassengers = allPassengerNotToLeaveTheElevator;

            }

            if (elevator.currentFloor === elevator.targetFloor && !elevator.inQueuePassenger.length) {
                elevator.direction = 'idle';
                elevator.currentPassengers = [];
            } else if (elevator.currentFloor === elevator.targetFloor && elevator.inQueuePassenger.length > 0) {
                elevator.direction = elevator.inQueuePassenger[0].targetFloor - currentFloor > 0 ? 'up' : 'down';
                elevator.targetFloor = elevator.inQueuePassenger[0].targetFloor;
                const passengerName = elevator.inQueuePassenger.shift();
                elevator.currentPassengers.push(passengerName);
            }
        }
    }, timeToMoveFloorByElevator)
}