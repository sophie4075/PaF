import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { marked } from 'marked';

@Pipe({standalone: true, name: 'markdown'})
export class MarkdownPipe implements PipeTransform {
    constructor(private sanitizer: DomSanitizer) {}

    transform(value: string | undefined): SafeHtml {
        if (!value) {
            return '';
        }
        const html = marked.parse(value, { async: false }) as string;
        return this.sanitizer.bypassSecurityTrustHtml(html);
    }
}
