import stylesheet from '../css/Setting.css';

export default (
    <div class="hidden clearfix" id="refresherSetting">
        <style>{stylesheet}</style>
        <div class="row">
            <div class="col-sm-0 col-md-2" />
            <div class="col-sm-12 col-md-8">
                <div class="dialog card">
                    <div class="card-block">
                        <h4 class="card-title">아카 리프레셔(Arca Refresher) 설정</h4>
                        <hr />
                        <h5 class="card-title">유틸리티</h5>
                        <div class="row">
                            <label class="col-md-3">자동 새로고침</label>
                            <div class="col-md-9">
                                <select id="refreshTime" data-type="number">
                                    <option value="0">사용 안 함</option>
                                    <option value="3">3초</option>
                                    <option value="5">5초</option>
                                    <option value="10">10초</option>
                                </select>
                                <p>일정 시간마다 게시물 목록을 갱신합니다.</p>
                            </div>
                        </div>
                        <div class="row">
                            <label class="col-md-3">새로고침 애니메이션 숨김</label>
                            <div class="col-md-9">
                                <select id="hideRefresher" data-type="bool">
                                    <option value="false">사용 안 함</option>
                                    <option value="true">사용</option>
                                </select>
                                <p />
                            </div>
                        </div>
                        <div class="row">
                            <label class="col-md-3">단축키 사용</label>
                            <div class="col-md-9">
                                <select id="useShortcut" data-type="bool">
                                    <option value="false">사용 안 함</option>
                                    <option value="true">사용</option>
                                </select>
                                <p>
                                    <a href="https://github.com/lekakid/ArcaRefresher/wiki/Feature#%EB%8B%A8%EC%B6%95%ED%82%A4%EB%A1%9C-%EB%B9%A0%EB%A5%B8-%EC%9D%B4%EB%8F%99" target="_blank" rel="noreferrer">
                                        단축키 안내 바로가기
                                    </a>
                                </p>
                            </div>
                        </div>
                        <div class="row">
                            <label class="col-md-3">비추천 재확인 창</label>
                            <div class="col-md-9">
                                <select id="blockRatedown" data-type="bool">
                                    <option value="false">사용 안 함</option>
                                    <option value="true">사용</option>
                                </select>
                                <p />
                            </div>
                        </div>
                        <div class="row">
                            <label class="col-md-3">자짤 관리</label>
                            <div class="col-md-9">
                                <button id="removeMyImage" class="btn btn-success">삭제</button>
                                <p>게시물 조회 시 이미지 오른쪽 클릭 메뉴에서 관리합니다.</p>
                            </div>
                        </div>
                        <div class="row">
                            <label class="col-md-3">다운로더 이름 포맷</label>
                            <div class="col-md-9">
                                <input type="text" id="imageDownloaderFileName" />
                                <p>
                                    이미지 일괄 다운로드 사용 시 저장할 파일 이름입니다.<br />
                                    %title% : 게시물 제목<br />
                                    %category% : 게시물 카테고리<br />
                                    %author% : 게시물 작성자<br />
                                    %channel% : 채널 이름<br />
                                </p>
                            </div>
                        </div>
                        <div class="row">
                            <label class="col-md-3">알림 아이콘 색상 변경</label>
                            <div class="col-md-9">
                                <input type="text" id="notificationIconColor" />
                                <p>알림 아이콘의 점등 색상을 변경합니다.</p>
                            </div>
                        </div>
                        <hr />
                        <h5 class="card-title">요소 관리</h5>
                        <div class="row">
                            <label class="col-md-3">상단 헤더</label>
                            <div class="col-md-9">
                                <select id="fixHeader" data-type="bool">
                                    <option value="false">고정 안 함</option>
                                    <option value="true">고정</option>
                                </select>
                                <p>채널 목록, 스크립트 설정 버튼이 있는 상단 헤더 메뉴를 화면 상단에 고정합니다.</p>
                            </div>
                        </div>
                        <div class="row">
                            <label class="col-md-3">우측 사이드 메뉴</label>
                            <div class="col-md-9">
                                <select id="hideSideMenu" data-type="bool">
                                    <option value="false">보임</option>
                                    <option value="true">숨김</option>
                                </select>
                                <p>베스트 라이브, 헤드라인 등 우측 사이드 메뉴를 숨깁니다.</p>
                            </div>
                        </div>
                        <div class="row">
                            <label class="col-md-3">프로필 아바타</label>
                            <div class="col-md-9">
                                <select id="hideAvatar" data-type="bool">
                                    <option value="false">보임</option>
                                    <option value="true">숨김</option>
                                </select>
                                <p>게시물 조회 시 프로필 아바타를 숨깁니다.</p>
                            </div>
                        </div>
                        <div class="row">
                            <label class="col-md-3">본문 이미지, 동영상 사이즈</label>
                            <div class="col-md-9">
                                <input type="text" id="resizeMedia" />
                                <p>
                                    본문 가로 길이를 기준 비율로 이미지, 동영상 크기를 조절합니다.<br />
                                    0~100(%) 사이로 입력
                                </p>
                            </div>
                        </div>
                        <div class="row">
                            <label class="col-md-3">댓글 *수정됨</label>
                            <div class="col-md-9">
                                <select id="hideModified" data-type="bool">
                                    <option value="false">보임</option>
                                    <option value="true">숨김</option>
                                </select>
                                <p>
                                    수정된 댓글의 수정됨 표기를 숨깁니다.<br />
                                    주의) 댓글 삭제 권한 보유 시 삭제됨 표기도 같이 숨겨집니다.
                                </p>
                            </div>
                        </div>
                        <hr />
                        <h5 class="card-title">메모 기능</h5>
                        <div class="row">
                            <label class="col-md-3">메모된 이용자</label>
                            <div class="col-md-9">
                                <select id="userMemo" size="6" multiple="" data-text-format="%key% - %value%" />
                                <p>
                                    메모는 게시물 작성자, 댓글 작성자 아이콘(IP)을 클릭해 할 수 있습니다.<br />
                                    Ctrl, Shift, 마우스 드래그를 이용해서 여러개를 동시에 선택 할 수 있습니다.
                                </p>
                            </div>
                        </div>
                        <hr />
                        <h5 class="card-title">채널 설정</h5>
                        <div class="row">
                            <label class="col-md-3">카테고리 설정</label>
                            <div class="col-md-9">
                                <table class="table align-middle" id="categorySetting">
                                    <colgroup>
                                        <col width="20%" />
                                        <col width="20%" />
                                        <col width="60%" />
                                    </colgroup>
                                    <thead>
                                        <th>카테고리</th>
                                        <th>색상</th>
                                        <th>설정</th>
                                    </thead>
                                    <tbody />
                                </table>
                                <p>
                                    색상: 카테고리를 표시하는 색상을 변경합니다. 더블 클릭 시 무작위 색상이 지정됩니다.<br />
                                    미리보기 숨김: 마우스 오버 시 보여주는 미리보기를 제거합니다.<br />
                                    게시물 뮤트: 해당 카테고리가 포함된 게시물을 숨깁니다.
                                </p>
                            </div>
                        </div>
                        <hr />
                        <h5 class="card-title">뮤트 기능</h5>
                        <div class="row">
                            <label class="col-md-3">사용자 뮤트</label>
                            <div class="col-md-9">
                                <textarea id="blockUser" rows="6" placeholder="뮤트할 이용자의 닉네임을 입력, 줄바꿈으로 구별합니다." />
                                <p>지정한 유저의 게시물과 댓글을 숨깁니다.</p>
                            </div>
                        </div>
                        <div class="row">
                            <label class="col-md-3">키워드 뮤트</label>
                            <div class="col-md-9">
                                <textarea id="blockKeyword" rows="6" placeholder="뮤트할 키워드를 입력, 줄바꿈으로 구별합니다." />
                                <p>지정한 키워드가 포함된 제목을 가진 게시물과 댓글을 숨깁니다.</p>
                            </div>
                        </div>
                        <div class="row">
                            <label class="col-md-3">뮤트된 아카콘</label>
                            <div class="col-md-9">
                                <select id="blockEmoticon" size="6" multiple="" data-text-format="%name%" />
                                <p>
                                    아카콘 뮤트는 댓글에서 할 수 있습니다.<br />
                                    Ctrl, Shift, 마우스 드래그를 이용해서 여러개를 동시에 선택 할 수 있습니다.
                                </p>
                            </div>
                        </div>
                        <hr />
                        <h5 class="card-title">채널 관리자 전용</h5>
                        <div class="row">
                            <label class="col-md-3">삭제 테스트 모드</label>
                            <div class="col-md-9">
                                <select id="useAutoRemoverTest" data-type="bool">
                                    <option value="false">사용 안 함</option>
                                    <option value="true">사용</option>
                                </select>
                                <p>게시물을 삭제하지 않고 어떤 게시물이 선택되는지 붉은 색으로 보여줍니다.</p>
                            </div>
                        </div>
                        <div class="row">
                            <label class="col-md-3">유저 게시물 삭제</label>
                            <div class="col-md-9">
                                <textarea id="autoRemoveUser" rows="6" placeholder="대상 이용자를 줄바꿈으로 구별하여 입력합니다." />
                                <p>지정한 유저의 게시물을 자동으로 삭제합니다.</p>
                            </div>
                        </div>
                        <div class="row">
                            <label class="col-md-3">키워드 포함 게시물 삭제</label>
                            <div class="col-md-9">
                                <textarea id="autoRemoveKeyword" rows="6" placeholder="삭제할 키워드를 입력, 줄바꿈으로 구별합니다." />
                                <p>지정한 키워드가 포함된 제목을 가진 게시물을 삭제합니다.</p>
                            </div>
                        </div>
                        <div class="row btns">
                            <div class="col-12">
                                <a href="#" id="exportConfig" class="btn btn-primary">설정 내보내기</a>
                                <a href="#" id="importConfig" class="btn btn-secondary">설정 가져오기</a>
                                <a href="#" id="resetConfig" class="btn btn-danger">설정 초기화</a>
                            </div>
                        </div>
                        <div class="row btns">
                            <div class="col-12">
                                <a href="#" id="saveAndClose" class="btn btn-primary">저장</a>
                                <a href="#" id="closeSetting" class="btn btn-success">닫기</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
);
