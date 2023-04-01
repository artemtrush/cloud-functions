const { google } = require('googleapis');

class DriveClient {
    constructor() {
        // Automatically takes GOOGLE_APPLICATION_CREDENTIALS from environment
        const auth = new google.auth.GoogleAuth({
            scopes: 'https://www.googleapis.com/auth/drive',
        });

        this._drive = google.drive({ version: 'v3', auth });
    }

    async appendTextToFile({ folderId, fileName, text }) {
        const file = await this.findFileByName({ folderId, fileName });

        if (file) {
            const currentText = await this.getFileContent({ fileId: file.id });
            const mergedText = `${currentText}\n\n${text}`;

            return this.updateFile({ fileId: file.id, text: mergedText });
        } else {
            return this.createFile({ folderId, fileName, text });
        }
    }

    async getFileContent({ fileId }) {
        const { data } = await this._drive.files.get({ fileId, alt: 'media' });

        return data;
    }

    async findFileByName({ folderId, fileName }) {
        const query = `mimeType='text/plain' and trashed=false and '${folderId}' in parents and name='${fileName}'`;

        const { data } = await this._drive.files.list({ q: query });

        return data.files[0] || null;
    }

    async createFile({ folderId, fileName, text }) {
        const resource = {
            name: fileName,
            parents: [ folderId ],
            mimeType: 'text/plain'
        };

        const media = {
            body: text,
            mimeType: 'text/plain'
        };

        const { data } = await this._drive.files.create({ resource, media });

        return data.id;
    }

    async updateFile({ fileId, text }) {
        const media = {
            body: text,
            mimeType: 'text/plain'
        };

        const { data } = await this._drive.files.update({ fileId, media });

        return data.id;
    }
}

module.exports = DriveClient;
