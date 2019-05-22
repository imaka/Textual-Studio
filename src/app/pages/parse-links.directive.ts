import { Directive, ElementRef, HostListener } from '@angular/core';
import { Router } from '@angular/router';

@Directive({
  selector: '[appParseLinks]'
})
export class ParseLinksDirective {
  constructor(private el: ElementRef, private router: Router) {}

  @HostListener('click', ['$event'])
  clicked(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const href = target.getAttribute('href');
    if (target.tagName === 'A' && href) {
      event.preventDefault();
      if (this.isLocalLink(href)) {
        this.router.navigate([href]);
      } else {
        window.open(href);
      }
    }
  }

  isLocalLink(uri: string) {
    return uri && uri.startsWith('/');
  }
}
