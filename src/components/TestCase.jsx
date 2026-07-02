import React, { useEffect, useState, useRef } from 'react';
import { 
  ChevronDown, CheckCircle2, Circle, Info, ChevronUp, BarChart3, Menu, X, Save, Search,
  Trash2, Sparkles
} from 'lucide-react';

import Archive from './Archive';

const SECTIONS = [
  { id: 'basic', label: '기본정보', status: 'done' },
  { id: 'hpi', label: '현병력', status: 'done' },
  { id: 'pmh', label: '과거력', status: 'empty' },
  { id: 'lab', label: '검사', status: 'partial' },
  { id: 'meds', label: '투약', status: 'empty' },
  { id: 'nursing', label: '간호사정', status: 'empty' },
  { id: 'dx', label: '간호문제', status: 'empty' },
  { id: 'journal', label: '실습기록', status: 'empty' },
];

const NewCasePage = ({ setCurrentView, onSelectMode, loadLogToEditor
    , allLogs, selectedLogId
}) => {
  const sectionRefs = useRef({});

  const [activeSection, setActiveSection] = useState('basic');
  const [showHint, setShowHint] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedDiseases, setSelectedDiseases] = useState([]); //기저 질환
  const [medications, setMedications] = useState([{ id: 1, name: '', dosage: '' }]);//투약
  const [diagnoses, setDiagnoses] = useState([
    { id: 1, title: ''}
  ]); //간호 문제

  //간호 기록
  //const [selectedLogId, setSelectedLogId] = useState(null);
  const [ward, setWard] = useState('');
  const [timelines, setTimelines] = useState([]);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const getStatusIcon = (status) => {
    if (status === 'done') return <CheckCircle2 size={16} className="text-emerald-500" />;
    if (status === 'partial') return <div className="w-3 h-3 rounded-full bg-yellow-400" />;
    return <Circle size={16} className="text-slate-300" />;
  };

  //기저 질환 태그
  const toggleDisease = (disease) => {
    setSelectedDiseases(prev => 
        prev.includes(disease) 
        ? prev.filter(item => item !== disease)
        : [...prev, disease]
    );
   };

   //검사 결과
   const [labTests, setLabTests] = useState([
    { id: 1, item: '', val: '0.0', unit: '', abnormal: false }
   ]);

   //검사 결과 추가 함수
   const addLabTest = () => {
    setLabTests([
        ...labTests, 
        { id: Date.now(), item: '', val: '', unit: '', abnormal: false }
    ]);
   };

   const updateLabTest = (id, field, value) => {
    setLabTests(labTests.map(test =>
        test.id === id ? { ...test, [field]: value } : test
    ));
   };

   const removeLabTest = (id) => {
    setLabTests(labTests.filter(test => test.id !== id));
   };

   //투약
   const addMedication = () => {
    setMedications([...medications, { id: Date.now(), name: '', dosage: '' }]);
   };
   
   const updateMedication = (id, field, value) => {
    setMedications(medications.map(m => m.id === id ? { ...m, [field]: value } : m));
   };

   const removeMedication = (id) => {
    setMedications(medications.filter(m => m.id !== id));
   };
   
   //간호 문제
   const addDiagnosis = () => {
    setDiagnoses([...diagnoses, { id: Date.now(), title: '' }]);
   };

   const updateDiagnosis = (id, field, value) => {
    setDiagnoses(diagnoses.map(d => d.id === id ? { ...d, [field]: value }: d));
   };

   const removeDiagnosis = (id) => {
    setDiagnoses(diagnoses.filter(dx => dx.id !== id));
   };

  return (
    <div className="flex h-screen overflow-hidden">
        {/* 좌측 사이드바 */}
        <aside className={`
        ${isMenuOpen
            ? 'fixed inset-0 z-40 bg-white flex flex-col p-6 w-full'
            : 'hidden md:flex md:w-64 flex-col p-6'
        }
        border-r border-slate-200/60 bg-white shrink-0 md:h-full
        `}>
        {/* 모바일 닫기 버튼 */}
        {isMenuOpen && (
            <div className="flex justify-between items-center mb-8">
            <h2 className="text-sm font-black text-slate-800">메뉴 선택</h2>
            <button onClick={() => setIsMenuOpen(false)} className="p-2 bg-slate-100 rounded-full">
                <X size={20} />
            </button>
            </div>
        )}

        {/* 사이드바 내용 */}
        <div className="space-y-2 flex-1 overflow-y-auto">
            {SECTIONS.map((s) => (
            <button
                key={s.id}
                onClick={() => { 
                    setActiveSection(s.id); 
                    setIsMenuOpen(false); 
                    sectionRefs.current[s.id]?.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                    });
                }}
                className={`w-full flex items-center justify-between px-4 py-4 rounded-2xl transition-all text-sm font-bold ${
                activeSection === s.id 
                    ? 'bg-indigo-50/80 text-indigo-700 shadow-sm border border-indigo-100' 
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
            >
                {s.label}
                {getStatusIcon(s.status)}
            </button>
            ))}
        </div>

        {/* 진행률 카드 */}
        <div className="mt-6 bg-indigo-950 p-6 rounded-3xl shadow-xl border border-indigo-900 text-white space-y-4 shrink-0">
            <div className="flex items-center gap-2">
            <BarChart3 size={16} className="text-indigo-400" />
            <span className="text-[11px] font-bold text-indigo-400 tracking-tight uppercase">작성 진행률</span>
            </div>
            <div className="w-full h-2 bg-indigo-900 rounded-full">
            <div className="h-full bg-emerald-400 w-[38%]" />
            </div>
            <div className="flex justify-between font-mono text-xs text-gray-300">
            <span>38% 완료</span>
            <span className="text-white font-black">3 / 8 섹션</span>
            </div>
        </div>
        </aside>

        <div className="flex-1 flex flex-col min-h-0">

            {/* 헤더 */}
            <header className="flex items-center justify-between p-4">
                <h2 className="text-sm font-black text-slate-900 flex items-center gap-2">
                <span className="w-1.5 h-3.5 bg-indigo-600 rounded-full"></span>
                대상자 케이스
                </h2>
                <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 text-slate-500">
                {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
            </header >

            {/* 우측 작성 영역 */}
            <main className="flex-1 overflow-y-auto min-h-0 p-4 md:p-8 pt-0 md:pt-8 pb-24">
                <div className="max-w-3xl mx-auto space-y-4">
                    {/* 기본정보 섹션 */}
                    <section ref={(el) => (sectionRefs.current.basic = el)} className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm">
                        <div className="flex justify-between items-center mb-6">
                        <h2 className="text-sm font-black text-slate-800 flex items-center gap-2">
                            <span className="w-1 h-3 bg-indigo-500 rounded-full"></span> 1. 기본정보
                        </h2>
                        <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-md font-extrabold">✓ 완료</span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-[11px] font-bold text-slate-400 pl-0.5">성별</label>
                            <select className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:ring-2 focus:ring-indigo-500/20">
                            <option>여</option><option>남</option>
                            </select>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[11px] font-bold text-slate-400 pl-0.5">연령</label>
                            <input type="number" defaultValue={0} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:ring-2 focus:ring-indigo-500/20" />
                        </div>
                        </div>

                        <div className="space-y-1.5 mt-4">
                        <div className="flex justify-between items-center">
                            <label className="text-[11px] font-bold text-slate-400 pl-0.5">주호소 (CC)</label>
                            <button onClick={() => setShowHint(!showHint)} className="text-[10px] text-indigo-600 font-bold hover:underline">
                            {showHint ? "닫기" : "EMR 힌트 보기"}
                            </button>
                        </div>
                        {showHint && <div className="bg-indigo-50/60 text-indigo-800 p-3 rounded-xl text-[11px] font-medium border border-indigo-100">💡 응급기록지 또는 입원기록지 확인</div>}
                        <input type="text" className="w-full p-3 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-indigo-500 shadow-inner" placeholder="주요 증상 입력" />
                        </div>
                    </section>

                    {/* 현병력 섹션 */}
                    <section ref={(el) => (sectionRefs.current.hpi = el)} className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-sm font-black text-slate-800 flex items-center gap-2">
                        <span className="w-1 h-3 bg-indigo-500 rounded-full"></span> 2. 현병력 (HPI)
                        </h2>
                        <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-md font-extrabold">작성중</span>
                    </div>

                    <div className="space-y-4">
                        {/* HPI 상세 기록 영역 */}
                        <div className="space-y-1.5">
                        <label className="text-[11px] font-bold text-slate-400 pl-0.5">상세 기록</label>
                        <textarea 
                            rows={5}
                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium placeholder:text-slate-300 focus:ring-2 focus:ring-indigo-500/20 shadow-inner resize-none"
                            placeholder="증상의 시작 시점, 양상, 빈도, 악화/완화 요인을 기술하세요.
        (예: 2일 전부터 시작된..."
                        />
                        </div>

                        {/* 주요 항목 체크리스트 (HPI 구성요소) */}
                        <div className="grid grid-cols-2 gap-2">
                        <div className="p-3 bg-white border border-slate-100 rounded-xl">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1">시작 시점</label>
                            <input type="text" className="w-full text-xs font-bold text-slate-700 bg-transparent outline-none" placeholder="입력" />
                        </div>
                        <div className="p-3 bg-white border border-slate-100 rounded-xl">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider block mb-1">양상 및 정도</label>
                            <input type="text" className="w-full text-xs font-bold text-slate-700 bg-transparent outline-none" placeholder="입력" />
                        </div>
                        </div>

                        {/* 동반 증상 추가 버튼 */}
                        <button className="w-full flex items-center justify-center gap-2 py-2.5 bg-indigo-50/50 text-indigo-600 rounded-xl border border-dashed border-indigo-200 hover:bg-indigo-100/50 transition">
                        <span className="text-xs font-black">+ 동반 증상 추가</span>
                        </button>
                    </div>
                    </section>

                    {/* 과거력 섹션 */}
                    <section ref={(el) => (sectionRefs.current.pmh = el)} className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-sm font-black text-slate-800 flex items-center gap-2">
                        <span className="w-1 h-3 bg-indigo-500 rounded-full"></span> 3. 과거력 (PMH)
                        </h2>
                    </div>

                    <div className="space-y-5">
                        {/* 주요 기저질환 선택*/}
                        <div className="space-y-2">
                        <label className="text-[11px] font-bold text-slate-400 pl-0.5">기저질환 (중복 선택)</label>
                        <div className="flex flex-wrap gap-2">
                        {['고혈압', '당뇨', '이상지질혈증', '심질환', '천식/COPD', '기타'].map((item) => {
                            const isSelected = selectedDiseases.includes(item);
                            return (
                            <button 
                                key={item}
                                onClick={() => toggleDisease(item)}
                                className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all border ${
                                isSelected 
                                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-md'
                                    : 'bg-slate-100 text-slate-600 border-transparent hover:bg-slate-200' // 평소 스타일
                                }`}
                            >
                                {item}
                            </button>
                            );
                        })}
                        </div>
                        </div>

                        {/* 수술 및 입원력 */}
                        <div className="space-y-1.5">
                        <label className="text-[11px] font-bold text-slate-400 pl-0.5">수술 및 입원력</label>
                        <input 
                            type="text" 
                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium placeholder:text-slate-300 focus:ring-2 focus:ring-indigo-500/20"
                            placeholder="예: 2024년 맹장염 수술 (Appendectomy)" 
                        />
                        </div>

                        {/* 알레르기/부작용 */}
                        <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-[11px] font-bold text-slate-400 pl-0.5">약물 알레르기</label>
                            <input 
                            type="text" 
                            className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700" 
                            placeholder="없음"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[11px] font-bold text-slate-400 pl-0.5">금연/금주 여부</label>
                            <select className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700">
                            <option>해당없음</option>
                            <option>흡연</option>
                            <option>음주</option>
                            <option>흡연 및 음주</option>
                            </select>
                        </div>
                        </div>
                    </div>
                    </section>

                    {/* 검사 섹션 */}
                    <section ref={(el) => (sectionRefs.current.lab = el)} className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-sm font-black text-slate-800 flex items-center gap-2">
                        <span className="w-1 h-3 bg-indigo-500 rounded-full"></span> 4. 검사
                        </h2>
                        <button 
                            onClick={addLabTest}
                            className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-lg hover:bg-indigo-100 transition">
                        + 검사 결과 추가
                        </button>
                    </div>

                    <div className="space-y-4">
                        {/* 검사 결과 테이블 */}
                        <div className="rounded-xl border border-slate-100">
                        <table className="w-full text-left text-[11px]">
                            <colgroup>
                                <col className="w-auto" />
                                <col className="w-24" />
                                <col className="w-20" />
                                <col className="w-20" />
                                <col className="w-12" />
                            </colgroup>
                            <thead className="bg-slate-50 text-slate-400">
                            <tr>
                                <th className="p-3 font-black uppercase">검사 항목</th>
                                <th className="p-3 font-black uppercase">결과</th>
                                <th className="p-3 font-black uppercase">단위</th>
                                <th className="p-3 font-black uppercase text-center">이상</th>
                                <th className="p-3 font-black uppercase text-center"></th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                            {labTests.map((row) => (
                                <tr key={row.id} className="group hover:bg-slate-50/50 transition">
                                <td className="p-3">
                                    <input 
                                    value={row.item} 
                                    onChange={(e) => updateLabTest(row.id, 'item', e.target.value)}
                                    className="w-full bg-transparent font-bold text-slate-700 outline-none"
                                    placeholder="항목"
                                    />
                                </td>
                                <td className="p-3">
                                    <input 
                                    value={row.val} 
                                    onChange={(e) => updateLabTest(row.id, 'val', e.target.value)}
                                    className="w-16 bg-transparent font-mono font-bold text-slate-900 border-b border-transparent focus:border-indigo-500 outline-none" 
                                    />
                                </td>
                                <td className="p-3 text-slate-500">
                                    <input 
                                    value={row.unit} 
                                    onChange={(e) => updateLabTest(row.id, 'unit', e.target.value)}
                                    className="w-12 bg-transparent outline-none"
                                    placeholder="단위"
                                    />
                                </td>
                                <td className="p-3 text-center w-20">
                                    <input 
                                    type="checkbox" 
                                    checked={row.abnormal} 
                                    onChange={(e) => updateLabTest(row.id, 'abnormal', e.target.checked)}
                                    className="accent-rose-500 w-3.5 h-3.5 cursor-pointer" 
                                    />
                                </td>
                                <td className="p-3 text-center">
                                    <button 
                                    type="button"
                                    onClick={() => removeLabTest(row.id)}
                                    className="text-slate-300 hover:text-rose-500"                            >                   
                                    <Trash2 size={16} /> 
                                    </button>
                                </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                        </div>

                        {/* 영상 검사 및 기타 특이사항 */}
                        <div className="space-y-1.5">
                        <label className="text-[11px] font-bold text-slate-400 pl-0.5">영상 검사 및 기타 특이사항</label>
                        <textarea 
                            rows={3}
                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-indigo-500/20 shadow-inner resize-none"
                            placeholder="예: Chest X-ray 상 RLL infiltration 관찰됨."
                        />
                        </div>
                    </div>
                    </section>

                    {/* 투약 섹션 */}
                    <section ref={(el) => (sectionRefs.current.meds = el)} className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-sm font-black text-slate-800 flex items-center gap-2">
                        <span className="w-1 h-3 bg-indigo-500 rounded-full"></span> 5. 투약 (Medication)
                        </h2>
                        <button 
                        onClick={() => addMedication()} // 행 추가 함수 연결
                        className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-lg hover:bg-indigo-100 transition"
                        >
                        + 약물 추가
                        </button>
                    </div>

                    <div className="rounded-xl border border-slate-100">
                        <table className="w-full text-left text-[11px]">
                        <thead className="bg-slate-50 text-slate-400">
                            <tr>
                            <th className="p-3 font-black uppercase">약물명</th>
                            <th className="p-3 font-black uppercase">용량/용법</th>
                            <th className="p-3 font-black uppercase w-16"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {medications.map((row) => (
                            <tr key={row.id} className="group transition">
                                <td className="p-3">
                                <input 
                                    value={row.name} 
                                    onChange={(e) => updateMedication(row.id, 'name', e.target.value)}
                                    className="w-full bg-transparent font-bold text-slate-700 outline-none"
                                    placeholder="약물명 입력"
                                />
                                </td>
                                <td className="p-3">
                                <input 
                                    value={row.dosage} 
                                    onChange={(e) => updateMedication(row.id, 'dosage', e.target.value)}
                                    className="w-full bg-transparent font-medium text-slate-600 outline-none"
                                    placeholder="예: 5mg BID PO" 
                                />
                                </td>
                                <td className="p-3 text-center">
                                <button 
                                    onClick={() => removeMedication(row.id)}
                                    className="text-slate-300 hover:text-rose-500 transition opacity-100 md:opacity-0 md:group-hover:opacity-100 p-1"
                                >
                                    <Trash2 size={16} />
                                </button>
                                </td>
                            </tr>
                            ))}
                        </tbody>
                        </table>
                    </div>
                    </section>
                
                    {/* 간호 사정 섹션 */}
                    <section ref={(el) => (sectionRefs.current.nursing = el)} className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-sm font-black text-slate-800 flex items-center gap-2">
                        <span className="w-1 h-3 bg-indigo-500 rounded-full"></span> 6. 간호 사정 (Nursing Assessment)
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* 주관적 자료 (S) */}
                        <div className="space-y-1.5">
                        <label className="text-[11px] font-bold text-slate-400 pl-0.5">주관적 자료 (Subjective)</label>
                        <textarea 
                            rows={4}
                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-indigo-500/20 shadow-inner resize-none"
                            placeholder="환자의 주호소 및 증상 설명 (예: '속이 쓰리고 답답해요')"
                        />
                        </div>

                        {/* 객관적 자료 (O) */}
                        <div className="space-y-1.5">
                        <label className="text-[11px] font-bold text-slate-400 pl-0.5">객관적 자료 (Objective)</label>
                        <textarea 
                            rows={4}
                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-indigo-500/20 shadow-inner resize-none"
                            placeholder="신체 검진 결과 및 활력 징후 (예: BT 38.2℃, 복부 압통 있음)"
                        />
                        </div>

                        {/* 간호 진단 및 사정 (A) */}
                        <div className="space-y-1.5">
                        <label className="text-[11px] font-bold text-slate-400 pl-0.5">간호 사정 (Assessment)</label>
                        <textarea 
                            rows={3}
                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-indigo-500/20 shadow-inner resize-none"
                            placeholder="자료 분석 및 간호 진단"
                        />
                        </div>

                        {/* 간호 계획 (P) */}
                        <div className="space-y-1.5">
                        <label className="text-[11px] font-bold text-slate-400 pl-0.5">간호 계획 (Plan)</label>
                        <textarea 
                            rows={3}
                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-indigo-500/20 shadow-inner resize-none"
                            placeholder="간호 중재 및 향후 계획"
                        />
                        </div>
                    </div>
                    </section>

                    {/* 간호 문제 섹션 */}
                    <section ref={(el) => (sectionRefs.current.dx = el)} className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm space-y-4">
                    <div className="flex justify-between items-center">
                        <h2 className="text-sm font-black text-slate-800 flex items-center gap-2">
                        <span className="w-1 h-3 bg-indigo-500 rounded-full"></span> 7. 간호문제
                        </h2>
                        <button 
                        onClick={addDiagnosis}
                        className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-lg hover:bg-indigo-100 transition"
                        >
                        + 진단 추가
                        </button>
                    </div>

                    <div className="space-y-2">
                        {diagnoses.map((dx) => (
                        <div key={dx.id} className="flex items-center gap-2 group">
                            <div className="flex-1 bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5">
                            <input 
                                value={dx.title}
                                onChange={(e) => updateDiagnosis(dx.id, 'title', e.target.value)}
                                className="w-full bg-transparent text-xs font-bold text-slate-700 outline-none"
                                placeholder="간호진단을 입력하세요."
                            />
                            </div>
                            <button 
                            onClick={() => removeDiagnosis(dx.id)}
                            className="text-slate-300 hover:text-rose-500"
                            >
                            <Trash2 size={16} />
                            </button>
                        </div>
                        ))}
                    </div>
                    </section>

                    {/* 실습 기록 섹션 */}
                    <section ref={(el) => (sectionRefs.current.journal = el)} className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm">
                        <div className="flex flex-col gap-4 mb-6 pb-4 border-b border-slate-100">
                            {/* 타이틀 영역 */}
                            <h2 className="text-sm font-black text-slate-800 flex items-center gap-2 tracking-tight">
                            <span className="w-1.5 h-3.5 bg-indigo-500 rounded-full"></span> 
                            8. 실습 기록
                            </h2>

                            {/* 액션 컨트롤러 그룹 */}
                            <div className="flex items-center gap-2 w-full justify-start">
                            
                                {/* 아카이브 연동 버튼 */}
                                <button 
                                    onClick={onSelectMode}
                                    className="flex items-center gap-1.5 h-9 px-3 bg-slate-50 hover:bg-rose-50 text-slate-500 hover:text-rose-600 rounded-lg text-xs font-semibold border border-slate-200/80 hover:border-rose-200 transition-all whitespace-nowrap"
                                >
                                    <span className="text-sm">📂</span>
                                    <span>파일 가져오기</span>
                                </button>

                                {/* 일지 셀렉트 박스 */}
                                <div className="relative flex-1 sm:flex-initial sm:w-48">
                                    <select 
                                    value={selectedLogId}
                                    onChange={(e) => loadLogToEditor(e.target.value)}
                                    className="w-full h-9 pl-3 pr-8 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-700 shadow-sm cursor-pointer transition-all hover:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 appearance-none"
                                    >
                                    <option value="" disabled hidden>불러올 일지 선택</option>
                                    
                                    {allLogs.map(log => (
                                        <option key={log.id} value={log.id} className="text-slate-800">
                                        {log.date} — {log.ward} 병동
                                        </option>
                                    ))}
                                    </select>
                                    
                                    <div className="absolute inset-y-0 right-0 flex items-center pr-2.5 pointer-events-none text-slate-400">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                    </svg>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </section>
                </div>
            </main>

            {/* 하단 플로팅 저장 버튼 */}
            <footer className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur border-t border-slate-100 p-3.5 z-20">
                <button className="w-full rounded-xl bg-slate-900 py-3 text-xs font-black text-white shadow-lg active:scale-[0.99] transition-all flex justify-center items-center gap-2">
                <Save size={16}/> 케이스 저장하기
                </button>
            </footer>
        </div>
    </div>
  );
};
export default NewCasePage;