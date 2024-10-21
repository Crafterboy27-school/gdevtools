let win = window.open("about:blank")
win.document.title = "GDevTools - "+window.location.href
window.addEventListener("unload", function(){
    win.close()
})

win.document.body.style.margin = '0'
let tabDiv = win.document.createElement("div")
tabDiv.style.cssText=`
    width:100vw;
    height:20px;
    border-bottom:4px solid black;
    padding-bottom:2px;
`
win.document.body.appendChild(tabDiv)

let currentTabContainer = win.document.createElement("div")
function addTab(name){
    let tab = win.document.createElement("button")
    tab.textContent = name;
    tabDiv.appendChild(tab)

    let tabContainer = win.document.createElement("div")
    tabContainer.style.cssText = `
        display: none;
        width:100vw;
        height:calc(100vh - 22px)
        overflow-y: scroll;
    `
    win.document.body.appendChild(tabContainer)

    tab.addEventListener("click", function(){
        currentTabContainer.style.display = "none"
        currentTabContainer = tabContainer
        currentTabContainer.style.display = "block"
    })

    return tabContainer
}
let consoleContainer = addTab("Console")

const oldConsole = console
const consoleProxyHandler = {
    get(target, prop, receiver) {
        if(prop=="log"||prop=="error"||prop=="warn"){
            return function(...args){
                let p = win.document.createElement("p")
                p.textContent = JSON.stringify(args)
                consoleContainer.appendChild(p)

                oldConsole[prop](...args)
            }
        }
        return Reflect.get(...arguments);
    },
};

window.addEventListener("error", function(e){
    console.error(e.error.message)
})
  
console = new Proxy(oldConsole, consoleProxyHandler);

a.b = 0