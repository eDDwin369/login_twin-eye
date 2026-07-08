export type NotificationType = 'success' | 'warning' | 'error' | 'info' | 'system' | 'save' | 'share' | 'import';
export type NotificationCategory = 'Themes' | 'Team Activity' | 'System';

export interface NotificationItem {
  id: string;
  type: NotificationType;
  category: NotificationCategory;
  title: string;
  description: string;
  timestamp: Date;
  isRead: boolean;
  actionRoute: string; // The view to route to when clicked
}
