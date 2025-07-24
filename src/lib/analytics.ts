import { supabase } from './supabase';

interface AnalyticsEvent {
  event_type: string;
  event_data?: Record<string, any>;
  user_id?: string;
}

class Analytics {
  private queue: AnalyticsEvent[] = [];
  private isProcessing = false;
  private batchSize = 10;
  private flushInterval = 5000; // 5 seconds

  constructor() {
    // Start the flush interval
    setInterval(() => {
      this.flush();
    }, this.flushInterval);

    // Flush on page unload
    window.addEventListener('beforeunload', () => {
      this.flush();
    });
  }

  async track(eventType: string, eventData: Record<string, any> = {}, userId?: string) {
    try {
      // Get current user if not provided
      if (!userId) {
        const { data: { user } } = await supabase.auth.getUser();
        userId = user?.id;
      }

      const event: AnalyticsEvent = {
        event_type: eventType,
        event_data: {
          ...eventData,
          timestamp: new Date().toISOString(),
          url: window.location.href,
          user_agent: navigator.userAgent,
          referrer: document.referrer
        },
        user_id: userId
      };

      this.queue.push(event);

      // Flush if queue is full
      if (this.queue.length >= this.batchSize) {
        await this.flush();
      }
    } catch (error) {
      console.error('Analytics tracking error:', error);
    }
  }

  async flush() {
    if (this.isProcessing || this.queue.length === 0) {
      return;
    }

    this.isProcessing = true;

    try {
      const events = this.queue.splice(0, this.batchSize);
      
      const { error } = await supabase
        .from('analytics_events')
        .insert(events.map(event => ({
          user_id: event.user_id || null,
          event_type: event.event_type,
          event_data: event.event_data || {}
        })));

      if (error) {
        console.error('Failed to send analytics events:', error);
        // Put events back in queue for retry
        this.queue.unshift(...events);
      }
    } catch (error) {
      console.error('Analytics flush error:', error);
    } finally {
      this.isProcessing = false;
    }
  }

  // Page view tracking
  trackPageView(page: string, additionalData: Record<string, any> = {}) {
    this.track('page_view', {
      page,
      ...additionalData
    });
  }

  // User interaction tracking
  trackClick(element: string, additionalData: Record<string, any> = {}) {
    this.track('click', {
      element,
      ...additionalData
    });
  }

  // Form tracking
  trackFormSubmit(formName: string, additionalData: Record<string, any> = {}) {
    this.track('form_submit', {
      form_name: formName,
      ...additionalData
    });
  }

  // Search tracking
  trackSearch(query: string, filters: Record<string, any> = {}, results: number = 0) {
    this.track('search', {
      query,
      filters,
      results_count: results
    });
  }

  // Feature usage tracking
  trackFeatureUsage(feature: string, additionalData: Record<string, any> = {}) {
    this.track('feature_usage', {
      feature,
      ...additionalData
    });
  }

  // Error tracking
  trackError(error: Error, context: string = '') {
    this.track('error', {
      error_message: error.message,
      error_stack: error.stack,
      context
    });
  }

  // Performance tracking
  trackPerformance(metric: string, value: number, additionalData: Record<string, any> = {}) {
    this.track('performance', {
      metric,
      value,
      ...additionalData
    });
  }
}

// Create singleton instance
const analytics = new Analytics();

// Export convenience functions
export const trackEvent = (eventType: string, eventData?: Record<string, any>, userId?: string) => {
  return analytics.track(eventType, eventData, userId);
};

export const trackPageView = (page: string, additionalData?: Record<string, any>) => {
  return analytics.trackPageView(page, additionalData);
};

export const trackClick = (element: string, additionalData?: Record<string, any>) => {
  return analytics.trackClick(element, additionalData);
};

export const trackFormSubmit = (formName: string, additionalData?: Record<string, any>) => {
  return analytics.trackFormSubmit(formName, additionalData);
};

export const trackSearch = (query: string, filters?: Record<string, any>, results?: number) => {
  return analytics.trackSearch(query, filters, results);
};

export const trackFeatureUsage = (feature: string, additionalData?: Record<string, any>) => {
  return analytics.trackFeatureUsage(feature, additionalData);
};

export const trackError = (error: Error, context?: string) => {
  return analytics.trackError(error, context);
};

export const trackPerformance = (metric: string, value: number, additionalData?: Record<string, any>) => {
  return analytics.trackPerformance(metric, value, additionalData);
};

export default analytics;