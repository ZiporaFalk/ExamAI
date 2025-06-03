import { TestBed } from '@angular/core/testing';

import { DownloadUrlService } from './download-url.service';

describe('DownloadUrlService', () => {
  let service: DownloadUrlService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DownloadUrlService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
