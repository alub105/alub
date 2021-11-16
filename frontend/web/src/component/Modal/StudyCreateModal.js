import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Modal } from "react-bootstrap";
import "./StudyCreateModal.scoped.scss";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { ko } from "date-fns/esm/locale";
import { useSelector } from "react-redux";

import { API_BASE_URL } from "../../config/index";

const StudyCreateModal = (props) => {
  const { token: storeToken } = useSelector((state) => state.user);
  const { selectedChannel: storeSelectedChannel } = useSelector((state) => state.study);
  const [inputs, setInputs] = useState({
    studyName: "",
    problem: "",
  });
  const { studyName, problem } = inputs;

  const [studyDate, setStudyDate] = useState(new Date());
  const [homeworkStart, setHomeworkStart] = useState(new Date());
  const [homeworkEnd, setHomeworkEnd] = useState();

  const [site, setSite] = useState("BOJ");

  const studyStartRef = useRef();
  const studyEndRef = useRef();

  const [problems, setProblems] = useState([]);
  const [searchResult, setSearchResult] = useState([]);

  useEffect(() => {
    let blank = [];
    setProblems([...blank]);
    setSearchResult([...blank]);
    setInputs({
      studyName: "",
      problem: "",
    });
  }, [props.show]);

  const onChange = (e) => {
    const { value, name } = e.target;
    setInputs({
      ...inputs,
      [name]: value,
    });
  };

  const handleSite = (e) => {
    setSite(e.target.value);
  };

  const searchProblem = (e) => {
    if (e.key === "Enter") {
      fetch(API_BASE_URL + "/api/problems/searches", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${storeToken}`,
          "Content-Type": "application/json;charset=UTF-8",
        },
        body: JSON.stringify({
          terms: {
            site: site,
            keyword: problem,
          },
        }),
      }).then((response) => {
        if (response.ok) {
          response.json().then((data) => {
            setSearchResult([...data.data]);
          });
        }
      });
    }
  };

  const addProblem = (item) => {
    setSearchResult(searchResult.filter((result) => result.num !== item.num));
    setProblems([...problems, item]);
  };

  const removeProblem = (item) => {
    setProblems(problems.filter((result) => result.num !== item.num));
  };

  const checkSubmitEnable = () => {
    if (
      problems.length > 0 &&
      studyName.length > 0 &&
      studyStartRef.current.value !== "" &&
      studyEndRef.current.value !== ""
    ) {
      return true;
    }
    return false;
  };

  const enabled = useMemo(() => checkSubmitEnable(), [problems, studyName]);

  const studyDateFormat = useCallback((str1, str2) => {
    str1 = str1.replace(/\s+/g, "");
    str1 = str1.replaceAll(".", "-");
    str1 = str1.slice(0, -1);
    return str1 + " " + str2 + ":00";
  });

  const homeworkDateFormat = useCallback((str1, str2) => {
    str1 = str1.replace(/\s+/g, "");
    str1 = str1.replaceAll(".", "-");
    str1 = str1.slice(0, -1);
    let time = str2.split(" ")[4].split(":");
    return str1 + " " + time[0] + ":" + time[1] + ":00";
  });

  const submit = () => {
    let studyStartTime = studyDateFormat(
      studyDate.toLocaleDateString(),
      studyStartRef.current.value
    );
    let studyEndTime = studyDateFormat(studyDate.toLocaleDateString(), studyEndRef.current.value);
    let assignmentStartTime = homeworkDateFormat(
      homeworkStart.toLocaleDateString(),
      homeworkStart.toString()
    );
    let assignmentEndTime = homeworkDateFormat(
      homeworkEnd.toLocaleDateString(),
      homeworkEnd.toString()
    );

    fetch(API_BASE_URL + `/api/channels/${storeSelectedChannel}/studies`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${storeToken}`,
        "Content-Type": "application/json;charset=UTF-8",
      },
      body: JSON.stringify({
        name: studyName,
        startTime: studyStartTime,
        endTime: studyEndTime,
        assignmentStartTime: assignmentStartTime,
        assignmentEndTime: assignmentEndTime,
        assignedProblems: problems,
      }),
    })
      .then((response) => {
        if (response.ok) {
          response.json().then((data) => {
            // 스터디 리스트 추가

            props.onHide();
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <Modal
      {...props}
      aria-labelledby="contained-modal-title-vcenter"
      centered
      backdrop="static"
      keyboard={false}
      className="my-new-modal"
    >
      <Modal.Header className="my-modal-header">
        <i className="fal fa-times fa-2x close-icon" onClick={props.onHide} />
        <Modal.Title id="contained-modal-title-vcenter">새 스터디 만들기</Modal.Title>
      </Modal.Header>
      <Modal.Body className="my-modal-body">
        <div className="grid-column">
          <h4>스터디 이름</h4>
          <input
            type="text"
            className="form-control"
            value={studyName || ""}
            onChange={onChange}
            name="studyName"
            placeholder="스터디 이름을 입력하세요"
          />
        </div>
        <div className="grid-column-4">
          <h4>스터디 날짜</h4>
          <DatePicker
            selected={studyDate}
            onChange={(date) => setStudyDate(date)}
            locale={ko}
            dateFormat="yyyy년 MM월 dd일"
            className="my-form study-input"
            step="5"
            minDate={new Date()}
          />
          <input
            type="time"
            name="studyTime"
            ref={studyStartRef}
            step="900"
            required
            className="my-form study-input"
          />
          <input type="time" name="studyTime" ref={studyEndRef} className="my-form study-input" />
        </div>
        <div className="grid-column-3">
          <h4>과제 기한</h4>
          <DatePicker
            selected={homeworkStart}
            onChange={(date) => setHomeworkStart(date)}
            locale={ko}
            dateFormat="yyyy년 MM월 dd일 - hh시 mm분"
            showTimeSelect
            minDate={new Date()}
            className="my-form study-input"
          />
          <DatePicker
            selected={homeworkEnd}
            onChange={(date) => setHomeworkEnd(date)}
            locale={ko}
            dateFormat="yyyy년 MM월 dd일 - hh시 mm분"
            showTimeSelect
            minDate={homeworkStart}
            className="my-form study-input"
            placeholderText="과제 마감일을 선택하세요"
          />
        </div>
        <div className="problem">
          <div className="grid-column-problem">
            <h4>문제 검색</h4>
            <select className="form-select" value={site} onChange={handleSite}>
              <option value="BOJ">백준</option>
              <option value="PROGRAMMERS">프로그래머스</option>
            </select>
            <input
              type="text"
              className="form-control"
              placeholder="문제 번호나 제목을 입력하세요."
              name="problem"
              value={problem || ""}
              onChange={onChange}
              onKeyPress={searchProblem}
            />
          </div>
          <div className="result" style={{ display: problem.length === 0 ? "block" : "none" }}>
            {problems.map((result, index) => {
              return (
                <div className="problem-content" key={index}>
                  <p>
                    [{result.site}] &nbsp; {result.title} - {result.num} - {result.level}
                  </p>
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={() => removeProblem(result)}
                  >
                    삭제
                  </button>
                </div>
              );
            })}
          </div>
          <div className="result" style={{ display: problem.length > 0 ? "block" : "none" }}>
            <h4 style={{ display: searchResult?.length > 0 ? "none" : "block" }}>
              검색 결과가 없습니다
            </h4>
            {searchResult.map((result, index) => {
              return (
                <div className="problem-content" key={index}>
                  <p>
                    [{result.site}] &nbsp; {result.title} - {result.num} - {result.level}
                  </p>
                  <button
                    type="button"
                    className="btn btn-success"
                    onClick={() => addProblem(result)}
                  >
                    추가
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer className="my-new-modal-footer">
        <button
          type="button"
          className={`btn btn-success submit ${enabled ? "" : "disabled"}`}
          onClick={() => submit()}
        >
          등록
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default StudyCreateModal;
