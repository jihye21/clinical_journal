import React, { useState, useEffect } from 'react';

import { BookHeart, Files } from "lucide-react";

import Dashboard from './components/Dashboard';
import Archive from './components/Archive';
import Editor from './components/Editor';
import Dictionary from './components/Dictionary';
import SettingModal from './components/SettingModal';
import TestCase from './components/TestCase';

import { 
  DEFAULT_SHORTCUTS, 
  DEFAULT_NANDA, 
  DEFAULT_DICTIONARY, 
  DEFAULT_DUTY_SKELETONS 
} from './data/initialData';

export default function App() {
  //테스트 케이스 뷰
  const [fileSelect, setFileSelect] = useState(false);

  // 글로벌 라우팅 및 독립 스크린 뷰 상태 제어
  const [currentView, setCurrentView] = useState('dashboard'); // 'dashboard', 'editor', 'archive', 'dictionary'
  const [archiveFilter, setArchiveFilter] = useState('all'); // 'all', 'ward', 'favorite', 'trash'
  
  // 실습 일지 데이터 상태
  const [allLogs, setAllLogs] = useState([]);
  const [selectedLogId, setSelectedLogId] = useState('');

  // 수정 중인 에디터 내부 연동 데이터 바인딩 상태
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [ward, setWard] = useState('');
  const [timelines, setTimelines] = useState([]);

  const [time, setTime] = useState('09:00');
  const [content, setContent] = useState('');
  const [recommend, setRecommend] = useState(null);

  // 환경 설정 및 시스템 커스텀 데이터셋 상태
  const [isSettingMode, setIsSettingMode] = useState(false);
  const [activeSettingTab, setActiveSettingTab] = useState('routine');

  const [customSkeletons, setCustomSkeletons] = useState(() => {
    const saved = localStorage.getItem('custom-duty-skeletons');
    return saved ? JSON.parse(saved) : DEFAULT_DUTY_SKELETONS;
  });

  const [customShortcuts, setCustomShortcuts] = useState(() => {
    const saved = localStorage.getItem('custom-shortcuts');
    return saved ? JSON.parse(saved) : DEFAULT_SHORTCUTS;
  });

  const [customNanda, setCustomNanda] = useState(() => {
    const saved = localStorage.getItem('custom-nanda-recommends');
    return saved ? JSON.parse(saved) : DEFAULT_NANDA;
  });

  const [customDictionary, setCustomDictionary] = useState(() => {
    const saved = localStorage.getItem('custom-dictionary');
    return saved ? JSON.parse(saved) : DEFAULT_DICTIONARY;
  });

  // 태그/용어 신규 추가를 위한 임시 입력 폼 상태
  const [newTag, setNewTag] = useState('');
  const [newNandaDiagnoses, setNewNandaDiagnoses] = useState('');
  const [newNandaInterventions, setNewNandaInterventions] = useState('');
  const [newDictKey, setNewDictKey] = useState('');
  const [newDictTerm, setNewDictTerm] = useState('');
  const [newDictDef, setNewDictDef] = useState('');
  const [newDictNote, setNewDictNote] = useState('');
  const [searchWord, setSearchWord] = useState('');
  const [searchResult, setSearchResult] = useState(null);

  // 실습일지 목록 데이터 가져오기
  useEffect(() => {
    const savedLogs = localStorage.getItem('medi-clinical-logs');
    if (savedLogs) setAllLogs(JSON.parse(savedLogs));
  }, []);

  // 핵심 함수 

  const loadLogToEditor = (logId) => {
    const targetLog = allLogs.find(log => log.id === logId);
    if(targetLog) {
        setSelectedLogId(targetLog.id);
        setDate(targetLog.date);
        setWard(targetLog.ward);
        setTimelines(targetLog.setTimelines);
    }
   };

  const handleCreateNewLog = () => {
    const newId = 'log-' + Date.now();
    const todayStr = new Date().toISOString().split('T')[0];
    const isExist = allLogs.some(l => l.date === todayStr && !l.isDeleted);
    
    setSelectedLogId(newId);
    setDate(isExist ? '' : todayStr);
    setWard('');
    setTimelines([]);
    setCurrentView('editor');
  };

  const handleLoadLogForEdit = (log) => {
    setSelectedLogId(log.id);
    setDate(log.date);
    setWard(log.ward || '');
    setTimelines(log.timelines || []);
    setCurrentView('editor');
  };

  const handleSaveCurrentLogState = (updatedTimelines = timelines, updatedWard = ward, updatedDate = date) => {
    if (!updatedDate) return;

    let targetId = selectedLogId || 'log-' + Date.now();
    if (!selectedLogId) setSelectedLogId(targetId);

    const updatedLogObj = {
      id: targetId,
      date: updatedDate,
      ward: updatedWard,
      timelines: updatedTimelines,
      isDeleted: false,
      isFavorite: allLogs.find(l => l.id === targetId)?.isFavorite || false
    };

    const nextLogs = allLogs.some(l => l.id === targetId)
      ? allLogs.map(l => l.id === targetId ? updatedLogObj : l)
      : [updatedLogObj, ...allLogs];

    const sortedLogs = nextLogs.sort((a, b) => b.date.localeCompare(a.date));
    setAllLogs(sortedLogs);
    localStorage.setItem('medi-clinical-logs', JSON.stringify(sortedLogs));
  };

  const handleMoveToTrash = (id) => {
    const next = allLogs.map(l => l.id === id ? { ...l, isDeleted: true } : l);
    setAllLogs(next);
    localStorage.setItem('medi-clinical-logs', JSON.stringify(next));
  };

  const handleRestoreFromTrash = (id) => {
    const next = allLogs.map(l => l.id === id ? { ...l, isDeleted: false } : l);
    setAllLogs(next);
    localStorage.setItem('medi-clinical-logs', JSON.stringify(next));
  };

  const handlePermanentDelete = (id) => {
    if (!window.confirm('이 영구적으로 삭제하시겠습니까?')) return;
    const next = allLogs.filter(l => l.id !== id);
    setAllLogs(next);
    localStorage.setItem('medi-clinical-logs', JSON.stringify(next));
  };

  const handleToggleFavorite = (id) => {
    const next = allLogs.map(l => l.id === id ? { ...l, isFavorite: !l.isFavorite } : l);
    setAllLogs(next);
    localStorage.setItem('medi-clinical-logs', JSON.stringify(next));
  };

  const handleUpdateCustomSkeleton = (dutyType, index, field, value) => {
    const updatedSkeletons = { ...customSkeletons };
    updatedSkeletons[dutyType][index][field] = value;
    setCustomSkeletons(updatedSkeletons);
  };

  const handleSaveCustomSkeletons = () => {
    localStorage.setItem('custom-duty-skeletons', JSON.stringify(customSkeletons));
    setIsSettingMode(false);
    alert('루틴 스케줄이 저장되었습니다.');
  };

  const handleAddCustomTag = () => {
    if (!newTag.trim()) return;
    const formattedTag = newTag.trim().startsWith('#') ? newTag.trim() : `#${newTag.trim()}`;
    if (customShortcuts.includes(formattedTag)) return alert('이미 존재하는 태그입니다.');

    const diagnosesArray = newNandaDiagnoses.trim() ? newNandaDiagnoses.split(',').map(d => d.trim()).filter(Boolean) : [];
    setCustomShortcuts([...customShortcuts, formattedTag]);
    setCustomNanda({
      ...customNanda,
      [formattedTag]: { diagnoses: diagnosesArray, interventions: newNandaInterventions.trim() || '사용자 등록 가이드' }
    });
    setNewTag(''); setNewNandaDiagnoses(''); setNewNandaInterventions('');
  };

  const handleDeleteCustomTag = (tagToDelete) => {
    setCustomShortcuts(customShortcuts.filter(tag => tag !== tagToDelete));
    const updatedNanda = { ...customNanda };
    delete updatedNanda[tagToDelete];
    setCustomNanda(updatedNanda);
  };

  const handleAddCustomDict = () => {
    if (!newDictKey.trim() || !newDictDef.trim()) return alert('약어와 의미를 입력해주세요.');
    const key = newDictKey.trim().toUpperCase();
    setCustomDictionary({
      ...customDictionary,
      [key]: { term: newDictTerm.trim(), definition: newDictDef.trim(), note: newDictNote.trim() || '사용자 등록 약어' }
    });
    setNewDictKey(''); setNewDictTerm(''); setNewDictDef(''); setNewDictNote('');
  };

  const handleDeleteCustomDict = (keyToDelete) => {
    const updatedDict = { ...customDictionary };
    delete updatedDict[keyToDelete];
    setCustomDictionary(updatedDict);
  };

  const handleSaveTagsAndDict = () => {
    localStorage.setItem('custom-shortcuts', JSON.stringify(customShortcuts));
    localStorage.setItem('custom-dictionary', JSON.stringify(customDictionary));
    localStorage.setItem('custom-nanda-recommends', JSON.stringify(customNanda));
    setIsSettingMode(false);
    alert('태그 및 용어 사전이 동기화되었습니다.');
  };

  const handleAddTimeline = (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    const newTimeline = { 
      id: Date.now(), 
      time: time || '00:00', 
      content: content.trim() 
    };
    
    const updated = [...timelines, newTimeline].sort((a, b) => a.time.localeCompare(b.time));
    
    setTimelines(updated);
    setContent('');
    
    handleSaveCurrentLogState(updated, ward, date);
  };

  const handleUpdateTimeline = (id, nextTime, nextContent) => {
    const updated = timelines.map(t => t.id === id ? { ...t, time: nextTime, content: nextContent } : t).sort((a, b) => a.time.localeCompare(b.time));
    setTimelines(updated);
    handleSaveCurrentLogState(updated, ward, date);
  };

  const handleDeleteTimeline = (id) => {
    const updated = timelines.filter(item => item.id !== id);
    setTimelines(updated);
    handleSaveCurrentLogState(updated, ward, date);
  };

  const handleApplyDutySkeleton = (dutyType) => {
    if (timelines.length > 0 && !window.confirm('기존 항목이 지워집니다. 불러오시겠습니까?')) return;
    const skeleton = customSkeletons[dutyType];
    const newTimelines = skeleton.map((item, idx) => ({ id: Date.now() + idx, time: item.time, content: item.content }));
    setTimelines(newTimelines);
    handleSaveCurrentLogState(newTimelines, ward, date);
  };

  const handleShortcutClick = (tag) => {
    setContent(prev => prev ? `${prev} ${tag}` : tag);
    if (customNanda[tag]) {
      setRecommend({ tag, diagnoses: customNanda[tag].diagnoses, interventions: customNanda[tag].interventions });
    }
  };

  const handleSearchWord = (e) => {
    const query = e.target.value;
    setSearchWord(query);
    if (!query.trim()) return setSearchResult(null);
    const matchedKey = Object.keys(customDictionary).find(key => key.toLowerCase() === query.trim().toLowerCase());
    setSearchResult(matchedKey ? customDictionary[matchedKey] : null);
  };

  const handleInsertTerm = () => {
    if (!searchResult) return;
    setContent(prev => prev ? `${prev} [${searchResult.term || '약어'}: ${searchResult.definition}]` : `[${searchResult.term || '약어'}: ${searchResult.definition}]`);
    setSearchWord(''); setSearchResult(null);
  };

  const handleCopyText = () => {
    if (timelines.length === 0) return alert('복사할 내용이 없습니다!');
    const textResult = `[실습 일지 - ${date} / ${ward || '병동 미정'}]\n\n` + timelines.map(t => `${t.time} : ${t.content}`).join('\n');
    navigator.clipboard.writeText(textResult).then(() => alert('클립보드 복사 완료!')).catch(() => alert('복사 실패.'));
  };

  // 필터링 파이프라인
  const uniqueWards = [...new Set(allLogs.filter(l => !l.isDeleted && l.ward).map(l => l.ward))];
  const [selectedWardFilter, setSelectedWardFilter] = useState(uniqueWards[0] || '');
  
  useEffect(() => {
    if (uniqueWards.length > 0 && !uniqueWards.includes(selectedWardFilter)) {
      setSelectedWardFilter(uniqueWards[0]);
    }
  }, [allLogs]);

  const filteredLogs = allLogs.filter(log => {
    if (archiveFilter === 'trash') return log.isDeleted;
    if (log.isDeleted) return false;
    if (archiveFilter === 'all') return true;
    if (archiveFilter === 'favorite') return log.isFavorite;
    if (archiveFilter === 'ward') return log.ward === selectedWardFilter;
    return true;
  });

  return (
    <div className="bg-white sm:bg-slate-50 min-h-screen antialiased select-none flex items-start sm:items-center justify-center">
      
      <div className="w-full min-h-screen sm:min-h-[85vh] sm:max-w-md bg-white shadow-none sm:shadow-2xl flex flex-col justify-between relative sm:border sm:border-slate-200/60 sm:rounded-3xl">
        
        <header className="bg-white/80 backdrop-blur-md text-slate-800 p-4 sticky top-0 z-20 shadow-sm flex justify-between items-center border-b border-slate-100">
          <div className="flex items-center gap-2 cursor-pointer group" onClick={() => setCurrentView('dashboard')}>
            <div className="w-8 h-8 bg-indigo-50 rounded-xl flex items-center justify-center shadow-sm group-active:scale-95 transition">
              <span className="text-lg"><BookHeart size={18} className="text-indigo-600" /></span>
            </div>
            <h1 className="text-base font-black tracking-tight bg-gradient-to-r from-indigo-600 to-indigo-800 bg-clip-text text-transparent">
              간호 포트폴리오
            </h1>
          </div>
        </header>

        {currentView === 'dashboard' && (
          <div className="flex-1 flex flex-col overflow-y-auto bg-gradient-to-b from-white to-slate-50/50">
            <Dashboard 
              allLogs={allLogs} 
              onNewLog={handleCreateNewLog} 
              setCurrentView={setCurrentView}
              setArchiveFilter={setArchiveFilter}
              setIsSettingMode={setIsSettingMode}
            />
          </div>
        )}

        {currentView === 'editor' && (
          <div className="flex-1 flex flex-col overflow-y-auto bg-white">
            <Editor 
              date={date} setDate={setDate} ward={ward} setWard={setWard} timelines={timelines} setTimelines={setTimelines}
              customShortcuts={customShortcuts} customNanda={customNanda} customSkeletons={customSkeletons} customDictionary={customDictionary}
              onSave={handleSaveCurrentLogState} setCurrentView={setCurrentView} handleApplyDutySkeleton={handleApplyDutySkeleton}
              handleShortcutClick={handleShortcutClick} handleAddTimeline={handleAddTimeline} handleUpdateTimeline={handleUpdateTimeline}
              handleDeleteTimeline={handleDeleteTimeline} handleCopyText={handleCopyText} time={time} setTime={setTime}
              content={content} setContent={setContent} searchWord={searchWord} handleSearchWord={handleSearchWord}
              searchResult={searchResult} handleInsertTerm={handleInsertTerm} recommend={recommend} setRecommend={setRecommend}
            />
          </div>
        )}

        {currentView === 'archive' && (
          <div className="flex-1 flex flex-col overflow-y-auto bg-slate-50/30">
            <Archive 
              allLogs={allLogs}
              setAllLogs={setAllLogs}
              filteredLogs={filteredLogs} 
              archiveFilter={archiveFilter} 
              setArchiveFilter={setArchiveFilter} 
              uniqueWards={uniqueWards}
              selectedWardFilter={selectedWardFilter} 
              setSelectedWardFilter={setSelectedWardFilter} 
              setCurrentView={setCurrentView}
              handleLoadLogForEdit={handleLoadLogForEdit} 
              handleToggleFavorite={handleToggleFavorite} 
              handleMoveToTrash={handleMoveToTrash}
              handleRestoreFromTrash={handleRestoreFromTrash}  
              handlePermanentDelete={handlePermanentDelete}

              setSelectedLogId={setSelectedLogId}
              fileSelect={fileSelect}
              onSelectComplete={()=>{
                setFileSelect(false);
                setCurrentView('newCase');
              }}
            />
          </div>
        )}

        {(currentView === 'newCase' || (currentView === 'archive' && fileSelect)) && (
          <div className={`flex-1 flex flex-col overflow-y-auto bg-white ${
              currentView === 'archive' ? 'hidden' : 'flex'
            }`}
          >
            <TestCase 
              allLogs={allLogs}
              setAllLogs={setAllLogs}
              selectedLogId={selectedLogId}

              loadLogToEditor={loadLogToEditor}
              setCurrentView={setCurrentView}
              onSelectMode={() => {
                setFileSelect(true);
                setCurrentView('archive');
              }}
            />
          </div>
        )}

        {currentView === 'dictionary' && (
          <div className="flex-1 flex flex-col overflow-y-auto bg-white">
            <Dictionary 
              customDictionary={customDictionary} setCurrentView={setCurrentView} searchWord={searchWord}
              handleSearchWord={handleSearchWord} searchResult={searchResult}
            />
          </div>
        )}

        {isSettingMode && (
          <SettingModal 
            setIsSettingMode={setIsSettingMode} activeSettingTab={activeSettingTab} setActiveSettingTab={setActiveSettingTab}
            customSkeletons={customSkeletons} handleUpdateCustomSkeleton={handleUpdateCustomSkeleton} handleSaveCustomSkeletons={handleSaveCustomSkeletons}
            customShortcuts={customShortcuts} newTag={newTag} setNewTag={setNewTag} newNandaDiagnoses={newNandaDiagnoses}
            setNewNandaDiagnoses={setNewNandaDiagnoses} newNandaInterventions={newNandaInterventions} setNewNandaInterventions={setNewNandaInterventions}
            handleAddCustomTag={handleAddCustomTag} handleDeleteCustomTag={handleDeleteCustomTag} customNanda={customNanda}
            newDictKey={newDictKey} setNewDictKey={setNewDictKey} newDictTerm={newDictTerm} setNewDictTerm={setNewDictTerm}
            newDictDef={newDictDef} setNewDictDef={setNewDictDef} newDictNote={newDictNote} setNewDictNote={setNewDictNote}
            handleAddCustomDict={handleAddCustomDict} customDictionary={customDictionary} handleDeleteCustomDict={handleDeleteCustomDict}
            handleSaveTagsAndDict={handleSaveTagsAndDict} DEFAULT_DUTY_SKELETONS={DEFAULT_DUTY_SKELETONS}
            DEFAULT_SHORTCUTS={DEFAULT_SHORTCUTS} DEFAULT_DICTIONARY={DEFAULT_DICTIONARY} DEFAULT_NANDA={DEFAULT_NANDA}
          />
        )}

      </div>
    </div>
  );
}



