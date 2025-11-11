class Elevator {
    constructor(totalFloors) {
        this.currentFloor = 0
        this.direction = 'IDEL' //UP DOWN idel
        this.requests = []
        this.totalFloors = totalFloors
        this.isMoving = false
    }

    requestFloor(floor) {
        if (floor < 0 || floor >= this.totalFloors) return
        if (!this.requests.includes(floor)) {
            this.requests.push(floor)
            this.processRequest()
        }
    }

    processRequest() {
        if (this.isMoving || this.requests.length === 0) return

        this.isMoving = true
        this.requests.sort((a, b) => a - b)
        let nextFloor = this.requests.shift()

        this.moveTo(nextFloor)
    }

    moveTo(targetFloor) {

        this.direction = targetFloor > this.currentFloor ? 'up' : 'down'
        console.log(`Moving ${this.direction} ${this.currentFloor} to ${targetFloor}`)

        setTimeout(() => {
            this.currentFloor = targetFloor
            console.log(`Reached at `, this.currentFloor)
            this.isMoving = false
            this.direction = 'IDLE'
            this.processRequest()
        }, Math.abs(this.currentFloor - targetFloor) * 1000);

        // console.log(`Current elevator state is ${this.direction}`)
    }
}


//Below Class is Elevator Controller
class ElevatorController {
    constructor(numElevator, totalFloors) {
        this.elevators = Array.from({ length: numElevator }, () => new Elevator(totalFloors))
    }

    requestElevator(floor) {
        let available = this.elevators.find(e => e.direction === 'IDEL')
        if (!available) {
            available = this.elevators[0]
        }
        available.requestFloor(floor)
    }
}

//Below Class is User panel
class UserPanel {
    constructor(controller) {
        this.controller = controller
    }

    callElevator(floor) {
        console.log(`Elevator requested at floor ${floor}`)
        this.controller.requestElevator(floor)
    }

    selectFloor(elevator, floor) {
        console.log(`Floor ${floor} is selected in elevator`)
        elevator.requestFloor(floor)
    }
}

const controller = new ElevatorController(1, 10)
const panel = new UserPanel(controller)

const elevator = controller.elevators[0]

elevator.currentFloor = 7

panel.selectFloor(elevator, 4)
panel.selectFloor(elevator, 2)