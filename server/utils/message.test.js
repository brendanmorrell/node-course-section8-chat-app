const expect = require('expect');

const {generateMessage, generateLocationMessage} = require('./message.js');

describe('generateMessage', () => {
  it('should generate the correct message object', () =>{
    let from = 'brendan';
    let text = 'message text';
    let message = generateMessage(from, text);
    expect(typeof message).toBe('object');
    expect(message.from).toBe(from);
    expect(message.text).toBe(text);
    expect(message.createdAt).toBeTruthy();
    expect(typeof message.createdAt).toBe('number');
    expect(message).toMatchObject({from, text});
  });
});

describe ('generateLocationMessage', () => {
  it('should generate correct location object', () => {
    let from ='Brendan'
    let longitude = '12'
    let latitude = '10'
    let url = `https://www.google.com/maps?q=10,12`
    let locationMessage = generateLocationMessage(from, latitude, longitude);
    expect(locationMessage).toMatchObject({from, url});
    expect(typeof locationMessage.createdAt).toBe('number');
  });
});
