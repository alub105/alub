import "./StudySetting.scoped.scss";
import { useSelector } from "react-redux";

const StudySetting = () => {
  const { studyInfo: storeStudyInfo } = useSelector((state) => state.study);
  const { token: storeToken } = useSelector((state) => state.user);

  return (
    <div className="study-setting">
      <h1>${storeStudyInfo} 스터디 세팅</h1>
    </div>
  );
};

export default StudySetting;
