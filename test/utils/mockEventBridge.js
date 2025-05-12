// Shared in-memory store for captured events
export const mockEventStore = [];

export function mockEventBridgeSendDefinition(command) {
  const entries = command.input.Entries || [];
  for (const entry of entries) {
    mockEventStore.push({
      source: entry.Source,
      detailType: entry.DetailType,
      detail: JSON.parse(entry.Detail),
    });
  }

  return Promise.resolve({ FailedEntryCount: 0, Entries: [] });
}
