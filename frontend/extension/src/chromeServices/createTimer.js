
const createTimer = (hh, mm, ss) => {
  const component = document.createElement('div')
  component.id = "component"
  const componentHeader = document.createElement("div")
  componentHeader.id = "componentHeader"
  componentHeader.innerText = "여길클릭해서 이동"
  component.appendChild(componentHeader)

  component.style.position = 'absolute'
  component.style.zIndex = 9
  component.style.backgroundColor = '#f1f1f1'
  component.style.border = '1px solid #d3d3d3'
  component.style.textAlign = 'center'

  componentHeader.style.padding = '10px'
  componentHeader.style.cursor = 'move'
  componentHeader.style.zIndex = 10
  componentHeader.style.backgroundColor = '#2196F3'
  componentHeader.style.color = '#fff'

  
  const timeComponent = document.createElement('p')
  timeComponent.innerText = `${hh}, ${mm}, ${ss}`
  component.appendChild(componentHeader)
  component.appendChild(timeComponent)

  const body = document.querySelector('.page-header')
  body?.appendChild(component)
  
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    
      // if present, the header is where you move the DIV from:
  componentHeader.onmousedown = dragMouseDown;
      // otherwise, move the DIV from anywhere inside the DIV:
    // component.onmousedown = dragMouseDown;
    
  
  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position:
    component.style.top = (component.offsetTop - pos2) + "px";
    component.style.left = (component.offsetLeft - pos1) + "px";
  }

  function closeDragElement() {
    // stop moving when mouse button is released:
    document.onmouseup = null;
    document.onmousemove = null;
  }
}

export default createTimer