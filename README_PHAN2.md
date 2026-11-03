# Phần 2 — Đồng hồ buổi tập và bài tập đã lưu

## File mới

| Đường dẫn                                    | Vai trò                                            |
| -------------------------------------------- | -------------------------------------------------- |
| src/features/session/useSessionStore.ts      | State và action của buổi tập bằng Zustand          |
| src/features/session/SessionBar.tsx          | Thanh cố định dưới mọi trang; quản lý một interval |
| src/features/session/CountdownBar.tsx        | Hiển thị số giây còn lại và tiến trình             |
| src/features/saved/useSavedStore.ts          | Danh sách id bài đã lưu, persist vào localStorage  |
| src/features/saved/SavedPage.tsx             | Trang /saved, bỏ lưu, Tập tất cả                   |
| src/features/session/useSessionStore.test.ts | Test action của session store                      |
| src/features/session/SessionBar.test.tsx     | Test đồng hồ, cleanup và render của kho bài tập    |
| src/features/saved/useSavedStore.test.ts     | Test toggle và persist/rehydrate                   |
| src/features/saved/SavedPage.test.tsx        | Test trang đã lưu và luồng đổi trang               |

## File đã sửa

| Đường dẫn                                 | Thay đổi                                                           |
| ----------------------------------------- | ------------------------------------------------------------------ |
| src/App.tsx                               | Gắn SavedPage và SessionBar ngoài Routes                           |
| src/features/library/LibraryPage.tsx      | Nối 3 nút vào store; theo dõi trạng thái lưu riêng từng dòng       |
| src/features/library/LibraryPage.test.tsx | Bổ sung test bắt đầu từ danh sách đang lọc                         |
| src/index.css                             | Thanh đồng hồ, bố cục màn nhỏ, khoảng trống cuối trang, sao đã lưu |
| README.md                                 | Cập nhật tiến độ Phần 2                                            |

ExerciseRow.tsx, dữ liệu, hook debounce và các cấu hình được dùng tiếp từ Phần 1.

## Đọc hiểu theo thứ tự

### 1. Store buổi tập

useSessionStore chứa dữ liệu dùng chung cho Kho bài tập, Đã lưu và thanh đồng hồ:

- queue: toàn bộ bài trong buổi tập, không chỉ các dòng đang hiển thị trong DOM.
- currentIndex: chỉ số bài đang tập, -1 nếu chưa bắt đầu.
- isRunning: đang chạy hay tạm dừng.
- elapsed: số giây đã tập của bài hiện tại.

Các action:

- startSession(exercises, startIndex): thay buổi tập, chọn bài và đặt elapsed=0, isRunning=true.
- addToSession(exercise): thêm cuối danh sách, bỏ qua nếu cùng id đã có. Thêm bài không tự khởi động.
- toggleRun(): tạm dừng/tiếp tục. Nếu mới thêm bài nhưng chưa bắt đầu, khởi động bài đầu. Nếu đã hết bài cuối, bắt đầu lại bài cuối từ 0.
- next(): chuyển bài kế, đặt elapsed=0. Ở bài cuối thì dừng đồng hồ.
- prev(): elapsed > 3 thì về đầu bài hiện tại; elapsed <= 3 thì lùi bài trước, hoặc giữ bài đầu.
- tick(): khi đang chạy, tăng 1 giây. Đủ duration thì gọi get().next().

set cập nhật state, get lấy state/action mới nhất. Không dùng useState cho đồng hồ ở App vì điều đó sẽ kéo các component con render lại mỗi giây.

### 2. Nối nút Bắt đầu

LibraryPage đã có filteredExercises từ Phần 1. Khi bấm Bắt đầu:

```ts
const index = filteredExercises.findIndex((item) => item.id === exercise.id);
startSession(filteredExercises, index);
```

Ví dụ tìm đẩy rồi bấm bài thứ 2: queue gồm 1250 bài có chữ Đẩy, currentIndex là 1. Bấm Sau sẽ chuyển sang bài thứ 3 trong chính danh sách đã lọc, không nhảy sang bài từ danh sách gốc.

Store chụp lại danh sách khi bắt đầu. Thay bộ lọc sau đó không tự thay đổi buổi tập đang chạy.

### 3. Một đồng hồ duy nhất

SessionBar được đặt ngoài Routes nên không unmount khi đổi trang. Effect chỉ tạo setInterval 1000ms khi isRunning=true. Khi tạm dừng hoặc unmount, cleanup gọi clearInterval.

CountdownBar đọc elapsed và thời lượng bài hiện tại. Thời gian còn lại = duration - elapsed, tiến trình = elapsed / duration \* 100. Dùng progress HTML để có cả giao diện và vai trò truy cập progressbar.

SessionBar lấy tên bài, số bài, trạng thái chạy và action qua các selector riêng. Không đọc elapsed. Vì thế mỗi giây thông thường chỉ CountdownBar nhận cập nhật. Chuyển bài thì tên bài và các vùng liên quan cập nhật theo.

### 4. Lưu yêu thích

useSavedStore có ids và toggle(id). Middleware persist ghi ids vào localStorage bằng key workout-saved. Khác với session, danh sách đã lưu tồn tại sau F5.

VirtualRow subscribe một boolean: bài của dòng này có trong ids hay không. Khi lưu e1, các dòng khác không nhận thay đổi boolean của chúng.

SavedPage chuyển danh sách id thành Exercise để hiển thị. Tập tất cả gọi startSession(exercises, 0). Bỏ lưu không xóa bài khỏi buổi tập đã bắt đầu.

## Tự kiểm tra trước khi commit

| Thao tác                           | Kết quả mong đợi                                            |
| ---------------------------------- | ----------------------------------------------------------- |
| Mới mở, chưa thêm/bắt đầu          | Chưa bắt đầu buổi tập, Buổi tập: 0 bài, nút điều khiển khóa |
| Bắt đầu e2                         | Kéo tạ đơn 1, Còn lại: 1:07, buổi tập 10000 bài             |
| Chờ 5 giây                         | Còn lại: 1:02                                               |
| Tạm dừng, chờ 3 giây               | Thời gian đứng yên                                          |
| Bắt đầu lại                        | Chạy tiếp thời gian còn lại                                 |
| Bấm Sau                            | Gập tạ đơn 1, Còn lại: 1:44                                 |
| Bắt đầu e1, chờ 30 giây            | Tự chuyển sang e2                                           |
| Bắt đầu e2, sau 4 giây bấm Trước   | Vẫn e2 nhưng thời gian về 1:07                              |
| Ngay sau đó bấm Trước              | Về e1                                                       |
| Tìm đẩy, Bắt đầu dòng đầu, bấm Sau | Bài kế tiếp vẫn có chữ Đẩy                                  |
| Bấm + Buổi tập hai lần cùng bài    | Chỉ thêm một lần                                            |
| Lưu e1, e3; mở Đã lưu; F5          | Vẫn có hai bài đã lưu                                       |
| Ở Đã lưu bấm Tập tất cả            | Buổi tập 2 bài, bắt đầu e1                                  |
| Đổi trang khi đang tập             | Đồng hồ vẫn chạy                                            |
| Hết bài cuối                       | Dừng ở Còn lại: 0:00                                        |

Dùng React DevTools > Highlight updates để xem vùng nào render khi đồng hồ chạy. Kho bài tập và nút điều khiển không nhấp nháy mỗi giây. Khi tự chuyển bài hoặc bấm điều khiển, các vùng liên quan được cập nhật là bình thường.

Session không persist theo đề, vì vậy F5 dừng buổi tập hiện tại. Chỉ bài đã lưu được giữ lại.

## Kiểm tra và commit

Mở terminal thứ hai tại thư mục repo:

```powershell
npm run build
npm test
git diff --stat
git add .
git commit -m "Phan 2"
git push
```

Bản này có 32 test trong 9 file, gồm cả test Phần 1. Đây vẫn chưa phải bài nộp cuối: Phần 3 còn giáo án, theme, lazy load; Phần 4 còn test reducer/form và coverage.png.
