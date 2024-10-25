const gdevtools = {opened:false}
function OpenGDevTools(){
    if(gdevtools.opened == true)return;
    gdevtools.opened = true
    gdevtools.win = window.open("about:blank")
    gdevtools.win.document.title = "GDevTools - "+window.location.href
    window.addEventListener("unload", function(){
        gdevtools.win.close()
    })

    gdevtools.win.document.body.style.margin = '0'
    let tabDiv = gdevtools.win.document.createElement("div")
    tabDiv.style.cssText=`
        width:100vw;
        height:20px;
        border-bottom:4px solid black;
        padding-bottom:2px;
    `
    gdevtools.win.document.body.appendChild(tabDiv)

    let currentTabContainer = gdevtools.win.document.createElement("div")
    function addTab(name){
        let tab = gdevtools.win.document.createElement("button")
        tab.textContent = name;
        tabDiv.appendChild(tab)

        let tabContainer = gdevtools.win.document.createElement("div")
        tabContainer.style.cssText = `
            display: none;
            width:100vw;
            height:calc(100vh - 22px)
            overflow-y: scroll;
        `
        gdevtools.win.document.body.appendChild(tabContainer)

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
                    let p = gdevtools.win.document.createElement("p")
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
}
