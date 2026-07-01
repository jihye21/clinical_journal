import React from 'react';

export default function Dictionary({ searchWord, handleSearchWord, searchResult, customDictionary, setCurrentView }) {
  return (
    <div className="flex-1 flex flex-col min-h-full bg-slate-50/50 text-xs text-slate-800 animate-fadeIn">
  
  {/* 상단 타이틀 */}
  <div className="bg-white/80 backdrop-blur-md px-4 py-3 sticky top-0 z-10 flex justify-between items-center border-b border-slate-100 shadow-sm">
    <h2 className="text-sm font-black tracking-tight text-slate-900 flex items-center gap-1.5">
      <span className="w-1.5 h-3.5 bg-indigo-600 rounded-full block"></span>
      의학용어 사전
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
    
    {/* 검색창 */}
    <div className="relative">
      <input 
        type="text" 
        placeholder="약어를 입력하세요" 
        value={searchWord} 
        onChange={handleSearchWord} 
        className="w-full p-3 bg-white border border-slate-200 rounded-2xl text-xs font-bold text-indigo-600 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 shadow-sm transition" 
      />
    </div>
    
    {/* 결과 출력 */}
    {searchResult ? (
      <div className="bg-white border border-indigo-100 p-4 rounded-2xl space-y-2 text-xs shadow-sm shadow-indigo-50/50 animate-fadeIn">
        <span className="font-black text-indigo-600 block text-sm tracking-tight">{searchResult.term}</span>
        <p className="text-slate-700 leading-relaxed"><strong className="text-slate-900">의미:</strong> {searchResult.definition}</p>
        <p className="text-slate-500 italic leading-relaxed border-t border-slate-100 pt-2 mt-1">💡 임상 가이드: {searchResult.note}</p>
      </div>
    ) : searchWord ? (
      <div className="text-center bg-white border border-slate-100 p-4 rounded-2xl text-slate-400">
        일치하는 단어가 없습니다.
      </div>
    ) : null}

    {/* 전체 목록 */}
    <div className="space-y-2 pt-2">
      <span className="block text-[11px] font-black text-slate-400 mb-1 px-1 tracking-wider uppercase">전체 수록 약어 ({Object.keys(customDictionary).length})</span>
      <div className="space-y-2 max-h-[40vh] overflow-y-auto pr-0.5">
        {Object.keys(customDictionary).map(key => (
          <div key={key} className="bg-white border border-slate-200/60 p-3 rounded-2xl flex justify-between items-center shadow-sm hover:border-indigo-200 transition">
            <span className="font-black text-indigo-600 text-xs tracking-tight">{key}</span>
            <span className="text-slate-500 text-[11px] font-medium truncate max-w-[180px] ml-4">{customDictionary[key].definition}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
</div>
  );
}
