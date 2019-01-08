import { ReplaySubject } from 'rxjs';

export function ObservableInput(...pipableOperators) {
  const subject = new ReplaySubject(1);
  const sharedStream = subject.pipe.apply(subject, pipableOperators);

  return (target, propertyKey) => {
    Object.defineProperty(target, propertyKey, {
      set(value) {
        subject.next(value);
      },
      get() {
        return sharedStream;
      }
    });
  };
}
