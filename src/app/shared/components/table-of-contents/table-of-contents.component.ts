import {
  Component,
  ChangeDetectionStrategy,
  inject,
  signal,
  OnInit,
  OnDestroy,
  effect,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { CommonModule } from '@angular/common';

interface HeadingInfo {
  id: string;
  text: string;
  level: number;
  element: HTMLElement;
}

@Component({
  selector: 'app-table-of-contents',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './table-of-contents.component.html',
  styleUrls: ['./table-of-contents.component.scss'],
  imports: [CommonModule, ButtonModule, TooltipModule],
})
export class TableOfContentsComponent implements OnInit, OnDestroy {
  private readonly document = inject(DOCUMENT);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly headings = signal<HeadingInfo[]>([]);
  readonly showToC = signal<boolean>(false);
  readonly activeHeadingId = signal<string>('');

  private scrollListener?: () => void;
  private observer?: IntersectionObserver;

  constructor() {
    // Watch for route changes to re-scan headings
    effect(() => {
      const urlTree = this.router.getCurrentNavigation()?.extractedUrl;
      if (urlTree || this.route.snapshot.url) {
        setTimeout(() => {
          this.scanHeadings();
        }, 500);
      }
    });
  }

  ngOnInit() {
    // Set up intersection observer for active heading detection
    this.setupIntersectionObserver();

    // Set up scroll listener for active heading detection (fallback)
    this.setupScrollListener();
  }

  ngOnDestroy() {
    if (this.scrollListener) {
      this.document.removeEventListener('scroll', this.scrollListener);
    }
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  private scanHeadings() {
    // Try multiple selectors to find content containers
    const selectors = [
      '.main-content',
      '.content-area',
      '.markdown-content',
      '.documentation-page',
      'main',
    ];

    let mainContent: Element | Document | null = null;

    // Try each selector until we find content
    for (const selector of selectors) {
      mainContent = this.document.querySelector(selector);
      if (mainContent) {
        break;
      }
    }

    // Fallback to document if no container found
    if (!mainContent) {
      mainContent = this.document;
    }

    const headingElements = mainContent!.querySelectorAll('h1, h2, h3, h4, h5, h6');
    const headings: HeadingInfo[] = [];

    headingElements.forEach(element => {
      const htmlElement = element as HTMLElement;
      const id = htmlElement.id || this.generateId(htmlElement.textContent || '');
      if (!htmlElement.id) {
        htmlElement.id = id;
      }

      // Skip headings from example content (those with IDs starting with "example-")
      if (id.startsWith('example-')) {
        return;
      }

      // Skip specific example section headings
      const headingText = htmlElement.textContent || '';
      if (headingText === 'Interactive Examples' || headingText === 'Live Examples') {
        return;
      }

      const headingInfo = {
        id,
        text: htmlElement.textContent || '',
        level: parseInt(htmlElement.tagName.charAt(1)),
        element: htmlElement,
      };

      headings.push(headingInfo);
    });

    this.headings.set(headings);

    // Update intersection observer
    if (this.observer) {
      this.observer.disconnect();
    }
    this.setupIntersectionObserver();

    // Trigger initial active heading detection
    setTimeout(() => {
      if (this.scrollListener) {
        this.scrollListener();
      }
    }, 50);
  }

  private generateId(text: string): string {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  private setupIntersectionObserver() {
    const headingElements = this.headings().map(h => h.element);
    if (headingElements.length === 0) return;

    this.observer = new IntersectionObserver(
      entries => {
        const visibleEntries = entries.filter(entry => entry.isIntersecting);

        if (visibleEntries.length > 0) {
          // Find the topmost visible heading
          const topMostEntry = visibleEntries.reduce((topMost, current) => {
            const topMostRect = topMost.target.getBoundingClientRect();
            const currentRect = current.target.getBoundingClientRect();
            return currentRect.top < topMostRect.top ? current : topMost;
          });

          this.activeHeadingId.set(topMostEntry.target.id);
        }
      },
      {
        rootMargin: '-84px 0px -80% 0px', // Account for header height (84px)
        threshold: [0, 0.1, 0.3],
      }
    );

    headingElements.forEach(element => {
      if (element) {
        this.observer?.observe(element);
      }
    });
  }

  private setupScrollListener() {
    this.scrollListener = () => {
      const currentHeadings = this.headings();
      if (currentHeadings.length === 0) return;

      const headerHeight = 84;
      let activeId = '';

      // Find the heading that's currently visible at the top
      for (let i = currentHeadings.length - 1; i >= 0; i--) {
        const heading = currentHeadings[i];
        const element = this.document.getElementById(heading.id);
        if (element) {
          const rect = element.getBoundingClientRect();

          // Check if heading is visible and above the header line
          if (rect.top <= headerHeight + 20) {
            activeId = heading.id;
            break;
          }
        }
      }

      // Fallback to first heading if none found
      if (!activeId && currentHeadings.length > 0) {
        activeId = currentHeadings[0].id;
      }

      this.activeHeadingId.set(activeId);
    };

    this.document.addEventListener('scroll', this.scrollListener, { passive: true });

    // Initial call to set active heading on page load
    setTimeout(() => {
      if (this.scrollListener) {
        this.scrollListener();
      }
    }, 100);
  }

  navigateToHeading(event: Event, headingId: string) {
    event.preventDefault();

    // Update URL with fragment
    this.router.navigate([], {
      fragment: headingId,
      queryParamsHandling: 'preserve',
    });

    // Scroll to element
    const element = this.document.getElementById(headingId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }

    // Hide ToC after navigation on mobile
    if (this.document.defaultView?.innerWidth && this.document.defaultView.innerWidth <= 768) {
      this.showToC.set(false);
    }
  }
}
