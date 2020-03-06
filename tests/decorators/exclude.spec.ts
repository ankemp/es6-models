import 'reflect-metadata';
import { Serde } from "src/serde";
import { Exclude } from 'src/decorators';

class ExcludeTestModel extends Serde<ExcludeTestModel> {
    name: string;
    date: Date;
    description: string;
    @Exclude() frontendField: string;
}

describe('@Exclude() Decorator', () => {
    it('should remove properties marked during serialize', () => {
        const testModel = new ExcludeTestModel().deserialize({
            name: 'test model',
            description: 'this is a test model',
            frontendField: 'test field'
        });
        const serializedModel = testModel.serialize();
        expect(serializedModel).toEqual({ name: 'test model', description: 'this is a test model' });
    });
});