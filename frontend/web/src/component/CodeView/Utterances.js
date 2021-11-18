import React, { useEffect, createRef } from "react";

const Utterances = () => {
  const commentRef = createRef();

  useEffect(() => {
    const utterances = document.createElement("script");

    const uttrancesConfig = {
      src: "https://uttrance.se/client.js",
      repo: "choieunsong/finall",
      "issue-term": "[ENTER TERM HERE]",
      theme: "github-light",
      crossorigin: "anonymous",
      async: true,
    };

    Object.entries(uttrancesConfig).forEach(([key, value]) => {
      utterances.setAttribute(key, value);

      commentRef.current.appendChild(utterances);
    });
  });

  return (
    <div>
      <div className="comments" ref={commentRef} />
    </div>
  );
};

export default Utterances;
