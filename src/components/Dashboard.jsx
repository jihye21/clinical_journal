import React, { useState } from 'react';
import {
  ChevronDown,
  ChevronRight,
  FolderOpen,
  Folder,
  FilePlus2,
  Archive,
  ClipboardList,
  CalendarDays,
  Clock3,
  Hospital,
  FileText,
  BookOpenText,
  Settings
} from "lucide-react";

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

  // 메뉴 토글
  const [openMenu, setOpenmenu] = useState({
    journal: true, 
    case: false,
  });

  const toggleMenu = (key) => {
    setOpenmenu(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <div className="flex-1 p-4 space-y-5 text-xs text-white">
      
      {/* 실습 현황 요약 */}
      <div className="bg-indigo-950/80 border border-indigo-500/20 p-4 rounded-2xl shadow-inner space-y-3">
        <div className="flex items-center gap-2">
          <CalendarDays
            size={16}
            className="text-indigo-400"
            strokeWidth={2.3}
          />
          <span className="text-[11px] font-bold text-indigo-400 tracking-tight">
            이번 실습 현황
          </span>
        </div>        

        <div className="space-y-2 font-mono text-gray-300">
          <div className="flex justify-between">
            <span>총 일지</span>
            <span className="text-white font-black">{totalCount}개</span>
          </div>

          <div className="flex justify-between">
            <span>실습 병동</span>
            <span className="text-white font-black">{currentWard}</span>
          </div>

          <div className="flex justify-between">
            <span>최근 작성</span>
            <span className="text-white font-black">
              {formatShortDate(latestDateStr)}
            </span>
          </div>
        </div>
      </div>

      {/* 최근 작성한 일지 */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Clock3
            size={15}
            className="text-slate-500"
          />
          <span className="text-[11px] font-bold text-slate-500 tracking-tight">
            최근 작성한 일지
          </span>
        </div>        
        <div className="space-y-1.5 font-mono">
          {activeLogs.slice(0, 3).map((log) => (
            <div
              key={log.id}
              className="flex justify-between items-center bg-gray-200/30 border border-slate-800/40 rounded-lg p-2"
            >
              <div className="flex items-center gap-2">
                <FileText
                  size={15}
                  className="text-indigo-400"
                />

                <span className="text-black font-medium">
                  {formatShortDate(log.date)}
                </span>
              </div>

              <div className="flex items-center gap-1 rounded-md bg-slate-800 px-2 py-1">
                <Hospital
                  size={13}
                  className="text-slate-400"
                />

                <span className="text-slate-300 text-[11px] font-semibold">
                  {log.ward || "병동 미지정"}
                </span>
              </div>
            </div>
          ))}
          {activeLogs.length === 0 && (
            <p className="text-slate-600 text-center py-2 italic">최근 기록된 실습 일지 내역이 없습니다.</p>
          )}
        </div>
      </div>

      {/* 실습 일지 */}
      <div>
        <button
          type="button"
          onClick={() => toggleMenu("journal")}
          className="w-full flex items-center justify-between rounded-lg px-2 py-2 text-slate-800 hover:bg-white hover:text-indigo-600 transition"
        >
          <div className="flex items-center gap-2">
            {openMenu.journal ? (
              <FolderOpen size={18} className="text-indigo-500" />
            ) : (
              <Folder size={18} className="text-indigo-500" />
            )}
            <span className="font-semibold">실습 일지</span>
          </div>

          {openMenu.journal ? (
            <ChevronDown size={16} />
          ) : (
            <ChevronRight size={16} />
          )}
        </button>

        {openMenu.journal && (
          <div className="ml-7 mt-1 space-y-1 border-l border-indigo-100 pl-3">
            <button
              onClick={onNewLog}
              className="w-full flex items-center gap-2 rounded-md px-2 py-1.5 text-slate-700 hover:bg-white hover:text-indigo-600 transition"
            >
              <FilePlus2 size={16} />
              <span>새 일지 작성</span>
            </button>

            <button
              onClick={() => {
                setCurrentView("archive");
                setArchiveFilter("all");
              }}
              className="w-full flex items-center gap-2 rounded-md px-2 py-1.5 text-slate-700 hover:bg-white hover:text-indigo-600 transition"
            >
              <Archive size={16} />
              <span>저장된 일지</span>
            </button>
          </div>
        )}
      </div>

      {/* 대상자 케이스 */}
      <div className="mt-2">
        <button
          type="button"
          onClick={() => toggleMenu("case")}
          className="w-full flex items-center justify-between rounded-lg px-2 py-2 text-slate-800 hover:bg-white hover:text-indigo-600 transition"
        >
          <div className="flex items-center gap-2">
            <ClipboardList size={18} className="text-emerald-500" />
            <span className="font-semibold">대상자 케이스</span>
          </div>

          {openMenu.case ? (
            <ChevronDown size={16} />
          ) : (
            <ChevronRight size={16} />
          )}
        </button>

        {openMenu.case && (
          <div className="ml-7 mt-1 space-y-1 border-l border-emerald-100 pl-3">
            <button
              onClick={() => setCurrentView("newCase")}
              className="w-full flex items-center gap-2 rounded-md px-2 py-1.5 text-slate-700 hover:bg-white hover:text-emerald-600 transition"
            >
              <FilePlus2 size={16} />
              <span>새 케이스 작성</span>
            </button>

            <button
              onClick={() => setCurrentView("caseArchive")}
              className="w-full flex items-center gap-2 rounded-md px-2 py-1.5 text-slate-700 hover:bg-white hover:text-emerald-600 transition"
            >
              <Archive size={16} />
              <span>저장된 케이스</span>
            </button>
          </div>
        )}
      </div>

      {/* 의학용어 */}
      <button
        onClick={() => setCurrentView("dictionary")}
        className="
          w-full flex items-center gap-2
          pl-2 py-2 mt-2
          rounded-lg
          text-slate-800
          hover:bg-white hover:text-indigo-600
          transition active:scale-95
          border-t border-indigo-100 pt-3
        "
      >
        <BookOpenText size={16} className="text-indigo-500" />

        <span className="font-medium">의학용어</span>
      </button>

      {/* 설정 */}
      <button
        onClick={() => setIsSettingMode(true)}
        className="
          w-full flex items-center gap-2
          pl-2 py-2
          rounded-lg
          text-slate-800
          hover:bg-white hover:text-indigo-600
          transition active:scale-95
        "
      >
        <Settings size={16} className="text-slate-500" />

        <span className="font-medium">설정</span>
      </button>
    </div>
  );
}
