import 'reflect-metadata';
import { Serde } from "src/serde";
import { Memoize } from 'src/decorators';

class MemoizeTestModel extends Serde<MemoizeTestModel> {
    name: string;
    @Memoize() doNameRandom(): string {
        return this.name + (Math.random() * 10);
    }
}

class MemoizeArgsTestModel extends Serde<MemoizeTestModel> {
    name: string;
    @Memoize() doNameRandom(t: string): string {
        return this.name + t + (Math.random() * 10);
    }
}

class MemoizePropsToWatchTestModel extends Serde<MemoizePropsToWatchTestModel> {
    name: string;
    desc: string
    @Memoize(['name']) doNameRandom(): string {
        return this.name + (Math.random() * 10);
    }
}

class MemoizePropsToWatchArgsTestModel extends Serde<MemoizePropsToWatchTestModel> {
    name: string;
    desc: string
    @Memoize(['name']) doNameRandom(t: string): string {
        return this.name + t + (Math.random() * 10);
    }
}


describe('@Memoize() Decorator', () => {
    it('should remember, no args or propsToWatch', () => {
        const testModel = new MemoizeTestModel().deserialize({
            name: 'test model',
        });
    
        const result1 = testModel.doNameRandom();
        const result2 = testModel.doNameRandom();
        expect(result1).toBe(result2);
    });

    it('should remember with args, no propsToWatch', () => {
        const testModel = new MemoizeArgsTestModel().deserialize({
            name: 'test model',
        });
    
        const result1 = testModel.doNameRandom('t');
        const result1a = testModel.doNameRandom('t');
        const result2 = testModel.doNameRandom('r');
        expect(result1).toBe(result1a);
        expect(result1).not.toBe(result2);
    });

    it('should remember with propsToWatch, no args', () => {
        const testModel = new MemoizePropsToWatchTestModel().deserialize({
            name: 'test model',
            desc: 'this is a desc'
        });

        const result1 = testModel.doNameRandom();
        testModel.desc = 'this is a desc updated'
        const result2 = testModel.doNameRandom();
        testModel.name = 'test model updated';
        const result1a = testModel.doNameRandom();
        expect(result1).toBe(result2);
        expect(result1).not.toBe(result1a);
    });

    it('should remember with propsToWatch, and args', () => {
        const testModel = new MemoizePropsToWatchArgsTestModel().deserialize({
            name: 'test model',
            desc: 'this is a desc'
        });

        const result1 = testModel.doNameRandom('t');
        const result1a = testModel.doNameRandom('t');
        testModel.desc = 'this is a desc updated'
        const result2 = testModel.doNameRandom('r');
        testModel.name = 'test model updated';
        const result1b = testModel.doNameRandom('t');
        expect(result1).not.toBe(result2);
        expect(result1).toBe(result1a);
        expect(result1).not.toBe(result1b);
    });
});