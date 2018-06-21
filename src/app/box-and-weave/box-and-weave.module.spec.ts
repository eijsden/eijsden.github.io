import { BoxAndWeaveModule } from './box-and-weave.module';

describe('BoxAndWeaveModule', () => {
  let boxAndWeaveModule: BoxAndWeaveModule;

  beforeEach(() => {
    boxAndWeaveModule = new BoxAndWeaveModule();
  });

  it('should create an instance', () => {
    expect(boxAndWeaveModule).toBeTruthy();
  });
});
