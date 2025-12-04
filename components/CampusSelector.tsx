import React from 'react';
import { Campus } from '../types';
import { Building2, GraduationCap } from 'lucide-react';

interface CampusSelectorProps {
  selected: Campus | null;
  onSelect: (campus: Campus) => void;
}

const CampusSelector: React.FC<CampusSelectorProps> = ({ selected, onSelect }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl mx-auto">
      <button
        onClick={() => onSelect(Campus.SINCHON)}
        className={`relative p-8 rounded-2xl border-2 transition-all duration-300 flex flex-col items-center justify-center gap-4 group ${
          selected === Campus.SINCHON
            ? 'border-yonsei-blue bg-blue-50/50 shadow-lg scale-105'
            : 'border-gray-200 hover:border-yonsei-blue/50 hover:bg-gray-50'
        }`}
      >
        <div className={`p-4 rounded-full ${selected === Campus.SINCHON ? 'bg-yonsei-blue text-white' : 'bg-gray-100 text-gray-500 group-hover:bg-blue-100 group-hover:text-yonsei-blue'}`}>
          <Building2 size={40} />
        </div>
        <div className="text-center">
          <h3 className="text-xl font-bold text-gray-800">신촌 캠퍼스</h3>
          <p className="text-sm text-gray-500 mt-2">본교, 백양로, 학생회관</p>
        </div>
      </button>

      <button
        onClick={() => onSelect(Campus.SONGDO)}
        className={`relative p-8 rounded-2xl border-2 transition-all duration-300 flex flex-col items-center justify-center gap-4 group ${
          selected === Campus.SONGDO
            ? 'border-yonsei-blue bg-blue-50/50 shadow-lg scale-105'
            : 'border-gray-200 hover:border-yonsei-blue/50 hover:bg-gray-50'
        }`}
      >
        <div className={`p-4 rounded-full ${selected === Campus.SONGDO ? 'bg-yonsei-blue text-white' : 'bg-gray-100 text-gray-500 group-hover:bg-blue-100 group-hover:text-yonsei-blue'}`}>
          <GraduationCap size={40} />
        </div>
        <div className="text-center">
          <h3 className="text-xl font-bold text-gray-800">국제 캠퍼스</h3>
          <p className="text-sm text-gray-500 mt-2">송도, RC 기숙사, Y-Plaza</p>
        </div>
      </button>
    </div>
  );
};

export default CampusSelector;