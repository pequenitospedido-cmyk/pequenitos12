import React from 'react';
import { Link } from 'react-router-dom';

export interface BreadcrumbItem {
  name: string;
  path?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items }) => {
  return (
    <nav aria-label="Breadcrumb" className="py-3 text-xs text-[#6E685F]">
      <ol className="flex items-center flex-wrap gap-1.5">
        <li>
          <Link to="/" className="hover:text-[#2D2A26] transition-colors">
            Inicio
          </Link>
        </li>
        {items.map((item, idx) => {
          const isLast = idx === items.length - 1;
          return (
            <React.Fragment key={item.name}>
              <li aria-hidden="true" className="text-[#6E685F]/60">
                /
              </li>
              <li>
                {item.path && !isLast ? (
                  <Link to={item.path} className="hover:text-[#2D2A26] transition-colors">
                    {item.name}
                  </Link>
                ) : (
                  <span className="text-[#2D2A26] font-medium" aria-current="page">
                    {item.name}
                  </span>
                )}
              </li>
            </React.Fragment>
          );
        })}
      </ol>
    </nav>
  );
};
