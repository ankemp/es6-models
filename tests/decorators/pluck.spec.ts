import 'reflect-metadata';
import { Serde } from "src/serde";
import { Pluck } from 'src/decorators';

class PluckArrayTestModel extends Serde<PluckArrayTestModel> {
    name: string;
    @Pluck(['id']) nestedProperties: { id: number, name: string }[];
}

class PluckArrayTestTwoModel extends Serde<PluckArrayTestTwoModel> {
    name: string;
    @Pluck('id') nestedProperties: { id: number, name: string }[];
}

class PluckObjectTestModel extends Serde<PluckObjectTestModel> {
    name: string;
    @Pluck(['id']) nestedProperty: { id: number, name: string };
}

class PluckObjectTestTwoModel extends Serde<PluckObjectTestTwoModel> {
    name: string;
    @Pluck('id') nestedProperty: { id: number, name: string };
}

describe('@Pluck() Decorator', () => {
    it('should pluck \'id\' (property: T[]) from marked property during serialize', () => {
      const testModel = new PluckArrayTestModel().deserialize({
        name: 'test model',
        nestedProperties: [
          { id: 1, name: 'one' },
          { id: 2, name: 'two' }
        ]
      });

      const serializedModel = testModel.serialize();
      expect(serializedModel).toEqual({ name: 'test model', nestedProperties: [{ id: 1 }, { id: 2 }] });
    });

    it('should pluck \'ids\' (property: number[]) from marked property during serialize', () => {
      const testModel = new PluckArrayTestTwoModel().deserialize({
        name: 'test model',
        nestedProperties: [
          { id: 1, name: 'one' },
          { id: 2, name: 'two' }
        ]
      });

      const serializedModel = testModel.serialize();
      expect(serializedModel).toEqual({ name: 'test model', nestedProperties: [1, 2] });
    });

    it('should pluck \'id\' (property: {k: v}) from marked property during serialize', () => {
      const testModel = new PluckObjectTestModel().deserialize({
        name: 'test model',
        nestedProperty: { id: 2, name: 'two' }
      });

      const serializedModel = testModel.serialize();
      expect(serializedModel).toEqual({ name: 'test model', nestedProperty: { id: 2 } });
    });

    it('should pluck \'id\' property: value from marked property during serialize', () => {
      const testModel = new PluckObjectTestTwoModel().deserialize({
        name: 'test model',
        nestedProperty: { id: 2, name: 'two' }
      });

      const serializedModel = testModel.serialize();
      expect(serializedModel).toEqual({ name: 'test model', nestedProperty: 2 });
    });
  });