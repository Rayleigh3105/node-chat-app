var expect = require('expect');

var { generateMessage, generateLocationMessage} = require('./message')

describe('generateMessage', () => {
    it('should generate correct message object', function () {
        var from = 'Modev';
        var text= 'Test text';
        var res = generateMessage( from, text );

        expect( res.from ).toBe( from );
        expect( res.text ).toBe( text )
        expect( res.createdAt).toBeA( 'number' );

    });
});


describe('generateLocationMessage', () => {
    it('should generate correct location message object', function () {
        var from = 'Modev';
        var lat = 2;
        var lng = 2;
        var url = `https://www.google.com/maps?q=${lat},${lng}`;
        var res = generateLocationMessage( from, lat, lng );

        expect( res.from ).toBe( from );
        expect( res.url).toBe( url )
        expect( res.createdAt).toBeA( 'number' );

    });
});

