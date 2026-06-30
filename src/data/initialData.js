// src/data/initialData.js

export const DEFAULT_SHORTCUTS = [
  '#Vital Sign 측정', '#BST 측정', '#Rounding 동행', '#Bedmaking', 
  '#투약 관찰', '#핵심술기 관찰', '#Case 환자 파악', '#의학용어 정리', '#인계 청취'
];

export const DEFAULT_NANDA = {
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

export const DEFAULT_DICTIONARY = {
  'V/S': { term: 'Vital Signs', definition: '활력징후 (혈압, 맥박, 호흡, 체온)', note: '환자의 생리적 상태 변화를 나타내는 가장 기본적이고 최우선적인 지표.' },
  'BST': { term: 'Blood Sugar Test', definition: '간이 혈당 검사', note: '당뇨 환자의 혈당 조절 상태를 확인하기 위해 지정된 식전/식후 스케줄에 맞춰 시행.' },
  'NPO': { term: 'Nothing by Mouth', definition: '금식', note: '수술이나 특정 검사 전 흡인 예방을 위해 철저한 통제가 필요함.' },
  'AMB': { term: 'Ambulation', definition: '보행 / 조기 이동', note: '수술 후 합병증 예방을 위해 조기 보행을 격려하되 낙상에 극도로 주의.' },
  'PRN': { term: 'As needed', definition: '필요시마다 (수시 처방)', note: '통증, 고체온 등 환자가 증상을 호소할 때 처방 범위 내에서 임시로 투여하는 약물.' }
};

export const DEFAULT_DUTY_SKELETONS = {
  Day: [
    { id: 1, time: '07:30', content: '나이트번-데번 인수인계 청취 및 담당 파트 병동 라운딩 동행' },
    { id: 2, time: '09:00', content: '정규 Vital Sign 및 식후 BST 측정 보조 (#Vital Sign 측정)' },
    { id: 3, time: '10:30', content: '수석간호사 회진 관찰 및 담당 침상 정리 정돈 협조 (#Bedmaking)' },
    { id: 4, time: '12:00', content: '점심 식전 BST 측정 조력 및 정규 경구/주사 투약 과정 관찰 (#투약 관찰)' },
    { id: 5, time: '14:00', content: '퇴근 전 마지막 정규 Vital Sign 측정 및 이브닝번 인계 준비' }
  ],
  Evening: [
    { id: 1, time: '15:00', content: '데이번-이브닝번 인수인계 청취 및 담당 파트 병동 라운딩 동행' },
    { id: 2, time: '16:00', content: '정규 Vital Sign 및 식후 BST 측정 보조 (#Vital Sign 측정)' },
    { id: 3, time: '18:00', content: '저녁 식전 BST 측정 조력 및 저녁 투약 라운딩 과정 밀착 관찰 (#투약 관찰)' },
    { id: 4, time: '20:00', content: '야간 처방 라운딩 동행 및 특이 케이스 관찰' },
    { id: 5, time: '21:30', content: '야간 정규 Vital Sign 측정 및 나이트번 인계 리포트 준비' }
  ]
};
