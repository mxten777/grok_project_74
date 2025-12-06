// 폼 유효성 검사 유틸리티 함수들
import type { LeaveApplicationForm } from '../types';

/**
 * 이메일 형식 유효성 검사
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * 비밀번호 강도 검사
 */
export const isValidPassword = (password: string): boolean => {
  // 최소 6자리, 영문자와 숫자 포함
  return password.length >= 6 && /[a-zA-Z]/.test(password) && /[0-9]/.test(password);
};

/**
 * 연차 신청 폼 유효성 검사
 */
export const validateLeaveApplication = (form: LeaveApplicationForm): string[] => {
  const errors: string[] = [];

  if (!form.startDate) {
    errors.push('시작 날짜를 선택해주세요.');
  }

  if (!form.endDate) {
    errors.push('종료 날짜를 선택해주세요.');
  }

  if (form.startDate && form.endDate && form.startDate > form.endDate) {
    errors.push('시작 날짜는 종료 날짜보다 빨라야 합니다.');
  }

  if (!form.reason.trim()) {
    errors.push('연차 사유를 입력해주세요.');
  } else if (form.reason.trim().length < 5) {
    errors.push('연차 사유는 최소 5자 이상 입력해주세요.');
  }

  return errors;
};

/**
 * 파일 크기 검사 (10MB 제한)
 */
export const isValidFileSize = (file: File): boolean => {
  const maxSize = 10 * 1024 * 1024; // 10MB
  return file.size <= maxSize;
};

/**
 * 허용된 파일 형식 검사
 */
export const isValidFileType = (file: File): boolean => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'];
  return allowedTypes.includes(file.type);
};