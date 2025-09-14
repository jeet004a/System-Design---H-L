/*

🌟 What is Abstract Factory Pattern?
It’s a design pattern in programming.
-> Purpose: To create families of related objects without specifying the exact class of the object.
-> Think of it like a factory that makes other factories, each producing a set of related items.

🏠 Real-Life Analogy
Imagine you go to a furniture shop:
1. You choose a Modern Furniture Factory → it gives you:
    1. A modern chair
    2. A modern sofa
    3. A modern coffee table

2. You choose a Victorian Furniture Factory → it gives you:
    1. A Victorian chair
    2. A Victorian sofa
    3. A Victorian coffee table

✅ You don’t care about how each chair or sofa is made, you just get a matching set from the factory.

*/

//Class Abstract Factory
class FurnitureFactory {
    createSofa() {}
    createChair() {}
}

// Step 2: Concrete Factories
class ModernFurnitureFactory extends FurnitureFactory {
    createChair() {
        return new ModernChair()
    }
    createSofa() {
        return new ModernSofa()
    }

}

class VictorianFurnitureFactory extends FurnitureFactory {
    createChair() {
        return new VictorianChair()
    }

    createSofa() {
        return new VictorianSofa()
    }
}

// Step 3: Products
class ModernChair {
    sit() {
        console.log('Sitting on a modern chair')
    }
}


class ModernSofa {
    lie() {
        console.log('Lying on a modern sofa')
    }
}

class VictorianChair {
    sit() {
        console.log('Sitting on a Victorian chair')
    }
}


class VictorianSofa {
    lie() {
        console.log('Lying on a Victorian sofa')
    }
}

// Step 4: Client code
function client(factory) {
    let chair = factory.createChair()
    let sofa = factory.createSofa()

    chair.sit()
    sofa.lie()
}

// Using the factories
client(new ModernFurnitureFactory());

client(new VictorianFurnitureFactory());