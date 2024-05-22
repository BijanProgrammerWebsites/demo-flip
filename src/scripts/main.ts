import {DownloadManagerService} from '../services/download-manager.service.ts';

async function main(): Promise<void> {
    const downloadManager = new DownloadManagerService();
    await downloadManager.startQueue();
}

main().then(() => console.log('Done!'));
