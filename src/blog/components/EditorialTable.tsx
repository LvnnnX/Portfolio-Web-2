import type { ReactElement, TableHTMLAttributes } from "react";
export function EditorialTable(props: TableHTMLAttributes<HTMLTableElement>): ReactElement {
  return <div className="editorial-table-wrap"><table {...props} className="editorial-table" /></div>;
}
