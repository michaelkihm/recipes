import { connect } from 'mongoose';

const testDBPath = 'mongodb://root:rootpassword@localhost:27017/admin';

describe('Recipes Routes',() => {

    beforeAll((done) => {

        connect(testDBPath)
            .then(() => {
                console.log('Connected to Database');
                done();
            })
            .catch(err => console.log(err));
    });

    it('should run like thia',() => {
        expect(1).toBe(2);
    });
});