import React from 'react';

export default function Dictionary({ searchWord, handleSearchWord, searchResult, customDictionary, setCurrentView }) {
  return (
    <div className="space-y-4 animate-fadeIn text-xs text-white bg-slate-900 min-h-[70vh] p-1 rounded-xl">
      <div className="flex justify-between items-center border-b border-slate-800 pb-2">
        <h2 className="text-sm font-bold text-white flex items-center gap-1.5">🔍 의학용어 / 약어 즉석 딕셔너리 연구실</h2>
        <button type="button" onClick={() => setCurrentView('dashboard')} className="text-slate-400 font-bold hover:text-white">✕ 닫기</button>
      </div>

      <div className="space-y-3">
        <input type="text" placeholder="약어를 입력하면 실시간 매칭됩니다" value={searchWord} onChange={handleSearchWord} className="w-full p-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs uppercase font-bold text-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        
        {searchResult ? (
          <div className="bg-slate-800 border border-slate-700 p-3.5 rounded-xl space-y-1 text-xs">
            <span className="font-bold text-indigo-400 block text-sm">{searchResult.term}</span>
            <p className="text-gray-200"><strong>의미:</strong> {searchResult.definition}</p>
            <p className="text-slate-400 italic mt-1 leading-relaxed border-t border-slate-700 pt-1.5">💡 임상 가이드: {searchResult.note}</p>
          </div>
        ) : searchWord ? (
          <p className="text-center text-slate-500 py-4">일치하는 단어가 사전에 수록되어 있지 않습니다.</p>
        ) : null}

        <div className="space-y-1.5 pt-2">
          <span className="block text-xs font-bold text-slate-400 mb-1">📋 사전 수록 약어 명단 전체</span>
          <div className="grid grid-cols-1 gap-1.5 max-h-48 overflow-y-auto pr-1">
            {Object.keys(customDictionary).map(key => (
              <div key={key} className="bg-slate-800 border border-slate-700 p-2 rounded-lg flex justify-between items-center text-xs">
                <span className="font-bold text-indigo-400">{key}</span>
                <span className="text-gray-300 text-[11px] font-medium truncate max-w-[200px]">{customDictionary[key].definition}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
