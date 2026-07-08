import type { NotificationItem } from './types';

export const mockNotifications: NotificationItem[] = [
  {
    id: '1',
    type: 'success',
    category: 'Themes',
    title: 'Corporate Theme published successfully',
    description: 'The Corporate Theme is now live and available to all users.',
    timestamp: new Date(Date.now() - 1000 * 60 * 45), // 45 min ago
    isRead: false,
    actionRoute: 'theme-details'
  },
  {
    id: '2',
    type: 'save',
    category: 'Themes',
    title: 'Dark Theme draft saved',
    description: 'Your changes to Dark Theme have been saved successfully.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 1), // 1 hour ago
    isRead: false,
    actionRoute: 'theme-editor'
  },
  {
    id: '3',
    type: 'share',
    category: 'Team Activity',
    title: 'Enterprise Theme shared by John Doe',
    description: 'John Doe has shared the Enterprise Theme with you.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3 hours ago
    isRead: false,
    actionRoute: 'shared-theme'
  },
  {
    id: '4',
    type: 'import',
    category: 'Themes',
    title: 'Theme import completed',
    description: 'The legacy theme package has been imported successfully.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6), // 6 hours ago
    isRead: false,
    actionRoute: 'imported-theme'
  },
  {
    id: '5',
    type: 'error',
    category: 'Themes',
    title: 'Theme publish failed due to missing design tokens',
    description: 'Please check the design tokens and try again.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 7), // 7 hours ago
    isRead: false,
    actionRoute: 'theme-validation'
  },
  {
    id: '6',
    type: 'system',
    category: 'System',
    title: 'New version of Theme Studio available',
    description: 'Version 2.4 is now available with new spacing controls.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48), // 2 days ago
    isRead: true,
    actionRoute: 'system-updates'
  },
  {
    id: '7',
    type: 'info',
    category: 'System',
    title: 'Organization branding updated',
    description: 'Admin has updated the global organization branding.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 72), // 3 days ago
    isRead: true,
    actionRoute: 'org-branding'
  },
  {
    id: '8',
    type: 'info',
    category: 'Team Activity',
    title: 'New team member invited',
    description: 'Sarah Smith has been invited to join the Design Team.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5), // 5 days ago
    isRead: true,
    actionRoute: 'team-management'
  },
  {
    id: '9',
    type: 'success',
    category: 'Themes',
    title: 'Theme deleted successfully',
    description: 'The deprecated theme has been permanently removed.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 8), // 8 days ago
    isRead: true,
    actionRoute: 'theme-list'
  }
];
