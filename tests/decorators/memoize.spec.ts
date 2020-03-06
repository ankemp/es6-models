import 'reflect-metadata';
import { Serde } from "src/serde";
import { Memoize } from 'src/decorators';

class MemoizeTestModel extends Serde<MemoizeTestModel> {
    name: string;
    @Memoize() doNameRandom(): string {
        return this.name + (Math.random() * 10);
    }
}

describe('@Memoize() Decorator', () => {
    it('should remember...', () => {
        const testModel = new MemoizeTestModel().deserialize({
            name: 'test model',
        });
    
        const result1 = testModel.doNameRandom();
        const result2 = testModel.doNameRandom();
        expect(result1).toBe(result2);
    });
});