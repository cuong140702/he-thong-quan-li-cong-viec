"use client";

import { useSearchParams } from "next/navigation";
import { Link, useRouter } from "@/i18n/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
} from "./ui/pagination";
import { Button } from "./ui/button";

const RANGE = 2;

interface Props {
  pageSize: number;
  pathname?: string;
  isLink?: boolean;
  onClick?: (pageNumber: number) => void;
}

export default function AutoPagination({
  pageSize,
  pathname = "/",
  isLink = true,
  onClick = () => {},
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [page, setPage] = useState(1);

  useEffect(() => {
    const pageFromUrl = Number(searchParams.get("page")) || 1;
    setPage(pageFromUrl);
  }, [searchParams]);

  const handlePageChange = (pageNumber: number) => {
    if (pageNumber < 1 || pageNumber > pageSize) return;
    setPage(pageNumber);
    if (!isLink) onClick(pageNumber);
    router.push(`${pathname}?page=${pageNumber}`);
  };

  const renderPagination = () => {
    let dotAfter = false;
    let dotBefore = false;

    const renderDotBefore = () => {
      if (!dotBefore) {
        dotBefore = true;
        return (
          <PaginationItem key={`dot-before-${Math.random()}`}>
            <PaginationEllipsis />
          </PaginationItem>
        );
      }
      return null;
    };

    const renderDotAfter = () => {
      if (!dotAfter) {
        dotAfter = true;
        return (
          <PaginationItem key={`dot-after-${Math.random()}`}>
            <PaginationEllipsis />
          </PaginationItem>
        );
      }
      return null;
    };

    return Array.from({ length: pageSize }, (_, index) => {
      const pageNumber = index + 1;

      if (
        page <= RANGE * 2 + 1 &&
        pageNumber > page + RANGE &&
        pageNumber < pageSize - RANGE + 1
      ) {
        return renderDotAfter();
      } else if (page > RANGE * 2 + 1 && page < pageSize - RANGE * 2) {
        if (pageNumber < page - RANGE && pageNumber > RANGE) {
          return renderDotBefore();
        } else if (
          pageNumber > page + RANGE &&
          pageNumber < pageSize - RANGE + 1
        ) {
          return renderDotAfter();
        }
      } else if (
        page >= pageSize - RANGE * 2 &&
        pageNumber > RANGE &&
        pageNumber < page - RANGE
      ) {
        return renderDotBefore();
      }

      return (
        <PaginationItem key={pageNumber}>
          {isLink ? (
            <Link
              href={`${pathname}?page=${pageNumber}`}
              className={cn(
                "flex items-center justify-center w-9 h-9 rounded-md text-sm",
                pageNumber === page
                  ? "border border-border bg-accent font-medium"
                  : "hover:bg-accent"
              )}
            >
              {pageNumber}
            </Link>
          ) : (
            <Button
              onClick={() => handlePageChange(pageNumber)}
              variant={pageNumber === page ? "outline" : "ghost"}
              className="w-9 h-9 p-0"
            >
              {pageNumber}
            </Button>
          )}
        </PaginationItem>
      );
    });
  };

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          {isLink ? (
            <Link
              href={`${pathname}?page=${page - 1}`}
              className={cn(
                "flex items-center px-2 h-9 text-sm rounded-md",
                page === 1 ? "cursor-not-allowed opacity-50" : "hover:bg-accent"
              )}
              onClick={(e) => {
                if (page === 1) e.preventDefault();
              }}
            >
              <ChevronLeft className="w-5 h-5 mr-1" />
              Previous
            </Link>
          ) : (
            <Button
              disabled={page === 1}
              className="h-9 p-0 px-2"
              variant="ghost"
              onClick={() => handlePageChange(page - 1)}
            >
              <ChevronLeft className="w-5 h-5" />
              Previous
            </Button>
          )}
        </PaginationItem>

        {renderPagination()}

        <PaginationItem>
          {isLink ? (
            <Link
              href={`${pathname}?page=${page + 1}`}
              className={cn(
                "flex items-center px-2 h-9 text-sm rounded-md",
                page === pageSize
                  ? "cursor-not-allowed opacity-50"
                  : "hover:bg-accent"
              )}
              onClick={(e) => {
                if (page === pageSize) e.preventDefault();
              }}
            >
              Next
              <ChevronRight className="w-5 h-5 ml-1" />
            </Link>
          ) : (
            <Button
              disabled={page === pageSize}
              className="h-9 p-0 px-2"
              variant="ghost"
              onClick={() => handlePageChange(page + 1)}
            >
              Next
              <ChevronRight className="w-5 h-5" />
            </Button>
          )}
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
