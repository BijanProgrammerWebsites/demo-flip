export class DownloadManagerService {
    private static isDownloading: boolean = false;

    private readonly PROGRESS_INTERVAL_TICK = 50;
    private readonly PROGRESS_DECIMAL_PLACES = 0;

    private readonly ANIMATION_OPTIONS: KeyframeAnimationOptions = {
        duration: 200,
        easing: 'ease-in-out',
    };

    private get allItems(): HTMLLIElement[] {
        return Array.from(document.querySelectorAll('section > ul > li'));
    }

    private get queuedItems(): HTMLLIElement[] {
        return Array.from(document.querySelectorAll('section#queue > ul > li'));
    }

    private get downloadedList(): HTMLUListElement {
        return document.querySelector('section#downloaded > ul')!;
    }

    private get downloadedItems(): HTMLLIElement[] {
        return Array.from(document.querySelectorAll('section#downloaded > ul > li'));
    }

    public async startQueue(): Promise<void> {
        if (DownloadManagerService.isDownloading) {
            console.warn('Download in progress...');
        }

        DownloadManagerService.isDownloading = true;

        this.queuedItems.forEach((item) => this.startItem(item));

        DownloadManagerService.isDownloading = false;
    }

    private startItem(item: HTMLLIElement): void {
        const progressElement = item.querySelector('.progress')!;
        const eta = +item.dataset.eta!;

        let passedTime = 0;

        const interval = setInterval(() => {
            passedTime += this.PROGRESS_INTERVAL_TICK;

            if (passedTime >= eta) {
                clearInterval(interval);

                progressElement.innerHTML = 'Done!';

                this.moveItemToDownloadedSection(item);
            } else {
                progressElement.innerHTML = `${this.calculateProgress(passedTime, eta)}%`;
            }
        }, this.PROGRESS_INTERVAL_TICK);
    }

    private moveItemToDownloadedSection(item: HTMLLIElement): void {
        const firstSnapshot = this.generateSnapshot();

        this.downloadedList.append(item);
        this.sortDownloadedList();

        const lastSnapshot = this.generateSnapshot();

        this.allItems.forEach((item) => {
            const title = this.findItemTitle(item);

            const first = firstSnapshot.get(title);
            const last = lastSnapshot.get(title);

            if (!first || !last) {
                return;
            }

            const deltaX = first.x - last.x;
            const deltaY = first.y - last.y;

            item.animate([{translate: `${deltaX}px ${deltaY}px`}, {translate: '0 0'}], this.ANIMATION_OPTIONS);
        });
    }

    private generateSnapshot(): Map<string, DOMRect> {
        const snapshot = new Map<string, DOMRect>();

        this.allItems.forEach((item) => {
            snapshot.set(this.findItemTitle(item), item.getBoundingClientRect());
        });

        return snapshot;
    }

    private sortDownloadedList(): void {
        const sortedItems = this.downloadedItems.sort((a, b) =>
            this.findItemTitle(a).localeCompare(this.findItemTitle(b))
        );

        sortedItems.forEach((node) => this.downloadedList.appendChild(node));
    }

    private findItemTitle(item: HTMLLIElement): string {
        return item.querySelector('.title')!.textContent!.trim();
    }

    private calculateProgress(passedTime: number, totalTime: number): string {
        return ((passedTime / totalTime) * 100).toFixed(this.PROGRESS_DECIMAL_PLACES);
    }
}
