/*

🌟 What is Singleton Pattern?
It’s a design pattern in programming.
Purpose: To make sure there is only one object (instance) of a class throughout the program.
And → give everyone a way to access that one object.


🏠 Real-Life Analogy

Imagine your house:
->You have one electricity meter.
->Everyone in the house uses the same meter.
->You can’t have multiple meters for each person, otherwise the bill would be a mess.

👉 That one meter = Singleton.
*/


//Below code is demonstrat The Singleton Pattern

let instance

class check {
    constructor() {
        if (instance) {
            throw new Error('Instance is already created !')
        }

        instance = this

        this.bag = []
    }

    getBag() {
        console.log(`Total itmes ${this.bag}`)
    }

    addList(item) {
        this.bag.push(item)
    }
}


let s1 = new check()
s1.addList('A')
s1.getBag()

let s2 = new check()
s2.addList('A')
s2.getBag()