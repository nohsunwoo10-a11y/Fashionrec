/* ==========================================================================
   애플리케이션 상태 관리 및 데이터셋
   ========================================================================== */
const state = {
  temp: 18,
  weather: null,
  occasion: null,
  mood: null,
  hunger: 'starving'
};

// 오늘 날짜 표시
const now = new Date();
const days = ['일', '월', '화', '수', '목', '금', '토'];
const dateStr = `${now.getMonth() + 1}월 ${now.getDate()}일 (${days[now.getDay()]})`;
const dateBadge = document.getElementById('current-date-badge');
if (dateBadge) {
  dateBadge.textContent = dateStr;
}

/* ---------------- 온도별 가이드 멘트 & 색상 ---------------- */
function getTempMeta(t) {
  if (t <= 4) {
    return {
      color: '#3B82F6',
      guide: '얼어 죽을 수 있어! 롱패딩, 목도리, 히트텍 완전 무장 필수 🥶',
      tier: 'freezing'
    };
  } else if (t <= 11) {
    return {
      color: '#6366F1',
      guide: '쌀쌀한 초겨울 날씨! 울코트나 숏패딩 든든하게 챙겨입자 ❄️',
      tier: 'cold'
    };
  } else if (t <= 16) {
    return {
      color: '#0EA5E9',
      guide: '선선한 간절기! 트렌치코트, 자켓, 가디건 레이어드가 국룰 🍂',
      tier: 'chilly'
    };
  } else if (t <= 22) {
    return {
      color: '#10B981',
      guide: '자켓, 셔츠, 얇은 니트 입기 제일 좋은 환상적인 날씨! 🌸',
      tier: 'mild'
    };
  } else if (t <= 27) {
    return {
      color: '#F59E0B',
      guide: '슬슬 더워져! 반팔, 얇은 린넨 셔츠, 통기성 좋은 옷 추천 ☀️',
      tier: 'warm'
    };
  } else {
    return {
      color: '#EF4444',
      guide: '폭염 주의! 린넨, 나시탑, 민소매로 시원하게 입고 나가자 🔥',
      tier: 'hot'
    };
  }
}

/* ---------------- 코디 추천 알고리즘 및 텍스트 데이터베이스 ---------------- */
const OUTFIT_DATABASE = {
  // 1. 혹한 (<= 4도)
  freezing: {
    lovely: {
      top: { name: '도톰한 앙고라/울 케이블 터틀넥 니트', tip: '크림 핑크 컬러로 화사하면서도 찬바람 원천 차단!' },
      bottom: { name: '기모 플리츠 롱 스커트 + 200데니아 융기모 타이즈', tip: '스커트 속에 융기모 타이즈 입으면 바지보다 따뜻해' },
      outer: { name: '파스텔톤 롱 구스다운 패딩 or 벨티드 시어링 무스탕', tip: '허리 라인을 벨트로 잡아주면 패딩도 날씬해 보여' },
      shoes: { name: '플랫폼 어그 미니 부츠 or 털 안감 레이스업 앵클부츠', tip: '눈길에도 끄떡없는 미끄럼 방지 밑창 필수!' },
      acc: { name: '뽀글이 바라클라바 or 소프트 캐시미어 머플러', tip: '얼굴 작아 보이고 완전 사랑스러운 겨울 잇템' }
    },
    gyaru: {
      top: { name: '기모 크롭 후드집업 + 레오파드 융기모 이너', tip: '안에는 핫하게, 겉에는 든든하게 레이어드하는 게 갸루의 맛' },
      bottom: { name: '워싱 와이드 기모 데님팬츠 or 레더 버뮤다 쇼츠', tip: '레더 쇼츠 입을 땐 기모 레그워머 두툼하게 매치해줘' },
      outer: { name: '오버핏 글로시 숏패딩 (실버/블랙 유광)', tip: '유광 패딩 하나 걸치면 겨울 골목길이 바로 런웨이!' },
      shoes: { name: '두툼한 통굽 청키 워커 or 플랫폼 스노우 부츠', tip: '굽 높이 5cm 이상으로 다리 길이 2미터 만들기' },
      acc: { name: '페이크퍼 레그워머 + 빅 프레임 틴트 선글라스', tip: '레그워머는 신발 위로 자연스럽게 주름지게 신는 게 포인트' }
    },
    chic: {
      top: { name: '캐시미어 100% 슬림핏 하이넥 니트', tip: '목을 감싸주면서 슬림한 실루엣을 유지해줘' },
      bottom: { name: '핀턱 와이드 기모 슬랙스 (차콜/블랙)', tip: '구김 안 가고 찰랑거리면서도 속기모가 든든한 핏' },
      outer: { name: '핸드메이드 더블 브레스티드 맥시 울/캐시미어 코트', tip: '발목까지 오는 기장감으로 극강의 시크함 완성' },
      shoes: { name: '스퀘어토 스웨이드 삭스 부츠', tip: '군더더기 없이 떨어지는 미니멀한 쉐입' },
      acc: { name: '울 블렌드 프린지 숄 머플러 + 레더 글러브', tip: '모던한 가죽 장갑으로 도시적인 분위기 UP' }
    },
    casual: {
      top: { name: '헤비웨이트 기모 맨투맨 (오버핏)', tip: '안에 화이트 티셔츠 밑단을 3cm 레이어드해서 빼주기' },
      bottom: { name: '벌룬핏 기모 스웨트 조거팬츠', tip: '바람 들어올 틈 없는 탄탄한 밴딩 밑단' },
      outer: { name: '덕다운 헤비 볼륨 몬스터 파카 패딩', tip: '침낭을 두른 듯한 극상의 포근함' },
      shoes: { name: '뉴발란스/살로몬 두툼한 고프코어 스니커즈', tip: '쿠셔닝 좋고 발 시려움 없는 든든한 신발' },
      acc: { name: '도톰한 숏비니 + 코듀로이 패딩 백', tip: '머리 보온도 잡고 힙한 스트릿 무드 챙기기' }
    }
  },
  // 2. 쌀쌀 (5~11도)
  cold: {
    lovely: {
      top: { name: '포근한 알파카 브이넥 가디건 + 프릴 넥 블라우스', tip: '넥 라인의 사랑스러운 프릴이 가디건 위로 빼꼼!' },
      bottom: { name: '울 체크 A라인 미니스커트 + 슬림 압박 스타킹', tip: '은은한 체크 패턴이 가을겨울 무드에 찰떡' },
      outer: { name: '카라 덤블 배색 숏 무스탕 or 하프 더플코트', tip: '귀여운 떡볶이 단추나 뽀글이 카라로 러블리함 충전' },
      shoes: { name: '스웨이드 롱부츠 (브라운/베이지)', tip: '종아리 라인을 싹 감싸줘서 슬림해 보여' },
      acc: { name: '진주 드롭 이어링 + 미니 퀼팅 체인백', tip: '여리여리하고 세련된 데이트룩 종결' }
    },
    gyaru: {
      top: { name: '오프숄더 골지 니트탑 + 초커 목걸이', tip: '살짝 드러난 어깨선과 초커가 Y2K 감성 끝판왕' },
      bottom: { name: '카고 포켓 로우라이즈 플리츠 스커트', tip: '벨트 루프에 키링이나 실버 체인 달아주면 레전드' },
      outer: { name: '빈티지 워싱 레더 항공점퍼 (MA-1 or 바이커)', tip: '낙낙한 오버핏 가죽 자켓으로 힙스터 무드 뿜뿜' },
      shoes: { name: '레이스업 롱 워커 부츠 or 웨스턴 부츠', tip: '무릎 아래까지 오는 기장으로 강렬한 임팩트' },
      acc: { name: '볼드 실버 레이어드 네크리스 + 힙색 크로스', tip: '체인이 찰랑거릴 때마다 힙한 에너지 폭발' }
    },
    chic: {
      top: { name: '실키한 타이블라우스 + 울 브이넥 니트 베스트', tip: '타이를 자연스럽게 늘어뜨려 시크하게 연출' },
      bottom: { name: '스트레이트 핏 울 블렌드 트라우저', tip: '하이웨이스트로 다리가 끝없이 길어 보이는 라인' },
      outer: { name: '테일러드 오버사이즈 싱글 울 자켓', tip: '어깨 라인이 똑 떨어지는 각 잡힌 핏' },
      shoes: { name: '에나멜 옥스퍼드화 or 첼시 부츠', tip: '모던하고 클래식한 발끝 포인트' },
      acc: { name: '스퀘어 미니 토트백 + 골드 메탈릭 워치', tip: '군더더기 없는 도회적인 커리어우먼 느낌' }
    },
    casual: {
      top: { name: '아가일 패턴 라운드 니트 + 레이어드 티셔츠', tip: '클래식하면서도 캐주얼한 데일리 니트' },
      bottom: { name: '세미 와이드 중청 스트레이트 데님', tip: '어떤 아우터에도 실패 없는 만능 청바지' },
      outer: { name: '누빔 안감 코듀로이 자켓 or 바시티 야구점퍼', tip: '트렌디한 레트로 캠퍼스 감성 장착' },
      shoes: { name: '아디다스 삼바 / 가젤 스니커즈', tip: '얄쌍한 쉐입으로 가벼운 발걸음' },
      acc: { name: '캔버스 메신저백 + 배색 볼캡', tip: '모자 하나 푹 눌러써도 느낌 있는 꾸안꾸룩' }
    }
  },
  // 3. 선선 간절기 (12~16도)
  chilly: {
    lovely: {
      top: { name: '소프트 파스텔 울 가디건 (단독 착용)', tip: '단추를 윗부분만 잠그고 살짝 쇄골을 보여줘' },
      bottom: { name: '잔잔한 플로럴 롱 머메이드 스커트', tip: '걸을 때마다 살랑거리는 우아한 실루엣' },
      outer: { name: '클래식 더블 트렌치코트 (크림/베이지)', tip: '허리 끈을 무심하게 질끈 묶어주면 인생샷 보장' },
      shoes: { name: '스웨이드 플랫 슈즈 or 메리제인 펌프스', tip: '소녀스럽고 로맨틱한 분위기' },
      acc: { name: '실크 트윌리 스카프 + 페일 핑크 숄더백', tip: '목에 트윌리 가볍게 감아주면 보온도 되고 센스 UP' }
    },
    gyaru: {
      top: { name: '레터링 크롭 롱슬리브 티셔츠 + 볼레로 니트', tip: '볼레로를 툭 걸쳐주면 스타일리시함 200%' },
      bottom: { name: '디스트로이드 와이드 청바지 (찢청)', tip: '무릎 커팅 포인트로 쿨하고 자유로운 무드' },
      outer: { name: '오버핏 모터사이클 레이싱 자켓', tip: '요즘 가장 핫한 바이커 코어 트렌드!' },
      shoes: { name: '플랫폼 어글리 슈즈 or 통굽 메리제인', tip: '힙하면서도 다리가 가늘어 보이는 마법' },
      acc: { name: '헤드폰 + 실버 버클 와이드 벨트', tip: '목에 헤드폰만 걸쳐도 패션 완성인 거 알지?' }
    },
    chic: {
      top: { name: '스트라이프 코튼 셔츠 (소매 롤업)', tip: '단추 두 개쯤 풀고 소매를 걷어올려 자연스럽게' },
      bottom: { name: '투턱 세미와이드 슬랙스 (네이비/그레이)', tip: '단정하면서도 세련된 실루엣' },
      outer: { name: '하운드투스 체크 테일러드 자켓', tip: '클래식한 체크 패턴이 주는 고급스러움' },
      shoes: { name: '페니 로퍼 (화이트 삭스 매치)', tip: '하얀 양말에 로퍼는 언제나 정답!' },
      acc: { name: '레더 숄더 바게트백 + 심플 이어링', tip: '단정하지만 은근한 세련미 강조' }
    },
    casual: {
      top: { name: '스트라이프 보트넥 롱슬리브 티', tip: '프렌치 시크 감성의 편안한 데일리 탑' },
      bottom: { name: '베이지 코튼 치노 카고 팬츠', tip: '활동성 최고에 편안한 핏' },
      outer: { name: '후드 탈부착 윈드브레이커 or 데님 트러커 자켓', tip: '바람 막아주고 캐주얼한 멋 살리기' },
      shoes: { name: '반스 올드스쿨 or 컨버스 척테일러', tip: '언제 신어도 찰떡인 국민 스니커즈' },
      acc: { name: '나일론 스트링 백팩 + 키링 인형', tip: '가방에 귀여운 키링 하나 달아주는 센스' }
    }
  },
  // 4. 봄/가을 온화 (17~22도)
  mild: {
    lovely: {
      top: { name: '스퀘어넥 퍼프소매 블라우스', tip: '목선과 쇄골이 예뻐 보여서 셀카 백만 장 찍는 핏' },
      bottom: { name: '하이웨이스트 코튼 A라인 스커트', tip: '허리는 쏙 들어가고 다리는 길어 보여' },
      outer: { name: '크롭 트위드 자켓 or 얇은 니트 가디건 (어깨에 걸치기)', tip: '낮에는 어깨에 무심하게 툭 묶어두면 센스 짱!' },
      shoes: { name: '메리제인 슈즈 + 시스루 양말', tip: '러블리함의 정석인 발끝 조합' },
      acc: { name: '리본 헤어 집게핀 + 미니 호보백', tip: '반묶음 머리에 리본 핀 꽂아주면 완전 요정' }
    },
    gyaru: {
      top: { name: '타이트 립 니트 반팔탑 or 그래픽 베이비티', tip: '몸에 착 감기는 핏으로 라인을 살려줘' },
      bottom: { name: '카고 미니스커트 or 로우라이즈 배기 팬츠', tip: '골반에 걸쳐 입는 찐 갸루 바이브' },
      outer: { name: '크롭 짚업 후드 (가방에 묶거나 허리에 두르기)', tip: '해 질 때 쌀쌀해지면 툭 걸쳐입기 딱 좋아' },
      shoes: { name: '통굽 캔버스 스니커즈 (플랫폼 컨버스)', tip: '키높이 효과와 함께 경쾌한 스트릿 무드' },
      acc: { name: '스터드 장식 숄더백 + 비즈 폰스트랩', tip: '반짝거리는 비즈로 Y2K 무드 마침표' }
    },
    chic: {
      top: { name: '루즈핏 린넨/코튼 오픈카라 셔츠', tip: '바람 솔솔 통하고 여유로운 실루엣' },
      bottom: { name: '린넨 블렌드 와이드 밴딩 슬랙스', tip: '편안함과 멋스러움을 동시에 잡는 아이템' },
      outer: { name: '가벼운 썸머 울 블레이저 (손에 들고 다녀도 멋스러움)', tip: '카페나 실내 에어컨 바람 대비용 필수' },
      shoes: { name: '블랙 뮬 슬리퍼 or 블로퍼', tip: '뒤꿈치가 트여있어 시원하고 도회적인 느낌' },
      acc: { name: '미니멀 가죽 캔버스 콤비 쇼퍼백', tip: '서류도 들어가고 디자인도 모던한 가방' }
    },
    casual: {
      top: { name: '빈티지 그래픽 반팔티 + 얇은 롱슬리브 레이어드', tip: '일교차 큰 날엔 겹쳐 입는 재미가 최고지' },
      bottom: { name: '연청 루즈핏 데님 팬츠', tip: '시원하고 청량한 컬러감' },
      outer: { name: '나일론 크롭 아노락 (지퍼 반만 열기)', tip: '활동성 좋고 가벼워서 휴대하기 편해' },
      shoes: { name: '나이키 에어포스 1 올백', tip: '어디에나 어울리는 영원한 클래식' },
      acc: { name: '스포티 볼캡 + 실버 체인 목걸이', tip: '햇빛도 가리고 스타일 지수 급상승' }
    }
  },
  // 5. 따뜻/초여름 (23~27도)
  warm: {
    lovely: {
      top: { name: '시어서커 셔링 반팔 블라우스', tip: '몸에 달라붙지 않아 쾌적하고 사랑스러워' },
      bottom: { name: '린넨 랩 롱스커트 or 플레어 스커트', tip: '바람 불 때 흩날리는 라인이 예술' },
      outer: { name: '초경량 썸머 니트 가디건 (실내용)', tip: '실내 냉방병 예방용으로 가방에 쏙 넣어두기' },
      shoes: { name: '스트랩 샌들 (로우 힐)', tip: '발목을 가늘어 보이게 해주는 스트랩' },
      acc: { name: '라피아 미니 버킷백 + 앤틱 헤어밴드', tip: '여름 바캉스 기분 물씬 풍기는 소재감' }
    },
    gyaru: {
      top: { name: '홀터넥 크롭 나시탑 + 시스루 그물 니트', tip: '과하지 않게 시스루로 레이어드해서 섹시큐티' },
      bottom: { name: '데님 숏팬츠 (롤업 디테일)', tip: '다리 라인이 시원하게 드러나는 썸머 룩' },
      outer: { name: '오버사이즈 시어 체크 셔츠 (오픈해서 걸치기)', tip: '햇빛 가리개 겸 힙한 겉옷으로 활용' },
      shoes: { name: '통굽 스트랩 샌들 (플랫폼 힐)', tip: '발끝까지 볼드한 볼륨감 주기' },
      acc: { name: '틴트 선글라스 + 실버 뱅글 팔찌', tip: '햇빛 아래서 찰랑거리는 실버 악세사리' }
    },
    chic: {
      top: { name: '슬리브리스 린넨 니트탑 (베이지/모카)', tip: '고급스러운 조직감으로 우아한 썸머 시크' },
      bottom: { name: '핀턱 린넨 버뮤다 팬츠 (무릎 기장)', tip: '요즘 가장 트렌디한 프렌치 무드 팬츠' },
      outer: { name: '린넨 싱글 자켓 (필요시 착용)', tip: '구김마저 자연스러운 내추럴 텍스처' },
      shoes: { name: '가죽 스트랩 플랫 샌들', tip: '군더더기 없는 슬림한 샌들' },
      acc: { name: '골드 코인 펜던트 목걸이 + 캔버스 레더백', tip: '차분하면서도 세련된 포인트' }
    },
    casual: {
      top: { name: '헤비 코튼 오버핏 레터링 반팔티', tip: '체형 커버 완벽하고 핏 좋은 탄탄한 반팔' },
      bottom: { name: '나일론 파라슈트 하프 팬츠 or 버뮤다 데님', tip: '바스락거리는 시원한 소재감' },
      outer: { name: '가벼운 린넨 체크 셔츠 (어깨에 걸치기)', tip: '단조로운 티셔츠 룩에 입체감 더하기' },
      shoes: { name: '킨/호카 스트랩 샌들 or 뮬 스니커즈', tip: '하루 종일 걸어도 발 안 아픈 착화감' },
      acc: { name: '방수 나일론 사코슈백 + 매쉬 캡모자', tip: '여름 페스티벌에도 끄떡없는 조합' }
    }
  },
  // 6. 폭염 (>= 28도)
  hot: {
    lovely: {
      top: { name: '스모크 밴딩 민소매 뷔스티에 탑', tip: '가슴 라인은 편안하게 잡아주고 시원함은 최상' },
      bottom: { name: '린넨 100% 와이드 쿨링 팬츠', tip: '다리에 감기지 않고 통풍이 솔솔' },
      outer: { name: '초박형 자외선 차단 얇은 로브/가디건', tip: '직사광선으로부터 피부 보호하기' },
      shoes: { name: '푹신한 에어 쿠션 쪼리 or 플랫 슬라이드', tip: '더운 날엔 발 편하고 시원한 게 최고!' },
      acc: { name: '밀짚 라피아 햇 + 미니 젤리백', tip: '자외선 완벽 차단 & 청량감 100% 아이템' }
    },
    gyaru: {
      top: { name: '튜브탑 (베어탑) or 그래픽 크롭 탱크탑', tip: '쇄골과 어깨를 시원하게 드러내는 핫한 썸머 갸루!' },
      bottom: { name: '마이크로 데님 미니스커트 or 쿨링 카고 조거', tip: '골반 라인을 살려주는 시원한 하의' },
      outer: { name: '가방에 묶어둔 얇은 레이온 셔츠', tip: '에어컨 강한 지하철에서만 쏙 꺼내 입기' },
      shoes: { name: '통굽 쪼리 슬리퍼 (플랫폼 샌들)', tip: '물놀이도 가능하고 힙함도 챙기는 만능템' },
      acc: { name: '컬러 렌즈 선글라스 + 글리터 바디 미스트', tip: '반짝이는 피부와 힙한 아이웨어로 올킬' }
    },
    chic: {
      top: { name: '원숄더 슬리브리스 탑', tip: '비대칭 넥라인이 주는 세련되고 감각적인 무드' },
      bottom: { name: '찰랑거리는 실크/레이온 와이드 슬랙스', tip: '바람 불 때마다 시원하고 고급스러운 텍스처' },
      outer: { name: '손에 든 린넨 셔츠', tip: '더우니까 걸치지 말고 무심하게 손에 들어줘' },
      shoes: { name: '미니멀 씬 스트랩 뮬', tip: '발등이 훤히 드러나서 다리가 아주 길어 보여' },
      acc: { name: '볼드 메탈 뱅글 + 블랙 캣아이 선글라스', tip: '도회적인 카리스마 뿜뿜' }
    },
    casual: {
      top: { name: '기능성 쿨맥스 오버핏 반팔티', tip: '땀 흡수 빠르고 금방 마르는 똑똑한 티셔츠' },
      bottom: { name: '나일론 스위밍 쇼츠 (하프 팬츠)', tip: '물 튀어도 바로 마르는 초경량 팬츠' },
      outer: { name: '없음 (너무 더우니까 과감히 생략!)', tip: '오늘은 최소한으로 가볍게 입는 게 승리자' },
      shoes: { name: '크록스 클래식 클로그 + 지비츠 커스텀', tip: '비 와도 젖을 걱정 없고 쿠션감 최고' },
      acc: { name: '방수 크로스백 + 쿨링 넥쿨러/손선풍기', tip: '여름철 생존템 손선풍기는 필수로 가방에 쏙' }
    }
  }
};

/* ---------------- 날씨 및 약속 상황별 추가 보정 로직 ---------------- */
const WEATHER_CAUTION = {
  rainy: [
    '비 오는 날 밝은 바지 절대 금지! 흙탕물 튀면 오늘 하루 기분 다 망쳐 🌧️',
    '신발은 젖어도 괜찮은 레인부츠나 가죽 신발을 추천해. 아끼는 캔버스화는 집에서 쉬게 하자!',
    '예쁜 3단 자동우산 가방에 쏙 챙겼지? 언니 말 듣고 비 맞지 마!'
  ],
  snowy: [
    '눈길 미끄러우니까 밑창 홈 깊은 부츠나 논슬립 슈즈 신어! 넘어지면 아프잖아 ❄️',
    '젖은 눈이 옷에 스며들 수 있으니 방수/발수 코팅된 아우터가 최고야.',
    '손 시려우니까 스마트폰 터치되는 장갑 챙겨서 손 주머니에 넣지 말고 조심히 걷기!'
  ],
  windy: [
    '바람 쌩쌩 부는 날 펄럭이는 치마 입으면 낭패야! 팬츠나 핏되는 라인을 추천해 💨',
    '앞머리 사수하려면 픽서 촥촥 뿌리거나 감각적인 볼캡/비니를 코디해줘.',
    '목덜미로 찬바람 훅 들어오지 않게 하이넥이나 가벼운 머플러 챙기기!'
  ],
  sunny: [
    '햇살 눈부신 날이니까 자외선 차단제 꼼꼼히 바르고 선글라스로 힙하게 포인트 줘 ☀️',
    '야외 사진 완전 잘 나오는 날! 얼굴 화사해 보이는 상의 컬러 고르면 인생샷 백장 예약!',
    '자외선에 피부 상하지 않게 얇은 셔츠나 모자 챙기면 언니의 완벽 센스 인정!'
  ],
  cloudy: [
    '흐린 날이라고 옷까지 칙칙하게 입으면 안 돼! 실버 악세사리나 포인트 백으로 생기 불어넣기 ☁️',
    '기온이 변덕스러울 수 있으니 벗었다 입었다 할 수 있는 레이어드 착장이 정답!',
    '자연광이 은은해서 오히려 셀카가 부드럽게 잘 나오는 날이야. 치크 톡톡 얹고 나가자!'
  ],
  dusty: [
    '미세먼지 심한 날이니까 먼지가 잘 달라붙는 니트보다는 매끈한 나일론/가죽 아우터 입기 😷',
    'KF94 마스크도 패션 톤이랑 맞춰서 베이지나 블랙으로 센스 있게 픽해줘.',
    '외출 후에는 옷 털고 따뜻한 물 많이 마시는 거 잊지 마, 약속!'
  ]
};

const OCCASION_CAUTION = {
  date: '💘 데이트/소개팅 : 첫인상은 과한 것보다 은은한 매력! 향수 한 번 칙 뿌리고 신발은 너무 발 아프지 않은 걸로 골라줘.',
  work: '💼 출근/캠퍼스 : 단정하면서도 센스 있는 꾸안꾸! 노트북이나 소지품 넉넉하게 들어가는 백으로 실용성까지 챙기자.',
  friends: '🛍️ 친구 약속/카페 : 인스타 릴스랑 거울 셀카 각! 유행하는 잇템 하나쯤 과감하게 얹어주는 게 바로 트렌드 리더의 길.',
  hip: '🪩 핫플/페스티벌 : 오늘은 네가 주인공! 눈치 보지 말고 과감한 실루엣과 볼드한 악세사리로 시선 집중시키기.',
  daily: '🧢 동네 마실/꾸안꾸 : 무심한 듯 힙한 게 제일 어려운 법! 핏 좋은 팬츠에 푹 눌러쓴 모자로 편안함과 멋 다 챙기기.',
  exercise: '🏃‍♀️ 운동/산책 : 땀 흡수 잘 되고 활동성 편한 소재는 기본! 런닝화 끈 꽉 묶고 수분 보충용 텀블러 잊지 마.'
};

/* ---------------- 풀코스 케어 (메뉴, 노래, 운동) ---------------- */
const BONUS_DATABASE = {
  meal: {
    starving: {
      freezing: { name: '보글보글 밀푀유나베 & 칼국수 사리', tag: '속 뜨끈 든든', desc: '영하의 추위엔 국물이 진리! 푸짐하게 먹고 몸 녹이자 🍲' },
      cold: { name: '육즙 팡팡 숙성 삼겹살 & 된장찌개', tag: '고기 파워', desc: '쌀쌀할 땐 기름진 고기로 단백질 충전하고 에너지 UP! 🥩' },
      chilly: { name: '진한 바질 크림 파스타 & 수제 버거', tag: '비주얼 폭발', desc: '선선한 바람 불 땐 분위기 있는 브런치 펍에서 든든한 한 끼 🍝' },
      mild: { name: '치즈 듬뿍 화덕 피자 & 시원한 수제 맥주', tag: '분위기 깡패', desc: '테라스 자리에서 선선한 바람 맞으며 먹으면 극락이야 🍕' },
      warm: { name: '새콤달콤 비빔냉면 & 바삭한 왕만두', tag: '입맛 돋우는 맛', desc: '더워지는 날씨에 집 나간 입맛 바로 되찾아주는 조합 🍜' },
      hot: { name: '얼음 동동 살얼음 냉모밀 & 모듬 텐동', tag: '폭염 극복 쿨메뉴', desc: '시원한 육수 들이켜고 바삭한 튀김으로 든든함 챙겨! 🥢' }
    },
    light: {
      freezing: { name: '따뜻한 단호박 스프 & 리코타 치즈 샐러드', tag: '속 편한 웜샐러드', desc: '추운 날에도 부담 없이 몸을 따스하게 덥혀주는 식사 🥣' },
      cold: { name: '따끈한 연어 오차즈케 & 온센타마고', tag: '정갈한 일식', desc: '따뜻한 녹차물에 밥 말아 담백하고 깔끔하게 뚝딱 🍵' },
      chilly: { name: '아보카도 훈제연어 포케 보울', tag: '신선한 영양만점', desc: '알록달록 비주얼도 예쁘고 핏도 가볍게 유지해줘 🥗' },
      mild: { name: '잠봉뵈르 샌드위치 & 아메리카노', tag: '감성 브런치', desc: '가벼운 나들이길에 공원 벤치에서 먹기 딱 좋은 밸런스 🥪' },
      warm: { name: '바질 토마토 콜드 파스타', tag: '산뜻하고 시원해', desc: '상큼한 토마토와 향긋한 바질이 입안 가득 청량함 선사 🍅' },
      hot: { name: '그릭 요거트 보울 & 생과일 토핑', tag: '더위 날리는 가벼움', desc: '입맛 없는 폭염엔 시원하고 꾸덕한 요거트로 산뜻하게 🫐' }
    },
    dessert: {
      freezing: { name: '갓 구운 붕어빵 & 핫초코 마시멜로', tag: '겨울 길거리 낭만', desc: '품에 품고 오는 따끈한 슈크림/팥 붕어빵의 행복 🐟' },
      cold: { name: '따끈한 바닐라 수플레 팬케이크 & 밀크티', tag: '퐁신퐁신 힐링', desc: '입안에서 사르르 녹아내리는 달콤함으로 텐션 충전 🥞' },
      chilly: { name: '겉바속촉 츄러스 & 진한 딥초콜릿', tag: '스트릿 디저트', desc: '선선한 바람 부는 거리 걸으며 한입 베어 물면 꿀맛 🥨' },
      mild: { name: '딸기 듬뿍 생크림 케이크 & 아이스 라떼', tag: '비주얼 대장', desc: '인스타 피드 박제각! 달콤상큼한 딸기 파티 🍰' },
      warm: { name: '말차 젤라또 & 바삭한 와플 콘', tag: '쌉싸름 달콤', desc: '햇살 아래서 똑똑 떨어지기 전에 얼른 먹어줘야 해 🍦' },
      hot: { name: '눈꽃 망고 빙수 & 연유 듬뿍', tag: '여름 불패 신화', desc: '머리끝까지 띵해지는 시원함으로 땀 싹 날려버리자 🍧' }
    }
  },
  songs: [
    { title: 'NewJeans - Super Shy', artist: '런웨이 워킹송', desc: '도도하고 산뜻한 발걸음으로 거리 시선 올킬! 🎧' },
    { title: 'IVE - I AM', artist: '자신감 200% 충전', desc: '문 열고 나가는 순간 내가 바로 오늘의 주인공 👑' },
    { title: 'aespa - Supernova', artist: '힙스터 갸루 바이브', desc: '심장을 쿵쿵 울리는 비트로 오늘 텐션 한도초과 ⚡' },
    { title: '태연 - To. X', artist: '감성 도회적인 무드', desc: '선선한 바람 맞으며 이어폰 꽂고 걷기 딱 좋아 🍂' },
    { title: '찰리 푸스 - Dangerously', artist: '트렌디한 비트', desc: '어깨가 절로 들썩거리는 드라이브 & 산책 메이트 🎵' },
    { title: 'LE SSERAFIM - Perfect Night', artist: '밤공기 찰떡송', desc: '친구들이랑 놀러 갈 때 들으면 기분 최고조! 🌙' }
  ],
  workouts: [
    { title: '외출 전 3분 종아리 & 발목 림프 펌핑', tag: '다리 라인 살리기', desc: '까치발 20회 반복으로 붓기 싹 빼고 롱다리 라인 극대화!' },
    { title: '쇄골 & 승모근 활짝 펴는 어깨 롤링', tag: '옷태 교정', desc: '어깨를 뒤로 15회 크게 돌려 곧은 넥라인과 여리여리한 핏 완성!' },
    { title: '허리선 쏙 들어가는 복부 트위스트 스트레칭', tag: '핏감 극대화', desc: '좌우로 허리를 20초간 늘려주면 크롭탑/원피스 핏이 살아나!' },
    { title: '집에 돌아와서 L자 다리 10분 올리기', tag: '하루 피로 순삭', desc: '벽에 다리 올려두고 스마트폰 보면 내일 아침 부기 제로!' }
  ]
};

/* ==========================================================================
   인터랙션 및 UI 로직
   ========================================================================== */

// 1. 화면 전환 함수
function showPage(pageId) {
  document.querySelectorAll('.page-section').forEach(el => {
    el.classList.remove('active');
  });
  const target = document.getElementById(pageId);
  if (target) {
    target.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

// 2. 토스트 메시지 함수
let toastTimeout = null;
function showToast(text, icon = '⚠️') {
  const toast = document.getElementById('toast-msg');
  const toastText = document.getElementById('toast-text');
  const toastIcon = document.getElementById('toast-icon');

  if (!toast || !toastText || !toastIcon) return;

  toastText.textContent = text;
  toastIcon.textContent = icon;

  toast.classList.add('show');
  if (toastTimeout) clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 2600);
}

// 3. 온도 슬라이더 이벤트
const tempSlider = document.getElementById('temp-slider');
const tempDisplay = document.getElementById('temp-display');
const tempGuide = document.getElementById('temp-guide');

function updateTempUI(val) {
  state.temp = parseInt(val, 10);
  if (tempDisplay) tempDisplay.textContent = state.temp;
  const meta = getTempMeta(state.temp);
  if (tempDisplay) tempDisplay.style.color = meta.color;
  if (tempGuide) tempGuide.textContent = meta.guide;

  // 슬라이더 프로그레스 바 동적 색상
  if (tempSlider) {
    const min = -10;
    const max = 35;
    const percentage = ((state.temp - min) / (max - min)) * 100;
    tempSlider.style.background = `linear-gradient(to right, ${meta.color} 0%, ${meta.color} ${percentage}%, #E2E8F0 ${percentage}%, #E2E8F0 100%)`;
  }
}

if (tempSlider) {
  tempSlider.addEventListener('input', (e) => {
    updateTempUI(e.target.value);
  });
  updateTempUI(tempSlider.value);
}

// 4. 단일 선택 칩 버튼 로직 (날씨, 약속, 무드, 배고픔)
document.querySelectorAll('.chip-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const type = btn.getAttribute('data-type');
    const val = btn.getAttribute('data-value');

    // 같은 타입 내 다른 버튼 선택 해제
    const siblings = document.querySelectorAll(`.chip-btn[data-type="${type}"]`);
    siblings.forEach(s => s.classList.remove('selected'));

    btn.classList.add('selected');
    state[type] = val;

    // 에러 표시 카드 해제
    const cardMap = {
      weather: 'card-weather',
      occasion: 'card-occasion',
      mood: 'card-mood',
      hunger: 'card-hunger'
    };
    if (cardMap[type]) {
      const errorCard = document.getElementById(cardMap[type]);
      if (errorCard) errorCard.classList.remove('has-error');
    }
  });
});

// 기본 배고픔 선택 상태 지정
const defaultHunger = document.querySelector('.chip-btn[data-type="hunger"][data-value="starving"]');
if (defaultHunger) defaultHunger.classList.add('selected');

// 5. 네비게이션: 첫 화면 -> 입력 화면
const btnStart = document.getElementById('btn-start');
if (btnStart) {
  btnStart.addEventListener('click', () => {
    showPage('page-input');
  });
}

// 6. 결과 생성 및 유효성 검사
const btnSubmit = document.getElementById('btn-submit');
if (btnSubmit) {
  btnSubmit.addEventListener('click', () => {
    // 유효성 검사 (날씨, 약속, 무드)
    if (!state.weather) {
      showToast('자기야! 오늘 날씨가 어떤지 먼저 콕 찍어줘 🌤️');
      highlightError('card-weather');
      return;
    }
    if (!state.occasion) {
      showToast('오늘 어떤 약속인지 언니한테 알려줘야지! 📍');
      highlightError('card-occasion');
      return;
    }
    if (!state.mood) {
      showToast('오늘 어떤 스타일 무드로 입고 싶어? 골라줘 💄');
      highlightError('card-mood');
      return;
    }

    // 로딩 애니메이션 발동
    const overlay = document.getElementById('loading-overlay');
    if (overlay) overlay.classList.add('active');

    setTimeout(() => {
      generateRecommendation();
      if (overlay) overlay.classList.remove('active');
      showPage('page-result');
    }, 750);
  });
}

function highlightError(cardId) {
  const card = document.getElementById(cardId);
  if (card) {
    card.classList.add('has-error');
    card.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
}

// 7. 추천 로직 실행 및 렌더링
function generateRecommendation() {
  const tempMeta = getTempMeta(state.temp);
  const tier = tempMeta.tier;
  const mood = state.mood || 'lovely';
  const outfitData = OUTFIT_DATABASE[tier][mood];

  // 1) 갸루 언니 보이스 멘트 생성
  const weatherNameMap = {
    sunny: '햇살 화창한 맑은 날',
    cloudy: '선선하고 구름 낀 날',
    rainy: '촉촉하게 비 내리는 날',
    snowy: '하얗게 눈 쏟아지는 날',
    windy: '바람이 쌩쌩 부는 날',
    dusty: '미세먼지가 맴도는 날'
  };

  const occasionNameMap = {
    date: '심쿵 데이트/소개팅',
    work: '프로페셔널한 출근/캠퍼스',
    friends: '절친들과 카페 핫플 투어',
    hip: '시선집중 힙한 페스티벌/핫플',
    daily: '편안한 동네 꾸안꾸 마실',
    exercise: '상쾌한 운동 & 산책'
  };

  const moodNameMap = {
    lovely: '러블리 & 페미닌 💖',
    gyaru: '힙스터 Y2K 갸루 🕶️',
    chic: '모던 시크 & 단정 👔',
    casual: '스트릿 & 캐주얼 👟'
  };

  const resultStyleTag = document.getElementById('result-style-tag');
  if (resultStyleTag) resultStyleTag.textContent = moodNameMap[mood];

  let sisterSpeech = `어머 자기야! 오늘 <strong>${state.temp}°C</strong>에 <strong>${weatherNameMap[state.weather]}</strong>이잖아? 게다가 <strong>[${occasionNameMap[state.occasion]}]</strong>이라니 언니가 가만히 있을 수 없지! `;
  sisterSpeech += `오늘 같은 날은 <strong>${outfitData.outer.name}</strong>에 <strong>${outfitData.top.name}</strong> 조합으로 가야 실패가 없어. `;
  sisterSpeech += `언니가 딱 골라준 이 착장 입고 나가면 오늘 인쇼 피팅 모델 소리 무조건 듣는다? 거울 한번 싹 보고 당당하게 다녀와, 알았지? 💖`;

  const resultSpeech = document.getElementById('result-speech');
  if (resultSpeech) resultSpeech.innerHTML = sisterSpeech;

  // 2) 부위별 코디 아이템 렌더링
  const itemsContainer = document.getElementById('outfit-items-container');
  if (itemsContainer) {
    itemsContainer.innerHTML = '';

    const items = [
      { cat: 'OUTER', name: outfitData.outer.name, tip: outfitData.outer.tip, icon: '🧥' },
      { cat: 'TOP', name: outfitData.top.name, tip: outfitData.top.tip, icon: '👚' },
      { cat: 'BOTTOM', name: outfitData.bottom.name, tip: outfitData.bottom.tip, icon: '👖' },
      { cat: 'SHOES', name: outfitData.shoes.name, tip: outfitData.shoes.tip, icon: '👠' },
      { cat: 'ACCESSORY', name: outfitData.acc.name, tip: outfitData.acc.tip, icon: '💍' }
    ];

    items.forEach(it => {
      const div = document.createElement('div');
      div.className = 'outfit-card-item';
      div.innerHTML = `
        <div class="outfit-item-icon">${it.icon}</div>
        <div class="outfit-item-details">
          <div class="outfit-category">${it.cat}</div>
          <div class="outfit-name">${it.name}</div>
          <div class="outfit-tip">✨ <strong>언니 Tip:</strong> ${it.tip}</div>
        </div>
      `;
      itemsContainer.appendChild(div);
    });
  }

  // 3) 꼭 고려해야 하는 조건 렌더링
  const cautionContainer = document.getElementById('result-caution-list');
  if (cautionContainer) {
    cautionContainer.innerHTML = '';

    // 날씨 주의사항
    const weatherTips = WEATHER_CAUTION[state.weather] || WEATHER_CAUTION.sunny;
    weatherTips.forEach(tip => {
      const li = document.createElement('li');
      li.textContent = tip;
      cautionContainer.appendChild(li);
    });

    // 약속별 주의사항
    const occTip = OCCASION_CAUTION[state.occasion];
    if (occTip) {
      const li = document.createElement('li');
      li.textContent = occTip;
      cautionContainer.appendChild(li);
    }

    // 온도 관련 추가 체크
    const tempLi = document.createElement('li');
    tempLi.textContent = `기온 주의 : 현재 ${state.temp}°C 기준으로 해가 지면 체감온도가 급격히 떨어질 수 있으니 이너와 아우터 밸런스를 절대 무너뜨리지 마!`;
    cautionContainer.appendChild(tempLi);
  }

  // 4) 보너스 풀코스 케어 (메뉴, 노래, 운동)
  const hunger = state.hunger || 'starving';
  const menuData = BONUS_DATABASE.meal[hunger][tier];
  const bonusMenuTag = document.getElementById('bonus-menu-tag');
  const bonusMenuDesc = document.getElementById('bonus-menu-desc');
  if (bonusMenuTag) bonusMenuTag.textContent = menuData.tag;
  if (bonusMenuDesc) bonusMenuDesc.innerHTML = `<strong>${menuData.name}</strong> - ${menuData.desc}`;

  // 노래
  const songData = BONUS_DATABASE.songs[Math.floor(Math.random() * BONUS_DATABASE.songs.length)];
  const bonusSongTag = document.getElementById('bonus-song-tag');
  const bonusSongDesc = document.getElementById('bonus-song-desc');
  if (bonusSongTag) bonusSongTag.textContent = songData.artist;
  if (bonusSongDesc) bonusSongDesc.innerHTML = `<strong>${songData.title}</strong> - ${songData.desc}`;

  // 운동
  const workoutData = BONUS_DATABASE.workouts[Math.floor(Math.random() * BONUS_DATABASE.workouts.length)];
  const bonusWorkoutTag = document.getElementById('bonus-workout-tag');
  const bonusWorkoutDesc = document.getElementById('bonus-workout-desc');
  if (bonusWorkoutTag) bonusWorkoutTag.textContent = workoutData.tag;
  if (bonusWorkoutDesc) bonusWorkoutDesc.innerHTML = `<strong>${workoutData.title}</strong> - ${workoutData.desc}`;
}

// 8. 다시 골라보기 버튼
const btnRestart = document.getElementById('btn-restart');
if (btnRestart) {
  btnRestart.addEventListener('click', () => {
    showPage('page-input');
  });
}

// 9. 클립보드 복사 기능
const btnCopy = document.getElementById('btn-copy');
if (btnCopy) {
  btnCopy.addEventListener('click', () => {
    const speech = document.getElementById('result-speech')?.innerText || '';
    const styleTag = document.getElementById('result-style-tag')?.innerText || '';
    const items = Array.from(document.querySelectorAll('.outfit-card-item')).map(el => {
      const cat = el.querySelector('.outfit-category')?.innerText || '';
      const name = el.querySelector('.outfit-name')?.innerText || '';
      return `[${cat}] ${name}`;
    }).join('\n');
    const menu = document.getElementById('bonus-menu-desc')?.innerText || '';
    const song = document.getElementById('bonus-song-desc')?.innerText || '';

    const fullText = `💖 [갸루 언니의 오늘의 착붙 OOTD]\n` +
      `• 스타일: ${styleTag}\n` +
      `• 기온: ${state.temp}°C\n\n` +
      `💬 언니의 한마디:\n"${speech}"\n\n` +
      `👗 코디 아이템:\n${items}\n\n` +
      `🍽️ 추천 메뉴: ${menu}\n` +
      `🎧 추천 BGM: ${song}\n\n` +
      `✨ 오늘 하루도 당당하고 예쁘게 보내기!`;

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(fullText).then(() => {
        showCopySuccess();
      }).catch(() => {
        fallbackCopyText(fullText);
      });
    } else {
      fallbackCopyText(fullText);
    }
  });
}

function fallbackCopyText(text) {
  const textArea = document.createElement('textarea');
  textArea.value = text;
  textArea.style.position = 'fixed';
  textArea.style.top = '-9999px';
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  try {
    document.execCommand('copy');
    showCopySuccess();
  } catch (err) {
    showToast('클립보드 복사에 실패했습니다 🥲');
  }
  document.body.removeChild(textArea);
}

function showCopySuccess() {
  const msg = document.getElementById('copy-success-msg');
  if (msg) {
    msg.style.display = 'flex';
    setTimeout(() => {
      msg.style.display = 'none';
    }, 3000);
  }
  showToast('오늘 코디를 복사했어! 친구한테 공유해봐 💖', '📋');
}
