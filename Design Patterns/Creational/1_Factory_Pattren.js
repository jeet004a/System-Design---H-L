/*

1️⃣ What is a Factory Pattern?
->Think of a factory in real life.
->Imagine a car factory. You don’t make the car yourself; you tell the factory what type of car you want (sedan, SUV, truck), and the factory gives it to you.
->You don’t need to know how the car is built internally. You just request it, and you get the product.

In programming, a factory pattern works the same way: it creates objects for you without you needing to know the details of how they are created.

2️⃣ Why use it?
->You don’t want to write a lot of if-else or switch statements everywhere to create objects.
->You want a single place to create objects and decide which type to create based on input.
->Makes your code easier to maintain and extend.

*/




//Below code is demonstrat The Factory Pattern
class SendSms {
    send(message) {
        console.log(`Sms send :- ${message}`)
    }
}

class EmailNotification {
    send(message) {
        console.log(`Email Notification send :- ${message}`)
    }
}
class PushNotification {
    send(message) {
        console.log(`Push Notificaton send :- ${message}`)
    }
}

class main {
    static SendNotification(type) {
        if (type == 'SMS') return new SendSms()
        if (type == 'EMAIL') return new EmailNotification()
        if (type == 'PUSH') return new PushNotification()
        throw new Error("Unknown notification type")
    }
}

let a = main.SendNotification('PUSH')
a.send('Hello')