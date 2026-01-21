

export interface WebhookEventHandler<T = any> {
  supports(event: string): boolean;
  handle(data: T): Promise<any>;
}
