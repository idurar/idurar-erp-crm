const colors = [
  { value: 'default', label: 'default', icon: '🌟' },
  { value: 'draft', label: 'draft', icon: '📝' },
  { value: 'pending', label: 'pending', color: 'magenta', icon: '⏳' },
  { value: 'cancelled', label: 'cancelled', color: 'volcano', icon: '❌' },
  { value: 'sent', label: 'sent', color: 'gold', icon: '✉️' },
  { value: 'refunded', label: 'refunded', color: 'purple', icon: '💰' },
  { value: 'on hold', label: 'On hold', color: 'blue', icon: '🛑' },

  { value: 'accepted', label: 'accepted', color: '#168568', icon: '✅' },
  { value: 'declined', label: 'declined', color: 'volcano', icon: '❎' },
  { value: 'rejected', label: 'rejected', color: 'red', icon: '🚫' },
  { value: 'expired', label: 'expired', color: 'orange', icon: '⏰' },

  { value: 'success', label: 'success', color: '#168568', icon: '✨' },
  { value: 'failed', label: 'failed', color: 'red', icon: '❌' },
  { value: 'error', label: 'error', color: 'volcano', icon: '⚠️' },

  { value: 'arrived', label: 'arrived', color: 'blue', icon: '🚚' },

  { value: 'unpaid', label: 'unpaid', color: 'volcano', icon: '💵' },
  { value: 'paid', label: 'paid', color: '#168568', icon: '💳' },
  { value: 'partially', label: 'partially paid', color: 'purple', icon: '💰' },
  { value: 'overdue', label: 'overdue', color: 'red', icon: '💰' },

  { value: 'processing', label: 'processing', color: 'geekblue', icon: '⌛' },
  { value: 'packing', label: 'packing', color: 'orange', icon: '📦' },
  { value: 'shipped', label: 'shipped', color: 'purple', icon: '✈️' },

  { value: 'not started', label: 'not started', icon: '🚫' },
  { value: 'in progress', label: 'in progress', color: 'geekblue', icon: '🔄' },
  { value: 'delayed', label: 'delayed', color: 'orange', icon: '⏰' },
  { value: 'completed', label: 'completed', color: '#168568', icon: '✅' },
  { value: 'delivered', label: 'delivered', color: 'magenta', icon: '📦' },
  { value: 'returned', label: 'returned', color: 'red', icon: '🔙' },

  { value: 'new', label: 'new', color: 'blue', icon: '🚀' },
  { value: 'premium', label: 'premium', color: 'gold', icon: '🏆' },
  { value: 'free', label: 'free', color: '#168568', icon: '💡' },
];

const statusTagColorList = (tags = []) => {
  const list = [];

  tags.map((x) => {
    const element = colors.find((obj) => obj?.value?.toLowerCase() === x?.toLowerCase());
    if (element) list.push(element);
    else list.push({ value: x, label: x });
  });
  return list;
};

const tagColor = (status) => {
  const element = colors.find((obj) => obj?.value?.toLowerCase() === status?.toLowerCase());
  if (element) return element;
  else return { value: status, label: status };
};

export { statusTagColorList, tagColor };
