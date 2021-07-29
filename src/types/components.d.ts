export interface ITableColumn {
  label: string;
  accessor?: string;
  render?: (obj: GenericObject) => React.ReactNode;
  sortFunc?: (a: any, b: any) => number;
  noSort?: boolean;
  wide?: boolean;
  narrow?: boolean;
  leftAlign?: boolean;
}
