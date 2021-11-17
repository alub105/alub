/* eslint-disable */
import React, { useState } from "react";
import { Dropdown, DropdownButton } from "react-bootstrap";
import SyntaxHighlighter from "react-syntax-highlighter";
import {
  githubGist,
  darcula,
} from "react-syntax-highlighter/dist/cjs/styles/hljs";

const UserCode = ({ user, codeList }) => {
  const [selected, setSelected] = useState(codeList.length - 1);

  function setCode(idx){
    setSelected(idx);
  }

  return (
    <div>
      <div className="header">
        <h1>{user.name}</h1>
        <DropdownButton
          id="dropdown-basic-button"
          title={codeList[selected].filename}
          onSelect={
            (eventKey) => setSelected(eventKey)
          }
        >
          {codeList.map(({filename}, idx) => {
            return (
              <Dropdown.Item key={idx} eventKey={idx}>{filename}</Dropdown.Item>
            );
          })}
        </DropdownButton>
      </div>
      <SyntaxHighlighter
        className="code"
        language="java"
        style={githubGist}
        showLineNumbers
        lineProps={{style: {wordBreak: 'break-all', whiteSpace: 'pre-wrap'}}}
        wrapLines={true}
        // wrapLongLines
      >
        {Buffer.from(codeList[selected].content, "base64").toString("utf-8")}
      </SyntaxHighlighter>
    </div>
  );
};

export default UserCode;
