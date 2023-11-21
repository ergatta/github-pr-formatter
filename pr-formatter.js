var titleInput = document.getElementById('pull_request_title');
var bodyInput = document.getElementById('pull_request_body');

// Check if a string is numeric
function isNumeric(str) {
    return /^\d+$/.test(str);
}

// Extract the ticket prefix and number from the title and return formatted title string.
// If a PR has only 1 commit it GitHub uses the commit title as the PR title and the commit body as the PR body. This doesn't cover this case yet.
// If a PR has more then 1 commit, GitHub uses the branch name as the PR title and leaves the PR body blank.
// - GitHub takes the following branch name: `chris/XX-1234-branch-name-here` and makes the title 'Chris/xx 1234 branch name here'
// The following branch naming formats are supported:
// - team-name/PREFIX-1234-branch-name-here
// - my-name/branch-name-here
function extractTicketAndFormatTitle(title) {
    let secondPart = title.split('/')[1];
    let ticketParts = secondPart.split(' ').slice(0, 2);
    let ticketPrefix = '';
    let ticketNumber = '';
    let description = '';

    if (isNumeric(ticketParts[1])) {
        ticketPrefix = ticketParts[0].toUpperCase();
        ticketNumber = ticketParts[1];
        description = secondPart.split(' ').slice(2).join(' ');
    } else {
        description = secondPart;
    }

    description = description.replace(/\b\w/g, l => l.toUpperCase()); // Capitalize each word

    const formattedTitle = ticketPrefix && ticketNumber
        ? `[Commit Prefix] ${ticketPrefix}-${ticketNumber}: ${description}`
        : `[Commit Prefix] ${description}`;

    return { formattedTitle, ticketPrefix, ticketNumber };
}

// Format the title and body
function formatTitleAndBody() {
    let formattedBody = '';
    let formattedTitle = extractTicketAndFormatTitle(titleInput.value);
    titleInput.value = formattedTitle;

    // Build the Jira URL
    if (formattedTitle.ticketPrefix || formattedTitle.ticketNumber) {
        const jiraUrl = `https://ergatta.atlassian.net/browse/${ticketPrefix}-${ticketNumber}`;

        // Prepend the header markdown string and append the Jira URL to the existing body value
        formattedBody = `Jira: ${jiraUrl}\n\n# Description\n\n${bodyInput.value}`;
    } else {
        formattedBody = `# Description\n\n${bodyInput.value}`;
    }
   
    // Set the value of the body input field
    bodyInput.value = formattedBody;
}

formatTitleAndBody();