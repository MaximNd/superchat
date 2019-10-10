import { TestBed } from '@angular/core/testing';

import { ChatResolverService } from './chat-resolver.service';

describe('ChatResolverService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ChatResolverService = TestBed.get(ChatResolverService);
    expect(service).toBeTruthy();
  });
});
