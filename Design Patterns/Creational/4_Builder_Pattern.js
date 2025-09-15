/*

First, what is the Builder Pattern?
->Imagine you are building a burger at McDonald’s 🍔.
    ->Some people want only bun + patty.
    ->Some want bun + patty + cheese.
    ->Some want bun + patty + cheese + lettuce + tomato + extra sauce.

👉 If you create a separate class for each burger combination, you’ll have hundreds of classes (BurgerWithCheese, BurgerWithLettuce, BurgerWithEverything, etc.) — which is very messy.

👉 Instead, you want a step-by-step process to build the burger:
->Take a bun.
->Add patty.
->Optionally add cheese, tomato, lettuce, etc.
->Finally, serve it.


This step-by-step flexible object creation is called the Builder Design Pattern.
So, Builder Pattern helps create complex objects step by step instead of writing hundreds of constructors or classes.

*/

//Below code is demonstrat The Builder Design Pattern

// Product → Burger
class Burger {
    constructor() {
        this.bun = false;
        this.patty = false;
        this.cheese = false;
        this.lettuce = false;
        this.tomato = false;
    }

    describe() {
        console.log(`Burger with: 
            Bun: ${this.bun}, 
            Patty: ${this.patty}, 
            Cheese: ${this.cheese}, 
            Lettuce: ${this.lettuce}, 
            Tomato: ${this.tomato}`);
    }
}


// Builder → Step by step burger builder
class BurgerBuilder {
    constructor() {
        this.burger = new Burger()
    }

    addBun() {
        this.burger.bun = true
        return this
    }
    addPatty() {
        this.burger.patty = true;
        return this;
    }

    addCheese() {
        this.burger.cheese = true;
        return this;
    }

    addLettuce() {
        this.burger.lettuce = true;
        return this;
    }

    addTomato() {
        this.burger.tomato = true;
        return this;
    }

    build() {
        return this.burger;
    }
}

// Director → Waiter tells how to build
class Waiter {
    createCheeseBurger() {
        return new BurgerBuilder()
            .addBun()
            .addPatty()
            .addCheese()
            .build();
    }


    mmm() {
        return new BurgerBuilder()
            .addBun()
            .build()
    }
}



// Client code
let waiter = new Waiter()

const cheeseBurger = waiter.createCheeseBurger();
cheeseBurger.describe();

const abc = waiter.mmm();
abc.describe()