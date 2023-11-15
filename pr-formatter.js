var titleInput = document.getElementById('pull_request_title');
var bodyInput = document.getElementById('pull_request_body');

// Format the title and set the value of the title input field
function extractTicketAndFormatTitle(title) {
    let ticketParts = title.split('/')[1].split(' ').slice(0, 2);
    let ticketPrefix = ticketParts[0].toUpperCase();
    let ticketNumber = ticketParts[1];
    let description = title.split('/')[1].split(' ').slice(2).join(' ');
    description = description.replace(/\b\w/g, l => l.toUpperCase()); // Capitalize each word
    const formattedTitle = `[Commit Prefix] ${ticketPrefix}-${ticketNumber}: ${description}`;

    // Set the value of the title input field
    titleInput.value = formattedTitle;

    // Return ticketPrefix and ticketNumber for use in formatBody
    return { ticketPrefix, ticketNumber };
}

// Format the title and body
function formatTitleAndBody() {
    // Call extractTicketAndFormatTitle and get ticketPrefix and ticketNumber
    const { ticketPrefix, ticketNumber } = extractTicketAndFormatTitle(titleInput.value);

    // Build the Jira URL
    const jiraUrl = `https://ergatta.atlassian.net/browse/${ticketPrefix}-${ticketNumber}`;

    // Prepend the header markdown string and append the Jira URL to the existing body value
    const formattedBody = `Jira: ${jiraUrl}\n\n# Description\n\n${bodyInput.value}`;

    // Set the value of the body input field
    bodyInput.value = formattedBody;
}

formatTitleAndBody();