import React, { ReactNode } from "react";

interface TableProps {
  headers?: string[];
  rows?: ReactNode[][];
}

export const RowTable = ({ headers, rows }: TableProps) => {
  return (
    <div className="overflow-x-auto">
      <table className="table">
        {headers ? (
          <thead>
            <tr>
              {headers.map((child, index) => (
                <th key={index}>{child}</th>
              ))}
            </tr>
          </thead>
        ) : null}
        {rows ? (
          <tbody>
            {rows.map((row, index) => (
              <tr className="hover" key={index}>
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        ) : null}
      </table>
    </div>
  );
};
