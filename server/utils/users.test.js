const expect = require('expect');
const {Users} = require('./users.js');








describe('Users', () => {
  let users;
  beforeEach(() => {
    users = new Users();
    users.usersArray = [{
      id: 1,
      name: 'Mike',
      room: 'Node Course'
    }, {
      id: 2,
      name: 'Jen',
      room: 'React Course'
    }, {
      id: 3,
      name: 'Dan',
      room: 'Node Course'
    }];
  });

  it('should add new user', () => {
    let users = new Users();
    let user = {
      id: 123,
      name: 'Brendan',
      room: 'room25'
    };
    let resUser = users.addUser(user.id, user.name, user.room);
    expect(users.usersArray).toEqual([user]);
  });

  it('should return names for node course', () => {
    let userList1 = users.getUserList('Node Course');
    let userList2 = users.getUserList('React Course');
    expect(userList1).toEqual(['Mike', 'Dan']);
    expect(userList2).toEqual(['Jen']);
  });

  it('should remove a user if user exists', () => {
    let userId = 2;
    let user = users.removeUser(userId);


    expect(user.id).toBe(userId);
    expect(users.usersArray.length).toBe(2);
  });

  it('should not remove user if user doesnt exist', () => {
    let userId = 99;
    let user = users.getUser(userId)
    expect(user).toBeFalsy();
        expect(users.usersArray.length).toBe(3);
  });

  it('should find user', () => {
    let userId = 3
    let user = users.getUser(userId);
    expect(user.id).toEqual(userId);
    expect(user.name).toEqual('Dan');
    expect(user.room).toEqual('Node Course');
  });

  it('should not find user if id does not exist' , () => {

  });
});
