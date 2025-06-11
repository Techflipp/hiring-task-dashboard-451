import React from 'react';
import { CheckCircle, AlertCircle, Clock } from 'lucide-react';

interface StatusBadgeProps {
  status: 'active' | 'inactive' | 'pending';
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = 'md',
  showIcon = true,
  className = '',
}) => {
  const statusConfig = {
    active: {
      icon: CheckCircle,
      text: 'Active',
      bgColor: 'bg-green-100',
      textColor: 'text-green-800',
      iconColor: 'text-green-600',
    },
    inactive: {
      icon: AlertCircle,
      text: 'Inactive',
      bgColor: 'bg-red-100',
      textColor: 'text-red-800',
      iconColor: 'text-red-600',
    },
    pending: {
      icon: Clock,
      text: 'Pending',
      bgColor: 'bg-yellow-100',
      textColor: 'text-yellow-800',
      iconColor: 'text-yellow-600',
    },
  };

  const sizeConfig = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
    lg: 'px-3 py-1.5 text-base',
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full
        ${config.bgColor} ${config.textColor} ${sizeConfig[size]} ${className}`}
    >
      {showIcon && <Icon className={`w-3.5 h-3.5 mr-1 ${config.iconColor}`} />}
      {config.text}
    </span>
  );
};