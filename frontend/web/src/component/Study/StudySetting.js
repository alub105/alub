/* eslint-disable */
import "./StudySetting.scoped.scss";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState, useCallback } from "react";
import { useHistory } from "react-router";

import { Alert, Button, Toast } from "react-bootstrap";

import * as studyActions from "../../modules/actions/study";
import * as util from "../../modules/axios/util";

const StudySetting = ({ match }) => {
  const dispatch = useDispatch();
  const history = useHistory();

  const { token: storeToken } = useSelector((state) => state.user);
  const channelId = match.params.channelId;

  const [studyInfo, setStudyInfo] = useState({});

  const [members, setMembers] = useState([]);
  // 초대 검색 결과 리스트
  const [inviteList, setInviteList] = useState([]);
  const [deleteMember, setDeleteMember] = useState([]);
  const [addedMember, setAddedMember] = useState([]);

  const [host, setHost] = useState("");

  // alert show
  const [show, setShow] = useState(false);
  // toast show
  const [toastShow, setToastShow] = useState(false);

  const [inputs, setInputs] = useState({
    channelName: "",
    memberName: "",
  });
  const { channelName, memberName } = inputs;

  useEffect(() => {
    util.getStudyInfo(channelId, storeToken).then((data) => {
      setStudyInfo(data.data);
      setInputs({
        ...inputs,
        channelName: data.data.name,
      });
      setHost(data.data.host.id);
      let blank = [];
      setMembers([...blank]);
      setMembers((members) => members.concat(data.data.host));
      setMembers((members) => members.concat(data.data.member));
    });
  }, []);

  const onChange = (e) => {
    const { value, name } = e.target;
    setInputs({
      ...inputs,
      [name]: value,
    });

    if (memberName === "") {
      initHistory();
    }
  };
  const onChangeHost = (e) => {
    setHost(e.target.value);
  };

  const searchMemberApi = () => {
    util.searchMember(memberName, storeToken).then((data) => {
      setInviteList([...data.data]);
    });
  };

  const searchMember = (e) => {
    if (e.key === "Enter") {
      searchMemberApi();
      // 기존 검색 결과 리스트 초기화
      let blank = [];
      setInviteList([...blank]);
    }
  };

  const onRemove = (deleteId) => {
    // add에 있고 원래 멤버였으면 => delete 추가 안함. add에서 제거
    if (addedMember?.some((addId) => addId === deleteId)) {
      setAddedMember(addedMember.filter((addId) => deleteId !== addId));
    } else {
      // delete에 없으면 id 추가
      if (!deleteMember?.some((dm) => dm === deleteId)) {
        setDeleteMember(deleteMember.concat(deleteId));
      }
    }
    setMembers(members.filter((member) => deleteId !== member.id));
  };

  const addMember = (member) => {
    // delete에 있고 원년 멤버였으면 =>  add에 추가 안함. delete에서 삭제
    if (deleteMember?.some((deleteId) => deleteId === member.id)) {
      setDeleteMember(
        deleteMember.filter((deleteId) => deleteId !== member.id)
      );
    } else {
      // add에 없으면 id 추가
      if (!addedMember?.some((am) => am === member.id)) {
        setAddedMember(addedMember.concat(member.id));
      }
    }

    // 결과 리스트에 선택한 멤버 추가
    setMembers(members.concat(member));

    setInputs({
      ...inputs,
      memberName: "",
    });
    initHistory();
  };

  const updateChannel = () => {
    util
      .updateChannel(
        channelId,
        channelName,
        host,
        deleteMember,
        addedMember,
        storeToken
      )
      .then((data) => {
        setToastShow(true);
        setStudyInfo({
          ...studyInfo,
          name: channelName,
          member: [...studyInfo.member, members],
        });
        dispatch(
          studyActions.updateChannel({
            id: channelId,
            name: channelName,
          })
        );
      });
  };

  const clickDeleteButton = () => {
    setShow(true);
  };

  const deleteChannel = () => {
    util.deleteChannel(channelId, storeToken).then((data) => {
      dispatch(studyActions.deleteChannel(channelId));
      setShow(false);
      history.push("/channel/");
    });
  };

  const initHistory = () => {
    let blank = [];
    setInviteList([...blank]);
  };

  const checkInvited = useCallback((newMember) => {
    // 초대안됐으면 false, 이미 존재하면 true
    if (!members?.some((member) => member.id === newMember.id)) {
      return false;
    } else if (newMember.name === host) {
      return true;
    } else {
      return true;
    }
  });

  return (
    <div className="study-setting">
      <h1> {studyInfo.name} 스터디 채널 설정</h1>
      <div className="setting-container">
        <div className="grid-col">
          <h4>스터디 이름</h4>
          <input
            type="text"
            className="form-control"
            name="channelName"
            value={channelName || ""}
            onChange={onChange}
          />
        </div>
        <div className="grid-col">
          <h4>방장</h4>
          <select className="form-select" value={host} onChange={onChangeHost}>
            {members.map((member, index) => {
              return (
                <option key={index} value={member.id}>
                  {member.name}
                </option>
              );
            })}
          </select>
        </div>
        <div className="member">
          <h4>스터디원 추가</h4>
          <div className="member-name">
            <input
              type="text"
              className="form-control"
              placeholder="친구 찾기"
              maxLength="100"
              name="memberName"
              value={memberName || ""}
              onChange={onChange}
              onKeyPress={searchMember}
            />
            <button
              type="button"
              className="btn btn-outline-primary"
              onClick={() => searchMemberApi()}
            >
              검색
            </button>
          </div>
          <div
            className="result"
            style={{ display: memberName?.length > 0 ? "none" : "block" }}
          >
            {members.map((data, index) => {
              return (
                <div className="member-item" key={index}>
                  <p>{data.name}</p>
                  <button
                    type="button"
                    className={`btn btn-danger ${
                      data.id === studyInfo.host.id ? "disabled" : ""
                    }`}
                    onClick={() => onRemove(data.id)}
                  >
                    삭제
                  </button>
                </div>
              );
            })}
          </div>
          <div
            className="result"
            style={{ display: memberName?.length > 0 ? "block" : "none" }}
          >
            <h4 style={{ display: inviteList?.length > 0 ? "none" : "block" }}>
              검색 결과가 없습니다
            </h4>
            {inviteList.map((member, index) => {
              return (
                <div className="member-item" key={index}>
                  <p>{member.name}</p>
                  <button
                    type="button"
                    className={`btn btn-success ${
                      checkInvited(member) ? "disabled" : ""
                    }`}
                    onClick={() => addMember(member)}
                  >
                    초대
                  </button>
                </div>
              );
            })}
          </div>
        </div>
        <button
          type="button"
          className={`btn btn-success btn-submit ${
            channelName.length === 0 ? "disabled" : ""
          }`}
          onClick={() => updateChannel()}
        >
          완료
        </button>
      </div>
      <hr style={{ border: "solid 1px" }} />
      <button
        type="button"
        className="btn btn-danger btn-delete"
        onClick={() => clickDeleteButton()}
      >
        채널 삭제
      </button>

      {/*----------------- 삭제 alert ---------------------*/}
      <Alert show={show} variant="dark" className="my-alert">
        <Alert.Heading> {studyInfo.name} 삭제</Alert.Heading>
        <p>
          정말 {studyInfo?.name}을 삭제 하시겠습니까? 삭제된 채널은 복구할 수
          없어요.
        </p>
        <hr />
        <div className="d-flex justify-content-center gap-3">
          <Button onClick={() => deleteChannel()} variant="danger">
            삭제
          </Button>
          <Button onClick={() => setShow(false)} variant="success">
            취소
          </Button>
        </div>
      </Alert>
      <Toast
        onClose={() => setToastShow(false)}
        show={toastShow}
        delay={3000}
        autohide
        bg={"success"}
        className="toast"
      >
        <Toast.Header>
          <img src="holder.js/20x20?text=%20" className="rounded me-2" alt="" />
          <strong className="me-auto">ALUB</strong>
        </Toast.Header>
        <Toast.Body>성공적으로 채널 정보가 수정되었습니다</Toast.Body>
      </Toast>
    </div>
  );
};

export default StudySetting;
