//OKOKOKOKOKOKOKO
import { create } from 'zustand';

// stores/eventStore.js
import { makeAutoObservable } from 'mobx';
// import { mockEvents } from '@/pages/EventDetail'; // 导入mockEvents
import { mockEvents } from '@/data/mockEvents'; // 从独立文件导入

class EventStore {
  // events = mockEvents; // 直接使用mockEvents作为数据源
  events = [...mockEvents]
  constructor() {
    makeAutoObservable(this);
  }

  createEvent = (newEvent) => {
    this.events = [...this.events, newEvent];
  };
}

export default new EventStore();

export const useEventStore = create((set) => ({
  events: [],

  
  checkInEvent: (eventId, userId) => {
    set(state => ({
      events: state.events.map(event => 
        event.id === eventId ? {
          ...event,
          participants: event.participants.map(p => 
            p.userId === userId ? { ...p, status: 'checked-in' } : p
          )
        } : event
      )
    }));
  },

  submitFeedback: (eventId, feedback) => {
    set(state => ({
      events: state.events.map(event => 
        event.id === eventId ? {
          ...event,
          participants: event.participants.map(p => 
            p.userId === feedback.userId ? { ...p, feedback } : p
          )
        } : event
      )
    }));
  },
  

  fetchEvents: async () => {
    const response = await fetch('/api/events');
    set({ events: await response.json() });
  },
  

  // 增强报名方法
  registerEvent: async (eventId, userId) => {
    const response = await fetch(`/api/events/${eventId}/register`, {
      method: 'POST',
      body: JSON.stringify({ userId })
    });
    
    const updatedEvent = await response.json();
    
    set(state => ({
      events: state.events.map(e => 
        e.id === eventId ? {
          ...updatedEvent,
          participants: [...e.participants, { 
            userId, 
            status: 'pending',
            registeredAt: new Date().toISOString() 
          }]
        } : e
      )
    }));    
    

    return updatedEvent;
  }
}));