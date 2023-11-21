var titleInput = document.getElementById('pull_request_title');
var bodyInput = document.getElementById('pull_request_body');

// Check if a string is numeric
function isNumeric(str) {
    return /^\d+$/.test(str);
}

// Extract the ticket prefix and number from the title and return formatted title, ticketPrefix, and ticketNumber
// Extract the ticket prefix and number from the title and return formatted title string.
// It can handle the following formats:
// - team-name/PREFIX-1234-branch-name-here
// - my-name/branch-name-here
function extractTicketAndFormatTitle(title) {
    let secondPart = title.split('/')[1];
    let ticketParts = secondPart.slice(0, 2);
    let ticketPrefix = '';
    let ticketNumber = '';

    if (isNumeric(ticketParts[1])) {
        console.log('is numeric');
        ticketPrefix = ticketParts[0].toUpperCase();
        ticketNumber = ticketParts[1];
    }

    let description = secondPart.split(' ').slice(2).join(' ');
    description = description.replace(/\b\w/g, l => l.toUpperCase()); // Capitalize each word

    const formattedTitle = ticketPrefix && ticketNumber
        ? `[Commit Prefix] ${ticketPrefix}-${ticketNumber}: ${description}`
        : `[Commit Prefix] ${description}`;

    // Return formattedTitle, ticketPrefix and ticketNumber for use in formatBody
    return formattedTitle;
}

// Format the title and body
function formatTitleAndBody() {
    // Call extractTicketAndFormatTitle and get ticketPrefix and ticketNumber
    const { formattedTitle, ticketPrefix, ticketNumber } = extractTicketAndFormatTitle(titleInput.value);

    // Build the Jira URL
    const jiraUrl = `https://ergatta.atlassian.net/browse/${ticketPrefix}-${ticketNumber}`;

    // Prepend the header markdown string and append the Jira URL to the existing body value
    const formattedBody = `Jira: ${jiraUrl}\n\n# Description\n\n${bodyInput.value}`;

    // Set the value of the body input field
    bodyInput.value = formattedBody;
}

formatTitleAndBody();