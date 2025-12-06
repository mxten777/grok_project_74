// 사용자 역할 타입
export type UserRole = 'user' | 'admin';

// 연차 신청 상태 타입
export type LeaveStatus = 'pending' | 'approved' | 'rejected';

// 사용자 데이터 인터페이스
export interface UserData {
  id?: string;
  name: string;
  role: UserRole;
  annualLeaveTotal: number;
  annualLeaveUsed: number;
  companyId?: string; // 다중 회사 지원
  createdAt: Date;
}

// 연차 신청 데이터 인터페이스
export interface LeaveRequest {
  id: string;
  userId: string;
  companyId?: string; // 다중 회사 지원
  userName?: string; // 관리자 화면에서 사용자 이름 표시용
  startDate: string; // ISO date string
  endDate: string;   // ISO date string
  reason: string;
  status: LeaveStatus;
  createdAt: Date;
  updatedAt?: Date;
  attachmentUrl?: string;
  reviewedBy?: string; // 승인/반려한 관리자 ID
  reviewComment?: string; // 승인/반려 사유
}

// 연차 통계 인터페이스
export interface LeaveStatistics {
  totalRequests: number;
  pendingRequests: number;
  approvedRequests: number;
  rejectedRequests: number;
  totalLeaveDays: number;
  mostUsedMonth: string;
}

// 폼 상태 인터페이스
export interface LeaveApplicationForm {
  startDate: string;
  endDate: string;
  reason: string;
  attachment?: File;
}

// API 응답 타입
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}