import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            © 2025 Annual Leave Manager. All rights reserved.
          </div>
          <div className="flex space-x-6 text-sm text-gray-600 dark:text-gray-400">
            <a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              개인정보처리방침
            </a>
            <a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              이용약관
            </a>
            <a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              문의하기
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;