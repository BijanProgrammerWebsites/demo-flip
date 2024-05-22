import {DownloadManagerService} from '../services/download-manager.service.ts';

async function main(): Promise<void> {
    const downloadButton = document.querySelector('section#queue > button')!;
    downloadButton.addEventListener('click', downloadButtonClickHandler, {once: true});
}

async function downloadButtonClickHandler(): Promise<void> {
    const downloadManager = new DownloadManagerService();
    await downloadManager.startQueue();
}

main().then(() => console.log('Done!'));
