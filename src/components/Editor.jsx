import React, { useState, useEffect } from 'react';
import {
  Sun,
  Moon,
  BookMarked,
  Clipboard, 
  Calendar, 
  Home
} from "lucide-react";

function TimelineItem({ item, onUpdate, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(item.content);
  const [editTime, setEditTime] = useState(item.time);

  const handleSave = () => {
    onUpdate(item.id, editTime, editContent);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="ml-4 relative bg-white p-3 rounded-lg border border-indigo-200 shadow-sm space-y-2 animate-fadeIn text-xs">
        <div className="absolute -left-[23px] bg-indigo-600 w-2.5 h-2.5 rounded-full mt-2.5 ring-4 ring-white"></div>
        <div className="flex gap-2">
          <input type="time" value={editTime} onChange={(e) => setEditTime(e.target.value)} className="p-1 border rounded text-[11px] w-24 font-bold text-center" />
          <button type="button" onClick={handleSave} className="bg-indigo-600 text-white font-bold px-2.5 py-1 rounded shadow text-[10px]">저장</button>
          <button type="button" onClick={() => setIsEditing(false)} className="bg-gray-200 text-gray-700 font-bold px-2.5 py-1 rounded text-[10px]">취소</button>
        </div>
        <input type="text" value={editContent} onChange={(e) => setEditContent(e.target.value)} className="w-full p-2 border rounded focus:outline-indigo-500" />
      </div>
    );
  }

  return (
    <div className="ml-4 relative bg-white p-3 rounded-lg border border-gray-100 shadow-sm group animate-fadeIn text-xs">
      <div className="absolute -left-[23px] bg-indigo-600 w-2.5 h-2.5 rounded-full mt-2 ring-4 ring-white"></div>
      <div>
        <span className="text-xs font-bold text-indigo-600 block">{item.time}</span>
        <p className="text-sm text-gray-800 break-all pr-2 mt-0.5">{item.content}</p>
        <div className="flex gap-3 mt-2 border-t pt-1.5 border-gray-50 opacity-60 group-hover:opacity-100 transition-opacity">
          <button type="button" onClick={() => setIsEditing(true)} className="text-[10px] text-indigo-600 font-bold hover:underline">📝 내용 수정</button>
          <button type="button" onClick={() => onDelete(item.id)} className="text-[10px] text-red-500 font-bold hover:underline">🗑️ 삭제</button>
        </div>
      </div>
    </div>
  );
}

export default function Editor({ date, setDate, ward, setWard, timelines, handleApplyDutySkeleton, customShortcuts, handleShortcutClick, handleAddTimeline, handleUpdateTimeline, handleDeleteTimeline, time, setTime, content, setContent, handleCopyText, setCurrentView, recommend, setRecommend, onSave }) {
  return (
    <div className="flex-1 flex flex-col justify-between min-h-full bg-slate-50/50 relative text-xs text-slate-800 animate-fadeIn">
      
      {/* 상단 타이틀 */}
      <div className="bg-white/80 backdrop-blur-md px-4 py-3 sticky top-0 z-10 flex justify-between items-center border-b border-slate-100 shadow-sm">
        <h2 className="text-sm font-black tracking-tight text-slate-900 flex items-center gap-1.5">
          <span className="w-1.5 h-3.5 bg-indigo-600 rounded-full block"></span>
          실습일지
        </h2>
        <button 
          type="button" 
          onClick={() => { if(onSave) onSave(); setCurrentView('dashboard'); }} 
          className="text-xs bg-white hover:bg-slate-50 active:scale-95 text-indigo-600 font-bold px-3 py-1.5 rounded-xl border border-indigo-100 transition shadow-sm"
        >
          <Home size={16} className="text-slate-500"/>
        </button>
      </div>

      <div className="p-4 flex-1 space-y-4 overflow-y-auto pb-24">
        
        {/* 날짜 및 병동 */}
        <div className="grid grid-cols-2 gap-3 bg-white p-3.5 rounded-2xl border border-slate-200/60 shadow-sm">
          <div>
            <label className="block text-[11px] font-bold text-slate-400 mb-1.5 pl-0.5">실습 일자</label>
            <input 
              type="date" 
              value={date} 
              onChange={(e) => { setDate(e.target.value); if(onSave) onSave(timelines, ward, e.target.value); }} 
              className="w-full p-2.5 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition shadow-inner" 
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold text-slate-400 mb-1.5 pl-0.5">실습 병동</label>
            <input 
              type="text" 
              placeholder="예: 5W 내과" 
              value={ward} 
              onChange={(e) => { setWard(e.target.value); if(onSave) onSave(timelines, e.target.value, date); }} 
              className="w-full p-2.5 border border-slate-200 rounded-xl text-xs font-semibold placeholder:text-slate-300 text-slate-700 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition shadow-inner" 
            />
          </div>
        </div>

        {/* 스케줄 로드 */}
        <div className="bg-amber-50/60 border border-amber-200/70 p-3.5 rounded-2xl space-y-2.5 shadow-sm">
          <span className="block text-xs font-black text-amber-900 tracking-tight flex items-center gap-1">
            스케쥴
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button 
              type="button" 
              onClick={() => handleApplyDutySkeleton('Day')} 
              className="flex gap-2 justify-center text-xs bg-white text-amber-800 font-bold py-2.5 px-3 rounded-xl border border-amber-200 shadow-sm hover:bg-amber-50/50 active:scale-95 transition"
            >
              <Sun size={16} className="text-yellow-500"/> Day
            </button>
            <button 
              type="button" 
              onClick={() => handleApplyDutySkeleton('Evening')} 
              className="flex gap-2 justify-center text-xs bg-white text-amber-800 font-bold py-2.5 px-3 rounded-xl border border-amber-200 shadow-sm hover:bg-amber-50/50 active:scale-95 transition"
            >
              <Moon size={16} className="text-yellow-500"/> Evening
            </button>
          </div>
        </div>

        {/* 실습 태그 */}
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200/60 shadow-sm space-y-2.5">
          <span className="flex gap-2 block text-xs font-bold text-slate-400 pl-0.5"> 
            <BookMarked size={16} className="text-slate-500"/>
            자주 쓰는 실습 내용 태그
          </span>
          <div className="flex flex-wrap gap-1.5">
            {customShortcuts.map((tag) => (
              <button 
                key={tag} 
                type="button" 
                onClick={() => handleShortcutClick(tag)} 
                className="text-[11px] bg-indigo-50/60 text-indigo-700 font-semibold px-2.5 py-1.5 rounded-xl border border-indigo-100/40 hover:bg-indigo-600 hover:text-white hover:border-indigo-600 active:scale-95 transition-all shadow-sm"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* 등록 폼 */}
        <form onSubmit={handleAddTimeline} className="space-y-3 bg-gradient-to-br from-indigo-50/40 to-indigo-100/20 p-4 rounded-2xl border border-indigo-100 shadow-sm">
          <input 
            type="text" 
            placeholder="수행 및 관찰 내용을 상세히 적어보세요" 
            value={content} 
            onChange={(e) => setContent(e.target.value)} 
            className="w-full p-3 bg-white border border-gray-200 rounded-xl text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm placeholder:text-gray-300 font-medium" 
            required 
          />
          <div className="flex justify-between items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-indigo-900/60">기록 시간:</span>
              <input 
                type="time" 
                value={time} 
                onChange={(e) => setTime(e.target.value)} 
                className="w-32 p-2 bg-white border border-gray-200 rounded-xl text-xs font-bold text-center text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm" 
                required 
              />
            </div>
            <button 
              type="submit" 
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-black h-9 px-5 rounded-xl active:scale-95 transition shadow-md flex items-center justify-center text-xs whitespace-nowrap"
            >
              기록 등록
            </button>
          </div>
        </form>

        {/* 타임라인 */}
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200/60 shadow-sm space-y-3">
          <h3 className="text-xs font-black text-slate-800 border-b pb-2 flex justify-between items-center">
            <span className="flex gap-2"><Calendar size={16} className="text-slate-500"/> 오늘의 타임라인</span>
            <span className="bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-md text-[10px] font-extrabold">{timelines.length}건</span>
          </h3>
          
          {timelines.length === 0 ? (
            <p className="text-center text-slate-400 py-12 leading-relaxed font-medium">
              기록된 실습 내용이 없습니다.<br />듀티를 불러오거나 항목을 입력하세요.
            </p>
          ) : (
            <div className="relative border-l-2 border-indigo-100 ml-2 space-y-4 py-1">
              {timelines.map((item) => (
                <TimelineItem 
                  key={item.id} 
                  item={item} 
                  onUpdate={handleUpdateTimeline} 
                  onDelete={handleDeleteTimeline} 
                />
              ))}
            </div>
          )}
        </div>

      </div>

      {/* 하단 버튼 */}
      <footer className="absolute bottom-0 left-0 right-0 z-10 border-t border-slate-100 bg-white/90 backdrop-blur p-3.5 shadow-[0_-4px_12px_rgba(0,0,0,0.03)]">
        <button
          type="button"
          onClick={handleCopyText}
          className="w-full rounded-xl bg-slate-900 py-3 text-xs font-bold text-white transition-all hover:bg-slate-800 active:scale-[0.99] shadow-md flex justify-center items-center gap-1.5"
        >
          <Clipboard size={16} className="text-white-500"/>일지 복사
        </button>
      </footer>

      {/* NANDA 팝업 */}
      {recommend && (
        <div className="absolute bottom-20 left-4 right-4 bg-white border-2 border-indigo-600 rounded-2xl p-4 shadow-2xl z-20 text-xs animate-slideUp">
          <div className="flex justify-between items-center border-b pb-2 mb-2.5">
            <span className="text-xs font-black text-indigo-600 flex items-center gap-1">
              💡 {recommend.tag} 연계 간호과정 분석 가이드
            </span>
            <button 
              type="button" 
              onClick={() => setRecommend(null)} 
              className="text-sm font-bold text-gray-400 hover:text-gray-600 px-1"
            >
              ✕
            </button>
          </div>
          <div className="space-y-3.5">
            <div>
              <span className="font-bold text-gray-400 block mb-1.5">추천 공식 NANDA 간호진단:</span>
              <div className="flex flex-wrap gap-1">
                {recommend.diagnoses.map((d) => (
                  <span key={d} className="bg-rose-50 text-rose-700 border border-rose-100/60 px-2 py-0.5 rounded-lg font-bold text-[10px]">{d}</span>
                ))}
              </div>
            </div>
            <div>
              <span className="font-bold text-gray-400 block mb-1.5">지침서 및 케이스 추천 임상 중재:</span>
              <p className="text-gray-700 bg-slate-50 p-2.5 rounded-xl border border-slate-100 leading-relaxed font-medium text-[11px] shadow-inner">{recommend.interventions}</p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
