export interface ActionButton {
  label: string;
  action: (row: any) => any;
  visability: (row: any) => boolean;
  icon: string;
  color?:string
}
