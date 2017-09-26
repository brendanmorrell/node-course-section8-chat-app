const expect = require('expect');

const {generateMessage} = require('./message.js');

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
  })
})
