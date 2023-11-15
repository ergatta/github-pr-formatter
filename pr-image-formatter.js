var bodyInput = document.querySelector("#pull_request_body");

function formatImages() {
    // Get the body value
    let body = bodyInput.value;

    // Look for all images in the body and format them to be a specific size
    body = body.replace(/!\[(.*?)\]\((.*?)\)/g, '<img src="$2" alt="$1" width="33%">');

    // Set the value of the body input field
    bodyInput.value = body;
}

formatImages();