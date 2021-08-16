export interface IFieldOption {
  label: string;
  value: string;
}

export interface IFormField {
  name: string;
  schema: yup.BaseSchema;
  load: (source: any) => any;
  defaultValue: any;
  rFieldValue: (param: string) => RecoilState<any>;
  options?: IFieldOption[];
  fieldProps?: Record<string, any>;
}
