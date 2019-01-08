import { Observable, ReplaySubject } from 'rxjs';

import { ObservableInput } from './lib/ngx-observable-input';
import { map, take } from 'rxjs/operators';

class DemoClass {
  @ObservableInput() x: Observable<number>;
  @ObservableInput(map((v: number) => v * 2)) piped: Observable<number>;

  constructor(testFn: Function) {
    testFn.call(this);
  }
}

describe('Базовая работа обзерваблов', () => {
  it('Обзреваблы создались', () => {
    const demo = new DemoClass(() => {});
    expect(demo.x).toBeDefined();
    expect(!!demo.piped).toBeDefined();
  });

  it('Инпуты работают', (done) => {
    const demo: any = new DemoClass(() => {});

    demo.x.pipe(take(1)).toPromise().then((value) => {
      expect(value).toEqual(2);
      done();
    });

    demo.x = 2;
  });

  it('Пайпы работают', (done) => {
    const demo: any = new DemoClass(() => {});

    demo.piped.pipe(take(1)).toPromise().then((value) => {
      expect(value).toEqual(4);
      done();
    });

    demo.piped = 2;
  });
});
