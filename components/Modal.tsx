import React from 'react';
import { useTranslation } from '../i18n/LanguageContext';

interface ModalProps {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ title, children, onClose }) => {
  const { t } = useTranslation();
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl p-8 m-4 max-w-sm w-full transform transition-all animate-jump-in">
        <h2 className="text-2xl font-black text-gray-800 text-center mb-4">{title}</h2>
        <div className="text-center text-gray-600 mb-6">{children}</div>
        <button
          onClick={onClose}
          className="w-full bg-purple-600 text-white font-bold py-3 px-4 rounded-xl hover:bg-purple-700 focus:outline-none focus:ring-4 focus:ring-purple-300 transition-transform transform hover:scale-105"
        >
          {t('modal.awesome')}
        </button>
      </div>
    </div>
  );
};

export default Modal;
