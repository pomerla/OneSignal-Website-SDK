import ExtendableEvent from "./ExtendableEvent";

export class PushSubscriptionChangeEvent extends ExtendableEvent {
  public newSubscription?: PushSubscription;
  public oldSubscription?: PushSubscription;

  public constructor() {
    super("pushsubscriptionchange");
  }
}
