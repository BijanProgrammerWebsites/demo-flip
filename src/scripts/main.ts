import {DownloadManagerService} from '../services/download-manager.service.ts';

const downloadButton = document.querySelector<HTMLButtonElement>('section#queue > button')!;

async function main(): Promise<void> {
    downloadButton.addEventListener('click', downloadButtonClickHandler, {once: true});
}

async function downloadButtonClickHandler(): Promise<void> {
    downloadButton.disabled = true;

    const downloadManager = new DownloadManagerService();
    await downloadManager.startQueue();
}

main().then(() => console.log('Done!'));
