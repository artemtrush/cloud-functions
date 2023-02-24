const { main } = require('./index');

const req = {
    headers: {
        token: '1234'
    },
    body: {
        text: 'Test text',
        comment: 'Test comment',
        title: 'Test title - aaaa bbbb, cccc "dddd. eeee $ffff gggg hhhh',
        url: 'https://test.com/url',
        createdAt: 'February 19, 2023 at 10:16AM'
    }
};

const res = {
    status(status) {
        console.log({ status });
        return this;
    },
    send(message) {
        console.log({ message });
        return this;
    }
};

main(req, res);