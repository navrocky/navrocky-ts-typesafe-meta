type OptionalType<T, True, False> = [T] extends [{}] ? False : True;

type OptionalPart = {
  optional: true;
};

type RequiredPart = {
  optional?: false;
};

type BaseTypePart = {
  type: string;
  description?: string;
};

type Type<T> = BaseTypePart & OptionalType<T, OptionalPart, RequiredPart>;

type StringType<T> = Type<T> & {
  type: 'string';
};

type BooleanType<T> = Type<T> & {
  type: 'boolean';
};

type NumberType<T> = Type<T> & {
  type: 'number';
};

type MapToAutoType<T> = {
  [P in keyof T]-?: AutoType<T[P]>;
};

type FunctionType<T extends (...args: any) => any> = Type<T> & {
  type: 'function';
  description?: string;
  parameters: MapToAutoType<Parameters<T>>;
  return: AutoType<ReturnType<T>>;
};

type AutoType<T> = T extends boolean
  ? BooleanType<T>
  : T extends number
  ? NumberType<T>
  : T extends string
  ? StringType<T>
  : T extends (...args: any) => any
  ? FunctionType<T>
  : T extends {}
  ? IfaceType<T>
  : never;

type IfaceType<T> = Type<T> & {
  name: string;
  type: 'interface';
  description?: string;
  properties: { [P in keyof T]: AutoType<T[P]> };
};

////////////////////////////////////////////////////////////////////////////////////////

interface InnerIface {
  flag: boolean;
}

interface MyIface {
  surname: string | undefined;
  inner: InnerIface;
  hello(name: string, age?: number): boolean;
}

const InnerIfaceMeta: IfaceType<InnerIface> = {
  name: 'InnerIface',
  type: 'interface',
  properties: {
    flag: {
      type: 'boolean',
    },
  },
};

const Str: StringType<string> = { type: 'string' };
const Bool: BooleanType<boolean> = { type: 'boolean' };
const Num: NumberType<number> = { type: 'number' };

const MyIfaceMeta: IfaceType<MyIface> = {
  name: 'MyIface',
  type: 'interface',
  properties: {
    surname: Str,
    hello: {
      type: 'function',
      parameters: [Str, Num],
      return: Bool,
    },
    inner: InnerIfaceMeta,
  },
};

type T1 = OptionalType<string | undefined, true, false>;
type T2 = OptionalType<string, true, false>;
