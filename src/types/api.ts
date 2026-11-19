export type Role = "student" | "tutor" | "admin";
export type ApprovalStatus = "pending" | "approved" | "rejected";
export type ApplicationStatus = "pending" | "accepted" | "rejected";

export interface PageMeta {
  page: number; limit: number; total: number; totalPages: number; hasNextPage: boolean; hasPreviousPage: boolean;
}
export interface ApiResponse<T> { success: boolean; message: string; data: T; meta?: PageMeta }

export interface Me {
  id: string; name: string; email: string; image: string | null; role: Role; plan: "free" | "pro";
  phone: string; bio: string; location: string; subjects: string[]; education: string; experience: string;
  hourlyRate: number | null; availability: string; isVerified: boolean; createdAt: string;
}
export interface Tuition {
  _id: string; title: string; subject: string; classLevel: string; mode: "Online" | "Offline"; location: string;
  monthlyFee: number; daysPerWeek: number; bannerImage: string; description: string; schedule?: string; requirements?: string;
  tutorName: string; tutorEmail: string; approvalStatus: ApprovalStatus; isActive: boolean; views?: number;
  ratingAvg?: number; ratingCount?: number; createdAt: string;
  tutor?: { name: string; image: string | null; bio: string; education: string; experience: string; isVerified: boolean; isPro?: boolean } | null;
}
export interface Application {
  _id: string; tuitionId: string; tuitionTitle: string; subject: string; monthlyFee: number; tutorEmail: string;
  studentName: string; studentEmail: string; studentPhone: string; preferredSchedule: string; studentNote: string;
  status: ApplicationStatus; isPriority?: boolean; appliedAt: string;
}
export interface Payment {
  _id: string; userEmail: string; userName: string; userRole: Role; planName: string; amount: number; currency: string;
  transactionId: string; stripeSessionId: string; paymentStatus: "paid"; paidAt: string;
}
