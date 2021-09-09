import { getCounter, increment, decrement } from "../main";

describe('Counter', () => {

    it('get counter', () => {
        expect(getCounter()).toBe(0, 'counter should be zero before any increment or decrement');
    });

    it('increment counter', () => {
        increment();
        expect(getCounter()).toBe(1, 'counter must be one after one increment');
    });

    it('decrement counter', () => {
        increment();
        decrement();
        expect(getCounter()).toBe(0, 'should be zero after one increment and one decrement');
    });
});