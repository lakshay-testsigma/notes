import { Fragment } from "react";
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export interface Crumb {
  label: string;
  href: string;
}

// Deep paths collapse the middle, keeping the domain pinned:
// Notes › Data Science › … › Parent › Current.
const MAX_VISIBLE = 5;

export function NoteBreadcrumb({ crumbs, className }: { crumbs: Crumb[]; className?: string }) {
  const collapsed = crumbs.length > MAX_VISIBLE;
  const visible = collapsed
    ? [...crumbs.slice(0, 2), ...crumbs.slice(crumbs.length - 2)]
    : crumbs;

  return (
    <Breadcrumb className={className}>
      <BreadcrumbList className="text-xs">
        {visible.map((crumb, i) => {
          const isLast = i === visible.length - 1;
          const showEllipsis = collapsed && i === 2;
          return (
            <Fragment key={crumb.href}>
              {showEllipsis && (
                <>
                  <BreadcrumbItem>
                    <BreadcrumbEllipsis />
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                </>
              )}
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage className="max-w-56 truncate">{crumb.label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink render={<Link href={crumb.href} />}>{crumb.label}</BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {!isLast && <BreadcrumbSeparator />}
            </Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
