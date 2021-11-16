import "./StudySetting.scoped.scss";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";

import { API_BASE_URL } from "../../config/index";
import { Alert, Button } from "react-bootstrap";

import * as studyActions from "../../modules/actions/study";

const StudySetting = ({ match }) => {
  const dispatch = useDispatch();

  const { token: storeToken } = useSelector((state) => state.user);
  const { selectedChannel: storeSelectedChannel } = useSelector((state) => state.study);
  const { channelList: storeChannelList } = useSelector((state) => state.study);
  const [studyInfo, setStudyInfo] = useState({});

  const [members, setMembers] = useState([]);
  // 초대 검색 결과 리스트
  const [inviteList, setInviteList] = useState([]);
  const [deleteMember, setDeleteMember] = useState([]);
  const [addedMember, setAddedMember] = useState([]);

  const [host, setHost] = useState("");

  const [show, setShow] = useState(false);

  const [inputs, setInputs] = useState({
    channelName: "",
    memberName: "",
  });
  const { channelName, memberName } = inputs;

  useEffect(() => {
    console.log("effect");
    fetch(API_BASE_URL + `/api/channels/${storeSelectedChannel}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${storeToken}`,
        "Content-Type": "application/json;charset=UTF-8",
      },
    })
      .then((response) => {
        if (response.ok) {
          response.json().then((data) => {
            setStudyInfo(data.data);
            setInputs({
              ...inputs,
              channelName: data.data.name,
            });
            setHost(data.data.host.id);
            setMembers((members) => members.concat(data.data.host));
            setMembers((members) => members.concat(data.data.member));
          });
        }
      })
      .catch((error) => {
        console.log(error);
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
    fetch(API_BASE_URL + "/api/users/searches", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${storeToken}`,
        "Content-Type": "application/json;charset=UTF-8",
      },
      body: JSON.stringify({
        terms: {
          name: memberName,
        },
      }),
    })
      .then((response) => {
        if (response.ok) {
          response.json().then((data) => {
            console.log(data);
            setInviteList([...data.data]);
          });
        }
      })
      .catch((error) => {
        console.log(error);
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
    console.log("==================");
    console.log("update channel");
    console.log(members);
    console.log(addedMember);
    console.log(host);
    console.log(channelName);
    fetch(API_BASE_URL + `/api/channels/${storeSelectedChannel}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${storeToken}`,
        "Content-Type": "application/json;charset=UTF-8",
      },
      body: JSON.stringify({
        name: channelName,
        hostId: host,
        deletedMember: deleteMember,
        addedMember: addedMember,
      }),
    })
      .then((response) => {
        console.log(response);
        if (response.ok) {
          response.json().then((data) => {
            setStudyInfo({
              ...studyInfo,
              name: channelName,
              member: [...studyInfo.member, members],
            });

            dispatch(studyActions.updateChannel({ id: match.params.channelId, name: channelName }));
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const clickDeleteButton = () => {
    setShow(true);
  };

  const deleteChannel = () => {
    fetch(API_BASE_URL + `/api/channels/${match.params.channelId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${storeToken}`,
        "Content-Type": "application/json;charset=UTF-8",
      },
    })
      .then((response) => {
        if (response.ok) {
          response.json().then((data) => {
            dispatch(studyActions.deleteChannel(match.params.channelId));
            setShow(false);
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
      <div className="container">
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
          <div className="result" style={{ display: memberName?.length > 0 ? "none" : "block" }}>
            {members.map((data, index) => {
              return (
                <div className="member-item" key={index}>
                  <p>{data.name}</p>
                  <button
                    type="button"
                    className={`btn btn-danger ${data.id === studyInfo.host.id ? "disabled" : ""}`}
                    onClick={() => onRemove(data.id)}
                  >
                    삭제
                  </button>
                </div>
              );
            })}
          </div>
          <div className="result" style={{ display: memberName?.length > 0 ? "block" : "none" }}>
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
          className={`btn btn-success btn-submit ${channelName.length === 0 ? "disabled" : ""}`}
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
        <p>정말 {studyInfo.name}을 삭제 하시겠습니까? 삭제된 채널은 복구할 수 없어요.</p>
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
    </div>
  );
};

export default StudySetting;
