/*
========================> Parking LOT system LLD <=============================

1. Funtional Requirement
-> Assigning the Parking spot to user based on vehicle type. (Car, Truck, MotorCycle)
-> Calculate Fees based on times and vehicle type
-> Handle multiple entry points. (More that one)
-> Support diffrent parking stratiges (Nearest available).
-> Show avilable parking spot.

2. Non Functionale Requirement
-> Should be scalable. (Capable to add new vehicle type).
-> Easy to maintain.
*/

// Enums and Constants
const VehicleType = {
    MOTORCYCLE: 'MOTORCYCLE',
    CAR: 'CAR',
    TRUCK: 'TRUCK'
};

const SpotType = {
    MOTORCYCLE: 'MOTORCYCLE',
    COMPACT: 'COMPACT',
    LARGE: 'LARGE',
    ELECTRIC: 'ELECTRIC'
};

const SpotStatus = {
    AVAILABLE: 'AVAILABLE',
    OCCUPIED: 'OCCUPIED',
    UNDER_MAINTENANCE: 'UNDER_MAINTENANCE'
};

class ParkingSpot {
    constructor(spotNumber, spotType, floor) {
        this.spotNumber = spotNumber
        this.spotType = spotType
        this.floor = floor
        this.status = SpotStatus.AVAILABLE
        this.vehicle = null
    }


    parkVehicle(vehicle) {
        if (this.status == 'AVAILABLE' && this.isSuitableForVehicle(vehicle)) {
            this.vehicle = vehicle
            this.status = SpotStatus.OCCUPIED
            return true
        }
        return false
    }

    isSuitableForVehicle(vehicle) {

        const vehicleToSpotMap = {
            [VehicleType.MOTORCYCLE]: [SpotType.MOTORCYCLE, SpotType.COMPACT, SpotType.LARGE],
            [VehicleType.CAR]: [SpotType.COMPACT, SpotType.LARGE],
            [VehicleType.TRUCK]: [SpotType.LARGE]
        }
        return vehicleToSpotMap[vehicle.type].includes(this.spotType);
    }

    isAvailable() {
        if (this.status === 'AVAILABLE') {
            return true
        }
        return false
    }

    removeVehicle() {
        this.vehicle = null
        this.status = SpotStatus.AVAILABLE
    }
}

class Vehicle {
    constructor(type, NumberPlate) {
        this.type = type
        this.NumberPlate = NumberPlate
        this.ticket = null
    }

    assignTicket(ticket) {
        this.ticket = ticket
    }
}

class Ticket {
    constructor(ticketNumber, vehicle, parkingSpot, entryTime) {
        this.ticketNumber = ticketNumber
        this.vehicle = vehicle
        this.parkingSpot = parkingSpot
        this.entryTime = entryTime || new Date()
        this.exitTime = null
        this.amount = 0
        this.isPaid = false
    }

    calculateAmount() {
        if (this.exitTime) {
            const calculatedAmount = this.exitTime - this.entryTime

            const rates = {
                MOTORCYCLE: 10,
                CAR: 20,
                TRUCK: 50
            }

            const baseRate = rates[this.vehicle.type] || 20
            this.amount = calculatedAmount * baseRate
        }
        return this.amount
    }

    markPaid() {
        this.isPaid = true
    }
}


class ParkingFloor {
    constructor(floorNumber) {
        this.floorNumber = floorNumber
        this.spots = []
        this.spotMap = new Map()
    }

    addSpot(spot) {
        // console.log('mmm', spot)
        this.spots.push(spot)
        this.spotMap.set(spot.spotNumber, spot)
    }

    findAvailableSpot(vehicleType) {
        // console.log('XXX', this.spots)
        return this.spots.find(spot => spot.isAvailable() && spot.isSuitableForVehicle({ type: vehicleType }))
    }

    getAvailableSpotsCount(vehicleType) {
        return this.spots.filter(spot => spot.isAvailable() && spot.isSuitableForVehicle({ type: vehicleType })).length
    }

    displayAvailability() {
        console.log(`Floor ${this.floorNumber}:`);
        console.log(`  Motorcycle spots: ${this.getAvailableSpotsCount(VehicleType.MOTORCYCLE)}`);
        console.log(`  Car spots: ${this.getAvailableSpotsCount(VehicleType.CAR)}`);
        console.log(`  Truck spots: ${this.getAvailableSpotsCount(VehicleType.TRUCK)}`);
    }
}


class ParkingLot {
    constructor() {
        if (ParkingLot.instance) {
            return ParkingLot.instance
        }
        this.floors = []
        this.tickets = new Map()
        this.vehicleMap = new Map()

        this.enterenceCounts = []
        ParkingLot.instance = this
    }

    static getInstance() {
        if (!ParkingLot.instance) {
            ParkingLot.instance = new ParkingLot()
        }

        return ParkingLot.instance
    }

    addFloor(floor) {
        this.floors.push(floor)
    }

    parkVehicle(vehicle, enterenceNumber = 1) {
        if (this.vehicleMap.has(vehicle.NumberPlate)) {
            const exisitingVehicle = this.vehicleMap.get(vehicle.NumberPlate)
            throw new Error(`Vehicle is already exisits with the number plate ${vehicle.NumberPlate}`);

        }

        const spot = this.findNearestAvailableSpot(vehicle.type)

        if (!spot) {
            throw new Error('No available spot for this vehicle type');
        }

        //Create Ticket
        const ticketNumber = this.generateTicketNumber()
        const ticket = new Ticket(ticketNumber, vehicle, spot)

        //Park Vehicle
        spot.parkVehicle(vehicle)
        vehicle.assignTicket(ticket)

        //Update records
        this.tickets.set(ticketNumber, ticket);
        this.vehicleMap.set(vehicle.licensePlate, vehicle)
            // console.log('MMM',)
        console.log(`Vehicle ${vehicle.NumberPlate} parked at Floor ${spot.floor}, Spot ${spot.spotNumber}`);
        return ticket;
    }

    unparkVehicle(ticketNumber) {
        const ticket = this.tickets.get(ticketNumber);
        if (!ticket) {
            throw new Error('Invalid ticket number');
        }

        if (ticket.exitTime) {
            throw new Error('Vehicle already exited');
        }

        // Calculate fee
        ticket.exitTime = new Date();
        const amount = ticket.calculateAmount();

        // Free up the spot
        ticket.parkingSpot.removeVehicle();

        // Remove from active vehicles
        this.vehicleMap.delete(ticket.vehicle.licensePlate);

        console.log(`Vehicle ${ticket.vehicle.licensePlate} exited. Amount: $${amount}`);
        return amount;
    }

    findNearestAvailableSpot(vehicleType) {
        // Simple nearest strategy: search floors in order
        // console.log('abc', this.floors)
        for (const floor of this.floors) {
            const spot = floor.findAvailableSpot(vehicleType);
            if (spot) return spot;
        }
        return null;
    }

    generateTicketNumber() {
        return `TKT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }

    displayAvailability() {
        console.log('\n=== Parking Lot Availability ===');
        this.floors.forEach(floor => floor.displayAvailability());
        console.log('==============================\n');
    }

    getTotalCapacity() {
        const capacity = {};
        Object.values(VehicleType).forEach(type => {
            capacity[type] = this.floors.reduce(
                (sum, floor) => sum + floor.getAvailableSpotsCount(type), 0
            );
        });
        return capacity;
    }

}



// Test the parking lot system
function testParkingLot() {
    // Create parking lot instance
    const parkingLot = ParkingLot.getInstance();

    // Create floors and spots
    const floor1 = new ParkingFloor(1);
    floor1.addSpot(new ParkingSpot('1A', SpotType.MOTORCYCLE, 1));
    floor1.addSpot(new ParkingSpot('1B', SpotType.COMPACT, 1));
    floor1.addSpot(new ParkingSpot('1C', SpotType.LARGE, 1));

    const floor2 = new ParkingFloor(2);
    floor2.addSpot(new ParkingSpot('2A', SpotType.MOTORCYCLE, 2));
    floor2.addSpot(new ParkingSpot('2B', SpotType.COMPACT, 2));
    floor2.addSpot(new ParkingSpot('2C', SpotType.LARGE, 2));

    parkingLot.addFloor(floor1);
    parkingLot.addFloor(floor2);

    // Display initial availability
    parkingLot.displayAvailability();

    // Test parking vehicles
    try {
        const car1 = new Vehicle(VehicleType.CAR, 'ABC123');
        const ticket1 = parkingLot.parkVehicle(car1);

        const car2 = new Vehicle(VehicleType.CAR, 'WB18AE7011');
        const ticket3 = parkingLot.parkVehicle(car2);

        const motorcycle1 = new Vehicle(VehicleType.MOTORCYCLE, 'MOTO1');
        const ticket2 = parkingLot.parkVehicle(motorcycle1);

        const motorcycle2 = new Vehicle(VehicleType.MOTORCYCLE, 'MOTO2');
        const ticket4 = parkingLot.parkVehicle(motorcycle2);

        parkingLot.displayAvailability();

        // Simulate time passing
        setTimeout(() => {
            try {
                const fee = parkingLot.unparkVehicle(ticket1.ticketNumber);
                console.log(`Paid amount: $${fee}`);
                parkingLot.displayAvailability();
            } catch (error) {
                console.error('Error during unpark:', error.message);
            }
        }, 1000);

    } catch (error) {
        console.error('Error:', error.message);
    }
}

// Run the test
testParkingLot();