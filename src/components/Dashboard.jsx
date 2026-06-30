import React from 'react';

export default function Dashboard({
  allLogs,
  onNewLog,
  setCurrentView,
  setArchiveFilter,
  setIsSettingMode
}) {
  // 실습 요약
  const activeLogs = allLogs.filter(log => !log.isDeleted);
  const totalCount = activeLogs.length; // 총 일지 수
  
  // 가장 최근 작성 병동 및 날짜
  const currentWard = activeLogs[0]?.ward || '지정 병동 없음';
  const latestDateStr = activeLogs[0]?.date || '기록 없음';

  // 0월 0일 형태의 날짜 함수
  const formatShortDate = (dateStr) => {
    if (!dateStr || dateStr === '기록 없음') return '기록 없음';
    const parts = dateStr.split('-');
    if (parts.length < 3) return dateStr;
    return `${parseInt(parts[1], 10)}월 ${parseInt(parts[2], 10)}일`;
  };

  return (
    <div className="flex-1 p-4 space-y-5 text-xs text-white">
      
      {/* 실습 현황 요약 */}
      <div className="bg-indigo-950/80 border border-indigo-500/20 p-4 rounded-2xl shadow-inner space-y-3">
        <span className="text-[11px] font-bold text-indigo-400 block tracking-tight">📅 이번 실습 현황</span>
        
        <div className="space-y-1.5 font-mono text-gray-300">
          <p>총 일지: <span className="text-white font-black">{totalCount}개</span></p>
          <p>실습 병동: <span className="text-white font-black">{currentWard}</span></p>
          <p>최근 작성: <span className="text-white font-black">{formatShortDate(latestDateStr)}</span></p>
        </div>
      </div>

      {/* 최근 작성한 일지 */}
      <div className="space-y-2">
        <span className="block text-[11px] font-bold text-slate-500 tracking-tight">─────────────────<br/>최근 작성한 일지<br/>─────────────────</span>
        <div className="space-y-1.5 font-mono">
          {activeLogs.slice(0, 3).map((log) => (
            <div key={log.id} className="flex justify-between items-center text-gray-400 bg-slate-800/30 p-1.5 rounded-lg border border-slate-800/40">
              <span className="text-gray-200 font-medium">{formatShortDate(log.date)}</span>
              <span className="text-xs bg-slate-800 px-2 py-0.5 rounded text-slate-300 font-semibold">{log.ward || '병동 미지정'}</span>
            </div>
          ))}
          {activeLogs.length === 0 && (
            <p className="text-slate-600 text-center py-2 italic">최근 기록된 실습 일지 내역이 없습니다.</p>
          )}
        </div>
      </div>

      {/* [새 일지 작성] */}
      <div className="pt-2">
        <button 
          type="button" 
          onClick={onNewLog}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black p-3.5 rounded-xl shadow-md active:scale-[0.99] transition text-center text-xs tracking-tight"
        >
          🚀 [새 일지 작성]
        </button>
      </div>

      <div className="bg-indigo-50/80 text-indigo-950 p-4 rounded-2xl border border-indigo-100 font-mono text-xs space-y-2 shadow-sm">
        <span className="block font-black text-indigo-900 text-[13px] border-b border-indigo-100 pb-1.5 mb-2.5 flex items-center gap-1">
          📂 실습 일지
        </span>
        
        <div className="space-y-1.5 text-indigo-950 font-medium">
          <p className="pl-2 cursor-pointer hover:text-indigo-600 hover:bg-white p-1 rounded-lg transition flex items-center gap-1 active:scale-95" onClick={onNewLog}>
            ├── ➕ 새 일지 작성
          </p>
          <p className="pl-2 text-indigo-400 py-0.5 font-bold">└── 💾 저장된 일지</p>
          
          <p className="pl-6 cursor-pointer hover:text-indigo-600 hover:bg-white p-1 rounded-lg transition flex items-center active:scale-95" onClick={() => { setCurrentView('archive'); setArchiveFilter('all'); }}>
            │     ├── 📄 전체
          </p>
          <p className="pl-6 cursor-pointer hover:text-indigo-600 hover:bg-white p-1 rounded-lg transition flex items-center active:scale-95" onClick={() => { setCurrentView('archive'); setArchiveFilter('ward'); }}>
            │     ├── 🏥 병동별
          </p>
          <p className="pl-6 cursor-pointer hover:text-indigo-600 hover:bg-white p-1 rounded-lg transition flex items-center active:scale-95" onClick={() => { setCurrentView('archive'); setArchiveFilter('favorite'); }}>
            │     ├── ⭐ 즐겨찾기
          </p>
          <p className="pl-6 cursor-pointer hover:text-indigo-600 hover:bg-white p-1 rounded-lg transition flex items-center active:scale-95" onClick={() => { setCurrentView('archive'); setArchiveFilter('trash'); }}>
            │     └── 🗑️ 휴지통
          </p>
          
          <p className="pl-2 cursor-pointer hover:text-indigo-600 hover:bg-white p-1 rounded-lg transition flex items-center border-t border-indigo-100 pt-2 mt-2 active:scale-95" onClick={() => { setCurrentView('dictionary'); }}>
            ├── 🔠 의학용어
          </p>
          <p className="pl-2 cursor-pointer hover:text-indigo-600 hover:bg-white p-1 rounded-lg transition flex items-center active:scale-95" onClick={() => setIsSettingMode(true)}>
            └── ⚙️ 설정
          </p>
        </div>
      </div>


    </div>
  );
}
