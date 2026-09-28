const {
  setPendingSchedule,
  getPendingSchedule,
  clearPendingSchedule,
} = require("../src/services/pending-weekly-schedule.service");

console.log("=================================");
console.log(" PENDING WEEKLY SCHEDULE TEST");
console.log("=================================\n");

let testPassed = true;

function assert(condition, message) {
  if (!condition) {
    console.log(`[FAIL] ${message}`);
    testPassed = false;
    return;
  }

  console.log(`[PASS] ${message}`);
}

// =================================
// TEST DATA
// =================================

const userA = "test-user-A";
const userB = "test-user-B";

const draftA = {
  referenceDate: "2026-09-23",
  schedules: [
    {
      day: "Senin",
      date: "2026-09-21",
      shiftCode: "M1",
      shiftId: "shift-m1",
    },
    {
      day: "Selasa",
      date: "2026-09-22",
      shiftCode: "M2",
      shiftId: "shift-m2",
    },
  ],
};

const draftB = {
  referenceDate: "2026-09-23",
  schedules: [
    {
      day: "Senin",
      date: "2026-09-21",
      shiftCode: "O",
      shiftId: "shift-o",
    },
    {
      day: "Selasa",
      date: "2026-09-22",
      shiftCode: "X",
      shiftId: "shift-x",
    },
  ],
};

// =================================
// 1. User belum memiliki draft
// =================================

console.log("1. Test pending schedule belum tersedia\n");

const initialUserA = getPendingSchedule(userA);

assert(initialUserA === null, "User A belum memiliki pending schedule");

console.log("");

// =================================
// 2. Simpan draft User A
// =================================

console.log("2. Test menyimpan draft User A\n");

setPendingSchedule(userA, draftA);

const storedDraftA = getPendingSchedule(userA);

assert(
  storedDraftA === draftA,
  "Draft User A berhasil disimpan dan diambil kembali",
);

assert(
  storedDraftA.referenceDate === "2026-09-23",
  "Reference date User A sesuai",
);

assert(storedDraftA.schedules.length === 2, "Jumlah schedule User A sesuai");

console.log("");

// =================================
// 3. Simpan draft User B
// =================================

console.log("3. Test isolasi draft User A dan User B\n");

setPendingSchedule(userB, draftB);

const storedDraftB = getPendingSchedule(userB);

assert(storedDraftB === draftB, "Draft User B berhasil disimpan");

assert(
  getPendingSchedule(userA) === draftA,
  "Draft User A tidak tertukar dengan User B",
);

assert(
  getPendingSchedule(userB) === draftB,
  "Draft User B tidak tertukar dengan User A",
);

assert(
  getPendingSchedule(userA).schedules[0].shiftCode === "M1",
  "Shift User A tetap M1",
);

assert(
  getPendingSchedule(userB).schedules[0].shiftCode === "O",
  "Shift User B tetap O",
);

console.log("");

// =================================
// 4. Clear draft User A
// =================================

console.log("4. Test clear pending schedule User A\n");

clearPendingSchedule(userA);

const clearedUserA = getPendingSchedule(userA);

assert(clearedUserA === null, "Pending schedule User A berhasil dihapus");

assert(
  getPendingSchedule(userB) === draftB,
  "Draft User B tetap tersedia setelah User A dihapus",
);

console.log("");

// =================================
// 5. Clear draft User B
// =================================

console.log("5. Test clear pending schedule User B\n");

clearPendingSchedule(userB);

const clearedUserB = getPendingSchedule(userB);

assert(clearedUserB === null, "Pending schedule User B berhasil dihapus");

console.log("");

// =================================
// 6. Test invalid userId
// =================================

console.log("6. Test invalid userId\n");

try {
  setPendingSchedule(null, draftA);

  console.log("[FAIL] setPendingSchedule seharusnya menolak userId kosong");

  testPassed = false;
} catch (error) {
  console.log(
    `[PASS] setPendingSchedule menolak userId kosong: ${error.message}`,
  );
}

try {
  getPendingSchedule(null);

  console.log("[FAIL] getPendingSchedule seharusnya menolak userId kosong");

  testPassed = false;
} catch (error) {
  console.log(
    `[PASS] getPendingSchedule menolak userId kosong: ${error.message}`,
  );
}

try {
  clearPendingSchedule(null);

  console.log("[FAIL] clearPendingSchedule seharusnya menolak userId kosong");

  testPassed = false;
} catch (error) {
  console.log(
    `[PASS] clearPendingSchedule menolak userId kosong: ${error.message}`,
  );
}

console.log("");

// =================================
// 7. Test invalid draft
// =================================

console.log("7. Test invalid draft\n");

try {
  setPendingSchedule("test-invalid-draft", null);

  console.log("[FAIL] Draft null seharusnya ditolak");

  testPassed = false;
} catch (error) {
  console.log(`[PASS] Draft null ditolak: ${error.message}`);
}

try {
  setPendingSchedule("test-invalid-draft-2", {
    referenceDate: "2026-09-23",
  });

  console.log("[FAIL] Draft tanpa schedules seharusnya ditolak");

  testPassed = false;
} catch (error) {
  console.log(`[PASS] Draft tanpa schedules ditolak: ${error.message}`);
}

console.log("");

// =================================
// RESULT
// =================================

console.log("=================================");

if (testPassed) {
  console.log("TEST RESULT: PASS");
} else {
  console.log("TEST RESULT: FAIL");
  process.exitCode = 1;
}

console.log("=================================");
