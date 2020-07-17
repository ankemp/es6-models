import 'reflect-metadata';
import { Serde } from "src/serde";
import { Exclude } from 'src/decorators';

class NestedModel extends Serde<NestedModel> {
    name: string;
    @Exclude() excluded: boolean;
}

class ParentModel extends Serde<ParentModel> {
    name: string;
    nested: NestedModel;
    @Exclude() excluded: boolean;
}

describe('Custom serlializer', () => {
    it('should run custom seiralizer once', () => {
        const testModel = new ParentModel().deserialize({
            name: 'parent model',
            excluded: true,
            nested: new NestedModel().deserialize({
                name: 'nested model',
                excluded: true
            })
        });
        
        const serializedModel = testModel.serialize();
        expect(serializedModel).toEqual({ name: 'parent model', nested: { name: 'nested model' } });
    });
});