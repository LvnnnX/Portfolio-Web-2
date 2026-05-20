import type { ReactNode, TableHTMLAttributes } from "react";

interface EditorialTableProps extends TableHTMLAttributes<HTMLTableElement> {
  children: ReactNode;
}

export default function EditorialTable({ children, ...rest }: EditorialTableProps) {
  return (
    <table {...rest} className="editorial-table">
      {children}
    </table>
  );
}
