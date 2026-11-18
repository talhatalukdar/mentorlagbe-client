"use client";
import { useState } from "react";
import { CircleDollarSign } from "lucide-react";
import { formatDate } from "@/lib/utils";
import type { Payment } from "@/types/api";
import { PageHeader, TableWrap, Td, Th } from "@/components/dashboard/parts";
import { useList } from "@/components/dashboard/data";
import { RoleBadge } from "@/components/layout/user-menu";
import { Badge, EmptyState, ErrorState, Skeleton } from "@/components/ui/misc";
import { Pagination } from "@/components/ui/pagination";

export default function AdminTransactions() {
  const [page, setPage] = useState(1);
  const list = useList<Payment>("admin-transactions", "/admin/transactions", page);
  return (
    <>
      <PageHeader title="Transactions" description="Pro subscription payments recorded from Stripe." />
      {list.isPending ? <Skeleton className="h-64" /> : list.isError ? <ErrorState message={list.error.message} onRetry={() => void list.refetch()} /> : list.data.items.length === 0 ? <EmptyState icon={<CircleDollarSign className="size-6" />} title="No transactions yet" description="Completed Stripe subscriptions will be listed here." /> : (<>
        <TableWrap>
          <thead><tr><Th>User</Th><Th>Role</Th><Th>Plan</Th><Th>Amount</Th><Th>Transaction ID</Th><Th>Status</Th><Th>Paid</Th></tr></thead>
          <tbody>
            {list.data.items.map((p) => (
              <tr key={p._id} className="hover:bg-surface/50">
                <Td><p className="font-medium">{p.userName}</p><p className="text-xs text-muted">{p.userEmail}</p></Td>
                <Td><RoleBadge role={p.userRole} /></Td>
                <Td>{p.planName}</Td>
                <Td className="font-semibold">{p.currency === "USD" ? "$" : `${p.currency} `}{p.amount.toFixed(2)}</Td>
                <Td className="max-w-[10rem]"><span className="block truncate font-mono text-xs" title={p.transactionId}>{p.transactionId}</span></Td>
                <Td><Badge tone="success">{p.paymentStatus}</Badge></Td>
                <Td>{formatDate(p.paidAt)}</Td>
              </tr>
            ))}
          </tbody>
        </TableWrap>
        <div className="mt-6"><Pagination meta={list.data.meta} onChange={setPage} /></div>
      </>)}
    </>
  );
}
