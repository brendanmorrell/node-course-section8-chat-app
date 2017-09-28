/*[{
  id:,
  name:,
  room:
}]*/


//addUser(id, name, room)

//removeUser(id)

//getUser(id)

//getUserList(room)


class Users {
  constructor () {
    this.usersArray = [];
  }

  addUser (id, name, room) {
    let user = {id, name, room};
    this.usersArray.push(user);
    return user;
  }
  removeUser (id) {
    let user = this.usersArray.filter((user) => user.id === id)[0]
    if (user) {
      this.usersArray =this.usersArray.filter((user) => user.id !== id);
    }
    return user
  }
  getUser (id) {
    return this.usersArray.filter((user) => user.id === id)[0]
  }
  getUserList (room) {
    let users = this.usersArray.filter((user) => user.room === room);
    let namesArray = users.map((user) => user.name);

    return namesArray;
  }
}

module.exports = {Users}





/*class User {
  constructor (name, age) {
    this.name =name;
    this.age =age;
  }
  getUserDescription () {
    return (`${this.name} is ${this.age} year(s) old.`)
  }
};

var me = new User('Brendan' , 28)
var me2 = new User('Aidan' , 30)
console.log(me.getUserDescription(), me2.getUserDescription())*/
