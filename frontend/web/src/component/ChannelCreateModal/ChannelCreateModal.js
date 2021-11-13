/* eslint-disable */
import { React, useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import "./ChannelCreateModal.scoped.scss";

const ChannelCreateModal = (props) => {
  const members = [{ id: 1, name: "choieunsong" }, { id: 2, name: "dlguswjd0258" }];
  const [searchMode, setSearchMode] = useState(false);
  const [name, setName] = useState("");

  useEffect(() => {
    members.map((data) => {
      console.log(data);
    });
  }, []);

  return (
    <Modal
      {...props}
      aria-labelledby="contained-modal-title-vcenter"
      centered
      // backdrop="static"
      // keyboard={false}
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
            id="channelName"
            placeholder="채널 이름"
            maxLength="50"
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
              value={name}
            />
          </div>
          <div className="result" style={{ display: searchMode ? "none" : "block" }}>
            {members.map((data, index) => {
              return (
                <div className="member-item" key={index}>
                  <p>{data.name}</p>
                  <button type="button" className="btn btn-danger">
                    취소
                  </button>
                </div>
              );
            })}
          </div>
          <div className="search" style={{ display: searchMode ? "block" : "none" }}>
            <h4>검색 결과가 없습니다</h4>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer className="my-modal-footer">
        <button type="button" className="btn btn-success btn-lg" onClick={props.onHide}>
          완료
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default ChannelCreateModal;
