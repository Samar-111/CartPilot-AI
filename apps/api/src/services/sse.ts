import { Response } from "express";

class SSEManager {
  private connections: Map<string, Set<Response>> = new Map();

  addClient(sessionId: string, res: Response): void {
    if (!this.connections.has(sessionId)) {
      this.connections.set(sessionId, new Set());
    }
    this.connections.get(sessionId)!.add(res);

    res.on("close", () => {
      const set = this.connections.get(sessionId);
      if (set) {
        set.delete(res);
        if (set.size === 0) {
          this.connections.delete(sessionId);
        }
      }
    });
  }

  broadcast(sessionId: string, eventName: string, data: unknown): void {
    const clients = this.connections.get(sessionId);
    if (!clients || clients.size === 0) return;

    const payload = `event: ${eventName}\ndata: ${JSON.stringify(data)}\n\n`;
    for (const res of clients) {
      res.write(payload);
    }
  }
}

export const sseManager = new SSEManager();
