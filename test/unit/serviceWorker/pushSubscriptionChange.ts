import '../../support/polyfills/polyfills';
import test from 'ava';
import { ServiceWorker } from '../../../src/service-worker/ServiceWorker';
import { setUserAgent } from '../../support/tester/browser';
import { BrowserUserAgent, TestEnvironment, HttpHttpsEnvironment } from '../../support/sdk/TestEnvironment';
import { Uuid } from '../../../src/models/Uuid';
import Database from '../../../src/services/Database';
import { AppConfig } from '../../../src/models/AppConfig';
import { PushSubscriptionChangeEvent } from "../../support/mocks/service-workers/models/PushSubscriptionChangeEvent";
import PushSubscription from '../../support/mocks/service-workers/models/PushSubscription';
import ServiceWorkerGlobalScope from '../../support/mocks/service-workers/ServiceWorkerGlobalScope';
import PushManager from '../../support/mocks/service-workers/models/PushManager';
import { base64ToUint8Array } from "../../../src/utils/Encoding";

const VAPID_PUBLIC_KEY_1 = "BApIoaDI71cs0_CyqXYeXJNGrfIcFE_kl8Z-Z46f7T20lO8OtHYXzh3q9z-eXVmLd9ohXtwnBZ5GibCmxvysB2Q";
const VAPID_PUBLIC_KEY_2 = "BLh-Qi0yJanQKiwICfQq25-Ei_ldA_M2egYPg4atuM-d8etfKivGxf9A0cvV6SRWyNa55d-ou6DMPQ0RS3PvH2c";

declare var self: ServiceWorkerGlobalScope;

test.only(`dispatching a mock pushsubscriptionchange event is received`, async t => {
  const appId = Uuid.generate();
  await TestEnvironment.initializeForServiceWorker({
    url: new URL(`https://site.com/service-worker.js?appId=${appId}`)
  });

  const event = new PushSubscriptionChangeEvent();
  event.oldSubscription = null;
  event.newSubscription = null;

  self.addEventListener("pushsubscriptionchange", () => {
    t.pass();
  });
  self.dispatchEvent(event);
});


test(`called with an old and new subscription successfully updates the subscription`, async t => {
  const appId = Uuid.generate();
  await TestEnvironment.initializeForServiceWorker({
    url: new URL(`https://site.com/service-worker.js?appId=${appId}`)
  });

  const mockSubscription1 = new PushManager().subscribe({
    userVisibleOnly: true,
    applicationServerKey: <ArrayBuffer>base64ToUint8Array(VAPID_PUBLIC_KEY_1).buffer
  });

  const mockSubscription2 = new PushManager().subscribe({
    userVisibleOnly: true,
    applicationServerKey: <ArrayBuffer>base64ToUint8Array(VAPID_PUBLIC_KEY_2).buffer
  });

  const event = new PushSubscriptionChangeEvent();
  event.oldSubscription = null;
  event.newSubscription = null;

  self.addEventListener("pushsubscriptionchange", () => {
    t.pass();
  });
  self.dispatchEvent(event);
});
