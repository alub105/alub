import "./StudySetting.scoped.scss";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { useHistory } from "react-router";

import { API_BASE_URL } from "../../config/index";
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
  };
  const onChangeHost = (e) => {
    console.log(e.target.value);
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

  const onRemove = (id) => {
    setMembers(members.filter((member) => member.id !== id));
    if (studyInfo.member.find((f) => f.id === id)) {
      setDeleteMember((deleteMember) => [...deleteMember, id]);
    }
  };

  const addMember = (member) => {
    console.log(member);
    // 결과 리스트에 선택한 멤버 추가
    // 중복 없을 때만 add
    if (members.filter((m) => m.id === member.id).length === 0) {
      setMembers(members.concat(member));
      setAddedMember(addedMember.concat(member.id));
    }

    setInputs({
      ...inputs,
      memberName: "",
    });
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
        console.log(data.data);
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
    fetch(API_BASE_URL + `/api/channels/${channelId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${storeToken}`,
        "Content-Type": "application/json;charset=UTF-8",
      },
    })
      .then((response) => {
        if (response.ok) {
          response.json().then((data) => {
            dispatch(studyActions.deleteChannel(channelId));
            setShow(false);
            history.push("/channel/");
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

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
                    className="btn btn-success"
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
          정말 {studyInfo.name}을 삭제 하시겠습니까? 삭제된 채널은 복구할 수
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
