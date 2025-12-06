// 날짜 관련 유틸리티 함수들
import { format, parseISO, isWeekend, addDays } from 'date-fns';
import { ko } from 'date-fns/locale';

/**
 * 날짜를 한국어 형식으로 포맷팅
 */
export const formatDate = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, 'yyyy년 MM월 dd일', { locale: ko });
};

/**
 * 날짜를 간단한 형식으로 포맷팅 (YYYY-MM-DD)
 */
export const formatDateSimple = (date: string | Date): string => {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, 'yyyy-MM-dd');
};

/**
 * 두 날짜 사이의 영업일 계산 (주말 제외)
 */
export const calculateBusinessDays = (startDate: string, endDate: string): number => {
  const start = parseISO(startDate);
  const end = parseISO(endDate);
  let businessDays = 0;
  let currentDate = start;

  while (currentDate <= end) {
    if (!isWeekend(currentDate)) {
      businessDays++;
    }
    currentDate = addDays(currentDate, 1);
  }

  return businessDays;
};

/**
 * 날짜 범위 유효성 검사
 */
export const validateDateRange = (startDate: string, endDate: string): boolean => {
  const start = parseISO(startDate);
  const end = parseISO(endDate);
  return start <= end;
};

/**
 * 연차 신청 가능 여부 확인 (미래 날짜만 가능)
 */
export const canApplyLeave = (startDate: string): boolean => {
  const start = parseISO(startDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return start >= today;
};