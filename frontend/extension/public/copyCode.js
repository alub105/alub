
function copyCode (BASE_URL) {
  chrome.storage.sync.get("commitNow", function (response) {
    if (response.commitNow) {
      const userId = document.querySelector(".loginbar .username")?.innerHTML
      const solvedUserId = document.querySelector('.table-striped')?.childNodes[1]?.childNodes[0]?.childNodes[1]?.textContent
      const resultTable = document.querySelector('.table-striped')
      const correct = (resultTable?.childNodes[1]?.childNodes[0]?.childNodes[4]?.childNodes[0]?.textContent?.includes("맞") || resultTable?.childNodes[1]?.childNodes[0]?.childNodes[4]?.childNodes[0]?.textContent?.includes("100"))
        && userId===solvedUserId
      const problemNumber = resultTable?.childNodes[1]?.childNodes[0]?.childNodes[2]?.textContent
      const problemName = resultTable?.childNodes[1]?.childNodes[0]?.childNodes[3]?.textContent
      const memory = resultTable?.childNodes[1]?.childNodes[0]?.childNodes[5]?.textContent
      const timeConsumed =resultTable?.childNodes[1]?.childNodes[0]?.childNodes[6]?.textContent
      const answerCode = document.getElementsByName("source")[0]?.innerText
      let commitConfig = ''
      chrome.storage.sync.get("commitConfig", function (response) {
        if (Object.keys(response).length !== 0){
          commitConfig = response.commitConfig
        }
      })
      let codeLang = ''
      let site = ''
      const lang = document.querySelector(".table-striped")?.childNodes[1]?.childNodes[0]?.childNodes[7]?.textContent
      if (typeof(lang) === 'string'){
        if(lang.includes('Py')){codeLang = 'py'}
        if(lang.includes('Java')){codeLang = 'java'}
        if(lang.includes('C')){
          if(lang.includes('++')) {codeLang = 'cpp'}
            else { codeLang = 'c'}
          }
        if(lang.includes('Ruby')){codeLang = 'rbw'}
        if(lang.includes('Rust')){codeLang = 'rs'}
        if(lang.includes('Go')){codeLang = 'go'}
        if(lang.includes('node')){codeLang = 'js'}
        if(lang.includes('Text')){codeLang = 'txt'}
        if(lang.includes('Swift')){codeLang = 'swift'}
      } 
      const url = window.location.href
      if (url.includes("acmicpc.net")){site = "BOJ"};
      if (url.includes("programmers")){site = "PROGRAMMERS"};
      
      if (correct){
        chrome.storage.sync.get("token", function(token) {
          if (commitConfig === "DEFAULT") {
            
            const data = {
                    srcCode: answerCode,
                    commit: commitConfig,
                    language: codeLang,
                    runningTime: timeConsumed,
                    runningMemory: memory,
                    problemName: problemName,
                    problemNum: problemNumber,
                    site: site,
                  }
          
            fetch(BASE_URL + "/api/user/commits", {
              method: "POST",
              headers: {
                Authorization: `Bearer ${token.token}`,
                "Content-Type": "application/json;charset=UTF-8"
              },
              body: JSON.stringify(
                data
              ),
            })
              .then((response) => {
                console.log(response)
              })
              .catch((err) => {
                console.log(err);
            });
            
          } else {
            
            let repoName = ''
            chrome.storage.sync.get("repoName", function (response) {
              if (Object.keys(response).length !== 0){
                repoName = response.repoName
              }
              const inputModal = document.createElement('div')
              inputModal.setAttribute("class", "modal")
              inputModal.style.width = "100%"
              inputModal.style.height = "100%"
              inputModal.style.backgroundColor = "black"
              inputModal.style.opacity = '0.6'
              inputModal.style.display = "flex"
              inputModal.style.position = "fixed"
              inputModal.style.top = 0
              inputModal.style.left = 0
              inputModal.style.justifyContent = "center"
              inputModal.style.alignItems = "center"

              const inputModalHeader = document.createElement('div')
              inputModalHeader.style.textAlign = "center"
              inputModalHeader.style.position = "relative"
              inputModalHeader.style.backgroundColor = "white"
              inputModalHeader.style.borderRadius = "10px"
              inputModalHeader.style.opacity = '1.0'
              inputModalHeader.style.padding = "45px 25px"
              inputModalHeader.style.width = "35%"
              inputModalHeader.style.height = "35%"
              

              const inputForm = document.createElement('form')
              inputForm.style.marginTop = '15px'
              const inputText = document.createElement('p')
              inputText.innerText = `repo위치: ${repoName}/${site}/${problemNumber}/`
              inputText.style.fontSize = '25px'
              const inputDiv = document.createElement('div')
              inputDiv.style.margin = "25px"
              const fileNameInput = document.createElement('input')
              inputDiv.innerHTML = "<span>파일명: </span>"
              inputDiv.style.fontSize = "25px"
              inputDiv.appendChild(fileNameInput)
              inputDiv.append(`.${codeLang}`)

              const inputButton = document.createElement('button')
              inputButton.setAttribute('class', 'btn btn-primary')
              inputButton.style.padding = '15px 20px'
              inputButton.style.fontSize = '20px'

              inputButton.addEventListener('click', submitCommitData)
              inputButton.innerText = "Commit"
              inputModalHeader.appendChild(inputForm)
              inputForm.append(inputText)
              inputForm.appendChild(inputDiv)
              inputForm.appendChild(inputButton)
              inputModal.appendChild(inputModalHeader)

    
              document.querySelector('.container.content')?.appendChild(inputModal)
              
              function submitCommitData () {
                chrome.storage.sync.set({commitNow:false}, () => {})
                let fileName = fileNameInput.value
                const data = {
                  srcCode: answerCode,
                  commit: commitConfig,
                  language: codeLang,
                  fileName:fileName,
                  runningTime: timeConsumed,
                  runningMemory: memory,
                  problemName: problemName,
                  problemNum: problemNumber,
                  site: site,
                }
    
                fetch(BASE_URL + "/api/user/commits", {
                  method: "POST",
                  headers: {
                    Authorization: `Bearer ${token.token}`,
                    "Content-Type": "application/json;charset=UTF-8"
                  },
                  body: JSON.stringify(
                    data
                  ),
                })
                .then((response) => {
                  console.log(response)
                  
                  
                })
                .catch((err) => {
                  console.log(err);
                });
              }
            })    
        }})
      }
    }

  })
}

export default copyCode