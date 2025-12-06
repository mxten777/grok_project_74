// 공통 상수 정의
export const CONSTANTS = {
  // 연차 관련
  DEFAULT_ANNUAL_LEAVE: 20,
  MAX_LEAVE_DAYS_PER_REQUEST: 30,
  
  // 파일 업로드 관련
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_FILE_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'],
  
  // 페이지네이션
  ITEMS_PER_PAGE: 10,
  
  // 날짜 형식
  DATE_FORMAT: 'yyyy-MM-dd',
  DISPLAY_DATE_FORMAT: 'yyyy년 MM월 dd일',
  
  // 메시지
  MESSAGES: {
    LOGIN_SUCCESS: '로그인에 성공했습니다.',
    LOGIN_FAILED: '로그인에 실패했습니다.',
    LEAVE_REQUEST_SUCCESS: '연차 신청이 완료되었습니다.',
    LEAVE_REQUEST_FAILED: '연차 신청에 실패했습니다.',
    APPROVE_SUCCESS: '연차가 승인되었습니다.',
    REJECT_SUCCESS: '연차가 반려되었습니다.',
    DELETE_SUCCESS: '삭제가 완료되었습니다.',
    UPDATE_SUCCESS: '수정이 완료되었습니다.',
    NETWORK_ERROR: '네트워크 오류가 발생했습니다.',
    UNKNOWN_ERROR: '알 수 없는 오류가 발생했습니다.',
  },
  
  // 스타일 관련
  ANIMATIONS: {
    FADE_IN: 'animate-fade-in',
    SLIDE_IN: 'animate-slide-in',
    BOUNCE_IN: 'animate-bounce-in',
  },
} as const;