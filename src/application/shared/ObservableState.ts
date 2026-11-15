/** Stable snapshots and subscriptions for application state, independent of React. */
export class ObservableState<T> {
  private listeners = new Set<() => void>();
  constructor(protected value: T) {}
  getSnapshot = () => this.value;
  subscribe = (listener: () => void) => {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  };
  protected publish(value: T) {
    this.value = value;
    for (const listener of this.listeners) listener();
  }
}
