import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { AnalyticsService, ToastService, UserService } from '../../../core/services';
import { PaymentMethod } from 'app/web-api-client';

@Component({
    selector: 'app-embed-dialog',
    templateUrl: './embed-dialog.component.html',
    styleUrls: ['./embed-dialog.component.scss']
})
export class EmbedDialogComponent {
    public url: string;
    public imageUrl: string;
    public title: string;
    public color: string = '#F7D407';
    public size: string = '38';
    public shape: string = 'round';
    public text: string;
    public withText: string = 'true';
    public hoverColor: string = '';
    public get hasText() { return this.withText == 'true' && this.text }

    constructor(
        private sanitizer: DomSanitizer,
        public dialogRef: MatDialogRef<EmbedDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: { workId: number, title: string, artist: string, paymentMethod: PaymentMethod, imagePath: string },
        private toastService: ToastService,
        private analyticsService: AnalyticsService,
        private userService: UserService
    ) {
        this.text = (data.paymentMethod & PaymentMethod.Rent) == PaymentMethod.Rent
            ? 'Huur dit werk'
            : 'Koop dit werk';  
        this.url = window.location.origin + '/work/' + data.workId;
        this.imageUrl = window.location.origin + (data.imagePath.startsWith('/') ? '' : '/') + data.imagePath;
        this.title = `${data.title} van ${data.artist}`;
    }
    public onShare(platform: string) {
        this.analyticsService.emitEvent('share_on_create', 'engagement', platform, this.data.workId);
    }

    public get hoverClass() {
        let hoverClass = 'ardado-embed';
        switch (this.color) {
            case 'white':
                hoverClass = 'ardado-embed-white';
                break;
            case 'black':
                hoverClass = 'ardado-embed-black';
                break;
            case '#F7D407':
            default:
                hoverClass = 'ardado-embed-yellow';
                break;
        }
        return hoverClass;
    }
    public get embedContent() {
        let html = '' + this.svg;
        if (this.hasText)
            html += `<span style="margin-left: 7px">${this.text}</span>`

        return this.sanitizer.bypassSecurityTrustHtml(html);
    }

    public get textColor() {
        return this.color == 'black'
            ? '#fff'
            : '#000';
    }
    public get svg() {
        return `<svg style="display: inline-block;" xmlns="http://www.w3.org/2000/svg" height=${this.size} width=${this.size} viewBox="0 0 340 220"><defs><style>.a{fill:none;stroke:${this.textColor};stroke-miterlimit:10;stroke-width:9px;}path {stroke:${this.textColor}; fill:${this.textColor}}</style></defs><line class="a" x1="73.88" y1="202.62" x2="327.22" y2="202.62"/><path d="M213.52,160a48.94,48.94,0,0,1-18.7-18.9,54.75,54.75,0,0,1-6.8-27.3,54.8,54.8,0,0,1,6.8-27.3,49.08,49.08,0,0,1,18.7-18.9,55.82,55.82,0,0,1,53.4,0,49.08,49.08,0,0,1,18.7,18.9,54.8,54.8,0,0,1,6.8,27.3,54.75,54.75,0,0,1-6.8,27.3,48.94,48.94,0,0,1-18.7,18.9,55.82,55.82,0,0,1-53.4,0Zm48.2-7.8a40.07,40.07,0,0,0,15-15.6,46.45,46.45,0,0,0,5.5-22.8,46.51,46.51,0,0,0-5.5-22.8,40.21,40.21,0,0,0-15-15.6,44.07,44.07,0,0,0-43,0,40.35,40.35,0,0,0-15,15.6,46.62,46.62,0,0,0-5.5,22.8,46.56,46.56,0,0,0,5.5,22.8,40.21,40.21,0,0,0,15,15.6,44.07,44.07,0,0,0,43,0Z"/><path d="M312.92,164.29a8.28,8.28,0,0,1-2.5-6.1,8,8,0,0,1,2.5-6,8.45,8.45,0,0,1,11.8,0,8,8,0,0,1,2.5,6,8.28,8.28,0,0,1-2.5,6.1,8.21,8.21,0,0,1-11.8,0Z"/><path d="M100.2,36l54.67,120.2H45.69L100.2,36m0-23L91.55,32.07,37,152.27,31,165.69H169.63l-6.11-13.43L108.85,32.06l-8.66-19Z"/><line class="a" x1="73.88" y1="82.6" x2="17.12" y2="205.44"/></svg>`;
    }
    public get style() {
        let paddingY: number;
        let paddingX: number;
        let fontSize: number;
        let borderColor: string;

        switch (this.size) {
            case '54':
                paddingY = 0;
                paddingX = this.hasText ? 20 : 0;
                fontSize = 20;
                break;
            case '38':
                paddingY = 0;
                paddingX = this.hasText ? 14 : 0;
                fontSize = 18;
                break;
            case '30':
            default:
                paddingY = 0;
                paddingX = this.hasText ? 12 : 0;
                fontSize = 16;
                break;
        }
        if (this.shape == 'square')
            paddingX /= 2;
        switch (this.color) {
            case 'white':
                borderColor = 'black';
                break;
            case 'black':
                borderColor = 'white';
                break;
            case '#F7D407':
            default:
                borderColor = this.color;
                break;
        }
        let borderRadius = this.shape == 'round' ? +this.size / 2 + paddingY : 0;
        let style = `
            overflow: hidden;
            background-color: ${this.color};
            font-size: ${fontSize}px;
            display: inline-flex;
            align-items: center;
            line-height: 1;
            text-decoration: none;
            transition: all .1s ease;
            font-family: system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", "Noto Sans", "Liberation Sans", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
            font-stretch: 100%;
            cursor: pointer;
            color: ${this.textColor};
            padding: ${paddingY}px ${paddingX}px;
            border-radius: ${borderRadius}px;
            border: 1px solid ${borderColor};`;
        return style.replace(/[ \s]{2,}/g, '');
    }
    public get embedCode() {
        switch (this.color) {
            case 'white':
                this.hoverColor = '#f5f5f5';
                break;
            case 'black':
                this.hoverColor = '#444444';
                break;
            case '#F7D407':
            default:
                this.hoverColor = '#f8da2c';
                break;
        }
        let textSpan = this.hasText ? `<span style="margin-left: 7px">${this.text}</span>` : '';
        return `<span><style type="text/css">.ardado-embed:hover {background: ${this.hoverColor} !important;}</style><a class="ardado-embed" href="https://ardado.nl/work/${this.data.workId}?referral=${this.userService.userId}" style="${this.style.replace(/"/g, "&quot;")}">${this.svg}${textSpan}</a></span>`;
    }

    public copy(id: string) {
        var element = document.getElementById(id) as HTMLInputElement;
        element.select();
        element.setSelectionRange(0, 99999);
        navigator.clipboard.writeText(element.value);
        this.toastService.info("Tekst gekopi\u00eberd.");
        element.blur();
    }

}
