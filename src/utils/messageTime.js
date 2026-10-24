// Khoảng thời gian giữa hai tin nhắn: 30 phút
export const MESSAGE_TIME_GAP = 30 * 60 * 1000;

// Lấy thời gian gửi tin nhắn
export const getMessageDate = (message) => {
  if (!message?.createdAt) return null;

  const date = new Date(message.createdAt);

  return Number.isNaN(date.getTime()) ? null : date;
};

// Kiểm tra hai thời điểm có cùng ngày hay không
export const isSameDay = (date1, date2) => {
  if (!date1 || !date2) return false;

  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
};

// Định dạng giờ và phút
export const formatTime = (date) => {
  if (!date) return "";

  return new Intl.DateTimeFormat("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);
};

// Định dạng thời gian đầy đủ khi hover vào tin nhắn
export const formatHoverTime = (date) => {
  if (!date) return "";

  return new Intl.DateTimeFormat("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);
};

// Định dạng mốc thời gian giữa các tin nhắn
export const formatSeparatorTime = (date, previousDate = null) => {
  if (!date) return "";

  // Nếu sang ngày mới: hiển thị thứ, ngày, tháng và giờ
  if (previousDate && !isSameDay(date, previousDate)) {
    const weekday = new Intl.DateTimeFormat("vi-VN", {
      weekday: "long",
    }).format(date);

    const dayMonth = new Intl.DateTimeFormat("vi-VN", {
      day: "2-digit",
      month: "2-digit",
    }).format(date);

    return `${weekday}, ${dayMonth} · ${formatTime(date)}`;
  }

  // Cùng ngày: chỉ hiển thị giờ và phút
  return formatTime(date);
};

// Kiểm tra có cần hiển thị mốc thời gian hay không
export const shouldShowTimestamp = (
  messageDate,
  previousDate,
  isFirstMessage = false,
) => {
  if (!messageDate) return false;

  // Tin nhắn đầu tiên
  if (isFirstMessage) return true;

  // Không có thời gian tin nhắn trước
  if (!previousDate) return true;

  // Khác ngày
  if (!isSameDay(messageDate, previousDate)) return true;

  // Khoảng cách từ 30 phút trở lên
  return messageDate.getTime() - previousDate.getTime() >= MESSAGE_TIME_GAP;
};
