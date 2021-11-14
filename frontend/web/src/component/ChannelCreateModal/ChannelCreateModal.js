/* eslint-disable */
import { React, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Modal } from "react-bootstrap";
import "./ChannelCreateModal.scoped.scss";
import { API_BASE_URL } from "../../config/index";

const ChannelCreateModal = (props) => {
  const { token: storeToken } = useSelector((state) => state.user);
  const [members, setMembers] = useState([]);

  // 검색한 멤버 결과 목록
  const [memberList, setMemberList] = useState([]);

  const [inputs, setInputs] = useState({
    channelName: "",
    memberName: "",
  });
  const { channelName, memberName } = inputs;

  const onChange = (e) => {
    const { value, name } = e.target;
    setInputs({
      ...inputs,
      [name]: value,
    });
  };

  const searchMember = (e) => {
    if (e.key === "Enter") {
      searchMemberApi();
    }
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
            setMemberList(
              memberList.concat(
                data.data.filter((member) => !memberList.find((f) => f.id === member.id))
              )
            );
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const onRemove = (id) => {
    setMembers(members.filter((member) => member.id !== id));
  };

  const addMember = (member) => {
    setMembers(members.concat(member));
    setInputs({
      ...inputs,
      memberName: "",
    });
  };

  const submit = () => {
    let idList = members.map((member) => member.id);
    console.log(storeToken);
    fetch(API_BASE_URL + "/api/channels/", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${storeToken}`,
        "Content-Type": "application/json;charset=UTF-8",
      },
      body: JSON.stringify({
        name: channelName,
        memberId: idList,
      }),
    }).then((response) => {
      if (response.ok) {
        console.log(response);
        response.json().then((data) => {
          console.log(data);
          const channelId = data.data?.id;
          console.log(channelId);
        });
      }
    });
    // props.onHide();
  };

  return (
    <Modal
      {...props}
      aria-labelledby="contained-modal-title-vcenter"
      centered
      // backdrop="static"
      // keyboard={false}
      className="my-modal"
    >
      <Modal.Header className="my-modal-header">
        <i className="fal fa-times fa-2x close-icon" onClick={props.onHide} />
        <Modal.Title id="contained-modal-title-vcenter">새 채널 만들기</Modal.Title>
        <p>멤버들을 초대해 새 스터디 채널을 만들어 보세요</p>
      </Modal.Header>
      <Modal.Body className="my-modal-body">
        <div className="name">
          <label htmlFor="channelName" className="">
            채널 이름
          </label>
          <input
            type="text"
            className="form-control"
            placeholder="채널 이름"
            maxLength="50"
            name="channelName"
            value={channelName || ""}
            onChange={onChange}
          />
        </div>
        <div className="member">
          <h4>멤버 초대하기</h4>
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
                    className="btn btn-danger"
                    onClick={() => onRemove(data.id)}
                  >
                    취소
                  </button>
                </div>
              );
            })}
          </div>
          <div className="result" style={{ display: memberName?.length > 0 ? "block" : "none" }}>
            <h4 style={{ display: memberList?.length > 0 ? "none" : "block" }}>
              검색 결과가 없습니다
            </h4>
            {memberList.map((member, index) => {
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
      </Modal.Body>
      <Modal.Footer className="my-modal-footer">
        <button type="button" className="btn btn-success btn-lg" onClick={() => submit()}>
          완료
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default ChannelCreateModal;
