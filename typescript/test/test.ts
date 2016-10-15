import {ViewModel} from '../viewmodel';

describe('Our awesome test', () => {
    it('tests something completely non-sense', () => {
        let expected = ['Hello', 'World'];
        expect(new ViewModel().words()).toEqual(expected);
    });
});