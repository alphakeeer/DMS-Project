// stores/eventStore.js
import { defineStore } from 'pinia';

export const useEventStore = defineStore('events', {
  state: () => ({
    events: [],
    registeredEvents: []
  }),
  actions: {
    async fetchEvents() {
      const res = await getEvents();
      this.events = res.data;
    }
  }
});