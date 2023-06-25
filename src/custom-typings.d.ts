declare module 'qrcode' {
  function toCanvas(canvas: HTMLCanvasElement, text: string, callback: (error: any) => void): void;
}
