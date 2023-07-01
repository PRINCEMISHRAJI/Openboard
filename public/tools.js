let optionsCont = document.querySelector(".options-cont");
let optionsFlag = true;
let toolsCont = document.querySelector(".tools-cont");
let pencilToolCont = document.querySelector(".pencil-tool-cont");
let eraserToolCont = document.querySelector(".eraser-tool-cont");
let pencil = document.querySelector(".pencil");
let pencilFlag = false;
let eraser = document.querySelector(".eraser");
let eraserFlag = false;
let sticky = document.querySelector(".stickyNote");
let upload = document.querySelector(".upload");


optionsCont.addEventListener("click", (e) => {
    if(optionsFlag){
        openTools();
    }else {
        closeTools();
    }
})

function openTools(){
    optionsCont.children[0].setAttribute("class","fa-solid fa-bars fa-flip");
    toolsCont.style.display = "none";
    optionsFlag = !optionsFlag;
}

function closeTools(){
    optionsCont.children[0].setAttribute("class","fa-solid fa-square-xmark fa-flip");
    toolsCont.style.display = "flex";
    pencilToolCont.style.display = "none";
    eraserToolCont.style.display = "none";
    optionsFlag = !optionsFlag;
}

pencil.addEventListener("click", (e) => {
    if(pencilFlag){
        pencilToolCont.style.display = "block";
        pencilFlag = !pencilFlag;
    }else{
        pencilToolCont.style.display = "none";
        pencilFlag = !pencilFlag;
    }
})

eraser.addEventListener("click", (e) => {
    if(eraserFlag){
        eraserToolCont.style.display = "flex";
        eraserFlag = !eraserFlag;
    }else {
        eraserToolCont.style.display = "none";
        eraserFlag = !eraserFlag;
    }
})

sticky.addEventListener("click", (e) => {
    // stickyNoteCont.style.display = "block";
    // stickyFlag = !stickyFlag;
    let stickyTemplateHTML =  `
    <div class="header">
        <div class="minimize"></div>
        <div class="close"></div>
    </div>
    <div class="note">
        <textarea spellcheck = "false" ></textarea>
    </div>
    `;
    createSticky(stickyTemplateHTML);
})

upload.addEventListener("click", (e) => {
    // Open file explorer
    let input = document.createElement("input");
    input.setAttribute("type", "file");
    input.click();

    input.addEventListener("change", (e)=> {
        let file = input.files[0];
        let url = URL.createObjectURL(file);
        let stickyTemplateHTML =  `
        <div class="header">
        <div class="minimize"></div>
        <div class="close"></div>
        </div>
        <div class="note">
            <img src = "${url}" />
        </div>
        `;
        createSticky(stickyTemplateHTML);
    })
})

function createSticky(stickyTemplateHTML){
    console.log("check");
    let stickyCont = document.createElement("div");
    stickyCont.setAttribute("class", "sticky-note-cont");
    stickyCont.innerHTML = stickyTemplateHTML;
    document.body.appendChild(stickyCont);
    let minimize = stickyCont.querySelector(".minimize");
    let close = stickyCont.querySelector(".close");
    noteActions(minimize, close, stickyCont);


    stickyCont.onmousedown = function(event) {
        dragAndDrop(stickyCont, event);
        
    };

    stickyCont.ondragstart = function() {
    return false;
    };
}

function dragAndDrop(element, event){
    let shiftX = event.clientX - element.getBoundingClientRect().left;
    let shiftY = event.clientY - element.getBoundingClientRect().top;

    // (1) prepare to moving: make absolute and on top by z-index
    element.style.position = 'absolute';
    element.style.zIndex = 1000;
  
    // move it out of any current parents directly into body
    // to make it positioned relative to the body
  
    // centers the ball at (pageX, pageY) coordinates
    function moveAt(pageX, pageY) {
      element.style.left = pageX - shiftX + 'px';
      element.style.top = pageY - shiftY + 'px';
    }
  
    // move our absolutely positioned ball under the pointer
    moveAt(event.pageX, event.pageY);
  
    function onMouseMove(event) {
      moveAt(event.pageX, event.pageY);
    }
  
    // (2) move the ball on mousemove
    document.addEventListener('mousemove', onMouseMove);
  
    // (3) drop the ball, remove unneeded handlers
    element.onmouseup = function() {
      document.removeEventListener('mousemove', onMouseMove);
      element.onmouseup = null;
    };
}

function noteActions(minimize, close, stickyCont){
    close.addEventListener("click", (e)  => {
        stickyCont.remove();
    })
    minimize.addEventListener("click", (e) => {
        let noteCont = stickyCont.querySelector(".note");
        let display = getComputedStyle(noteCont).getPropertyValue("display");
        if(display === "none") noteCont.style.display = "block";
        else noteCont.style.display = "none";
    })
}