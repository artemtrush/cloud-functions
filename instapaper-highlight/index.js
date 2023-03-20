const DriveClient = require('./DriveClient');
const { CLIENT_ID, CLIENT_SECRET, REFRESH_TOKEN, FOLDER_ID, CLOUD_TOKEN } = process.env;

async function main(req, res) {
    try {
        const { token } = req.headers;

        if (token !== CLOUD_TOKEN) {
            return res.status(403).send(`Access denied`);
        }

        const { text, comment, title, createdAt } = req.body;

        const fileName = formatNoteFileName({ title, createdAt });
        const noteText = formatNoteText({ text, comment });

        const driveClient = new DriveClient({
            clientId: CLIENT_ID,
            clientSecret: CLIENT_SECRET,
            refreshToken: REFRESH_TOKEN
        });

        const fileId = await driveClient.appendTextToFile({
            text: noteText,
            fileName,
            folderId: FOLDER_ID
        });

        console.log('Completed saving intapaper highlight', { fileId });

        return res.status(200).send(`Completed saving intapaper highlight`);
    } catch (error) {
        console.error('Failed saving intapaper highlight', error);

        return res.status(500).send('Failed saving intapaper highlight');
    }
}

function formatNoteFileName({ title, createdAt }) {
    const timeStart = createdAt.indexOf(' at ');
    const datePart = createdAt.substring(0, timeStart);
    const date = new Date(datePart);

    const year = date.getFullYear();
    const month = date.getMonth() + 1;

    const maxWords = 10;
    const formattedTitle = title
        .replace(/[^\w\d\p{L}\p{N}\s._-]/gu, '')
        .split(' ').filter(word => word !== '')
        .slice(0, maxWords).join(' ');

    return `${year}-${month > 9 ? month : `0${month}`} ${formattedTitle}.md`;
}

function formatNoteText({ text, comment = '' }) {
    if (!comment) {
        return text;
    }

    return `${text}\n**${comment}**`;
}

module.exports = { main };
