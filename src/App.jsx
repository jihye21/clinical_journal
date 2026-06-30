import React, { useState, useEffect } from 'react';

// 간호 실습 키워드
const SHORTCUTS = [
  '#Vital Sign 측정', '#BST 측정', '#Rounding 동행', '#Bedmaking', 
  '#투약 관찰', '#핵심술기 관찰', '#Case 환자 파악', '#의학용어 정리', '#인계 청취'
];

// 태그별 간호진단 및 추천 기록 내용
const NANDA_RECOMMENDS = {
  '#Vital Sign 측정': {
    diagnoses: ['비효과적 호흡 양상', '고체온', '비효과적 말초조직 관류'],
    interventions: '환자의 활력징후 변화 추이를 정기적으로 모니터링하고, 고체온이나 호흡 곤란 등 이상 징후 발생 시 즉시 보고 및 처방에 따른 처치 보조.'
  },
  '#BST 측정': {
    diagnoses: ['불안정한 혈당 수치의 위험', '지식 부족'],
    interventions: '식전/식후 혈당을 정밀 측정하여 기록하고, 저혈당 징후(식은땀, 떨림, 어지러움) 관찰 시 즉시 주임간호사 보고 및 단순당 공급 보조.'
  },
  '#투약 관찰': {
    diagnoses: ['낙상 위험성', '알레르기 반응 위험성', '체액 불균형'],
    interventions: '투약 전 5 Rights(환자, 약물, 용량, 경로, 시간)를 철저히 확인하는 과정을 관찰함. 고위험 약물 투여 후 부작용 및 부위 발적 여부를 밀착 모니터링.'
  },
  '#Case 환자 파악': {
    diagnoses: ['급성 통증', '감염 위험성', '불안'],
    interventions: '대상자가 호소하는 주증상(CC)과 NRS 통증 점수를 사정하고, EMR 상의 진단검사 결과(WBC, CRP, ESR 수치 등) 변동 추이를 분석하여 인계점에 대조함.'
  }
};

// 실습 단골 의학용어 및 약어 사전
const MEDICAL_DICTIONARY = {
  'V/S': { term: 'Vital Signs', definition: '활력징후 (혈압, 맥박, 호흡, 체온)', note: '환자의 생리적 상태 변화를 나타내는 가장 기본적이고 최우선적인 지표.' },
  'BST': { term: 'Blood Sugar Test', definition: '간이 혈당 검사', note: '당뇨 환자의 혈당 조절 상태를 확인하기 위해 지정된 식전/식후 스케줄에 맞춰 시행.' },
  'NPO': { term: 'Nothing by Mouth', definition: '금식', note: '수술이나 특정 검사 전 흡인 예방을 위해 철저한 통제가 필요하며, 수액 공급 상태(I/O)를 밀착 확인해야 함.' },
  'AMB': { term: 'Ambulation', definition: '보행 / 조기 이동', note: '수술 후 합병증(장폐색, 심부정맥혈전증 등) 예방을 위해 조기 보행을 격려하되, 기립성 저혈압으로 인한 낙상에 극도로 주의.' },
  'PRN': { term: 'As needed', definition: '필요시마다 (수시 처방)', note: '통증, 고체온, 불면 등 환자가 증상을 호소할 때 의사의 처방 범위 내에서 임시로 투여하는 약물.' },
  'CBC': { term: 'Complete Blood Count', definition: '전혈구 검사', note: 'WBC(감염), Hb(빈혈), Plt(지혈) 수치를 파악하여 오늘 환자의 급성기 염증 상태나 출혈 경향성을 파악함.' },
  'NRS': { term: 'Numerical Rating Scale', definition: '숫자 통증 등급 척도', note: '환자가 느끼는 통증의 강도를 0점부터 10점까지 숫자로 객관화하여 사정하는 도구.' }
};

// 듀티별 기본 타임라인 데이터
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
    { time: '20:00', content: '야간 처방(PRN 처치 및 처방 약물 변경) 라운딩 동행 및 특이 케이스 관찰' },
    { time: '21:30', content: '야간 정규 Vital Sign 측정 및 나이트번 인계 리포트 준비' }
  ]
};

// =========================================================================
// 메인
// =========================================================================
export default function App() {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [ward, setWard] = useState('');
  const [timelines, setTimelines] = useState([]);
  const [time, setTime] = useState('');
  const [content, setContent] = useState('');

  // 신규 고도화 기능용 상태 관리
  const [recommend, setRecommend] = useState(null); 
  const [searchWord, setSearchWord] = useState(''); 
  const [searchResult, setSearchResult] = useState(null); 

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
    const now = new Date();
    setTime(`${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`);
  }, [date]);

  const saveLog = (updatedTimelines, updatedWard = ward) => {
    const logData = { date, ward: updatedWard, timelines: updatedTimelines };
    localStorage.setItem(`log-${date}`, JSON.stringify(logData));
  };

  // 듀티별 생성 자동 채우기 기능
  const handleApplyDutySkeleton = (dutyType) => {
    if (timelines.length > 0 && !window.confirm('이미 작성 중인 타임라인 항목들이 있습니다. 지우고 뼈대 양식을 새로 불러오시겠습니까?')) {
      return;
    }
    const skeleton = DUTY_SKELETONS[dutyType];
    const newTimelines = skeleton.map((item, idx) => ({
      id: Date.now() + idx,
      time: item.time,
      content: item.content
    }));
    setTimelines(newTimelines);
    saveLog(newTimelines);
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

  const handleDelete = (id) => {
    const updated = timelines.filter(item => item.id !== id);
    setTimelines(updated);
    saveLog(updated);
  };

  // 상용구 클릭 및 진단 팝업 조건 검색
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

  // 의학용어 사전
  const handleSearchWord = (e) => {
    const query = e.target.value;
    setSearchWord(query);
    
    if (!query.trim()) {
      setSearchResult(null);
      return;
    }

    // 대소문자 관계없이 매칭 키 검색
    const matchedKey = Object.keys(MEDICAL_DICTIONARY).find(
      key => key.toLowerCase() === query.trim().toLowerCase()
    );

    if (matchedKey) {
      setSearchResult(MEDICAL_DICTIONARY[matchedKey]);
    } else {
      setSearchResult(null);
    }
  };

  // 찾은 의학용어 텍스트 필드에 즉시 주입 기능
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
      .then(() => alert('클립보드 복사 완료! PC 지침서 한글/워드 파일에 그대로 붙여넣으세요.'))
      .catch(() => alert('복사 실패. 브라우저 권한을 확인해주세요.'));
  };

  return (
    <div class="max-w-md mx-auto bg-white min-h-screen shadow-lg flex flex-col justify-between relative border-x">
      
      {/* 헤더 */}
      <header class="bg-indigo-600 text-white p-4 sticky top-0 z-10 shadow flex justify-between items-center">
        <h1 class="text-xl font-bold tracking-tight">🩺 간호 실습 일지</h1>
        <span class="text-xs bg-indigo-500 px-2.5 py-1 rounded-full font-bold">오프라인 모드</span>
      </header>

      {/* 메인 */}
      <main class="p-4 flex-1 space-y-5 overflow-y-auto">
        
        {/* 날짜/병동 선택 */}
        <div class="grid grid-cols-2 gap-3 bg-gray-50 p-3 rounded-xl border border-gray-100">
          <div>
            <label class="block text-xs font-semibold text-gray-400 mb-1">실습 일자</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} class="w-full p-2 border rounded-lg text-sm focus:outline-indigo-500 font-medium" />
          </div>
          <div>
            <label class="block text-xs font-semibold text-gray-400 mb-1">실습 병동</label>
            <input type="text" placeholder="예: 6B 소아과" value={ward} onChange={(e) => { setWard(e.target.value); saveLog(timelines, e.target.value); }} class="w-full p-2 border rounded-lg text-sm focus:outline-indigo-500" />
          </div>
        </div>

        {/* 루틴 스케줄 */}
        <div class="bg-amber-50/70 border border-amber-200 p-3 rounded-xl space-y-2">
          <span class="block text-xs font-bold text-amber-800">⏱️ 루틴 스케줄 고속 생성 (Schedule Auto-Fill)</span>
          <div class="grid grid-cols-2 gap-2">
            <button type="button" onClick={() => handleApplyDutySkeleton('Day')} class="text-xs bg-white text-amber-800 font-bold py-2.5 px-3 rounded-lg border border-amber-200 shadow-sm active:scale-95 transition">
              ☀️ Day 불러오기
            </button>
            <button type="button" onClick={() => handleApplyDutySkeleton('Evening')} class="text-xs bg-white text-amber-800 font-bold py-2.5 px-3 rounded-lg border border-amber-200 shadow-sm active:scale-95 transition">
              🌙 Evening 불러오기
            </button>
          </div>
        </div>

                {/* 의학용어 및 약어 검색 */}
        <div class="bg-gray-50 border border-gray-200 p-3 rounded-xl space-y-2">
          <span class="block text-xs font-bold text-gray-500">🔍 의학용어 / 단골 약어 즉석 딕셔너리</span>
          <input type="text" placeholder="약어를 입력하세요 (예: V/S, BST, NPO, PRN)" value={searchWord} onChange={handleSearchWord} class="w-full p-2 border rounded-lg text-sm focus:outline-indigo-500 uppercase font-semibold text-indigo-600" />
          
          {searchResult && (
            <div class="bg-white p-3 rounded-lg border border-indigo-200 space-y-1.5 text-xs shadow-sm">
              <div class="flex justify-between items-center border-b pb-1">
                <span class="font-bold text-indigo-700 text-sm">{searchResult.term}</span>
                <button type="button" onClick={handleInsertTerm} class="bg-indigo-600 text-white font-bold px-2 py-1 rounded-md text-[11px] hover:bg-indigo-700 active:scale-95 transition">
                  + 기록창에 주입
                </button>
              </div>
              <p class="font-semibold text-gray-700">의미: <span class="font-normal text-gray-900">{searchResult.definition}</span></p>
              <p class="text-gray-500 bg-slate-50 p-1.5 rounded border border-dashed">💡 실습 기록 팁: {searchResult.note}</p>
            </div>
          )}
        </div>

        {/* 상용구 단축 인터페이스 */}
        <div>
          <span class="block text-xs font-bold text-gray-500 mb-2">💡 자주 쓰는 실습 내용 태그</span>
          <div class="flex flex-wrap gap-1.5">
            {SHORTCUTS.map((tag) => (
              <button key={tag} type="button" onClick={() => handleShortcutClick(tag)} class="text-xs bg-indigo-50 text-indigo-700 font-semibold px-3 py-1.5 rounded-full border border-indigo-100 hover:bg-indigo-100 active:scale-95 transition">
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* 활동 타임라인 추가 */}
        <form onSubmit={handleAddTimeline} class="space-y-2 bg-indigo-50/50 p-3 rounded-xl border border-indigo-100/50">
          <span class="block text-xs font-bold text-indigo-900">✏️ 활동 내용 추가</span>
          <div class="flex gap-2">
            <input type="time" value={time} onChange={(e) => setTime(e.target.value)} class="p-2 border rounded-lg text-sm w-28 focus:outline-indigo-500 font-medium" required />
            <input type="text" placeholder="실습 내용 작성" value={content} onChange={(e) => setContent(e.target.value)} class="flex-1 p-2 border rounded-lg text-sm focus:outline-indigo-500" required />
            <button type="submit" class="bg-indigo-600 text-white text-sm font-bold px-4 rounded-lg">등록</button>
          </div>
        </form>

        {/* 타임라인 */}
        <div class="space-y-3">
          <h3 class="text-sm font-bold text-gray-800 border-b pb-1.5">타임라인 ({timelines.length}건)</h3>
          {/* 타임라인 리스트 */}
          {timelines.map((item) => (
            <div key={item.id} class="flex justify-between items-start border-l-2 border-indigo-200 pl-3">
              <div>
                <span class="text-xs font-bold text-indigo-600">{item.time}</span>
                <p class="text-sm text-gray-800">{item.content}</p>
              </div>
              <button type="button" onClick={() => handleDelete(item.id)} class="text-xs text-red-400">삭제</button>
            </div>
          ))}
        </div>
      </main>

      {/* 내보내기 */}
      <footer class="p-4 bg-gray-50 border-t sticky bottom-0">
        <button type="button" onClick={handleCopyText} class="w-full bg-slate-900 text-white font-bold p-3.5 rounded-xl">
          📋 전체 일지 복사
        </button>
      </footer>

      {/* 간호진단 추천 */}
      {recommend && (
        <div class="absolute bottom-20 left-4 right-4 bg-white border-2 border-indigo-600 rounded-xl p-4 shadow-2xl">
          <div class="flex justify-between items-center mb-2">
            <span class="text-xs font-bold text-indigo-600">💡 {recommend.tag} 분석 팁</span>
            <button type="button" onClick={() => setRecommend(null)}>✕</button>
          </div>
          <div class="text-xs space-y-2">
            <p><strong>NANDA:</strong> {recommend.diagnoses.join(', ')}</p>
            <p className="bg-slate-50 p-2 rounded">{recommend.interventions}</p>
          </div>
        </div>
      )}
    </div>
  );
}
