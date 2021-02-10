import 'reflect-metadata';
import { Serde } from "src/serde";
import { Strong } from 'src/decorators';

class StrongTestModel extends Serde<StrongTestModel> {
    name: string;
    date: Date;
    @Strong('string') description: string;
}

class TestModel extends Serde<TestModel> {
    key: string;
    value: string;
}

class NestedStrongTestModel extends Serde<NestedStrongTestModel> {
    name: string;
    @Strong(TestModel) nested: TestModel;
}

describe('@Strong() Decorator', () => {
    describe('simple strong model', () => {
        it('should set value nicely', () => {
            const testData: any = {
                name: 'test model',
                description: 'this is a test model',
            }
            expect(() => {
                new StrongTestModel().deserialize(testData)
            }).not.toThrow();
            expect(new StrongTestModel().deserialize(testData).description).toBe('this is a test model');
        });
    
        it('should throw', () => {
            const testData: any = {
                name: 'test model',
                description: 1234,
            }
            expect(() => {
                new StrongTestModel().deserialize(testData)
            }).toThrow('Strong Type mismatch');
        });
    });

    describe('nested strong model', () => {
        it('should set value nicely', () => {
            const testData: any = {
                name: 'test model',
                nested: new TestModel().deserialize({ key: 'foo', value: 'bar' })
            }
            expect(() => {
                new NestedStrongTestModel().deserialize(testData)
            }).not.toThrow();
            expect(new NestedStrongTestModel().deserialize(testData).name).toBe('test model');
        });
    
        it('should throw', () => {
            const testData: any = {
                name: 'test model',
                nested: false
            }
            expect(() => {
                new StrongTestModel().deserialize(testData)
            }).toThrow('Strong Type mismatch');
        });
    })
});