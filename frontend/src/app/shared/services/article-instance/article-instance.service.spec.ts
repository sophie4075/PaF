import { TestBed } from '@angular/core/testing';

import { ArticleInstanceService } from './article-instance.service';

describe('ArticleInstanceService', () => {
  let service: ArticleInstanceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ArticleInstanceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
