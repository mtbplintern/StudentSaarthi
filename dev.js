class user1 {
name="abc";
age=20
}

let u1 = new user1

// console.log(u1);


class user2 {
    constructor(name , age) {
        this.name = name
        this.age = age
        
    }
    greet(){

        console.log(this.name);
    }

}

let u2 = new user2("sam" ,10)
let u3 = new user2("ram" ,10)

u2.greet();
