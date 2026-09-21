"use client";

import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { KeywordStatus } from "@/lib/schema/analysis";

type KeywordTableProps = {
  keywords: KeywordStatus[];
  limit?: number;
};

function statusBadge(status: KeywordStatus["status"]) {
  switch (status) {
    case "present":
      return <Badge variant="secondary">Present</Badge>;
    case "added":
      return <Badge className="bg-amber-600/20 text-amber-300 hover:bg-amber-600/20">Added</Badge>;
    case "missing":
      return <Badge variant="destructive">Missing</Badge>;
  }
}

export function KeywordTable({ keywords, limit }: KeywordTableProps) {
  const rows = limit ? keywords.slice(0, limit) : keywords;

  if (rows.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">No keywords extracted from job description.</p>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Keyword</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="hidden sm:table-cell">Location</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((kw) => (
            <TableRow key={`${kw.term}-${kw.priority}`}>
              <TableCell className="font-medium">{kw.term}</TableCell>
              <TableCell>
                <Badge variant="outline">{kw.priority}</Badge>
              </TableCell>
              <TableCell>{statusBadge(kw.status)}</TableCell>
              <TableCell className="hidden text-muted-foreground sm:table-cell">
                {kw.location ?? "—"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
