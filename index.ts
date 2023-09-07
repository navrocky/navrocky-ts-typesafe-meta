interface MyIface {
  name?: string;
  hello(name: string): boolean;
}

interface Type {
  description?: string;
}

interface StringType<T extends string> extends Type {
  type: 'string';
  // optional:
}

interface BooleanType extends Type {
  type: 'boolean';
}

interface FunctionType<T extends (...args: any) => any> {
  type: 'function';
  description?: string;
  parameters: Parameters<T>;
  return: AutoType<ReturnType<T>>;
}

type AutoType<T> = T extends boolean
  ? BooleanType
  : T extends string
  ? StringType<T>
  : T extends (...args: any) => any
  ? FunctionType<T>
  : never;

interface IfaceType<T> extends Type {
  name: string;
  description?: string;
  properties: { [P in keyof Required<T>]: AutoType<T[P]> };
}

const MyIfaceMeta: IfaceType<MyIface> = {
  name: 'MyIface',
  properties: {
    name: {
      type: 'string',
    },
    hello: {
      type: 'function',
      parameters: ['asd'],
      return: {
        type: 'boolean',
      },
    },
  },
};
