var titleInput = document.getElementById('pull_request_title');
var bodyInput = document.getElementById('pull_request_body');
var branchSelectors = document.getElementsByClassName("branch");

// Check if a string is numeric
function isNumeric(str) {
    return /^\d+$/.test(str);
}

// Extract the ticket prefix and number from the branch name and return formatted title string.
// The branch name is extracted from the dropdown branch selector. If not found, the default PR title is used because
// if a PR has more then 1 commit, GitHub uses the branch name as the PR title and leaves the PR body blank.
// - GitHub takes the following branch name: `chris/XX-1234-branch-name-here` and makes the title 'Chris/xx 1234 branch name here'
// The following branch naming formats are supported:
// - team-name/PREFIX-1234-branch-name-here
// - my-name/branch-name-here
function extractTicketAndFormatTitle(title) {
    let branchNameNoFleet = ""
    let branchParts = []

    if (branchSelectors[1].innerText.includes("compare:")) {
        let branchName = branchSelectors[1].innerText.replace("compare: ", "")
        branchNameNoFleet = branchName.split('/')[1];
        branchParts = branchNameNoFleet.split('-')
    } else if (title.includes("/")) {
        let branchName = title
        branchNameNoFleet = branchName.split('/')[1];
        branchParts = branchNameNoFleet.split(' ')
    }

    let ticketParts = branchParts.slice(0,2);
    let ticketPrefix = '';
    let ticketNumber = '';
    let description = '';

    if (isNumeric(ticketParts[1])) {
        ticketPrefix = ticketParts[0].toUpperCase();
        ticketNumber = ticketParts[1];
        description = branchParts.slice(2).join(' ');
    } else {
        description = branchNameNoFleet.replaceAll("-", " ");
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
    const { formattedTitle, ticketPrefix, ticketNumber } = extractTicketAndFormatTitle(titleInput.value);
    titleInput.value = formattedTitle;

    // Build the Jira URL
    if (ticketPrefix && ticketNumber) {
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