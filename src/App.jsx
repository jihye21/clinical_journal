import React, { useState, useEffect } from 'react';

const SHORTCUTS = [
  '#Vital Sign 측정', '#BST 측정', '#Rounding 동행', '#Bedmaking', 
  '#투약 관찰', '#핵심술기 관찰', '#Case 환자 파악', '#의학용어 정리', '#인계 청취'
];

const NANDA_RECOMMENDS = {
  '#Vital Sign 측정': {
    diagnoses: ['비효과적 호흡 양상', '고체온', '비효과적 말초조직 관류'],
    interventions: '환자의 활력징후 변화 추이를 정기적으로 모니터링하고, 이상 징후 발생 시 즉시 보고 및 처방에 따른 처치 보조.'
  },
  '#BST 측정': {
    diagnoses: ['불안정한 혈당 수치의 위험', '지식 부족'],
    interventions: '식전/식후 혈당을 정밀 측정하여 기록하고, 저혈당 징후 관찰 시 즉시 단순당 공급 보조.'
  },
  '#투약 관찰': {
    diagnoses: ['낙상 위험성', '알레르기 반응 위험성', '체액 불균형'],
    interventions: '투약 전 5 Rights를 철저히 확인하는 과정을 관찰함. 고위험 약물 투여 후 부작용 및 부위 발적 여부를 모니터링.'
  },
  '#Case 환자 파악': {
    diagnoses: ['급성 통증', '감염 위험성', '불안'],
    interventions: '대상자의 주증상(CC)과 NRS 통증 점수를 사정하고, EMR 상의 진단검사 결과 변동 추이를 분석.'
  }
};

const MEDICAL_DICTIONARY = {
  'V/S': { term: 'Vital Signs', definition: '활력징후 (혈압, 맥박, 호흡, 체온)', note: '환자의 생리적 상태 변화를 나타내는 가장 기본적이고 최우선적인 지표.' },
  'BST': { term: 'Blood Sugar Test', definition: '간이 혈당 검사', note: '당뇨 환자의 혈당 조절 상태를 확인하기 위해 지정된 식전/식후 스케줄에 맞춰 시행.' },
  'NPO': { term: 'Nothing by Mouth', definition: '금식', note: '수술이나 특정 검사 전 흡인 예방을 위해 철저한 통제가 필요함.' },
  'AMB': { term: 'Ambulation', definition: '보행 / 조기 이동', note: '수술 후 합병증 예방을 위해 조기 보행을 격려하되 낙상에 극도로 주의.' },
  'PRN': { term: 'As needed', definition: '필요시마다 (수시 처방)', note: '통증, 고체온 등 환자가 증상을 호소할 때 처방 범위 내에서 임시로 투여하는 약물.' }
};

const DUTY_SKELETONS = {
  Day: [
    { time: '07:30', content: '나이트번-데번 인수인계 청취 및 담당 파트 병동 라운딩 동행' },
    { time: '09:00', content: '정규 Vital Sign 및 식후 BST 측정 보조 (#Vital Sign 측정)' },
    { time: '10:30', content: '수석간호사 회진 관찰 및 담당 침상 정리 정돈 협조 (#Bedmaking)' },
    { time: '12:00', content: '점심 식전 BST 측정 조력 및 정규 경구/주사 투약 과정 관찰 (#투약 관찰)' },
    { time: '14:00', content: '퇴근 전 마지막 정규 Vital Sign 측정 및 이브닝번 인계 준비' }
  ],
  Evening: [
    { time: '15:00', content: '데이번-이브닝번 인수인계 청취 및 담당 파트 병동 라운딩 동행' },
    { time: '16:00', content: '정규 Vital Sign 및 식후 BST 측정 보조 (#Vital Sign 측정)' },
    { time: '18:00', content: '저녁 식전 BST 측정 조력 및 저녁 투약 라운딩 과정 밀착 관찰 (#투약 관찰)' },
    { time: '20:00', content: '야간 처방 라운딩 동행 및 특이 케이스 관찰' },
    { time: '21:30', content: '야간 정규 Vital Sign 측정 및 나이트번 인계 리포트 준비' }
  ]
};

/* 타임라인 편집 함수*/
function TimelineItem({ item, onUpdate, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(item.content);
  const [editTime, setEditTime] = useState(item.time);

  useEffect(() => {
    setEditContent(item.content);
    setEditTime(item.time);
  }, [item]);

  const handleSave = () => {
    onUpdate(item.id, editTime, editContent);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="ml-4 relative bg-white p-3 rounded-lg border border-indigo-200 shadow-sm space-y-2 animate-fadeIn">
        <div className="absolute -left-[23px] bg-indigo-600 w-2.5 h-2.5 rounded-full mt-2.5 ring-4 ring-white"></div>
        <div className="flex gap-2">
          <input type="time" value={editTime} onChange={(e) => setEditTime(e.target.value)} className="p-1 border rounded text-xs w-24 font-medium focus:outline-indigo-500" />
          <button type="button" onClick={handleSave} className="bg-indigo-600 text-white text-xs font-bold px-2.5 py-1 rounded shadow">저장</button>
          <button type="button" onClick={() => setIsEditing(false)} className="bg-gray-200 text-gray-700 text-xs font-bold px-2.5 py-1 rounded">취소</button>
        </div>
        <input type="text" value={editContent} onChange={(e) => setEditContent(e.target.value)} className="w-full p-2 border rounded text-sm focus:outline-indigo-500" />
      </div>
    );
  }

  return (
    <div className="ml-4 relative bg-white p-3 rounded-lg border border-gray-100 shadow-sm group animate-fadeIn">
      <div className="absolute -left-[23px] bg-indigo-600 w-2.5 h-2.5 rounded-full mt-2 ring-4 ring-white"></div>
      <div>
        <span className="text-xs font-bold text-indigo-600 block">{item.time}</span>
        <p className="text-sm text-gray-800 break-all pr-2 mt-0.5">{item.content}</p>
        <div className="flex gap-3 mt-2 border-t pt-1.5 border-gray-50">
          <button type="button" onClick={() => setIsEditing(true)} className="text-[11px] text-indigo-600 font-bold hover:underline">
            📝 내용 수정
          </button>
          <button type="button" onClick={() => onDelete(item.id)} className="text-[11px] text-red-500 font-bold hover:underline">
            🗑️ 삭제
          </button>
        </div>
      </div>
    </div>
  );
}

// =========================================================================
// 메인
// =========================================================================
export default function App() {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [ward, setWard] = useState('');
  const [timelines, setTimelines] = useState([]);
  const [time, setTime] = useState('');
  const [content, setContent] = useState('');

  const [recommend, setRecommend] = useState(null); 
  const [searchWord, setSearchWord] = useState(''); 
  const [searchResult, setSearchResult] = useState(null); 

  //스케쥴 루틴화 상태 관리
  const [isSettingMode, setIsSettingMode] = useState(false);
  const [customSkeletons, setCustomSkeletons] = useState(DUTY_SKELETONS);

  //커스텀 태그 & 의학 용어 사전 상태 관리
  const [activeSettingTab, setActiveSettingTab] = useState('routine');
  const [customShortcuts, setCustomShortcuts] = useState(SHORTCUTS);
  const [customDictionary, setCustomDictionary] = useState(MEDICAL_DICTIONARY)

  //NANDA 상태
  const [customNanda, setCutsomNanda] = useState(NANDA_RECOMMENDS);
  const [newNandaDiagnoses, setNewNandaDiagnoses] = useState('');
  const [newNandaInterventions, setNewNandaInterventions] = useState('');

  //태그 및 용어 추가를 위한 임시 인풋 상태
  const [newTag, setNewTag] = useState('');
  const [newDictKey, setNewDictKey] = useState('');
  const [newDictTerm, setNewDictTerm] = useState('');
  const [newDictDef, setNewDictDef] = useState('');
  const [newDictNote, setNewDictNote] = useState('');

  useEffect(() => {
    const savedData = localStorage.getItem(`log-${date}`);
    if (savedData) {
      const parsed = JSON.parse(savedData);
      setWard(parsed.ward || '');
      setTimelines(parsed.timelines || []);
    } else {
      setWard('');
      setTimelines([]);
    }

    //커스텀 스케쥴
    const savedSkeletons = localStorage.getItem('custom-duty-skeletons');
    if(savedSkeletons) setCustomSkeletons(JSON.parse(savedSkeletons));
    //커스텀 태그
    const savedShortcuts = localStorage.getItem('custom-shortcuts');
    if (savedShortcuts) setCustomShortcuts(JSON.parse(savedShortcuts));
    //커스텀 사전
    const savedDict = localStorage.getItem('custom-dictionary');
    if (savedDict) setCustomDictionary(JSON.parse(savedDict));
    //커스텀 Nanda 
    const savedNanda = localStorage.getItem('custom-nanda-recommends');
    if(savedNanda) setCutsomNanda(JSON.parse(savedNanda));

    const now = new Date();
    setTime(`${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`);
  }, [date]);

  const saveLog = (updatedTimelines, updatedWard = ward) => {
    const logData = { date, ward: updatedWard, timelines: updatedTimelines };
    localStorage.setItem(`log-${date}`, JSON.stringify(logData));
  };

  const handleApplyDutySkeleton = (dutyType) => {
    if (timelines.length > 0 && !window.confirm('이미 작성 중인 항목들이 있습니다. 지우고 새로 불러오시겠습니까?')) {
      return;
    }
    const skeleton = DUTY_SKELETONS[dutyType];
    const newTimelines = skeleton.map((item, idx) => ({
      id: Date.now() + idx,
      time: item.time,
      content: item.content
    })).sort((a, b) => a.time.localeCompare(b.time));
    setTimelines(newTimelines);
    saveLog(newTimelines);
  };

  //루틴 편집 수정
  const handleUpdateCustomSkeleton = (dutyType, index, field, value) => {
    const updateSkeletons = { ...customSkeletons};
    updateSkeletons[dutyType][index][field] = value;
    setCustomSkeletons(updateSkeletons);
  };

  const handleAddCustomTag = () => {
    if (!newTag.trim()) {
      alert('추가할 태그명을 입력해 주세요.');
      return;
    }
    const formattedTag = newTag.trim().startsWith('#') ? newTag.trim() :
      '#${newTag.trim()}';
    
    if(customShortcuts.includes(formattedTag)) {
      alert('이미 존재하는 태그입니다.');
      return;
    }

    const diagnoseArray = newNandaDiagnoses.trim()
      ? newNandaDiagnoses.split(',').map(d => d.trim()).filter(Boolean)
      : [];

      //태그 목록에 새 태그 추가
      setCustomShortcuts([...customShortcuts, formattedTag]);

      //NANDA 추가
      setCutsomNanda({
        ...customNanda,
        [formattedTag]: {
          diagnoses: diagnosesArray,
          interventions: setNewNandaInterventions.trim() || '사용자가 등록한 실습 가이드입니다.'
        }
      });

      //입력 폼 초기화
      setNewTag('');
      setNewNandaDiagnoses('');
      setNewNandaInterventions('');
  };

  const handleDeleteCustomTag = (tagToDelete) => {
    setCustomShortcuts(customShortcuts.filter(tag => tag !== tagToDelete));

    const updatedNanda = { ...customNanda };
    delete updatedNanda[tagToDelete];
    setCutsomNanda(updatedNanda);
  };

  const handleAddCustomDict = () => {
    if (!newDictKey.trim() || !newDictTerm.trim() || !newDictDef.trim()) {
      alert('약어, 원어, 의미를 모두 입력해주세요.');
      return;
    }
    const key = newDictKey.trim().toUpperCase();
    const updatedDict = {
      ...customDictionary,
      [key]: {
        term: newDictTerm.trim(),
        definition: newDictDef.trim(),
        note: newDictNote.trim() || '사용자 등록 용어'
      }
    };
    setCustomDictionary(updatedDict);
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
    
    alert('저장 되었습니다.');
  };

  const handleSaveMasterSettings = () => {
    localStorage.setItem('custom-duty-skeletons', JSON.stringify(customSkeletons));
    localStorage.setItem('custom-shortcuts', JSON.stringify(shortcuts));
    localStorage.setItem('custom-dictionary', JSON.stringify(medicalDictionary));
    setIsSettingMode(false);
    alert('모든 설정이 저장되었습니다.');
  }

  const handleResetMasterSettings = () => {
    if(!window.confirm('초기화 하시겠습니까?')) return;
    localStorage.removeItem('custom-duty-skeletons');
    localStorage.removeItem('custom-shortcuts');
    localStorage.removeItem('custom-dictionary');
    setCustomSkeletons(DEFAULT_DUTY_SKELETONS);
    setShortcuts(DEFAULT_SHORTCUTS);
    setMedicalDictionary(DEFAULT_MEDICAL_DICTIONARY);
    alert('초기화 되었습니다.');
  };

  const handleSaveCustomSkeletons = () => {
    localStorage.setItem('custom-duty-skeletons', JSON.stringify(customSkeletons));
    setIsSettingMode(false);
    alert('나만의 스케줄이 저장되었습니다!');
  };

  const handleAddTimeline = (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    const newTimeline = { id: Date.now(), time, content };
    const updated = [...timelines, newTimeline].sort((a, b) => a.time.localeCompare(b.time));
    
    setTimelines(updated);
    setContent('');
    saveLog(updated);
  };

  const handleUpdateTimeline = (id, nextTime, nextContent) => {
    const updated = timelines.map(t => 
      t.id === id ? { ...t, time: nextTime, content: nextContent } : t
    ).sort((a, b) => a.time.localeCompare(b.time));
    setTimelines(updated);
    saveLog(updated);
  };

  const handleDeleteTimeline = (id) => {
    const updated = timelines.filter(item => item.id !== id);
    setTimelines(updated);
    saveLog(updated);
  };

  const handleShortcutClick = (tag) => {
    setContent(prev => prev ? `${prev} ${tag}` : tag);
    if (NANDA_RECOMMENDS[tag]) {
      setRecommend({
        tag: tag,
        diagnoses: NANDA_RECOMMENDS[tag].diagnoses,
        interventions: NANDA_RECOMMENDS[tag].interventions
      });
    }
  };

  const handleSearchWord = (e) => {
    const query = e.target.value;
    setSearchWord(query);
    if (!query.trim()) {
      setSearchResult(null);
      return;
    }
    const matchedKey = Object.keys(customDictionary).find(
      key => key.toLowerCase() === query.trim().toLowerCase()
    );
    setSearchResult(matchedKey ? customDictionary[matchedKey] : null);
  };

  const handleInsertTerm = () => {
    if (!searchResult) return;
    const termText = `[${searchResult.term}: ${searchResult.definition}]`;
    setContent(prev => prev ? `${prev} ${termText}` : termText);
    setSearchWord('');
    setSearchResult(null);
  };

  const handleCopyText = () => {
    if (timelines.length === 0) {
      alert('복사할 내용이 없습니다!');
      return;
    }
    const textResult = `[실습 일지 - ${date} / ${ward || '병동 미지정'}]\n\n` + 
      timelines.map(t => `${t.time} : ${t.content}`).join('\n');
    
    navigator.clipboard.writeText(textResult)
      .then(() => alert('클립보드 복사 완료! PC 지침서 파일에 붙여넣으세요.'))
      .catch(() => alert('복사 실패.'));
  };

return (
    <div className="max-w-md mx-auto bg-white min-h-screen shadow-lg flex flex-col justify-between relative border-x">
      {/* 고정 상단 헤더 */}
      <header className="bg-indigo-600 text-white p-4 sticky top-0 z-10 shadow flex justify-between items-center">
        <h1 className="text-xl font-bold tracking-tight">간호 실습 일지</h1>
        <button type="button" onClick={() => setIsSettingMode(true)} className="text-xs bg-indigo-700 hover:bg-indigo-800 px-3 py-1.5 rounded-lg border border-indigo-500 font-bold transition">
          ⚙️
        </button>
      </header>

      {/* 메인 콘텐츠 */}
      <main className="p-4 flex-1 space-y-5 overflow-y-auto">
        {/* 날짜/병동 선택 */}
        <div className="grid grid-cols-2 gap-3 bg-gray-50 p-3 rounded-xl border border-gray-100">
          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-1">실습 일자</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full p-2 border rounded-lg text-sm focus:outline-indigo-500 font-medium" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-400 mb-1">실습 병동</label>
            <input type="text" placeholder="예: 6B 소아과" value={ward} onChange={(e) => { setWard(e.target.value); saveLog(timelines, e.target.value); }} className="w-full p-2 border rounded-lg text-sm focus:outline-indigo-500" />
          </div>
        </div>

        {/* 루틴 스케줄 자동화 */}
        <div className="bg-amber-50/70 border border-amber-200 p-3 rounded-xl space-y-2">
          <div className="flex justify-between items-center">
            <span className="block text-xs font-bold text-amber-800">⏱️ 스케쥴 루틴화</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button type="button" onClick={() => handleApplyDutySkeleton('Day')} className="text-xs bg-white text-amber-800 font-bold py-2.5 px-3 rounded-lg border border-amber-200 shadow-sm active:scale-95 transition">
              ☀️ Day 
            </button>
            <button type="button" onClick={() => handleApplyDutySkeleton('Evening')} className="text-xs bg-white text-amber-800 font-bold py-2.5 px-3 rounded-lg border border-amber-200 shadow-sm active:scale-95 transition">
              🌙 Evening
            </button>
          </div>
        </div>

        {/* 의학용어 검색 */}
        <div className="bg-gray-50 border border-gray-200 p-3 rounded-xl space-y-2">
          <span className="block text-xs font-bold text-gray-500">🔍 의학용어 / 단골 약어 검색</span>
          <input type="text" placeholder="약어를 입력하세요 (예: V/S, BST, NPO, PRN)" value={searchWord} onChange={handleSearchWord} className="w-full p-2 border rounded-lg text-sm focus:outline-indigo-500 uppercase font-semibold text-indigo-600" />
          
          {searchResult && (
            <div className="bg-white p-3 rounded-lg border border-indigo-200 space-y-1.5 text-xs shadow-sm">
              <div className="flex justify-between items-center border-b pb-1">
                <span className="font-bold text-indigo-700 text-sm">{searchResult.term}</span>
                <button type="button" onClick={handleInsertTerm} className="bg-indigo-600 text-white font-bold px-2 py-1 rounded-md text-[11px] hover:bg-indigo-700 active:scale-95 transition">
                  + 기록창에 주입
                </button>
              </div>
              <p className="font-semibold text-gray-700">의미: <span className="font-normal text-gray-900">{searchResult.definition}</span></p>
              <p className="text-gray-500 bg-slate-50 p-1.5 rounded border border-dashed">💡 실습 기록 팁: {searchResult.note}</p>
            </div>
          )}
        </div>

        {/* 키워드 */}
        <div>
          <span className="block text-xs font-bold text-gray-500 mb-2">💡 자주 쓰는 실습 내용 태그</span>
          <div className="flex flex-wrap gap-1.5">
            {customShortcuts.map((tag) => (
              <button key={tag} type="button" onClick={() => handleShortcutClick(tag)} className="text-xs bg-indigo-50 text-indigo-700 font-semibold px-3 py-1.5 rounded-full border border-indigo-100 hover:bg-indigo-100 active:scale-95 transition">
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* 활동 내용 입력 */}
        <form onSubmit={handleAddTimeline} className="space-y-3 bg-indigo-50/60 p-4 rounded-xl border border-indigo-100 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-indigo-900 tracking-tight flex items-center gap-1">
              ✨ 실습 기록 추가
            </span>
          </div>
          
          <div className="space-y-2.5">
            <input 
              type="text" 
              placeholder="수행 및 관찰 내용을 적어보세요" 
              value={content} 
              onChange={(e) => setContent(e.target.value)} 
              className="w-full p-3 bg-white border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm placeholder:text-gray-300 text-gray-800 transition" 
              required 
            />

            <div className="flex justify-between items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-gray-400">기록 시간:</span>
                <input 
                  type="time" 
                  value={time} 
                  onChange={(e) => setTime(e.target.value)} 
                  className="w-32 p-2 bg-white border border-gray-200 rounded-xl text-xs font-bold text-center text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm transition" 
                  required 
                />
              </div>

              <button 
                type="submit" 
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold h-9 px-5 rounded-xl active:scale-95 transition shadow-md flex items-center justify-center text-xs whitespace-nowrap"
              >
                기록 등록
              </button>
            </div>
          </div>
        </form>




        {/* 타임라인 */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-gray-800 border-b pb-1.5">오늘의 타임라인 ({timelines.length}건)</h3>
          {timelines.length === 0 ? (
            <p className="text-center text-sm text-gray-400 py-12 leading-relaxed">기록된 실습 내용이 없습니다.<br/>위에서 듀티별 스케쥴을 불러오거나 항목을 입력하세요.</p>
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
      </main>

      {/* 내보내기 버튼 */}
      <footer className="p-4 bg-gray-50 border-t sticky bottom-0 z-10">
        <button type="button" onClick={handleCopyText} className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold p-3.5 rounded-xl shadow-md active:scale-[0.99] transition flex justify-center items-center gap-2">
          일지 내용 복사하기
        </button>
      </footer>

      {/* NANDA 간호진단 분석 */}
      {recommend && (
        <div className="absolute bottom-24 left-4 right-4 bg-white border-2 border-indigo-600 rounded-xl p-4 shadow-2xl z-20">
          <div className="flex justify-between items-center border-b pb-2 mb-2.5">
            <span className="text-xs font-bold text-indigo-600 flex items-center gap-1">
              💡 {recommend.tag} 연계 간호과정 분석 팁
            </span>
            <button type="button" onClick={() => setRecommend(null)} className="text-sm font-bold text-gray-400 hover:text-gray-600 px-1">✕</button>
          </div>
          <div className="space-y-3 text-xs">
            <div>
              <span className="font-bold text-gray-500 block mb-1">추천 NANDA 간호진단 목록:</span>
              <div className="flex flex-wrap gap-1">
                {recommend.diagnoses.map(d => (
                  <span key={d} className="bg-rose-50 text-rose-700 border border-rose-100 px-2 py-0.5 rounded font-bold text-[11px]">{d}</span>
                ))}
              </div>
            </div>
            <div>
              <span className="font-bold text-gray-500 block mb-1">지침서 및 케이스 추천 기술 내용:</span>
              <p className="text-gray-700 bg-slate-50 p-2.5 rounded-lg border leading-relaxed text-[11px] font-medium">{recommend.interventions}</p>
            </div>
          </div>
        </div>
      )}

      {/* 커스텀 스케쥴 편집 */}
      {isSettingMode && (
        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm z-30 flex flex-col justify-end">
          <div className="bg-white max-h-[90vh] rounded-t-2xl p-4 flex flex-col justify-between shadow-2xl overflow-hidden">
            
            {/* 설정창 헤더 */}
            <div className="flex justify-between items-center border-b pb-2 mb-2">
              <div>
                <h2 className="text-base font-bold text-gray-800">⚙️ 시스템</h2>
              </div>
              <button type="button" onClick={() => setIsSettingMode(false)} className="text-gray-400 hover:text-gray-600 font-bold p-1 text-sm">✕</button>
            </div>

            {/* 💡 상단 탭 내비게이션 (루틴 스케줄 vs 태그/용어 관리) */}
            <div className="flex border-b mb-3 text-xs font-bold text-center">
              <button type="button" onClick={() => setActiveSettingTab('routine')} className={`flex-1 py-2 border-b-2 ${activeSettingTab === 'routine' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-400'}`}>
                루틴 편집
              </button>
              <button type="button" onClick={() => setActiveSettingTab('tags')} className={`flex-1 py-2 border-b-2 ${activeSettingTab === 'tags' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-400'}`}>
                태그 / 용어 편집
              </button>
            </div>

            {/* 설정 데이터 콘텐츠 스크롤 에어리어 */}
            <div className="flex-1 overflow-y-auto pr-1 text-xs mb-4 space-y-4">
              
              {/* 루틴 기본값 편집 구조 */}
              {activeSettingTab === 'routine' && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <span className="font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-100">☀️ Day 루틴 기본값 편집</span>
                    {customSkeletons.Day.map((item, idx) => (
                      <div key={item.id} className="flex gap-2 items-center bg-gray-50 p-1.5 rounded-lg border">
                        <input type="time" value={item.time} onChange={(e) => handleUpdateCustomSkeleton('Day', idx, 'time', e.target.value)} className="p-1 border rounded w-24 font-semibold text-center focus:outline-indigo-500" />
                        <input type="text" value={item.content} onChange={(e) => handleUpdateCustomSkeleton('Day', idx, 'content', e.target.value)} className="flex-1 p-1.5 border rounded text-gray-700 focus:outline-indigo-500" />
                      </div>
                    ))}
                  </div>

                  <div className="space-y-2 pt-2 border-t border-gray-100">
                    <span className="font-bold text-indigo-800 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">🌙 Evening 루틴 기본값 편집</span>
                    {customSkeletons.Evening.map((item, idx) => (
                      <div key={item.id} className="flex gap-2 items-center bg-gray-50 p-1.5 rounded-lg border">
                        <input type="time" value={item.time} onChange={(e) => handleUpdateCustomSkeleton('Evening', idx, 'time', e.target.value)} className="p-1 border rounded w-24 font-semibold text-center focus:outline-indigo-500" />
                        <input type="text" value={item.content} onChange={(e) => handleUpdateCustomSkeleton('Evening', idx, 'content', e.target.value)} className="flex-1 p-1.5 border rounded text-gray-700 focus:outline-indigo-500" />
                      </div>
                    ))}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 border-t pt-3">
                    <button type="button" onClick={() => { setCustomSkeletons(DEFAULT_DUTY_SKELETONS); localStorage.removeItem('custom-duty-skeletons'); alert('루틴 뼈대가 원상복구 되었습니다.'); }} className="bg-gray-100 text-gray-600 font-bold p-2 rounded-xl text-xs">기본값 리셋</button>
                    <button type="button" onClick={handleSaveCustomSkeletons} className="bg-indigo-600 text-white font-bold p-2 rounded-xl text-xs shadow">💾 루틴 저장</button>
                  </div>
                </div>
              )}

              {/*태그 및 의학용어 편집 구조 */}
              {activeSettingTab === 'tags' && (
                <div className="space-y-4">
                  {/* 자주 쓰는 태그 */}
                  <div className="space-y-2 bg-slate-50/70 p-3 rounded-xl border border-gray-200">
                    <span className="font-bold text-gray-700 block text-xs">실습 태그 </span>
                    
                    <div className="space-y-2 bg-white p-2.5 rounded-lg border">
                      <div>
                        <label className="block text-[11px] font-bold text-gray-400 mb-1">1. 태그명</label>
                        <input type="text" placeholder="예: #처치관찰" value={newTag} onChange={(e) => setNewTag(e.target.value)} className="w-full p-1.5 border rounded-lg text-xs focus:outline-indigo-500" />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-gray-400 mb-1">2. 연계 NANDA 간호진단</label>
                        <input type="text" placeholder="예: 급성 통증, 감염 위험성, 피부 통합성 장애" value={newNandaDiagnoses} onChange={(e) => setNewNandaDiagnoses(e.target.value)} className="w-full p-1.5 border rounded-lg text-xs focus:outline-indigo-500" />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-gray-400 mb-1">3. 실습지침서 추천 기록/중재 내용 가이드</label>
                        <textarea rows="2" placeholder="해당 행동 관찰 시 실습 지침서에 기록할 문장을 기술하세요." value={newNandaInterventions} onChange={(e) => setNewNandaInterventions(e.target.value)} className="w-full p-1.5 border rounded-lg text-xs focus:outline-indigo-500 resize-none leading-relaxed" />
                      </div>
                      <button type="button" onClick={handleAddCustomTag} className="w-full bg-indigo-600 text-white font-bold p-2 rounded-lg text-xs mt-1 hover:bg-indigo-700 shadow-sm active:scale-[0.99] transition">
                        태그 등록
                      </button>
                    </div>

                    {/* 등록된 태그 피드 목록 및 시각적 요약 팩 */}
                    <div className="flex flex-col gap-1.5 pt-1.5 max-h-48 overflow-y-auto pr-1">
                      {customShortcuts.map(tag => {
                        const hasNanda = customNanda[tag];
                        return (
                          <div key={tag} className="bg-white p-2 rounded-lg border text-[11px] flex justify-between items-start gap-2">
                            <div className="flex-1 space-y-1">
                              <span className="font-bold text-indigo-700">{tag}</span>
                              {hasNanda && hasNanda.diagnoses.length > 0 && (
                                <p className="text-[10px] text-rose-600 font-semibold">진단: {hasNanda.diagnoses.join(', ')}</p>
                              )}
                            </div>
                            <button type="button" onClick={() => handleDeleteCustomTag(tag)} className="text-red-400 font-bold hover:text-red-600 p-1 text-xs">삭제</button>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* 의학용어 사전 데이터 세트 관리 */}
                  <div className="space-y-2 bg-slate-50/50 p-2.5 rounded-xl border">
                    <span className="font-bold text-gray-700 block">의학용어 약어 추가</span>
                    <div className="grid grid-cols-2 gap-2">
                      <input type="text" placeholder="약어 (예: NPO)" value={newDictKey} onChange={(e) => setNewDictKey(e.target.value)} className="p-1.5 border rounded-lg bg-white uppercase font-bold" />
                      <input type="text" placeholder="원어 (예: Nothing by Mouth)" value={newDictTerm} onChange={(e) => setNewDictTerm(e.target.value)} className="p-1.5 border rounded-lg bg-white" />
                    </div>
                    <input type="text" placeholder="한글 의미 설명 (예: 금식)" value={newDictDef} onChange={(e) => setNewDictDef(e.target.value)} className="w-full p-1.5 border rounded-lg bg-white" />
                    <div className="flex gap-2">
                      <input type="text" placeholder="실습 팁 간략 메모 (선택)" value={newDictNote} onChange={(e) => setNewDictNote(e.target.value)} className="flex-1 p-1.5 border rounded-lg bg-white" />
                      <button type="button" onClick={handleAddCustomDict} className="bg-indigo-600 text-white px-4 font-bold rounded-lg text-xs whitespace-nowrap">사전 등록</button>
                    </div>

                    {/* 등록된 용어 리스트 */}
                    <div className="pt-2 space-y-1.5 max-h-40 overflow-y-auto">
                      {Object.keys(customDictionary).map(key => (
                        <div key={key} className="flex justify-between items-center bg-white p-2 rounded-lg border text-[11px]">
                          <div>
                            <span className="font-bold text-indigo-600">{key}</span> 
                            <span className="text-gray-400 mx-1">|</span> 
                            <span className="text-gray-700 font-medium">{customDictionary[key].definition}</span>
                          </div>
                          <button type="button" onClick={() => handleDeleteCustomDict(key)} className="text-red-400 font-bold hover:text-red-600 px-1">삭제</button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 최종 태그/용어 저장 버튼 */}
                  <div className="pt-2">
                    <button type="button" onClick={handleSaveTagsAndDict} className="w-full bg-slate-900 text-white font-bold p-3 rounded-xl text-xs shadow-md">
                      저장
                    </button>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      )}
    </div>
  );
}
