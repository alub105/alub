export interface ChromeMessage {
  from: Sender,
  message: any
}

export type ChromeMessageResponse = {
  title: string;
  headlines: string[];
}

export enum Sender {
  React,
  Content
}