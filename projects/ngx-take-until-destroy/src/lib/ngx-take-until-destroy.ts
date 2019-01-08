import { Observable ,  Subject } from 'rxjs';

export interface OnDestroy {
  readonly destroyed$?: Observable<boolean>;
  ngOnDestroy(): void;
}

function isFunction( value ) {
  return typeof value === 'function';
}

export function TakeUntilDestroy(destroyMethodName = 'ngOnDestroy') {
  return function<T extends { new( ...args: any[] ): {} }>(constructor: T) {
    const originalDestroy = constructor.prototype[destroyMethodName];

    if (!isFunction(originalDestroy)) {
      console.warn(`${constructor.name} is using @TakeUntilDestroy but does not implement ${destroyMethodName}`);
    }

    return class extends constructor {
      private _takeUntilDestroy$: Subject<boolean>;

      get destroyed$() {
        if (!this._takeUntilDestroy$) {
          this._takeUntilDestroy$ = new Subject();
        }

        return this._takeUntilDestroy$;
      }

      [destroyMethodName]() {
        if (isFunction(originalDestroy)) {
          originalDestroy.apply(this, arguments);
        }

        if (this._takeUntilDestroy$) {
          this._takeUntilDestroy$.next(true);
          this._takeUntilDestroy$.complete();
        }
      }
    };
  };
}
