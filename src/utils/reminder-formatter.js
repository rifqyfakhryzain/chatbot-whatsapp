function formatOtwReminderMessage(reminder, calculated, userName) {
  const name = userName ? ` ${userName}` : "";
  const shiftText = `(Shift ${calculated.shiftCode} - ${calculated.shiftName})`;

  return [
    "🚗 Pengingat Waktu OTW!",
    "",
    `Halo${name}, hari ini kamu masuk kerja jam ${calculated.startTime} ${shiftText}.`,
    "",
    `🚗 Durasi perjalanan: ${calculated.travelDuration} menit`,
    "⏰ Saatnya berangkat sekarang!",
    "",
    "Hati-hati di jalan dan selamat beraktivitas! ✨",
  ].join("\n");
}

function formatReminderStatus(reminder, calculated) {
  if (!reminder) {
    if (calculated && (calculated.status === "OFF" || calculated.isOff)) {
      return "🏖️ Hari ini LIBUR. Tidak ada pengingat kerja yang aktif.";
    }

    if (calculated && calculated.status === "HALF_DAY" && !calculated.isConfigured) {
      return [
        "⏰ Status Pengingat Hari Ini",
        "",
        `📅 ${calculated.dateText}`,
        `Shift: ${calculated.shiftCode} - ${calculated.shiftName}`,
        "⚠️ Jam masuk belum ditentukan. Ketik /set-h untuk menentukan jam masuk.",
      ].join("\n");
    }

    return "Tidak ada pengingat kerja untuk hari ini.";
  }

  const lines = [
    "⏰ Status Pengingat Hari Ini",
    "",
    `📅 ${calculated.dateText}`,
    `Shift: ${calculated.shiftCode} - ${calculated.shiftName} (Masuk: ${calculated.startTime || "-"})`,
  ];

  if (calculated.otwTime) {
    lines.push(`🚗 Waktu OTW: ${calculated.otwTime} WIB`);
  }

  if (reminder.status === "PENDING") {
    lines.push("📌 Status: PENDING (Menunggu waktu pengiriman)");
  } else if (reminder.status === "SENT") {
    let sentTimeStr = "";
    if (reminder.sentAt) {
      const sentDate = new Date(reminder.sentAt);
      sentTimeStr = sentDate.toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "Asia/Jakarta",
      });
    }
    lines.push(`📌 Status: SUDAH TERKIRIM ${sentTimeStr ? `(pada ${sentTimeStr} WIB)` : ""}`);
  } else if (reminder.status === "FAILED") {
    lines.push("📌 Status: GAGAL TERKIRIM");
    if (reminder.errorMessage) {
      lines.push(`Catatan: ${reminder.errorMessage}`);
    }
  } else {
    lines.push(`📌 Status: ${reminder.status}`);
  }

  return lines.join("\n");
}

module.exports = {
  formatOtwReminderMessage,
  formatReminderStatus,
};
