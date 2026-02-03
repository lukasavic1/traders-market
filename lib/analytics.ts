import { 
  logEvent, 
  setUserId, 
  setUserProperties,
  Analytics 
} from 'firebase/analytics';
import { analytics } from './firebase';

// Custom event types for type safety
export type TraderMarketEvent = 
  | 'page_view'
  | 'login'
  | 'signup'
  | 'logout'
  | 'bot_view'
  | 'bot_secret_reveal'
  | 'navigation_click'
  | 'checkout_initiated'
  | 'payment_success'
  | 'payment_failed'
  | 'blog_view'
  | 'bundle_view'
  | 'dashboard_access'
  | 'error_occurred'
  | 'custom_trace_complete';

interface EventParams {
  [key: string]: string | number | boolean | undefined;
}

/**
 * Log a custom event to Google Analytics
 */
export const logAnalyticsEvent = (
  eventName: TraderMarketEvent,
  params?: EventParams
) => {
  if (!analytics) {
    console.warn('Analytics not initialized');
    return;
  }

  try {
    // Firebase SDK types only include a subset of events; custom names (e.g. page_view, login) are valid at runtime
    logEvent(analytics, eventName as Parameters<typeof logEvent>[1], {
      ...params,
      timestamp: Date.now(),
      app_name: 'Traders Market',
    });
  } catch (error) {
    console.error('Error logging analytics event:', error);
  }
};

/**
 * Track page views
 */
export const logPageView = (pagePath: string, pageTitle: string) => {
  logAnalyticsEvent('page_view', {
    page_path: pagePath,
    page_title: pageTitle,
  });
};

/**
 * Track user authentication events
 */
export const logAuthEvent = (
  eventType: 'login' | 'signup' | 'logout',
  method?: string
) => {
  logAnalyticsEvent(eventType, {
    method: method || 'email',
  });
};

/**
 * Track bot-related events
 */
export const logBotEvent = (
  eventType: 'bot_view' | 'bot_secret_reveal',
  botId: string,
  botName: string
) => {
  logAnalyticsEvent(eventType, {
    bot_id: botId,
    bot_name: botName,
  });
};

/**
 * Track navigation clicks
 */
export const logNavigationClick = (
  destination: string,
  source: string
) => {
  logAnalyticsEvent('navigation_click', {
    destination,
    source,
  });
};

/**
 * Track checkout and payment events
 */
export const logCheckoutEvent = (
  eventType: 'checkout_initiated' | 'payment_success' | 'payment_failed',
  amount?: number,
  currency?: string,
  errorMessage?: string
) => {
  logAnalyticsEvent(eventType, {
    amount,
    currency: currency || 'USD',
    error_message: errorMessage,
  });
};

/**
 * Track blog views
 */
export const logBlogView = (
  blogTitle: string,
  blogSlug: string
) => {
  logAnalyticsEvent('blog_view', {
    blog_title: blogTitle,
    blog_slug: blogSlug,
  });
};

/**
 * Track errors
 */
export const logErrorEvent = (
  errorMessage: string,
  errorStack?: string,
  errorCode?: string,
  severity?: 'low' | 'medium' | 'high' | 'critical'
) => {
  logAnalyticsEvent('error_occurred', {
    error_message: errorMessage,
    error_stack: errorStack,
    error_code: errorCode,
    severity: severity || 'medium',
  });
};

/**
 * Set user ID for analytics (call when user logs in)
 */
export const setAnalyticsUserId = (userId: string | null) => {
  if (!analytics) return;

  try {
    if (userId) {
      setUserId(analytics, userId);
    }
  } catch (error) {
    console.error('Error setting analytics user ID:', error);
  }
};

/**
 * Set user properties (call when user data is available)
 */
export const setAnalyticsUserProperties = (properties: {
  subscription_status?: 'free' | 'premium';
  has_paid?: boolean;
  signup_date?: string;
  user_type?: string;
  [key: string]: string | boolean | undefined;
}) => {
  if (!analytics) return;

  try {
    setUserProperties(analytics, properties);
  } catch (error) {
    console.error('Error setting analytics user properties:', error);
  }
};

/**
 * Track custom business metrics
 */
export const logCustomMetric = (
  metricName: string,
  value: number,
  unit?: string
) => {
  logAnalyticsEvent('custom_trace_complete', {
    metric_name: metricName,
    value,
    unit: unit || 'ms',
  });
};
