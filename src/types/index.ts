export interface UserData {
  id?: string;
  name: string;
  role: string;
  annualLeaveTotal: number;
  annualLeaveUsed: number;
  createdAt: Date;
}

export interface LeaveRequest {
  id: string;
  userId: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: string;
  createdAt: Date;
  attachmentUrl?: string;
}