"use client";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BadgeCheck, Search, Users } from "lucide-react";
import { api } from "@/lib/api";
import { formatDate } from "@/lib/utils";
import type { Me } from "@/types/api";
import { PageHeader, TableWrap, Td, Th } from "@/components/dashboard/parts";
import { useList } from "@/components/dashboard/data";
import { Avatar, RoleBadge } from "@/components/layout/user-menu";
import { Badge, EmptyState, ErrorState, Skeleton } from "@/components/ui/misc";
import { Input, Select } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/ui/pagination";

export default function AdminUsers() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [q, setQ] = useState("");
  const [role, setRole] = useState("");
  const qc = useQueryClient();
  useEffect(() => { const id = setTimeout(() => { setQ(search); setPage(1); }, 350); return () => clearTimeout(id); }, [search]);
  const list = useList<Me>("admin-users", "/admin/users", page, { search: q, role });
  const done = () => void qc.invalidateQueries({ queryKey: ["admin-users"] });
  const setRoleMut = useMutation({ mutationFn: (v: { id: string; role: string }) => api(`/admin/users/${v.id}/role`, { method: "PATCH", body: { role: v.role } }), onSuccess: () => { toast.success("User role updated"); done(); void qc.invalidateQueries({ queryKey: ["admin-stats"] }); }, onError: (e) => toast.error(e.message) });
  const verify = useMutation({ mutationFn: (v: { id: string; isVerified: boolean }) => api(`/admin/users/${v.id}/verify`, { method: "PATCH", body: { isVerified: v.isVerified } }), onSuccess: (_r, v) => { toast.success(v.isVerified ? "Tutor verified" : "Verification removed"); done(); }, onError: (e) => toast.error(e.message) });
  return (
    <>
      <PageHeader title="User management" description="Search users, change roles and verify tutors." />
      <div className="mb-5 flex flex-wrap gap-3">
        <div className="relative min-w-60 flex-1"><Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted" aria-hidden /><Input aria-label="Search users" placeholder="Search by name or email" value={search} onChange={(e) => setSearch(e.target.value)} className="pl-11" /></div>
        <Select aria-label="Filter by role" className="w-44" value={role} onChange={(e) => { setRole(e.target.value); setPage(1); }}><option value="">All roles</option><option value="student">Students</option><option value="tutor">Tutors</option><option value="admin">Admins</option></Select>
      </div>
      {list.isPending ? <Skeleton className="h-64" /> : list.isError ? <ErrorState message={list.error.message} onRetry={() => void list.refetch()} /> : list.data.items.length === 0 ? <EmptyState icon={<Users className="size-6" />} title="No users found" description="Try a different search or role filter." /> : (<>
        <TableWrap>
          <thead><tr><Th>User</Th><Th>Role</Th><Th>Plan</Th><Th>Joined</Th><Th>Change role</Th><Th className="text-right">Verification</Th></tr></thead>
          <tbody>
            {list.data.items.map((u) => (
              <tr key={u.id} className="hover:bg-surface/50">
                <Td><div className="flex items-center gap-3"><Avatar user={u} size={36} /><div><p className="font-medium">{u.name}</p><p className="text-xs text-muted">{u.email}</p></div></div></Td>
                <Td><RoleBadge role={u.role} /></Td>
                <Td><Badge tone={u.plan === "pro" ? "accent" : "neutral"} className="capitalize">{u.plan}</Badge></Td>
                <Td>{formatDate(u.createdAt)}</Td>
                <Td><Select aria-label={`Role for ${u.name}`} className="h-9 w-32 text-xs" value={u.role} disabled={setRoleMut.isPending} onChange={(e) => setRoleMut.mutate({ id: u.id, role: e.target.value })}><option value="student">student</option><option value="tutor">tutor</option><option value="admin">admin</option></Select></Td>
                <Td className="text-right">{u.role === "tutor" ? <Button size="sm" variant={u.isVerified ? "accent" : "outline"} onClick={() => verify.mutate({ id: u.id, isVerified: !u.isVerified })} disabled={verify.isPending}><BadgeCheck className="size-4" />{u.isVerified ? "Verified" : "Verify"}</Button> : <span className="text-xs text-muted">—</span>}</Td>
              </tr>
            ))}
          </tbody>
        </TableWrap>
        <div className="mt-6"><Pagination meta={list.data.meta} onChange={setPage} /></div>
      </>)}
    </>
  );
}
