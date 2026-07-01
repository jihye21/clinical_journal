import React from 'react';
import { 
  Settings,
  Timer,
  Tags,
  BookMarked,
  Sun,
  Moon,
  Save,
  Plus,
  BookOpen
 } from "lucide-react";

export default function SettingModal({
  setIsSettingMode,
  activeSettingTab,
  setActiveSettingTab,
  customSkeletons,
  handleUpdateCustomSkeleton,
  handleSaveCustomSkeletons,
  customShortcuts,
  newTag,
  setNewTag,
  newNandaDiagnoses,
  setNewNandaDiagnoses,
  newNandaInterventions,
  setNewNandaInterventions,
  handleAddCustomTag,
  handleDeleteCustomTag,
  customNanda,
  newDictKey,
  setNewDictKey,
  newDictTerm,
  setNewDictTerm,
  newDictDef,
  setNewDictDef,
  newDictNote,
  setNewDictNote,
  handleAddCustomDict,
  customDictionary,
  handleDeleteCustomDict,
  handleSaveTagsAndDict,
  DEFAULT_DUTY_SKELETONS,
  DEFAULT_SHORTCUTS,
  DEFAULT_DICTIONARY,
  DEFAULT_NANDA
}) {
  return (
    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm z-30 flex flex-col justify-end text-xs">
      <div className="bg-white max-h-[90vh] rounded-t-2xl p-4 flex flex-col justify-between shadow-2xl overflow-hidden">
        
        <div className="flex justify-between items-center border-b pb-3 mb-3">
          <div>
            <h2 className="flex items-center gap-2 text-gray-800 font-bold text-base "><Settings size={16} className="text-slate-500" />설정</h2>
          </div>
          <button type="button" onClick={() => setIsSettingMode(false)} className="text-gray-400 hover:text-gray-600 font-bold p-1 text-sm">✕</button>
        </div>

        <div className="flex border-b mb-3 text-xs font-bold text-center">
          <button 
            type="button" 
            onClick={() => setActiveSettingTab('routine')} 
            className={`flex-1 py-2 border-b-2 flex items-center justify-center gap-1 ${activeSettingTab === 'routine' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-400'}`}
          >
            <Timer size={16} className="text-slate-500" />루틴 편집
          </button>
          <button 
            type="button" 
            onClick={() => setActiveSettingTab('tags')} 
            className={`flex-1 py-2 border-b-2 flex items-cneter justify-center gap-1 ${activeSettingTab === 'tags' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-400'}`}
          >
            <Tags size={16} className="text-slate-500" /> 태그 / 용어 편집
          </button>
        </div>

        <div className="flex-1 overflow-y-auto pr-1 text-xs mb-4 space-y-4">
          
          {/* 루틴 스케쥴 설정 */}
          {activeSettingTab === 'routine' ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <span className="inline-flex items-center gap-2 font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-100">
                  <Sun size={16} className="text-slate-500" /> Day 루틴 기본값 편집
                </span>
                {customSkeletons.Day.map((item, idx) => (
                  <div key={item.id} className="flex gap-2 items-center bg-gray-50 p-1.5 rounded-lg border">
                    <input type="time" value={item.time} onChange={(e) => handleUpdateCustomSkeleton('Day', idx, 'time', e.target.value)} className="p-1 border rounded w-24 font-semibold text-center focus:outline-indigo-500" />
                    <input type="text" value={item.content} onChange={(e) => handleUpdateCustomSkeleton('Day', idx, 'content', e.target.value)} className="flex-1 p-1.5 border rounded text-gray-700 focus:outline-indigo-500" />
                  </div>
                ))}
              </div>

              <div className="space-y-2 pt-2 border-t border-gray-100">
                <span className="inline-flex items-center gap-2 font-bold text-indigo-800 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                  <Moon size={16} className="text-slate-500" /> Evening 루틴 기본값 편집
                </span>
                {customSkeletons.Evening.map((item, idx) => (
                  <div key={item.id} className="flex gap-2 items-center bg-gray-50 p-1.5 rounded-lg border">
                    <input type="time" value={item.time} onChange={(e) => handleUpdateCustomSkeleton('Evening', idx, 'time', e.target.value)} className="p-1 border rounded w-24 font-semibold text-center focus:outline-indigo-500" />
                    <input type="text" value={item.content} onChange={(e) => handleUpdateCustomSkeleton('Evening', idx, 'content', e.target.value)} className="flex-1 p-1.5 border rounded text-gray-700 focus:outline-indigo-500" />
                  </div>
                ))}
              </div>
              
              <div className="grid grid-cols-2 gap-2 border-t pt-3">
                <button type="button" onClick={() => { handleUpdateCustomSkeleton('reset_all', 0, '', ''); alert('기본값 복원 요청 완료'); }} className="bg-gray-100 text-gray-600 font-bold p-2 rounded-xl text-xs hover:bg-gray-200">기본값 리셋</button>
                <button type="button" onClick={handleSaveCustomSkeletons} className="flex items-center justify-center gap-2 bg-indigo-600 text-white font-bold p-2 rounded-xl text-xs shadow hover:bg-indigo-700">
                  <Save size={16} className="text-white" />  루틴 저장
                </button>
              </div>
            </div>
          ) : (
            /* 태그 및 의학용어 편집 */
            <div className="space-y-4">
              <div className="space-y-2 bg-slate-50/70 p-3 rounded-xl border border-gray-200">
                <span className="flex gap-2 font-bold text-gray-700 block text-xs">
                  <BookMarked size={16} className="text-slate-500" /> 실습 상용구 태그 및 NANDA 연동 등록
                </span>
                <div className="space-y-2 bg-white p-2.5 rounded-lg border">
                  <input type="text" placeholder="새 태그명 (예: #처치관찰)" value={newTag} onChange={(e) => setNewTag(e.target.value)} className="w-full p-1.5 border rounded-lg text-xs" />
                  <input type="text" placeholder="연계 NANDA 진단명 (쉼표 분리)" value={newNandaDiagnoses} onChange={(e) => setNewNandaDiagnoses(e.target.value)} className="w-full p-1.5 border rounded-lg text-xs" />
                  <textarea rows="2" placeholder="지침서용 가이드 내용 기술" value={newNandaInterventions} onChange={(e) => setNewNandaInterventions(e.target.value)} className="w-full p-1.5 border rounded-lg text-xs resize-none" />
                  <button type="button" onClick={handleAddCustomTag} className="flex justify-center gap-1 w-full bg-indigo-600 text-white font-bold p-2 rounded-lg text-xs shadow-sm hover:bg-indigo-700">
                    <Plus size={16} className="text-white"/> 태그 추가 등록
                  </button>
                </div>
                
                {/* 등록된 태그들의 리스트 */}
                <div className="flex flex-col gap-1.5 pt-1.5 max-h-36 overflow-y-auto">
                  {customShortcuts.map(tag => (
                    <div key={tag} className="bg-white p-2 rounded-lg border text-[11px] flex justify-between items-center">
                      <span className="font-bold text-indigo-700">{tag}</span>
                      <button type="button" onClick={() => handleDeleteCustomTag(tag)} className="text-red-400 font-bold hover:text-red-600 px-1">삭제</button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2 bg-slate-50/50 p-2.5 rounded-xl border">
                <span className="flex gap-2 font-bold text-gray-700 block">
                  <BookOpen size={16} className="text-slate-500"/>
                  약어 사전 등록
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <input type="text" placeholder="약어 (예: NPO)" value={newDictKey} onChange={(e) => setNewDictKey(e.target.value)} className="p-1.5 border rounded-lg bg-white uppercase font-bold" />
                  <input type="text" placeholder="원어 풀네임" value={newDictTerm} onChange={(e) => setNewDictTerm(e.target.value)} className="p-1.5 border rounded-lg bg-white" />
                </div>
                <input type="text" placeholder="한글 뜻 설명" value={newDictDef} onChange={(e) => setNewDictDef(e.target.value)} className="w-full p-1.5 border rounded-lg bg-white" />
                <div className="flex gap-2">
                  <input type="text" placeholder="메모 (선택)" value={newDictNote} onChange={(e) => setNewDictNote(e.target.value)} className="flex-1 p-1.5 border rounded-lg bg-white" />
                  <button type="button" onClick={handleAddCustomDict} className="bg-indigo-600 text-white px-4 font-bold rounded-lg text-xs hover:bg-indigo-700">사전 등록</button>
                </div>

                <div className="pt-2 space-y-1.5 max-h-32 overflow-y-auto">
                  {Object.keys(customDictionary).map(key => (
                    <div key={key} className="flex justify-between items-center bg-white p-2 rounded-lg border text-[11px]">
                      <div>
                        <span className="font-bold text-indigo-600">{key}</span> 
                        <span className="text-gray-700 font-medium ml-1">| {customDictionary[key].definition}</span>
                      </div>
                      <button type="button" onClick={() => handleDeleteCustomDict(key)} className="text-red-400 font-bold hover:text-red-600 px-1">삭제</button>
                    </div>
                  ))}
                </div>
              </div>

              <button type="button" onClick={handleSaveTagsAndDict} className="flex justify-center gap-2 w-full bg-slate-900 text-white font-bold p-3 rounded-xl text-xs shadow-md hover:bg-slate-800 transition">
                <Save size={16} className="text-white"/>저장
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
