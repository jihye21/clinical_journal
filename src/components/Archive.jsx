import React from 'react';

export default function Archive({ allLogs, archiveFilter, setArchiveFilter, uniqueWards, selectedWardFilter, setSelectedWardFilter, handleLoadLogForEdit, handleToggleFavorite, handleSoftDeleteLog, handleRestoreLog, handlePermanentDelete, setCurrentView }) {
  
  // 필터 기준에 따른 처리
  const filteredLogs = allLogs.filter(log => {
    if (archiveFilter === 'trash') return log.isDeleted;
    if (log.isDeleted) return false;
    if (archiveFilter === 'all') return true;
    if (archiveFilter === 'favorites') return log.isFavorite;
    if (archiveFilter === 'ward') return log.ward === selectedWardFilter;
    return true;
  });

  return (
    <div className="flex-1 flex flex-col justify-between min-h-full bg-slate-50/50 text-xs text-slate-800 animate-fadeIn">
      
      {/* 상단 타이틀 */}
      <div className="bg-white/80 backdrop-blur-md px-4 py-3 sticky top-0 z-10 flex justify-between items-center border-b border-slate-100 shadow-sm">
        <h2 className="text-sm font-black tracking-tight text-slate-900 flex items-center gap-1.5">
          <span className="w-1.5 h-3.5 bg-indigo-600 rounded-full block"></span>
          📂 {archiveFilter === 'all' && '전체'}
          {archiveFilter === 'ward' && '병동별'}
          {archiveFilter === 'favorite' && '중요 즐겨찾기'}
          {archiveFilter === 'trash' && '휴지통 파일 관리'}
        </h2>
        <button 
          type="button" 
          onClick={() => setCurrentView('dashboard')} 
          className="text-slate-400 hover:text-slate-600 font-bold p-1 text-sm transition"
        >
          ✕
        </button>
      </div>

      <div className="p-4 flex-1 space-y-4 overflow-y-auto pb-12">
        
        {/* 상단 필터 */}
        <div className="grid grid-cols-4 gap-1 p-1 bg-slate-200/50 rounded-xl border border-slate-200/20 shadow-inner">
          {[
            { id: 'all', label: '전체' },
            { id: 'ward', label: '병동' },
            { id: 'favorite', label: '★중요' },
            { id: 'trash', label: '휴지통' }
          ].map(f => (
            <button 
              key={f.id} 
              type="button" 
              onClick={() => setArchiveFilter(f.id)} 
              className={`py-1.5 rounded-lg font-bold text-[11px] transition-all active:scale-95 duration-200 ${
                archiveFilter === f.id 
                  ? 'bg-white text-indigo-600 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* 병동별 필터링 드롭다운 */}
        {archiveFilter === 'ward' && uniqueWards.length > 0 && (
          <div className="flex items-center gap-2.5 bg-white p-3 rounded-2xl border border-slate-200/60 shadow-sm animate-fadeIn">
            <span className="text-[11px] font-bold text-slate-400 whitespace-nowrap">병동 선택:</span>
            <select 
              value={selectedWardFilter} 
              onChange={(e) => setSelectedWardFilter(e.target.value)} 
              className="bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs font-semibold text-slate-700 flex-1 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition"
            >
              {uniqueWards.map(w => <option key={w} value={w}>{w}</option>)}
            </select>
          </div>
        )}

        {/* 파일 리스트 */}
        <div className="space-y-2 max-h-[55vh] overflow-y-auto pr-0.5">
          {filteredLogs.map(log => (
            <div 
              key={log.id} 
              className="bg-white border border-slate-200/60 p-3.5 rounded-2xl flex justify-between items-center gap-3 shadow-sm hover:border-indigo-100 transition duration-150 animate-fadeIn"
            >
              {/* 왼쪽 정보 링크 */}
              <div 
                className="flex-1 cursor-pointer min-w-0 group" 
                onClick={() => { if (!log.isDeleted) handleLoadLogForEdit(log); }}
              >
                <span className="text-slate-400 block text-[10px] font-mono tracking-tight">{log.date}</span>
                <span className="text-slate-800 font-bold text-xs mt-1 block truncate group-hover:text-indigo-600 transition">
                  {log.ward || '병동 미지정 일지'}
                </span>
              </div>
              
              {/* 오른쪽 제어 버튼 */}
              <div className="flex gap-1.5 shrink-0">
                {archiveFilter !== 'trash' ? (
                  <>
                    <button 
                      type="button" 
                      onClick={() => handleToggleFavorite(log.id)} 
                      className={`p-2 rounded-xl border text-xs active:scale-95 transition-all shadow-sm ${
                        log.isFavorite 
                          ? 'bg-amber-50 text-amber-500 border-amber-200' 
                          : 'bg-slate-50 border-slate-200 text-slate-300 hover:text-slate-400'
                      }`}
                    >
                      ⭐
                    </button>
                    <button 
                      type="button" 
                      onClick={() => handleSoftDeleteLog(log.id)} 
                      className="bg-slate-50 border border-slate-200 text-slate-400 p-2 rounded-xl text-xs hover:bg-rose-50 hover:text-rose-500 hover:border-rose-100 transition shadow-sm active:scale-95"
                    >
                      🗑️
                    </button>
                  </>
                ) : (
                  <>
                    <button 
                      type="button" 
                      onClick={() => handleRestoreFromTrash(log.id)} 
                      className="bg-indigo-50 border border-indigo-100 text-indigo-600 px-3 py-1.5 rounded-xl text-[11px] font-bold shadow-sm hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition active:scale-95"
                    >
                      복원
                    </button>
                    <button 
                      type="button" 
                      onClick={() => handlePermanentDelete(log.id)} 
                      className="bg-rose-50 border border-rose-100 text-rose-600 px-3 py-1.5 rounded-xl text-[11px] font-bold shadow-sm hover:bg-rose-600 hover:text-white hover:border-rose-600 transition active:scale-95"
                    >
                      영구삭제
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}

          {/* 일지 데이터가 비어있을 때 */}
          {filteredLogs.length === 0 && (
            <div className="text-center text-slate-400 py-16 border-2 border-dashed border-slate-200 bg-white rounded-2xl shadow-sm px-4">
              <span className="text-2xl block mb-2 opacity-50">📂</span>
              <p className="font-semibold text-xs text-slate-500">
                {archiveFilter === 'trash' ? '휴지통이 비어있습니다.' : '보관함 내 데이터가 존재하지 않습니다.'}
              </p>
              <p className="text-[10px] text-slate-300 mt-1">[새 일지 작성]을 통해 실습 기록을 시작해 보세요.</p>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
