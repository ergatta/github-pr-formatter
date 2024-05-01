var bodyInputNewPr = document.querySelector("#pull_request_body");
var bodyInputExistingPr = document.querySelector('[id^="issue-"][id$="-body"]');

const allImgsFormat1Regex = /<img.*?>/g;
const allImgsFormat2Regex = /!\[(.*?)\]\((.*?)\)/g; 
const widthRegex = /width="(\d+)"/;

function formatImages() {
    // Get the body value
    let body = "";
    let existing = (bodyInputNewPr == null)
    if (existing) {
        body = bodyInputExistingPr.value;
    } else {
        body = bodyInputNewPr.value;
    }

    // FORMAT 1: handle all images with the <img/> format
    const imgsFormat1 = body.match(allImgsFormat1Regex);
    // Loop through each <img> tag
    if (imgsFormat1 != null ){
        imgsFormat1.forEach(imgTag => {
            // Extract the width attribute value
            const widthMatch = imgTag.match(widthRegex);
            if (widthMatch) {
                const width = parseInt(widthMatch[1]);
                // Replace the width attribute value based on the condition
                const newWidth = width < 600 ? '33%' : '66%';
                // Replace the width attribute in the <img> tag
                const newImgTag = imgTag.replace(widthRegex, `width="${newWidth}"`);
                // Replace the original <img> tag with the modified one
                body = body.replace(imgTag, newImgTag);
            }
        });
    }
    

    // FORMAT 2: handle all images with the [image name](url) format 
    // we can't know the width of the images in this format so always set it to 33%
    body = body.replace(/!\[(.*?)\]\((.*?)\)/g, '<img src="$2" alt="$1" width="33%">');

    // Set the value of the body input field
    if (existing) {
        bodyInputExistingPr.value = body;
    } else {
        bodyInputNewPr.value = body;
    }
}

formatImages();