const mocks = {
    ...jest.requireActual('@mickenhosrecipes/common'),
    natsWrapper: {
        client: {
            publish: jest
                .fn()
                .mockImplementation(
                    (subject: string, data: string, callback: () => void) => {
                        callback();
                    }
                )
        }
    }
};

module.exports = mocks;