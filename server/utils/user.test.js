const expect = require('expect');
const { Users } = require('./users');

describe('Users', () => {
    var users;

    beforeEach( () => {
       users = new Users();
       users.users = [{
           id: '1',
           name: 'Mike',
           room: 'Room1'
       },{
           id: '2',
           name: 'Jen',
           room: 'Room2'
       },{
           id: '3',
           name: 'Julie',
           room: 'Room1'
       }
       ]
    });


    it('should add new user', function () {
        var users = new Users();
        var user = {
            id: '123',
            name: 'Moritz',
            room: 'Room test'
        };

        var res = users.addUser( user.id, user.name, user.room );

        expect( users.users).toEqual( [user] );
    });

    it('should remove a user', function () {
        var userId = '2';

        var user = users.removeUser( userId );

        expect( user.id ).toBe( userId );
        expect( users.users.length ).toBe( 2 );
    });

    it('should not remove a user', function () {
        var userId = '99';

        var user = users.removeUser( userId );

        expect( user ).toNotExist();
        expect( users.users.length ).toBe( 3 );
    });

    it('should find user', function () {
        var userId = '2';
        var user = users.getUser( userId );

        expect( user.id ).toBe( userId )
    });

    it('should not find user', function () {
        var userId = '4';
        var user = users.getUser( userId );

        expect( user ).toNotExist();
    });

    it('should return names for Room1', function () {
        var userList = users.getUserList( 'Room1' );

        expect( userList ).toEqual(['Mike','Julie'])
    });

    it('should return names for Room2', function () {
        var userList = users.getUserList( 'Room2' );

        expect( userList ).toEqual(['Jen'])
    });
})
